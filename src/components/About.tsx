"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ABOUT_SHARDS,
  CircuitTrack,
  FloatingShards,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens                                                     */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const VIOLET = "#8B7CF6";
const EMBER = "#C4642E";
const IVORY = "#E8E2D6";
const DEEP = "#1C1428";
const ABYSS = "#120D1A";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

const GRAIN = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
};

const NS = { vectorEffect: "non-scaling-stroke" };

/* ------------------------------------------------------------------ */
/*  Isometric 3D Math for Kinetic Duality Morphing                     */
/* ------------------------------------------------------------------ */

const K = Math.sqrt(3) / 2;
const CUBE_S = 36;
const VB = 340;

const iso =
  (ox: number, oy: number, s: number = CUBE_S) =>
  (x: number, y: number, z: number): [number, number] => [
    ox + (x - y) * K * s,
    oy + (x + y) * 0.5 * s - z * s,
  ];

const fmt = (n: number) => Math.round(n * 10) / 10;
const pts = (list: [number, number][]) =>
  list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");

function box(
  p: (x: number, y: number, z: number) => [number, number],
  x: number,
  y: number,
  z: number,
  w = 1,
  d = 1,
  h = 1
) {
  return {
    top: pts([
      p(x, y, z + h),
      p(x + w, y, z + h),
      p(x + w, y + d, z + h),
      p(x, y + d, z + h),
    ]),
    left: pts([
      p(x, y + d, z),
      p(x + w, y + d, z),
      p(x + w, y + d, z + h),
      p(x, y + d, z + h),
    ]),
    right: pts([
      p(x + w, y, z),
      p(x + w, y + d, z),
      p(x + w, y + d, z + h),
      p(x + w, y, z + h),
    ]),
    center: p(x + w / 2, y + d / 2, z + h / 2),
  };
}

/* 8 Facets composing the Duality Monolith */
interface MonolithFacet {
  id: string;
  slot: [number, number, number];
  vector: [number, number]; // dispersion vector in pixels
  rot: number; // max rotation degrees
  tone: "violet" | "ember" | "ivory" | "deep";
}

const FACETS: MonolithFacet[] = [
  { id: "c1", slot: [0, 0, 0], vector: [-28, 22], rot: -18, tone: "deep" },
  { id: "c2", slot: [1, 0, 0], vector: [32, 14], rot: 24, tone: "violet" },
  { id: "c3", slot: [0, 1, 0], vector: [-34, -18], rot: -22, tone: "ember" },
  { id: "c4", slot: [1, 1, 0], vector: [48, 8], rot: 32, tone: "ember" },
  { id: "c5", slot: [0, 0, 1], vector: [-14, -40], rot: -15, tone: "ivory" },
  { id: "c6", slot: [1, 0, 1], vector: [38, -48], rot: 28, tone: "violet" },
  { id: "c7", slot: [0, 1, 1], vector: [-42, -36], rot: -30, tone: "violet" },
  { id: "c8", slot: [1, 1, 1], vector: [54, -28], rot: 40, tone: "ember" },
];

const G_P = iso(170, 215, CUBE_S);

const TONES: Record<string, [string, string, string]> = {
  violet: [VIOLET, "#5A4EB3", DEEP],
  ember: [EMBER, "#8F3D17", ABYSS],
  ivory: [IVORY, VIOLET, DEEP],
  deep: [DEEP, "#150E20", ABYSS],
};

function FacetCube({
  facet,
  entropy,
}: {
  facet: MonolithFacet;
  entropy: number; // 0 (solid) to 1 (scattered)
}) {
  const f = box(G_P, facet.slot[0], facet.slot[1], facet.slot[2]);
  const [top, left, right] = TONES[facet.tone] || TONES.violet;

  const dx = facet.vector[0] * entropy;
  const dy = facet.vector[1] * entropy;
  const r = facet.rot * entropy;

  return (
    <motion.g
      animate={{
        x: dx,
        y: dy,
        rotate: r,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      style={{ transformOrigin: `${f.center[0]}px ${f.center[1]}px` }}
      stroke={IVORY}
      strokeOpacity={0.25 + entropy * 0.25}
      strokeWidth={0.8}
      strokeLinejoin="round"
    >
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
      <polygon points={f.top} fill={top} />
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  The Duality Engine — Interactive Morphing Monolith                */
/* ------------------------------------------------------------------ */

function DualityEngine({
  entropy,
  reduced,
}: {
  entropy: number;
  reduced: boolean;
}) {
  const stateColor =
    entropy < 0.35 ? VIOLET : entropy > 0.65 ? EMBER : IVORY;

  return (
    <div className="relative mx-auto w-full max-w-[540px] select-none">
      {/* Dynamic Background Glow changing from Violet to Ember */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-full blur-3xl opacity-50 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${entropy * 100}% 50%, ${stateColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Main Front Stage (cardless, seamless) */}
      <div className="relative w-full">
        {/* 3D Isometric Viewport */}
        <div className="relative flex aspect-square w-full items-center justify-center">
          {/* Radar Target Guides */}
          <div
            className={`pointer-events-none absolute inset-6 rounded-full border border-dashed border-[#E8E2D6]/10 ${
              reduced ? "" : "animate-[spin_60s_linear_infinite]"
            }`}
          />
          <div className="pointer-events-none absolute inset-16 rounded-full border border-[#E8E2D6]/5" />
          <div className="pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#E8E2D6]/10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#E8E2D6]/10 to-transparent" />

          {/* SVG Monolith Kinetic Engine */}
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            fill="none"
            aria-hidden="true"
            className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
          >
            {/* Ground Blueprint Wireframe Plane */}
            <path
              d={`M${G_P(-0.5, -0.5, 0)[0]} ${G_P(-0.5, -0.5, 0)[1]}L${G_P(2.5, -0.5, 0)[0]} ${G_P(2.5, -0.5, 0)[1]}L${G_P(2.5, 2.5, 0)[0]} ${G_P(2.5, 2.5, 0)[1]}L${G_P(-0.5, 2.5, 0)[0]} ${G_P(-0.5, 2.5, 0)[1]}Z`}
              stroke={stateColor}
              strokeOpacity={0.12}
              strokeWidth="1"
              {...NS}
            />

            {/* 8 Dynamic Facets Rendering with Spring-loaded Displacement */}
            {FACETS.map((facet) => (
              <FacetCube
                key={facet.id}
                facet={facet}
                entropy={entropy}
              />
            ))}

            {/* Stress Fracture Laser Sparks at High Entropy */}
            {entropy > 0.4 && (
              <g stroke={EMBER} strokeWidth="1" opacity={entropy} {...NS}>
                <line x1="130" y1="180" x2="210" y2="230" strokeDasharray="4 4" />
                <line x1="170" y1="140" x2="190" y2="260" strokeDasharray="3 3" />
                <circle cx="170" cy="215" r={16 * entropy} stroke={EMBER} strokeOpacity="0.4" fill="none" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The Three Phases — Quiz, Build, Break                              */
/* ------------------------------------------------------------------ */

interface PhaseRound {
  num: string;
  name: string;
  details: string;
  accent: string;
  entropyVal: number;
}

const PHASES: PhaseRound[] = [
  {
    num: "01",
    name: "QUIZ SHORTLIST",
    details:
      "Preliminary screening round evaluating logic and technical fundamentals. Exactly 30 qualifying teams are shortlisted to advance to the Main Event on 3rd October.",
    accent: IVORY,
    entropyVal: 0.05,
  },
  {
    num: "02",
    name: "ROUND 1 — BUILD",
    details:
      "15 Problem Statements are released on a First-Come, First-Served (FCFS) basis. Two teams choosing the same problem become 1v1 rivals, developing complete working solutions from scratch.",
    accent: VIOLET,
    entropyVal: 0.45,
  },
  {
    num: "03",
    name: "ROUND 2 — BREAK & PITCH",
    details:
      "Teams receive 30 minutes to dissect their opponent's project to uncover flaws and technical limits, followed by live judge pitching and direct cross-challenge to crown the winner.",
    accent: EMBER,
    entropyVal: 0.95,
  },
];

function InteractiveBlade({
  phase,
  index,
  onHover,
}: {
  phase: PhaseRound;
  index: number;
  onHover: (target: number) => void;
}) {
  return (
    <motion.div
      onMouseEnter={() => onHover(phase.entropyVal)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="group relative flex flex-row items-start border-t border-[#E8E2D6]/10 py-6 sm:py-8 lg:py-10 transition-all duration-500 cursor-pointer overflow-hidden gap-3.5 sm:gap-8"
    >
      {/* Background Hover Aura Flare */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(800px circle at 0% 50%, ${phase.accent}14, transparent 65%)`,
        }}
      />

      {/* Number */}
      <div className="relative z-10 shrink-0 select-none pt-0.5">
        <span
          className={`${DISPLAY} text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8E2D6]/30 transition-colors duration-300 group-hover:text-white`}
        >
          {phase.num}
        </span>
      </div>

      {/* Monumental Title + Detailed Explanation */}
      <div className="relative z-10 max-w-4xl">
        <h3
          className={`${DISPLAY} text-2xl sm:text-4xl lg:text-6xl font-extrabold uppercase tracking-tight text-white transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2`}
        >
          {phase.name}
        </h3>
        <p
          className={`${MONO} mt-2.5 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/65 transition-colors duration-300 group-hover:text-[#E8E2D6]/90`}
        >
          {phase.details}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Awwwards About Component                                      */
/* ------------------------------------------------------------------ */

export default function About() {
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const cubeStageRef = useRef<HTMLDivElement>(null);
  const [entropy, setEntropy] = useState<number>(0);

  /* Scroll-driven cube fracture: remains solid when entering, breaks as you scroll down past it */
  const { scrollYProgress } = useScroll({
    target: cubeStageRef,
    offset: ["start 45%", "end 15%"],
  });

  const smoothEntropy = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothEntropy, "change", (latest) => {
    if (!reduced) {
      const clamped = Math.max(0, Math.min(1, latest));
      setEntropy(clamped);
    }
  });

  useEffect(() => {
    if (!reduced) {
      const current = Math.max(0, Math.min(1, smoothEntropy.get()));
      setEntropy(current);
    }
  }, [reduced, smoothEntropy]);

  /* Mouse Parallax Coordinates */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      id="about"
      aria-label="About — the BvB philosophy"
      className="relative isolate w-full overflow-hidden bg-[#1A1410] pt-14 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 text-[#E8E2D6]"
    >
      {/* ---------------------------------------------------------- */}
      {/* Background Atmosphere                                      */}
      {/* ---------------------------------------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Kinetic Cursor Spotlight */}
        <motion.div
          className="absolute h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-3xl pointer-events-none"
          style={{
            left: smoothX,
            top: smoothY,
            background:
              "radial-gradient(circle, rgba(139,124,246,0.18) 0%, rgba(196,100,46,0.12) 40%, transparent 70%)",
          }}
        />

        {/* Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.03)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

        {/* Organic Texture Grain */}
        <div className="hidden sm:block absolute inset-0 opacity-[0.045]" style={GRAIN} />

        {/* Circuit Tracks */}
        <CircuitTrack className="top-12 opacity-15" />

        {/* Floating Geometric Shards */}
        <FloatingShards
          shards={ABOUT_SHARDS}
          smoothX={smoothX}
          smoothY={smoothY}
        />
      </div>

      {/* Massive Typographic Backdrop */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute left-0 top-16 select-none text-[18vw] font-black uppercase leading-none tracking-tighter text-[#E8E2D6]/[0.015]`}
      >
        DICHOTOMY
      </span>

      {/* ---------------------------------------------------------- */}
      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* ============================================================ */}
        {/*  MONUMENTAL HERO: VISUAL & KINETIC DUALITY                  */}
        {/* ============================================================ */}
        <div
          ref={cubeStageRef}
          className="mt-4 sm:mt-8 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14"
        >
          {/* Left Column: Monumental Headline (Zero Long Paragraphs) */}
          <div className="lg:col-span-6">
            <h2
              className={`${DISPLAY} text-[clamp(1.85rem,6.5vw,4.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]`}
            >
              <span className={`block ${GRAD_BUILD}`}>Construct to endure.</span>
              <span className={`block ${GRAD_BREAK}`}>Fracture to discover.</span>
            </h2>

            {/* Ultra-Short High-Impact Axiom */}
            <div className="mt-8 border-l-2 border-[#C4642E] pl-4">
              <p className={`${MONO} text-xs sm:text-sm tracking-wide text-[#E8E2D6]/70 uppercase leading-relaxed font-semibold`}>
                Most systems survive in isolation. BvB forces collision.
                Architect under pressure, then execute catastrophic failure testing.
              </p>
            </div>
          </div>

          {/* Right Column: Unique Interactive Duality Engine */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <DualityEngine
              entropy={entropy}
              reduced={reduced}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  THE THREE PHASES: QUIZ, BUILD, BREAK                        */}
        {/* ============================================================ */}
        <div className="mt-14 sm:mt-18">
          <div>
            {PHASES.map((phase, idx) => (
              <InteractiveBlade
                key={phase.num}
                phase={phase}
                index={idx}
                onHover={(val) => setEntropy(val)}
              />
            ))}
            <div className="border-t border-[#E8E2D6]/10" />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  CINEMATIC CREED BANNER                                      */}
        {/* ============================================================ */}
        <div className="mt-12 sm:mt-16 text-center border-t border-b border-[#E8E2D6]/10 py-6 sm:py-8">
          <p
            className={`${DISPLAY} text-lg sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-[#E8E2D6]/90`}
          >
            &ldquo;What can be broken will be broken. What survives becomes the standard.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}