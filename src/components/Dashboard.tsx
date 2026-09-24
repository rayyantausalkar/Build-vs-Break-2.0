"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  getSavedRegistration,
  saveRegistration,
  clearSavedRegistration,
  lookupRegistration,
  RegistrationRecord,
} from "@/lib/registration";

const COLORS = {
  purple: "#8B7CF6",
  orange: "#C4642E",
  ivory: "#E8E2D6",
  bg: "#1A1410",
};

export default function Dashboard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [record, setRecord] = useState<RegistrationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLookup, setShowLookup] = useState(false);

  // Lookup form state
  const [lookupId, setLookupId] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = getSavedRegistration();
    if (saved && saved.registrationId) {
      setRecord(saved);
      setShowLookup(false);
    } else {
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
    if (window.confirm("Remove saved registration from this browser? You can always look it up again using your ID and phone.")) {
      clearSavedRegistration();
      setRecord(null);
      setShowLookup(true);
    }
  };

  const isTrio = record?.groupSize === 3 || record?.teamFormat === "trio";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1A1410] text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute left-[-15%] top-[10%] h-[55vw] w-[55vw] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,124,246,0.11), transparent 68%)",
          }}
        />
        <div
          className="absolute right-[-15%] top-[35%] h-[55vw] w-[55vw] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(196,100,46,0.10), transparent 68%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,226,214,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,226,214,0.14) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
        <div className="absolute inset-4 border border-[#E8E2D6]/[0.05] md:inset-6" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between border-b border-[#E8E2D6]/10 px-5 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 shrink-0 overflow-hidden border border-[#8B7CF6]/40 bg-black p-1 transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="BvB"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-black tracking-[0.24em] text-[#E8E2D6]">
                  BvB
                </div>
                <div className="text-[8px] font-semibold tracking-[0.28em] text-[#E8E2D6]/40">
                  PARTICIPANT DASHBOARD
                </div>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#8B7CF6]/30 bg-[#8B7CF6]/10 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/20"
            >
              <Users size={12} />
              Register Team
            </a>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="group flex items-center gap-2 border border-[#E8E2D6]/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/60 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
            >
              <ArrowLeft
                size={13}
                className="transition-transform group-hover:-translate-x-1"
              />
              Home
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="mx-auto w-full max-w-[1180px] px-5 py-8 md:px-8 md:py-14">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <RefreshCw className="animate-spin text-[#8B7CF6]" size={28} />
            </div>
          ) : showLookup ? (
            /* Lookup Form Mode */
            <div className="mx-auto max-w-xl">
              <div className="relative overflow-hidden border border-[#E8E2D6]/10 bg-[#1A1410]/80 backdrop-blur-xl p-6 sm:p-9 shadow-2xl">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em] text-[#C4642E]">
                  <span className="h-1.5 w-1.5 bg-[#C4642E] shadow-[0_0_10px_#C4642E]" />
                  DASHBOARD ACCESS // FIND REGISTRATION
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]">
                  Find Your Registration
                </h1>

                <p className="mt-2 text-xs sm:text-sm leading-6 text-[#E8E2D6]/50">
                  Enter your assigned Registration ID and any registered phone number to open your team dashboard and entry pass.
                </p>

                <form onSubmit={handleSearch} className="mt-7 space-y-5">
                  <label className="block">
                    <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/55">
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
                      className="h-12 w-full border border-[#E8E2D6]/10 bg-[#0F0B09]/70 px-4 text-sm text-[#E8E2D6] outline-none transition hover:border-[#E8E2D6]/20 focus:border-[#8B7CF6]/70 placeholder:text-[#E8E2D6]/20"
                    />
                  </label>

                  <label className="block">
                    <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/55">
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
                      className="h-12 w-full border border-[#E8E2D6]/10 bg-[#0F0B09]/70 px-4 text-sm text-[#E8E2D6] outline-none transition hover:border-[#E8E2D6]/20 focus:border-[#8B7CF6]/70 placeholder:text-[#E8E2D6]/20"
                    />
                  </label>

                  {searchError && (
                    <div className="border border-[#C4642E]/30 bg-[#C4642E]/10 p-3.5 text-xs text-[#E8E2D6]/90">
                      <span className="font-bold text-[#C4642E]">Error: </span>
                      {searchError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={searching}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-[#8B7CF6] px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#1A1410] transition hover:brightness-110 disabled:opacity-50"
                    >
                      {searching ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          VERIFYING WITH SHEET...
                        </>
                      ) : (
                        <>
                          <Search size={13} />
                          OPEN DASHBOARD
                        </>
                      )}
                    </button>

                    {record && (
                      <button
                        type="button"
                        onClick={() => setShowLookup(false)}
                        className="inline-flex w-full sm:w-auto items-center justify-center border border-[#E8E2D6]/15 px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/60 transition hover:border-[#E8E2D6]/30 hover:text-[#E8E2D6]"
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
                    Register your team here &rarr;
                  </a>
                </div>
              </div>
            </div>
          ) : record ? (
            /* Registered Team Dashboard View */
            <div className="mx-auto w-full max-w-4xl">
              {/* Top Control Bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#8B7CF6]">
                    <span className="h-1 w-1 rounded-full bg-white animate-ping" />
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#8B7CF6]">
                    BvB 2026 // OFFICIAL ENTRY PASS
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyId}
                    className="inline-flex items-center gap-1.5 border border-[#8B7CF6]/40 bg-[#8B7CF6]/10 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/20"
                  >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? "ID COPIED" : "COPY ID"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 border border-[#E8E2D6]/15 bg-[#0F0B09] px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#E8E2D6]/40 hover:text-[#E8E2D6]"
                  >
                    <Printer size={11} />
                    PRINT PASS
                  </button>
                  <button
                    type="button"
                    onClick={handleSwitchRegistration}
                    className="inline-flex items-center gap-1.5 border border-[#E8E2D6]/15 bg-[#0F0B09] px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#E8E2D6]/40 hover:text-[#E8E2D6]"
                  >
                    <Search size={11} />
                    SWITCH ID
                  </button>
                </div>
              </div>

              {/* Main Pass Container */}
              <div className="relative overflow-hidden border border-[#8B7CF6]/30 bg-[#0F0B09]/90 p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(139,124,246,0.12)]">
                {/* Corner aesthetic brackets */}
                <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#8B7CF6]" />
                <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#C4642E]" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#C4642E]" />
                <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#8B7CF6]" />

                {/* Ambient watermark */}
                <div className="pointer-events-none absolute -right-10 -bottom-10 select-none font-mono text-[9rem] font-black leading-none text-[#E8E2D6]/[0.02]">
                  BvB
                </div>

                {/* Header Information */}
                <div className="flex flex-col justify-between gap-6 border-b border-[#E8E2D6]/10 pb-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden border border-[#8B7CF6]/40 bg-black p-1.5">
                      <img
                        src="/logo.png"
                        alt="BvB"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.24em] text-[#8B7CF6]">
                        BUILD VS BREAK // 2026
                      </div>
                      <h1 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]">
                        {record.teamName}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
                    <div className="inline-flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-[#8B7CF6]">
                      <CheckCircle2 size={12} />
                      {record.status?.toUpperCase() || "CONFIRMED"}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.18em] text-[#E8E2D6]/40">
                      FORMAT: {isTrio ? "TRIO (3 PARTICIPANTS)" : "DUO (2 PARTICIPANTS)"}
                    </div>
                  </div>
                </div>

                {/* ID Strip */}
                <div className="mt-6 border border-[#C4642E]/30 bg-[#1A1410]/80 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#C4642E]">
                        OFFICIAL REGISTRATION ID
                      </div>
                      <div className="mt-1 font-mono text-2xl sm:text-3xl font-black tracking-[0.08em] text-[#E8E2D6]">
                        {record.registrationId}
                      </div>
                    </div>
                    <p className="text-[10px] leading-5 text-[#E8E2D6]/50 max-w-xs">
                      This ID confirms your slot in Build vs Break. All team members are registered with free entry.
                    </p>
                  </div>
                </div>

                {/* Members Section */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/50">
                      TEAM ROSTER // {record.participants?.length || record.groupSize} PARTICIPANTS
                    </div>
                    <div className="font-mono text-[9px] text-[#8B7CF6]">
                      {record.registeredAt
                        ? new Date(record.registeredAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "RECORDED"}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {record.participants && record.participants.length > 0 ? (
                      record.participants.map((member, index) => {
                        const isLead = member.role === "captain" || index === 0;
                        const accent = isLead ? COLORS.purple : COLORS.orange;

                        return (
                          <div
                            key={index}
                            className="relative border bg-[#1A1410]/60 p-4"
                            style={{ borderColor: `${accent}33` }}
                          >
                            <div
                              className="absolute left-0 top-0 h-full w-[2px]"
                              style={{ background: accent }}
                            />
                            <div className="flex items-center justify-between">
                              <span
                                className="font-mono text-[8px] font-bold tracking-[0.2em]"
                                style={{ color: accent }}
                              >
                                {isLead ? "01 ─ CAPTAIN" : `0${index + 1} ─ MEMBER`}
                              </span>
                              {member.year && (
                                <span className="text-[8px] text-[#E8E2D6]/40 uppercase tracking-widest">
                                  {member.year}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 text-sm font-bold uppercase text-[#E8E2D6]">
                              {member.name || "—"}
                            </div>
                            <div className="mt-2 space-y-1 font-mono text-[10px] text-[#E8E2D6]/60">
                              <div className="truncate">{member.email}</div>
                              <div>{member.phone}</div>
                              <div className="truncate text-[#E8E2D6]/40">
                                {member.college || member.branch
                                  ? `${member.branch} · ${member.college}`
                                  : ""}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 border border-[#E8E2D6]/10 text-xs text-[#E8E2D6]/60">
                        Primary Contact: {record.primaryContact?.name} ({record.primaryContact?.phone})
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer notes */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#E8E2D6]/40">
                    <ShieldCheck size={14} className="text-[#8B7CF6]" />
                    Slot reserved in Google Sheets system
                  </div>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[9px] font-mono text-[#E8E2D6]/30 hover:text-[#C4642E] transition-colors"
                  >
                    Forget from this browser
                  </button>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1410] transition hover:brightness-110"
                >
                  <Users size={14} />
                  Register Another Team
                </a>

                <a
                  href="/"
                  className="inline-flex items-center gap-2 border border-[#E8E2D6]/15 bg-[#0F0B09]/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/80 transition hover:border-[#E8E2D6]/40 hover:text-white"
                >
                  Back to BvB Home
                </a>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
