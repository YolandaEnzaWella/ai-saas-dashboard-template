import type { Metadata } from "next";
import { UsageOverview } from "./usage-overview";

export const metadata: Metadata = { title: "Usage" };

export default function UsagePage() {
  return <UsageOverview />;
}
