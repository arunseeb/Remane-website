"use client";

import { useEffect, useState } from "react";

// Fixed bottom bar that appears once the hero (video + first CTA) has scrolled
// out of view, and hides again while the booking section is on screen.
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("vsl-hero");
    const book = document.getElementById("book");
    if (!hero || !book) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    const bookObserver = new IntersectionObserver(
      ([entry]) => setBookVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    heroObserver.observe(hero);
    bookObserver.observe(book);
    return () => {
      heroObserver.disconnect();
      bookObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !bookVisible;

  return (
    <div
      // inert (not just aria-hidden) also removes the link from the tab order —
      // pointer-events-none doesn't stop keyboard focus landing on invisible controls.
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="border-t border-gold/25 bg-[#faf8f5]/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6">
          <p className="hidden text-xs tracking-[0.15em] text-muted uppercase sm:block">
            A private 30-minute conversation
          </p>
          <a
            href="#book"
            className="flex-1 border border-burgundy bg-burgundy px-8 py-3 text-center text-xs tracking-[0.25em] text-[#faf8f5] uppercase transition-colors duration-300 hover:bg-burgundy-hover sm:flex-none"
          >
            Book the call
          </a>
        </div>
      </div>
    </div>
  );
}
