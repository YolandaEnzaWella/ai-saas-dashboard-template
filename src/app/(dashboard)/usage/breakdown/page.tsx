import type { Metadata } from "next";
import { BreakdownView } from "./breakdown-view";

export const metadata: Metadata = { title: "Usage breakdown" };

export default function BreakdownPage() {
  return <BreakdownView />;
}
