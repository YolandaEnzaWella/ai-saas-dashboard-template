import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ChatWorkspace } from "./chat-workspace";

export const metadata: Metadata = { title: "AI Chat" };

export default function ChatPage() {
  return (
    <>
      <PageHeader
        title="AI Chat"
        description="Talk to your agents, search past threads and switch models mid-conversation."
      />
      <ChatWorkspace />
    </>
  );
}
