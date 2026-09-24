import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BvB - Build vs Break",
  description: "View and manage your Build vs Break (BvB) 2026 hackathon team registration and official pass.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
