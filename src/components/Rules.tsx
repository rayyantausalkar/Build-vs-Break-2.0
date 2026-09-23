"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ShieldAlert, Terminal, Cpu, Zap } from "lucide-react";

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const RULES = [
  {
    num: "01",
    icon: Terminal,
    title: "Build From Scratch",
    desc: "All source code and architectural implementations must be authored during the hackathon period. Pre-built templates or proprietary boilerplate are strictly prohibited.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Break To Validate",
    desc: "Every build undergoes intense verification phases. Systems must pass stress tests and security constraints designed to test resilience under extreme conditions.",
  },
  {
    num: "03",
    icon: Cpu,
    title: "Open Technology Stack",
    desc: "Teams may leverage open-source libraries, publicly available AI models, and standardized developer frameworks. Full attribution of third-party tooling is required.",
  },
  {
    num: "04",
    icon: ShieldAlert,
    title: "Integrity & Fair Play",
    desc: "Collaborate constructively. Unethical exploitation or intentional interference with rival infrastructures results in immediate disqualification.",
  },
];

export default function Rules() {
  const reduced = Boolean(useReducedMotion());

  return (
    <section id="rules" className="relative py-24 sm:py-32 overflow-hidden border-t border-[#E8E2D6]/10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rotate-45 bg-[#C4642E]" />
            <span className={`${MONO} text-xs uppercase tracking-[0.25em] text-[#C4642E]`}>
              03 // DIRECTIVES
            </span>
          </div>
          <h2
            className={`${DISPLAY} text-3xl font-bold uppercase tracking-tight text-[#E8E2D6] sm:text-5xl`}
          >
            Rules of <span className="text-[#8B7CF6]">Engagement</span>
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
            System integrity is non-negotiable. Review the foundational guidelines before deploying into the arena.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={rule.num}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between border border-[#E8E2D6]/10 bg-[#1F1729]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#8B7CF6]/40 hover:bg-[#1F1729]/70"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E8E2D6]/10 pb-4">
                    <span className={`${MONO} text-xs font-semibold tracking-widest text-[#8B7CF6]`}>
                      RULE {rule.num}
                    </span>
                    <Icon className="h-5 w-5 text-[#C4642E] transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className={`${DISPLAY} mt-5 text-lg font-bold text-[#E8E2D6]`}>
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#E8E2D6]/60">
                    {rule.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[#8B7CF6]/60" />
                  <span className={`${MONO} text-[9px] uppercase tracking-wider text-[#E8E2D6]/40`}>
                    ENFORCED // 2026
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
