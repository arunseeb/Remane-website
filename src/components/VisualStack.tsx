"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SLIDES = [
  { src: "/hero/running.png",  alt: "Running at dawn" },
  { src: "/hero/dressing.png", alt: "A man dressing with intention" },
  { src: "/hero/wine.png",     alt: "A glass of wine" },
] as const;

const SLIDE_DURATION = 6000;

export function VisualStack() {
  const [current, setCurrent] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % SLIDES.length),
      SLIDE_DURATION,
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative mt-36 h-[calc(100svh-9rem)] w-full overflow-hidden bg-[#1a1612]">
      {/* Slides — crossfade via opacity */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div
            className={`absolute inset-0 vintage-image ${
              !reduceMotion
                ? "animate-[kenburns_24s_ease-in-out_infinite_alternate]"
                : ""
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              // Only the first slide is the LCP image; preloading all three makes
              // them compete with fonts and the visible slide on first paint.
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      ))}

      {/* Film grain — single layer above slides */}
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/50" />

      {/* Hero text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          {...fadeUp(0.4)}
          className="font-display text-4xl leading-[1.15] tracking-wide text-white max-w-4xl md:text-6xl md:leading-tight lg:text-7xl"
        >
          The divorce happened for you. Not to you.
        </motion.h1>
        <motion.p
          {...fadeUp(0.9)}
          className="mt-6 text-base md:text-lg text-white/75 max-w-xl tracking-wide leading-relaxed"
        >
          A structured system helping successful men rebuild their confidence, identity, relationships, and future after divorce.
        </motion.p>
        <motion.a
          {...fadeUp(1.3)}
          href="#enquire"
          className="mt-10 text-xs tracking-[0.32em] text-white/80 uppercase border-b border-gold/50 pb-0.5 transition-opacity hover:opacity-60"
        >
          Begin your enquiry
        </motion.a>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-[softpulse_2.5s_ease-in-out_infinite]" aria-hidden>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex h-6 w-8 items-center"
          >
            <span
              aria-hidden
              className={`h-px w-full transition-all duration-500 ${
                i === current ? "bg-white/80" : "bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
