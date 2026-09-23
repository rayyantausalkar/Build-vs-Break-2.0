"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#E8E2D6]/10 bg-[#1A1410] py-12 text-[#E8E2D6]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="relative block h-[22px] w-[20px] shrink-0"
            >
              <span className="absolute inset-0 bg-[#E8E2D6] [clip-path:polygon(50%_0,100%_25%,50%_50%,0_25%)]" />
              <span className="absolute inset-0 bg-[#8B7CF6] [clip-path:polygon(0_25%,50%_50%,50%_100%,0_75%)]" />
              <span className="absolute inset-0 bg-[#C4642E] [clip-path:polygon(50%_50%,100%_25%,100%_75%,50%_100%)]" />
            </span>
            <span className={`${DISPLAY} text-lg font-bold tracking-tight text-[#E8E2D6]`}>
              B<span className="text-[#C4642E]">v</span>B
            </span>
            <span className="text-xs text-[#E8E2D6]/40">|</span>
            <span className={`${MONO} text-[10px] uppercase tracking-wider text-[#E8E2D6]/50`}>
              BUILD VS BREAK // 2026
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className={`${MONO} text-[11px] text-[#E8E2D6]/40`}>
              Constructed with Precision
            </span>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group flex h-9 w-9 items-center justify-center border border-[#E8E2D6]/15 text-[#E8E2D6] transition-colors hover:border-[#8B7CF6] hover:text-[#8B7CF6]"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
