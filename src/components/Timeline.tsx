"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

/* ------------------------------------------------------------------ */
/*  Shared design tokens — mirrors Hero.jsx / About.jsx exactly        */
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

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";

const GRAIN = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
};

const NS = { vectorEffect: "non-scaling-stroke" };

/* A very slow drift on the background construction grid, plus the pulse
   ring used when a node activates. Both are no-ops under reduced motion. */
const AMBIENT_CSS =
  "@keyframes bvb-tl-grid{0%,100%{background-position:0 0}50%{background-position:6px 8px}}@keyframes bvb-tl-ring{0%{opacity:0.55;transform:scale(0.6)}100%{opacity:0;transform:scale(2.2)}}@media (prefers-reduced-motion:reduce){.bvb-tl-grid{animation:none!important}.bvb-tl-ring{animation:none!important}}";

/* ------------------------------------------------------------------ */
/*  TIMELINE DATA                                                      */
/*                                                                      */
/*  Everything editorial lives here. Replace copy, reorder stages, or  */
/*  add/remove entries — the layout below adapts automatically.        */
/*  `x` / `y` place the stage on the desktop trajectory (0–100, percent */
/*  of the canvas). `band` controls whether its text sits in the upper */
/*  or lower row on desktop. Accent must be "violet" | "ember" | "ivory".*/
/* ------------------------------------------------------------------ */

const TIMELINE = [
  {
    number: "01",
    code: "ARR",
    phase: "ARRIVE",
    title: "The starting coordinate.",
    description:
      "Teams gather, the brief drops, the board resets to zero. Every build starts from the same blank grid.",
    accent: "ivory",
    x: 6,
    y: 60,
    band: "lower",
  },
  {
    number: "02",
    code: "BLD",
    phase: "BUILD",
    title: "Structure, deliberately.",
    description:
      "Ideas get load-bearing. Decisions stack on decisions, each one chosen — never a default.",
    accent: "violet",
    x: 23,
    y: 14,
    band: "upper",
  },
  {
    number: "03",
    code: "BRK",
    phase: "BREAK",
    title: "Pressure finds the seams.",
    description:
      "The structure meets its first real test. What's fragile shows itself here, fast.",
    accent: "ember",
    x: 41,
    y: 60,
    band: "lower",
  },
  {
    number: "04",
    code: "RTK",
    phase: "RETHINK",
    title: "Read the fracture lines.",
    description:
      "Not a restart — a recalibration. The break becomes information, not damage.",
    accent: "ivory",
    x: 59,
    y: 14,
    band: "upper",
  },
  {
    number: "05",
    code: "RBD",
    phase: "REBUILD",
    title: "Sharper the second time.",
    description:
      "Every weak seam gets reinforced. The structure returns tighter, tested, intentional.",
    accent: "violet",
    x: 77,
    y: 60,
    band: "lower",
  },
  {
    number: "06",
    code: "RVL",
    phase: "REVEAL",
    title: "The system, finished.",
    description:
      "What's left standing gets its moment. Build vs Break, resolved in public.",
    accent: "ember",
    x: 93,
    y: 14,
    band: "upper",
  },
];

const ACCENTS: Record<string, string> = {
  violet: VIOLET,
  ember: EMBER,
  ivory: IVORY,
};

/* ------------------------------------------------------------------ */
/*  Small shared bits (mirrors About.jsx)                              */
/* ------------------------------------------------------------------ */

function Label({ children, dot = "bg-[#8B7CF6]", className = "" }: { children: React.ReactNode; dot?: string; className?: string }) {
  return (
    <span
      className={`${MONO} inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#E8E2D6]/55 sm:text-[11px] sm:tracking-[0.22em] ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 ${dot}`} />
      {children}
    </span>
  );
}

function Reveal({ children, delay = 0, y = 16, reduced, className = "" }: { children: React.ReactNode; delay?: number; y?: number; reduced: boolean; className?: string }) {
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

/* ------------------------------------------------------------------ */
/*  TimelineNode                                                       */
/*                                                                      */
/*  A diamond split into two triangular halves along a static square   */
/*  reference frame. Hover / focus draws the halves apart on their own */
/*  diagonal and exposes the stage's three-letter code between them —  */
/*  the same "fragment / reassemble" language as Hero's break sequence */
/*  and About's assembly glyph, condensed into one repeatable motif.   */
/* ------------------------------------------------------------------ */

function TimelineNode({ accent, active, code, reduced, size = 40 }: { accent: string; active: boolean; code: string; reduced: boolean; size?: number }) {
  const color = ACCENTS[accent];
  const offset = active ? 3.6 : 0;
  const rot = active ? (reduced ? 0 : 6) : 0;

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="overflow-visible"
    >
      {/* static reference frame */}
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        fill="none"
        stroke={IVORY}
        strokeOpacity={active ? 0.35 : 0.16}
        strokeWidth="1"
        strokeDasharray="2 3"
        style={{ transition: "stroke-opacity 300ms ease" }}
        {...NS}
      />
      {/* corner ticks */}
      <path
        d="M1 8V1H8M32 1H39V8M39 32V39H32M8 39H1V32"
        fill="none"
        stroke={IVORY}
        strokeOpacity={active ? 0.5 : 0.22}
        strokeWidth="1"
        style={{ transition: "stroke-opacity 300ms ease" }}
        {...NS}
      />

      {/* activation pulse — a single ring expanding outward, remounted (and
          so replayed) each time the node becomes active */}
      {active && !reduced && (
        <circle
          key="pulse"
          cx="20"
          cy="20"
          r="13"
          fill="none"
          stroke={color}
          strokeWidth="1"
          className="bvb-tl-ring"
          style={{ animation: "bvb-tl-ring 900ms cubic-bezier(0.22,1,0.36,1) both" }}
          {...NS}
        />
      )}

      {/* diamond, split into two triangles along the NW–SE diagonal */}
      <motion.polygon
        points="20,6 34,20 20,20 6,20"
        fill={color}
        fillOpacity={active ? 1 : 0.85}
        animate={{ x: -offset, y: -offset, rotate: -rot }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
        style={{ transformOrigin: "20px 20px" }}
      />
      <motion.polygon
        points="20,20 34,20 20,34 6,20"
        fill={DEEP}
        stroke={color}
        strokeOpacity="0.7"
        strokeWidth="1"
        animate={{ x: offset, y: offset, rotate: -rot }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
        style={{ transformOrigin: "20px 20px" }}
      />

      {/* hidden technical label, revealed as the halves part */}
      <motion.text
        x="20"
        y="21.5"
        textAnchor="middle"
        fontSize="6.5"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        letterSpacing="0.5"
        fill={IVORY}
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {code}
      </motion.text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TimelinePath — desktop only                                        */
/*                                                                      */
/*  Axis-aligned "circuit trace" connecting every stage in sequence.   */
/*  Because every segment is horizontal or vertical, the path stays    */
/*  true even though the viewBox is stretched non-uniformly to fill    */
/*  the canvas (preserveAspectRatio="none") — which is also why the    */
/*  node markers, positioned with the same x/y percentages in HTML,    */
/*  stay perfectly registered with the SVG beneath them.               */
/* ------------------------------------------------------------------ */

function buildPathSegments(points: { x: number; y: number }[]) {
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const midX = a.x + (b.x - a.x) * 0.5;
    const d =
      i % 2 === 0
        ? `M${a.x} ${a.y} H${midX} V${b.y} H${b.x}`
        : `M${a.x} ${a.y} V${b.y} H${midX} V${b.y} H${b.x}`;
    segments.push({ d, key: `${i}` });
  }
  return segments;
}

/** A small shard that travels the trajectory toward whichever node is
 *  active, walking the same node sequence the path is drawn from. It
 *  interpolates linearly between node centers rather than tracing the
 *  exact axis-aligned trace — close enough to read as "a signal moving
 *  through the circuit" without needing to re-derive the orthogonal path
 *  as a continuous parametric curve. */
function useTravelingSignal(points: { x: number; y: number }[], activeIndex: number | null, reduced: boolean) {
  const progress = useMotionValue(typeof activeIndex === "number" ? activeIndex : 0);

  useEffect(() => {
    if (reduced || typeof activeIndex !== "number") return undefined;
    const controls = animate(progress, activeIndex, {
      type: "spring",
      stiffness: 85,
      damping: 15,
    });
    return () => controls.stop();
  }, [activeIndex, reduced, progress]);

  const at = (v: number) => {
    const n = points.length;
    const c = Math.max(0, Math.min(n - 1, v));
    const i = Math.floor(c);
    const j = Math.min(n - 1, i + 1);
    const t = c - i;
    return { i, j, t };
  };

  const x = useTransform(progress, (v) => {
    const { i, j, t } = at(v);
    return points[i].x + (points[j].x - points[i].x) * t;
  });
  const y = useTransform(progress, (v) => {
    const { i, j, t } = at(v);
    return points[i].y + (points[j].y - points[i].y) * t;
  });

  return { x, y };
}

/** The signal itself — a tiny diamond shard, kept in the BvB vocabulary
 *  rather than a generic dot, with a short trailing glow. Only mounted by
 *  the parent when motion is not reduced, so no hooks fire needlessly. */
function TravelingSignal({ points, activeIndex, reduced }: { points: { x: number; y: number }[]; activeIndex: number | null; reduced: boolean }) {
  const { x, y } = useTravelingSignal(points, activeIndex, reduced);
  const leftPct = useTransform(x, (v) => `${v}%`);
  const topPct = useTransform(y, (v) => `${v}%`);
  const visible = typeof activeIndex === "number";

  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ left: leftPct, top: topPct }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="absolute inset-0 -m-2 rounded-full bg-[#E8E2D6]/25 blur-[6px]" />
      <svg width="10" height="10" viewBox="0 0 10 10" className="relative overflow-visible">
        <polygon points="5,0 10,5 5,10 0,5" fill="#E8E2D6" />
      </svg>
    </motion.div>
  );
}

function TimelinePath({ points, activeIndex, reduced, inView }: { points: { x: number; y: number }[]; activeIndex: number | null; reduced: boolean; inView: boolean }) {
  const segments = buildPathSegments(points);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      {/* faint full path, always present as the "construction plane" */}
      {segments.map((seg) => (
        <path
          key={`ghost-${seg.key}`}
          d={seg.d}
          fill="none"
          stroke={IVORY}
          strokeOpacity="0.12"
          strokeWidth="0.35"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* animated draw-on, segment by segment */}
      {segments.map((seg, i) => {
        const nearActive = activeIndex === i || activeIndex === i + 1;
        return (
          <motion.path
            key={`live-${seg.key}`}
            d={seg.d}
            fill="none"
            stroke={nearActive ? IVORY : "#8B7CF6"}
            strokeOpacity={nearActive ? 0.75 : 0.4}
            strokeWidth={nearActive ? 0.6 : 0.4}
            strokeDasharray={nearActive ? "0" : "1.4 1.6"}
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : inView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.7, delay: reduced ? 0 : 0.15 * i, ease: EASE }}
            style={{ transition: "stroke 300ms ease, stroke-width 300ms ease, stroke-opacity 300ms ease" }}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

export default function Timeline() {
  const reduced = Boolean(useReducedMotion());
  const [active, setActive] = useState<number | string | null>(null);
  const [pathInView, setPathInView] = useState(false);

  const points = TIMELINE.map((t) => ({ x: t.x, y: t.y }));

  return (
    <section
      id="timeline"
      aria-label="Timeline — the BvB process"
      className="relative isolate w-full overflow-hidden bg-[#1A1410] py-24 text-[#E8E2D6] sm:py-28 lg:py-36"
    >
      {/* ---------------------------------------------------------- */}
      {/* Background — continues Hero / About's atmosphere            */}
      {/* ---------------------------------------------------------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <style>{AMBIENT_CSS}</style>
        <div className="absolute -right-[10%] top-[10%] h-[50%] w-[44%] bg-[radial-gradient(closest-side,rgba(139,124,246,0.1),transparent)]" />
        <div className="absolute -left-[8%] bottom-[6%] h-[46%] w-[40%] bg-[radial-gradient(closest-side,rgba(196,100,46,0.09),transparent)]" />
        <div
          className="bvb-tl-grid absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.035)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          style={{ animation: "bvb-tl-grid 22s ease-in-out infinite" }}
        />
        <span className="absolute inset-y-0 left-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.1)_25%,rgba(232,226,214,0.1)_75%,transparent)] lg:block" />
        <span className="absolute inset-y-0 right-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.1)_25%,rgba(232,226,214,0.1)_75%,transparent)] lg:block" />
        <div className="absolute inset-0 opacity-[0.05]" style={GRAIN} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
        {/* Top label row */}
        <Reveal reduced={reduced} y={8}>
          <div className="flex items-center gap-4">
            <Label dot="bg-[#C4642E]">03 // THE PROCESS</Label>
            <span aria-hidden="true" className="h-px flex-1 bg-[#E8E2D6]/10" />
            <Label dot="bg-[#8B7CF6]">BVB // 2026</Label>
          </div>
        </Reveal>

        {/* Headline */}
        <div className="mt-12 lg:mt-16">
          <h2
            className={`${DISPLAY} text-[clamp(2.6rem,9vw,4.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em] lg:text-[clamp(3rem,4.6vw,5.25rem)]`}
          >
            <Reveal reduced={reduced} delay={0.05}>
              <span className={`block ${GRAD_BUILD}`}>Every build</span>
            </Reveal>
            <Reveal reduced={reduced} delay={0.15}>
              <span className={`block ${GRAD_BREAK}`}>has a break.</span>
            </Reveal>
          </h2>

          <Reveal reduced={reduced} delay={0.3} className="mt-8 max-w-lg">
            <p className="border-l-2 border-[#8B7CF6] pl-4 text-sm leading-relaxed text-[#E8E2D6]/70 sm:text-base">
              Six states, one trajectory. Not a schedule — a system moving
              through arrival, construction, failure, and back again, until
              what's left is worth revealing.
            </p>
          </Reveal>
        </div>

        {/* ============================================================ */}
        {/*  DESKTOP — trajectory canvas                                  */}
        {/* ============================================================ */}
        <motion.ol
          aria-label="BvB process, six stages"
          onViewportEnter={() => setPathInView(true)}
          viewport={{ once: true, margin: "-15%" }}
          className="relative mt-20 hidden list-none lg:block"
          style={{ minHeight: "clamp(640px, 44vw, 780px)" }}
        >
          <TimelinePath points={points} activeIndex={typeof active === "number" ? active : null} reduced={reduced} inView={pathInView} />
          {!reduced && pathInView && (
            <TravelingSignal points={points} activeIndex={typeof active === "number" ? active : null} reduced={reduced} />
          )}

          {TIMELINE.map((item, i) => {
            const isActive = active === i;
            const alignRight = item.x > 50;
            const coordTag = `N.${item.number} · X${String(Math.round(item.x)).padStart(2, "0")}.Y${String(
              Math.round(item.y)
            ).padStart(2, "0")}`;

            return (
              <motion.li
                key={item.number}
                tabIndex={0}
                role="group"
                aria-label={`Stage ${item.number}, ${item.phase}. ${item.title} ${item.description}`}
                onHoverStart={() => setActive(i)}
                onHoverEnd={() => setActive((cur) => (cur === i ? null : cur))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: reduced ? 0 : 0.55 + i * 0.1, ease: EASE }}
                className="absolute cursor-pointer outline-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* node */}
                <div className="flex justify-center">
                  <TimelineNode accent={item.accent} active={isActive} code={item.code} reduced={reduced} />
                </div>

                {/* stage text, anchored left or right of the node so it
                    never runs off the edge of the canvas */}
                <div
                  className={`absolute top-full mt-3 w-[15.5vw] min-w-[190px] max-w-[248px] ${
                    alignRight ? "right-1/2 translate-x-1/2 text-right" : "left-1/2 -translate-x-1/2 text-left"
                  }`}
                >
                  <div
                    className={`${MONO} flex items-baseline gap-2 text-[10px] tracking-[0.2em] text-[#E8E2D6]/40 ${
                      alignRight ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{item.number}</span>
                    <span
                      aria-hidden="true"
                      className="h-px w-5 transition-[width] duration-300"
                      style={{
                        backgroundColor: isActive ? ACCENTS[item.accent] : "rgba(232,226,214,0.25)",
                        width: isActive ? "2.25rem" : "1.25rem",
                      }}
                    />
                  </div>

                  <h3
                    className={`${DISPLAY} mt-2 text-lg font-bold uppercase tracking-[-0.01em] transition-colors duration-300 sm:text-xl`}
                    style={{ color: isActive ? ACCENTS[item.accent] : IVORY }}
                  >
                    {item.phase}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#E8E2D6]/60 sm:text-sm">
                    {item.description}
                  </p>

                  <motion.p
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={`${MONO} mt-2 text-[9px] uppercase tracking-[0.16em] text-[#E8E2D6]/45`}
                  >
                    {coordTag}
                  </motion.p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* ============================================================ */}
        {/*  MOBILE / TABLET — vertical sequence                          */}
        {/* ============================================================ */}
        <ol
          aria-label="BvB process, six stages"
          className="relative mt-16 list-none space-y-10 lg:hidden"
        >
          {/* vertical construction line */}
          <span
            aria-hidden="true"
            className="absolute left-[19px] top-2 bottom-2 w-px bg-[#E8E2D6]/12 sm:left-[21px]"
          />

          {TIMELINE.map((item, i) => {
            const isActive = active === `m-${i}`;
            return (
              <motion.li
                key={item.number}
                tabIndex={0}
                role="group"
                aria-label={`Stage ${item.number}, ${item.phase}. ${item.title} ${item.description}`}
                onFocus={() => setActive(`m-${i}`)}
                onBlur={() => setActive((cur) => (cur === `m-${i}` ? null : cur))}
                onTouchStart={() => setActive(`m-${i}`)}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.06, ease: EASE }}
                className="relative flex gap-4 pl-0 outline-none sm:gap-5"
              >
                <div className="relative z-10 shrink-0 pt-0.5">
                  <TimelineNode accent={item.accent} active={isActive} code={item.code} reduced={reduced} size={40} />
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className={`${MONO} flex items-baseline gap-2 text-[10px] tracking-[0.2em] text-[#E8E2D6]/40`}>
                    <span>{item.number}</span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 max-w-8"
                      style={{ backgroundColor: isActive ? ACCENTS[item.accent] : "rgba(232,226,214,0.2)" }}
                    />
                  </div>

                  <h3
                    className={`${DISPLAY} mt-2 text-xl font-bold uppercase tracking-[-0.01em] transition-colors duration-300`}
                    style={{ color: isActive ? ACCENTS[item.accent] : IVORY }}
                  >
                    {item.phase}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#E8E2D6]/60">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* Closing module label — echoes Hero / About's footer labels */}
        <Reveal
          reduced={reduced}
          delay={0.1}
          className="mt-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#E8E2D6]/10 pt-5 lg:mt-24"
        >
          <Label dot="bg-[#8B7CF6]">SIX STATES // ONE SYSTEM</Label>
          <Label dot="bg-[#C4642E]">PROCESS MODULE // ACTIVE</Label>
        </Reveal>
      </div>
    </section>
  );
}