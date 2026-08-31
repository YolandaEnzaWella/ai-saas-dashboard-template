import type { Metadata } from "next";
import { PromptEditor } from "../prompt-editor";

export const metadata: Metadata = { title: "New prompt" };

export default function NewPromptPage() {
  return <PromptEditor />;
}
