import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentDetail } from "./agent-detail";
import { agents, getAgent } from "@/data/agents";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = getAgent(params.id);
  return { title: agent?.name ?? "Agent" };
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = getAgent(params.id);
  if (!agent) notFound();
  return <AgentDetail agent={agent} />;
}
