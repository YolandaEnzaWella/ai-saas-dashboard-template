import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PromptEditor } from "../prompt-editor";
import { getPrompt, prompts } from "@/data/prompts";

export function generateStaticParams() {
  return prompts.map((prompt) => ({ id: prompt.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: getPrompt(params.id)?.title ?? "Prompt" };
}

export default function PromptPage({ params }: { params: { id: string } }) {
  const prompt = getPrompt(params.id);
  if (!prompt) notFound();
  return <PromptEditor prompt={prompt} />;
}
