"use client";

import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackWaitlistEvent } from "@/lib/waitlist-analytics";

const SHARE_TEXT =
  "I'm on the HausCrawl nationwide early-access waitlist. Join if you're hunting too:";

export function WaitlistShare({ referralUrl }: { referralUrl: string }) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );

  const shareText = `${SHARE_TEXT} ${referralUrl}`;

  async function copyLink() {
    trackWaitlistEvent("waitlist_referral_share_click", { method: "copy" });

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      const input = document.getElementById("waitlist-referral-url") as HTMLInputElement | null;
      if (!input) return;
      input.focus();
      input.select();
      document.execCommand("copy");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_500);
    }
  }

  async function nativeShare() {
    trackWaitlistEvent("waitlist_referral_share_click", { method: "native" });

    try {
      await navigator.share({
        title: "HausCrawl waitlist",
        text: SHARE_TEXT,
        url: referralUrl,
      });
    } catch {
      // A dismissed native sheet is not an error.
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(shareText)}`;
  const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent("Join me on the HausCrawl waitlist")}&body=${encodeURIComponent(shareText)}`;

  return (
    <section aria-labelledby="waitlist-share-heading" className="border-t border-line pt-6">
      <h2 id="waitlist-share-heading" className="text-lg font-medium tracking-[-0.02em] text-ink">
        Invite someone
      </h2>
      <p className="mt-2 text-body-sm leading-relaxed text-stone">
        Referrals count after the person you invite confirms their email. Each confirmed referral
        moves you up five spots, up to ten referrals.
      </p>

      <label
        htmlFor="waitlist-referral-url"
        className="mt-5 block text-body-sm font-medium text-ink"
      >
        Your referral link
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id="waitlist-referral-url"
          readOnly
          value={referralUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="text-body-sm"
        />
        <Button type="button" variant="secondary" onClick={copyLink} className="shrink-0">
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {canNativeShare ? (
          <Button type="button" variant="secondary" size="sm" onClick={nativeShare}>
            Share…
          </Button>
        ) : null}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-full border border-line-strong bg-paper px-3.5 text-body-sm font-medium text-ink transition hover:border-ink hover:bg-mist"
          onClick={() =>
            trackWaitlistEvent("waitlist_referral_share_click", { method: "whatsapp" })
          }
        >
          WhatsApp
        </a>
        <a
          href={smsUrl}
          className="inline-flex h-9 items-center rounded-full border border-line-strong bg-paper px-3.5 text-body-sm font-medium text-ink transition hover:border-ink hover:bg-mist"
          onClick={() => trackWaitlistEvent("waitlist_referral_share_click", { method: "sms" })}
        >
          SMS
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-full border border-line-strong bg-paper px-3.5 text-body-sm font-medium text-ink transition hover:border-ink hover:bg-mist"
          onClick={() => trackWaitlistEvent("waitlist_referral_share_click", { method: "x" })}
        >
          X
        </a>
        <a
          href={emailUrl}
          className="inline-flex h-9 items-center rounded-full border border-line-strong bg-paper px-3.5 text-body-sm font-medium text-ink transition hover:border-ink hover:bg-mist"
          onClick={() => trackWaitlistEvent("waitlist_referral_share_click", { method: "email" })}
        >
          Email
        </a>
      </div>

      <p className="mt-4 text-caption leading-relaxed text-stone">
        No auto-sending, no contact access, and no pre-checked boxes.{" "}
        <a href="/waitlist/how-it-works" className="underline underline-offset-2 hover:text-ink">
          How the waitlist works
        </a>
      </p>
    </section>
  );
}
