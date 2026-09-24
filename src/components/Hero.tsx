"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 55, damping: 18, mass: 0.6 };

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text pb-[0.04em] pr-[0.06em] text-transparent";

const GRAIN = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
};

/* Brand palette + a few derived shadow tones for the faceted surfaces. */
const VIOLET = "#8B7CF6";
const DEEP = "#3B2F4F";
const EMBER = "#C4642E";
const IVORY = "#E8E2D6";
const BG = "#1A1410";
const NIGHT = "#2B2138";
const ABYSS = "#1F1729";
const ASH = "#B5AC9C";
const EMBER_MID = "#A9531F";
const EMBER_DARK = "#7A3A1B";
const EMBER_DEEP = "#5E2C14";
const VIOLET_MID = "#6C5FD0";
const VIOLET_SIDE = "#4E4380";

/* ------------------------------------------------------------------ */
/*  Fragment geometry                                                  */
/*                                                                     */
/*  One shared 1000 x 488 drawing space. Every parallax layer draws in */
/*  the same coordinates, so the layers always stay registered.        */
/*                                                                     */
/*  Composition, left to right:                                        */
/*    01 BUILD    an assembled isometric structure, one block being    */
/*                lowered into its slot                                */
/*    --          a faceted "V" that hinges on its apex                */
/*    02 BREAK    the same structure fracturing, blocks leaving        */
/*    03 REASSEMBLE  ghost outlines + leader lines mark where every    */
/*                fragment belongs                                     */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 488;
const K = Math.sqrt(3) / 2;
const CUBE_S = 52;
const NS = { vectorEffect: "non-scaling-stroke" };

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
  ivory: [IVORY, VIOLET, DEEP],
  violet: [VIOLET, DEEP, EMBER],
  deep: [DEEP, NIGHT, ABYSS],
  ember: [EMBER, DEEP, NIGHT],
  pale: [IVORY, EMBER, DEEP],
};

function floorPath(p, x0, x1, y0, y1) {
  const seg = (a, b) => `M${fmt(a[0])} ${fmt(a[1])}L${fmt(b[0])} ${fmt(b[1])}`;
  let d = "";
  for (let x = x0; x <= x1; x += 1) d += seg(p(x, y0, 0), p(x, y1, 0));
  for (let y = y0; y <= y1; y += 1) d += seg(p(x0, y, 0), p(x1, y, 0));
  return d;
}

/* ---- 01 BUILD ---------------------------------------------------- */

const A_P = iso(285, 277);

const A_CUBES = [
  [0, 0, 0, "deep"],
  [1, 0, 0, "violet"],
  [2, 0, 0, "ivory"],
  [0, 1, 0, "violet"],
  [0, 0, 1, "deep"],
  [1, 1, 0, "deep"],
  [1, 0, 1, "ivory"],
  [0, 1, 1, "violet"],
  [0, 0, 2, "ivory"],
]
  .map(([x, y, z, tone]: any[]) => ({
    key: `a-${x}${y}${z}`,
    tone,
    f: box(A_P, x, y, z),
    sum: x + y + z,
    delay: 0.35 + z * 0.22 + (x + y) * 0.07,
  }))
  .sort((a, b) => a.sum - b.sum);

const A_HOVER = box(A_P, 0, 0, 3.6);
const A_SLOT = box(A_P, 0, 0, 3);
const A_GUIDES = [
  [1, 0],
  [1, 1],
  [0, 1],
].map(([x, y]) => [A_P(x, y, 3.6), A_P(x, y, 3)]);

const A_FLOOR = floorPath(A_P, -1, 3, -1, 2);
const A_FOOTPRINT = pts([
  A_P(0, 0, 0),
  A_P(3, 0, 0),
  A_P(3, 2, 0),
  A_P(0, 2, 0),
]);

/* ---- 02 BREAK ---------------------------------------------------- */

const B_P = iso(690, 277);

const B_ITEMS = [
  { c: [0, 0, 0], tone: "ember", d: [0, 0, 0], layer: "core" },
  { c: [0, 1, 0], tone: "ivory", d: [0, 0, 0], layer: "core" },
  { c: [1, 0, 0], tone: "deep", d: [16, 5, 3], layer: "frag" },
  { c: [0, 0, 1], tone: "violet", d: [8, -16, -3], layer: "frag" },
  { c: [1, 1, 0], tone: "violet", d: [34, 14, 7], layer: "frag", split: true },
  { c: [1, 0, 1], tone: "pale", d: [58, -34, 13], layer: "lift" },
  { c: [0, 0, 2], tone: "ivory", d: [30, -72, -9], layer: "lift" },
]
  .map((it) => {
    const [x, y, z] = it.c;
    return { ...it, key: `b-${x}${y}${z}`, f: box(B_P, x, y, z), sum: x + y + z };
  })
  .sort((a, b) => a.sum - b.sum);

const B_CORE = B_ITEMS.filter((i) => i.layer === "core");
const B_FRAG = B_ITEMS.filter((i) => i.layer === "frag");
const B_LIFT = B_ITEMS.filter((i) => i.layer === "lift");
const B_MOVED = B_ITEMS.filter((i) => i.d[0] || i.d[1]);

const B_FLOOR = floorPath(B_P, -1, 3, -1, 2);
const B_FOOTPRINT = pts([
  B_P(0, 0, 0),
  B_P(2, 0, 0),
  B_P(2, 2, 0),
  B_P(0, 2, 0),
]);

/* Faceted "V": each arm is a quad tessellated into four planes. */
const V_APEX = [500, 396];
const V_LEFT = {
  quad: [
    [408, 128],
    [462, 102],
    [498, 134],
    V_APEX,
  ],
  inner: [470, 250],
  fills: [EMBER, EMBER_DARK, EMBER_DEEP, EMBER_MID],
};
const V_RIGHT = {
  quad: [
    [520, 118],
    [568, 94],
    [604, 128],
    V_APEX,
  ],
  inner: [548, 238],
  fills: [VIOLET, VIOLET_MID, DEEP, VIOLET_SIDE],
};

const tessellate = ({ quad, inner }) =>
  quad.map((p, i) => pts([p, quad[(i + 1) % quad.length], inner]));

/* Loose shards. Each is a quad split along one diagonal (lit + shade). */
const MID_DEBRIS = [
  { q: [[792, 58], [836, 34], [826, 92], [800, 88]], lit: EMBER, shade: EMBER_DARK, dy: 7, rot: 5, dur: 7.5, delay: 0 },
  { q: [[868, 196], [916, 178], [926, 228], [880, 246]], lit: VIOLET, shade: DEEP, dy: 9, rot: -4, dur: 9, delay: 0.6 },
  { q: [[846, 104], [884, 92], [878, 124], [858, 134]], lit: IVORY, shade: ASH, dy: 5, rot: 7, dur: 6.5, delay: 1.1 },
  { q: [[842, 330], [878, 314], [872, 362], [850, 368]], lit: EMBER, shade: EMBER_DARK, dy: 8, rot: -6, dur: 8, delay: 0.3 },
  { q: [[786, 402], [824, 390], [816, 428], [792, 432]], lit: VIOLET, shade: DEEP, dy: 6, rot: 5, dur: 7, delay: 0.9 },
];

const NEAR_DEBRIS = [
  { q: [[904, 64], [962, 44], [976, 104], [924, 128]], lit: VIOLET, shade: DEEP, dy: 10, rot: -5, dur: 10, delay: 0.2 },
  { q: [[930, 300], [972, 282], [982, 336], [944, 352]], lit: EMBER, shade: EMBER_DARK, dy: 12, rot: 6, dur: 11, delay: 0.8 },
  { q: [[636, 30], [668, 14], [660, 52], [644, 54]], lit: EMBER, shade: EMBER_DARK, dy: 8, rot: 8, dur: 8.5, delay: 0.5 },
];

const MINI_CUBES = [
  { f: box(iso(902, 152, 20), -0.5, -0.5, -0.5), tone: "ivory", dy: 6, rot: 6, dur: 8, delay: 0.4 },
  { f: box(iso(962, 222, 15), -0.5, -0.5, -0.5), tone: "violet", dy: 5, rot: -7, dur: 9, delay: 1.0 },
];

/* Baseline ruler ticks (every 20 units, taller every 100). */
const TICKS = (() => {
  let d = "";
  for (let x = 120; x <= 920; x += 20) {
    d += `M${x} 412v${x % 100 === 0 ? 8 : 4}`;
  }
  return d;
})();

/* ------------------------------------------------------------------ */
/*  Shard field data                                                   */
/*                                                                     */
/*  A small, deterministic scatter of fragments (no Math.random, so    */
/*  SSR and hydration always agree) plus a few "blueprint" clusters    */
/*  that snap into alignment when the cursor gets close.               */
/* ------------------------------------------------------------------ */

const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (r, list) => list[Math.floor(r() * list.length)];

const FIELD_KINDS = [
  "cube", "cube", "diamond", "diamond", "tri", "tri", "square", "shard",
  "shard", "shard", "rect", "line", "line", "cross", "cross", "facet", "facet",
];
const FIELD_TONES = [
  "violet", "violet", "ember", "ember", "ivory", "ivory", "deep", "pale", "violet", "ember",
];
const FIELD_INKS = [VIOLET, VIOLET, EMBER, EMBER, IVORY, IVORY, IVORY];

/* Quads in a 24 x 24 box, split along one diagonal like the existing debris. */
const FIELD_SHARDS = [
  [[6, 2], [19, 8], [14, 22], [3, 14]],
  [[10, 1], [21, 12], [9, 23], [5, 10]],
  [[3, 5], [20, 2], [17, 21], [8, 17]],
];

/* x / y are % of the hero. Fragments keep to the upper part of the hero so
   they never sit behind the headline, statement or CTAs; on small screens y
   is compressed further (see `ys` in ShardField). */
const FIELD = (() => {
  const r = rng(20260920);
  const out = [];
  for (let tries = 0; out.length < 44 && tries < 1200; tries++) {
    const x = 2 + r() * 96;
    const y = 4 + r() * 60;
    /* thin out the middle, where the structures already live */
    if (x > 22 && x < 80 && y > 18 && y < 58 && r() < 0.65) continue;
    if (out.some((o) => Math.hypot((o.x - x) * 1.6, o.y - y) < 7)) continue;

    const roll = r();
    const d =
      roll < 0.42 ? 0.1 + r() * 0.22 : roll < 0.78 ? 0.36 + r() * 0.28 : 0.68 + r() * 0.3;
    const kind = pick(r, FIELD_KINDS);
    const tone = pick(r, FIELD_TONES);
    const ink = pick(r, FIELD_INKS);
    const light = tone === "ivory" || tone === "pale" || ink === IVORY;
    const rot =
      kind === "line"
        ? pick(r, [0, 90, 30, -30, 60, -60])
        : kind === "cross"
          ? pick(r, [0, 0, 45])
          : kind === "cube"
            ? Math.round((r() - 0.5) * 44)
            : Math.round(r() * 360);
    const dur = 9 + r() * 9;

    out.push({
      id: out.length,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      d,
      kind,
      tone,
      ink,
      outline: r() < 0.45,
      q: pick(r, FIELD_SHARDS),
      size: Math.max(8, Math.round((7 + d * 19) * (kind === "line" || kind === "cross" ? 1.2 : 1))),
      op: Math.min(0.95, (0.24 + d * 0.66) * (light ? 0.85 : 1)),
      rot,
      dr: (r() < 0.5 ? -1 : 1) * (4 + r() * 16 * (0.4 + d)),
      dy: 2 + d * 8 * (0.6 + r() * 0.8),
      dur,
      delay: r() * dur,
      spin: r() < 0.5 ? -1 : 1,
      m: out.length % 3 === 0, // the lighter set kept on small screens
    });
  }
  return out;
})();

/* Blueprint clusters. `p` is the aligned position inside the cluster box,
   `s` the scattered offset (dx, dy, rotation) they drift back to when the
   cursor leaves. Edges + face only fade in as the fragments align. */
const CLUSTERS = [
  {
    id: "c1", x: 11, y: 27, w: 132, h: 104, ink: VIOLET, delay: 0, m: true,
    nodes: [
      { p: [14, 78], s: [-16, 10, -50], k: "square", ink: VIOLET },
      { p: [52, 16], s: [10, -14, 40], k: "diamond", tone: "violet" },
      { p: [116, 44], s: [18, 12, -30], k: "tri", tone: "ember" },
      { p: [86, 94], s: [-8, 18, 60], k: "cube", tone: "ivory" },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
    face: [1, 2, 3],
  },
  {
    id: "c2", x: 78, y: 13, w: 110, h: 90, ink: EMBER, delay: 3, m: true,
    nodes: [
      { p: [12, 70], s: [-12, 8, 30], k: "diamond", tone: "ember" },
      { p: [60, 12], s: [6, -14, -40], k: "square", ink: EMBER },
      { p: [98, 62], s: [14, 10, 50], k: "cross", ink: IVORY },
    ],
    edges: [[0, 1], [1, 2], [2, 0]],
    face: [0, 1, 2],
  },
  {
    id: "c3", x: 13, y: 47, w: 96, h: 100, ink: IVORY, delay: 6, m: false,
    nodes: [
      { p: [10, 92], s: [-10, 12, 40], k: "tri", tone: "violet" },
      { p: [34, 50], s: [8, -12, -35], k: "square", ink: IVORY },
      { p: [58, 72], s: [-6, 14, 55], k: "diamond", tone: "ember", outline: true, ink: EMBER },
      { p: [84, 12], s: [12, -8, 30], k: "cross", ink: IVORY },
    ],
    edges: [[0, 1], [1, 2], [2, 3]],
    face: null,
  },
];

const DRIFT_CSS =
  "@keyframes bvb-shard-drift{0%,100%{transform:translate3d(0,0,0) rotate(var(--r0))}50%{transform:translate3d(0,var(--dy),0) rotate(calc(var(--r0) + var(--dr)))}}@media (prefers-reduced-motion:reduce){.bvb-shard{animation:none!important}}";

/* A slow diagonal light sweep behind the V, and a faint breathing pulse for
   the BUILD stack — both extremely subtle, both paused under reduced motion. */
const AMBIENT_CSS =
  "@keyframes bvb-hero-sweep{0%{transform:translateX(-60%) translateY(-10%) rotate(18deg)}100%{transform:translateX(60%) translateY(10%) rotate(18deg)}}@keyframes bvb-hero-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}@media (prefers-reduced-motion:reduce){.bvb-sweep,.bvb-breathe{animation:none!important}}";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** True on devices with a real mouse / trackpad. */
function useFinePointer() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}

/** True from the md breakpoint up (used to thin the shard field on phones). */
function useWide() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}

/* ------------------------------------------------------------------ */
/*  Fragment pieces                                                    */
/* ------------------------------------------------------------------ */

const REST = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

/**
 * One depth layer. The outer element carries the mouse parallax
 * (transform only, driven by motion values so React never re-renders);
 * the inner element carries the entrance.
 *
 *   px / py  → max horizontal / vertical travel, % of stage width
 *              (negative = moves against the cursor = further away)
 *   rot      → max rotation in degrees
 *   zoom     → max extra scale at the screen edges
 */
function Layer({
  mouse,
  reduced,
  px = 0,
  py = 0,
  rot = 0,
  zoom = 0,
  origin = "50% 50%",
  enter = undefined,
  depth = "mid",
  children,
}: any) {
  const x = useTransform(mouse.x, (v: any) => `${(v * px).toFixed(3)}%`);
  const y = useTransform(mouse.y, (v: any) => `${(v * py).toFixed(3)}%`);
  const rotate = useTransform(mouse.x, (v: any) => v * rot);
  const scale = useTransform(
    [mouse.x, mouse.y],
    ([a, b]: any[]) => 1 + ((Math.abs(a) + Math.abs(b)) / 2) * zoom
  );

  const e = enter || {};

  /* Foreground layers get a soft cast shadow so the nearest fragments read
     as physically closer to the viewer; mid/back layers stay flat so the
     effect doesn't turn into generic drop-shadow-everywhere. */
  const depthFilter =
    depth === "near"
      ? "drop-shadow(0 6px 10px rgba(0,0,0,0.35))"
      : depth === "far"
        ? undefined
        : undefined;

  return (
    <motion.div
      aria-hidden="true"
      style={
        reduced
          ? depthFilter
            ? { filter: depthFilter }
            : undefined
          : { x, y, rotate, scale, transformOrigin: origin, filter: depthFilter }
      }
      className="pointer-events-none absolute inset-0 will-change-transform"
    >
      <motion.div
        initial={reduced || !e.from ? false : e.from}
        animate={e.from ? REST : undefined}
        transition={{ duration: e.duration ?? 1.2, delay: e.delay ?? 0, ease: EASE }}
        style={{ transformOrigin: e.origin ?? "50% 50%" }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Scene({ children }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      focusable="false"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      {children}
    </svg>
  );
}

function Cube({ f, tone }) {
  const [top, left, right] = (TONES as any)[tone] || TONES.violet;
  return (
    <g stroke={IVORY} strokeOpacity="0.2" strokeWidth="0.8" strokeLinejoin="round">
      <polygon points={f.left} fill={left} />
      <polygon points={f.right} fill={right} />
      <polygon points={f.top} fill={top} />
    </g>
  );
}

function Crystal({ q, lit, shade }) {
  return (
    <g stroke={IVORY} strokeOpacity="0.22" strokeWidth="0.8" strokeLinejoin="round">
      <polygon points={pts([q[0], q[1], q[2]])} fill={lit} />
      <polygon points={pts([q[0], q[2], q[3]])} fill={shade} />
    </g>
  );
}

/** Slow ambient drift. Doubles as the "alive" motion on touch devices. */
function Drift({ dy = 6, rot = 4, dur = 8, delay = 0, reduced, children }) {
  return (
    <motion.g
      animate={reduced ? undefined : { y: [0, -dy, 0], rotate: [0, rot, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.g>
  );
}

/** A block that leaves its slot and settles rotated + displaced. */
function BreakCube({ item, reduced, delay }) {
  const [dx, dy, rot] = item.d;
  return (
    <motion.g
      initial={reduced ? false : { x: 0, y: 0, rotate: 0 }}
      animate={{ x: dx, y: dy, rotate: rot }}
      transition={{ duration: 1.5, delay, ease: EASE }}
    >
      {item.split ? (
        <SplitCube item={item} reduced={reduced} delay={delay} />
      ) : (
        <Cube f={item.f} tone={item.tone} />
      )}
    </motion.g>
  );
}

/** A block cut along a diagonal; the two halves slide apart along a crack. */
function SplitCube({ item, reduced, delay }) {
  const [cx, cy] = item.f.center;
  const a = (-32 * Math.PI) / 180;
  const d = [Math.cos(a), Math.sin(a)];
  const n = [-Math.sin(a), Math.cos(a)];
  const L = 200;

  const half = (s) =>
    pts([
      [cx - d[0] * L, cy - d[1] * L],
      [cx + d[0] * L, cy + d[1] * L],
      [cx + d[0] * L + s * n[0] * L, cy + d[1] * L + s * n[1] * L],
      [cx - d[0] * L + s * n[0] * L, cy - d[1] * L + s * n[1] * L],
    ]);

  const gap = 5;
  const shear = 4;
  const offA = { x: n[0] * gap + d[0] * shear, y: n[1] * gap + d[1] * shear };
  const offB = { x: -n[0] * gap - d[0] * shear, y: -n[1] * gap - d[1] * shear };

  const crack = [-62, -40, -18, 4, 26, 50, 72].map((t, i) => {
    const j = i % 2 ? 4 : -4;
    return [cx + d[0] * t + n[0] * j, cy + d[1] * t + n[1] * j];
  });

  const t = { duration: 1.4, delay: delay + 0.15, ease: EASE };

  return (
    <g>
      <defs>
        <clipPath id="bvb-hero-cut-a">
          <polygon points={half(1)} />
        </clipPath>
        <clipPath id="bvb-hero-cut-b">
          <polygon points={half(-1)} />
        </clipPath>
      </defs>

      <motion.g
        initial={reduced ? false : { x: 0, y: 0 }}
        animate={offA}
        transition={t}
      >
        <g clipPath="url(#bvb-hero-cut-a)">
          <Cube f={item.f} tone={item.tone} />
        </g>
      </motion.g>

      <motion.g
        initial={reduced ? false : { x: 0, y: 0 }}
        animate={offB}
        transition={t}
      >
        <g clipPath="url(#bvb-hero-cut-b)">
          <Cube f={item.f} tone={item.tone} />
        </g>
      </motion.g>

      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: EASE }}
      >
        <polyline points={pts(crack)} stroke={BG} strokeWidth="3.5" strokeLinejoin="round" />
        <polyline points={pts(crack)} stroke={IVORY} strokeOpacity="0.75" strokeWidth="1" strokeLinejoin="round" />
      </motion.g>

      {/* a brief flash at the instant of separation — reads as a spark
          along the fracture, not a generic glow */}
      {!reduced && (
        <motion.circle
          cx={cx}
          cy={cy}
          r="1"
          fill={IVORY}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.4, 7, 9] }}
          transition={{ duration: 0.6, delay: delay + 0.4, ease: EASE }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      )}
    </g>
  );
}

function Tag({ left, n, tone, children }) {
  return (
    <span
      style={{ left, top: `${(422 / VB_H) * 100}%` }}
      className={`${MONO} absolute hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.22em] text-[#E8E2D6]/55 md:inline-flex lg:text-[10px]`}
    >
      <span className={tone}>{n}</span>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Shard field                                                        */
/*                                                                     */
/*  Sits behind the stage and the headline (z-10), so it can never     */
/*  cover BUILD / VS / BREAK or the CTAs. It reuses the hero's sprung  */
/*  mouse values:                                                      */
/*    · every fragment has its own depth → parallax + tilt             */
/*    · loose fragments are pushed and spun as the cursor passes,      */
/*      then settle back (the cursor disturbs a physical field)        */
/*    · blueprint clusters do the opposite: near the cursor their      */
/*      fragments snap onto a clean geometric path and the connecting  */
/*      lines + facet appear — a tiny echo of "03 REASSEMBLE"          */
/* ------------------------------------------------------------------ */

/** Distance of the (section-relative) cursor to a point given in % units. */
function reach(geo, xPct, yPct, mv, k, lo, hi) {
  const pr = Math.min(1, Math.max(0, mv[2]));
  if (pr < 0.01 || typeof window === "undefined") return { s: 0, ux: 0, uy: 0 };
  const cx = ((mv[0] + 1) / 2) * window.innerWidth;
  const cy = ((mv[1] + 1) / 2) * window.innerHeight + window.scrollY - geo.top;
  const dx = (xPct / 100) * geo.w - cx;
  const dy = (yPct / 100) * geo.h - cy;
  const R = Math.min(hi, Math.max(lo, geo.w * k));
  const dist = Math.hypot(dx, dy) || 1;
  return { s: Math.max(0, 1 - dist / R) * pr, ux: dx / dist, uy: dy / dist };
}

/** One tiny fragment, drawn in a 24 x 24 box. */
function Glyph({ kind, tone = "violet", ink = IVORY, outline = false, q = FIELD_SHARDS[0] }) {
  const [top, left, right] = TONES[tone];
  const edge = {
    stroke: IVORY,
    strokeOpacity: 0.22,
    strokeWidth: 0.8,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "cube":
      return (
        <g {...edge}>
          <polygon points="4,7.5 12,12 12,21 4,16.5" fill={left} />
          <polygon points="12,12 20,7.5 20,16.5 12,21" fill={right} />
          <polygon points="12,3 20,7.5 12,12 4,7.5" fill={top} />
        </g>
      );
    case "diamond":
      return outline ? (
        <polygon points="12,2 21,12 12,22 3,12" stroke={ink} strokeWidth="1.2" strokeLinejoin="round" {...NS} />
      ) : (
        <g {...edge}>
          <polygon points="12,2 3,12 12,22" fill={left} />
          <polygon points="12,2 21,12 12,22" fill={top} />
        </g>
      );
    case "tri":
      return outline ? (
        <polygon points="12,3 21,20 3,19" stroke={ink} strokeWidth="1.2" strokeLinejoin="round" {...NS} />
      ) : (
        <g {...edge}>
          <polygon points="12,3 21,20 12,19.5" fill={top} />
          <polygon points="12,3 12,19.5 3,19" fill={left} />
        </g>
      );
    case "square":
      return outline ? (
        <rect x="6" y="6" width="12" height="12" stroke={ink} strokeWidth="1.2" {...NS} />
      ) : (
        <rect x="6" y="6" width="12" height="12" fill={ink} />
      );
    case "shard":
      return <Crystal q={q} lit={top} shade={left} />;
    case "rect":
      return (
        <g>
          <rect x="9" y="1" width="3" height="22" fill={ink} />
          <rect x="12" y="1" width="3" height="22" fill={ink} fillOpacity="0.55" />
        </g>
      );
    case "line":
      return (
        <g stroke={ink} strokeWidth="1" strokeLinecap="square">
          <path d="M1 12H23" {...NS} />
          <path d="M1 8.5V15.5M23 8.5V15.5" {...NS} />
        </g>
      );
    case "cross":
      return (
        <g stroke={ink} strokeWidth="1">
          <path d="M12 3V21" {...NS} />
          <path d="M3 12H21" {...NS} />
          <rect x="11" y="11" width="2" height="2" fill={ink} stroke="none" />
        </g>
      );
    case "facet": {
      const V = [[12, 2], [21, 9], [17, 21], [6, 20], [3, 8]];
      const fills = [top, left, right, top, left];
      return (
        <g {...edge}>
          {V.map((v, i) => (
            <polygon
              key={i}
              points={pts([[11, 12], v, V[(i + 1) % V.length]])}
              fill={fills[i]}
            />
          ))}
        </g>
      );
    }
    default:
      return null;
  }
}

/** A loose fragment: depth parallax + proximity push, CSS-driven drift. */
function Shard({ p, field }) {
  const { mouse, presence, geo, reduced, wide, ys } = field;

  const state = useTransform([mouse.x, mouse.y, presence], (mv: any) => {
    const g = reach(geo.current, p.x, p.y * geo.current.ys, mv, 0.13, 120, 220);
    const f = g.s * g.s;
    const par = (p.d - 0.3) * 44;
    const push = 22 + 60 * p.d;
    return {
      x: mv[0] * par + g.ux * f * push,
      y: mv[1] * par * 0.7 + g.uy * f * push,
      r: mv[0] * (p.d - 0.3) * 12 + p.spin * f * (50 + 90 * p.d),
      o: Math.min(1, p.op + f * 0.55),
    };
  });
  const x = useTransform(state, (v) => v.x);
  const y = useTransform(state, (v) => v.y);
  const rotate = useTransform(state, (v) => v.r);
  const opacity = useTransform(state, (v) => v.o);

  const pos = {
    left: `${p.x}%`,
    top: `${(p.y * ys).toFixed(2)}%`,
    width: p.size,
    height: p.size,
    marginLeft: -p.size / 2,
    marginTop: -p.size / 2,
  };

  return (
    <motion.span
      style={reduced ? { ...pos, opacity: p.op } : { ...pos, x, y, rotate, opacity }}
      className="absolute block"
    >
      <span
        className="bvb-shard block h-full w-full"
        style={{
          ["--r0" as any]: `${p.rot}deg`,
          ["--dr" as any]: `${p.dr.toFixed(1)}deg`,
          ["--dy" as any]: `${(-p.dy * (wide ? 1 : 0.6)).toFixed(1)}px`,
          transform: `rotate(${p.rot}deg)`,
          animation: reduced
            ? undefined
            : `bvb-shard-drift ${p.dur.toFixed(1)}s ease-in-out ${(-p.delay).toFixed(1)}s infinite`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          focusable="false"
          aria-hidden="true"
          className="block h-full w-full overflow-visible"
        >
          <Glyph kind={p.kind} tone={p.tone} ink={p.ink} outline={p.outline} q={p.q} />
        </svg>
      </span>
    </motion.span>
  );
}

function ClusterNode({ n, t }) {
  const x = useTransform(t, (v: any) => n.s[0] * (1 - v));
  const y = useTransform(t, (v: any) => n.s[1] * (1 - v));
  const rotate = useTransform(t, (v: any) => n.s[2] * (1 - v));

  return (
    <g transform={`translate(${n.p[0]} ${n.p[1]})`}>
      <motion.g style={{ x, y, rotate }}>
        <g transform="translate(-7.4 -7.4) scale(0.62)">
          <Glyph kind={n.k} tone={n.tone} ink={n.ink} outline={n.outline} />
        </g>
      </motion.g>
    </g>
  );
}

/** Fragments that snap onto a blueprint when the cursor comes near. */
function Cluster({ c, field }) {
  const { mouse, presence, geo, reduced, fine, wide, ys } = field;

  /* Touch screens have no cursor: let the clusters slowly assemble on their own. */
  const ambient = useMotionValue(0);
  useEffect(() => {
    if (reduced || fine) return undefined;
    const controls = animate(ambient, [0, 1, 0], {
      duration: 11 + c.delay,
      delay: c.delay,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [reduced, fine, ambient, c.delay]);

  const t = useTransform([mouse.x, mouse.y, presence, ambient], (mv: any) => {
    if (reduced) return 0.7;
    const g = reach(geo.current, c.x, c.y * geo.current.ys, mv, 0.2, 150, 300);
    return Math.max(g.s * g.s * (3 - 2 * g.s), mv[3] * 0.8);
  });
  const lineO = useTransform(t, (v: any) => v * 0.8);
  const nodeO = useTransform(t, (v: any) => 0.5 + v * 0.4);
  const px = useTransform(mouse.x, (v: any) => v * 11);
  const py = useTransform(mouse.y, (v: any) => v * 8);

  const k = wide ? 1 : 0.72;
  const w = c.w * k;
  const h = c.h * k;
  const face = c.face ? pts(c.face.map((i) => c.nodes[i].p)) : null;

  return (
    <motion.div
      style={{
        ...(reduced ? null : { x: px, y: py }),
        left: `${c.x}%`,
        top: `${(c.y * ys).toFixed(2)}%`,
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
      }}
      className="absolute"
    >
      <svg
        viewBox={`0 0 ${c.w} ${c.h}`}
        fill="none"
        focusable="false"
        aria-hidden="true"
        className="block h-full w-full overflow-visible"
      >
        {/* blueprint: facet, links and slot marks, revealed by proximity */}
        <motion.g style={{ opacity: lineO }}>
          {face && <polygon points={face} fill={c.ink} fillOpacity="0.12" />}
          {c.edges.map(([a, b], i) => (
            <line
              key={i}
              x1={c.nodes[a].p[0]}
              y1={c.nodes[a].p[1]}
              x2={c.nodes[b].p[0]}
              y2={c.nodes[b].p[1]}
              stroke={c.ink}
              strokeOpacity="0.85"
              strokeWidth="1"
              {...NS}
            />
          ))}
          {c.nodes.map((n, i) => (
            <path
              key={i}
              d={`M${n.p[0] - 6} ${n.p[1]}H${n.p[0] + 6}M${n.p[0]} ${n.p[1] - 6}V${n.p[1] + 6}`}
              stroke={IVORY}
              strokeOpacity="0.4"
              strokeWidth="1"
              {...NS}
            />
          ))}
        </motion.g>

        <motion.g style={{ opacity: nodeO }}>
          {c.nodes.map((n, i) => (
            <ClusterNode key={i} n={n} t={t} />
          ))}
        </motion.g>
      </svg>
    </motion.div>
  );
}

function ShardField({ sectionRef, mouse, presence, reduced, fine, wide, scrollY }) {
  const geo = useRef({ w: 1440, h: 900, top: 0, ys: 1 });

  useEffect(() => {
    geo.current.ys = wide ? 1 : 0.8;
  }, [wide]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      geo.current.w = r.width;
      geo.current.h = r.height;
      geo.current.top = r.top + window.scrollY;
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionRef]);

  const ys = wide ? 1 : 0.8;
  const field = { mouse, presence, geo, reduced, fine, wide, ys };
  const shards = wide ? FIELD : FIELD.filter((p) => p.m);
  const clusters = wide ? CLUSTERS : CLUSTERS.filter((c) => c.m);

  return (
    <motion.div
      aria-hidden="true"
      style={reduced ? undefined : { y: scrollY }}
      className="pointer-events-none absolute inset-0 z-10"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 2.2, ease: EASE }}
        className="absolute inset-0"
      >
        <style>{DRIFT_CSS}</style>
        {clusters.map((c) => (
          <Cluster key={c.id} c={c} field={field} />
        ))}
        {shards.map((p) => (
          <Shard key={p.id} p={p} field={field} />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Label({ children, dot = "bg-[#8B7CF6]", className = "" }) {
  return (
    <span
      className={`${MONO} inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#E8E2D6]/55 sm:text-[11px] sm:tracking-[0.22em] ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 animate-pulse motion-reduce:animate-none ${dot}`}
      />
      {children}
    </span>
  );
}

function Word({ children, delay, reduced, className = "" }) {
  return (
    <motion.span
      initial={reduced ? false : { opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        opacity: { duration: 0.7, delay, ease: EASE },
        filter: { duration: 0.7, delay, ease: EASE },
        y: reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 140, damping: 15, delay },
      }}
      className={`relative inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

/** "BREAK" sliced along a diagonal fracture line. */
function FracturedText({ children, gradient }) {
  return (
    <span className="relative inline-block" aria-hidden="true">
      <span
        className={`block ${gradient} [clip-path:polygon(0_0,100%_0,100%_34%,0_62%)]`}
      >
        {children}
      </span>
      <span
        className={`absolute inset-0 block translate-x-[0.03em] translate-y-[0.035em] ${gradient} [clip-path:polygon(0_62%,100%_34%,100%_100%,0_100%)]`}
      >
        {children}
      </span>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="62"
          x2="100"
          y2="34"
          stroke="#C4642E"
          strokeWidth="1"
          strokeOpacity="0.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

function PrimaryCta({ href, onClick, children }) {
  return (
    <span className="group relative block transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:drop-shadow-[0_0_18px_rgba(139,124,246,0.5)] focus-within:drop-shadow-[0_0_6px_#E8E2D6] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:inline-block">
      <a
        href={href}
        onClick={onClick}
        className="relative flex min-h-13 items-center justify-center gap-3 overflow-hidden bg-[#8B7CF6] px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-[#1A1410] outline-none transition-colors duration-300 [clip-path:polygon(0_0,calc(100%-14px)_0,100%_14px,100%_100%,14px_100%,0_calc(100%-14px))] focus-visible:bg-[#E8E2D6]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-[#C4642E] transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
        />
        <span className="relative">{children}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </span>
  );
}

function SecondaryCta({ href, onClick }) {
  return (
    <span className="group relative block transition-[translate] duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:inline-block">
      <a
        href={href}
        onClick={onClick}
        className="relative flex min-h-13 items-center justify-center gap-3 border border-[#E8E2D6]/25 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#E8E2D6] transition-colors duration-300 hover:border-[#C4642E] hover:bg-[#C4642E]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E2D6]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 border-l border-t border-[#C4642E] opacity-0 transition-all duration-300 group-hover:-left-px group-hover:-top-px group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 border-b border-r border-[#C4642E] opacity-0 transition-all duration-300 group-hover:-bottom-px group-hover:-right-px group-hover:opacity-100"
        />
        <span>Explore BvB</span>
        <ArrowDown
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
        />
      </a>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export interface HeroProps {
  registerHref?: string;
  exploreTarget?: string;
  onRegisterClick?: (e?: React.MouseEvent) => void;
}

export default function Hero({
  registerHref = "#register",
  exploreTarget = "#about",
  onRegisterClick,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const visibleRef = useRef(true);
  const reduced = Boolean(useReducedMotion());
  const canParallax = useFinePointer();

  /* Mouse parallax (normalised -1 … 1, sprung) */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, SPRING);
  const my = useSpring(rawY, SPRING);
  const mouse = { x: mx, y: my };

  /* Cursor presence (0 = absent, 1 = over the hero): keeps the shard field
     calm until the pointer actually arrives. */
  const rawP = useMotionValue(0);
  const presence = useSpring(rawP, { stiffness: 60, damping: 22 });
  const wide = useWide();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !canParallax) {
      rawX.set(0);
      rawY.set(0);
      rawP.set(0);
      return undefined;
    }

    const onMove = (e) => {
      if (!visibleRef.current) return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
      rawP.set(1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
      rawP.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, canParallax, rawX, rawY, rawP]);

  /* Scroll-away transitions (works with any external smooth scroller) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const stageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);

  const bgX = useTransform(mx, [-1, 1], [10, -10]);
  const bgY = useTransform([my, scrollYProgress], ([m, s]: any[]) => -m * 8 + s * 60);
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 46]);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.__lenis && !reduced) {
      const el = document.querySelector(exploreTarget);
      if (el) {
        window.__lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.15 });
      } else {
        window.__lenis.scrollTo(window.innerHeight, { duration: 1.15 });
      }
      return;
    }

    const behavior = reduced ? "auto" : "smooth";
    const el = document.querySelector(exploreTarget);
    if (el) {
      el.scrollIntoView({ behavior, block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior });
    }
  };

  const fade = (delay, y = 14) => ({
    initial: reduced ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  const shared = { mouse, reduced };
  const vLeft = tessellate(V_LEFT);
  const vRight = tessellate(V_RIGHT);

  /* A faint highlight that leans toward the cursor across the faceted
     surfaces — a cheap stand-in for real relighting, kept subtle enough
     that it reads as "premium sheen" rather than a spotlight. */
  const sheenX = useTransform(mx, (v) => `${50 + v * 22}%`);
  const sheenY = useTransform(my, (v) => `${50 + v * 18}%`);
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([sx, sy]) => `radial-gradient(38% 45% at ${sx} ${sy}, rgba(232,226,214,0.10), transparent 70%)`
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="BvB — Build vs Break"
      className="relative isolate min-h-svh w-full overflow-hidden bg-[#1A1410] text-[#E8E2D6]"
    >
      {/* ---------------------------------------------------------- */}
      {/* 1 · Background                                              */}
      {/* ---------------------------------------------------------- */}
      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <motion.div
          style={reduced ? undefined : { x: bgX, y: bgY }}
          className="absolute -inset-[6%]"
        >
          <div className="absolute -left-[10%] -top-[10%] h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgba(139,124,246,0.16),transparent)]" />
          <div className="absolute -bottom-[5%] -right-[8%] h-[65%] w-[55%] bg-[radial-gradient(closest-side,rgba(196,100,46,0.14),transparent)]" />
          <div className="absolute left-[25%] top-[20%] h-[50%] w-[50%] bg-[radial-gradient(closest-side,rgba(59,47,79,0.55),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.04)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </motion.div>

        {/* Construction rails, echoing the crosshair lines of the brand mark */}
        <span className="absolute inset-y-0 left-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.12)_30%,rgba(232,226,214,0.12)_70%,transparent)] lg:block" />
        <span className="absolute inset-y-0 right-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(232,226,214,0.12)_30%,rgba(232,226,214,0.12)_70%,transparent)] lg:block" />

        <div className="hidden sm:block absolute inset-0 opacity-[0.05]" style={GRAIN} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
      </motion.div>

      {/* ---------------------------------------------------------- */}
      {/* 1b · Shard field (behind the stage and the headline)        */}
      {/* ---------------------------------------------------------- */}
      <ShardField
        sectionRef={sectionRef}
        mouse={mouse}
        presence={presence}
        reduced={reduced}
        fine={canParallax}
        wide={wide}
        scrollY={fieldY}
      />

      {/* ---------------------------------------------------------- */}
      {/* 2 · Main composition                                        */}
      {/* ---------------------------------------------------------- */}
      <div className="relative z-20 mx-auto flex min-h-svh w-full max-w-[1600px] flex-col px-5 pb-8 pt-24 sm:px-8 md:pt-28 lg:px-14 lg:pb-12">
        {/* Fragment stage */}
        <div className="relative flex flex-1 items-center py-4 lg:py-0">
          <div className="relative -mx-4 w-[calc(100%+2rem)] max-w-none sm:mx-auto sm:w-full md:w-[88%] lg:ml-auto lg:mr-7 lg:w-[clamp(520px,calc((100svh_-_420px)*2.05),min(86%,1150px))]">
            {/* Atmospheric light behind the structure */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[12%] -z-10 overflow-hidden"
            >
              <style>{AMBIENT_CSS}</style>
              <div className="absolute left-[8%] top-[10%] h-[80%] w-[48%] bg-[radial-gradient(closest-side,rgba(139,124,246,0.26),transparent)]" />
              <div className="absolute right-[6%] top-[20%] h-[70%] w-[42%] bg-[radial-gradient(closest-side,rgba(196,100,46,0.2),transparent)]" />
              {/* a very slow, faint diagonal sheen crossing the seam where
                  BUILD gives way to BREAK — reads as a system "scan", not a
                  glow effect */}
              <div
                className="bvb-sweep absolute left-1/2 top-1/2 h-[40%] w-[18%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(232,226,214,0.05)_45%,rgba(232,226,214,0.05)_55%,transparent)] opacity-60"
                style={{ animation: "bvb-hero-sweep 14s ease-in-out infinite alternate" }}
              />
            </div>

            {/* Scroll-away */}
            <motion.div
              style={reduced ? undefined : { y: stageY, scale: stageScale }}
              className="relative"
            >
              <div className="relative aspect-[4/3] w-full sm:aspect-[3/2] md:aspect-[41/20]">
                {/* ---- Depth 0 · far blueprint ---- */}
                <Layer
                  {...shared}
                  px={-0.5}
                  py={-0.35}
                  enter={{ from: { opacity: 0 }, delay: 0.2, duration: 1.4 }}
                >
                  <Scene>
                    <defs>
                      <linearGradient
                        id="bvb-hero-base"
                        gradientUnits="userSpaceOnUse"
                        x1="-380"
                        y1="0"
                        x2="1000"
                        y2="0"
                      >
                        <stop offset="0" stopColor={IVORY} stopOpacity="0" />
                        <stop offset="0.35" stopColor={IVORY} stopOpacity="0.24" />
                        <stop offset="1" stopColor={IVORY} stopOpacity="0.24" />
                      </linearGradient>
                    </defs>

                    {/* isometric floor grids under each structure */}
                    <path d={A_FLOOR} stroke={IVORY} strokeOpacity="0.07" strokeWidth="1" {...NS} />
                    <path d={B_FLOOR} stroke={IVORY} strokeOpacity="0.07" strokeWidth="1" {...NS} />
                    <polygon points={A_FOOTPRINT} stroke={VIOLET} strokeOpacity="0.4" strokeWidth="1" {...NS} />
                    <polygon points={B_FOOTPRINT} stroke={EMBER} strokeOpacity="0.4" strokeWidth="1" {...NS} />

                    {/* construction circle */}
                    <circle cx="500" cy="232" r="226" stroke={IVORY} strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 7" {...NS} />
                    <path d="M326.9 377.3A226 226 0 0 1 326.9 86.7" stroke={EMBER} strokeOpacity="0.55" strokeWidth="1" {...NS} />
                    <path d="M673.1 86.7A226 226 0 0 1 673.1 377.3" stroke={VIOLET} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="5 6" {...NS} />

                    {/* crosshairs */}
                    <path d="M172 60V204M158 132H186" stroke={IVORY} strokeOpacity="0.35" strokeWidth="1" {...NS} />
                    <path d="M838 340V430M826 388H850" stroke={IVORY} strokeOpacity="0.35" strokeWidth="1" {...NS} />
                    <path d="M492 44H508M500 36V52" stroke={IVORY} strokeOpacity="0.4" strokeWidth="1" {...NS} />

                    {/* a few extra registration ticks — small, quiet detail
                        rather than a decorative flourish */}
                    <path d="M60 232H76M68 224V240" stroke={VIOLET} strokeOpacity="0.3" strokeWidth="1" {...NS} />
                    <path d="M924 176H940M932 168V184" stroke={EMBER} strokeOpacity="0.3" strokeWidth="1" {...NS} />
                    <circle cx="500" cy="232" r="2.5" fill="none" stroke={IVORY} strokeOpacity="0.3" strokeWidth="1" {...NS} />

                    {/* baseline ruler */}
                    <line x1="-380" y1="412" x2="1000" y2="412" stroke="url(#bvb-hero-base)" strokeWidth="1" {...NS} />
                    <path d={TICKS} stroke={IVORY} strokeOpacity="0.28" strokeWidth="1" {...NS} />
                    <line x1="195" y1="412" x2="420" y2="412" stroke={VIOLET} strokeWidth="2" {...NS} />
                    <line x1="600" y1="412" x2="845" y2="412" stroke={EMBER} strokeWidth="2" {...NS} />
                  </Scene>
                </Layer>

                {/* ---- Depth 1 · ghost slots + leader lines ---- */}
                <Layer
                  {...shared}
                  px={-0.3}
                  py={-0.25}
                  enter={{ from: { opacity: 0 }, delay: 3, duration: 1.1 }}
                >
                  <Scene>
                    {B_MOVED.map((it) => {
                      const [cx, cy] = it.f.center;
                      return (
                        <g key={`ghost-${it.key}`}>
                          <polygon
                            points={it.f.hex}
                            stroke={IVORY}
                            strokeOpacity="0.32"
                            strokeWidth="1"
                            strokeDasharray="4 5"
                            strokeLinejoin="round"
                            {...NS}
                          />
                          <line
                            x1={cx}
                            y1={cy}
                            x2={cx + it.d[0]}
                            y2={cy + it.d[1]}
                            stroke={EMBER}
                            strokeOpacity="0.55"
                            strokeWidth="1"
                            strokeDasharray="2 5"
                            {...NS}
                          />
                          <rect x={cx - 2.5} y={cy - 2.5} width="5" height="5" fill={EMBER} />
                        </g>
                      );
                    })}
                    {/* the slot the hovering block is heading for */}
                    <polygon
                      points={A_SLOT.hex}
                      stroke={VIOLET}
                      strokeOpacity="0.55"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                      strokeLinejoin="round"
                      {...NS}
                    />
                  </Scene>
                </Layer>

                {/* ---- Depth 2 · BUILD structure ---- */}
                <Layer
                  {...shared}
                  px={0.9}
                  py={0.6}
                  zoom={0.004}
                  origin="28% 54%"
                >
                  <Scene>
                    <Drift dy={1.6} rot={0} dur={7.5} reduced={reduced}>
                      {A_CUBES.map((c) => (
                        <motion.g
                          key={c.key}
                          initial={reduced ? false : { opacity: 0, y: -36 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.9, delay: c.delay, ease: EASE }}
                        >
                          <Cube f={c.f} tone={c.tone} />
                        </motion.g>
                      ))}
                    </Drift>
                  </Scene>
                </Layer>

                {/* ---- Depth 3 · block being lowered into place ---- */}
                <Layer
                  {...shared}
                  px={1.9}
                  py={1.5}
                  rot={2.5}
                  origin="28.5% 18%"
                  enter={{
                    from: { opacity: 0, y: "-9%" },
                    delay: 1.25,
                    duration: 1.2,
                  }}
                >
                  <Scene>
                    {A_GUIDES.map(([from, to], i) => (
                      <line
                        key={i}
                        x1={from[0]}
                        y1={from[1]}
                        x2={to[0]}
                        y2={to[1]}
                        stroke={VIOLET}
                        strokeOpacity="0.6"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        {...NS}
                      />
                    ))}
                    <Drift dy={5} rot={0} dur={5} reduced={reduced}>
                      <Cube f={A_HOVER} tone="violet" />
                    </Drift>
                  </Scene>
                </Layer>

                {/* ---- Depth 4 · the V, hinged on its apex ---- */}
                <Layer
                  {...shared}
                  px={0.3}
                  py={0.5}
                  rot={-1.6}
                  origin="50% 81%"
                  enter={{
                    from: { opacity: 0, rotate: -6 },
                    delay: 0.7,
                    duration: 1.2,
                    origin: "50% 81%",
                  }}
                >
                  <Scene>
                    {vLeft.map((points, i) => (
                      <polygon key={i} points={points} fill={V_LEFT.fills[i]} />
                    ))}
                    <polyline
                      points={pts([V_LEFT.quad[0], V_LEFT.quad[1], V_LEFT.quad[2]])}
                      stroke={IVORY}
                      strokeOpacity="0.5"
                      strokeWidth="1"
                      {...NS}
                    />
                  </Scene>
                </Layer>
                <Layer
                  {...shared}
                  px={0.3}
                  py={0.5}
                  rot={1.6}
                  origin="50% 81%"
                  enter={{
                    from: { opacity: 0, rotate: 6 },
                    delay: 0.8,
                    duration: 1.2,
                    origin: "50% 81%",
                  }}
                >
                  <Scene>
                    {vRight.map((points, i) => (
                      <polygon key={i} points={points} fill={V_RIGHT.fills[i]} />
                    ))}
                    <polyline
                      points={pts([V_RIGHT.quad[0], V_RIGHT.quad[1], V_RIGHT.quad[2]])}
                      stroke={IVORY}
                      strokeOpacity="0.5"
                      strokeWidth="1"
                      {...NS}
                    />
                  </Scene>
                </Layer>

                {/* ---- Depth 5 · BREAK core (stays put) ---- */}
                <Layer
                  {...shared}
                  px={0.8}
                  py={0.6}
                  origin="69% 57%"
                  enter={{ from: { opacity: 0, y: "5%" }, delay: 0.6 }}
                >
                  <Scene>
                    {B_CORE.map((it) => (
                      <Cube key={it.key} f={it.f} tone={it.tone} />
                    ))}
                  </Scene>
                </Layer>

                {/* ---- Depth 6 · fragments leaving the structure ---- */}
                <Layer
                  {...shared}
                  px={1.7}
                  py={1.2}
                  rot={-1.2}
                  zoom={0.006}
                  origin="72% 60%"
                  enter={{ from: { opacity: 0, y: "5%" }, delay: 0.7 }}
                >
                  <Scene>
                    {B_FRAG.map((it, i) => (
                      <BreakCube key={it.key} item={it} reduced={reduced} delay={1.9 + i * 0.08} />
                    ))}
                  </Scene>
                </Layer>

                {/* ---- Depth 7 · lifted blocks ---- */}
                <Layer
                  {...shared}
                  px={2.5}
                  py={2}
                  rot={2}
                  zoom={0.01}
                  origin="76% 40%"
                  depth="near"
                  enter={{ from: { opacity: 0, y: "5%" }, delay: 0.85 }}
                >
                  <Scene>
                    {B_LIFT.map((it, i) => (
                      <BreakCube key={it.key} item={it} reduced={reduced} delay={2.05 + i * 0.1} />
                    ))}
                  </Scene>
                </Layer>

                {/* ---- Depth 8 · dust ---- */}
                <Layer
                  {...shared}
                  px={1.5}
                  py={1.1}
                  enter={{ from: { opacity: 0 }, delay: 2.4, duration: 1.2 }}
                >
                  <Scene>
                    <Drift dy={4} rot={6} dur={9} reduced={reduced}>
                      <rect x="855" y="163" width="6" height="6" fill={EMBER} transform="rotate(12 858 166)" />
                      <rect x="815" y="369" width="6" height="6" fill={VIOLET} transform="rotate(-10 818 372)" />
                      <rect x="973" y="256" width="5" height="5" fill={EMBER} transform="rotate(20 975 258)" />
                      <polygon points="944,168 952,176 944,184 936,176" stroke={IVORY} strokeOpacity="0.5" strokeWidth="1" {...NS} />
                      <path d="M748 12V28M740 20H756" stroke={IVORY} strokeOpacity="0.45" strokeWidth="1" {...NS} />
                      <path d="M598 60V72M592 66H604" stroke={IVORY} strokeOpacity="0.4" strokeWidth="1" {...NS} />
                    </Drift>
                  </Scene>
                </Layer>

                {/* ---- Depth 9 · shards ---- */}
                <Layer
                  {...shared}
                  px={3}
                  py={2.2}
                  rot={3}
                  zoom={0.012}
                  origin="86% 40%"
                  depth="near"
                  enter={{
                    from: { opacity: 0, scale: 0.5 },
                    delay: 2,
                    duration: 1.5,
                    origin: "70% 57%",
                  }}
                >
                  <Scene>
                    {MID_DEBRIS.map((s, i) => (
                      <Drift key={i} dy={s.dy} rot={s.rot} dur={s.dur} delay={s.delay} reduced={reduced}>
                        <Crystal q={s.q} lit={s.lit} shade={s.shade} />
                      </Drift>
                    ))}
                    {MINI_CUBES.map((m, i) => (
                      <Drift key={`m${i}`} dy={m.dy} rot={m.rot} dur={m.dur} delay={m.delay} reduced={reduced}>
                        <Cube f={m.f} tone={m.tone} />
                      </Drift>
                    ))}
                  </Scene>
                </Layer>

                {/* ---- Depth 10 · nearest shards ---- */}
                <Layer
                  {...shared}
                  px={4.4}
                  py={3.2}
                  rot={-4}
                  zoom={0.02}
                  origin="85% 45%"
                  depth="near"
                  enter={{
                    from: { opacity: 0, scale: 0.45 },
                    delay: 2.1,
                    duration: 1.6,
                    origin: "70% 57%",
                  }}
                >
                  <Scene>
                    {NEAR_DEBRIS.map((s, i) => (
                      <Drift key={i} dy={s.dy} rot={s.rot} dur={s.dur} delay={s.delay} reduced={reduced}>
                        <Crystal q={s.q} lit={s.lit} shade={s.shade} />
                      </Drift>
                    ))}
                  </Scene>
                </Layer>

                {/* ---- Depth 11 · phase annotations ---- */}
                <Layer
                  {...shared}
                  px={0.6}
                  py={0.4}
                  enter={{ from: { opacity: 0 }, delay: 1.6, duration: 1 }}
                >
                  <Tag left="28.5%" n="01" tone="text-[#8B7CF6]">
                    BUILD
                  </Tag>
                  <Tag left="69%" n="02" tone="text-[#C4642E]">
                    BREAK
                  </Tag>
                </Layer>

                {/* ---- Sheen · cursor-reactive light lean across the faceted
                     surfaces, blended so it only ever lifts existing tones ---- */}
                {!reduced && (
                  <motion.div
                    aria-hidden="true"
                    style={{ background: sheenBg, mixBlendMode: "soft-light" }}
                    className="pointer-events-none absolute inset-0"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Title + statement + CTAs (overlaps the bottom of the stage) */}
        <motion.div
          style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
          className="relative z-30 -mt-3 sm:-mt-5 md:-mt-[3vw] lg:-mt-[3.6vw]"
        >
          <h1
            className={`${DISPLAY} flex flex-col items-start text-[clamp(2.4rem,13vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em] md:text-[clamp(4rem,12vw,8rem)] lg:flex-row lg:items-end lg:justify-between lg:text-[clamp(4.5rem,8.6vw,9.5rem)]`}
          >
            <span className="sr-only">BvB — Build vs Break</span>

            {/* BUILD — layered, constructed */}
            <Word delay={0.95} reduced={reduced} className="self-start">
              <span
                aria-hidden="true"
                className="absolute left-[0.09em] top-[0.09em] select-none pr-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(139,124,246,0.28)]"
              >
                BUILD
              </span>
              <span
                aria-hidden="true"
                className="absolute left-[0.045em] top-[0.045em] select-none pr-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(139,124,246,0.55)]"
              >
                BUILD
              </span>
              <span aria-hidden="true" className={`relative block ${GRAD_BUILD}`}>
                BUILD
              </span>
            </Word>

            {/* VS */}
            <motion.span
              initial={reduced ? false : { opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
              aria-hidden="true"
              className="flex w-full items-center gap-3 self-stretch py-1 lg:mx-6 lg:flex-1 lg:self-center xl:mx-10"
            >
              <span className="h-px flex-1 bg-[linear-gradient(to_right,transparent,#C4642E)]" />
              <span className="text-[0.42em] font-bold leading-none tracking-[0.12em] text-[#C4642E] lg:text-[0.46em]">
                VS
              </span>
              <span className="h-px flex-1 bg-[linear-gradient(to_left,transparent,#C4642E)]" />
            </motion.span>

            {/* BREAK — fractured */}
            <Word delay={1.2} reduced={reduced} className="self-end">
              <FracturedText gradient={GRAD_BREAK}>BREAK</FracturedText>
            </Word>
          </h1>

          {/* Statement + CTAs */}
          <div className="mt-8 grid gap-7 lg:mt-10 lg:grid-cols-12 lg:items-end">
            <motion.p
              {...fade(1.3)}
              className="max-w-md border-l-2 border-[#C4642E] pl-4 text-sm leading-relaxed text-[#E8E2D6]/70 sm:text-base lg:col-span-5"
            >
              Construct with precision. Fracture with intent. Inside BvB, every
              system is built to be broken — and every break sharpens the
              build.
            </motion.p>

            <motion.div
              {...fade(1.45)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end lg:gap-4"
            >
              <PrimaryCta href={registerHref} onClick={onRegisterClick}>
                Register Now
              </PrimaryCta>
              <SecondaryCta href={exploreTarget} onClick={handleExplore} />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}