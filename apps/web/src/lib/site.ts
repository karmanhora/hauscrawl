/**
 * Small, server-safe site configuration helpers. These values are read at
 * runtime, so the same build can run in preview and production.
 */
export const SITE_NAME = "HausCrawl";
export const SITE_DESCRIPTION =
  "Swipe through illustrative home reels, save what you love, and decide together in a private shortlist. Join the nationwide HausCrawl early-access waitlist.";

export function isWaitlistOnly(): boolean {
  return process.env.WAITLIST_ONLY === "true";
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  return (configured && configured.length > 0 ? configured : "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "privacy@example.com";
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
