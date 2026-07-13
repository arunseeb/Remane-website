"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * SSR-safe prefers-reduced-motion.
 *
 * `serverDefault` is what the server (and the hydration render) assumes:
 * - true  → render the still variant first; motion attaches after hydration.
 * - false → render the animated variant first; reduced-motion users get the
 *           still variant right after hydration. Use this when the animated
 *           variant is the one whose server HTML must match (e.g. FadeIn).
 */
export function usePrefersReducedMotion(serverDefault = true) {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverDefault);
}
