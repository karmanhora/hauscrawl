import { randomUUID } from "node:crypto";

import {
  isUuid,
  WAITLIST_IP_HASH_PATTERN,
  WAITLIST_STATUS_CODE_PATTERN,
  waitlistSignupSchema,
} from "@hauscrawl/core";
import { NextResponse } from "next/server";

import { createWaitlistAdminClient, ensureWaitlistAuthUser } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isMissingAuthUserIdColumnError } from "@/lib/waitlist-errors";
import {
  createUnsubscribeToken,
  createWaitlistConfirmationToken,
  getClientIp,
  hashIp,
  hashUnsubscribeToken,
  sendWaitlistConfirmationEmail,
  sendWaitlistStatusEmail,
  waitlistEmailReady,
} from "@/lib/waitlist-server";
import { createWaitlistSurveyToken } from "@/lib/waitlist-survey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8_192;
const NO_STORE = { "Cache-Control": "no-store" };

type SignupResult = {
  ok?: boolean;
  is_new?: boolean;
  signup_id?: string;
  status_code?: string;
  referral_code?: string;
};

type ValidSignupResult = {
  ok: true;
  is_new: boolean;
  signup_id: string;
  status_code: string;
  referral_code: string;
};

type SignupArgs = {
  p_email: string;
  p_role: string | null;
  p_intake_role: "searching" | "agent" | null;
  p_searching_with: string | null;
  p_region: string | null;
  p_utm_source: string | null;
  p_utm_medium: string | null;
  p_utm_campaign: string | null;
  p_referrer: string | null;
  p_referral_code: string | null;
  p_ip_hash: string;
  p_unsubscribe_token_hash: string | null;
};

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status, headers: NO_STORE });
}

function successResponse(emailConfigured: boolean, surveyRef: string | null = null) {
  return NextResponse.json(
    {
      ok: true,
      // A capability flag, not a delivery result. It is the same for new and
      // duplicate submissions and never reveals whether the address existed.
      emailConfigured,
      // An opaque, expiring reference that can only write untrusted staged
      // survey answers. It is issued for new and duplicate emails alike, is
      // not the status code or the confirmation token, and never reads data.
      ...(surveyRef ? { surveyRef } : {}),
    },
    { headers: NO_STORE },
  );
}

function readString(body: Record<string, unknown>, key: string): string | undefined {
  const value = body[key];
  return typeof value === "string" ? value : undefined;
}

function resolveSiteUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (configured && configured.length > 0 ? configured : new URL(request.url).origin).replace(
    /\/$/,
    "",
  );
}

function parseSignup(body: Record<string, unknown>) {
  return waitlistSignupSchema.safeParse({
    email: readString(body, "email"),
    role: readString(body, "role") || undefined,
    intakeRole: readString(body, "intakeRole") || undefined,
    searchingWith: readString(body, "searchingWith") || undefined,
    region: readString(body, "region") || undefined,
    utmSource: readString(body, "utmSource") || undefined,
    utmMedium: readString(body, "utmMedium") || undefined,
    utmCampaign: readString(body, "utmCampaign") || undefined,
    referrer: readString(body, "referrer") || undefined,
    ref: readString(body, "ref") || undefined,
  });
}

function readAdminResult(value: unknown): ValidSignupResult | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const result = value as SignupResult;

  if (
    result.ok !== true ||
    typeof result.is_new !== "boolean" ||
    typeof result.signup_id !== "string" ||
    !isUuid(result.signup_id) ||
    typeof result.status_code !== "string" ||
    !WAITLIST_STATUS_CODE_PATTERN.test(result.status_code) ||
    typeof result.referral_code !== "string"
  ) {
    return null;
  }

  return result as ValidSignupResult;
}

async function sendDeliveryEmail({
  result,
  email,
  siteUrl,
  surveySessionId,
}: {
  result: ValidSignupResult;
  email: string;
  siteUrl: string;
  surveySessionId: string;
}): Promise<boolean> {
  const unsubscribeToken = createUnsubscribeToken(email);
  const unsubscribeUrl = unsubscribeToken ? new URL("/unsubscribe", `${siteUrl}/`) : null;
  if (unsubscribeUrl && unsubscribeToken) {
    unsubscribeUrl.searchParams.set("token", unsubscribeToken);
  }

  if (!result.status_code) return false;

  if (result.is_new) {
    if (!result.signup_id) return false;
    const confirmationToken = createWaitlistConfirmationToken(
      result.signup_id,
      surveySessionId,
    );
    if (!confirmationToken) {
      console.warn(
        "[waitlist] confirmation signing is not configured; position and referral UI are disabled.",
      );
      return false;
    }

    const confirmUrl = new URL("/waitlist/confirm", `${siteUrl}/`);
    confirmUrl.searchParams.set("token", confirmationToken);

    return sendWaitlistConfirmationEmail({
      to: email,
      confirmUrl: confirmUrl.toString(),
      unsubscribeUrl: unsubscribeUrl?.toString() ?? null,
    });
  }

  const statusUrl = new URL(`/waitlist/status/${result.status_code}`, `${siteUrl}/`);
  return sendWaitlistStatusEmail({
    to: email,
    statusUrl: statusUrl.toString(),
    unsubscribeUrl: unsubscribeUrl?.toString() ?? null,
  });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return jsonError(413, "That request is too large.");
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return jsonError(400, "Check your details and try again.");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return jsonError(400, "Check your details and try again.");
  }

  const siteUrl = resolveSiteUrl(request);

  // A filled hidden field means a bot. Return the normal success shape without
  // writing anything, so the bot has no signal that it was caught.
  const honeypot = readString(body, "website");
  if (honeypot && honeypot.trim().length > 0) {
    return successResponse(false);
  }

  const parsed = parseSignup(body);
  if (!parsed.success) {
    return jsonError(400, "Enter a valid email address and try again.");
  }

  const input = parsed.data;

  let ipHash: string;
  try {
    ipHash = hashIp(getClientIp(request.headers));
  } catch {
    console.error("[waitlist] IP hashing is not configured.");
    return jsonError(503, "The waitlist is temporarily unavailable. Try again later.");
  }

  if (!WAITLIST_IP_HASH_PATTERN.test(ipHash)) {
    return jsonError(500, "The waitlist is temporarily unavailable. Try again later.");
  }

  const unsubscribeToken = createUnsubscribeToken(input.email);
  const unsubscribeHash = unsubscribeToken ? hashUnsubscribeToken(unsubscribeToken) : null;

  const args: SignupArgs = {
    p_email: input.email,
    p_role: input.role ?? null,
    p_intake_role: input.intakeRole ?? null,
    p_searching_with: input.searchingWith ?? null,
    p_region: input.region ?? null,
    p_utm_source: input.utmSource ?? null,
    p_utm_medium: input.utmMedium ?? null,
    p_utm_campaign: input.utmCampaign ?? null,
    p_referrer: input.referrer ?? null,
    p_referral_code: input.ref ?? null,
    p_ip_hash: ipHash,
    p_unsubscribe_token_hash: unsubscribeHash,
  };

  // One session per submission. It travels in the confirmation link and in the
  // survey reference, so only the browser that signed up can have its staged
  // answers promoted later.
  const surveySessionId = randomUUID();
  let surveyRef: string | null = null;

  const admin = createWaitlistAdminClient();
  let adminResult: ValidSignupResult | null = null;

  if (admin) {
    const { data, error } = await admin.rpc("join_waitlist_admin", args);

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("rate_limited")) {
        return jsonError(429, "Too many signups from this connection. Try again later.");
      }
      if (message.includes("invalid_input")) {
        return jsonError(400, "Check your email and try again.");
      }

      console.error("[waitlist] admin join failed:", error.code ?? "unknown");
      return jsonError(500, "We couldn't add you just now. Try again.");
    }

    adminResult = readAdminResult(data);
    if (!adminResult) {
      console.error("[waitlist] admin join returned an unexpected result.");
      return jsonError(500, "We couldn't add you just now. Try again.");
    }

    // Authentication → Users is the owner-facing waitlist view. Keep this
    // idempotent because duplicate waitlist submissions also arrive here.
    const authUser = await ensureWaitlistAuthUser(admin, {
      email: input.email,
      signupId: adminResult.signup_id,
    });
    if (authUser.status === "failed") {
      return jsonError(500, "We couldn't finish adding you. Try again.");
    }

    const { error: linkError } = await admin
      .from("waitlist_signups")
      .update({ auth_user_id: authUser.userId })
      .eq("id", adminResult.signup_id);
    if (linkError) {
      if (!isMissingAuthUserIdColumnError(linkError)) {
        console.error("[waitlist] auth user link failed:", linkError.code ?? "unknown");
        return jsonError(500, "We couldn't finish adding you. Try again.");
      }

      // Deploying code ahead of the migration must not take the waitlist down.
      // The Auth user exists; the explicit backfill will link it after the
      // column is applied, and recovery can still verify the address.
      console.error(
        "[waitlist] auth_user_id column is missing; apply 20261118120000_waitlist_auth_users.sql and rerun the backfill.",
      );
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[waitlist] SUPABASE_SERVICE_ROLE_KEY is required in production for Auth user mirroring.",
      );
      return jsonError(503, "The waitlist is temporarily unavailable. Try again later.");
    }

    console.warn(
      "[waitlist] SUPABASE_SERVICE_ROLE_KEY is not configured; development fallback is active, but Auth mirroring, double opt-in, positions and referrals are disabled.",
    );

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("join_waitlist", args);

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("rate_limited")) {
        return jsonError(429, "Too many signups from this connection. Try again later.");
      }
      if (message.includes("invalid_input")) {
        return jsonError(400, "Check your email and try again.");
      }

      console.error("[waitlist] join failed:", error.code ?? "unknown");
      return jsonError(500, "We couldn't add you just now. Try again.");
    }

    if (!data || typeof data !== "object" || (data as { ok?: unknown }).ok !== true) {
      console.error("[waitlist] join returned an unexpected result.");
      return jsonError(500, "We couldn't add you just now. Try again.");
    }
  }

  let emailConfigured = false;
  if (adminResult) {
    surveyRef = createWaitlistSurveyToken({
      signupId: adminResult.signup_id,
      sessionId: surveySessionId,
      audience: "survey-stage",
    });

    emailConfigured = await waitlistEmailReady();
    if (emailConfigured) {
      await sendDeliveryEmail({
        result: adminResult,
        email: input.email,
        siteUrl,
        surveySessionId,
      });
    }
  }

  return successResponse(emailConfigured, surveyRef);
}
