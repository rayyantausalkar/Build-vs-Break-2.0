"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  CircuitTrack,
  FloatingShards,
  RULES_SHARDS,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — strictly mirrors Hero, Timeline, FAQ, Contact    */
/* ------------------------------------------------------------------ */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

/* ------------------------------------------------------------------ */
/*  Minimalist Directives                                             */
/* ------------------------------------------------------------------ */

interface Directive {
  id: string;
  num: string;
  phase: string;
  accent: "violet" | "ember";
  accentColor: string;
  tag: string;
  axiom: string;
}

const DIRECTIVES: Directive[] = [
  {
    id: "d1",
    num: "01",
    phase: "BUILD",
    accent: "violet",
    accentColor: "#8B7CF6",
    tag: "ZERO PRE-BUILT CODE",
    axiom: "Author everything live. Boilerplates and private repos are strictly prohibited.",
  },
  {
    id: "d2",
    num: "02",
    phase: "BREAK",
    accent: "ember",
    accentColor: "#C4642E",
    tag: "ADVERSARIAL RIGOR",
    axiom: "Simulated chaos testing. Your systems must withstand malicious fuzzing.",
  },
  {
    id: "d3",
    num: "03",
    phase: "OPEN",
    accent: "violet",
    accentColor: "#8B7CF6",
    tag: "PUBLIC ECOSYSTEM",
    axiom: "Leverage open models and FOSS libraries. 100% full SBOM attribution required.",
  },
  {
    id: "d4",
    num: "04",
    phase: "INTEGRITY",
    accent: "ember",
    accentColor: "#C4642E",
    tag: "ZERO SABOTAGE",
    axiom: "Zero interference with rival squads. Any foul triggers instant disqualification.",
  },
  {
    id: "d5",
    num: "05",
    phase: "DEPLOY",
    accent: "violet",
    accentColor: "#8B7CF6",
    tag: "REPRODUCIBLE DEPLOY",
    axiom: "Submissions must build and execute live. Automated setup and containerized runtimes required.",
  },
  {
    id: "d6",
    num: "06",
    phase: "OWNERSHIP",
    accent: "ember",
    accentColor: "#C4642E",
    tag: "FULL SQUAD SOVEREIGNTY",
    axiom: "Squads retain 100% intellectual property. Zero claim on code, models, or IP created.",
  },
];

/* ------------------------------------------------------------------ */
/*  Isometric Vector Interactive Micro-Illustrations                  */
/* ------------------------------------------------------------------ */

function DirectiveVectorVisual({
  phase,
  accent,
  isHovered,
}: {
  phase: string;
  accent: "violet" | "ember";
  isHovered: boolean;
}) {
  const isViolet = accent === "violet";
  const color = isViolet ? "#8B7CF6" : "#C4642E";

  if (phase === "BUILD") {
    return (
      <svg
        viewBox="0 0 160 140"
        fill="none"
        className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
      >
        {/* Isometric base grid floor */}
        <polygon points="80,95 130,120 80,145 30,120" stroke="#E8E2D6" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.25" />
        {/* Assembling Cube Isometric Faces */}
        <g className={`transition-all duration-700 ${isHovered ? "translate-y-[-4px]" : "translate-y-0"}`}>
          {/* Top Face */}
          <polygon
            points="80,30 120,52 80,74 40,52"
            fill={color}
            fillOpacity={isHovered ? 0.25 : 0.12}
            stroke={color}
            strokeWidth="1.4"
          />
          {/* Left Face */}
          <polygon
            points="40,52 80,74 80,116 40,94"
            fill={color}
            fillOpacity={isHovered ? 0.15 : 0.06}
            stroke={color}
            strokeWidth="1.4"
          />
          {/* Right Face */}
          <polygon
            points="120,52 80,74 80,116 120,94"
            fill={color}
            fillOpacity={isHovered ? 0.08 : 0.03}
            stroke={color}
            strokeWidth="1.4"
          />
        </g>
        {/* Hovering Fragment descending */}
        <g className={`transition-all duration-700 ${isHovered ? "translate-y-4 opacity-100" : "-translate-y-3 opacity-60"}`}>
          <polygon points="80,10 102,22 80,34 58,22" fill="#E8E2D6" fillOpacity="0.3" stroke="#E8E2D6" strokeWidth="1" />
          <line x1="80" y1="10" x2="80" y2="40" stroke="#E8E2D6" strokeWidth="0.8" strokeDasharray="1.5 2" strokeOpacity="0.6" />
        </g>
        <circle cx="80" cy="74" r="2.5" fill="#E8E2D6" />
      </svg>
    );
  }

  if (phase === "BREAK") {
    return (
      <svg
        viewBox="0 0 160 140"
        fill="none"
        className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
      >
        {/* Fractured isometric stress geometry */}
        <g className={`transition-all duration-700 ${isHovered ? "translate-x-1" : "translate-x-0"}`}>
          <polygon
            points="76,34 116,56 82,78 42,56"
            fill={color}
            fillOpacity={isHovered ? 0.28 : 0.12}
            stroke={color}
            strokeWidth="1.4"
          />
          <polygon
            points="42,56 82,78 78,118 38,96"
            fill={color}
            fillOpacity={isHovered ? 0.16 : 0.06}
            stroke={color}
            strokeWidth="1.4"
          />
        </g>
        {/* Displaced fractured shard */}
        <g className={`transition-all duration-700 ${isHovered ? "translate-x-2 -translate-y-2" : "translate-x-0"}`}>
          <polygon
            points="88,38 126,58 122,96 84,78"
            fill={color}
            fillOpacity={isHovered ? 0.35 : 0.18}
            stroke={color}
            strokeWidth="1.4"
          />
        </g>
        {/* Dynamic lightning stress impulse line */}
        <path
          d="M80,14 L68,44 L86,48 L72,82 L84,86 L66,126"
          stroke="#E8E2D6"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isHovered ? "animate-pulse" : "opacity-70"}
        />
        <circle cx="72" cy="82" r="3" fill={color} />
      </svg>
    );
  }

  if (phase === "OPEN") {
    return (
      <svg
        viewBox="0 0 160 140"
        fill="none"
        className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
      >
        {/* Layered stack planes with connecting data buslines */}
        <polygon points="80,24 126,46 80,68 34,46" fill={color} fillOpacity={isHovered ? 0.25 : 0.12} stroke={color} strokeWidth="1.2" />
        <polygon points="80,50 126,72 80,94 34,72" fill={color} fillOpacity={isHovered ? 0.18 : 0.08} stroke={color} strokeWidth="1.2" />
        <polygon points="80,76 126,98 80,120 34,98" fill={color} fillOpacity={isHovered ? 0.12 : 0.04} stroke={color} strokeWidth="1.2" />
        {/* Vertical interconnect bus nodes */}
        <line x1="34" y1="46" x2="34" y2="98" stroke="#E8E2D6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="126" y1="46" x2="126" y2="98" stroke="#E8E2D6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="80" y1="68" x2="80" y2="120" stroke="#E8E2D6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
        {/* Floating node orbs */}
        <circle cx="80" cy="24" r="3" fill="#E8E2D6" />
        <circle cx="126" cy="72" r="3" fill={color} />
        <circle cx="34" cy="98" r="3" fill={color} />
      </svg>
    );
  }

  if (phase === "INTEGRITY") {
    return (
      <svg
        viewBox="0 0 160 140"
        fill="none"
        className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
      >
        {/* Concentric Cryptographic Shield & Reticle */}
        <polygon
          points="80,16 124,38 124,84 80,118 36,84 36,38"
          fill={color}
          fillOpacity={isHovered ? 0.22 : 0.08}
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Rotating concentric radar circle */}
        <circle
          cx="80"
          cy="64"
          r="28"
          stroke="#E8E2D6"
          strokeWidth="1"
          strokeDasharray="4 4"
          strokeOpacity={isHovered ? 0.8 : 0.4}
          className={isHovered ? "animate-spin [animation-duration:12s]" : ""}
        />
        {/* Target lock core */}
        <polygon points="80,50 92,64 80,78 68,64" fill={color} fillOpacity="0.8" />
        <circle cx="80" cy="64" r="3" fill="#E8E2D6" />
        {/* Corner target reticles */}
        <path d="M48,46 L48,38 L56,38" stroke="#E8E2D6" strokeWidth="1" strokeOpacity="0.6" />
        <path d="M112,46 L112,38 L104,38" stroke="#E8E2D6" strokeWidth="1" strokeOpacity="0.6" />
        <path d="M48,76 L48,84 L56,84" stroke="#E8E2D6" strokeWidth="1" strokeOpacity="0.6" />
        <path d="M112,76 L112,84 L104,84" stroke="#E8E2D6" strokeWidth="1" strokeOpacity="0.6" />
      </svg>
    );
  }

  if (phase === "DEPLOY") {
    return (
      <svg
        viewBox="0 0 160 140"
        fill="none"
        className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
      >
        {/* Launchpad base and vertical telemetry beam */}
        <polygon points="80,105 130,125 80,145 30,125" stroke={color} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
        <ellipse cx="80" cy="115" rx="36" ry="14" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" />
        {/* Floating containerized server node */}
        <g className={`transition-all duration-700 ${isHovered ? "translate-y-[-6px]" : "translate-y-0"}`}>
          <polygon points="80,45 115,62 80,80 45,62" fill={color} fillOpacity={isHovered ? 0.3 : 0.15} stroke={color} strokeWidth="1.3" />
          <polygon points="45,62 80,80 80,108 45,90" fill={color} fillOpacity={isHovered ? 0.2 : 0.08} stroke={color} strokeWidth="1.3" />
          <polygon points="115,62 80,80 80,108 115,90" fill={color} fillOpacity={isHovered ? 0.12 : 0.04} stroke={color} strokeWidth="1.3" />
        </g>
        {/* Upward transmission radio arcs */}
        <path d="M60,34 Q80,24 100,34" stroke="#E8E2D6" strokeWidth="1.2" strokeOpacity={isHovered ? 0.9 : 0.5} strokeLinecap="round" />
        <path d="M50,22 Q80,10 110,22" stroke="#E8E2D6" strokeWidth="1.2" strokeOpacity={isHovered ? 0.7 : 0.3} strokeLinecap="round" />
        <circle cx="80" cy="45" r="2.5" fill="#E8E2D6" />
      </svg>
    );
  }

  // OWNERSHIP / SOVEREIGNTY
  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      className="w-full h-full overflow-visible transition-transform duration-700 group-hover:scale-105"
    >
      {/* Isometric sovereign key & cryptographic seal */}
      <polygon
        points="80,20 120,40 120,86 80,114 40,86 40,40"
        fill={color}
        fillOpacity={isHovered ? 0.22 : 0.08}
        stroke={color}
        strokeWidth="1.4"
      />
      {/* Concentric diamond seal */}
      <polygon
        points="80,38 104,58 80,78 56,58"
        stroke="#E8E2D6"
        strokeWidth="1.2"
        strokeDasharray="2 3"
        strokeOpacity={isHovered ? 0.8 : 0.4}
      />
      {/* Core sovereign emblem */}
      <circle cx="80" cy="58" r="8" fill={color} fillOpacity="0.7" stroke="#E8E2D6" strokeWidth="1" />
      {/* Anchor nodes */}
      <circle cx="80" cy="20" r="2.5" fill="#E8E2D6" />
      <circle cx="80" cy="114" r="2.5" fill={color} />
      <line x1="80" y1="78" x2="80" y2="104" stroke="#E8E2D6" strokeWidth="1.2" />
      <line x1="74" y1="92" x2="86" y2="92" stroke="#E8E2D6" strokeWidth="1.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Rules Section                                                */
/* ------------------------------------------------------------------ */

export default function Rules() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  /* Mouse tracking for ambient parallax */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="rules"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full py-14 sm:py-20 lg:py-24 overflow-hidden bg-[#1A1410] text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >
      {/* ------------------------------------------------------------ */}
      {/* Structural Construction Grid & Ambient Horizon              */}
      {/* ------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]"
      />

      {/* Atmospheric Ambient Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-[#8B7CF6]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-[#C4642E]/10 blur-[130px]"
      />

      {/* Orthogonal Circuit Track Traces matching Hero, Timeline, FAQ */}
      <CircuitTrack className="top-1/3 opacity-15" />

      {/* Floating 3D Geometric Shards */}
      <FloatingShards shards={RULES_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* Monumental Typographic Ambient Watermark */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute -bottom-12 -right-8 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-10 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        DIRECTIVES
      </span>

      {/* ------------------------------------------------------------ */}
      {/* Section Content                                              */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12">
        {/* Section Header: Minimal, High-Impact & Editorial */}
        <div className="pb-12 border-b border-[#E8E2D6]/10">
          <h2
            className={`${DISPLAY} text-3xl font-extrabold uppercase tracking-tight text-[#E8E2D6] sm:text-5xl lg:text-6xl`}
          >
            SIX RULES. <span className={GRAD_BREAK}>ZERO EXCEPTIONS.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
            System integrity is non-negotiable. Review the foundational guidelines before deploying into the arena.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Kinetic 6-Column / 2-Row Monolithic Architectural Slabs       */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-12 sm:mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTIVES.map((d, idx) => {
            const isHovered = activeIdx === idx;
            const isAnyHovered = activeIdx !== null;
            const isDimmed = isAnyHovered && !isHovered;
            const isViolet = d.accent === "violet";

            return (
              <motion.div
                key={d.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                whileHover={reduced ? {} : { y: -4 }}
                transition={{ duration: 0.3 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-500 cursor-pointer select-none border ${
                  isHovered
                    ? isViolet
                      ? "border-[#8B7CF6]/60 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(139,124,246,0.3)]"
                      : "border-[#C4642E]/60 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(196,100,46,0.3)]"
                    : isDimmed
                    ? "border-[#E8E2D6]/8 opacity-45"
                    : "border-[#E8E2D6]/12 hover:border-[#8B7CF6]/40 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)]"
                }`}
                style={{
                  background: isHovered
                    ? isViolet
                      ? "linear-gradient(135deg, rgba(139, 124, 246, 0.25) 0%, rgba(33, 23, 46, 0.92) 50%, rgba(196, 100, 46, 0.12) 100%)"
                      : "linear-gradient(135deg, rgba(196, 100, 46, 0.25) 0%, rgba(36, 21, 28, 0.92) 50%, rgba(139, 124, 246, 0.12) 100%)"
                    : "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.75) 50%, rgba(196, 100, 46, 0.05) 100%)",
                }}
              >
                {/* Cyber Corner Crosshairs */}
                <span className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute top-3 right-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute bottom-3 left-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute bottom-3 right-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                {/* Top Subtle Scanner Line on Hover */}
                {isHovered && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-0 right-0 h-0.5 animate-pulse"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${d.accentColor}, transparent)`,
                    }}
                  />
                )}

                <div>
                  {/* Slab Header: Giant Mono Number */}
                  <div className="border-b border-[#E8E2D6]/10 pb-4">
                    <span className={`${MONO} text-4xl sm:text-5xl font-extrabold tracking-tight text-[#E8E2D6] block transition-colors group-hover:text-white`}>
                      {d.num}
                    </span>
                  </div>

                  {/* Center Vector Visual: Dynamic Blueprint Graphics */}
                  <div className="my-6 h-36 w-full flex items-center justify-center">
                    <DirectiveVectorVisual
                      phase={d.phase}
                      accent={d.accent}
                      isHovered={isHovered}
                    />
                  </div>

                  {/* Punchy Editorial Rule Tag & Axiom (Zero Text Bloat!) */}
                  <div>
                    <h3 className={`${DISPLAY} text-lg sm:text-xl font-bold uppercase tracking-tight text-white`}>
                      {d.tag}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/70 font-normal">
                      {d.axiom}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
