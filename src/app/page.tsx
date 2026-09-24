"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Prizes from "@/components/Prizes";
import Rules from "@/components/Rules";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GlobalSpotlight from "@/components/GlobalSpotlight";

export default function Home() {
  const router = useRouter();

  const handleRegisterClick = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    router.push("/register");
  };

  return (
    <div className="relative min-h-screen bg-[#1A1410] text-[#E8E2D6] selection:bg-[#8B7CF6]/30 selection:text-white">
      <GlobalSpotlight />
      <Navbar registerHref="/register" onRegisterClick={handleRegisterClick} />

      <main>
        <Hero registerHref="/register" onRegisterClick={handleRegisterClick} />
        <About />
        <Timeline />
        <Prizes />
        <Rules />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
