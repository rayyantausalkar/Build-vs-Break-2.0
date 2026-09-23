import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1A1410] px-4 text-center text-[#E8E2D6]">
      <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-6xl">404 // Not Found</h2>
      <p className="mt-4 text-sm text-[#E8E2D6]/60">The sector or coordinates you requested do not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block bg-[#8B7CF6] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#1A1410] hover:bg-[#E8E2D6]"
      >
        Return to Grid
      </Link>
    </div>
  );
}
