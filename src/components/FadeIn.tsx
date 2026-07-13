"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "left";
};

export function FadeIn({ children, className, delay = 0, from }: FadeInProps) {
  // serverDefault false keeps the server HTML identical to the animated client
  // render (framer's own useReducedMotion reads matchMedia during hydration and
  // mismatches for reduced-motion users). The fadein-guard class is a pure-CSS
  // fallback in globals.css: if hydration is slow or JS is off, content fades in
  // by itself instead of sitting at the SSR'd opacity: 0 forever.
  const reduceMotion = usePrefersReducedMotion(false);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className ? `fadein-guard ${className}` : "fadein-guard"}
      initial={{ opacity: 0, x: from === "left" ? -20 : 0, y: from === "left" ? 0 : 12 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
