import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { FadeIn } from "@/components/FadeIn";
import { JourneyPhases } from "@/components/JourneyPhases";

export function Manifesto() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-background">

      {/* How it works */}
      <div className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-center text-xs tracking-[0.25em] text-muted uppercase">
              How it works
            </p>
          </FadeIn>
          <div className="mt-14 flex flex-col gap-12 md:flex-row md:items-start md:gap-0">
            {[
              {
                step: "01",
                title: "Enquire",
                body: "Submit a private enquiry. Each one is read personally and considered before any response is made.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="9" width="28" height="20" rx="1" />
                    <polyline points="4,9 18,20 32,9" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Assessment",
                body: "A personal interview to understand where you are, what you need, and which phases apply to you.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="13" />
                    <line x1="18" y1="5" x2="18" y2="8" />
                    <line x1="18" y1="28" x2="18" y2="31" />
                    <line x1="5" y1="18" x2="8" y2="18" />
                    <line x1="28" y1="18" x2="31" y2="18" />
                    <polyline points="18,18 22,11" strokeWidth="1.25" />
                    <circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Your path begins",
                body: "A programme built around your situation. Fortnightly sessions, daily accountability, and clear direction.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 28 C8 28 10 10 18 10 C26 10 28 24 32 24" />
                    <polyline points="27,20 32,24 28,28" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <Fragment key={item.step}>
                {i > 0 && (
                  <FadeIn from="left" delay={i * 0.18 - 0.09} className="hidden md:flex md:items-center md:self-center md:px-1 md:pb-10">
                    <span className="font-display text-3xl tracking-[0.5em] text-gold/40">– – –</span>
                  </FadeIn>
                )}
              <FadeIn from="left" delay={i * 0.18} className="md:flex-1">
                <div className="flex flex-col items-center text-center md:px-8">
                  <p className="font-display text-5xl text-gold/30">{item.step}</p>
                  <h3 className="mt-4 font-display text-2xl text-foreground">{item.title}</h3>
                  <div className="mx-auto mt-4 h-px w-8 bg-gold/40" />
                  <div className="mt-5 text-gold/60">{item.icon}</div>
                  <p className="mt-5 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </FadeIn>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen panel */}
      <div className="relative h-[100svh] w-full overflow-hidden bg-[#1a1612]">
        <div className="grain vintage-image absolute inset-0">
          <Image
            src="/images/aphrodite.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/40" />

        {/* Bottom-right overlay */}
        <div className="absolute bottom-10 right-8 flex flex-col items-end gap-5 md:bottom-14 md:right-14">
          <p className="font-display text-3xl tracking-[0.12em] text-white/90 md:text-4xl">
            Our Philosophy
          </p>
          <Link
            href="/our-mission"
            className="rounded-full bg-white px-7 py-2.5 font-sans text-xs tracking-[0.2em] text-gold uppercase transition-opacity duration-300 hover:opacity-80"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Journey phases */}
      <div className="px-6 pb-28 md:px-10 md:pb-40">
        <div className="mx-auto max-w-6xl">
          <JourneyPhases />
        </div>
      </div>

    </section>
  );
}
