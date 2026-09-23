"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * Single unified cursor spotlight across the entire page.
 * Eliminates duplicate/divided glow cutoffs at section boundaries.
 */
export default function GlobalSpotlight() {
  const reduced = Boolean(useReducedMotion());
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 26 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reduced, mouseX, mouseY, visible]);

  const spotlightBg = useMotionTemplate`radial-gradient(750px circle at ${smoothX}px ${smoothY}px, rgba(139,124,246,0.11), transparent 70%)`;

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        background: spotlightBg,
        opacity: visible ? 1 : 0,
      }}
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-700"
    />
  );
}
