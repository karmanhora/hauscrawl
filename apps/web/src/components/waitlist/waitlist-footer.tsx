/* eslint-disable @next/next/no-html-link-for-pages -- public waitlist navigation uses plain anchors to avoid client routing JS */
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { getContactEmail } from "@/lib/site";

export function WaitlistFooter() {
  const contact = getContactEmail();

  return (
    <footer className="border-t border-line bg-cream">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Logo size="sm" transparent />
            <p className="mt-5 max-w-sm font-serif text-2xl leading-tight tracking-[-0.03em] text-ink sm:text-3xl">
              Find a home, together.
            </p>
            <p className="mt-4 max-w-sm text-body-sm leading-relaxed text-stone">
              A social network for home hunting. Join the nationwide early-access waitlist.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label="Footer">
              <p className="text-sm font-semibold text-stone">
                Explore
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="/waitlist/how-it-works"
                  className="text-body-sm text-stone transition hover:text-ink"
                >
                  How it works
                </a>
                <a href="/#join" className="text-body-sm text-stone transition hover:text-ink">
                  Join the waitlist
                </a>
              </div>
            </nav>

            <nav aria-label="Legal and contact">
              <p className="text-sm font-semibold text-stone">
                Details
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a href="/privacy" className="text-body-sm text-stone transition hover:text-ink">
                  Privacy
                </a>
                <a href="/terms" className="text-body-sm text-stone transition hover:text-ink">
                  Terms
                </a>
                <a
                  href={`mailto:${contact}`}
                  className="text-body-sm text-stone transition hover:text-ink"
                >
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-line pt-5 text-caption text-stone sm:flex-row">
          <p>© {new Date().getFullYear()} HausCrawl</p>
          <p>Private by default. No street addresses.</p>
        </div>
      </Container>
    </footer>
  );
}
