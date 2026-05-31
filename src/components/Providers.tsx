"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Providers({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return <SmoothScroll>{children}</SmoothScroll>;
}
