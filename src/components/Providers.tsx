"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AuthLinkCatcher } from "@/components/portal/AuthLinkCatcher";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Providers({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  const content = reduceMotion ? <>{children}</> : <SmoothScroll>{children}</SmoothScroll>;

  return (
    <>
      <Suspense>
        <AuthLinkCatcher />
      </Suspense>
      {content}
    </>
  );
}
