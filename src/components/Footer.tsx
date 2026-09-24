"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  CircuitTrack,
  FloatingShards,
  FOOTER_SHARDS,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — strictly mirrors Navbar.tsx & Hero.tsx            */
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
/*  Magnetic 3D Sphere Bubble CTA                                     */
/* ------------------------------------------------------------------ */

interface MagneticSphereProps {
  onSelect: (e: React.MouseEvent) => void;
}

function MagneticSphere({ onSelect }: MagneticSphereProps) {
  const reduced = Boolean(useReducedMotion());
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Position offsets for magnetic pull & 3D tilt
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 18, mass: 0.15 };
  const bx = useSpring(rawX, springConfig);
  const by = useSpring(rawY, springConfig);
  const rotX = useSpring(rawRotX, springConfig);
  const rotY = useSpring(rawRotY, springConfig);

  // Parallax text inside sphere
  const tx = useSpring(useTransform(rawX, (v) => v * 0.4), springConfig);
  const ty = useSpring(useTransform(rawY, (v) => v * 0.4), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const diffX = e.clientX - centerX;
    const diffY = e.clientY - centerY;

    // Follow cursor: magnetic pull up to ±36px
    rawX.set(diffX * 0.38);
    rawY.set(diffY * 0.38);

    // 3D sphere tilt: up to ±15 deg
    rawRotX.set(-diffY * 0.14);
    rawRotY.set(diffX * 0.14);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotX.set(0);
    rawRotY.set(0);
  };

  return (
    <div
      ref={bubbleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-6 sm:p-10 cursor-pointer"
    >
      {/* 3D Sphere Ambient Shadow on Ground Plane */}
      <motion.div
        aria-hidden="true"
        style={{ x: reduced ? 0 : bx }}
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 h-8 w-32 sm:w-44 rounded-[100%] bg-black/60 blur-xl transition-opacity duration-300"
      />

      <motion.div
        style={{
          x: reduced ? 0 : bx,
          y: reduced ? 0 : by,
          rotateX: reduced ? 0 : rotX,
          rotateY: reduced ? 0 : rotY,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.94 }}
        className="relative"
      >
        <a
          href="#contact"
          onClick={onSelect}
          className="group relative flex h-40 w-40 sm:h-48 sm:w-48 flex-col items-center justify-center overflow-hidden rounded-full transition-transform duration-300 select-none"
          style={{
            /* 3D Sphere volumetric lighting and shadows */
            background:
              "radial-gradient(circle at 35% 28%, #4A3A68 0%, #2A1F3D 38%, #1A1326 72%, #0E0A16 100%)",
            boxShadow:
              "inset -14px -16px 36px rgba(0, 0, 0, 0.92), inset 8px 10px 24px rgba(232, 226, 214, 0.22), inset 0 0 16px rgba(139, 124, 246, 0.35), 0 28px 56px -12px rgba(0, 0, 0, 0.85)",
          }}
        >
          {/* 3D Curvature Specular Highlight (Top-Left Gloss) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.45) 0%, rgba(139, 124, 246, 0.25) 26%, transparent 60%)",
            }}
          />

          {/* 3D Ambient Bounce Light (Bottom-Right Ember Rim) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 74% 78%, rgba(196, 100, 46, 0.28) 0%, transparent 52%)",
            }}
          />

          {/* Exterior Atmospheric Glow Halo */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-full bg-[linear-gradient(135deg,#8B7CF6_0%,transparent_50%,#C4642E_100%)] opacity-30 blur-lg transition-opacity duration-500 group-hover:opacity-85"
          />

          {/* Liquid Reactive Expansion on Hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 scale-0 rounded-full bg-[#8B7CF6] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 opacity-90 motion-reduce:transition-none"
          />

          {/* Parallax Floating Text / Icon inside 3D Sphere */}
          <motion.span
            style={{ x: reduced ? 0 : tx, y: reduced ? 0 : ty }}
            className="relative z-10 flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 group-hover:text-[#1A1410]"
          >
            <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:translate-x-1.5" />
            <span
              className={`${DISPLAY} text-center text-xs sm:text-sm font-black uppercase tracking-[0.2em] leading-tight`}
            >
              JOIN THE
              <br />
              ARENA
            </span>
          </motion.span>
        </a>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer Component                                                   */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const reduced = Boolean(useReducedMotion());
  const footerRef = useRef<HTMLElement>(null);

  /* Mouse tracking for atmospheric spotlight */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 24 });


  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = footerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof window !== "undefined" && window.__lenis && !reduced) {
      window.__lenis.scrollTo(el, { offset: -88, duration: 1.15 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col justify-between overflow-hidden bg-[#1A1410] px-4 pt-12 pb-10 sm:px-12 lg:px-20 lg:pt-16 lg:pb-12 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >
      {/* Subtle Construction Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_85%)]"
      />

      {/* Timeline-style Orthogonal Circuit Trace */}
      <CircuitTrack className="top-1/4 opacity-15" />

      {/* Floating Pieces & Shards (Matching Hero & Timeline) */}
      <FloatingShards shards={FOOTER_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* ------------------------------------------------------------ */}
      {/* Top Header: Credits                                          */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 mb-6 flex items-center justify-start">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8B7CF6] shadow-[0_0_8px_#8B7CF6]" />
          <p className={`${MONO} text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#E8E2D6]/70`}>
            Organised by{" "}
            <span className="font-semibold text-[#8B7CF6]">
              Neuronyx | AIML Department
            </span>{" "}
            · Created by Technical Team of ACM NeurOnyx
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Centerpiece: Monumental Interactive Kinetic Typography       */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 py-6 sm:py-10 text-center">
        {/* Giant Kinetic Interactive Title */}
        <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:gap-x-12 select-none">
          {/* BUILD */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact");
              if (!el) return;
              if (typeof window !== "undefined" && window.__lenis && !reduced) {
                window.__lenis.scrollTo(el, { offset: -88, duration: 1.15 });
              } else {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`group/build ${DISPLAY} relative block text-[clamp(2.5rem,13vw,11.5rem)] font-extrabold uppercase leading-none tracking-[-0.04em] outline-none transition-transform duration-500 hover:scale-[1.03] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`}
          >
            {/* Ambient soft glow */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-3xl bg-[#8B7CF6]/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover/build:opacity-100"
            />
            {/* Base solid layer - always visible, smoothly softens on hover */}
            <span className="block text-[#E8E2D6] transition-opacity duration-500 group-hover/build:opacity-30">
              BUILD
            </span>
            {/* Gradient glow layer - crossfades in smoothly over the base */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 block bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent opacity-0 transition-opacity duration-500 group-hover/build:opacity-100"
            >
              BUILD
            </span>
          </button>

          {/* Central VS Divider */}
          <div className="flex items-center gap-3 sm:gap-4 select-none my-auto">
            <span
              className={`${DISPLAY} text-xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-widest text-[#C4642E]`}
            >
              VS
            </span>
          </div>

          {/* BREAK */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("contact");
              if (!el) return;
              if (typeof window !== "undefined" && window.__lenis && !reduced) {
                window.__lenis.scrollTo(el, { offset: -88, duration: 1.15 });
              } else {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`group/break ${DISPLAY} relative block text-[clamp(2.5rem,13vw,11.5rem)] font-extrabold uppercase leading-none tracking-[-0.04em] outline-none transition-transform duration-500 hover:scale-[1.03] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`}
          >
            {/* Ambient soft glow */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-3xl bg-[#C4642E]/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover/break:opacity-100"
            />
            {/* Base solid layer - always visible, smoothly softens on hover */}
            <span className="block text-[#E8E2D6] transition-opacity duration-500 group-hover/break:opacity-30">
              BREAK
            </span>
            {/* Gradient glow layer - crossfades in smoothly over the base */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 block bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent opacity-0 transition-opacity duration-500 group-hover/break:opacity-100"
            >
              BREAK
            </span>
          </button>
        </div>

        {/* Action Prompt — Magnetic 3D Sphere Bubble CTA */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <MagneticSphere onSelect={(e) => scrollToSection("contact", e)} />
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Bottom Bar: Brand & Copyright                                */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 pt-8 border-t border-[#E8E2D6]/10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span
            className={`${DISPLAY} text-xl font-bold tracking-tight text-[#E8E2D6]`}
          >
            Build <span className="text-[#C4642E]">vs</span> Break
          </span>
          <span className={`${MONO} text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#E8E2D6]/50 text-center sm:text-right`}>
            © {new Date().getFullYear()} BUILD VS BREAK. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
