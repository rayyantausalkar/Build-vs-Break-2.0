"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Pencil,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  REGISTRATION_API_URL,
  getSavedRegistration,
  saveRegistration,
  lookupRegistration,
} from "@/lib/registration";

/* =========================================================
   BvB Registration System — Build vs Break
   ========================================================= */

const COLORS = {
  purple: "#8B7CF6",
  deepPurple: "#3B2F4F",
  orange: "#C4642E",
  ivory: "#E8E2D6",
  bg: "#1A1410",
};

const STEPS = [
  {
    id: 1,
    code: "01",
    label: "FORMAT",
    title: "Choose your team format",
  },
  {
    id: 2,
    code: "02",
    label: "DETAILS",
    title: "Build your team profile",
  },
  {
    id: 3,
    code: "03",
    label: "CONFIRM",
    title: "Review & enter system",
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
  "Other",
];

const TEAM_SIZE_BY_TYPE = {
  duo: MIN_GROUP_SIZE,
  trio: MAX_GROUP_SIZE,
};

const TEAM_TYPE_LABELS = {
  duo: "DUO",
  trio: "TRIO",
};

const MEMBER_FIELDS = [
  "name",
  "email",
  "phone",
  "college",
  "branch",
  "year",
];

const emptyMember = () => ({
  name: "",
  email: "",
  phone: "",
  college: "",
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* =========================================================
   Background Ambient Elements
   ========================================================= */

function BackgroundSystem({ reduceMotion }) {
  const particles = useMemo(() => {
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return Array.from({ length: 48 }, (_, index) => ({
      id: index,
      x: random() * 100,
      y: random() * 100,
      size: 2 + random() * 4,
      opacity: 0.12 + random() * 0.28,
      rotate: random() * 90,
      duration: 8 + random() * 10,
      delay: random() * 5,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {/* Ambient gradient lights */}
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

      {/* Industrial Grid */}
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

      {/* Frame border */}
      <div className="absolute inset-4 border border-[#E8E2D6]/[0.05] md:inset-6" />

      {/* Floating particles */}
      {particles.map((particle) => {
        const isPurple = particle.id % 2 === 0;
        const color = isPurple ? COLORS.purple : COLORS.orange;

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
              transform: `rotate(${particle.rotate}deg)`,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -14, 0],
                    x: [0, particle.id % 2 ? 6 : -6, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        );
      })}
    </div>
  );
}

/* =========================================================
   Brand Mark
   ========================================================= */

function BrandMark({ size = "md" }) {
  const box =
    size === "lg"
      ? "h-20 w-20 sm:h-24 sm:w-24"
      : "h-11 w-11 sm:h-12 sm:w-12";

  return (
    <div className="group flex items-center gap-3 sm:gap-4">
      <div className={cx("relative shrink-0", box)}>
        <span className="pointer-events-none absolute -left-1.5 -top-1.5 h-2.5 w-2.5 border-l border-t border-[#8B7CF6]/70 transition-all duration-300 group-hover:-left-2 group-hover:-top-2" />
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 h-2.5 w-2.5 border-b border-r border-[#C4642E]/70 transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2" />

        <div className="h-full w-full overflow-hidden border border-[#E8E2D6]/15 bg-[#0B0806] transition-colors duration-300 group-hover:border-[#8B7CF6]/50">
          <img
            src={ASSETS.logo}
            alt="BvB — Build vs Break"
            width={1254}
            height={1254}
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </div>

      {size !== "lg" && (
        <div>
          <div
            className="text-sm font-black tracking-[0.24em]"
            style={{ color: COLORS.ivory }}
          >
            BvB
          </div>
          <div className="mt-0.5 text-[8px] font-semibold tracking-[0.28em] text-[#E8E2D6]/40">
            BUILD VS BREAK
          </div>
        </div>
      )}
    </div>
  );
}

function TechnicalLabel({ children, accent = "purple" }) {
  const color = accent === "orange" ? COLORS.orange : COLORS.purple;

  return (
    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em] text-[#E8E2D6]/50">
      <span
        className="h-1.5 w-1.5"
        style={{
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {children}
    </div>
  );
}

/* =========================================================
   Step Indicator (3 Steps: Type, Details, Confirm)
   ========================================================= */

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-2">
      {STEPS.map((step) => {
        const active = currentStep === step.id;
        const complete = currentStep > step.id;

        return (
          <div key={step.id} className="relative">
            <div className="h-[2px] w-full overflow-hidden bg-[#E8E2D6]/10">
              <motion.div
                initial={false}
                animate={{
                  width: active || complete ? "100%" : "0%",
                }}
                className="h-full"
                style={{
                  background:
                    step.id === 2
                      ? COLORS.orange
                      : COLORS.purple,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className="font-mono text-[9px] tracking-[0.18em]"
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
                  "hidden text-[8px] font-bold tracking-[0.18em] sm:block",
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

function Panel({ children, className = "" }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden border border-[#E8E2D6]/10 bg-[#1A1410]/75 backdrop-blur-xl",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,124,246,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(196,100,46,0.06),transparent_35%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* =========================================================
   Form Fields
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
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/55">
          {label}
          {required && <span className="ml-1 text-[#C4642E]">*</span>}
        </span>
        {error && (
          <span className="text-[8px] font-semibold text-[#C4642E]">
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
            "h-13 w-full border bg-[#0F0B09]/70 px-4 text-sm text-[#E8E2D6] outline-none transition-all placeholder:text-[#E8E2D6]/20",
            error
              ? "border-[#C4642E]/60"
              : "border-[#E8E2D6]/10 hover:border-[#E8E2D6]/20 focus:border-[#8B7CF6]/70"
          )}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-focus-within:w-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.purple}, transparent)`,
          }}
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
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/55">
          {label}
          {required && <span className="ml-1 text-[#C4642E]">*</span>}
        </span>
        {error && (
          <span className="text-[8px] text-[#C4642E]">
            {error}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cx(
            "h-13 w-full appearance-none border bg-[#0F0B09]/70 px-4 pr-12 text-sm text-[#E8E2D6] outline-none transition-all",
            error
              ? "border-[#C4642E]/60"
              : "border-[#E8E2D6]/10 hover:border-[#E8E2D6]/20 focus:border-[#8B7CF6]/70"
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
      className="group relative w-full overflow-hidden border p-6 text-left transition-colors"
      style={{
        borderColor: active ? `${color}99` : "rgba(232,226,214,0.10)",
        background: active
          ? `linear-gradient(135deg, ${color}12, rgba(15,11,9,0.8))`
          : "rgba(15,11,9,0.55)",
        boxShadow: active ? `0 0 35px ${color}12` : undefined,
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[2px] transition-transform"
        style={{
          background: color,
          transform: active ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
        }}
      />

      <div className="flex items-start justify-between gap-5">
        <div>
          <div
            className="mb-5 flex h-11 w-11 items-center justify-center border"
            style={{
              borderColor: `${color}55`,
              color,
              background: `${color}0D`,
            }}
          >
            <Icon size={21} />
          </div>

          <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[#E8E2D6]/40">
            {eyebrow}
          </div>

          <h3 className="text-xl font-black uppercase tracking-[0.06em] text-[#E8E2D6]">
            {title}
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-6 text-[#E8E2D6]/45">
            {description}
          </p>
        </div>

        <div
          className="flex h-6 w-6 items-center justify-center border"
          style={{
            borderColor: active ? color : "rgba(232,226,214,0.18)",
            background: active ? color : "transparent",
          }}
        >
          {active && (
            <Check size={14} strokeWidth={3} className="text-[#1A1410]" />
          )}
        </div>
      </div>

      <div
        className="mt-6 h-px w-full"
        style={{
          background: `linear-gradient(90deg, ${color}55, transparent)`,
        }}
      />
    </motion.button>
  );
}

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
    ? "Team captain / Primary contact"
    : `Team member ${pad(index + 1)}`;

  const eyebrow = captain
    ? `${pad(index + 1)} ─ CAPTAIN`
    : `${pad(index + 1)} ─ MEMBER`;

  const err = (field) => errors[memberKey(index, field)];

  return (
    <motion.div
      layout={false}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="pb-4">
        <div
          className="relative border bg-[#0F0B09]/50 p-4 sm:p-5"
          style={{
            borderColor: captain
              ? `${COLORS.purple}40`
              : "rgba(232,226,214,0.10)",
            background: captain
              ? "linear-gradient(135deg, rgba(139,124,246,0.06), rgba(15,11,9,0.55) 55%)"
              : undefined,
          }}
        >
          <div
            className="absolute left-0 top-0 h-full w-[2px]"
            style={{
              background: captain
                ? COLORS.purple
                : `linear-gradient(180deg, ${COLORS.orange}, transparent)`,
            }}
          />

          <span className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#E8E2D6]/25" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#E8E2D6]/25" />

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <div
                  className="absolute inset-1.5 rotate-45 border"
                  style={{
                    borderColor: accent,
                    background: captain ? `${accent}22` : "transparent",
                  }}
                />
                <span
                  className="relative font-mono text-[10px] font-bold"
                  style={{ color: accent }}
                >
                  {pad(index + 1)}
                </span>
              </div>

              <div className="min-w-0">
                <div
                  className="font-mono text-[8px] tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  {eyebrow}
                </div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#E8E2D6] sm:text-[11px]">
                  {title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!captain && captainCollege?.trim() && (
                <button
                  type="button"
                  onClick={() => onChange("college", captainCollege)}
                  className="inline-flex items-center gap-1.5 border border-[#E8E2D6]/12 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#E8E2D6]/50 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
                >
                  <Copy size={10} />
                  Same institution
                </button>
              )}

              <div
                className="flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[8px] tracking-[0.14em]"
                style={{
                  borderColor: complete
                    ? `${COLORS.purple}55`
                    : "rgba(232,226,214,0.10)",
                  color: complete
                    ? COLORS.purple
                    : "rgba(232,226,214,0.35)",
                }}
              >
                {complete ? (
                  <>
                    <Check size={10} strokeWidth={3} /> READY
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
              placeholder="Enter full name"
              error={err("name")}
              autoComplete={captain ? "name" : "off"}
            />
            <Field
              label="Email"
              type="email"
              value={member.email}
              onChange={(value) => onChange("email", value)}
              placeholder="name@example.com"
              error={err("email")}
              autoComplete={captain ? "email" : "off"}
            />
            <Field
              label="Phone"
              type="tel"
              value={member.phone}
              onChange={(value) => onChange("phone", value)}
              placeholder="+91 XXXXX XXXXX"
              error={err("phone")}
              autoComplete={captain ? "tel" : "off"}
            />
            <Field
              label="College / Institution"
              value={member.college}
              onChange={(value) => onChange("college", value)}
              placeholder="Enter college / institution"
              error={err("college")}
              autoComplete="off"
            />
            <Field
              label="Branch / Department"
              value={member.branch}
              onChange={(value) => onChange("branch", value)}
              placeholder="e.g. CSE, AIML, ECE"
              error={err("branch")}
              autoComplete="off"
            />
            <SelectField
              label="Year"
              value={member.year}
              onChange={(value) => onChange("year", value)}
              options={YEAR_OPTIONS}
              error={err("year")}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#E8E2D6]/[0.07] py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/35">
        {label}
      </span>
      <span className="break-all text-sm font-medium text-[#E8E2D6]/80 sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function ReviewMember({ member, index, onEdit }) {
  const captain = index === 0;
  const accent = captain ? COLORS.purple : COLORS.orange;

  const label = captain
    ? "CAPTAIN / PRIMARY CONTACT"
    : `MEMBER ${pad(index + 1)}`;

  const details = [
    ["Email", member.email],
    ["Phone", member.phone],
    ["Institution", member.college],
    ["Branch", member.branch],
    ["Year", member.year],
  ];

  return (
    <div
      className="relative border bg-[#0F0B09]/40 p-4 sm:p-5"
      style={{
        borderColor: captain
          ? `${COLORS.purple}33`
          : "rgba(232,226,214,0.10)",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{ background: accent }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="font-mono text-[8px] tracking-[0.2em]"
            style={{ color: accent }}
          >
            {label}
          </div>
          <div className="mt-2 break-words text-base font-black uppercase tracking-[0.03em] text-[#E8E2D6]">
            {member.name || "—"}
          </div>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center gap-1.5 border border-[#E8E2D6]/12 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#E8E2D6]/50 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
          >
            <Pencil size={10} />
            Edit
          </button>
        )}
      </div>

      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([term, value]) => (
          <div key={term} className="min-w-0">
            <dt className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/30">
              {term}
            </dt>
            <dd className="mt-1 break-words text-sm text-[#E8E2D6]/80">
              {value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* =========================================================
   Luxury Cyber Registration Ticket / Pass
   ========================================================= */

function RegistrationTicket({ record, onNewRegistration, onLookupAnother }) {
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
    <div className="mx-auto w-full max-w-3xl">
      {/* Top Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#8B7CF6]">
            <span className="h-1 w-1 rounded-full bg-white animate-ping" />
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#8B7CF6]">
            BvB 2026 // OFFICIAL ENTRY PASS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyId}
            className="inline-flex items-center gap-1.5 border border-[#8B7CF6]/40 bg-[#8B7CF6]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/20"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "ID COPIED" : "COPY ID"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 border border-[#E8E2D6]/15 bg-[#0F0B09] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#E8E2D6]/40 hover:text-[#E8E2D6]"
          >
            <Printer size={11} />
            PRINT PASS
          </button>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="relative overflow-hidden border border-[#8B7CF6]/30 bg-[#0F0B09]/90 p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(139,124,246,0.12)]">
        {/* Decorative corner brackets */}
        <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#8B7CF6]" />
        <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#C4642E]" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#C4642E]" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#8B7CF6]" />

        {/* Ambient watermark */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 select-none font-mono text-[9rem] font-black leading-none text-[#E8E2D6]/[0.02]">
          BvB
        </div>

        {/* Header Block */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#E8E2D6]/10 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden border border-[#8B7CF6]/40 bg-black p-1.5">
              <img
                src={ASSETS.logo}
                alt="BvB"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[0.24em] text-[#8B7CF6]">
                BUILD VS BREAK // 2026
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]">
                {record.teamName}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
            <div className="inline-flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-[#8B7CF6]">
              <CheckCircle2 size={12} />
              {record.status?.toUpperCase() || "CONFIRMED"}
            </div>
            <div className="font-mono text-[9px] tracking-[0.18em] text-[#E8E2D6]/40">
              ENTRY FORMAT: {isTrio ? "TRIO (3P)" : "DUO (2P)"}
            </div>
          </div>
        </div>

        {/* Big Registration ID Box */}
        <div className="mt-6 border border-[#C4642E]/30 bg-[#1A1410]/80 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#C4642E]">
                REGISTRATION ID
              </div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-black tracking-[0.08em] text-[#E8E2D6]">
                {record.registrationId}
              </div>
            </div>
            <p className="text-[10px] leading-5 text-[#E8E2D6]/50 max-w-xs">
              Save this ID. When you return to the BvB website, you will automatically see your registration details.
            </p>
          </div>
        </div>

        {/* Roster Breakdown */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#E8E2D6]/50">
              TEAM ROSTER // {record.participants?.length || record.groupSize} PARTICIPANTS
            </div>
            <div className="font-mono text-[9px] text-[#8B7CF6]">
              {record.registeredAt ? new Date(record.registeredAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "LOCKED"}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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
                        {member.college || member.branch ? `${member.branch} · ${member.college}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 border border-[#E8E2D6]/10 text-xs text-[#E8E2D6]/60">
                Captain: {captain?.name} ({captain?.phone})
              </div>
            )}
          </div>
        </div>

        {/* Security & Verification Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#E8E2D6]/40">
            <ShieldCheck size={14} className="text-[#8B7CF6]" />
            Verified entry recorded into Google Sheet system
          </div>

          <div className="font-mono text-[8px] tracking-[0.18em] text-[#E8E2D6]/30">
            NO PASSWORD NEEDED · TIED TO PHONE & ID
          </div>
        </div>
      </div>

      {/* Ticket Action Navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {onNewRegistration && (
          <button
            type="button"
            onClick={onNewRegistration}
            className="inline-flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1410] transition hover:brightness-110"
          >
            <Users size={14} />
            Register Another Team
          </button>
        )}

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6]/15 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/30"
        >
          Go to Dashboard &rarr;
        </a>

        {onLookupAnother && (
          <button
            type="button"
            onClick={onLookupAnother}
            className="inline-flex items-center gap-2 border border-[#E8E2D6]/15 bg-[#0F0B09]/80 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/80 transition hover:border-[#E8E2D6]/40 hover:text-white"
          >
            <Search size={14} />
            Look Up Another Entry
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   "Find My Registration" Lookup Form Component
   ========================================================= */

function LookupView({ onFound, onCancel }) {
  const [lookupId, setLookupId] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!lookupId.trim()) {
      setError("Please enter your Registration ID (e.g. BVB26-0005).");
      return;
    }
    if (!lookupPhone.trim()) {
      setError("Please enter your registered phone number.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await lookupRegistration(lookupId, lookupPhone);
    setLoading(false);

    if (result.success && result.data) {
      onFound(result.data);
    } else {
      setError(
        result.message ||
          "No registration found matching this Registration ID and Phone Number. Please check your details."
      );
    }
  };

  return (
    <Panel className="mx-auto max-w-xl p-6 sm:p-9">
      <TechnicalLabel accent="orange">
        FIND REGISTRATION // LOOKUP SYSTEM
      </TechnicalLabel>

      <h2 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#E8E2D6]">
        Already Registered?
      </h2>

      <p className="mt-2 text-xs sm:text-sm leading-6 text-[#E8E2D6]/50">
        Enter your Registration ID and any member's registered phone number to view your BvB entry details.
      </p>

      <form onSubmit={handleLookup} className="mt-7 space-y-5">
        <Field
          label="Registration ID"
          value={lookupId}
          onChange={(v) => {
            setLookupId(v.toUpperCase());
            setError("");
          }}
          placeholder="e.g. BVB26-0005"
        />

        <Field
          label="Registered Phone Number"
          type="tel"
          value={lookupPhone}
          onChange={(v) => {
            setLookupPhone(v);
            setError("");
          }}
          placeholder="e.g. 9876543210"
        />

        {error && (
          <div className="border border-[#C4642E]/30 bg-[#C4642E]/10 p-3.5 text-xs text-[#E8E2D6]/90">
            <span className="font-bold text-[#C4642E]">Error: </span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-[#8B7CF6] px-7 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#1A1410] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                SEARCHING SHEET...
              </>
            ) : (
              <>
                <Search size={13} />
                VIEW MY REGISTRATION
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full sm:w-auto items-center justify-center border border-[#E8E2D6]/15 px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/60 transition hover:border-[#E8E2D6]/30 hover:text-[#E8E2D6]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </Panel>
  );
}

/* =========================================================
   MAIN REGISTER COMPONENT (Payment Free + My Registration)
   ========================================================= */

export default function Register({ onBack = () => {} }) {
  const reduceMotion = useReducedMotion();

  // Mode: "register" | "lookup" | "ticket"
  const [mode, setMode] = useState("register");
  const [activeTicket, setActiveTicket] = useState(null);

  // Registration step: 1 (Format), 2 (Details), 3 (Confirm)
  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] = useState("");
  const [form, setForm] = useState({
    teamName: "",
  });

  const [members, setMembers] = useState(() =>
    Array.from({ length: MAX_GROUP_SIZE }, emptyMember)
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize: check if user already has a saved registration in this browser or requested a specific view
  useEffect(() => {
    const saved = getSavedRegistration();
    if (saved && saved.registrationId) {
      setActiveTicket(saved);
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedView = urlParams.get("view");
      if (requestedView === "ticket" && saved && saved.registrationId) {
        setMode("ticket");
      } else if (requestedView === "lookup") {
        setMode("lookup");
      }
    }
  }, []);

  const groupSize = TEAM_SIZE_BY_TYPE[registrationType] || 0;
  const memberCount = clamp(groupSize, 0, MAX_GROUP_SIZE);
  const activeMembers = members.slice(0, memberCount);
  const captain = members[0];

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setErrors((current) => ({
      ...current,
      [key]: "",
    }));
  };

  const updateMember = (index, field, value) => {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      )
    );
    setErrors((current) => ({
      ...current,
      [memberKey(index, field)]: "",
    }));
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const el = document.querySelector('[data-error="true"]');
      if (el) {
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -100 });
        } else {
          el.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "center",
          });
        }
      }
    }, 60);
  };

  const scrollTop = () => {
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: Boolean(reduceMotion) });
    } else if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  };

  const validateStep = (currentStep) => {
    const nextErrors = {};

    if (currentStep === 1) {
      if (!registrationType) {
        nextErrors.registrationType = "Please select DUO or TRIO to continue.";
      }
    }

    if (currentStep === 2) {
      if (!form.teamName.trim()) {
        nextErrors.teamName = "Team name is required.";
      }

      activeMembers.forEach((member, index) => {
        const isCaptain = index === 0;
        const prefix = isCaptain ? "Team captain" : `Member ${index + 1}`;

        if (!member.name.trim()) {
          nextErrors[memberKey(index, "name")] = `${prefix} name is required.`;
        }
        if (!member.email.trim()) {
          nextErrors[memberKey(index, "email")] = `${prefix} email is required.`;
        } else if (!EMAIL_PATTERN.test(member.email.trim())) {
          nextErrors[memberKey(index, "email")] = "Enter a valid email address.";
        }
        if (!member.phone.trim()) {
          nextErrors[memberKey(index, "phone")] = `${prefix} phone number is required.`;
        } else if (!PHONE_PATTERN.test(member.phone.trim())) {
          nextErrors[memberKey(index, "phone")] = "Enter a valid phone number.";
        }
        if (!member.college.trim()) {
          nextErrors[memberKey(index, "college")] = `${prefix} college / institution is required.`;
        }
        if (!member.branch.trim()) {
          nextErrors[memberKey(index, "branch")] = `${prefix} branch is required.`;
        }
        if (!member.year) {
          nextErrors[memberKey(index, "year")] = `${prefix} year is required.`;
        }
      });
    }

    setErrors(nextErrors);
    const valid = Object.keys(nextErrors).length === 0;
    if (!valid) {
      scrollToFirstError();
    }
    return valid;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => clamp(current + 1, 1, 3));
    scrollTop();
  };

  const goBack = () => {
    if (step === 1) {
      onBack();
      return;
    }
    setStep((current) => clamp(current - 1, 1, 3));
    setErrors({});
    scrollTop();
  };

  const jumpTo = (target) => {
    setErrors({});
    setStep(target);
    scrollTop();
  };

  const buildPayload = () => {
    const participants = activeMembers.map((member, index) => ({
      position: index + 1,
      role: index === 0 ? "captain" : "member",
      name: member.name.trim(),
      email: member.email.trim(),
      phone: member.phone.trim(),
      college: member.college.trim(),
      branch: member.branch.trim(),
      year: member.year,
    }));

    return {
      registrationType: "group",
      teamFormat: registrationType,
      groupSize,
      teamName: form.teamName.trim(),
      primaryContact: {
        name: participants[0]?.name,
        email: participants[0]?.email,
        phone: participants[0]?.phone,
      },
      participants,
      transactionId: "FREE_ENTRY",
      paymentScreenshot: "",
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!validateStep(2)) {
      jumpTo(2);
      return;
    }

    const payload = buildPayload();
    setSubmitting(true);
    setErrors((current) => ({ ...current, submit: "" }));

    try {
      const response = await fetch(REGISTRATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Registration server returned HTTP ${response.status}.`);
      }

      const rawResponse = await response.text();
      let result;
      try {
        result = JSON.parse(rawResponse);
      } catch {
        throw new Error("The registration server returned an invalid response.");
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Registration could not be completed. Please try again."
        );
      }

      // Extract Registration ID from response or fallback to generated BVB26 ID
      const assignedId =
        result?.registrationId ||
        result?.id ||
        result?.data?.registrationId ||
        `BVB26-${String(Math.floor(1000 + Math.random() * 9000))}`;

      const createdRecord = {
        registrationId: assignedId,
        teamName: payload.teamName,
        teamFormat: payload.teamFormat,
        groupSize: payload.groupSize,
        primaryContact: payload.primaryContact,
        participants: payload.participants,
        registeredAt: payload.createdAt,
        status: "Confirmed",
      };

      saveRegistration(createdRecord);
      setActiveTicket(createdRecord);
      setMode("ticket");
      scrollTop();
    } catch (error) {
      console.error("BvB registration failed:", error);
      setErrors((current) => ({
        ...current,
        submit:
          error?.message ||
          "Something went wrong while submitting your registration. Please try again.",
      }));
      scrollTop();
    } finally {
      setSubmitting(false);
    }
  };

  const teamTypeLabel = TEAM_TYPE_LABELS[registrationType] || "TEAM";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#1A1410] text-[#E8E2D6]"
      style={{
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <BackgroundSystem reduceMotion={reduceMotion} />

      <div className="relative z-10">
        {/* =================================================
            HEADER
           ================================================= */}
        <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between border-b border-[#E8E2D6]/10 px-5 py-5 md:px-10">
          <BrandMark />

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick switcher to active ticket if already registered on this device */}
            {activeTicket && mode !== "ticket" && (
              <button
                type="button"
                onClick={() => setMode("ticket")}
                className="group flex items-center gap-2 border border-[#8B7CF6]/40 bg-[#8B7CF6]/10 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] transition hover:bg-[#8B7CF6]/20"
              >
                <Ticket size={13} />
                <span className="hidden sm:inline">My Pass:</span>
                <span>{activeTicket.registrationId}</span>
              </button>
            )}

            {/* Find registration lookup toggle */}
            {mode === "register" && (
              <button
                type="button"
                onClick={() => setMode("lookup")}
                className="hidden sm:inline-flex items-center gap-1.5 border border-[#E8E2D6]/15 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
              >
                <Search size={12} />
                Find Registration
              </button>
            )}

            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-2 border border-[#E8E2D6]/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/60 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
            >
              <ArrowLeft
                size={13}
                className="transition-transform group-hover:-translate-x-1"
              />
              Back
            </button>
          </div>
        </header>

        {/* =================================================
            MAIN CONTENT
           ================================================= */}
        <main className="mx-auto w-full max-w-[1180px] px-5 py-8 md:px-8 md:py-14">
          {/* VIEW: TICKET PASS */}
          {mode === "ticket" && activeTicket && (
            <RegistrationTicket
              record={activeTicket}
              onNewRegistration={() => {
                setRegistrationType("");
                setForm({ teamName: "" });
                setMembers(Array.from({ length: MAX_GROUP_SIZE }, emptyMember));
                setStep(1);
                setMode("register");
              }}
              onLookupAnother={() => setMode("lookup")}
            />
          )}

          {/* VIEW: LOOKUP */}
          {mode === "lookup" && (
            <LookupView
              onFound={(rec) => {
                setActiveTicket(rec);
                setMode("ticket");
                scrollTop();
              }}
              onCancel={() => setMode("register")}
            />
          )}

          {/* VIEW: REGISTER */}
          {mode === "register" && (
            <>
              {/* Top Banner Notice if returning user */}
              {activeTicket && (
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#8B7CF6]/30 bg-[#8B7CF6]/10 px-5 py-3 text-xs text-[#E8E2D6]">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#8B7CF6]" />
                    <span>
                      Welcome back! Team <strong>{activeTicket.teamName}</strong> is registered under ID <strong>{activeTicket.registrationId}</strong>.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode("ticket")}
                    className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7CF6] underline underline-offset-4 hover:brightness-125"
                  >
                    View My Pass &rarr;
                  </button>
                </div>
              )}

              {/* Title Section */}
              <section className="mb-10 max-w-3xl">
                <div className="flex items-center justify-between gap-4">
                  <TechnicalLabel>
                    REGISTRATION // SYSTEM 01
                  </TechnicalLabel>

                  <button
                    type="button"
                    onClick={() => setMode("lookup")}
                    className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C4642E] underline underline-offset-4 hover:brightness-125 sm:hidden"
                  >
                    Already Registered?
                  </button>
                </div>

                <div className="mt-5">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9] tracking-[-0.04em]">
                    Enter <span className="text-[#8B7CF6]">BvB</span>
                  </h1>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="h-px w-10 bg-[#C4642E]" />
                    <p className="max-w-xl text-xs sm:text-sm leading-6 text-[#E8E2D6]/45">
                      No upfront payment required. Enter your team profile, lock in your format, and claim your verified BvB Registration Pass.
                    </p>
                  </div>
                </div>
              </section>

              {/* Step indicator */}
              <StepIndicator currentStep={step} />

              {/* Main Step Panel */}
              <Panel>
                <div className="grid lg:grid-cols-[220px_1fr]">
                  {/* Sidebar */}
                  <aside className="border-b border-[#E8E2D6]/10 p-6 lg:border-b-0 lg:border-r lg:p-7">
                    <TechnicalLabel accent={step === 2 ? "orange" : "purple"}>
                      Current module
                    </TechnicalLabel>

                    <div className="mt-5">
                      <div className="font-mono text-4xl font-bold text-[#E8E2D6]/20">
                        {String(step).padStart(2, "0")}
                      </div>

                      <h2 className="mt-2 text-lg font-black uppercase tracking-[0.04em] text-[#E8E2D6]">
                        {STEPS[step - 1].title}
                      </h2>

                      <p className="mt-3 text-xs leading-6 text-[#E8E2D6]/35">
                        {step === 1 && "Select whether your team will compete as DUO or TRIO."}
                        {step === 2 && "Enter your team name, captain credentials, and roster details."}
                        {step === 3 && "Review all participants before finalizing and locking your registration."}
                      </p>
                    </div>

                    <div className="mt-8 hidden lg:block">
                      <div className="space-y-3">
                        {STEPS.map((item) => {
                          const active = item.id === step;
                          const complete = item.id < step;

                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <div
                                className="flex h-6 w-6 items-center justify-center border text-[8px] font-bold"
                                style={{
                                  borderColor:
                                    active || complete
                                      ? item.id === 2
                                        ? `${COLORS.orange}88`
                                        : `${COLORS.purple}88`
                                      : "rgba(232,226,214,0.1)",
                                  color:
                                    active || complete
                                      ? item.id === 2
                                        ? COLORS.orange
                                        : COLORS.purple
                                      : "rgba(232,226,214,0.3)",
                                }}
                              >
                                {complete ? <Check size={11} /> : item.code}
                              </div>
                              <span
                                className={cx(
                                  "text-[8px] font-bold uppercase tracking-[0.16em]",
                                  active ? "text-[#E8E2D6]" : "text-[#E8E2D6]/25"
                                )}
                              >
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </aside>

                  {/* Form Step Body */}
                  <section className="min-w-0 p-5 sm:p-7 md:p-9">
                    <AnimatePresence mode="wait">
                      {/* STEP 1: FORMAT */}
                      {step === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TechnicalLabel>Step 01 // Entry format</TechnicalLabel>
                          <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.02em] sm:text-3xl">
                            Choose your team format
                          </h2>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-[#E8E2D6]/40">
                            Select whether your BvB entry will have two or three participants.
                          </p>

                          <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <SelectionOption
                              icon={Users}
                              eyebrow="01 // Duo"
                              title="DUO"
                              description="Build a two-person BvB team."
                              active={registrationType === "duo"}
                              onClick={() => {
                                setRegistrationType("duo");
                                setErrors({});
                              }}
                            />
                            <SelectionOption
                              icon={Users}
                              eyebrow="02 // Trio"
                              title="TRIO"
                              description="Build a three-person BvB team."
                              active={registrationType === "trio"}
                              accent="orange"
                              onClick={() => {
                                setRegistrationType("trio");
                                setErrors({});
                              }}
                            />
                          </div>

                          {errors.registrationType && (
                            <div data-error="true" className="mt-4 text-xs text-[#C4642E]">
                              {errors.registrationType}
                            </div>
                          )}

                          <div className="mt-10 flex items-center justify-between border-t border-[#E8E2D6]/10 pt-6">
                            <button
                              type="button"
                              onClick={onBack}
                              className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6]/40 transition hover:text-[#E8E2D6]"
                            >
                              Exit
                            </button>

                            <button
                              type="button"
                              onClick={goNext}
                              className="inline-flex items-center gap-2 bg-[#8B7CF6] px-6 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#1A1410] transition hover:brightness-110"
                            >
                              Continue to details
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: DETAILS */}
                      {step === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TechnicalLabel accent="orange">
                            Step 02 // Team & Members
                          </TechnicalLabel>
                          <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.02em] sm:text-3xl">
                            Build your profile
                          </h2>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-[#E8E2D6]/40">
                            Configure your team name and enter details for all {memberCount} members. Member 01 acts as the Team Captain & primary contact.
                          </p>

                          <div className="mt-7 max-w-md">
                            <Field
                              label="Team Name"
                              value={form.teamName}
                              onChange={(v) => updateForm("teamName", v)}
                              placeholder="Enter your team name"
                              error={errors.teamName}
                            />
                          </div>

                          <div className="mt-8 space-y-4">
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
                              className="inline-flex items-center gap-2 border border-[#E8E2D6]/15 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
                            >
                              <ArrowLeft size={12} />
                              Back
                            </button>

                            <button
                              type="button"
                              onClick={goNext}
                              className="inline-flex items-center gap-2 bg-[#8B7CF6] px-6 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#1A1410] transition hover:brightness-110"
                            >
                              Review & Confirm
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: CONFIRM */}
                      {step === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TechnicalLabel>Step 03 // Final Review</TechnicalLabel>
                          <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.02em] sm:text-3xl">
                            Review & Enter System
                          </h2>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-[#E8E2D6]/40">
                            Verify your team details. Once submitted, your Registration ID will be assigned and saved to your device.
                          </p>

                          {/* Quick Summary Card */}
                          <div className="mt-6 border border-[#8B7CF6]/30 bg-[#0F0B09]/60 p-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                              <div>
                                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/40">
                                  TEAM NAME
                                </div>
                                <div className="mt-1 text-base font-bold text-[#E8E2D6]">
                                  {form.teamName || "—"}
                                </div>
                              </div>
                              <div>
                                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/40">
                                  FORMAT
                                </div>
                                <div className="mt-1 font-mono text-base font-bold text-[#8B7CF6]">
                                  {teamTypeLabel} ({memberCount} PARTICIPANTS)
                                </div>
                              </div>
                              <div>
                                <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#E8E2D6]/40">
                                  FEE STATUS
                                </div>
                                <div className="mt-1 font-mono text-base font-bold text-[#34D399]">
                                  FREE ENTRY (WAIVED)
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Members List */}
                          <div className="mt-6 space-y-3">
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
                            <div className="mt-6 border border-[#C4642E]/30 bg-[#C4642E]/10 p-4 text-xs text-[#E8E2D6]">
                              <span className="font-bold text-[#C4642E]">Submission Error: </span>
                              {errors.submit}
                            </div>
                          )}

                          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D6]/10 pt-6">
                            <button
                              type="button"
                              onClick={goBack}
                              disabled={submitting}
                              className="inline-flex items-center gap-2 border border-[#E8E2D6]/15 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E8E2D6]/70 transition hover:border-[#8B7CF6]/50 hover:text-[#E8E2D6]"
                            >
                              <ArrowLeft size={12} />
                              Back to Details
                            </button>

                            <button
                              type="button"
                              onClick={handleSubmit}
                              disabled={submitting}
                              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-[#8B7CF6] px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#1A1410] transition hover:brightness-110 disabled:opacity-50"
                            >
                              {submitting ? (
                                <>
                                  <RefreshCw size={14} className="animate-spin" />
                                  RECORDING ENTRY...
                                </>
                              ) : (
                                <>
                                  <Zap size={14} />
                                  COMPLETE REGISTRATION
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </div>
              </Panel>
            </>
          )}
        </main>
      </div>
    </div>
  );
}