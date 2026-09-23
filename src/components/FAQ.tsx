"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

const FAQS = [
  {
    q: "Who is eligible to participate in BvB?",
    a: "Anyone with an itch for building and breaking systems: students, professional developers, security researchers, and designers. Teams can have between 1 to 4 members.",
  },
  {
    q: "Is BvB remote or in-person?",
    a: "BvB is a hybrid format. Participants can either attend our physical arena spaces or connect through our real-time collaborative platform online.",
  },
  {
    q: "What track categories are available?",
    a: "Tracks focus on Resilient Systems, Offensive/Defensive Cybersecurity, AI Agent Infrastructure, and Autonomous Protocols. Detailed problem statements drop during Opening Ceremony.",
  },
  {
    q: "How are submissions evaluated?",
    a: "Scoring is divided evenly between Technical Complexity, Architectural Elegance, System Stress-Testing Resilience, and Practical Impact.",
  },
  {
    q: "What are the registration fees?",
    a: "Admission is 100% free. Selected teams receive meal stipends, compute credits, and access to industry mentors throughout the event.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const reduced = Boolean(useReducedMotion());

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden border-t border-[#E8E2D6]/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rotate-45 bg-[#8B7CF6]" />
            <span className={`${MONO} text-xs uppercase tracking-[0.25em] text-[#8B7CF6]`}>
              04 // INQUIRIES
            </span>
          </div>
          <h2
            className={`${DISPLAY} text-3xl font-bold uppercase tracking-tight text-[#E8E2D6] sm:text-5xl`}
          >
            Frequently Asked <span className="text-[#C4642E]">Questions</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
            Everything you need to know about preparing for the event.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden border border-[#E8E2D6]/10 bg-[#1F1729]/30 transition-colors duration-200 hover:border-[#8B7CF6]/40"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#8B7CF6]"
                  aria-expanded={isOpen}
                >
                  <span className={`${DISPLAY} text-base sm:text-lg font-medium text-[#E8E2D6]`}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`ml-4 h-5 w-5 shrink-0 text-[#C4642E] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-[#E8E2D6]/5 px-5 pb-5 pt-3 text-sm leading-relaxed text-[#E8E2D6]/70">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
