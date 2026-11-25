import { defineConfig, devices } from "@playwright/test";

const inheritedEnv = Object.fromEntries(
  Object.entries(process.env).filter((entry): entry is [string, string] => {
    return typeof entry[1] === "string";
  }),
);

/**
 * Runs the waitlist landing page with WAITLIST_ONLY enabled on a separate port,
 * so it cannot reuse the full-app dev server from the main Playwright config.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["waitlist.spec.ts", "landing-mockup.spec.ts", "swipe-demo.spec.ts"],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://127.0.0.1:3101",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm dev --port 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...inheritedEnv,
      WAITLIST_ONLY: "true",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3101",
      WAITLIST_EMAIL_ENABLED: "false",
      WAITLIST_CONFIRMATION_SECRET: "HausCrawl-e2e-confirmation-secret",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
