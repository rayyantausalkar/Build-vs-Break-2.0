"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";

const DISPLAY =
  "font-[family-name:Space_Grotesk,Sora,ui-sans-serif,system-ui,sans-serif]";
const MONO =
  "font-[family-name:JetBrains_Mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden border-t border-[#E8E2D6]/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rotate-45 bg-[#C4642E]" />
            <span className={`${MONO} text-xs uppercase tracking-[0.25em] text-[#C4642E]`}>
              05 // TRANSMISSIONS
            </span>
          </div>
          <h2
            className={`${DISPLAY} text-3xl font-bold uppercase tracking-tight text-[#E8E2D6] sm:text-5xl`}
          >
            Initiate <span className="text-[#8B7CF6]">Contact</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#E8E2D6]/65 sm:text-base">
            Questions regarding sponsorships, mentors, or special requests? Reach out to the organizing core.
          </p>
        </div>

        <div className="mt-12 border border-[#E8E2D6]/10 bg-[#1F1729]/30 p-6 sm:p-10 backdrop-blur-sm">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8B7CF6]/20 text-[#8B7CF6]">
                <Send className="h-6 w-6" />
              </div>
              <h3 className={`${DISPLAY} text-2xl font-bold text-[#E8E2D6]`}>Signal Received</h3>
              <p className="mt-2 text-sm text-[#E8E2D6]/60">Our dispatch team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={`${MONO} block text-xs uppercase tracking-wider text-[#E8E2D6]/70 mb-2`}>
                    Callsign / Name
                  </label>
                  <input
                    id="name"
                    required
                    type="text"
                    placeholder="Ada Lovelace"
                    className="w-full border border-[#E8E2D6]/15 bg-[#1A1410] px-4 py-3 text-sm text-[#E8E2D6] placeholder-[#E8E2D6]/30 outline-none transition-colors focus:border-[#8B7CF6]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`${MONO} block text-xs uppercase tracking-wider text-[#E8E2D6]/70 mb-2`}>
                    Comms / Email
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    placeholder="ada@domain.org"
                    className="w-full border border-[#E8E2D6]/15 bg-[#1A1410] px-4 py-3 text-sm text-[#E8E2D6] placeholder-[#E8E2D6]/30 outline-none transition-colors focus:border-[#8B7CF6]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className={`${MONO} block text-xs uppercase tracking-wider text-[#E8E2D6]/70 mb-2`}>
                  Transmission / Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Detail your inquiry or system proposal..."
                  className="w-full border border-[#E8E2D6]/15 bg-[#1A1410] px-4 py-3 text-sm text-[#E8E2D6] placeholder-[#E8E2D6]/30 outline-none transition-colors focus:border-[#8B7CF6]"
                />
              </div>
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-[#8B7CF6] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1410] transition-colors duration-300 hover:bg-[#E8E2D6]"
              >
                <span>Dispatch Signal</span>
                <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
