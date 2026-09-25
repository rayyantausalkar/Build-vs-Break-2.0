"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  getSavedRegistration,
  saveRegistration,
  clearSavedRegistration,
  lookupRegistration,
  RegistrationRecord,
} from "@/lib/registration";
import GlobalSpotlight from "@/components/GlobalSpotlight";
import { CircuitTrack, FloatingShards } from "@/components/FloatingShards";

/* ------------------------------------------------------------------ */
/*  Design Tokens — strictly mirrors Hero, About, Prizes, Rules       */
/* ------------------------------------------------------------------ */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/D3d3oPcJUHeDoURjbtmRbj";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

/* ------------------------------------------------------------------ */
/*  Shard set for dashboard (unique IDs)                               */
/* ------------------------------------------------------------------ */

const DASHBOARD_SHARDS = [
  { id: "db1", type: "crystal" as const, x: 4, y: 20, size: 36, tone: "violet" as const, rot: 12, dr: 8, dy: -11, dur: 8.2, delay: 0.3, parallax: 0.03 },
  { id: "db2", type: "cube" as const, x: 93, y: 16, size: 30, tone: "ember" as const, rot: -14, dr: -7, dy: -10, dur: 9.2, delay: 0.9, parallax: 0.04 },
  { id: "db3", type: "timeline-node" as const, x: 3, y: 60, size: 32, tone: "ivory" as const, rot: 0, dr: 5, dy: -9, dur: 7.6, delay: 0.5, parallax: 0.02 },
  { id: "db4", type: "crystal" as const, x: 94, y: 55, size: 38, tone: "violet" as const, rot: -20, dr: 10, dy: -13, dur: 8.8, delay: 1.3, parallax: 0.04 },
  { id: "db5", type: "diamond" as const, x: 8, y: 86, size: 22, tone: "ember" as const, rot: 45, dr: 12, dy: -7, dur: 7.2, delay: 0.6, parallax: 0.03 },
  { id: "db6", type: "cube" as const, x: 90, y: 84, size: 28, tone: "ivory" as const, rot: 16, dr: -8, dy: -9, dur: 8.5, delay: 1.0, parallax: 0.03 },
  { id: "db7", type: "crosshair" as const, x: 20, y: 10, size: 18, rot: 0, dr: 0, dy: -4, dur: 11, delay: 0.2, parallax: 0.01 },
  { id: "db8", type: "crosshair" as const, x: 80, y: 92, size: 18, rot: 0, dr: 0, dy: -4, dur: 10, delay: 0.8, parallax: 0.01 },
  { id: "db9", type: "dust" as const, x: 11, y: 42, size: 10, tone: "ember" as const, rot: 25, dr: 16, dy: -7, dur: 6.6, delay: 0.7, parallax: 0.05 },
  { id: "db10", type: "dust" as const, x: 89, y: 40, size: 9, tone: "violet" as const, rot: -16, dr: 14, dy: -6, dur: 7.3, delay: 1.2, parallax: 0.04 },
];

export default function Dashboard() {
  const router = useRouter();
  const reduced = Boolean(useReducedMotion());

  const [record, setRecord] = useState<RegistrationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLookup, setShowLookup] = useState(false);

  // Lookup form state
  const [lookupId, setLookupId] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmForgetOpen, setConfirmForgetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cursor tracking for FloatingShards parallax
  const mouseX = useMotionValue(500);
  const mouseY = useMotionValue(400);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const forceFind = params?.get("find") === "true";

    const saved = getSavedRegistration();
    if (saved && saved.registrationId && !forceFind) {
      // User is logged in: view pass directly
      setRecord(saved);
      setShowLookup(false);
    } else {
      // Show the lookup form
      setRecord(saved || null);
      setShowLookup(true);
    }
    setLoading(false);
  }, []);

  const copyId = async () => {
    if (!record?.registrationId) return;
    try {
      await navigator.clipboard.writeText(record.registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) {
      setSearchError("Please enter your Registration ID (e.g. BVB26-0005).");
      return;
    }
    if (!lookupPhone.trim()) {
      setSearchError("Please enter your registered phone number.");
      return;
    }

    setSearching(true);
    setSearchError("");

    const res = await lookupRegistration(lookupId, lookupPhone);
    setSearching(false);

    if (res.success && res.data) {
      setRecord(res.data);
      setShowLookup(false);
      setToastMessage("Logged in! Squad credentials loaded.");
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } else {
      setSearchError(
        res.message ||
          "No registration found matching this ID and Phone Number. Please check your inputs."
      );
    }
  };

  const handleSwitchRegistration = () => {
    setShowLookup(true);
    setSearchError("");
  };

  const handleClear = () => {
    setConfirmForgetOpen(true);
  };

  const confirmForget = () => {
    clearSavedRegistration();
    setRecord(null);
    setShowLookup(true);
    setConfirmForgetOpen(false);
    setToastMessage("Registration removed from this browser");
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isTrio = record?.groupSize === 3 || record?.teamFormat === "trio";

  return (
    <div
      className={`${DISPLAY} relative min-h-screen overflow-hidden bg-[#1A1410] text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white`}
      onMouseMove={handleMouseMove}
    >
      {/* ── Background Atmosphere matching Hero, About, Prizes, Rules ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Structural Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]" />

        {/* Ambient atmospheric glow orbs */}
        <div className="absolute -left-28 top-20 h-[55vw] w-[55vw] rounded-full bg-[#8B7CF6]/10 blur-[130px]" />
        <div className="absolute -right-28 top-[35%] h-[55vw] w-[55vw] rounded-full bg-[#C4642E]/[0.09] blur-[130px]" />

        {/* Circuit Track */}
        <CircuitTrack className="top-1/3 opacity-15" />
      </div>

      {/* ── Floating 3D Geometric Shards (cursor-reactive) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FloatingShards shards={DASHBOARD_SHARDS} smoothX={smoothX} smoothY={smoothY} />
      </div>

      {/* ── Giant Typographic Ambient Watermark ── */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none fixed -bottom-10 -right-6 z-0 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-10 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        DASHBOARD
      </span>

      {/* ── Global cursor spotlight ── */}
      <GlobalSpotlight />

      {/* ── Top Bar with Back to Home Button ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 pt-6 sm:px-8 sm:pt-8 md:px-12 flex items-center justify-between">
        <a
          href="/"
          className="group inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/70 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/80 transition-all hover:border-[#8B7CF6]/50 hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Home
        </a>

        {!record && (
          <a
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/70 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/80 transition-all hover:border-[#8B7CF6]/40 hover:text-white"
          >
            Register Squad &rarr;
          </a>
        )}
      </div>

      {/* ── Main Content Container ── */}
      <main className="relative z-10 mx-auto w-full max-w-[1360px] px-4 pt-6 pb-14 sm:px-8 sm:pt-8 md:px-12 md:pb-20">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <RefreshCw className="animate-spin text-[#8B7CF6]" size={32} />
          </div>
        ) : (
          <>
            {/* ============================================================ */}
            {/*  EDITORIAL SECTION HEADER (Strictly mirrors Prizes & Rules)   */}
            {/* ============================================================ */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[#E8E2D6]/10">
              <div>
                <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-widest block mb-2`}>
                  {record ? "OFFICIAL ARENA CREDENTIALS" : "CREDENTIAL LOOKUP"}
                </span>
                <h1
                  className={`${DISPLAY} text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#E8E2D6]`}
                >
                  {record ? (
                    <>
                      TEAM <span className={GRAD_BUILD}>DASHBOARD</span>
                    </>
                  ) : (
                    <>
                      FIND YOUR <span className={GRAD_BUILD}>REGISTRATION</span>
                    </>
                  )}
                </h1>
                <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
                  {record
                    ? "Your confirmed squad registration and arena pass for Build vs Break 2026."
                    : "Enter your assigned Registration ID and registered phone number to view your squad credentials."}
                </p>
              </div>

              {/* Action Buttons in Header: Only Copy ID & Print Pass for logged-in user */}
              {record && (
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyId}
                    className="group inline-flex items-center gap-2 rounded-xl border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition-all hover:bg-[#8B7CF6]/25 hover:border-[#8B7CF6]/70 shadow-[0_0_20px_rgba(139,124,246,0.15)]"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "ID COPIED" : "COPY ID"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/70 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/80 transition-all hover:border-[#E8E2D6]/35 hover:text-white"
                  >
                    <Printer size={12} />
                    PRINT PASS
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/*  BODY VIEW: LOOKUP OR ENTRY PASS                             */}
            {/* ============================================================ */}
            {showLookup ? (
              /* ── Lookup Form Card ── */
              <div className="mx-auto max-w-xl">
                <div
                  className="group relative overflow-hidden rounded-3xl border border-[#E8E2D6]/12 p-6 sm:p-10 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,124,246,0.08)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.78) 50%, rgba(196, 100, 46, 0.05) 100%)",
                  }}
                >
                  {/* Cyber Corner Crosshairs matching Prizes & Rules */}
                  <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                  <span className={`${MONO} text-[10px] text-[#C4642E] uppercase font-bold tracking-widest block`}>
                    LOOKUP PORTAL
                  </span>

                  <h2 className={`${DISPLAY} mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                    Verify Credentials
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/50">
                    Enter your assigned Registration ID and registered phone number to open your team credentials.
                  </p>

                  <form onSubmit={handleSearch} className="mt-8 space-y-5">
                    <label className="block">
                      <div className={`${MONO} mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/60`}>
                        Registration ID <span className="text-[#C4642E]">*</span>
                      </div>
                      <input
                        type="text"
                        value={lookupId}
                        onChange={(e) => {
                          setLookupId(e.target.value.toUpperCase());
                          setSearchError("");
                        }}
                        placeholder="e.g. BVB26-0005"
                        className="h-12 w-full rounded-xl border border-[#E8E2D6]/12 bg-[#0F0B09]/80 px-4 text-sm text-[#E8E2D6] outline-none transition-all placeholder:text-[#E8E2D6]/25 hover:border-[#E8E2D6]/25 focus:border-[#8B7CF6]/70 focus:bg-[#161020]"
                      />
                    </label>

                    <label className="block">
                      <div className={`${MONO} mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/60`}>
                        Registered Phone Number <span className="text-[#C4642E]">*</span>
                      </div>
                      <input
                        type="tel"
                        value={lookupPhone}
                        onChange={(e) => {
                          setLookupPhone(e.target.value);
                          setSearchError("");
                        }}
                        placeholder="e.g. 9876543210"
                        className="h-12 w-full rounded-xl border border-[#E8E2D6]/12 bg-[#0F0B09]/80 px-4 text-sm text-[#E8E2D6] outline-none transition-all placeholder:text-[#E8E2D6]/25 hover:border-[#E8E2D6]/25 focus:border-[#8B7CF6]/70 focus:bg-[#161020]"
                      />
                    </label>

                    {searchError && (
                      <div className="rounded-xl border border-[#C4642E]/40 bg-[#C4642E]/10 p-4 text-xs text-[#E8E2D6]/90">
                        <span className="font-bold text-[#C4642E]">Error: </span>
                        {searchError}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={searching}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#8B7CF6] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-[#1A1410] shadow-[0_0_24px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {searching ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            VERIFYING DETAILS...
                          </>
                        ) : (
                          <>
                            <Search size={14} />
                            FIND REGISTRATION
                          </>
                        )}
                      </button>

                      {record && (
                        <button
                          type="button"
                          onClick={() => setShowLookup(false)}
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/60 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/60 transition hover:border-[#E8E2D6]/30 hover:text-white"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8 border-t border-[#E8E2D6]/10 pt-6 text-center">
                    <span className="text-xs text-[#E8E2D6]/40">
                      Not registered yet?{" "}
                    </span>
                    <a
                      href="/register"
                      className="font-bold text-[#8B7CF6] underline underline-offset-4 hover:brightness-125 text-xs"
                    >
                      Register your squad here &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ) : record ? (
              /* ── Official Arena Entry Pass ── */
              <div className="mx-auto w-full max-w-4xl">
                {/* Main Pass Container Card */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-[#8B7CF6]/30 p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(139,124,246,0.14)] backdrop-blur-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 124, 246, 0.12) 0%, rgba(22, 16, 28, 0.90) 45%, rgba(196, 100, 46, 0.08) 100%)",
                  }}
                >
                  {/* Cyber Corner Crosshairs matching Prizes & Rules */}
                  <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
                  <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

                  {/* Header Information */}
                  <div className="flex flex-col justify-between gap-6 border-b border-[#E8E2D6]/10 pb-8 sm:flex-row sm:items-center">
                    <div>
                      <span className={`${MONO} text-[10px] uppercase font-bold tracking-widest text-[#8B7CF6]`}>
                        ARENA CONTENDER
                      </span>
                      <h2 className={`${DISPLAY} mt-1 text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                        {record.teamName}
                      </h2>
                    </div>

                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#8B7CF6]/50 bg-[#8B7CF6]/15 px-3.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.16em] text-[#8B7CF6] shadow-[0_0_15px_rgba(139,124,246,0.2)]">
                        <CheckCircle2 size={13} />
                        {record.status?.toUpperCase() || "CONFIRMED"}
                      </div>
                      <div className={`${MONO} text-[10px] uppercase font-semibold tracking-wider text-[#E8E2D6]/50`}>
                        FORMAT: {isTrio ? "TRIO SQUAD (3P)" : "DUO SQUAD (2P)"}
                      </div>
                    </div>
                  </div>

                  {/* ID Strip — Premium Highlight Banner */}
                  <div className="mt-8 rounded-2xl border border-[#C4642E]/35 bg-gradient-to-r from-[#C4642E]/15 via-[#1F1729]/70 to-[#120D1A]/80 p-5 sm:p-6 shadow-[0_4px_24px_rgba(196,100,46,0.12)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className={`${MONO} text-[9px] font-bold uppercase tracking-[0.24em] text-[#C4642E] block`}>
                          ASSIGNED REGISTRATION ID
                        </span>
                        <div className={`${MONO} mt-1 text-2xl sm:text-4xl font-black tracking-[0.08em] text-[#E8E2D6]`}>
                          {record.registrationId}
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-[#E8E2D6]/60 max-w-sm">
                        This verified credential grants your squad access to the Build vs Break arena. No upfront payment required.
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Squad Community Banner — Next Step After Registration */}
                  <div className="mt-6 relative overflow-hidden rounded-2xl border border-[#25D366]/40 bg-gradient-to-r from-[#25D366]/15 via-[#10241A]/85 to-[#0A1610]/90 p-5 sm:p-6 shadow-[0_8px_32px_-8px_rgba(37,211,102,0.25)]">
                    <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-[#25D366]/10 blur-2xl" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#25D366]/40 bg-[#25D366]/20 text-[#25D366] shadow-[0_0_24px_rgba(37,211,102,0.3)]">
                          <WhatsAppIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className={`${DISPLAY} text-base sm:text-xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                            Join Official WhatsApp Group
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-[#E8E2D6]/70 max-w-xl">
                            All registered participants must join the official WhatsApp group for live problem statement releases, battle timings, check-in instructions, and match updates.
                          </p>
                        </div>
                      </div>

                      <a
                        href={WHATSAPP_GROUP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#08150D] shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>JOIN GROUP NOW</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Squad Members Section */}
                  <div className="mt-10">
                    <div className="mb-5 flex items-center justify-between">
                      <span className={`${MONO} text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/60`}>
                        SQUAD ROSTER · {record.participants?.length || record.groupSize} PARTICIPANTS
                      </span>
                      <span className={`${MONO} text-[10px] text-[#8B7CF6]`}>
                        {record.registeredAt
                          ? new Date(record.registeredAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "RECORDED"}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {record.participants && record.participants.length > 0 ? (
                        record.participants.map((member, index) => {
                          const isLead = member.role === "captain" || index === 0;
                          const accent = isLead ? "#8B7CF6" : "#C4642E";

                          return (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 hover:border-[#8B7CF6]/40"
                              style={{
                                borderColor: `${accent}33`,
                                background: isLead
                                  ? "linear-gradient(135deg, rgba(139,124,246,0.10) 0%, rgba(26,19,36,0.7) 100%)"
                                  : "linear-gradient(135deg, rgba(196,100,46,0.08) 0%, rgba(26,19,36,0.6) 100%)",
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`${MONO} rounded-md px-2 py-0.5 text-[8px] font-bold tracking-[0.2em]`}
                                  style={{
                                    color: accent,
                                    background: `${accent}18`,
                                    border: `1px solid ${accent}33`,
                                  }}
                                >
                                  {isLead ? "CAPTAIN" : `MEMBER 0${index + 1}`}
                                </span>
                                {member.year && (
                                  <span className="text-[9px] text-[#E8E2D6]/40 uppercase tracking-widest">
                                    {member.year}
                                  </span>
                                )}
                              </div>
                              <div className="mt-3 text-base font-bold uppercase text-[#E8E2D6]">
                                {member.name || "—"}
                              </div>
                              <div className={`${MONO} mt-2 space-y-1 text-[11px] text-[#E8E2D6]/65`}>
                                <div className="truncate">{member.email}</div>
                                <div>{member.phone}</div>
                                <div className="truncate text-[#E8E2D6]/40">
                                  {[member.course, member.branch, member.college]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-2xl border border-[#E8E2D6]/10 p-5 text-xs text-[#E8E2D6]/60">
                          Primary Contact: {record.primaryContact?.name} ({record.primaryContact?.phone})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer notes */}
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#E8E2D6]/50">
                      <ShieldCheck size={15} className="text-[#8B7CF6]" />
                      Slot reserved & confirmed
                    </div>

                    <button
                      type="button"
                      onClick={handleClear}
                      className={`${MONO} text-[10px] text-[#E8E2D6]/35 hover:text-[#C4642E] transition-colors`}
                    >
                      Forget from this browser
                    </button>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-10 flex items-center justify-center">
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/80 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/80 transition-all hover:border-[#8B7CF6]/50 hover:text-white"
                  >
                    <ArrowLeft size={14} />
                    Back to BvB Home
                  </a>
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>

      {/* ── Forget Confirmation Modal ── */}
      <AnimatePresence>
        {confirmForgetOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmForgetOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#C4642E]/30 bg-[#16101D] p-6 sm:p-8 text-left shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(196,100,46,0.15)]"
            >
              {/* Corner Crosshairs */}
              <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4642E]/40 bg-[#C4642E]/15 text-[#C4642E] shadow-[0_0_20px_rgba(196,100,46,0.2)]">
                  <AlertTriangle size={22} />
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmForgetOpen(false)}
                  className="rounded-lg p-1.5 text-[#E8E2D6]/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <span className={`${MONO} text-[10px] text-[#C4642E] uppercase font-bold tracking-widest block mt-5`}>
                DEVICE RESET
              </span>
              <h3 className={`${DISPLAY} text-xl font-bold uppercase tracking-tight text-[#E8E2D6] mt-1`}>
                Forget from this browser?
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/65">
                This will remove squad <strong className="text-white">"{record?.teamName}"</strong> ({record?.registrationId}) from this browser's local memory. You can always retrieve your pass again using your Registration ID and phone number.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E8E2D6]/10">
                <button
                  type="button"
                  onClick={() => setConfirmForgetOpen(false)}
                  className="w-full sm:w-auto rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/60 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#E8E2D6]/70 transition hover:border-[#E8E2D6]/30 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmForget}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#C4642E] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_20px_rgba(196,100,46,0.35)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Trash2 size={13} />
                  Forget Squad
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#8B7CF6]/40 bg-[#161020]/95 px-5 py-3.5 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.9),0_0_25px_rgba(139,124,246,0.25)] text-[#E8E2D6]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#8B7CF6]/20 text-[#8B7CF6]">
              <CheckCircle2 size={16} />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {toastMessage}
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[#E8E2D6]/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
