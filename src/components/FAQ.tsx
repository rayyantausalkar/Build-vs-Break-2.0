"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Plus } from "lucide-react";
import {
  CircuitTrack,
  FAQ_SHARDS,
  FloatingShards,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — strictly mirrors Navbar, Hero, Contact & Footer    */
/* ------------------------------------------------------------------ */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

/* ------------------------------------------------------------------ */
/*  Minimal High-Signal FAQ Directives                                */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    id: "01",
    question: "WHO CAN COMPETE?",
    summary:
      "Open worldwide to students, engineers, security researchers, and designers. Squads of 1 to 4 operatives.",
  },
  {
    id: "02",
    question: "REMOTE OR IN-PERSON?",
    summary:
      "Hybrid arena format: physical battle stages at AIKTC plus a globally synchronized digital uplink.",
  },
  {
    id: "03",
    question: "WHAT ARE THE TRACKS?",
    summary:
      "Cyber defense, hardened systems, autonomous AI agent infrastructure, and cryptographic protocols.",
  },
  {
    id: "04",
    question: "HOW IS IT SCORED?",
    summary:
      "Evaluated on architectural elegance, algorithmic depth, and resilience under adversarial stress-testing.",
  },
  {
    id: "05",
    question: "FEES & ADMISSION?",
    summary:
      "100% free of charge. Dedicated compute clusters, API access, meals, and mentor architects provided.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  /* Mouse tracking for floating pieces parallax */
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

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#1A1410] px-6 py-24 sm:px-12 lg:px-20 lg:py-32 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >

      {/* Structural Construction Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_85%)]"
      />

      {/* Timeline-style Orthogonal Circuit Trace */}
      <CircuitTrack className="top-1/4" />
      <CircuitTrack className="bottom-1/4 -scale-y-100" />

      {/* Floating Pieces & Shards (Matching Hero & Timeline) */}
      <FloatingShards shards={FAQ_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* Giant Ambient Background Watermark */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute -bottom-10 -left-6 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-15 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        DIRECTIVES
      </span>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* ------------------------------------------------------------ */}
        {/* Section Header: Minimal & Monumental                         */}
        {/* ------------------------------------------------------------ */}
        <div className="text-center">
          <h2
            className={`${DISPLAY} text-3xl font-extrabold uppercase tracking-[-0.03em] sm:text-5xl lg:text-6xl text-[#E8E2D6]`}
          >
            FREQUENTLY ASKED <span className={GRAD_BREAK}>QUESTIONS</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#E8E2D6]/50">
            Answers to usual doubts and questions before you build &amp; break.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Awwwards-Level 3D Tactile Floating Pills                     */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-14 sm:mt-18 space-y-4 sm:space-y-5">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={item.id}
                whileHover={reduced ? {} : { y: -3 }}
                className={`group relative overflow-hidden backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.25rem] transition-all duration-500 select-none ${
                  isOpen
                    ? "border border-[#8B7CF6]/40 shadow-[0_24px_48px_-15px_rgba(0,0,0,0.85)]"
                    : "border border-[#E8E2D6]/12 hover:border-[#8B7CF6]/30 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.75)]"
                }`}
                style={{
                  background: isOpen
                    ? "radial-gradient(ellipse at 35% 25%, #291F38 0%, #1F1729 45%, #181220 75%, #120D1A 100%)"
                    : "radial-gradient(ellipse at 35% 25%, #221A2F 0%, #1A1324 45%, #150F1D 75%, #0F0A15 100%)",
                  boxShadow: isOpen
                    ? "inset -6px -8px 20px rgba(0, 0, 0, 0.85), inset 4px 5px 14px rgba(255, 255, 255, 0.12), inset 0 0 12px rgba(139, 124, 246, 0.15), 0 24px 48px -12px rgba(0, 0, 0, 0.8)"
                    : "inset -4px -6px 16px rgba(0, 0, 0, 0.8), inset 2px 3px 10px rgba(255, 255, 255, 0.08), inset 0 0 6px rgba(139, 124, 246, 0.08), 0 16px 36px -10px rgba(0, 0, 0, 0.7)",
                }}
              >
                {/* 3D Curvature Specular Highlight (Top-Left Gloss) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 28% 20%, rgba(255, 255, 255, 0.14) 0%, rgba(139, 124, 246, 0.08) 26%, transparent 60%)",
                  }}
                />

                {/* 3D Ambient Bounce Light (Bottom-Right Ember Rim) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 76% 82%, rgba(196, 100, 46, 0.1) 0%, transparent 52%)",
                  }}
                />

                {/* Exterior Atmospheric Dual-Color Glow Halo */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-2 rounded-[2.25rem] sm:rounded-[2.5rem] bg-[linear-gradient(135deg,#8B7CF6_0%,transparent_50%,#C4642E_100%)] blur-lg transition-opacity duration-500 ${
                    isOpen ? "opacity-35" : "opacity-0 group-hover:opacity-35"
                  }`}
                />

                {/* 3D Pill Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="relative z-10 flex w-full items-center justify-between px-6 py-4.5 sm:px-9 sm:py-5 text-left outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6 pr-4">
                    {/* Big Clean Index Number */}
                    <span
                      className={`${MONO} text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight select-none transition-colors duration-300 ${
                        isOpen
                          ? "text-[#8B7CF6]"
                          : "text-[#E8E2D6]/30 group-hover:text-[#8B7CF6]/70"
                      }`}
                    >
                      {item.id}
                    </span>

                    {/* Question Title */}
                    <span
                      className={`${DISPLAY} text-base sm:text-lg lg:text-xl font-bold uppercase tracking-tight text-[#E8E2D6] transition-colors duration-300 ${
                        isOpen ? "text-white" : "group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  {/* 3D Orb Toggle Indicator */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${
                      isOpen
                        ? "border-[#8B7CF6] bg-[#8B7CF6] text-[#1A1410] rotate-45 shadow-[0_0_18px_rgba(139,124,246,0.5)]"
                        : "border-[#E8E2D6]/15 bg-[#E8E2D6]/[0.05] text-[#E8E2D6]/70 group-hover:border-[#8B7CF6] group-hover:bg-[#8B7CF6] group-hover:text-[#1A1410] group-hover:scale-105"
                    }`}
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* 3D Expanded Drawer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="relative z-10 px-6 sm:px-9 pb-6 pt-1 sm:pb-7">
                        {/* 1-Sentence High-Signal Summary */}
                        <p className="text-sm sm:text-base leading-relaxed text-[#E8E2D6]/85 font-normal">
                          {item.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



