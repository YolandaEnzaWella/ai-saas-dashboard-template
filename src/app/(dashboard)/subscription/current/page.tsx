import type { Metadata } from "next";
import { CurrentPlanView } from "./current-plan-view";

export const metadata: Metadata = { title: "Current plan" };

export default function CurrentPlanPage() {
  return <CurrentPlanView />;
}
