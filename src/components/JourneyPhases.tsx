"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHASES } from "@/lib/constants";

export function JourneyPhases() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToPanel = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const panels = track.querySelectorAll<HTMLElement>("[data-phase-panel]");
    panels[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const panels = track.querySelectorAll<HTMLElement>("[data-phase-panel]");
    if (!panels.length) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDistance = Infinity;

    panels.forEach((panel, index) => {
      const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
      const distance = Math.abs(trackCenter - panelCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateActiveIndex();
    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex]);

  return (
    <div id="path" className="scroll-mt-24 mt-16 md:mt-20">
      <div className="flex flex-col gap-10 md:flex-row md:gap-0">
        <div className="flex shrink-0 flex-col items-center px-6 md:sticky md:top-28 md:w-[22%] md:items-start md:self-start md:px-10 md:py-4">
          <h2 className="text-center font-display text-3xl text-foreground md:text-left md:text-4xl lg:text-5xl">
            The Path
          </h2>
          <div className="mt-6 hidden h-24 w-px bg-gold md:block" />
        </div>

        <div className="min-w-0 flex-1 md:pr-6">
          <div
            ref={trackRef}
            className="path-track scrollbar-hide flex gap-5 overflow-x-auto px-6 pb-4 md:gap-6 md:px-0 md:pb-8"
          >
            {PHASES.map((phase) => (
              <article
                key={phase.title}
                data-phase-panel
                className="path-panel grain vintage-image relative h-[min(58vh,440px)] w-[82vw] shrink-0 snap-center overflow-hidden md:w-[52vw] lg:w-[42vw]"
              >
                <Image
                  src={phase.image}
                  alt={phase.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 82vw, (max-width: 1024px) 52vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
                <div className="pointer-events-none absolute inset-4 border border-gold/30" />

                <span className="absolute top-6 left-6 font-display text-6xl text-gold/25 md:text-7xl">
                  {phase.numeral}
                </span>

                <div className="absolute right-0 bottom-0 left-0 p-8 md:p-10">
                  <h3 className="font-display text-3xl text-[#faf8f5] md:text-4xl">
                    {phase.title}
                  </h3>
                  <div className="mt-4 h-px w-10 bg-gold" />
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[#faf8f5]/85 md:text-base">
                    {phase.line}
                  </p>
                </div>

                <Link
                  href={phase.href}
                  className="absolute right-6 bottom-6 rounded-full bg-white px-6 py-2.5 text-xs tracking-[0.15em] text-gold uppercase transition-all duration-300 hover:bg-white/90 md:right-8 md:bottom-8 md:px-7 md:py-3 md:text-sm"
                >
                  Learn more
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 md:justify-start">
            <button
              onClick={() => scrollToPanel(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous phase"
              className="text-burgundy transition-opacity hover:opacity-70 disabled:opacity-20"
            >
              ←
            </button>

            <div className="flex items-center gap-2">
              {PHASES.map((phase, index) => (
                <button
                  key={phase.title}
                  onClick={() => scrollToPanel(index)}
                  aria-label={`Go to ${phase.title}`}
                  className={`h-px transition-all duration-500 ${
                    index === activeIndex
                      ? "w-10 bg-burgundy"
                      : "w-6 bg-brown/30 hover:bg-brown/60"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToPanel(activeIndex + 1)}
              disabled={activeIndex === PHASES.length - 1}
              aria-label="Next phase"
              className="text-burgundy transition-opacity hover:opacity-70 disabled:opacity-20"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
