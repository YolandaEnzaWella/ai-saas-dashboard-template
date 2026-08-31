import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentForm } from "../../agent-form";
import { agents, getAgent } from "@/data/agents";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: `Edit ${getAgent(params.id)?.name ?? "agent"}` };
}

export default function EditAgentPage({ params }: { params: { id: string } }) {
  const agent = getAgent(params.id);
  if (!agent) notFound();
  return <AgentForm agent={agent} />;
}
