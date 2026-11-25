"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { CheckIcon } from "@/components/ui/icons";
import { trackWaitlistEvent } from "@/lib/waitlist-analytics";

type WaitlistFormProps = {
  idPrefix: string;
  eyebrow?: string;
  trackPageView?: boolean;
  surface?: "plain" | "card";
  layout?: "inline" | "stacked";
  buttonVariant?: "moss" | "primary" | "cream";
};

type SuccessState = {
  emailConfigured: boolean;
};

type SourceState = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  ref?: string;
};

function readSource(): SourceState {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref")?.trim().toLowerCase();

  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    referrer: document.referrer || undefined,
    ref: ref && /^[a-z0-9]{10}$/.test(ref) ? ref : undefined,
  };
}

/**
 * Step one of the waitlist: email only. A successful save navigates straight to
 * the survey with an opaque, scoped survey reference; the success card below is
 * only the fallback for honeypot and degraded paths that have no reference.
 */
export function WaitlistForm({
  idPrefix,
  eyebrow,
  trackPageView = false,
  surface = "card",
  layout = "stacked",
  buttonVariant = "moss",
}: WaitlistFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [source] = useState<SourceState>(() => (typeof window === "undefined" ? {} : readSource()));
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const started = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (trackPageView) trackWaitlistEvent("waitlist_page_view");
  }, [trackPageView]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackWaitlistEvent("waitlist_form_start", { form: idPrefix });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    setError(null);
    const normalizedEmail = email.trim();
    if (
      normalizedEmail.length === 0 ||
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setError("Enter a valid email address and try again.");
      return;
    }

    trackWaitlistEvent("waitlist_form_submit", { form: idPrefix });
    setStatus("submitting");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          ref: source.ref,
          utmSource: source.utmSource,
          utmMedium: source.utmMedium,
          utmCampaign: source.utmCampaign,
          referrer: source.referrer,
          website: honeypotRef.current?.value ?? "",
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        emailConfigured?: boolean;
        surveyRef?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        setError(
          response.status === 429
            ? "Too many signups from this connection. Try again in a few minutes."
            : (payload?.message ?? "We couldn't add you just now. Try again."),
        );
        setStatus("idle");
        return;
      }

      trackWaitlistEvent("waitlist_success", { form: idPrefix });

      if (payload?.surveyRef) {
        router.push(`/waitlist/survey?ref=${encodeURIComponent(payload.surveyRef)}`);
        return;
      }

      setSuccess({ emailConfigured: payload?.emailConfigured === true });
      setStatus("success");
    } catch {
      setError("We couldn't add you just now. Check your connection and try again.");
      setStatus("idle");
    }
  }

  if (success) {
    return (
      <div className="rounded-[1.6rem] border border-line bg-cream p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss-soft text-moss">
            <CheckIcon size={18} />
          </span>
          <p
            className="text-lg font-medium tracking-[-0.02em] text-ink"
            role="status"
            aria-live="polite"
          >
            {success.emailConfigured ? "Check your email." : "You're on the list."}
          </p>
        </div>

        <p className="mt-4 text-body-sm leading-relaxed text-stone">
          {success.emailConfigured
            ? "Confirm your email to join the queue and get your private status page. Check your inbox for the link."
            : "We'll email you when nationwide early access opens. No noise in the meantime."}
        </p>

        <p className="mt-5 text-caption leading-relaxed text-stone">
          <a href="/waitlist/how-it-works" className="underline underline-offset-2 hover:text-ink">
            How the waitlist works
          </a>{" "}
          ·{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy
          </a>
        </p>
      </div>
    );
  }

  const formSurface =
    surface === "plain"
      ? "relative"
      : "relative rounded-[1.75rem] border border-line/80 bg-cream p-5 shadow-soft sm:p-7";

  const emailField = (
    <Field
      label="Email address"
      name={`${idPrefix}-email`}
      type="email"
      required
      autoComplete="email"
      inputMode="email"
      placeholder="you@example.com"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      maxLength={254}
      error={error ?? undefined}
    />
  );

  const submitButton = (
    <Button
      type="submit"
      size="lg"
      variant={buttonVariant}
      loading={status === "submitting"}
      className={layout === "inline" ? "w-full sm:w-auto" : "w-full"}
    >
      {status === "submitting" ? "Joining…" : "Join the waitlist"}
    </Button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={markStarted}
      className={formSurface}
      noValidate
    >
      {eyebrow ? (
        <p className="text-[10px] font-semibold tracking-[0.18em] text-stone uppercase">{eyebrow}</p>
      ) : null}

      {layout === "inline" ? (
        <div className={eyebrow ? "mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end" : "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"}>
          {emailField}
          {submitButton}
        </div>
      ) : (
        <div className={eyebrow ? "mt-4" : ""}>
          {emailField}
          <div className="mt-5">{submitButton}</div>
        </div>
      )}

      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${idPrefix}-website`}>Company website</label>
        <input
          ref={honeypotRef}
          id={`${idPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <p
        className={`mt-4 text-caption leading-relaxed text-stone ${
          surface === "plain" ? "text-left" : "text-center"
        }`}
      >
        Only waitlist updates. No spam, no selling your email.{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy
        </a>
        <br />
        <a href="/waitlist/how-it-works" className="underline underline-offset-2 hover:text-ink">
          How the waitlist works
        </a>
      </p>
    </form>
  );
}
