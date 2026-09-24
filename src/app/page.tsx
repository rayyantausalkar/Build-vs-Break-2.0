"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Rules from "@/components/Rules";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GlobalSpotlight from "@/components/GlobalSpotlight";

export default function Home() {
  const handleRegisterClick = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    const el = document.getElementById("contact");
    if (el) {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.15 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1A1410] text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white">
      <GlobalSpotlight />
      <Navbar onRegisterClick={handleRegisterClick} />

      <main>
        <Hero onRegisterClick={handleRegisterClick} />
        <About />
        <Timeline />
        <Rules />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
