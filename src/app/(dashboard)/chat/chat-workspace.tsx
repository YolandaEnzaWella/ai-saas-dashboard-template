"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Menu,
  Paperclip,
  Pin,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Markdown } from "@/lib/markdown";
import { agentModels } from "@/data/agents";
import { conversations as seedConversations } from "@/data/conversations";
import type { Conversation, Message } from "@/lib/types";
import { cn, estimateTokens } from "@/lib/utils";
import { currentUser } from "@/data/users";
import { RelativeTime } from "@/components/ui/relative-time";

const CANNED_REPLY = `Good question — here is how I would approach it.

1. Start from the smallest reproducible case so you can tell signal from noise.
2. Instrument the boundary rather than the internals; most surprises live at the edges.
3. Only then optimize, and re-measure after every change.

If you paste the failing input I can walk through it line by line.`;

export function ChatWorkspace({ conversationId }: { conversationId?: string }) {
  const [threads, setThreads] = React.useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = React.useState<string | null>(
    conversationId ?? seedConversations[0]?.id ?? null,
  );
  const [query, setQuery] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [model, setModel] = React.useState<string>("nexus-large");
  const [showTokens, setShowTokens] = React.useState(true);
  const [typing, setTyping] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [listOpen, setListOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const active = threads.find((thread) => thread.id === activeId) ?? null;

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...threads].sort(
      (a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt),
    );
    if (!needle) return sorted;
    return sorted.filter(
      (thread) =>
        thread.title.toLowerCase().includes(needle) ||
        thread.preview.toLowerCase().includes(needle) ||
        thread.messages.some((message) => message.content.toLowerCase().includes(needle)),
    );
  }, [threads, query]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, typing]);

  const appendMessage = (threadId: string, message: Message) =>
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              messages: [...thread.messages, message],
              messageCount: thread.messageCount + 1,
              preview: message.content.slice(0, 80),
              updatedAt: message.createdAt,
            }
          : thread,
      ),
    );

  const send = () => {
    if (!draft.trim() || !active) return;
    const now = new Date().toISOString();
    appendMessage(active.id, {
      id: `msg_${Date.now()}`,
      conversationId: active.id,
      role: "user",
      content: draft.trim(),
      createdAt: now,
      tokenCount: estimateTokens(draft),
      attachments: attachments.map((name) => ({ name, size: "24 KB", type: "document" })),
    });
    setDraft("");
    setAttachments([]);
    setTyping(true);

    // Simulated streaming latency stands in for the WebSocket demo (SRS §5.4).
    window.setTimeout(() => {
      setTyping(false);
      appendMessage(active.id, {
        id: `msg_${Date.now() + 1}`,
        conversationId: active.id,
        role: "assistant",
        content: CANNED_REPLY,
        createdAt: new Date().toISOString(),
        tokenCount: estimateTokens(CANNED_REPLY),
        model,
      });
    }, 1400);
  };

  const regenerate = () => {
    if (!active) return;
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      appendMessage(active.id, {
        id: `msg_${Date.now()}`,
        conversationId: active.id,
        role: "assistant",
        content: `Regenerated with **${agentModels.find((m) => m.id === model)?.name}**.\n\n${CANNED_REPLY}`,
        createdAt: new Date().toISOString(),
        tokenCount: estimateTokens(CANNED_REPLY),
        model,
      });
    }, 1200);
  };

  const copy = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      /* clipboard can be blocked in some browsers */
    }
  };

  const newThread = () => {
    const id = `cnv_${Date.now()}`;
    const now = new Date().toISOString();
    setThreads((current) => [
      {
        id,
        title: "New conversation",
        agentId: "agt_support_triage",
        agentName: "Support Triage",
        model,
        createdAt: now,
        updatedAt: now,
        pinned: false,
        messageCount: 0,
        preview: "No messages yet",
        messages: [],
      },
      ...current,
    ]);
    setActiveId(id);
    setListOpen(false);
  };

  const togglePin = (id: string) =>
    setThreads((current) =>
      current.map((thread) => (thread.id === id ? { ...thread, pinned: !thread.pinned } : thread)),
    );

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border bg-card">
      {/* Thread list (FR-CHT-02/03) */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col border-r border-border bg-card transition-transform md:relative md:translate-x-0",
          listOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="space-y-3 border-b border-border p-3">
          <Button size="sm" className="w-full" onClick={newThread}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            New conversation
          </Button>
          <SearchInput value={query} onChange={setQuery} placeholder="Search history…" ariaLabel="Search conversations" />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              No conversations match “{query}”.
            </p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(thread.id);
                      setListOpen(false);
                    }}
                    className={cn(
                      "group w-full rounded-md px-3 py-2.5 text-left transition-colors",
                      thread.id === activeId ? "bg-secondary" : "hover:bg-secondary/60",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {thread.pinned && <Pin className="h-3 w-3 shrink-0 text-primary" aria-hidden />}
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{thread.title}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {thread.preview}
                    </span>
                    <span className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      {thread.agentName}
                      <span><RelativeTime value={thread.updatedAt} /></span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {listOpen && (
        <div className="absolute inset-0 z-20 bg-background/60 md:hidden" onClick={() => setListOpen(false)} aria-hidden />
      )}

      {/* Conversation */}
      <div className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border px-4 py-3">
              <button
                type="button"
                onClick={() => setListOpen(true)}
                aria-label="Show conversations"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary md:hidden"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{active.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {active.agentName} · {active.messageCount} messages
                </p>
              </div>
              <Select
                aria-label="Model"
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="h-8 w-auto min-w-[150px] text-xs"
              >
                {agentModels.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} · {option.context}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => togglePin(active.id)}
                aria-label={active.pinned ? "Unpin conversation" : "Pin conversation"}
                className={cn(
                  "rounded-md p-2 transition-colors hover:bg-secondary",
                  active.pinned ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Pin className="h-4 w-4" aria-hidden />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5">
              {active.messages.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="Start the conversation"
                  description="Ask a question, paste a document, or pick a prompt template to get going."
                  className="mx-auto max-w-md border-0 bg-transparent"
                />
              ) : (
                <ul className="mx-auto max-w-3xl space-y-6">
                  {active.messages.map((message) => (
                    <li
                      key={message.id}
                      className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
                    >
                      {message.role === "user" ? (
                        <Avatar name={currentUser.name} size="sm" />
                      ) : (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      <div className={cn("min-w-0 max-w-[85%]", message.role === "user" && "text-right")}>
                        <div
                          className={cn(
                            "inline-block rounded-lg px-4 py-3 text-left",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-secondary/40",
                          )}
                        >
                          {message.role === "assistant" ? (
                            <Markdown content={message.content} />
                          ) : (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                          )}
                          {message.attachments?.map((file) => (
                            <span
                              key={file.name}
                              className="mt-2 inline-flex items-center gap-1.5 rounded border border-current/20 bg-background/20 px-2 py-1 text-[11px]"
                            >
                              <Paperclip className="h-3 w-3" aria-hidden />
                              {file.name} · {file.size}
                            </span>
                          ))}
                        </div>
                        <div
                          className={cn(
                            "mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground",
                            message.role === "user" && "justify-end",
                          )}
                        >
                          <span><RelativeTime value={message.createdAt} /></span>
                          {showTokens && <span>· {message.tokenCount} tokens</span>}
                          {message.role === "assistant" && (
                            <>
                              <button
                                type="button"
                                onClick={() => copy(message)}
                                className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-3 w-3 text-success" aria-hidden />
                                ) : (
                                  <Copy className="h-3 w-3" aria-hidden />
                                )}
                                {copiedId === message.id ? "Copied" : "Copy"}
                              </button>
                              <button
                                type="button"
                                onClick={regenerate}
                                className="inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground"
                              >
                                <RefreshCw className="h-3 w-3" aria-hidden />
                                Regenerate
                              </button>
                              <button type="button" aria-label="Good response" className="rounded p-0.5 hover:text-success">
                                <ThumbsUp className="h-3 w-3" aria-hidden />
                              </button>
                              <button type="button" aria-label="Bad response" className="rounded p-0.5 hover:text-danger">
                                <ThumbsDown className="h-3 w-3" aria-hidden />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}

                  {typing && (
                    <li className="flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-4 py-3.5">
                        {[0, 150, 300].map((delay) => (
                          <span
                            key={delay}
                            className="h-1.5 w-1.5 animate-blink rounded-full bg-muted-foreground"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                        <span className="sr-only">AI is typing</span>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="shrink-0 border-t border-border p-3 sm:p-4">
              <div className="mx-auto max-w-3xl">
                {attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary px-2 py-1 text-xs"
                      >
                        <Paperclip className="h-3 w-3" aria-hidden />
                        {name}
                        <button
                          type="button"
                          onClick={() => setAttachments((files) => files.filter((file) => file !== name))}
                          aria-label={`Remove ${name}`}
                          className="text-muted-foreground hover:text-danger"
                        >
                          <X className="h-3 w-3" aria-hidden />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2 rounded-lg border border-input bg-card p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring">
                  <button
                    type="button"
                    onClick={() => setAttachments((files) => [...files, `attachment-${files.length + 1}.pdf`])}
                    aria-label="Attach a file"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" aria-hidden />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder="Send a message…  (Enter to send, Shift+Enter for a new line)"
                    aria-label="Message"
                    className="max-h-40 min-h-[38px] flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <Button size="icon" onClick={send} disabled={!draft.trim()} aria-label="Send message">
                    <Send className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Switch checked={showTokens} onChange={setShowTokens} size="sm" label="Show token estimates" />
                    Show token estimates
                  </span>
                  <span>
                    ~{estimateTokens(draft)} tokens ·{" "}
                    <Link href="/prompts" className="text-primary hover:underline">
                      Use a prompt template
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={Sparkles}
              title="No conversation selected"
              description="Pick a thread from the list or start a new conversation."
              action={<Button onClick={newThread}>New conversation</Button>}
              className="border-0 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
