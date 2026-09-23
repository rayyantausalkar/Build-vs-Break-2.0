"use client";

import React from "react";
import { motion, MotionValue, useReducedMotion, useTransform } from "motion/react";

/* ------------------------------------------------------------------ */
/*  BvB Design Palette & Tones                                         */
/* ------------------------------------------------------------------ */

const VIOLET = "#8B7CF6";
const DEEP = "#3B2F4F";
const EMBER = "#C4642E";
const EMBER_DARK = "#7A3A1B";
const IVORY = "#E8E2D6";
const ASH = "#B5AC9C";
const NIGHT = "#2B2138";

const TONES: Record<string, [string, string, string]> = {
  ivory: [IVORY, VIOLET, DEEP],
  violet: [VIOLET, DEEP, EMBER],
  ember: [EMBER, DEEP, NIGHT],
  deep: [DEEP, NIGHT, "#1F1729"],
};

/* ------------------------------------------------------------------ */
/*  Continuous Floating Drift Keyframes                                */
/* ------------------------------------------------------------------ */

const DRIFT_CSS = `
@keyframes bvb-floating-drift {
  0%, 100% {
    transform: translateY(0px) rotate(var(--r0, 0deg));
  }
  50% {
    transform: translateY(var(--dy, -8px)) rotate(calc(var(--r0, 0deg) + var(--dr, 6deg)));
  }
}
`;

/* ------------------------------------------------------------------ */
/*  Geometric Fragment Renderers (Matching Hero & Timeline)            */
/* ------------------------------------------------------------------ */

interface ShardItem {
  id: string;
  type: "crystal" | "cube" | "timeline-node" | "crosshair" | "dust" | "diamond";
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number;
  tone?: "violet" | "ember" | "ivory" | "deep";
  rot?: number;
  dr?: number;
  dy?: number;
  dur?: number;
  delay?: number;
  parallax?: number; // parallax factor (e.g. 0.03)
}

function CrystalGlyph({ tone = "violet" }: { tone?: "violet" | "ember" | "ivory" | "deep" }) {
  const lit = tone === "ember" ? EMBER : tone === "ivory" ? IVORY : VIOLET;
  const shade = tone === "ember" ? EMBER_DARK : tone === "ivory" ? ASH : DEEP;

  return (
    <svg viewBox="0 0 28 28" fill="none" className="h-full w-full overflow-visible">
      {/* Faceted Crystal Quad split along diagonal */}
      <polygon points="4,5 24,3 19,25" fill={lit} />
      <polygon points="4,5 19,25 7,19" fill={shade} />
      <line
        x1="4"
        y1="5"
        x2="19"
        y2="25"
        stroke={IVORY}
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <polygon
        points="4,5 24,3 19,25 7,19"
        stroke={IVORY}
        strokeOpacity="0.25"
        strokeWidth="0.7"
      />
    </svg>
  );
}

function CubeGlyph({ tone = "violet" }: { tone?: "violet" | "ember" | "ivory" | "deep" }) {
  const [top, left, right] = TONES[tone];
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full overflow-visible">
      <polygon points="4,7.5 12,12 12,21 4,16.5" fill={left} stroke={IVORY} strokeOpacity="0.2" strokeWidth="0.6" />
      <polygon points="12,12 20,7.5 20,16.5 12,21" fill={right} stroke={IVORY} strokeOpacity="0.2" strokeWidth="0.6" />
      <polygon points="12,3 20,7.5 12,12 4,7.5" fill={top} stroke={IVORY} strokeOpacity="0.2" strokeWidth="0.6" />
    </svg>
  );
}

function TimelineNodeGlyph({ tone = "violet" }: { tone?: "violet" | "ember" | "ivory" | "deep" }) {
  const color = tone === "ember" ? EMBER : tone === "ivory" ? IVORY : VIOLET;
  return (
    <svg viewBox="0 0 36 36" fill="none" className="h-full w-full overflow-visible">
      {/* Reference bounding square */}
      <rect
        x="4"
        y="4"
        width="28"
        height="28"
        stroke={IVORY}
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      {/* Corner ticks */}
      <path
        d="M1 7V1H7M29 1H35V7M35 29V35H29M7 35H1V29"
        stroke={IVORY}
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {/* Top half triangle */}
      <polygon points="18,6 30,18 18,18 6,18" fill={color} fillOpacity="0.9" />
      {/* Bottom half triangle */}
      <polygon
        points="18,18 30,18 18,30 6,18"
        fill={DEEP}
        stroke={color}
        strokeOpacity="0.75"
        strokeWidth="1"
      />
    </svg>
  );
}

function CrosshairGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-full w-full overflow-visible">
      <path d="M10 2V18M2 10H18" stroke={IVORY} strokeOpacity="0.35" strokeWidth="1" />
      <rect x="9" y="9" width="2" height="2" fill={VIOLET} />
    </svg>
  );
}

function DiamondGlyph({ tone = "ember" }: { tone?: "violet" | "ember" | "ivory" | "deep" }) {
  const color = tone === "ember" ? EMBER : VIOLET;
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-full w-full overflow-visible">
      <polygon points="8,1 15,8 8,15 1,8" stroke={color} strokeOpacity="0.6" strokeWidth="1" />
      <polygon points="8,4 12,8 8,12 4,8" fill={color} fillOpacity="0.4" />
    </svg>
  );
}

function DustGlyph({ tone = "ember" }: { tone?: "violet" | "ember" | "ivory" | "deep" }) {
  const color = tone === "ember" ? EMBER : tone === "ivory" ? IVORY : VIOLET;
  return (
    <svg viewBox="0 0 8 8" fill="none" className="h-full w-full overflow-visible">
      <rect x="1" y="1" width="6" height="6" fill={color} transform="rotate(18 4 4)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Presets For FAQ, Contact & Footer                                 */
/* ------------------------------------------------------------------ */

export const FAQ_SHARDS: ShardItem[] = [
  { id: "f1", type: "crystal", x: 6, y: 15, size: 36, tone: "violet", rot: 14, dr: 8, dy: -12, dur: 8, delay: 0.2, parallax: 0.03 },
  { id: "f2", type: "cube", x: 92, y: 18, size: 28, tone: "ember", rot: -10, dr: -6, dy: -9, dur: 9.5, delay: 1.1, parallax: 0.04 },
  { id: "f3", type: "timeline-node", x: 4, y: 46, size: 32, tone: "ivory", rot: 0, dr: 4, dy: -8, dur: 7, delay: 0.5, parallax: 0.02 },
  { id: "f4", type: "crystal", x: 94, y: 52, size: 38, tone: "violet", rot: -22, dr: 10, dy: -14, dur: 8.5, delay: 1.8, parallax: 0.04 },
  { id: "f5", type: "cube", x: 7, y: 78, size: 30, tone: "ivory", rot: 18, dr: -8, dy: -10, dur: 9, delay: 0.8, parallax: 0.03 },
  { id: "f6", type: "diamond", x: 90, y: 82, size: 22, tone: "ember", rot: 45, dr: 12, dy: -7, dur: 7.5, delay: 1.4, parallax: 0.02 },
  { id: "f7", type: "crosshair", x: 18, y: 8, size: 18, rot: 0, dr: 0, dy: -5, dur: 11, delay: 0.3, parallax: 0.01 },
  { id: "f8", type: "crosshair", x: 82, y: 92, size: 18, rot: 0, dr: 0, dy: -5, dur: 10, delay: 1.0, parallax: 0.01 },
  { id: "f9", type: "dust", x: 12, y: 62, size: 10, tone: "ember", rot: 25, dr: 15, dy: -8, dur: 6.5, delay: 0.4, parallax: 0.05 },
  { id: "f10", type: "dust", x: 88, y: 35, size: 9, tone: "violet", rot: -15, dr: 12, dy: -7, dur: 7.2, delay: 1.2, parallax: 0.04 },
];

export const CONTACT_SHARDS: ShardItem[] = [
  { id: "c1", type: "timeline-node", x: 6, y: 16, size: 34, tone: "ember", rot: 0, dr: 5, dy: -10, dur: 8, delay: 0.4, parallax: 0.03 },
  { id: "c2", type: "crystal", x: 91, y: 14, size: 40, tone: "violet", rot: 28, dr: -9, dy: -13, dur: 9, delay: 1.0, parallax: 0.04 },
  { id: "c3", type: "cube", x: 8, y: 48, size: 30, tone: "violet", rot: -15, dr: 7, dy: -8, dur: 7.8, delay: 0.6, parallax: 0.02 },
  { id: "c4", type: "crystal", x: 93, y: 46, size: 36, tone: "ember", rot: -18, dr: 11, dy: -12, dur: 8.8, delay: 1.5, parallax: 0.04 },
  { id: "c5", type: "diamond", x: 14, y: 84, size: 24, tone: "violet", rot: 15, dr: 8, dy: -7, dur: 7.2, delay: 0.9, parallax: 0.03 },
  { id: "c6", type: "cube", x: 88, y: 80, size: 28, tone: "ivory", rot: 20, dr: -6, dy: -9, dur: 8.2, delay: 0.3, parallax: 0.03 },
  { id: "c7", type: "crosshair", x: 22, y: 6, size: 20, rot: 0, dr: 0, dy: -4, dur: 12, delay: 0.1, parallax: 0.01 },
  { id: "c8", type: "crosshair", x: 76, y: 92, size: 20, rot: 0, dr: 0, dy: -4, dur: 11, delay: 1.2, parallax: 0.01 },
  { id: "c9", type: "dust", x: 10, y: 32, size: 10, tone: "violet", rot: 30, dr: 18, dy: -8, dur: 6.8, delay: 0.7, parallax: 0.05 },
  { id: "c10", type: "dust", x: 86, y: 64, size: 9, tone: "ember", rot: -20, dr: 14, dy: -7, dur: 7.5, delay: 1.1, parallax: 0.04 },
];

export const FOOTER_SHARDS: ShardItem[] = [
  { id: "b1", type: "crystal", x: 8, y: 22, size: 38, tone: "ember", rot: -14, dr: 9, dy: -11, dur: 8.5, delay: 0.3, parallax: 0.04 },
  { id: "b2", type: "timeline-node", x: 92, y: 20, size: 32, tone: "violet", rot: 0, dr: 6, dy: -9, dur: 7.5, delay: 0.8, parallax: 0.03 },
  { id: "b3", type: "cube", x: 14, y: 65, size: 26, tone: "ivory", rot: 16, dr: -7, dy: -8, dur: 9, delay: 1.2, parallax: 0.02 },
  { id: "b4", type: "crystal", x: 86, y: 68, size: 34, tone: "violet", rot: 24, dr: -10, dy: -12, dur: 8, delay: 0.5, parallax: 0.04 },
  { id: "b5", type: "diamond", x: 28, y: 12, size: 20, tone: "ember", rot: 45, dr: 10, dy: -6, dur: 7, delay: 1.4, parallax: 0.02 },
  { id: "b6", type: "crosshair", x: 74, y: 14, size: 18, rot: 0, dr: 0, dy: -4, dur: 10, delay: 0.2, parallax: 0.01 },
  { id: "b7", type: "dust", x: 18, y: 40, size: 9, tone: "ember", rot: -12, dr: 14, dy: -7, dur: 6.5, delay: 0.9, parallax: 0.05 },
  { id: "b8", type: "dust", x: 80, y: 44, size: 8, tone: "violet", rot: 22, dr: 16, dy: -6, dur: 7, delay: 0.4, parallax: 0.04 },
];

/* ------------------------------------------------------------------ */
/*  Main FloatingShards Component                                     */
/* ------------------------------------------------------------------ */

interface FloatingShardsProps {
  shards: ShardItem[];
  smoothX?: MotionValue<number>;
  smoothY?: MotionValue<number>;
}

export function FloatingShards({ shards, smoothX, smoothY }: FloatingShardsProps) {
  const reduced = Boolean(useReducedMotion());

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <style>{DRIFT_CSS}</style>

      {shards.map((s) => {
        return (
          <FloatingShardElement
            key={s.id}
            item={s}
            smoothX={smoothX}
            smoothY={smoothY}
            reduced={reduced}
          />
        );
      })}
    </div>
  );
}

function FloatingShardElement({
  item,
  smoothX,
  smoothY,
  reduced,
}: {
  item: ShardItem;
  smoothX?: MotionValue<number>;
  smoothY?: MotionValue<number>;
  reduced: boolean;
}) {
  const p = item.parallax || 0.02;

  // Parallax shift tied to cursor motion values if available
  const px = useTransform(smoothX || { get: () => 0 } as any, (v: number) =>
    reduced ? 0 : (v - 500) * p
  );
  const py = useTransform(smoothY || { get: () => 0 } as any, (v: number) =>
    reduced ? 0 : (v - 400) * p
  );

  const renderGlyph = () => {
    switch (item.type) {
      case "crystal":
        return <CrystalGlyph tone={item.tone} />;
      case "cube":
        return <CubeGlyph tone={item.tone} />;
      case "timeline-node":
        return <TimelineNodeGlyph tone={item.tone} />;
      case "crosshair":
        return <CrosshairGlyph />;
      case "diamond":
        return <DiamondGlyph tone={item.tone} />;
      case "dust":
        return <DustGlyph tone={item.tone} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: item.size,
        height: item.size,
        marginLeft: -item.size / 2,
        marginTop: -item.size / 2,
        x: smoothX ? px : 0,
        y: smoothY ? py : 0,
      }}
      className="absolute block"
    >
      <div
        className="block h-full w-full"
        style={{
          ["--r0" as any]: `${item.rot || 0}deg`,
          ["--dr" as any]: `${item.dr || 6}deg`,
          ["--dy" as any]: `${item.dy || -8}px`,
          transform: `rotate(${item.rot || 0}deg)`,
          animation: reduced
            ? undefined
            : `bvb-floating-drift ${item.dur || 8}s ease-in-out ${-(item.delay || 0)}s infinite`,
        }}
      >
        {renderGlyph()}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero-Style Blueprint Ruler Ticks Component                        */
/* ------------------------------------------------------------------ */

export function BlueprintRuler({ className = "" }: { className?: string }) {
  // Generate baseline ticks every 20px, with taller ticks every 100px
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden select-none opacity-25 ${className}`}
    >
      <svg
        viewBox="0 0 1200 16"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-4 block"
      >
        <line x1="0" y1="8" x2="1200" y2="8" stroke={IVORY} strokeWidth="1" strokeOpacity="0.4" />
        {Array.from({ length: 61 }).map((_, i) => {
          const x = i * 20;
          const isMajor = x % 100 === 0;
          return (
            <line
              key={i}
              x1={x}
              y1={isMajor ? 1 : 4}
              x2={x}
              y2={isMajor ? 15 : 12}
              stroke={isMajor ? VIOLET : IVORY}
              strokeWidth={isMajor ? 1.5 : 1}
              strokeOpacity={isMajor ? 0.7 : 0.3}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline-Style Circuit Trace Track Component                      */
/* ------------------------------------------------------------------ */

export function CircuitTrack({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 w-full overflow-visible select-none opacity-20 ${className}`}
    >
      {/* Orthogonal circuit path */}
      <path
        d="M 0 60 H 180 V 20 H 380 V 100 H 620 V 30 H 820 V 60 H 1000"
        stroke={IVORY}
        strokeWidth="1"
        strokeDasharray="4 6"
        strokeOpacity="0.6"
      />
      {/* Node junctions */}
      <circle cx="180" cy="20" r="3" fill={VIOLET} fillOpacity="0.8" />
      <circle cx="380" cy="100" r="3" fill={EMBER} fillOpacity="0.8" />
      <circle cx="620" cy="30" r="3" fill={VIOLET} fillOpacity="0.8" />
      <circle cx="820" cy="60" r="3" fill={EMBER} fillOpacity="0.8" />
    </svg>
  );
}
