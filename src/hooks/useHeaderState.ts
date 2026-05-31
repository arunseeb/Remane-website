"use client";

import { useEffect, useState } from "react";

const TOP_THRESHOLD = 60;

export function useHeaderState() {
  const [atTop, setAtTop] = useState(true);
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const midway = window.innerHeight / 2;
      const scrollingUp = y < lastScrollY;

      const isAtTop = y < TOP_THRESHOLD;
      setAtTop(isAtTop);

      if (isAtTop) {
        setShowBg(false);
      } else if (scrollingUp && y >= midway) {
        setShowBg(true);
      } else if (!scrollingUp) {
        setShowBg(false);
      }

      lastScrollY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { atTop, showBg };
}
