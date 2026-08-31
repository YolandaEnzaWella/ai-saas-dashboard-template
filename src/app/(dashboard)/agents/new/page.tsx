import type { Metadata } from "next";
import { AgentForm } from "../agent-form";

export const metadata: Metadata = { title: "Create agent" };

export default function NewAgentPage() {
  return <AgentForm />;
}
