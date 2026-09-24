"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "motion/react";
import { ArrowUpRight, Ticket } from "lucide-react";
import { useRegistration } from "@/lib/useRegistration";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;
const NAV_OFFSET = 88;

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const LINKS = [
  { id: "about", label: "ABOUT" },
  { id: "timeline", label: "TIMELINE" },
  { id: "prizes", label: "PRIZES" },
  { id: "rules", label: "RULES" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "CONTACT" },
];

const NAV_STATES = {
  top: {
    height: 64,
    backgroundColor: "rgba(26,20,16,0.30)",
    borderColor: "rgba(232,226,214,0.08)",
    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
  },
  scrolled: {
    height: 54,
    backgroundColor: "rgba(26,20,16,0.86)",
    borderColor: "rgba(232,226,214,0.16)",
    boxShadow:
      "0 14px 40px -12px rgba(0,0,0,0.6), 0 1px 0 0 rgba(139,124,246,0.08) inset",
  },
};

const SPRING_SNAPPY = { type: "spring", stiffness: 340, damping: 26, mass: 0.6 } as const;

const FOCUSABLE = "a[href], button:not([disabled])";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function scrollToId(id: string, reduced: boolean) {
  if (typeof window !== "undefined" && window.__lenis && !reduced) {
    if (id === "home") {
      window.__lenis.scrollTo(0, { duration: 1.15 });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    window.__lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.15 });
    return;
  }

  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top: Math.max(top, 0), behavior });
}

function isPlainClick(e: React.MouseEvent) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

/** Compact BvB text mark with a tiny isometric-cube accent from the logo. */
function BrandMark({ onClick }: { onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label="BvB — Build vs Break, back to top"
      className="group inline-flex items-center gap-3 justify-self-start rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E2D6]"
    >
      <span
        aria-hidden="true"
        className="relative block h-[26px] w-[23px] shrink-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:rotate-[8deg] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      >
        <span className="absolute inset-0 bg-[#E8E2D6] [clip-path:polygon(50%_0,100%_25%,50%_50%,0_25%)]" />
        <span className="absolute inset-0 bg-[#8B7CF6] [clip-path:polygon(0_25%,50%_50%,50%_100%,0_75%)]" />
        <span className="absolute inset-0 bg-[#C4642E] [clip-path:polygon(50%_50%,100%_25%,100%_75%,50%_100%)]" />
        {/* orbiting corner tick — a faint "system reference" mark that
            appears and rotates in as the mark is engaged */}
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 h-1 w-1 rotate-45 scale-0 bg-[#E8E2D6] opacity-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-70 motion-reduce:hidden"
        />
      </span>

      <span
        className={`${DISPLAY} relative text-[22px] font-bold leading-none tracking-[-0.03em] text-[#E8E2D6]`}
      >
        B<span className="text-[#C4642E]">v</span>B
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#8B7CF6,#C4642E)] transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />
      </span>

      <span
        aria-hidden="true"
        className="hidden h-4 w-px bg-[#E8E2D6]/15 xl:block"
      />
      <span
        aria-hidden="true"
        className={`${MONO} hidden text-[9px] uppercase tracking-[0.28em] text-[#E8E2D6]/40 transition-colors duration-300 group-hover:text-[#E8E2D6]/65 xl:block`}
      >
        Build vs Break
      </span>
    </a>
  );
}

interface RegisterButtonProps {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  size?: "sm" | "lg";
  children: React.ReactNode;
}

function RegisterButton({ href, onClick, size = "sm", children }: RegisterButtonProps) {
  const large = size === "lg";
  return (
    <span
      className={`group relative transition-[filter,translate] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:drop-shadow-[0_0_16px_rgba(139,124,246,0.55)] focus-within:drop-shadow-[0_0_6px_#E8E2D6] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        large ? "block w-full" : "inline-block"
      }`}
    >
      <a
        href={href}
        onClick={onClick}
        className={`relative flex items-center justify-center gap-2.5 overflow-hidden bg-[#8B7CF6] font-bold uppercase text-[#1A1410] outline-none transition-colors duration-300 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] focus-visible:bg-[#E8E2D6] ${
          large
            ? "min-h-14 px-7 py-4 text-[13px] tracking-[0.2em]"
            : "min-h-10 px-5 py-2.5 text-[11px] tracking-[0.2em]"
        }`}
      >
        {/* fill sweep on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-[#C4642E] transition-transform duration-500 ease-out group-hover:translate-x-0 motion-reduce:transition-none"
        />
        {/* thin leading edge that arrives a beat ahead of the fill,
            reading as a scan line rather than a flat wipe */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px -translate-x-full bg-[#E8E2D6]/70 transition-transform duration-500 ease-out delay-[40ms] group-hover:translate-x-[calc(100%+0px)] motion-reduce:hidden"
        />
        <span className="relative">{children}</span>
        <ArrowUpRight
          aria-hidden="true"
          className="relative h-4 w-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

export interface NavbarProps {
  registerHref?: string;
  onRegisterClick?: (e?: React.MouseEvent) => void;
}

export default function Navbar({ registerHref = "#register", onRegisterClick }: NavbarProps) {
  const { registration, isRegistered } = useRegistration();
  const reduced = Boolean(useReducedMotion());
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef<string | null>(null);

  const registerIsHash = registerHref.startsWith("#");
  const registerId = registerIsHash ? registerHref.slice(1) : "";

  /* Scroll state */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  useEffect(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  /* Active section highlight */
  useEffect(() => {
    const ids = ["home", ...LINKS.map((l) => l.id)];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "home" ? "" : entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* Lock page scroll while the menu is open */
  useEffect(() => {
    if (!open) return undefined;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  /* Close the menu if the viewport grows to desktop */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Escape to close + focus trap + initial focus */
  useEffect(() => {
    if (!open) return undefined;

    const focusTimer = window.setTimeout(() => {
      overlayRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    }, 80);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const scopes = [headerRef.current, overlayRef.current].filter(Boolean) as HTMLElement[];
      const focusables = scopes
        .flatMap((scope) => Array.from(scope.querySelectorAll<HTMLElement>(FOCUSABLE)))
        .filter((el) => el.getClientRects().length > 0);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Navigation handlers */
  const go = (id: string, e?: React.MouseEvent<HTMLAnchorElement>, fromMenu = false) => {
    if (e) {
      if (!isPlainClick(e)) return;
      e.preventDefault();
    }
    if (fromMenu) {
      pendingRef.current = id;
      setOpen(false);
    } else {
      scrollToId(id, reduced);
    }
  };

  const handleRegister = (e: React.MouseEvent<HTMLAnchorElement>, fromMenu = false) => {
    if (isRegistered) {
      if (e && isPlainClick(e)) e.preventDefault();
      if (fromMenu) setOpen(false);
      window.location.href = "/dashboard";
      return;
    }
    if (onRegisterClick) {
      if (e && isPlainClick(e)) e.preventDefault();
      if (fromMenu) setOpen(false);
      onRegisterClick(e);
      return;
    }
    if (registerIsHash) {
      go(registerId, e, fromMenu);
    } else if (fromMenu) {
      setOpen(false);
    }
  };

  const handleExitComplete = () => {
    if (pendingRef.current) {
      scrollToId(pendingRef.current, reduced);
      pendingRef.current = null;
    }
  };

  /* Overlay variants */
  const overlayVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: {
          clipPath: "inset(0 0 100% 0)",
          transition: { duration: 0.45, ease: EASE },
        },
        show: {
          clipPath: "inset(0 0 0% 0)",
          transition: {
            duration: 0.6,
            ease: EASE,
            staggerChildren: 0.07,
            delayChildren: 0.22,
          },
        },
      };

  const itemVariants: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26, transition: { duration: 0.2 } },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 220, damping: 22 },
        },
      };

  const solid = scrolled || open;

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={reduced ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.3 }
            : { type: "spring", stiffness: 120, damping: 18, delay: 0.5 }
        }
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8"
      >
        <motion.nav
          aria-label="Primary"
          initial="top"
          animate={solid ? "scrolled" : "top"}
          variants={NAV_STATES}
          transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
          className={`relative mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center rounded-xl border px-3 transition-[backdrop-filter] duration-500 sm:px-4 lg:grid-cols-[1fr_auto_1fr] lg:px-5 ${
            solid ? "backdrop-blur-md sm:backdrop-blur-xl" : "backdrop-blur-sm sm:backdrop-blur-md"
          }`}
        >
          {/* Brand */}
          <BrandMark onClick={(e) => go("home", e)} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => go(link.id, e)}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative block rounded-md px-4 py-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8E2D6] ${DISPLAY} ${
                      isActive
                        ? "text-[#E8E2D6]"
                        : "text-[#E8E2D6]/65 hover:text-[#E8E2D6]"
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -top-0.5 flex justify-center"
                      >
                        <motion.span
                          layoutId="nav-active-diamond"
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 28 }
                          }
                          className="h-1.5 w-1.5 rotate-45 bg-[#C4642E] shadow-[0_0_8px_rgba(196,100,46,0.7)]"
                        />
                      </span>
                    )}
                    {/* tiny corner tick, only on non-active links — reads as a
                        "select" reticle rather than another glow */}
                    {!isActive && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1 top-1 h-1.5 w-1.5 -translate-x-0.5 -translate-y-0.5 rotate-45 scale-0 border border-[#8B7CF6]/70 opacity-0 transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 motion-reduce:hidden"
                      />
                    )}
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0.5 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,#8B7CF6,#C4642E)] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop register */}
          <div className="hidden justify-self-end lg:flex lg:items-center lg:gap-3">
            {!isRegistered && (
              <a
                href="/dashboard"
                className={`${MONO} text-[10px] tracking-[0.16em] uppercase text-[#E8E2D6]/40 hover:text-[#E8E2D6] transition-colors`}
              >
                Find Entry
              </a>
            )}

            <RegisterButton
              href={isRegistered ? "/dashboard" : registerHref}
              onClick={(e) => handleRegister(e)}
            >
              {isRegistered ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B7CF6] shadow-[0_0_6px_#8B7CF6]" />
                  DASHBOARD
                </span>
              ) : (
                "REGISTER"
              )}
            </RegisterButton>
          </div>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="group relative flex h-11 w-11 items-center justify-center rounded-md border border-[#E8E2D6]/15 text-[#E8E2D6] transition-colors duration-300 hover:border-[#8B7CF6]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8E2D6] lg:hidden"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-1 h-1.5 w-1.5 rotate-45 scale-0 bg-[#8B7CF6] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-80 motion-reduce:hidden"
            />
            <span aria-hidden="true" className="relative block h-4 w-5">
              <motion.span
                animate={open ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : SPRING_SNAPPY
                }
                className="absolute left-0 top-0 block h-0.5 w-full bg-current"
              />
              <motion.span
                animate={
                  open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
                className="absolute left-0 top-[7px] block h-0.5 w-full bg-[#C4642E]"
              />
              <motion.span
                animate={open ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : SPRING_SNAPPY
                }
                className="absolute left-0 top-[14px] block h-0.5 w-full bg-current"
              />
            </span>
          </button>

          {/* Bottom accent hairline */}
          <motion.span
            aria-hidden="true"
            animate={{ opacity: solid ? 0.7 : 0.25 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-[linear-gradient(90deg,transparent,#8B7CF6,#C4642E,transparent)]"
          />
        </motion.nav>
      </motion.header>

      {/* -------------------------------------------------------- */}
      {/* Fullscreen mobile overlay                                 */}
      {/* -------------------------------------------------------- */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            data-lenis-prevent
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-[#1A1410] px-5 pb-8 pt-28 sm:px-8 lg:hidden"
          >
            {/* Decoration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -left-[20%] -top-[10%] h-[60%] w-[90%] bg-[radial-gradient(closest-side,rgba(139,124,246,0.18),transparent)]" />
              <div className="absolute -bottom-[10%] -right-[20%] h-[60%] w-[90%] bg-[radial-gradient(closest-side,rgba(196,100,46,0.16),transparent)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(232,226,214,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(232,226,214,0.035)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
              <span
                className={`${DISPLAY} absolute -bottom-6 -right-4 select-none text-[38vw] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(139,124,246,0.2)]`}
              >
                BvB
              </span>
            </div>

            <nav aria-label="Mobile primary" className="relative">
              <ul className="flex flex-col">
                {LINKS.map((link, i) => {
                  const isActive = active === link.id;
                  return (
                    <motion.li key={link.id} variants={itemVariants}>
                      <a
                        href={`#${link.id}`}
                        onClick={(e) => go(link.id, e, true)}
                        aria-current={isActive ? "true" : undefined}
                        className="group relative flex items-center gap-4 border-b border-[#E8E2D6]/10 py-3.5 outline-none focus-visible:bg-[#E8E2D6]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8E2D6]"
                      >
                        <span
                          className={`${MONO} w-6 text-[11px] tracking-[0.2em] text-[#8B7CF6] transition-transform duration-300 group-hover:translate-x-1`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`${DISPLAY} relative text-[clamp(1.75rem,8vw,3rem)] font-bold uppercase leading-none tracking-[-0.02em] transition-[color,transform] duration-300 group-hover:translate-x-1 ${
                            isActive
                              ? "text-[#C4642E]"
                              : "text-[#E8E2D6] group-hover:text-[#8B7CF6]"
                          }`}
                        >
                          {link.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-auto h-5 w-5 text-[#C4642E] opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div variants={itemVariants} className="relative mt-8 space-y-3">
              <RegisterButton
                size="lg"
                href={isRegistered ? "/dashboard" : registerHref}
                onClick={(e) => handleRegister(e, true)}
              >
                {isRegistered ? "VIEW DASHBOARD" : "REGISTER NOW"}
              </RegisterButton>

              {!isRegistered && (
                <div className="text-center">
                  <a
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`${MONO} text-[10px] tracking-[0.18em] uppercase text-[#E8E2D6]/50 hover:text-[#E8E2D6]`}
                  >
                    Already registered? Find entry &rarr;
                  </a>
                </div>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative mt-auto flex items-center justify-between gap-4 pt-10"
            >
              <span
                className={`${MONO} text-[10px] uppercase tracking-[0.22em] text-[#E8E2D6]/45`}
              >
                BVB // SYSTEM 01
              </span>
              <span
                className={`${MONO} text-[10px] uppercase tracking-[0.22em] text-[#E8E2D6]/45`}
              >
                BVB // 2026
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
