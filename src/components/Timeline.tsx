"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  CircuitTrack,
  FloatingShards,
  TIMELINE_SHARDS,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Shared Design Tokens — strictly mirrors Hero, Rules, FAQ, Contact */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const VIOLET = "#8B7CF6";
const DEEP = "#3B2F4F";
const EMBER = "#C4642E";
const IVORY = "#E8E2D6";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

const NS = { vectorEffect: "non-scaling-stroke" };

/* ------------------------------------------------------------------ */
/*  Timeline Data Configuration                                       */
/* ------------------------------------------------------------------ */

interface TimelineStage {
  number: string;
  code: string;
  phase: string;
  timeTag: string;
  title: string;
  description: string;
  accent: "violet" | "ember" | "ivory";
  accentColor: string;
}

const TIMELINE: TimelineStage[] = [
  {
    number: "01",
    code: "ARR",
    phase: "ARRIVE",
    timeTag: "T+00h // GENESIS",
    title: "The starting coordinate.",
    description:
      "Teams assemble, the arena brief drops, the board resets to zero. Every build launches from the same blank grid.",
    accent: "ivory",
    accentColor: "#E8E2D6",
  },
  {
    number: "02",
    code: "BLD",
    phase: "BUILD",
    timeTag: "T+08h // SYSTEM ARCH",
    title: "Structure, deliberately.",
    description:
      "Ideas become load-bearing. Architecture stacks layer by layer — intentional, zero boilerplate, zero defaults.",
    accent: "violet",
    accentColor: "#8B7CF6",
  },
  {
    number: "03",
    code: "BRK",
    phase: "BREAK",
    timeTag: "T+18h // CHAOS INJECT",
    title: "Pressure finds the seams.",
    description:
      "The structure meets adversarial fuzzing and chaos injection. What is fragile breaks fast and cleanly.",
    accent: "ember",
    accentColor: "#C4642E",
  },
  {
    number: "04",
    code: "RTK",
    phase: "RETHINK",
    timeTag: "T+26h // DIAGNOSTICS",
    title: "Read the fracture lines.",
    description:
      "Not a restart — a recalibration. System failure becomes actionable telemetry, sharpening the next iteration.",
    accent: "ivory",
    accentColor: "#E8E2D6",
  },
  {
    number: "05",
    code: "RBD",
    phase: "REBUILD",
    timeTag: "T+32h // HARDENING",
    title: "Sharper the second time.",
    description:
      "Every weak seam gets reinforced. The architecture returns fortified, battle-tested, resilient under stress.",
    accent: "violet",
    accentColor: "#8B7CF6",
  },
  {
    number: "06",
    code: "RVL",
    phase: "REVEAL",
    timeTag: "T+36h // ZERO-DAY",
    title: "The system, finished.",
    description:
      "What's left standing takes center stage. Build vs Break resolved in public under live adversarial verification.",
    accent: "ember",
    accentColor: "#C4642E",
  },
];

const ACCENTS: Record<string, string> = {
  violet: VIOLET,
  ember: EMBER,
  ivory: IVORY,
};

/* ------------------------------------------------------------------ */
/*  Tactical Reactor Node                                             */
/* ------------------------------------------------------------------ */

interface TimelineNodeProps {
  accent: string;
  active: boolean;
  code: string;
  reduced: boolean;
  size?: number;
  className?: string;
}

function TimelineNode({ accent, active, code, reduced, size, className }: TimelineNodeProps) {
  const color = ACCENTS[accent] || VIOLET;
  const offset = active ? 4 : 0;
  const rot = active ? (reduced ? 0 : 8) : 0;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className || ""}`}>
      {/* Ambient Glow Aura */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-500 ${
          active
            ? "w-16 h-16 md:w-24 md:h-24 opacity-65 blur-lg"
            : "w-12 h-12 md:w-16 md:h-16 opacity-20 blur-sm"
        }`}
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />

      <svg
        viewBox="0 0 44 44"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[68px] lg:h-[68px] overflow-visible drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
      >
        {/* Solid Dark Substation Backplate - cleans spine line crossing */}
        <circle
          cx="22"
          cy="22"
          r="19"
          fill="#110B18"
          stroke={active ? color : "#E8E2D6"}
          strokeOpacity={active ? 0.5 : 0.15}
          strokeWidth="1"
        />

        {/* Static reference cyber frame with corner brackets */}
        <rect
          x="6"
          y="6"
          width="32"
          height="32"
          fill="none"
          stroke={IVORY}
          strokeOpacity={active ? 0.5 : 0.18}
          strokeWidth="1"
          strokeDasharray="2 3"
          style={{ transition: "stroke-opacity 300ms ease" }}
          {...NS}
        />

        {/* Outer Corner Crosshair Ticks */}
        <path
          d="M2 9V2H9M35 2H42V9M42 35V42H35M9 42H2V35"
          fill="none"
          stroke={color}
          strokeOpacity={active ? 0.95 : 0.4}
          strokeWidth="1.3"
          style={{ transition: "stroke-opacity 300ms ease" }}
          {...NS}
        />

        {/* Ambient Active Pulse Ring */}
        {active && !reduced && (
          <circle
            key="pulse"
            cx="22"
            cy="22"
            r="17"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            className="animate-ping [animation-duration:2s]"
            style={{ transformOrigin: "center" }}
            {...NS}
          />
        )}

        {/* Splitting Diamond Halves */}
        <motion.polygon
          points="22,7 37,22 22,22 7,22"
          fill={color}
          fillOpacity={active ? 1 : 0.85}
          animate={{ x: -offset, y: -offset, rotate: -rot }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 22 }}
          style={{ transformOrigin: "22px 22px" }}
        />
        <motion.polygon
          points="22,22 37,22 22,37 7,22"
          fill={DEEP}
          stroke={color}
          strokeOpacity="0.9"
          strokeWidth="1.2"
          animate={{ x: offset, y: offset, rotate: -rot }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 22 }}
          style={{ transformOrigin: "22px 22px" }}
        />

        {/* Micro code label revealed between halves */}
        <motion.text
          x="22"
          y="23.5"
          textAnchor="middle"
          fontSize="7"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontWeight="bold"
          letterSpacing="0.5"
          fill={IVORY}
          initial={false}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          {code}
        </motion.text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Vertical Timeline Component                                  */
/* ------------------------------------------------------------------ */

export default function Timeline() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Mouse parallax coordinates for background floating shards */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 75, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 75, damping: 22 });

  /* Activate middle timeline item dynamically on scroll */
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Only evaluate if the timeline section is in view
      if (sectionRect.bottom <= 0 || sectionRect.top >= vh) return;

      const midY = vh * 0.5;
      let closestIdx = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(elCenter - midY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveIdx((prev) => (prev === closestIdx ? prev : closestIdx));
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const lenis = (window as unknown as { __lenis?: { on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void } }).__lenis;
    if (lenis?.on) {
      lenis.on("scroll", onScroll);
    }

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (lenis?.off) {
        lenis.off("scroll", onScroll);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="timeline"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      aria-label="Timeline — the BvB process"
      className="relative isolate w-full overflow-hidden bg-[#1A1410] py-14 sm:py-20 lg:py-24 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >
      {/* ---------------------------------------------------------- */}
      {/* Background Atmosphere & Ambient Horizon Grid               */}
      {/* ---------------------------------------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]"
      />

      {/* Atmospheric Ambient Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-28 h-96 w-96 rounded-full bg-[#8B7CF6]/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-28 h-96 w-96 rounded-full bg-[#C4642E]/10 blur-[140px]"
      />

      {/* Orthogonal Circuit Tracks matching Hero, Rules, FAQ */}
      <CircuitTrack className="top-1/3 opacity-15" />

      {/* Floating 3D Geometric Shards with Mouse Parallax */}
      <FloatingShards shards={TIMELINE_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* Monumental Typographic Ambient Watermark */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute -bottom-10 -left-6 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-10 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        TRAJECTORY
      </span>

      {/* ---------------------------------------------------------- */}
      {/* Container Content                                          */}
      {/* ---------------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="pb-12 border-b border-[#E8E2D6]/10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>


              <h2
                className={`${DISPLAY} mt-4 text-[clamp(1.85rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em] text-[#E8E2D6]`}
              >
                <span className={`block ${GRAD_BUILD}`}>Every build</span>
                <span className={`block ${GRAD_BREAK}`}>has a break.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
                Six operational states. One continuous trajectory through arrival, construction, adversarial failure, and public resolution.
              </p>
            </div>


          </div>
        </div>

        {/* ============================================================ */}
        {/*  MONUMENTAL VERTICAL TIMELINE SPINE                         */}
        {/* ============================================================ */}
        <div className="relative mt-16 sm:mt-24">
          {/* Central Conduit Spine Line on Desktop / Left on Mobile */}
          <div
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-6 sm:left-8 md:left-1/2 -translate-x-1/2 w-0.5 md:w-1 bg-gradient-to-b from-[#8B7CF6]/80 via-[#E8E2D6]/20 to-[#C4642E]/80"
          >
            {/* Glowing vertical laser pulse */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B7CF6] to-transparent opacity-60 blur-sm animate-pulse" />
          </div>

          {/* Sequential Stage Rows */}
          <div className="space-y-12 sm:space-y-16">
            {TIMELINE.map((item, idx) => {
              const isActive = activeIdx === idx;
              const isEven = idx % 2 === 0;
              const isEmber = item.accent === "ember";

              return (
                <div
                  key={item.number}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 cursor-pointer ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Stage Card Side */}
                  <motion.div
                    initial={reduced ? false : { opacity: 0, x: isEven ? -24 : 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: reduced ? 0 : idx * 0.08, ease: EASE }}
                    className={`w-full md:w-[42%] pl-14 sm:pl-20 md:pl-0 text-left ${
                      isEven ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-2xl p-4.5 sm:p-7 backdrop-blur-xl border text-left transition-all duration-500 ${
                        isActive
                          ? isEmber
                            ? "border-[#C4642E]/70 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_24px_-4px_rgba(196,100,46,0.3)] scale-[1.02]"
                            : "border-[#8B7CF6]/70 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_24px_-4px_rgba(139,124,246,0.3)] scale-[1.02]"
                          : "border-[#E8E2D6]/10 hover:border-[#8B7CF6]/35 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)]"
                      }`}
                      style={{
                        background: isActive
                          ? isEmber
                            ? "linear-gradient(135deg, rgba(196, 100, 46, 0.24) 0%, rgba(33, 20, 26, 0.94) 50%, rgba(139, 124, 246, 0.1) 100%)"
                            : "linear-gradient(135deg, rgba(139, 124, 246, 0.24) 0%, rgba(30, 22, 42, 0.94) 50%, rgba(196, 100, 46, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
                      }}
                    >
                      {/* Cyber Corner Crosshairs */}
                      <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                      <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                      <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                      <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>



                      {/* Phase Title */}
                      <h3 className={`${DISPLAY} mt-4 text-xl sm:text-2xl font-bold uppercase tracking-tight text-white`}>
                        {item.phase}
                      </h3>

                      {/* Subtitle */}
                      <p
                        className={`${MONO} text-xs font-semibold tracking-wide mt-1`}
                        style={{ color: item.accentColor }}
                      >
                        {item.title}
                      </p>

                      {/* Description */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/70 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Center Node on the Vertical Spine */}
                  <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 z-20">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <TimelineNode
                        accent={item.accent}
                        active={isActive}
                        code={item.code}
                        reduced={reduced}
                      />
                    </div>
                  </div>

                  {/* Empty Opposite Side on Desktop for Alternating Balance */}
                  <div className="hidden md:block md:w-[42%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}