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
    question: "HOW DOES SHORTLISTING WORK?",
    summary:
      "All registered teams participate in the preliminary Quiz Round. Based on quiz performance, exactly 30 qualifying teams are shortlisted for the Main Event on 3rd October.",
  },
  {
    id: "02",
    question: "WHEN IS THE MAIN EVENT & WHO IS ORGANIZING?",
    summary:
      "The Main Event takes place on 3rd October 2026. Build vs Break is officially organised by Neuronyx | AIML Department.",
  },
  {
    id: "03",
    question: "HOW ARE PROBLEM STATEMENTS ALLOTTED?",
    summary:
      "15 Problem Statements are released on event morning on a strict First-Come, First-Served (FCFS) basis. Two teams selecting the same problem become direct 1v1 opponents.",
  },
  {
    id: "04",
    question: "WHAT HAPPENS IN ROUND 1 (BUILD)?",
    summary:
      "Each team engineers a functional, working solution for their selected Problem Statement from scratch within the allotted morning session, followed by a lunch break.",
  },
  {
    id: "05",
    question: "WHAT HAPPENS IN ROUND 2 (CRACK & CHALLENGE)?",
    summary:
      "Each team receives exactly 30 minutes to dissect their opponent's project, identifying architectural gaps, technical limitations, flaws, and missing features.",
  },
  {
    id: "06",
    question: "HOW DOES FINAL JUDGING & PITCHING WORK?",
    summary:
      "Both competing teams face the judges together: Step 1 — Each team pitches their own solution. Step 2 — Teams present the flaws and loopholes found in their opponent's project to demonstrate why their approach wins.",
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
      className="relative w-full overflow-hidden bg-[#1A1410] px-4 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >

      {/* Structural Construction Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_85%)]"
      />

      {/* Timeline-style Orthogonal Circuit Trace */}
      <CircuitTrack className="top-1/3 opacity-15" />

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
            className={`${DISPLAY} text-2xl sm:text-4xl lg:text-6xl font-extrabold uppercase tracking-[-0.03em] text-[#E8E2D6]`}
          >
            FREQUENTLY ASKED <span className={GRAD_BREAK}>QUESTIONS</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#E8E2D6]/50">
            Answers to usual doubts and questions before you build &amp; break.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Sleek Gradient FAQ Accordion Pills                           */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-14 sm:mt-18 space-y-3.5 sm:space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={item.id}
                whileHover={reduced ? {} : { y: -2 }}
                className={`group relative overflow-hidden backdrop-blur-sm sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl transition-all duration-300 select-none ${
                  isOpen
                    ? "border border-[#8B7CF6]/50 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.7),0_0_24px_-4px_rgba(139,124,246,0.22)]"
                    : "border border-[#E8E2D6]/12 hover:border-[#8B7CF6]/40 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_-6px_rgba(139,124,246,0.18)]"
                }`}
                style={{
                  background: isOpen
                    ? "linear-gradient(115deg, rgba(139, 124, 246, 0.28) 0%, rgba(37, 26, 52, 0.92) 48%, rgba(196, 100, 46, 0.2) 100%)"
                    : "linear-gradient(115deg, rgba(139, 124, 246, 0.14) 0%, rgba(26, 19, 36, 0.8) 50%, rgba(196, 100, 46, 0.1) 100%)",
                }}
              >
                {/* Subtle Ambient Gradient Flow on Hover */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-r from-[#8B7CF6]/20 via-transparent to-[#C4642E]/20 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Pill Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="relative z-10 flex w-full items-center justify-between px-4 py-4 sm:px-9 sm:py-5 text-left outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-6 pr-2 sm:pr-4">
                    {/* Big Clean Index Number */}
                    <span
                      className={`${MONO} text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight select-none transition-colors duration-300 ${
                        isOpen
                          ? "text-[#8B7CF6]"
                          : "text-[#E8E2D6]/30 group-hover:text-[#8B7CF6]/70"
                      }`}
                    >
                      {item.id}
                    </span>

                    {/* Question Title */}
                    <span
                      className={`${DISPLAY} text-sm sm:text-lg lg:text-xl font-bold uppercase tracking-tight text-[#E8E2D6] transition-colors duration-300 ${
                        isOpen ? "text-white" : "group-hover:text-white"
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  {/* Clean Minimalist Toggle Indicator */}
                  <div
                    className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "border-[#8B7CF6] bg-[#8B7CF6] text-[#1A1410] rotate-45 shadow-[0_0_16px_rgba(139,124,246,0.35)]"
                        : "border-[#E8E2D6]/15 bg-[#E8E2D6]/[0.04] text-[#E8E2D6]/70 group-hover:border-[#8B7CF6]/60 group-hover:bg-[#8B7CF6]/15 group-hover:text-[#8B7CF6]"
                    }`}
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Expanded Drawer Content */}
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
                      <div className="relative z-10 px-4 sm:px-9 pb-5 pt-1 sm:pb-7">
                        {/* 1-Sentence High-Signal Summary */}
                        <p className="text-xs sm:text-base leading-relaxed text-[#E8E2D6]/85 font-normal">
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



