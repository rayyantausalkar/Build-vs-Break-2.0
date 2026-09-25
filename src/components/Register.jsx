"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import GlobalSpotlight from "@/components/GlobalSpotlight";
import { CircuitTrack, FloatingShards } from "@/components/FloatingShards";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Pencil,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  REGISTRATION_API_URL,
  getSavedRegistration,
  saveRegistration,
} from "@/lib/registration";

/* =========================================================
   Design Tokens — strictly mirrors Hero, About, Prizes, Rules
   ========================================================= */

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const GRAD_BUILD =
  "bg-[linear-gradient(100deg,#8B7CF6_8%,#E8E2D6_96%)] bg-clip-text text-transparent";
const GRAD_BREAK =
  "bg-[linear-gradient(100deg,#E8E2D6_4%,#C4642E_92%)] bg-clip-text text-transparent";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/D3d3oPcJUHeDoURjbtmRbj";

function WhatsAppIcon({ className = "h-4 w-4" }) {
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

const COLORS = {
  purple: "#8B7CF6",
  orange: "#C4642E",
  ivory: "#E8E2D6",
  bg: "#1A1410",
};

const STEPS = [
  {
    id: 1,
    code: "01",
    label: "FORMAT",
    title: "Squad Format",
  },
  {
    id: 2,
    code: "02",
    label: "ROSTER",
    title: "Team & Members",
  },
  {
    id: 3,
    code: "03",
    label: "CONFIRM",
    title: "Review & Lock",
  },
];

const ASSETS = {
  logo: "/logo.png",
};

const MIN_GROUP_SIZE = 2;
const MAX_GROUP_SIZE = 3;

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

const MEMBER_FIELDS = [
  "name",
  "email",
  "phone",
  "college",
  "course",
  "branch",
  "year",
];

const emptyMember = () => ({
  name: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  branch: "",
  year: "",
});

const memberKey = (index, field) => `member_${index}_${field}`;
const pad = (number) => String(number).padStart(2, "0");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{8,18}$/;

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
   Registration Shard Set (Floating 3D pieces)
   ========================================================= */

const REGISTER_SHARDS = [
  { id: "reg1", type: "crystal", x: 4, y: 18, size: 38, tone: "violet", rot: 15, dr: 8, dy: -12, dur: 8.4, delay: 0.2, parallax: 0.03 },
  { id: "reg2", type: "cube", x: 94, y: 14, size: 32, tone: "ember", rot: -16, dr: -7, dy: -10, dur: 9.1, delay: 0.7, parallax: 0.04 },
  { id: "reg3", type: "timeline-node", x: 3, y: 55, size: 34, tone: "ivory", rot: 0, dr: 6, dy: -9, dur: 7.6, delay: 0.4, parallax: 0.02 },
  { id: "reg4", type: "crystal", x: 95, y: 52, size: 40, tone: "ember", rot: -22, dr: 10, dy: -13, dur: 8.6, delay: 1.2, parallax: 0.04 },
  { id: "reg5", type: "diamond", x: 7, y: 84, size: 24, tone: "violet", rot: 45, dr: 12, dy: -7, dur: 7.2, delay: 0.5, parallax: 0.03 },
  { id: "reg6", type: "cube", x: 91, y: 82, size: 30, tone: "ivory", rot: 18, dr: -8, dy: -10, dur: 8.8, delay: 1.0, parallax: 0.03 },
  { id: "reg7", type: "crosshair", x: 18, y: 8, size: 20, rot: 0, dr: 0, dy: -4, dur: 11, delay: 0.2, parallax: 0.01 },
  { id: "reg8", type: "crosshair", x: 82, y: 92, size: 20, rot: 0, dr: 0, dy: -4, dur: 10, delay: 0.8, parallax: 0.01 },
  { id: "reg9", type: "dust", x: 10, y: 38, size: 10, tone: "ember", rot: 25, dr: 15, dy: -7, dur: 6.8, delay: 0.6, parallax: 0.05 },
  { id: "reg10", type: "dust", x: 89, y: 32, size: 9, tone: "violet", rot: -18, dr: 12, dy: -6, dur: 7.4, delay: 1.1, parallax: 0.04 },
];

/* =========================================================
   Sleek Step Indicator (Editorial Progress Pills)
   ========================================================= */

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
      {STEPS.map((step) => {
        const active = currentStep === step.id;
        const complete = currentStep > step.id;

        return (
          <div key={step.id} className="relative">
            {/* Progress line */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E8E2D6]/10">
              <motion.div
                initial={false}
                animate={{
                  width: active || complete ? "100%" : "0%",
                }}
                className="h-full rounded-full"
                style={{
                  background:
                    step.id === 2 ? COLORS.orange : COLORS.purple,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className={`${MONO} text-[10px] font-bold tracking-[0.16em]`}
                style={{
                  color:
                    active || complete
                      ? step.id === 2
                        ? COLORS.orange
                        : COLORS.purple
                      : "rgba(232,226,214,0.3)",
                }}
              >
                {step.code}
              </span>

              <span
                className={cx(
                  "hidden text-[9px] font-bold uppercase tracking-[0.18em] sm:block",
                  active ? "text-[#E8E2D6]" : "text-[#E8E2D6]/30"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   Form Input Components (Awwwards-level styling)
   ========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  error,
  autoComplete,
}) {
  return (
    <label className="group block min-w-0" data-error={error ? "true" : undefined}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`${MONO} text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/60`}>
          {label}
          {required && <span className="ml-1 text-[#C4642E]">*</span>}
        </span>
        {error && (
          <span className="text-[9px] font-semibold text-[#C4642E]">
            {error}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cx(
            "h-12 w-full rounded-xl border bg-[#0F0B09]/80 px-4 text-sm text-[#E8E2D6] outline-none transition-all placeholder:text-[#E8E2D6]/25",
            error
              ? "border-[#C4642E]/70"
              : "border-[#E8E2D6]/12 hover:border-[#E8E2D6]/25 focus:border-[#8B7CF6]/70 focus:bg-[#161020]"
          )}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = true,
  error,
}) {
  return (
    <label className="group block min-w-0" data-error={error ? "true" : undefined}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`${MONO} text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/60`}>
          {label}
          {required && <span className="ml-1 text-[#C4642E]">*</span>}
        </span>
        {error && (
          <span className="text-[9px] text-[#C4642E]">
            {error}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cx(
            "h-12 w-full appearance-none rounded-xl border bg-[#0F0B09]/80 px-4 pr-12 text-sm text-[#E8E2D6] outline-none transition-all",
            error
              ? "border-[#C4642E]/70"
              : "border-[#E8E2D6]/12 hover:border-[#E8E2D6]/25 focus:border-[#8B7CF6]/70 focus:bg-[#161020]"
          )}
        >
          <option value="" className="bg-[#1A1410]">
            Select {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#1A1410]">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#E8E2D6]/40"
        />
      </div>
    </label>
  );
}

/* =========================================================
   Selection Option (Duo vs Trio Cards)
   ========================================================= */

function SelectionOption({
  icon: Icon,
  eyebrow,
  title,
  description,
  active,
  accent = "purple",
  onClick,
}) {
  const color = accent === "orange" ? COLORS.orange : COLORS.purple;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="group relative w-full overflow-hidden rounded-2xl border p-6 sm:p-7 text-left transition-all duration-300 backdrop-blur-md"
      style={{
        borderColor: active ? `${color}88` : "rgba(232,226,214,0.12)",
        background: active
          ? `linear-gradient(135deg, ${color}16 0%, rgba(22,16,28,0.85) 60%, rgba(15,11,9,0.9) 100%)`
          : "linear-gradient(135deg, rgba(232,226,214,0.02) 0%, rgba(15,11,9,0.7) 100%)",
        boxShadow: active ? `0 10px 30px -10px ${color}33` : undefined,
      }}
    >
      {/* Corner crosshairs */}
      <span className="pointer-events-none absolute top-3 left-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
      <span className="pointer-events-none absolute top-3 right-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
      <span className="pointer-events-none absolute bottom-3 left-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
      <span className="pointer-events-none absolute bottom-3 right-3 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

      <div className="flex items-start justify-between gap-5">
        <div>
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border"
            style={{
              borderColor: `${color}55`,
              color,
              background: `${color}14`,
            }}
          >
            <Icon size={22} />
          </div>

          <span
            className={`${MONO} text-[10px] font-bold uppercase tracking-[0.2em] block mb-1`}
            style={{ color }}
          >
            {eyebrow}
          </span>

          <h3 className={`${DISPLAY} text-2xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
            {title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#E8E2D6]/50">
            {description}
          </p>
        </div>

        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: active ? color : "rgba(232,226,214,0.2)",
            background: active ? color : "transparent",
          }}
        >
          {active && (
            <Check size={13} strokeWidth={3} className="text-[#1A1410]" />
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* =========================================================
   Member Card (Squad Details Form)
   ========================================================= */

function MemberCard({
  index,
  member,
  errors,
  onChange,
  captainCollege,
}) {
  const captain = index === 0;
  const accent = captain ? COLORS.purple : COLORS.orange;
  const filled = MEMBER_FIELDS.filter((field) =>
    String(member[field]).trim()
  ).length;
  const complete = filled === MEMBER_FIELDS.length;

  const title = captain
    ? "Team Captain (Primary Contact)"
    : `Squad Member 0${index + 1}`;

  const eyebrow = captain
    ? "01 ─ CAPTAIN"
    : `0${index + 1} ─ MEMBER`;

  const err = (field) => errors[memberKey(index, field)];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border p-5 sm:p-6 backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: captain
          ? `${COLORS.purple}40`
          : "rgba(232,226,214,0.12)",
        background: captain
          ? "linear-gradient(135deg, rgba(139,124,246,0.08) 0%, rgba(22,16,28,0.7) 100%)"
          : "linear-gradient(135deg, rgba(196,100,46,0.06) 0%, rgba(22,16,28,0.6) 100%)",
      }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2D6]/10 pb-4">
        <div className="flex items-center gap-3">
          <span
            className={`${MONO} rounded-md px-2.5 py-1 text-[9px] font-bold tracking-[0.18em]`}
            style={{
              color: accent,
              background: `${accent}18`,
              border: `1px solid ${accent}33`,
            }}
          >
            {eyebrow}
          </span>
          <span className={`${DISPLAY} text-sm sm:text-base font-bold uppercase text-[#E8E2D6]`}>
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!captain && captainCollege?.trim() && (
            <button
              type="button"
              onClick={() => onChange("college", captainCollege)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E2D6]/15 bg-[#1F1729]/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#E8E2D6]/60 transition hover:border-[#8B7CF6]/50 hover:text-white"
            >
              <Copy size={11} />
              Same institution
            </button>
          )}

          <div
            className={`${MONO} flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-bold tracking-[0.14em]`}
            style={{
              borderColor: complete
                ? `${COLORS.purple}55`
                : "rgba(232,226,214,0.12)",
              color: complete
                ? COLORS.purple
                : "rgba(232,226,214,0.4)",
            }}
          >
            {complete ? (
              <>
                <Check size={11} strokeWidth={3} /> READY
              </>
            ) : (
              `${filled}/${MEMBER_FIELDS.length}`
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Full Name"
          value={member.name}
          onChange={(value) => onChange("name", value)}
          placeholder={captain ? "e.g. Rayyan Tausalkar" : "e.g. Ayaan Mistry"}
          error={err("name")}
          autoComplete={captain ? "name" : "off"}
        />
        <Field
          label="Email Address"
          type="email"
          value={member.email}
          onChange={(value) => onChange("email", value)}
          placeholder="name@example.com"
          error={err("email")}
          autoComplete={captain ? "email" : "off"}
        />
        <Field
          label="Phone Number"
          type="tel"
          value={member.phone}
          onChange={(value) => onChange("phone", value)}
          placeholder="1234567890"
          error={err("phone")}
          autoComplete={captain ? "tel" : "off"}
        />
        <Field
          label="College / Institution"
          value={member.college}
          onChange={(value) => onChange("college", value)}
          placeholder="e.g. AIKTC"
          error={err("college")}
          autoComplete="off"
        />
        <Field
          label="Course"
          value={member.course}
          onChange={(value) => onChange("course", value)}
          placeholder="e.g. BE, BTECH"
          error={err("course")}
          autoComplete="off"
        />
        <Field
          label="Branch / Department"
          value={member.branch}
          onChange={(value) => onChange("branch", value)}
          placeholder="e.g. AI&ML"
          error={err("branch")}
          autoComplete="off"
        />
        <SelectField
          label="Academic Year"
          value={member.year}
          onChange={(value) => onChange("year", value)}
          options={YEAR_OPTIONS}
          error={err("year")}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Review Member Summary Block
   ========================================================= */

function ReviewMember({ member, index, onEdit }) {
  const captain = index === 0;
  const accent = captain ? COLORS.purple : COLORS.orange;

  const label = captain
    ? "CAPTAIN (PRIMARY CONTACT)"
    : `MEMBER 0${index + 1}`;

  const details = [
    ["Email", member.email],
    ["Phone", member.phone],
    ["Institution", member.college],
    ["Course", member.course],
    ["Branch", member.branch],
    ["Year", member.year],
  ];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md"
      style={{
        borderColor: captain
          ? `${COLORS.purple}33`
          : "rgba(232,226,214,0.10)",
        background: "rgba(22, 16, 28, 0.6)",
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#E8E2D6]/10 pb-3">
        <div>
          <span
            className={`${MONO} text-[9px] font-bold tracking-[0.2em] block`}
            style={{ color: accent }}
          >
            {label}
          </span>
          <h4 className={`${DISPLAY} mt-1 text-base font-bold uppercase text-[#E8E2D6]`}>
            {member.name || "—"}
          </h4>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E2D6]/15 bg-[#1F1729]/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#E8E2D6]/60 transition hover:border-[#8B7CF6]/50 hover:text-white"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>

      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([term, value]) => (
          <div key={term} className="min-w-0">
            <dt className={`${MONO} text-[9px] uppercase tracking-[0.18em] text-[#E8E2D6]/40`}>
              {term}
            </dt>
            <dd className="mt-0.5 truncate text-xs sm:text-sm text-[#E8E2D6]/85">
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* =========================================================
   Arena Ticket Pass View (after registration)
   ========================================================= */

function RegistrationTicket({ record }) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
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

  const captain = record.participants?.[0] || record.primaryContact;
  const isTrio = record.groupSize === 3 || record.teamFormat === "trio";

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Top action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={copyId}
          className="inline-flex items-center gap-2 rounded-xl border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/25 shadow-[0_0_20px_rgba(139,124,246,0.15)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "ID COPIED" : "COPY ID"}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/70 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/80 transition hover:border-[#E8E2D6]/35 hover:text-white"
        >
          <Printer size={12} />
          PRINT PASS
        </button>
      </div>

      {/* Main Ticket Card matching Dashboard Pass */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#8B7CF6]/30 p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(139,124,246,0.14)] backdrop-blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 124, 246, 0.12) 0%, rgba(22, 16, 28, 0.90) 45%, rgba(196, 100, 46, 0.08) 100%)",
        }}
      >
        {/* Corner Crosshairs */}
        <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
        <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
        <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
        <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

        {/* Header Block */}
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

        {/* Registration ID Strip */}
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
              Your registration is confirmed. When you visit the BvB Dashboard, this pass will automatically load on your device.
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

        {/* Squad Roster */}
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
                : "CONFIRMED"}
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
                Captain: {captain?.name} ({captain?.phone})
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#E8E2D6]/50">
            <ShieldCheck size={15} className="text-[#8B7CF6]" />
            Slot reserved & confirmed
          </div>
          <div className={`${MONO} text-[10px] tracking-[0.18em] text-[#E8E2D6]/35`}>
            NO PASSWORD NEEDED · TIED TO PHONE & ID
          </div>
        </div>
      </div>

      {/* Ticket Action Navigation */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#08150D] shadow-[0_0_24px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Join WhatsApp Group &rarr;
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-[#8B7CF6] px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#1A1410] shadow-[0_0_24px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          Go to Dashboard &rarr;
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/80 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/80 transition-all hover:border-[#8B7CF6]/50 hover:text-white"
        >
          Back to BvB Home
        </a>
      </div>
    </div>
  );
}

/* =========================================================
   Main Export: Awwwards-Level Registration Portal
   ========================================================= */

export default function Register({ onBack = () => {} }) {
  const reduceMotion = Boolean(useReducedMotion());

  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] = useState("duo");
  const [form, setForm] = useState({
    teamName: "",
    registrationType: "duo",
    members: [emptyMember(), emptyMember(), emptyMember()],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // View state: "register" | "ticket" | "lookup"
  const [mode, setMode] = useState("register");
  const [activeTicket, setActiveTicket] = useState(null);

  // Check localStorage for existing registration on mount
  useEffect(() => {
    const saved = getSavedRegistration();
    if (saved && saved.registrationId) {
      setActiveTicket(saved);
      setMode("ticket");
    }
  }, []);

  const memberCount = registrationType === "trio" ? 3 : 2;
  const activeMembers = form.members.slice(0, memberCount);
  const captain = activeMembers[0];

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateMember = (index, field, value) => {
    setForm((prev) => {
      const nextMembers = [...prev.members];
      nextMembers[index] = {
        ...nextMembers[index],
        [field]: value,
      };
      return {
        ...prev,
        members: nextMembers,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [memberKey(index, field)]: undefined,
    }));
  };

  const validateStep = (current) => {
    const nextErrors = {};

    if (current === 1) {
      if (!["duo", "trio"].includes(registrationType)) {
        nextErrors.registrationType = "Please select DUO or TRIO format.";
      }
    }

    if (current === 2) {
      if (!form.teamName.trim()) {
        nextErrors.teamName = "Team Name is required.";
      } else if (form.teamName.trim().length < 2) {
        nextErrors.teamName = "Team Name must be at least 2 characters.";
      }

      activeMembers.forEach((member, index) => {
        const prefix = `member_${index}_`;

        if (!member.name.trim()) {
          nextErrors[`${prefix}name`] = "Full Name is required.";
        }
        if (!member.email.trim()) {
          nextErrors[`${prefix}email`] = "Email is required.";
        } else if (!EMAIL_PATTERN.test(member.email.trim())) {
          nextErrors[`${prefix}email`] = "Please enter a valid email address.";
        }
        if (!member.phone.trim()) {
          nextErrors[`${prefix}phone`] = "Phone Number is required.";
        } else if (!PHONE_PATTERN.test(member.phone.trim())) {
          nextErrors[`${prefix}phone`] = "Please enter a valid phone number.";
        }
        if (!member.college.trim()) {
          nextErrors[`${prefix}college`] = "Institution is required.";
        }
        if (!member.course?.trim()) {
          nextErrors[`${prefix}course`] = "Course is required.";
        }
        if (!member.branch.trim()) {
          nextErrors[`${prefix}branch`] = "Branch is required.";
        }
        if (!member.year) {
          nextErrors[`${prefix}year`] = "Academic year is required.";
        }
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpTo = (target) => {
    if (target < step) {
      setStep(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    // Prevent double registration if user is already registered on this device
    const existing = getSavedRegistration();
    if (existing && existing.registrationId) {
      setErrors({
        submit: `You have already registered squad "${existing.teamName}" (${existing.registrationId}). Multiple registrations from the same device are prohibited.`,
      });
      return;
    }

    if (submitting) return;

    if (!validateStep(1) || !validateStep(2)) {
      setStep(2);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload = {
      teamName: form.teamName.trim(),
      groupSize: memberCount,
      teamFormat: registrationType,
      registrationType: registrationType,
      participants: activeMembers.map((m, idx) => ({
        role: idx === 0 ? "captain" : "member",
        name: m.name.trim(),
        email: m.email.trim(),
        phone: m.phone.trim(),
        college: m.college.trim(),
        course: m.course?.trim() || "",
        branch: m.branch.trim(),
        year: m.year,
      })),
      primaryContact: {
        name: captain.name.trim(),
        email: captain.email.trim(),
        phone: captain.phone.trim(),
      },
    };

    try {
      const response = await fetch(REGISTRATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "success" || data.success) {
        const ticketData = {
          registrationId: data.registrationId || `BVB26-${Math.floor(1000 + Math.random() * 9000)}`,
          teamName: form.teamName.trim(),
          groupSize: memberCount,
          teamFormat: registrationType,
          participants: payload.participants,
          primaryContact: payload.primaryContact,
          registeredAt: new Date().toISOString(),
          status: "confirmed",
        };

        saveRegistration(ticketData);
        setActiveTicket(ticketData);
        setMode("ticket");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrors({
          submit: data.message || "Failed to complete registration. Please try again.",
        });
      }
    } catch (err) {
      setErrors({
        submit:
          "Network error while connecting to registration backend. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cursor motion for FloatingShards parallax
  const mouseX = useMotionValue(500);
  const mouseY = useMotionValue(400);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

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
        {/* Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_85%)]" />

        {/* Ambient atmospheric glow orbs */}
        <div className="absolute -left-28 top-20 h-[55vw] w-[55vw] rounded-full bg-[#8B7CF6]/10 blur-[130px]" />
        <div className="absolute -right-28 top-[35%] h-[55vw] w-[55vw] rounded-full bg-[#C4642E]/[0.09] blur-[130px]" />

        {/* Circuit Track */}
        <CircuitTrack className="top-1/3 opacity-15" />
      </div>

      {/* ── Floating 3D Geometric Shards (cursor-reactive) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FloatingShards shards={REGISTER_SHARDS} smoothX={smoothX} smoothY={smoothY} />
      </div>

      {/* ── Giant Typographic Ambient Watermark ── */}
      <span
        aria-hidden="true"
        className={`${DISPLAY} pointer-events-none fixed -bottom-10 -right-6 z-0 select-none text-[22vw] font-bold leading-none tracking-[-0.08em] text-transparent opacity-10 [-webkit-text-stroke:1px_rgba(232,226,214,0.04)]`}
      >
        REGISTER
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

        {activeTicket ? (
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[#8B7CF6]/35 bg-[#8B7CF6]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition-all hover:bg-[#8B7CF6]/20 shadow-[0_0_15px_rgba(139,124,246,0.12)]"
          >
            <Ticket size={13} />
            My Dashboard &rarr;
          </a>
        ) : (
          <a
            href="/dashboard?find=true"
            className="inline-flex items-center gap-2 rounded-xl border border-[#8B7CF6]/35 bg-[#8B7CF6]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition-all hover:bg-[#8B7CF6]/20 shadow-[0_0_15px_rgba(139,124,246,0.12)]"
          >
            <Search size={13} />
            Find Registration &rarr;
          </a>
        )}
      </div>

      {/* ── Main Content Container ── */}
      <main className="relative z-10 mx-auto w-full max-w-[1360px] px-4 pt-6 pb-14 sm:px-8 sm:pt-8 md:px-12 md:pb-20">
        {/* VIEW: ALREADY REGISTERED / TICKET PASS */}
        {activeTicket ? (
          <div className="space-y-8">
            {/* Banner: Already Registered */}
            <div className="relative overflow-hidden rounded-3xl border border-[#8B7CF6]/30 bg-gradient-to-r from-[#8B7CF6]/15 via-[#1F1729]/80 to-[#C4642E]/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,124,246,0.12)]">
              <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#8B7CF6]/20 text-[#8B7CF6] border border-[#8B7CF6]/40 shadow-[0_0_20px_rgba(139,124,246,0.25)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-widest block`}>
                      ACTIVE REGISTRATION DETECTED
                    </span>
                    <h2 className={`${DISPLAY} text-lg sm:text-xl font-bold uppercase tracking-tight text-[#E8E2D6] mt-0.5`}>
                      You Have Already Registered
                    </h2>
                    <p className="text-xs sm:text-sm text-[#E8E2D6]/65 mt-1">
                      Squad <strong className="text-white">"{activeTicket.teamName}"</strong> is officially registered with ID <strong className="text-[#8B7CF6] font-mono">{activeTicket.registrationId}</strong>. Multiple registrations on the same device are prohibited.
                    </p>
                  </div>
                </div>

                <a
                  href="/dashboard"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#8B7CF6] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#1A1410] shadow-[0_0_24px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                >
                  <Ticket size={14} />
                  Open Dashboard &rarr;
                </a>
              </div>
            </div>

            {/* Display Confirmed Registration Pass */}
            <RegistrationTicket record={activeTicket} />
          </div>
        ) : (
          /* VIEW: REGISTRATION WIZARD (Only reachable if NOT registered) */
          <>
            {/* ============================================================ */}
            {/*  EDITORIAL SECTION HEADER (Strictly mirrors Prizes & Rules)   */}
            {/* ============================================================ */}
            <div className="mb-10 pb-10 border-b border-[#E8E2D6]/10">
              <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-widest block mb-2`}>
                OFFICIAL ARENA PORTAL
              </span>
              <h1
                className={`${DISPLAY} text-[clamp(2.2rem,6vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-[#E8E2D6]`}>
                REGISTER YOUR <span className={GRAD_BUILD}>SQUAD</span>
              </h1>
              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
                Zero entry fee. Select your format, enter your squad profile, and qualify via the Quiz Round for the Main Event on 3rd October.
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator currentStep={step} />

            {/* Main Step Panel Card */}
            <div
              className="relative overflow-hidden rounded-3xl border border-[#E8E2D6]/12 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,124,246,0.08)]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139, 124, 246, 0.08) 0%, rgba(22, 16, 28, 0.78) 50%, rgba(196, 100, 46, 0.05) 100%)",
              }}
            >
              {/* Corner crosshairs */}
              <span className="pointer-events-none absolute top-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute top-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 left-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>
              <span className="pointer-events-none absolute bottom-3.5 right-3.5 text-[9px] font-mono text-[#E8E2D6]/20 select-none">+</span>

              <AnimatePresence mode="wait">
                {/* STEP 1: FORMAT */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-b border-[#E8E2D6]/10 pb-6 mb-8">
                      <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-widest block mb-2`}>
                        STEP 01 OF 03
                      </span>
                      <h2 className={`${DISPLAY} text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                        Choose Squad Format
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#E8E2D6]/50">
                        Select whether your BvB entry will compete as a Duo (2 participants) or Trio (3 participants).
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <SelectionOption
                        icon={Users}
                        eyebrow="DUO SQUAD"
                        title="DUO (2 PARTICIPANTS)"
                        description="Form a 2-person squad. Recommended for specialized hacker-builder pairs."
                        active={registrationType === "duo"}
                        onClick={() => {
                          setRegistrationType("duo");
                          setErrors({});
                        }}
                      />
                      <SelectionOption
                        icon={Users}
                        eyebrow="TRIO SQUAD"
                        title="TRIO (3 PARTICIPANTS)"
                        description="Form a 3-person squad. Ideal for balanced builder, breaker, and systems engineer teams."
                        active={registrationType === "trio"}
                        accent="orange"
                        onClick={() => {
                          setRegistrationType("trio");
                          setErrors({});
                        }}
                      />
                    </div>

                    {errors.registrationType && (
                      <div className="mt-4 rounded-xl border border-[#C4642E]/40 bg-[#C4642E]/10 p-3 text-xs text-[#C4642E]">
                        {errors.registrationType}
                      </div>
                    )}

                    <div className="mt-10 flex items-center justify-between border-t border-[#E8E2D6]/10 pt-6">
                      <button
                        type="button"
                        onClick={onBack}
                        className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/40 transition hover:text-[#E8E2D6]"
                      >
                        Exit
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8B7CF6] px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#1A1410] shadow-[0_0_24px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                      >
                        Continue to Roster
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-b border-[#E8E2D6]/10 pb-6 mb-8">
                      <span className={`${MONO} text-[10px] text-[#C4642E] uppercase font-bold tracking-widest block mb-2`}>
                        STEP 02 OF 03
                      </span>
                      <h2 className={`${DISPLAY} text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                        Team & Squad Roster
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#E8E2D6]/50">
                        Enter your official team name and details for all {memberCount} squad members. Member 01 acts as the Team Captain.
                      </p>
                    </div>

                    <div className="mb-8 max-w-md">
                      <Field
                        label="Team Name"
                        value={form.teamName}
                        onChange={(v) => updateForm("teamName", v)}
                        placeholder="e.g. CodeBreakers"
                        error={errors.teamName}
                      />
                    </div>

                    <div className="space-y-5">
                      {activeMembers.map((member, index) => (
                        <MemberCard
                          key={index}
                          index={index}
                          member={member}
                          errors={errors}
                          onChange={(field, val) => updateMember(index, field, val)}
                          captainCollege={captain?.college}
                        />
                      ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between border-t border-[#E8E2D6]/10 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#8B7CF6]/50 hover:text-white"
                      >
                        <ArrowLeft size={13} />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8B7CF6] px-8 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#1A1410] shadow-[0_0_24px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                      >
                        Review & Confirm
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border-b border-[#E8E2D6]/10 pb-6 mb-8">
                      <span className={`${MONO} text-[10px] text-[#8B7CF6] uppercase font-bold tracking-widest block mb-2`}>
                        STEP 03 OF 03
                      </span>
                      <h2 className={`${DISPLAY} text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]`}>
                        Review & Lock Entry
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#E8E2D6]/50">
                        Review your squad details below. Upon confirmation, your official Registration ID will be assigned and saved.
                      </p>
                    </div>

                    {/* Quick Summary Pill Banner */}
                    <div className="mb-6 rounded-2xl border border-[#8B7CF6]/30 bg-gradient-to-r from-[#8B7CF6]/15 via-[#1F1729]/70 to-[#120D1A]/80 p-5 sm:p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <span className={`${MONO} text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/40 block`}>
                            TEAM NAME
                          </span>
                          <div className={`${DISPLAY} mt-1 text-lg font-bold text-[#E8E2D6]`}>
                            {form.teamName || "—"}
                          </div>
                        </div>
                        <div>
                          <span className={`${MONO} text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/40 block`}>
                            FORMAT
                          </span>
                          <div className={`${MONO} mt-1 text-base font-bold text-[#8B7CF6]`}>
                            {registrationType.toUpperCase()} ({memberCount} OPERATIVES)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-4">
                      {activeMembers.map((member, index) => (
                        <ReviewMember
                          key={index}
                          member={member}
                          index={index}
                          onEdit={() => jumpTo(2)}
                        />
                      ))}
                    </div>

                    {errors.submit && (
                      <div className="mt-6 rounded-xl border border-[#C4642E]/40 bg-[#C4642E]/10 p-4 text-xs text-[#E8E2D6]">
                        <span className="font-bold text-[#C4642E]">Submission Error: </span>
                        {errors.submit}
                      </div>
                    )}

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2D6]/15 bg-[#1F1729]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#8B7CF6]/50 hover:text-white"
                      >
                        <ArrowLeft size={13} />
                        Back to Details
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#8B7CF6] px-9 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#1A1410] shadow-[0_0_30px_rgba(139,124,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw size={15} className="animate-spin" />
                            CONFIRMING REGISTRATION...
                          </>
                        ) : (
                          <>
                            <Zap size={15} />
                            COMPLETE REGISTRATION
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}