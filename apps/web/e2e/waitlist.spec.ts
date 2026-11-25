import { createHmac } from "node:crypto";

import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

// Keep local runs below the per-IP database limit; production still sees the
// real forwarded address.
const testIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
const confirmationSecret = "HausCrawl-e2e-confirmation-secret";

test.use({
  extraHTTPHeaders: { "x-forwarded-for": testIp },
});

function randomCode(length: number) {
  return Array.from({ length }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
}

function confirmationToken(signupId: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: signupId, exp: Math.floor(Date.now() / 1000) + 3_600 }),
  ).toString("base64url");
  const signature = createHmac("sha256", confirmationSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

const serviceUrl = process.env.SUPABASE_TEST_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
const admin =
  serviceUrl && serviceKey
    ? createClient(serviceUrl, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

test("saves the email, then stages survey answers without touching canonical fields", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /swipe through homes. decide together./i }),
  ).toBeVisible();

  const email = `waitlist.e2e.${Date.now()}@gmail.com`;
  const hero = page.locator("#join");
  await hero.getByLabel("Email address").fill(email);
  await hero.getByRole("button", { name: "Join the waitlist" }).click();

  // A successful save navigates straight to the survey; there is no role field
  // left on the landing form.
  await expect(page).toHaveURL(/\/waitlist\/survey\?ref=/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Actively looking" })).toBeVisible();

  await page.getByRole("radio", { name: "Actively looking" }).check();
  await page.getByLabel("What's your timeline?").selectOption("next_3_months");
  await page.getByLabel("City or region", { exact: true }).fill("Seattle");
  await page.getByRole("button", { name: "Save my answers" }).click();

  await expect(page.getByRole("heading", { level: 2 })).toContainText("Thank you");

  if (admin) {
    const { data: authUsers, error: authError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    expect(authError).toBeNull();
    const authUser = authUsers.users.find((user) => user.email === email);
    expect(authUser).toBeTruthy();

    const { data: signup, error: signupError } = await admin
      .from("waitlist_signups")
      .select("id, role, searching_with, region, auth_user_id")
      .eq("email", email)
      .maybeSingle();
    expect(signupError).toBeNull();
    expect(signup?.auth_user_id).toBe(authUser?.id);

    // Anonymous survey answers must stay staged: the canonical signup columns
    // are untouched until the emailed confirmation promotes them.
    expect(signup?.role).toBeNull();
    expect(signup?.searching_with).toBeNull();
    expect(signup?.region).toBeNull();

    const { data: survey, error: surveyError } = await admin
      .from("waitlist_survey_responses")
      .select("answers_status, role, region, timeline")
      .eq("signup_id", signup?.id ?? "")
      .maybeSingle();
    expect(surveyError).toBeNull();
    expect(survey?.answers_status).toBe("staged");
    expect(survey?.role).toBe("actively_looking");
    expect(survey?.region).toBe("Seattle");
    expect(survey?.timeline).toBe("next_3_months");
  }
});

test("lets the survey be skipped without losing the signup", async ({ page }) => {
  await page.goto("/");

  const hero = page.locator("#join");
  await hero.getByLabel("Email address").fill(`waitlist.skip.${Date.now()}@gmail.com`);
  await hero.getByRole("button", { name: "Join the waitlist" }).click();

  await expect(page).toHaveURL(/\/waitlist\/survey\?ref=/);
  await page.getByRole("button", { name: "Skip for now" }).click();

  await expect(page.getByRole("heading", { level: 2 })).toContainText("That's alright.");
});

test("rejects a survey link the app did not issue", async ({ page }) => {
  await page.goto("/waitlist/survey?ref=not-a-real-token");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't ready");
});

test("silently accepts a honeypot-filled submission", async ({ page }) => {
  await page.goto("/");

  const hero = page.locator("#join");
  await hero.getByLabel("Email address").fill(`waitlist.honeypot.${Date.now()}@gmail.com`);
  await page.locator("#hero-website").evaluate((element) => {
    (element as HTMLInputElement).value = "https://spam.example";
  });

  await hero.getByRole("button", { name: "Join the waitlist" }).click();

  // The bot gets the normal success shape, the route writes nothing, and there
  // is no survey reference to navigate with.
  await expect(page.getByText("You're on the list.")).toBeVisible();
});

test("waitlist-only mode keeps the public waitlist pages reachable", async ({ page }) => {
  await page.goto("/explore?sort=newest");
  await expect(page).toHaveURL("http://127.0.0.1:3101/");

  await page.goto("/sign-in");
  await expect(page).toHaveURL("http://127.0.0.1:3101/");

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();

  await page.goto("/terms");
  await expect(page.getByRole("heading", { level: 1, name: "Terms" })).toBeVisible();

  await page.goto("/waitlist/how-it-works");
  await expect(
    page.getByRole("heading", { level: 1, name: "How the waitlist works." }),
  ).toBeVisible();

  await page.goto("/waitlist/survey");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't ready");
});

test("confirmation and a confirmed referral move the first person up five spots", async ({
  page,
}) => {
  test.skip(
    !admin,
    "Set SUPABASE_TEST_URL / NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to exercise confirmation and referrals.",
  );
  if (!admin) return;

  const runId = Date.now().toString();
  const seedIp = randomCode(64);
  const seedStart = Date.now() - 60_000;

  // Six confirmed people ahead of the test signup make a five-spot move
  // observable without exposing any other user's data.
  for (let index = 0; index < 6; index += 1) {
    const result = await admin.from("waitlist_signups").insert({
      email: `waitlist.seed.${runId}.${index}@gmail.com`,
      referral_code: randomCode(10),
      status_code: randomCode(24),
      ip_hash: seedIp,
      email_confirmed_at: new Date(seedStart + index * 1_000).toISOString(),
    });
    if (result.error) throw new Error(`seed signup failed: ${result.error.message}`);
  }

  const firstEmail = `waitlist.referrer.${runId}@gmail.com`;
  const secondEmail = `waitlist.referred.${runId}@gmail.com`;

  await page.goto("/");
  const hero = page.locator("#join");
  await hero.getByLabel("Email address").fill(firstEmail);
  await hero.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page).toHaveURL(/\/waitlist\/survey\?ref=/);
  await expect(page.getByLabel("Your referral link")).toHaveCount(0);

  const firstRow = await admin
    .from("waitlist_signups")
    .select("id, status_code")
    .eq("email", firstEmail)
    .single();
  if (firstRow.error || !firstRow.data) {
    throw new Error(`could not find the first signup: ${firstRow.error?.message ?? "missing"}`);
  }

  await page.goto(
    `/waitlist/confirm?token=${encodeURIComponent(confirmationToken(firstRow.data.id))}`,
  );
  await expect(page).toHaveURL(new RegExp(`/waitlist/status/${firstRow.data.status_code}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("You're #7");

  const shareUrl = await page.getByLabel("Your referral link").inputValue();
  expect(shareUrl).toContain("/?ref=");
  await expect(page.getByTestId("waitlist-referral-count")).toHaveText("0");
  await expect(page.getByTestId("waitlist-spots-gained")).toHaveText("0");

  // An unconfirmed referral does not change the first person's place.
  await page.goto(shareUrl);
  const referralForm = page.locator("#join");
  await referralForm.getByLabel("Email address").fill(secondEmail);
  await referralForm.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page).toHaveURL(/\/waitlist\/survey\?ref=/);

  await page.goto(`/waitlist/status/${firstRow.data.status_code}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("You're #7");
  await expect(page.getByTestId("waitlist-referral-count")).toHaveText("0");

  const secondRow = await admin
    .from("waitlist_signups")
    .select("id, status_code")
    .eq("email", secondEmail)
    .single();
  if (secondRow.error || !secondRow.data) {
    throw new Error(`could not find the referred signup: ${secondRow.error?.message ?? "missing"}`);
  }

  await page.goto(
    `/waitlist/confirm?token=${encodeURIComponent(confirmationToken(secondRow.data.id))}`,
  );
  await expect(page).toHaveURL(new RegExp(`/waitlist/status/${secondRow.data.status_code}$`));

  await page.goto(`/waitlist/status/${firstRow.data.status_code}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("You're #2");
  await expect(page.getByTestId("waitlist-referral-count")).toHaveText("1");
  await expect(page.getByTestId("waitlist-spots-gained")).toHaveText("5");

  // The status page is private and carries the required headers.
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");

  // The verified owner's survey link comes from the status page and works.
  await page.getByRole("link", { name: "Answer a few questions" }).click();
  await expect(page).toHaveURL(/\/waitlist\/survey\?ref=/);
  await page.getByRole("radio", { name: "Just browsing" }).check();
  await page.getByRole("button", { name: "Update my answers" }).click();
  await expect(page.getByRole("heading", { level: 2 })).toContainText("Thank you");

  const verified = await admin
    .from("waitlist_survey_responses")
    .select("answers_status, role, verified_via")
    .eq("signup_id", firstRow.data.id)
    .maybeSingle();
  expect(verified.data?.answers_status).toBe("verified");
  expect(verified.data?.role).toBe("just_browsing");
  expect(verified.data?.verified_via).toBe("status_page");
});
