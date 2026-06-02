"use client";

import Image from "next/image";
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
              priority
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
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-wide max-w-4xl leading-tight">
          The divorce happened for you. Not to you.
        </h1>
        <p className="mt-6 text-base md:text-lg text-white/75 max-w-xl tracking-wide leading-relaxed">
          A structured system helping successful men rebuild their confidence, identity, relationships, and future after divorce.
        </p>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-px w-8 transition-all duration-500 ${
              i === current ? "bg-white/80" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
