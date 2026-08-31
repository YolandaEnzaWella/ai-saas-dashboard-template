import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { ChatWorkspace } from "../chat-workspace";
import { conversations, getConversation } from "@/data/conversations";

export function generateStaticParams() {
  return conversations.map((conversation) => ({ id: conversation.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const conversation = getConversation(params.id);
  return { title: conversation?.title ?? "Conversation" };
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const conversation = getConversation(params.id);
  if (!conversation) notFound();

  return (
    <>
      <PageHeader
        title={conversation.title}
        description={`${conversation.agentName} · ${conversation.messageCount} messages`}
        breadcrumbs={[{ label: "AI Chat", href: "/chat" }, { label: conversation.title }]}
      />
      <ChatWorkspace conversationId={conversation.id} />
    </>
  );
}
