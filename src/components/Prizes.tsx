"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { CircuitTrack, FloatingShards, PRIZE_SHARDS } from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — Space Grotesk & JetBrains Mono                    */
/* ------------------------------------------------------------------ */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const VIOLET = "#8B7CF6";
const EMBER = "#C4642E";
const GOLD = "#F59E0B";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";
const GRAD_GOLD =
  "bg-[linear-gradient(100deg,#F59E0B_10%,#FDE68A_50%,#C4642E_90%)] bg-clip-text text-transparent";

/* ------------------------------------------------------------------ */
/*  Championship Tiers Data — 1st (Apex), 2nd (Build), 3rd (Break)     */
/* ------------------------------------------------------------------ */

interface TierData {
  id: "apex" | "build" | "break";
  rank: string;
  medalName: string;
  title: string;
  amount: string;
  trophyImage: string;
  accent: "gold" | "violet" | "ember";
  accentColor: string;
}

const TIERS: TierData[] = [
  {
    id: "apex",
    rank: "01",
    medalName: "GRAND CHAMPION",
    title: "GRAND APEX",
    amount: "REVEALING SOON",
    trophyImage: "/awwwards_trophy_1st.png",
    accent: "gold",
    accentColor: GOLD,
  },
  {
    id: "build",
    rank: "02",
    medalName: "RUNNER UP",
    title: "BUILD SOVEREIGN",
    amount: "REVEALING SOON",
    trophyImage: "/awwwards_trophy_2nd.png",
    accent: "violet",
    accentColor: VIOLET,
  },
  {
    id: "break",
    rank: "03",
    medalName: "2ND RUNNER UP",
    title: "BREAK ADVERSARY",
    amount: "REVEALING SOON",
    trophyImage: "/awwwards_trophy_3rd.png",
    accent: "ember",
    accentColor: EMBER,
  },
];

/* ------------------------------------------------------------------ */
/*  Main Export: Awwwards-Level Kinetic Prize Pool Showcase           */
/* ------------------------------------------------------------------ */

export default function Prizes() {
  const [selectedTierId, setSelectedTierId] = useState<string>("apex");
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const chamberRef = useRef<HTMLDivElement>(null);

  /* Mouse Spring Physics for 3D Chamber Perspective Tilt & Shards */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const rotateY = useTransform(smoothX, [-300, 300], reduced ? [0, 0] : [-10, 10]);
  const rotateX = useTransform(smoothY, [-250, 250], reduced ? [0, 0] : [9, -9]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const currentTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[0];
  const isApex = currentTier.id === "apex";

  return (
    <section
      id="prizes"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="BvB Prize Pool & Championship Vault"
      className="relative isolate w-full overflow-hidden bg-[#1A1410] py-14 sm:py-20 lg:py-24 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >
      {/* ------------------------------------------------------------ */}
      {/* 1. Background Atmosphere matching Timeline & Rules           */}
      {/* ------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]"
      />

      {/* Atmospheric Ambient Glow Orbs — strictly identical to Timeline and Rules */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-28 h-96 w-96 rounded-full bg-[#8B7CF6]/10 blur-[60px] sm:blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-28 h-96 w-96 rounded-full bg-[#C4642E]/10 blur-[60px] sm:blur-[140px]"
      />

      {/* Orthogonal Circuit Tracks matching Hero, Timeline, Rules, FAQ */}
      <CircuitTrack className="top-1/3 opacity-15" />

      {/* Floating 3D Geometric Shards with Mouse Parallax */}
      <FloatingShards shards={PRIZE_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* Typographic Ambient Watermark */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute -bottom-10 -right-6 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-10 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        PRIZES
      </span>

      {/* ------------------------------------------------------------ */}
      {/* 2. Main Container                                            */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 sm:px-8 lg:px-12">
        {/* ============================================================ */}
        {/*  EDITORIAL HEADER                                            */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[#E8E2D6]/10">
          <div>
            <h2
              className={`${DISPLAY} mt-3 text-[clamp(2.4rem,6.8vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#E8E2D6]`}
            >
              THE <span className={GRAD_BUILD}>SPOILS</span> OF{" "}
              <span className={GRAD_BREAK}>COMBAT</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
              Compete for a grand cash prize pool (revealing soon), bespoke physical trophies for the podium champions, and verified certificates for all participants.
            </p>
          </div>

          {/* Minimalist Aggregate Valuation Hero */}
          <div className="flex flex-col items-start md:items-end shrink-0">
            <span className={`${MONO} text-[10px] text-[#F59E0B] uppercase font-bold tracking-widest`}>
              PRIZE POOL STATUS
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`${DISPLAY} text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${GRAD_GOLD}`}
              >
                REVEALING SOON
              </span>
            </div>
            <span className={`${MONO} text-xs text-[#E8E2D6]/40 uppercase font-semibold mt-0.5`}>
              CASH POOL + TROPHIES + CERTIFICATES
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  ACCOLADES MATRIX: Prize Pool, Trophies, Certificates        */}
        {/* ============================================================ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Prize Pool */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-[#E8E2D6]/12 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#F59E0B]/40"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
            }}
          >
            {/* Cyber Corner Crosshairs */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

            <div>
              <span className={`${MONO} text-[10px] text-[#F59E0B] uppercase font-bold tracking-wider block`}>
                CLASSIFIED CASH VAULT
              </span>
              <h3 className={`${DISPLAY} text-base font-extrabold uppercase text-[#E8E2D6] leading-snug mt-1`}>
                Prize Pool
              </h3>
            </div>
            <p className="mt-2.5 text-xs text-[#E8E2D6]/60 leading-relaxed">
              Grand cash bounty pool to be distributed across 1st, 2nd, and 3rd place champion teams. Exact figures revealing soon.
            </p>
          </div>

          {/* Card 2: Trophies */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-[#E8E2D6]/12 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#8B7CF6]/40"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
            }}
          >
            {/* Cyber Corner Crosshairs */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

            <div>
              <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-wider block`}>
                BESPOKE TROPHIES
              </span>
              <h3 className={`${DISPLAY} text-base font-extrabold uppercase text-[#E8E2D6] leading-snug mt-1`}>
                Championship Trophies
              </h3>
            </div>
            <p className="mt-2.5 text-xs text-[#E8E2D6]/60 leading-relaxed">
              Custom-crafted physical trophies awarded to the top 3 finalists: Grand Apex, Build Sovereign, and Break Adversary.
            </p>
          </div>

          {/* Card 3: Certificates */}
          <div
            className="group relative overflow-hidden rounded-2xl border border-[#E8E2D6]/12 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#C4642E]/40"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
            }}
          >
            {/* Cyber Corner Crosshairs */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

            <div>
              <span className={`${MONO} text-[10px] text-[#C4642E] uppercase font-bold tracking-wider block`}>
                MERIT & PARTICIPATION
              </span>
              <h3 className={`${DISPLAY} text-base font-extrabold uppercase text-[#E8E2D6] leading-snug mt-1`}>
                Official Certificates
              </h3>
            </div>
            <p className="mt-2.5 text-xs text-[#E8E2D6]/60 leading-relaxed">
              Official Certificates of Excellence for podium achievers and accredited participation certificates for all contenders.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  THE MASTER AWWWARDS 3D KINETIC VAULT CHAMBER                */}
        {/* ============================================================ */}
        <div
          ref={chamberRef}
          className="mt-10 relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-[#E8E2D6]/10 p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 124, 246, 0.05) 0%, rgba(22, 16, 28, 0.6) 50%, rgba(196, 100, 46, 0.04) 100%)",
          }}
        >
          {/* Cyber Corner Crosshairs on Showcase Box */}
          <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
          <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
          <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
          <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

          {/* Grid Layout: Center 3D Trophy Showcase & Valuation */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Center: 3D Perspective Floating Trophy Stage */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center">
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[480px] h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                {/* ---------------------------------------------------- */}
                {/* GLOW DIRECTLY BEHIND THE TROPHY                     */}
                {/* ---------------------------------------------------- */}
                <motion.div
                  key={`glow-${currentTier.id}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-[70px] sm:blur-[95px] z-0"
                  style={{
                    background:
                      currentTier.id === "apex"
                        ? "radial-gradient(circle, rgba(245,158,11,0.40) 0%, rgba(196,100,46,0.18) 50%, transparent 72%)"
                        : currentTier.id === "build"
                        ? "radial-gradient(circle, rgba(139,124,246,0.42) 0%, rgba(99,102,241,0.16) 50%, transparent 72%)"
                        : "radial-gradient(circle, rgba(196,100,46,0.42) 0%, rgba(234,88,12,0.18) 50%, transparent 72%)",
                  }}
                />

                {/* Concentric Holographic Laser Pedestal at Base */}
                <div className="pointer-events-none absolute bottom-4 inset-x-0 flex items-center justify-center z-10">
                  <svg viewBox="0 0 400 120" fill="none" className="w-full max-w-[380px] overflow-visible">
                    {/* Outer Rotating Laser Disc */}
                    <motion.ellipse
                      cx="200"
                      cy="60"
                      rx="180"
                      ry="42"
                      stroke={currentTier.accentColor}
                      strokeWidth="1.2"
                      strokeDasharray="8 8"
                      strokeOpacity="0.5"
                      animate={reduced ? {} : { rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                      style={{ transformOrigin: "200px 60px" }}
                    />
                    {/* Inner Counter-Rotating Reticle */}
                    <motion.ellipse
                      cx="200"
                      cy="60"
                      rx="140"
                      ry="32"
                      stroke="#E8E2D6"
                      strokeWidth="0.8"
                      strokeDasharray="4 10"
                      strokeOpacity="0.35"
                      animate={reduced ? {} : { rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      style={{ transformOrigin: "200px 60px" }}
                    />
                    {/* Core Laser Ring */}
                    <ellipse
                      cx="200"
                      cy="60"
                      rx="95"
                      ry="22"
                      stroke={currentTier.accentColor}
                      strokeWidth="1.8"
                      strokeOpacity="0.8"
                    />
                    {/* Laser Crosslines */}
                    <line x1="20" y1="60" x2="60" y2="60" stroke={currentTier.accentColor} strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="340" y1="60" x2="380" y2="60" stroke={currentTier.accentColor} strokeWidth="1" strokeOpacity="0.4" />
                  </svg>
                </div>

                {/* The Genuine 3D Transparent Trophy Image — Layered in Front of Glow */}
                <div className="relative z-20 w-full h-full flex items-center justify-center p-2">
                  <motion.div
                    key={currentTier.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={reduced ? {} : { y: [0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 4.8,
                        ease: "easeInOut",
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={currentTier.trophyImage}
                        alt={currentTier.title}
                        width={540}
                        height={540}
                        priority
                        unoptimized
                        className="max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] w-auto object-contain filter drop-shadow-[0_24px_50px_rgba(0,0,0,0.95)] hover:scale-[1.03] transition-transform duration-500 select-none pointer-events-none"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Right: High-Stakes Valuation & Tier Breakdown */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div
                className="relative overflow-hidden rounded-2xl border border-[#E8E2D6]/12 p-6 sm:p-7 backdrop-blur-xl space-y-5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.75) 50%, rgba(196, 100, 46, 0.05) 100%)",
                }}
              >
                {/* Cyber Corner Crosshairs */}
                <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                <div>
                  <span className={`${MONO} text-xs uppercase text-[#E8E2D6]/50 block font-semibold`}>
                    {currentTier.medalName}
                  </span>
                  <h3 className={`${DISPLAY} text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1`}>
                    {currentTier.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-[#E8E2D6]/10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
                    </span>
                    <span className={`${MONO} text-[10px] font-bold tracking-wider uppercase text-[#F59E0B]`}>
                      BOUNTY LOCKED
                    </span>
                  </div>
                  <span
                    className={`${DISPLAY} text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-1.5 block ${
                      isApex ? GRAD_GOLD : "text-white"
                    }`}
                  >
                    REVEALING SOON
                  </span>
                  <span className={`${MONO} text-[11px] block text-[#E8E2D6]/40 uppercase mt-1`}>
                    CASH GRANT ANNOUNCEMENT PENDING
                  </span>
                </div>

                {/* Accolade Breakdown: Cash, Trophy, Certificate */}
                <div className="pt-4 border-t border-[#E8E2D6]/10 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-[#E8E2D6]/80">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentTier.accentColor }} />
                    <span><strong className="text-white">Cash Bounty:</strong> Direct Grant (Revealing Soon)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#E8E2D6]/80">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentTier.accentColor }} />
                    <span><strong className="text-white">Championship Trophy:</strong> Rank {currentTier.rank} Physical Relic</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#E8E2D6]/80">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: currentTier.accentColor }} />
                    <span><strong className="text-white">Accreditation:</strong> Official Certificate of Excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  SIMULTANEOUS 3-TROPHY ARCHITECTURAL PODIUM STRIP            */}
        {/* ============================================================ */}
        <div className="mt-12 sm:mt-16">
          {/* 3-Column Architectural Plinths (2nd on left, 1st in center elevated, 3rd on right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end">
            {/* 2nd Place (Silver) */}
            {(() => {
              const tier = TIERS[1];
              const isSelected = selectedTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 transition-all duration-500 cursor-pointer backdrop-blur-xl order-2 md:order-1 ${
                    isSelected
                      ? "border-[#8B7CF6]/70 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_24px_-4px_rgba(139,124,246,0.3)] ring-1 ring-[#8B7CF6]/30"
                      : "border-[#E8E2D6]/12 hover:border-[#8B7CF6]/40 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)]"
                  }`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(139, 124, 246, 0.24) 0%, rgba(30, 22, 42, 0.94) 50%, rgba(196, 100, 46, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
                  }}
                >
                  {/* Cyber Corner Crosshairs */}
                  <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`${MONO} text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 text-[#DDD6FE] uppercase`}>
                      SILVER
                    </span>
                    <span className={`${MONO} text-[10px] text-[#E8E2D6]/40 uppercase`}>
                      RUNNER UP
                    </span>
                  </div>

                  {/* Trophy Miniature Showcase */}
                  <div className="h-44 flex items-center justify-center my-2">
                    <Image
                      src={tier.trophyImage}
                      alt={tier.title}
                      width={160}
                      height={160}
                      unoptimized
                      className="max-h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E8E2D6]/10">
                    <div className="flex items-baseline justify-between">
                      <h4 className={`${DISPLAY} text-lg font-bold uppercase text-white`}>
                        {tier.title}
                      </h4>
                      <span className={`${MONO} text-[10px] font-bold px-2 py-0.5 rounded border border-[#E8E2D6]/20 bg-[#E8E2D6]/5 text-[#E8E2D6]/70 uppercase tracking-wider`}>
                        TBA
                      </span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${
                      isSelected ? "text-white" : "text-[#E8E2D6]/80"
                    }`}>
                      REVEALING SOON
                    </span>
                    <div className="mt-2 text-[11px] text-[#E8E2D6]/50">
                      Trophy + Certificate + Cash Prize
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 1st Place (Gold // Grand Apex - Elevated Centerpiece) */}
            {(() => {
              const tier = TIERS[0];
              const isSelected = selectedTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-7 transition-all duration-500 cursor-pointer backdrop-blur-xl order-1 md:order-2 md:-translate-y-4 ${
                    isSelected
                      ? "border-[#F59E0B]/75 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.9),0_0_28px_-4px_rgba(245,158,11,0.3)] ring-1 ring-[#F59E0B]/35"
                      : "border-[#E8E2D6]/18 hover:border-[#F59E0B]/50 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)]"
                  }`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(245, 158, 11, 0.24) 0%, rgba(35, 24, 18, 0.94) 50%, rgba(196, 100, 46, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
                  }}
                >
                  {/* Cyber Corner Crosshairs */}
                  <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`${MONO} text-xs font-black px-3 py-1 rounded-full border border-[#F59E0B]/50 bg-[#F59E0B]/20 text-[#FDE68A] uppercase tracking-wider`}>
                      GOLD CHAMPION
                    </span>
                    <span className={`${MONO} text-[10px] text-[#F59E0B] font-bold uppercase`}>
                      TOP REWARD
                    </span>
                  </div>

                  {/* Trophy Miniature Showcase */}
                  <div className="h-48 flex items-center justify-center my-2">
                    <Image
                      src={tier.trophyImage}
                      alt={tier.title}
                      width={180}
                      height={180}
                      unoptimized
                      className="max-h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_16px_32px_rgba(245,158,11,0.25)]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E8E2D6]/10">
                    <div className="flex items-baseline justify-between">
                      <h4 className={`${DISPLAY} text-xl font-black uppercase text-white`}>
                        {tier.title}
                      </h4>
                      <span className={`${MONO} text-[10px] font-bold px-2 py-0.5 rounded border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FDE68A] uppercase tracking-wider`}>
                        TBA
                      </span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${
                      isSelected ? GRAD_GOLD : "text-[#E8E2D6]/80"
                    }`}>
                      REVEALING SOON
                    </span>
                    <div className="mt-2 text-[11px] text-[#F59E0B]/70 font-medium">
                      Apex Trophy + Certificate of Excellence + Top Cash Bounty
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3rd Place (Bronze) */}
            {(() => {
              const tier = TIERS[2];
              const isSelected = selectedTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 transition-all duration-500 cursor-pointer backdrop-blur-xl order-3 md:order-3 ${
                    isSelected
                      ? "border-[#C4642E]/70 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85),0_0_24px_-4px_rgba(196,100,46,0.3)] ring-1 ring-[#C4642E]/30"
                      : "border-[#E8E2D6]/12 hover:border-[#C4642E]/40 shadow-[0_8px_25px_-8px_rgba(0,0,0,0.6)]"
                  }`}
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(196, 100, 46, 0.24) 0%, rgba(33, 20, 26, 0.94) 50%, rgba(139, 124, 246, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.72) 50%, rgba(196, 100, 46, 0.05) 100%)",
                  }}
                >
                  {/* Cyber Corner Crosshairs */}
                  <span className="pointer-events-none absolute top-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute top-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[8px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`${MONO} text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#C4642E]/40 bg-[#C4642E]/15 text-[#FED7AA] uppercase`}>
                      BRONZE
                    </span>
                    <span className={`${MONO} text-[10px] text-[#E8E2D6]/40 uppercase`}>
                      2ND RUNNER UP
                    </span>
                  </div>

                  {/* Trophy Miniature Showcase */}
                  <div className="h-44 flex items-center justify-center my-2">
                    <Image
                      src={tier.trophyImage}
                      alt={tier.title}
                      width={160}
                      height={160}
                      unoptimized
                      className="max-h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E8E2D6]/10">
                    <div className="flex items-baseline justify-between">
                      <h4 className={`${DISPLAY} text-lg font-bold uppercase text-white`}>
                        {tier.title}
                      </h4>
                      <span className={`${MONO} text-[10px] font-bold px-2 py-0.5 rounded border border-[#E8E2D6]/20 bg-[#E8E2D6]/5 text-[#E8E2D6]/70 uppercase tracking-wider`}>
                        TBA
                      </span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${
                      isSelected ? "text-white" : "text-[#E8E2D6]/80"
                    }`}>
                      REVEALING SOON
                    </span>
                    <div className="mt-2 text-[11px] text-[#E8E2D6]/50">
                      Trophy + Certificate + Cash Prize
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
