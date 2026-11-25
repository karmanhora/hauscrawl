import { describe, expect, it } from "vitest";

import { createReferralCode, waitlistShareUrl } from "../services/waitlist";
import {
  waitlistReferralCodeSchema,
  waitlistSignupSchema,
} from "./waitlist";

describe("waitlistSignupSchema", () => {
  it("normalizes a valid signup", () => {
    const result = waitlistSignupSchema.safeParse({
      email: "  HomeHunter@Example.com ",
      role: "actively_looking",
      searchingWith: "partner",
      region: "Seattle",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("homehunter@example.com");
      expect(result.data.role).toBe("actively_looking");
      expect(result.data.searchingWith).toBe("partner");
      expect(result.data.region).toBe("Seattle");
    }
  });

  it("accepts only an email", () => {
    const result = waitlistSignupSchema.safeParse({ email: "a@example.com" });
    expect(result.success).toBe(true);
  });

  it.each(["searching", "agent"])("accepts the optional %s intake role", (intakeRole) => {
    expect(waitlistSignupSchema.safeParse({ email: "a@example.com", intakeRole }).success).toBe(true);
  });

  it("rejects unsupported intake roles", () => {
    expect(waitlistSignupSchema.safeParse({ email: "a@example.com", intakeRole: "broker" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(waitlistSignupSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("rejects unknown role and searching values", () => {
    const result = waitlistSignupSchema.safeParse({
      email: "a@example.com",
      role: "landlord",
      searchingWith: "dog",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an oversized region and newlines", () => {
    expect(
      waitlistSignupSchema.safeParse({ email: "a@example.com", region: "x".repeat(81) }).success,
    ).toBe(false);
    expect(
      waitlistSignupSchema.safeParse({ email: "a@example.com", region: "Seattle\nWA" }).success,
    ).toBe(false);
  });

  it("normalizes an empty region to undefined", () => {
    const result = waitlistSignupSchema.safeParse({ email: "a@example.com", region: "   " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.region).toBeUndefined();
  });

  it("accepts only a ten-character lowercase referral code", () => {
    expect(waitlistReferralCodeSchema.safeParse("abcdefghij").success).toBe(true);
    expect(waitlistReferralCodeSchema.safeParse("ABC123").success).toBe(false);
    expect(waitlistReferralCodeSchema.safeParse("").success).toBe(false);
  });
});

describe("createReferralCode", () => {
  it("returns ten characters from the expected alphabet", () => {
    const code = createReferralCode(() => new Uint8Array(10));
    expect(code).toBe("aaaaaaaaaa");
    expect(code).toMatch(/^[a-z0-9]{10}$/);
  });

  it("maps the byte range without changing length", () => {
    const code = createReferralCode(() => new Uint8Array(10).fill(255));
    expect(code).toBe("zzzzzzzzzz");
  });

  it("builds a share URL with the referral code", () => {
    expect(waitlistShareUrl("https://hauscrawl.example", "abcdefghij")).toBe(
      "https://hauscrawl.example/?ref=abcdefghij",
    );
  });
});
