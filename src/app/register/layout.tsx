import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | BvB - Build vs Break",
  description: "Register your team for Build vs Break (BvB) 2026 hackathon. Choose Duo or Trio team formats and secure your entry.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
