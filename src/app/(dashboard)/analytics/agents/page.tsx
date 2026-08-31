import type { Metadata } from "next";
import { AgentAnalyticsView } from "./agent-analytics-view";

export const metadata: Metadata = { title: "Agent performance" };

export default function AgentAnalyticsPage() {
  return <AgentAnalyticsView />;
}
