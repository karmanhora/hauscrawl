/* eslint-disable @next/next/no-html-link-for-pages -- public waitlist navigation uses plain anchors to avoid client routing JS */
import { Logo } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function WaitlistHeader() {
  return (
    <header className="bg-mist">
      <Container className="flex h-20 items-center justify-between gap-3">
        <a href="/" className="rounded-lg" aria-label="HausCrawl — home">
          <Logo size="xs" transparent />
        </a>

        <div className="flex items-center gap-3 sm:gap-6">
          <p className="hidden text-sm font-medium text-stone md:block">
            Nationwide early access
          </p>
          <a
            href="/#join"
            className={buttonClasses({
              variant: "moss",
              size: "md",
              className: "px-4 text-[13px] sm:px-5 sm:text-body-sm",
            })}
          >
            Join the waitlist
          </a>
        </div>
      </Container>
    </header>
  );
}
