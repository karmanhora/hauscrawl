import { CollectionMockup } from "@/components/landing/collection-mockup";
import { SwipeDeck } from "@/components/landing/swipe-demo/swipe-deck";
import { MobileWaitlistCta } from "@/components/landing/swipe-demo/mobile-waitlist-cta";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Container } from "@/components/ui/container";
import { CheckIcon, MapPinIcon, UserIcon } from "@/components/ui/icons";
import { getWaitlistCount } from "@/lib/waitlist";
import { Bricolage_Grotesque, Figtree } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-landing-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-landing-body", display: "swap" });

const steps = [
  {
    number: "01",
    title: "Agents post short reels",
    body: "A neighborhood, a few vibe tags, and a short walk through the home.",
  },
  {
    number: "02",
    title: "You swipe",
    body: "Save what you love, skip the rest, or book a tour.",
  },
  {
    number: "03",
    title: "Decide together",
    body: "Saves land in a private shortlist you and your partner rate together.",
  },
];

const privacyPoints = [
  {
    icon: MapPinIcon,
    title: "Neighborhood-level, not street-level",
    body: "HausCrawl works with general locations. We do not ask for a street address, and there are no home addresses in the waitlist.",
  },
  {
    icon: UserIcon,
    title: "Yours to control",
    body: "Your shortlist is private. Waitlist email is used for early-access updates, and every message includes an unsubscribe link.",
  },
  {
    icon: CheckIcon,
    title: "Minimal by design",
    body: "The form asks only for an email plus optional context. We hash IP addresses for abuse limits and use cookieless analytics.",
  },
];

const faqs = [
  {
    question: "What is HausCrawl?",
    answer:
      "HausCrawl is a social network for home hunting, not a real-estate listing portal. Agents will post short home reels for you to swipe through, then you can keep a private collection for the people deciding with you. Join our nationwide early-access waitlist.",
  },
  { question: "How does swiping work?", answer: "Swipe right to save, left to skip, or up to book a tour. Saved homes go to your private shared shortlist." },
  { question: "Are the homes in the demo real?", answer: "No. Demo homes and videos are illustrative samples, not real listings." },
  {
    question: "Is HausCrawl social media?",
    answer:
      "It has a social layer: profiles, follows, posts, likes, and threaded comments. The decision itself stays private. You can follow people and share what you are learning, or use HausCrawl only with the people in your collection.",
  },
  {
    question: "Is it free?",
    answer:
      "Joining the waitlist is free. We have not announced pricing for the product yet, and we will be clear about it before anyone is asked to pay.",
  },
  {
    question: "What happens to my email?",
    answer:
      "We use it to send early-access updates about HausCrawl. We do not sell or share it. You can unsubscribe from any email or ask us to delete your details.",
  },
  {
    question: "When does it launch?",
    answer:
      "We are building toward nationwide early access. We do not have a firm public date yet; the waitlist is the first place we will share one.",
  },
  {
    question: "Is my address shared?",
    answer:
      "No. HausCrawl uses neighborhood-level locations. We do not ask for a street address, and there are no home addresses in the waitlist.",
  },
];

export async function WaitlistLanding() {
  const count = await getWaitlistCount();

  return (
    <div className={`landing-design ${display.variable} ${body.variable} overflow-x-clip bg-[#EEF1F4] font-[family-name:var(--font-landing-body)]`}>
      <section id="landing-hero" className="relative min-h-[100svh] overflow-hidden bg-[#232A4A] text-white transition-[background] duration-[400ms] ease-in-out" style={{backgroundImage:"radial-gradient(ellipse at 78% 48%, color-mix(in srgb, var(--active-tint, #8da8bd) 32%, transparent), transparent 50%)"}}>
        <Container className="relative grid min-h-[100svh] gap-8 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-center lg:gap-14">
          <div>
            <p className="flex items-center gap-3 text-sm font-medium text-white/75">
              <span aria-hidden="true" className="h-px w-8 bg-white/50" />
              Nationwide early access
            </p>

            <h1 className="mt-3 font-[family-name:var(--font-landing-display)] text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-white sm:mt-5 sm:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
              Swipe through<br />homes. Decide<br />together.
            </h1>

            <p className="mt-3 max-w-[34rem] text-sm leading-snug text-white/80 sm:mt-5 sm:text-lg sm:leading-relaxed">
              Agents will post short home reels. Swipe right to save, left to skip, or up to book a tour. Your saves become a private shortlist to decide on together. Join the nationwide waitlist.
            </p>
            <div id="join" className="mt-3 max-w-[35rem] scroll-mt-24 rounded-2xl bg-white p-3 text-[#232A4A] sm:mt-4 sm:p-4">
              <WaitlistForm
                idPrefix="hero"
                surface="plain"
                layout="inline"
                buttonVariant="moss"
                trackPageView
              />
              <p className="mt-2 text-caption leading-relaxed text-[#4B5364]">
                Join from anywhere in the U.S. for early-access updates.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href="#demo" className="inline-flex rounded-lg border border-white/45 px-4 py-2 text-sm font-medium text-white transition hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFB84D]">Try the interactive demo</a>
              {count !== null ? <p className="text-xs leading-relaxed text-white/75"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#FFB84D]" aria-hidden="true" />{count.toLocaleString("en-US")} people have joined the waitlist</p> : null}
            </div>
          </div>

          <div className="flex flex-col items-center lg:justify-end lg:rotate-[2deg]">
            <div id="demo" tabIndex={-1}><SwipeDeck /></div>
            <p className="mt-3 max-w-xs text-center text-xs text-stone">Demo homes and videos are illustrative samples, not real listings.</p>
          </div>
        </Container>
      </section>

      <section id="shortlist" className="bg-[#EEF1F4]">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div><p className="text-sm font-medium text-[#1F7A74]">After you save</p><h2 className="mt-4 font-[family-name:var(--font-landing-display)] text-4xl leading-tight text-[#232A4A] sm:text-5xl">Everything you save lands here.</h2><p className="mt-5 max-w-md leading-relaxed text-[#4B5364]">A private shared shortlist keeps your favorites, ratings, and notes together. This is an illustrative sample, not a real listing.</p></div><CollectionMockup />
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] text-stone uppercase">
              How it works
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl">
              Swipe. Save. Decide together.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-stone">
              Most real estate content gets skipped. HausCrawl makes the skip the point, so you move through homes quickly and keep only what is worth another look.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="rounded-[1.5rem] border border-line/80 bg-cream p-6 sm:p-7"
              >
                <span className="font-serif text-4xl leading-none text-brass/90 italic">
                  {step.number}
                </span>
                <h3 className="mt-7 font-serif text-[1.65rem] leading-tight tracking-[-0.03em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-body-sm leading-relaxed text-stone">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[#EEF1F4]"><Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2"><div><p className="text-sm font-medium text-[#1F7A74]">Why swiping</p><h2 className="mt-4 max-w-xl font-[family-name:var(--font-landing-display)] text-4xl text-[#232A4A] sm:text-5xl">Keep the homes worth another look.</h2><p className="mt-5 max-w-lg leading-relaxed text-[#4B5364]">Most real estate content gets skipped. HausCrawl makes the skip the point, so you move through homes quickly and keep only what matters.</p></div><div className="grid gap-8 border-l-2 border-[#1F7A74] pl-6 sm:grid-cols-2"><div><h3 className="font-semibold text-[#232A4A]">For buyers</h3><p className="mt-2 leading-relaxed text-[#4B5364]">See more homes faster. Keep only what you love.</p></div><div><h3 className="font-semibold text-[#232A4A]">For agents</h3><p className="mt-2 leading-relaxed text-[#4B5364]">Share reels people finish, with tour requests instead of likes.</p></div></div></Container></section>

      <section className="bg-white"><Container className="py-14 sm:py-16"><p className="text-sm font-medium text-[#1F7A74]">What is already built in early access</p><ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#3F4758]">{["Shared collections with owner, editor, and viewer roles","Per-member ratings and notes","Follows and comments","A vertical video feed","Neighborhood-level privacy"].map(item=><li key={item} className="flex items-center gap-2"><CheckIcon size={16} className="text-[#1F7A74]"/>{item}</li>)}</ul></Container></section>

      <section className="bg-[#232A4A] text-white">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium tracking-[0.2em] text-cream/60 uppercase">
              Privacy by default
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-cream sm:text-5xl">
              Private where it matters.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/75">
              The waitlist should ask for very little. The product should make the private parts
              obvious. These are the commitments we are building around.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {privacyPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="border-t border-cream/20 pt-5">
                  <Icon size={19} className="text-cream/70" />
                  <h3 className="mt-4 font-serif text-xl leading-tight tracking-[-0.02em] text-cream">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-cream/70">{point.body}</p>
                </div>
              );
            })}
          </div>

          <a
            href="/privacy"
            className="mt-10 inline-flex text-body-sm font-medium text-cream underline decoration-cream/35 underline-offset-4 transition hover:decoration-cream"
          >
            Read the privacy policy
          </a>
        </Container>
      </section>

      <section className="border-t border-line/70 bg-cream">
        <Container size="narrow" className="py-20 sm:py-24">
          <p className="text-[11px] font-medium tracking-[0.2em] text-stone uppercase">FAQ</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.045em] text-ink sm:text-5xl">
            A few straight answers.
          </h2>

          <div className="mt-9 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-[15px] font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/15">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="text-xl font-normal text-stone transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-8 text-body-sm leading-relaxed text-stone">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#232A4A] text-white">
        <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-cream/55 uppercase">
              Join the waitlist
            </p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              Start with a better shortlist.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/65">
              We are building toward nationwide early access. Add your email and we will
              tell you when it is ready.
            </p>
          </div>

          <div id="join-bottom" className="scroll-mt-24">
            <WaitlistForm
              idPrefix="bottom"
              eyebrow="Early access"
              surface="card"
              layout="stacked"
              buttonVariant="moss"
            />
          </div>
        </Container>
      </section>
      <MobileWaitlistCta />
    </div>
  );
}
