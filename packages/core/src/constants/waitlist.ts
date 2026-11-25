/** Waitlist contracts shared by the form, API route and database checks. */

export const WAITLIST_EMAIL_MAX_LENGTH = 254;
export const WAITLIST_REGION_MAX_LENGTH = 80;
export const WAITLIST_UTM_MAX_LENGTH = 200;
export const WAITLIST_REFERRER_MAX_LENGTH = 500;
export const WAITLIST_REFERRAL_CODE_LENGTH = 10;
export const WAITLIST_REFERRAL_CODE_PATTERN = /^[a-z0-9]{10}$/;
export const WAITLIST_COUNTER_MIN = 25;
export const WAITLIST_COUNT_VISIBILITY_THRESHOLD = WAITLIST_COUNTER_MIN;
export const WAITLIST_IP_HASH_PATTERN = /^[0-9a-f]{64}$/;
export const WAITLIST_REFERRAL_BONUS_SPOTS = 5;
export const WAITLIST_MAX_CREDITED_REFERRALS = 10;
export const WAITLIST_MAX_SPOTS_GAINED =
  WAITLIST_REFERRAL_BONUS_SPOTS * WAITLIST_MAX_CREDITED_REFERRALS;
export const WAITLIST_MAX_REFERRALS_PER_IP_PER_DAY = 3;
export const WAITLIST_STATUS_CODE_MIN_LENGTH = 12;
export const WAITLIST_STATUS_CODE_PATTERN = /^[a-z0-9]{12,64}$/;
export const WAITLIST_STATUS_RATE_LIMIT = 20;
export const WAITLIST_STATUS_RATE_WINDOW_SECONDS = 60;
export const WAITLIST_CONFIRMATION_TTL_SECONDS = 24 * 60 * 60;

export const WAITLIST_TIERS = ["founding_members", "first_wave", "founding_member_badge"] as const;

export type WaitlistTier = (typeof WAITLIST_TIERS)[number];

export const WAITLIST_TIER_LABELS: Record<WaitlistTier, string> = {
  founding_members: "Founding Members list",
  first_wave: "First-wave invite",
  founding_member_badge: "Founding Member badge",
};

export const WAITLIST_ROLES = [
  "planning_next_12_months",
  "actively_looking",
  "just_browsing",
  "agent_or_broker",
  "creator",
] as const;

export const WAITLIST_INTAKE_ROLES = ["searching", "agent"] as const;

export const WAITLIST_ROLE_LABELS: Record<(typeof WAITLIST_ROLES)[number], string> = {
  planning_next_12_months: "Planning to buy in the next 12 months",
  actively_looking: "Actively looking",
  just_browsing: "Just browsing",
  agent_or_broker: "Agent or broker",
  creator: "Creator",
};

export const WAITLIST_SEARCHING_WITH = ["on_my_own", "partner", "family_or_friends"] as const;

export const WAITLIST_SEARCHING_WITH_LABELS: Record<
  (typeof WAITLIST_SEARCHING_WITH)[number],
  string
> = {
  on_my_own: "On my own",
  partner: "Partner",
  family_or_friends: "Family or friends",
};
