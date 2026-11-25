import { z } from "zod";

import {
  WAITLIST_REFERRAL_CODE_PATTERN,
  WAITLIST_REFERRER_MAX_LENGTH,
  WAITLIST_REGION_MAX_LENGTH,
  WAITLIST_ROLES,
  WAITLIST_INTAKE_ROLES,
  WAITLIST_SEARCHING_WITH,
  WAITLIST_UTM_MAX_LENGTH,
} from "../constants/waitlist";
import { emailSchema } from "./auth";

function optionalText(max: number, message: string) {
  return z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));
}

export const waitlistRoleSchema = z.enum(WAITLIST_ROLES);
export const waitlistIntakeRoleSchema = z.enum(WAITLIST_INTAKE_ROLES);
export const waitlistSearchingWithSchema = z.enum(WAITLIST_SEARCHING_WITH);

export const waitlistRegionSchema = optionalText(
  WAITLIST_REGION_MAX_LENGTH,
  `Use ${WAITLIST_REGION_MAX_LENGTH} characters or fewer for your city or region.`,
).refine((value) => value === undefined || !/[\r\n]/.test(value), "Use a city or region only.");

export const waitlistReferralCodeSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(WAITLIST_REFERRAL_CODE_PATTERN, "That referral link is not valid.")
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const optionalUtm = optionalText(
  WAITLIST_UTM_MAX_LENGTH,
  `Source values are ${WAITLIST_UTM_MAX_LENGTH} characters or fewer.`,
);

export const waitlistSignupSchema = z.object({
  email: emailSchema,
  role: waitlistRoleSchema.optional(),
  intakeRole: waitlistIntakeRoleSchema.optional(),
  searchingWith: waitlistSearchingWithSchema.optional(),
  region: waitlistRegionSchema,
  utmSource: optionalUtm,
  utmMedium: optionalUtm,
  utmCampaign: optionalUtm,
  referrer: optionalText(
    WAITLIST_REFERRER_MAX_LENGTH,
    `Referrers are ${WAITLIST_REFERRER_MAX_LENGTH} characters or fewer.`,
  ),
  ref: waitlistReferralCodeSchema,
});

export type WaitlistSignupInput = z.infer<typeof waitlistSignupSchema>;
