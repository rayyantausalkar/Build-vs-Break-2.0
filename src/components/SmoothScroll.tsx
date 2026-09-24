"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * High-performance smooth scrolling engine powered by Lenis.
 * Features:
 * - Exponential deceleration easing matching luxury kinetic web aesthetics
 * - Automatic RAF loop management without thread contention
 * - Seamless anchor target interception with offset compensation
 * - Graceful fallback and deactivation for users with prefers-reduced-motion
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect reduced motion accessibility preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      autoRaf: true,
      anchors: {
        offset: -80,
      },
    });

    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
