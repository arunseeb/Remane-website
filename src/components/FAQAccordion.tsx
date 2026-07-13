"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FAQItem = { q: string; a: string };
type FAQSection = { heading: string; items: FAQItem[] };

export function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-16 space-y-16">
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="mb-8 text-center text-sm tracking-[0.2em] text-muted uppercase">
            {section.heading}
          </p>
          <div>
            {section.items.map((item, itemIndex) => {
              const id = `${section.heading}::${item.q}`;
              const isOpen = open === id;
              const panelId = `faq-${section.heading.replace(/\W+/g, "-")}-${itemIndex}`;
              return (
                <div key={item.q} className="border-t border-brown/10">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between py-6 text-left"
                  >
                    <span className="font-display text-xl text-foreground pr-8">
                      {item.q}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 text-gold/50 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 space-y-3 text-sm leading-relaxed text-muted">
                          {item.a.split("\n\n").map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
