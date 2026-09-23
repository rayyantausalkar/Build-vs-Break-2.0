"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ */
/*  Shared design tokens — mirrors Hero.jsx / Navbar.jsx exactly       */
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
const NIGHT = "#2B2138";
const ABYSS = "#1F1729";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";

const GRAIN = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
};

const NS = { vectorEffect: "non-scaling-stroke" };

/* ------------------------------------------------------------------ */
/*  Compact isometric glyph — "assembled / fractured / rebuilt"       */
/*                                                                     */
/*  A small core structure stays fixed. Two fragments sit displaced,   */
/*  ghost outlines mark the slots they came from. Hovering (or         */
/*  focusing) the glyph draws every fragment back into its slot —      */
/*  build, break, rethink, rebuilt — in one contained gesture.         */
/* ------------------------------------------------------------------ */

const K = Math.sqrt(3) / 2;
const CUBE_S = 30;
const VB = 220;

const iso =
  (ox, oy, s = CUBE_S) =>
  (x, y, z) =>
    [ox + (x - y) * K * s, oy + (x + y) * 0.5 * s - z * s];

const fmt = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(" ");

function box(p, x, y, z, w = 1, d = 1, h = 1) {
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
    hex: pts([
      p(x, y, z + h),
      p(x + w, y, z + h),
      p(x + w, y, z),
      p(x + w, y + d, z),
      p(x, y + d, z),
      p(x, y + d, z + h),
    ]),
    center: p(x + w / 2, y + d / 2, z + h / 2),
  };
}

/* [top, left, right] face colours */
const TONES = {
  violet: [VIOLET, DEEP, ABYSS],
  deep: [DEEP, NIGHT, ABYSS],
  ivory: [IVORY, VIOLET, DEEP],
  ember: [EMBER, DEEP, NIGHT],
};

function Cube({ f, tone }) {
  const [top, left, right] = TONES[tone];
  return (
    <g stroke={IVORY} strokeOpacity="0.2" strokeWidth="0.8" strokeLinejoin="round">
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
      <polygon points={f.top} fill={top} />
    </g>
  );
}

const G_P = iso(70, 150);

/* the part of the structure that never moves */
const CORE = [
  [0, 0, 0, "deep"],
  [1, 0, 0, "violet"],
  [0, 1, 0, "violet"],
  [0, 0, 1, "ivory"],
].map(([x, y, z, tone]) => ({ key: `core-${x}${y}${z}`, tone, f: box(G_P, x, y, z) }));

/* fragments: their home slot, and the displacement they rest at
   before they're drawn back in */
const FRAGMENTS = [
  { key: "frag-a", tone: "ember", slot: [1, 1, 0], rest: [42, 10] },
  { key: "frag-b", tone: "violet", slot: [1, 0, 1], rest: [30, -34] },
];

function AssemblyGlyph({ reduced }) {
  const [active, setActive] = useState(false);
  const [locked, setLocked] = useState(false);

  /* `locked` flips true a beat after the fragments start homing in — right
     around when the spring settles — so the flash and the exposed slot
     ticks land at the moment of contact rather than the start of the move. */
  useEffect(() => {
    if (reduced) {
      setLocked(active);
      return undefined;
    }
    if (!active) {
      setLocked(false);
      return undefined;
    }
    const t = window.setTimeout(() => setLocked(true), 420);
    return () => window.clearTimeout(t);
  }, [active, reduced]);

  return (
    <motion.div
      role="img"
      aria-label="A small structure of geometric blocks, with two fragments that draw back into place on hover, representing building, breaking and rebuilding."
      tabIndex={0}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: EASE }}
      style={reduced ? undefined : { perspective: 800 }}
      className="group relative aspect-square w-full max-w-[280px] cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#E8E2D6]/50 sm:max-w-[320px]"
    >
      <motion.svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        focusable="false"
        aria-hidden="true"
        animate={
          reduced
            ? undefined
            : { rotateX: active ? -3 : 0, rotateY: active ? 3 : 0 }
        }
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{ transformStyle: "preserve-3d" }}
        className="h-full w-full overflow-visible"
      >
        {/* isometric floor grid, echoes the Hero's construction plane */}
        <path
          d={`M${G_P(-0.5, -0.5, 0)[0]} ${G_P(-0.5, -0.5, 0)[1]}L${G_P(2.5, -0.5, 0)[0]} ${G_P(2.5, -0.5, 0)[1]}L${G_P(2.5, 2.5, 0)[0]} ${G_P(2.5, 2.5, 0)[1]}L${G_P(-0.5, 2.5, 0)[0]} ${G_P(-0.5, 2.5, 0)[1]}Z`}
          stroke={IVORY}
          strokeOpacity="0.08"
          strokeWidth="1"
          {...NS}
        />

        {/* ghost slots + leader lines, fade as fragments come home */}
        {FRAGMENTS.map((frg) => {
          const [x, y, z] = frg.slot;
          const f = box(G_P, x, y, z);
          const [cx, cy] = f.center;
          return (
            <motion.g
              key={`ghost-${frg.key}`}
              animate={{ opacity: reduced ? 0.35 : active ? 0 : 0.55 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <polygon
                points={f.hex}
                stroke={IVORY}
                strokeWidth="1"
                strokeDasharray="3 4"
                strokeLinejoin="round"
                fill="none"
                {...NS}
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx + frg.rest[0]}
                y2={cy + frg.rest[1]}
                stroke={EMBER}
                strokeOpacity="0.6"
                strokeWidth="1"
                strokeDasharray="2 4"
                {...NS}
              />
            </motion.g>
          );
        })}

        {/* the fixed core */}
        {CORE.map((c) => (
          <Cube key={c.key} f={c.f} tone={c.tone} />
        ))}

        {/* the two fragments — animate home on hover / focus */}
        {FRAGMENTS.map((frg) => {
          const [x, y, z] = frg.slot;
          const f = box(G_P, x, y, z);
          const target = active ? [0, 0] : frg.rest;
          return (
            <motion.g
              key={frg.key}
              animate={{ x: target[0], y: target[1] }}
              initial={false}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 170, damping: 20 }
              }
            >
              <Cube f={f} tone={frg.tone} />
            </motion.g>
          );
        })}

        {/* a few dust motes kicked up while the fragments are in transit —
            gone again the moment they lock, so they read as debris rather
            than decoration */}
        {!reduced &&
          FRAGMENTS.map((frg, i) => {
            const [x, y, z] = frg.slot;
            const f = box(G_P, x, y, z);
            const [cx, cy] = f.center;
            const specks = [
              [cx - 10, cy + 6],
              [cx + 8, cy - 9],
            ];
            return specks.map(([sx, sy], j) => (
              <motion.rect
                key={`dust-${i}-${j}`}
                x={sx}
                y={sy}
                width="2.5"
                height="2.5"
                fill={j % 2 ? EMBER : VIOLET}
                initial={false}
                animate={
                  active && !locked
                    ? { opacity: 0.75, y: -6 }
                    : { opacity: 0, y: 0 }
                }
                transition={{ duration: 0.5, delay: j * 0.05, ease: EASE }}
              />
            ));
          })}

        {/* lock flash + brief technical ticks at the instant each fragment
            reaches its slot — the "system confirms" beat */}
        {!reduced &&
          FRAGMENTS.map((frg) => {
            const [x, y, z] = frg.slot;
            const f = box(G_P, x, y, z);
            const [cx, cy] = f.center;
            return (
              <g key={`lock-${frg.key}`}>
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="1"
                  fill={IVORY}
                  initial={false}
                  animate={
                    locked
                      ? { opacity: [0, 0.85, 0], scale: [0.4, 5, 6.5] }
                      : { opacity: 0, scale: 0.4 }
                  }
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                <motion.path
                  d={`M${cx - 7} ${cy}H${cx - 3}M${cx + 3} ${cy}H${cx + 7}M${cx} ${cy - 7}V${cy - 3}M${cx} ${cy + 3}V${cy + 7}`}
                  stroke={IVORY}
                  strokeOpacity="0.7"
                  strokeWidth="1"
                  initial={false}
                  animate={{ opacity: locked ? [0, 1, 0] : 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  {...NS}
                />
              </g>
            );
          })}
      </motion.svg>

      {/* status label — swaps as the structure resolves */}
      <div className="pointer-events-none absolute -bottom-7 left-0 sm:-bottom-8">
        <span
          className={`${MONO} inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#E8E2D6]/55 sm:text-[10px] sm:tracking-[0.22em]`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 transition-colors duration-300 ${
              active ? "bg-[#8B7CF6]" : "bg-[#C4642E]"
            }`}
          />
          {active ? "STATE // REBUILT" : "STATE // FRACTURED"}
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small shared bits                                                  */
/* ------------------------------------------------------------------ */

function Label({ children, dot = "bg-[#8B7CF6]", className = "" }) {
  return (
    <span
      className={`${MONO} inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#E8E2D6]/55 sm:text-[11px] sm:tracking-[0.22em] ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 ${dot}`} />
      {children}
    </span>
  );
}

function Reveal({ children, delay = 0, y = 16, reduced, className = "" }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const PRINCIPLES = [
  {
    n: "01",
    title: "BUILD",
    accent: VIOLET,
    body: "Construct with intention. Every structure starts as a deliberate choice, not a default.",
  },
  {
    n: "02",
    title: "BREAK",
    accent: EMBER,
    body: "Challenge assumptions. Pressure-test the build until the weak seams show themselves.",
  },
  {
    n: "03",
    title: "RETHINK",
    accent: IVORY,
    body: "Find another way. Fold what broke into a sharper version of the build.",
  },
];

function PrincipleRow({ item, delay, reduced }) {
  return (
    <Reveal
      delay={delay}
      reduced={reduced}
      className="group relative border-t border-[#E8E2D6]/10 py-6 first:border-t-0 sm:py-7"
    >
      {/* a very soft, accent-tinted response behind the row — only visible
          on hover/focus, never competing with the copy above it */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -inset-x-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:-inset-x-6"
        style={{
          background: `radial-gradient(60% 100% at 0% 50%, ${item.accent}14, transparent 70%)`,
        }}
      />

      {/* corner registration tick, revealed with the row — echoes the
          Hero / Timeline "system reference" marks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-6 hidden h-2 w-2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-70 sm:block"
        style={{ borderTop: `1px solid ${item.accent}`, borderRight: `1px solid ${item.accent}` }}
      />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6 lg:gap-10">
        <span
          className={`${MONO} shrink-0 text-xs tracking-[0.2em] text-[#E8E2D6]/40 transition-colors duration-300 group-hover:text-[#E8E2D6]/70 sm:text-sm`}
        >
          {item.n}
        </span>

        <span
          aria-hidden="true"
          className="hidden h-px w-8 shrink-0 self-center transition-[width] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:w-14 sm:block"
          style={{ backgroundColor: item.accent }}
        />

        <h3
          className={`${DISPLAY} shrink-0 text-2xl font-bold uppercase tracking-[-0.01em] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 sm:w-48 sm:text-3xl lg:w-56`}
          style={{ color: item.accent === IVORY ? IVORY : item.accent }}
        >
          {item.title}
        </h3>

        <p className="max-w-md text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
          {item.body}
        </p>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

export default function About() {
  const reduced = Boolean(useReducedMotion());

  return (
    <section
      id="about"
      aria-label="About — the BvB philosophy"
      className="relative isolate w-full overflow-hidden bg-[#1A1410] py-24 text-[#E8E2D6] sm:py-28 lg:py-36"
    >
      {/* ---------------------------------------------------------- */}
      {/* Background — continues the Hero's atmosphere               */}
      {/* ---------------------------------------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-[8%] top-[6%] h-[55%] w-[46%] bg-[radial-gradient(closest-side,rgba(139,124,246,0.12),transparent)]" />
        <div className="absolute -right-[6%] bottom-[4%] h-[50%] w-[42%] bg-[radial-gradient(closest-side,rgba(196,100,46,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.035)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]" />
        <span className="absolute inset-y-0 left-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.1)_25%,rgba(232,226,214,0.1)_75%,transparent)] lg:block" />
        <span className="absolute inset-y-0 right-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.1)_25%,rgba(232,226,214,0.1)_75%,transparent)] lg:block" />
        <div className="absolute inset-0 opacity-[0.05]" style={GRAIN} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        {/* Top label row */}
        <Reveal reduced={reduced} y={8}>
          <div className="flex items-center gap-4">
            <Label dot="bg-[#8B7CF6]">02 // THE PHILOSOPHY</Label>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E8E2D6]/10" />
            <Label dot="bg-[#C4642E]">BVB // 2026</Label>
          </div>
        </Reveal>

        {/* Headline + statement + glyph */}
        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <h2
              className={`${DISPLAY} text-[clamp(2.6rem,9vw,4.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em] lg:text-[clamp(3rem,4.6vw,5.25rem)]`}
            >
              <Reveal reduced={reduced} delay={0.05}>
                <span className={`block ${GRAD_BUILD}`}>Build on purpose.</span>
              </Reveal>
              <Reveal reduced={reduced} delay={0.15}>
                <span className={`block ${GRAD_BREAK}`}>Break on purpose.</span>
              </Reveal>
            </h2>

            <Reveal reduced={reduced} delay={0.3} className="mt-8 max-w-lg lg:mt-10">
              <p className="border-l-2 border-[#C4642E] pl-4 text-sm leading-relaxed text-[#E8E2D6]/70 sm:text-base">
                BvB starts from a simple tension: every system worth building
                is worth challenging. We construct with precision, then go
                looking for the seams — the assumptions worth breaking, the
                shortcuts worth questioning. What survives gets rebuilt
                sharper. What doesn't teaches us something anyway.
              </p>
            </Reveal>

            <Reveal
              reduced={reduced}
              delay={0.4}
              className={`${MONO} mt-6 text-[10px] uppercase tracking-[0.25em] text-[#E8E2D6]/40 sm:text-xs`}
            >
              Build — Break — Rethink — Create
            </Reveal>
          </div>

          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <AssemblyGlyph reduced={reduced} />
          </div>
        </div>

        {/* Principles */}
        <div className="mt-24 sm:mt-28 lg:mt-32">
          <Reveal reduced={reduced} className="mb-2 flex items-center gap-4">
            <Label dot="bg-[#C4642E]">THE PRINCIPLES</Label>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E8E2D6]/10" />
          </Reveal>

          <div>
            {PRINCIPLES.map((item, i) => (
              <PrincipleRow
                key={item.n}
                item={item}
                delay={0.08 * i}
                reduced={reduced}
              />
            ))}
            <div aria-hidden="true" className="border-t border-[#E8E2D6]/10" />
          </div>
        </div>
      </div>
    </section>
  );
}