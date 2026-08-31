import type { Metadata } from "next";
import { DashboardView } from "../dashboard-view";

export const metadata: Metadata = { title: "Dashboard — compact" };

/** Compact dashboard variant (FR-DSH-07). */
export default function CompactDashboardPage() {
  return <DashboardView density="compact" />;
}
