import type { Metadata } from "next";
import Link from "next/link";

import { HouseMark } from "@/components/brand/logo";
import { WaitlistLanding } from "@/components/waitlist/waitlist-landing";
import { getCurrentUser } from "@/lib/auth";
import { isWaitlistOnly } from "@/lib/site";

const steps = [
  {
    number: "01",
    title: "Save what you love",
    body: "Keep every home you're considering in one place — the photos, the notes, and the details that actually matter to you.",
  },
  {
    number: "02",
    title: "Decide together",
    body: "Bring a partner, a friend, or whoever is deciding with you into shared collections. Everyone sees the same shortlist.",
  },
  {
    number: "03",
    title: "Keep the record",
    body: "Homes stay on HausCrawl after the tour. Come back to what you learned, not just what you scrolled past.",
  },
];

const detailRules = [
  {
    label: "Verified",
    body: "Checked against the source by HausCrawl.",
    className: "bg-ink text-paper",
  },
  {
    label: "Community",
    body: "Added by the person who saved the home.",
    className: "border border-ink/20 text-ink",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  if (!isWaitlistOnly()) return {};

  return {
    title: "Swipe through homes. Decide together.",
    description: "Swipe through illustrative home reels, save what you love, and decide together. Join the nationwide HausCrawl early-access waitlist.",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "HausCrawl",
      title: "HausCrawl — Swipe through homes. Decide together.",
      description: "Swipe through illustrative home reels, save what you love, and decide together. Join the nationwide HausCrawl early-access waitlist.",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "HausCrawl — Swipe through homes. Decide together.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "HausCrawl — Swipe through homes. Decide together.",
      description: "Swipe through illustrative home reels, save what you love, and decide together. Join the nationwide HausCrawl early-access waitlist.",
      images: ["/opengraph-image"],
    },
  };
}

export default async function HomePage() {
  if (isWaitlistOnly()) {
    return <WaitlistLanding />;
  }

  // Auth-aware CTAs; the header already reads the user, and React cache()
  // keeps this to a single Supabase call per request.
  const user = await getCurrentUser();

  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl gap-14 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:py-28">
        <div>
          <p className="animate-rise flex items-center gap-3 text-[11px] font-medium tracking-[0.22em] text-stone uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-ink/30" />A social network for home
            hunting
          </p>

          <h1
            className="animate-rise mt-7 text-[2.75rem] leading-[0.98] font-medium tracking-[-0.045em] text-ink sm:text-6xl lg:text-[5rem]"
            style={{ animationDelay: "60ms" }}
          >
            Find a home.
            <br />
            Together.
          </h1>

          <p
            className="animate-rise mt-7 max-w-lg text-base leading-relaxed text-stone sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Save the places you love, build shared collections with the people deciding with you,
            and keep every home you have considered in one calm place.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              href={user ? "/me" : "/sign-up"}
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition hover:bg-ink/90"
            >
              {user ? "Go to your profile" : "Create your account"}
            </Link>
            <Link
              href="/explore"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-ink transition hover:bg-mist"
            >
              Explore homes
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            {user ? null : (
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium text-stone transition hover:text-ink"
              >
                Sign in
              </Link>
            )}
          </div>

          <p className="mt-8 text-xs text-stone">
            No listings scraped from other sites. No invented addresses.
          </p>
        </div>

        <aside
          className="animate-rise relative overflow-hidden rounded-[2rem] bg-mist p-8 sm:p-10"
          style={{ animationDelay: "120ms" }}
        >
          <HouseMark className="pointer-events-none absolute -top-14 -right-14 h-64 w-64 opacity-[0.05]" />

          <div className="relative">
            <p className="text-[11px] font-medium tracking-[0.22em] text-stone uppercase">
              How details work
            </p>

            <ul className="mt-8 space-y-7">
              {detailRules.map((rule) => (
                <li key={rule.label} className="flex gap-4">
                  <span
                    className={`mt-0.5 inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase ${rule.className}`}
                  >
                    {rule.label}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/80">{rule.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-ink/10 pt-6">
              <p className="text-sm leading-relaxed text-stone">
                Every property field is tagged, so you always know what HausCrawl confirmed and what
                the community contributed.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="max-w-xl text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">
            Built for the way people actually choose a home.
          </h2>

          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((step) => (
              <li key={step.number} className="border-t border-line pt-6">
                <span className="text-xs font-medium text-stone">{step.number}</span>
                <h3 className="mt-4 text-lg font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <h2 className="text-3xl leading-tight font-medium tracking-[-0.03em] text-ink sm:text-4xl">
            Not a listing site.
            <br className="hidden sm:block" /> A place to decide.
          </h2>
          <div className="space-y-5 text-[15px] leading-relaxed text-stone sm:text-base">
            <p>
              Most property sites are built to show you as many listings as possible. HausCrawl is
              built around the homes you are actually considering — and the people considering them
              with you.
            </p>
            <p>
              Homes keep a profile here instead of disappearing down a feed. The details you gather,
              the notes you leave, and the shortlists you share stay together, so the decision is
              easier to make and easier to remember.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="rounded-[2rem] bg-ink px-7 py-14 text-paper sm:px-14 sm:py-20">
          <p className="text-[11px] font-medium tracking-[0.22em] text-paper/60 uppercase">
            Start here
          </p>
          <h2 className="mt-5 max-w-xl text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
            The homes you love deserve a better record than a saved tab.
          </h2>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={user ? "/me" : "/sign-up"}
              className="inline-flex h-12 items-center justify-center rounded-full bg-paper px-7 text-sm font-medium text-ink transition hover:bg-paper/90"
            >
              {user ? "Your profile" : "Create your account"}
            </Link>
            <Link
              href="/explore"
              className="inline-flex h-12 items-center justify-center rounded-full border border-paper/25 px-7 text-sm font-medium text-paper transition hover:border-paper/60"
            >
              Explore homes
            </Link>
            {user ? null : (
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium text-paper/70 transition hover:text-paper"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
