"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Register from "@/components/Register";

export default function RegisterPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return <Register onBack={handleBack} />;
}
