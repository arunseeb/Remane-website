import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { JourneyPhases } from "@/components/JourneyPhases";

export function Manifesto() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-background">

      {/* Text block */}
      <div className="px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <p className="font-display text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
                A bespoke path from recovery to mastery.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 text-base leading-relaxed text-muted md:text-lg">
                Private guidance for men rebuilding with intention.
              </p>
            </FadeIn>
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
