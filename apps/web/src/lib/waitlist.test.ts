import { describe, expect, it } from "vitest";

import { visibleWaitlistCount } from "./waitlist";

describe("visibleWaitlistCount", () => {
  it("hides counts below the visibility threshold", () => {
    expect(visibleWaitlistCount(24)).toBeNull();
  });

  it("shows counts at and above the visibility threshold", () => {
    expect(visibleWaitlistCount(25)).toBe(25);
    expect(visibleWaitlistCount(26)).toBe(26);
  });

  it("hides unavailable counts", () => {
    expect(visibleWaitlistCount(null)).toBeNull();
  });
});
