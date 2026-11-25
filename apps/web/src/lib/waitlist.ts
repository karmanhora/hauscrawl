import { WAITLIST_COUNTER_MIN } from "@hauscrawl/core";

import { createClient } from "@/lib/supabase/server";

export function visibleWaitlistCount(count: number | null): number | null {
  return count !== null && count >= WAITLIST_COUNTER_MIN ? count : null;
}

/** Reads the aggregate count through the only public read RPC. */
export async function getWaitlistCount(): Promise<number | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("waitlist_signup_count");

    if (error) return null;

    const count = Number(data);
    return Number.isFinite(count) && count >= 0 ? count : null;
  } catch {
    // Missing configuration, a network failure, or a not-yet-applied migration
    // should not take down the landing page.
    return null;
  }
}

/** The UI hides the counter until the threshold is met. */
export async function getVisibleWaitlistCount(): Promise<number | null> {
  const count = await getWaitlistCount();
  return visibleWaitlistCount(count);
}
