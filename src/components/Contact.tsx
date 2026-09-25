"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  CircuitTrack,
  CONTACT_SHARDS,
  FloatingShards,
} from "./FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — strictly mirrors Navbar, Hero & Footer             */
/* ------------------------------------------------------------------ */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

const TARGET_EMAIL = "neuronyx.aiml@aiktc.ac.in";

/* ------------------------------------------------------------------ */
/*  Custom High-Fidelity Vibrant Brand Icons                          */
/* ------------------------------------------------------------------ */

function WhatsAppIcon({ className = "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="url(#wa-vibrant-grad)"
      className={`${className} drop-shadow-[0_0_18px_rgba(37,211,102,0.7)]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wa-vibrant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#25D366" />
          <stop offset="100%" stopColor="#128C7E" />
        </linearGradient>
      </defs>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#ig-vibrant-grad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} drop-shadow-[0_0_20px_rgba(225,48,108,0.75)]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ig-vibrant-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FD5949" />
          <stop offset="25%" stopColor="#E1306C" />
          <stop offset="55%" stopColor="#C13584" />
          <stop offset="80%" stopColor="#833AB4" />
          <stop offset="100%" stopColor="#5851DB" />
        </linearGradient>
      </defs>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="url(#li-vibrant-grad)"
      className={`${className} drop-shadow-[0_0_18px_rgba(0,160,220,0.75)]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="li-vibrant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="45%" stopColor="#00A0DC" />
          <stop offset="100%" stopColor="#0A66C2" />
        </linearGradient>
      </defs>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic 3D Circular Orb Component                                */
/* ------------------------------------------------------------------ */

interface MagneticPodProps {
  label: string;
  href: string;
  glow: string;
  podBg: string;
  hoverCore: string;
  children: React.ReactNode;
}

function MagneticPod({
  label,
  href,
  glow,
  podBg,
  hoverCore,
  children,
}: MagneticPodProps) {
  const reduced = Boolean(useReducedMotion());
  const podRef = useRef<HTMLDivElement>(null);

  // Magnetic cursor pull & 3D tilt coordinates
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 18, mass: 0.15 };
  const bx = useSpring(rawX, springConfig);
  const by = useSpring(rawY, springConfig);
  const rotX = useSpring(rawRotX, springConfig);
  const rotY = useSpring(rawRotY, springConfig);

  // Parallax float for interior holographic icon
  const iconX = useSpring(useTransform(rawX, (v) => v * 0.5), springConfig);
  const iconY = useSpring(useTransform(rawY, (v) => v * 0.5), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = podRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const diffX = e.clientX - centerX;
    const diffY = e.clientY - centerY;

    // Follow cursor: magnetic pull up to ±32px
    rawX.set(diffX * 0.35);
    rawY.set(diffY * 0.35);

    // 3D tilt: up to ±16 deg
    rawRotX.set(-diffY * 0.16);
    rawRotY.set(diffX * 0.16);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawRotX.set(0);
    rawRotY.set(0);
  };

  return (
    <div
      ref={podRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-3 sm:p-5 cursor-pointer"
    >
      {/* 3D Ambient Drop Shadow on Floor Plane */}
      <motion.div
        aria-hidden="true"
        style={{ x: reduced ? 0 : bx }}
        className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-24 sm:w-36 rounded-full bg-black/80 blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
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
        whileTap={{ scale: 0.93 }}
        className="relative"
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group relative flex h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 items-center justify-center overflow-hidden rounded-full backdrop-blur-sm sm:backdrop-blur-2xl transition-all duration-500 select-none hover:shadow-[0_28px_60px_-15px_rgba(0,0,0,0.9)]"
          style={{
            background: podBg,
            boxShadow:
              "inset -10px -12px 28px rgba(0,0,0,0.85), inset 6px 8px 20px rgba(255,255,255,0.14), 0 24px 48px -12px rgba(0,0,0,0.8)",
          }}
        >
          {/* Specular 3D Curvature Highlight on Top-Left */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 36%, transparent 64%)",
            }}
          />

          {/* Exterior Atmospheric Halo on Hover */}
          <span
            aria-hidden="true"
            style={{ background: glow }}
            className="pointer-events-none absolute -inset-4 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Liquid Reactive Expansion on Hover */}
          <span
            aria-hidden="true"
            style={{ background: hoverCore }}
            className="pointer-events-none absolute inset-0 scale-0 rounded-full opacity-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100"
          />

          {/* Parallax Floating 3D Vector Icon */}
          <motion.div
            style={{ x: reduced ? 0 : iconX, y: reduced ? 0 : iconY }}
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            {children}
          </motion.div>
        </a>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Social Channels Configuration (Vibrant Colors & Halos)             */
/* ------------------------------------------------------------------ */

const SOCIAL_CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VbBAGiJ8kyyNrMOz1I0P",
    glow: "radial-gradient(circle at center, rgba(37,211,102,0.6) 0%, rgba(18,140,126,0.3) 50%, transparent 72%)",
    podBg:
      "radial-gradient(circle at 45% 35%, rgba(37,211,102,0.22) 0%, rgba(16,24,20,0.95) 70%, #0B100E 100%)",
    hoverCore:
      "radial-gradient(circle at center, rgba(37,211,102,0.32) 0%, rgba(37,211,102,0.1) 70%, transparent 100%)",
    icon: (
      <WhatsAppIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 transition-transform duration-300" />
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/neuronyx_aiktc/",
    glow: "radial-gradient(circle at center, rgba(225,48,108,0.65) 0%, rgba(139,124,246,0.45) 45%, transparent 72%)",
    podBg:
      "radial-gradient(circle at 45% 35%, rgba(225,48,108,0.24) 0%, rgba(32,18,36,0.95) 70%, #100A14 100%)",
    hoverCore:
      "radial-gradient(circle at center, rgba(225,48,108,0.35) 0%, rgba(139,124,246,0.16) 65%, transparent 100%)",
    icon: (
      <InstagramIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 transition-transform duration-300" />
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/neuronyx-club/posts/",
    glow: "radial-gradient(circle at center, rgba(0,160,220,0.65) 0%, rgba(10,102,194,0.4) 50%, transparent 72%)",
    podBg:
      "radial-gradient(circle at 45% 35%, rgba(0,119,181,0.24) 0%, rgba(14,22,36,0.95) 70%, #080D14 100%)",
    hoverCore:
      "radial-gradient(circle at center, rgba(0,160,220,0.32) 0%, rgba(10,102,194,0.1) 65%, transparent 100%)",
    icon: (
      <LinkedinIcon className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 transition-transform duration-300" />
    ),
  },
];

export default function Contact() {
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  /* Mouse spotlight tracking matching Hero & Footer */
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

  const copyEmail = () => {
    navigator.clipboard?.writeText(TARGET_EMAIL);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-[#1A1410] px-4 py-14 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white"
    >
      {/* Structural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_85%)]"
      />

      {/* Timeline-style Orthogonal Circuit Trace */}
      <CircuitTrack className="top-1/3 opacity-15" />

      {/* Floating Pieces & Shards (Matching Hero & Timeline) */}
      <FloatingShards shards={CONTACT_SHARDS} smoothX={smoothX} smoothY={smoothY} />

      {/* Giant Ambient Watermark */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none absolute -bottom-8 -right-4 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-20 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        UPLINK
      </span>

      {/* ------------------------------------------------------------ */}
      {/* Centerpiece: Monumental Kinetic Email & Invitation           */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 text-center">
        {/* Kinetic Hook */}
        <h2
          className={`${DISPLAY} text-2xl sm:text-4xl lg:text-6xl font-extrabold uppercase tracking-[-0.03em] text-[#E8E2D6]/80`}
        >
          Have doubts about the <span className={GRAD_BUILD}>event</span>?
          <br />
          Or questions before you <span className={GRAD_BREAK}>build & break</span>?
        </h2>

        {/* Monumental Interactive Email Link with 3D Rounded Rectangle Plinth */}
        <div className="mt-10 sm:mt-14 inline-block max-w-full">
          <a
            href={`mailto:${TARGET_EMAIL}`}
            onClick={copyEmail}
            className="group relative inline-flex items-center justify-center rounded-2xl sm:rounded-[2.25rem] border border-[#8B7CF6]/45 bg-[#1F1729]/90 px-4 py-3.5 sm:px-10 sm:py-6 lg:px-14 lg:py-7 backdrop-blur-sm sm:backdrop-blur-2xl outline-none select-none max-w-full transition-transform duration-300 hover:scale-[1.01]"
            style={{
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.22), inset 0 -6px 16px rgba(0,0,0,0.85), 0 20px 50px -15px rgba(0,0,0,0.85), 0 0 35px rgba(139,124,246,0.25)",
            }}
            aria-label={`Send email to ${TARGET_EMAIL}`}
          >
            {/* Top Specular Curved Highlight Sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-[inherit] bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent opacity-80"
            />

            {/* Ambient Dual-Color Halo Active by Default */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 rounded-[inherit] bg-[linear-gradient(135deg,#8B7CF6_0%,transparent_50%,#C4642E_100%)] opacity-45 blur-2xl"
            />

            {/* Email Display Container */}
            <div className="relative z-10 inline-block max-w-full">
              <span
                className={`${DISPLAY} block text-[clamp(0.95rem,3.8vw,3rem)] sm:text-[clamp(1.4rem,3.6vw,3.4rem)] font-extrabold uppercase leading-tight tracking-[-0.03em] bg-[linear-gradient(100deg,#8B7CF6_10%,#E8E2D6_50%,#C4642E_90%)] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,124,246,0.4)] break-all sm:break-normal`}
              >
                {TARGET_EMAIL}
              </span>
            </div>
          </a>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Awwwards-Level Monumental Magnetic Social Spheres            */}
        {/* Borderless 3D Circles: WhatsApp // Instagram // LinkedIn     */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12">
          {SOCIAL_CHANNELS.map((channel) => (
            <MagneticPod
              key={channel.id}
              label={channel.label}
              href={channel.href}
              glow={channel.glow}
              podBg={channel.podBg}
              hoverCore={channel.hoverCore}
            >
              {channel.icon}
            </MagneticPod>
          ))}
        </div>
      </div>
    </section>
  );
}
