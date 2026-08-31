import type { Metadata } from "next";
import { ReportsView } from "./reports-view";

export const metadata: Metadata = { title: "Usage reports" };

export default function ReportsPage() {
  return <ReportsView />;
}
