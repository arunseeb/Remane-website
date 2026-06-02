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
          <p className="mb-8 text-xs tracking-[0.2em] text-muted uppercase">
            {section.heading}
          </p>
          <div>
            {section.items.map((item) => {
              const id = `${section.heading}::${item.q}`;
              const isOpen = open === id;
              return (
                <div key={item.q} className="border-t border-brown/10">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="flex w-full items-center justify-between py-6 text-left"
                  >
                    <span className="font-display text-xl text-foreground pr-8">
                      {item.q}
                    </span>
                    <span className="flex-shrink-0 font-sans text-lg text-gold/50 select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
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
