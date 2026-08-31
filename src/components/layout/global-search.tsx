"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bot, CornerDownLeft, MessagesSquare, Search, Sparkles } from "lucide-react";
import { searchableRoutes } from "./nav-config";
import { agents } from "@/data/agents";
import { prompts } from "@/data/prompts";
import { conversations } from "@/data/conversations";
import { cn } from "@/lib/utils";

interface Result {
  id: string;
  label: string;
  hint: string;
  href: string;
  group: string;
  icon: typeof Bot;
}

/** Command palette behind the topbar search (SRS §5.1). Cmd/Ctrl+K opens it. */
export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
    else setQuery("");
    setCursor(0);
  }, [open]);

  const results = React.useMemo<Result[]>(() => {
    const all: Result[] = [
      ...searchableRoutes.map((route) => ({
        id: route.href,
        label: route.label,
        hint: route.group,
        href: route.href,
        group: "Navigation",
        icon: route.icon,
      })),
      ...agents.map((agent) => ({
        id: agent.id,
        label: agent.name,
        hint: agent.description,
        href: `/agents/${agent.id}`,
        group: "Agents",
        icon: Bot,
      })),
      ...prompts.map((prompt) => ({
        id: prompt.id,
        label: prompt.title,
        hint: prompt.category,
        href: `/prompts/${prompt.id}`,
        group: "Prompts",
        icon: Sparkles,
      })),
      ...conversations.map((conversation) => ({
        id: conversation.id,
        label: conversation.title,
        hint: conversation.agentName,
        href: `/chat/${conversation.id}`,
        group: "Conversations",
        icon: MessagesSquare,
      })),
    ];
    const needle = query.trim().toLowerCase();
    if (!needle) return all.slice(0, 8);
    return all
      .filter(
        (item) =>
          item.label.toLowerCase().includes(needle) || item.hint.toLowerCase().includes(needle),
      )
      .slice(0, 10);
  }, [query]);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const onListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => (value + 1) % Math.max(results.length, 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => (value - 1 + results.length) % Math.max(results.length, 1));
    }
    if (event.key === "Enter" && results[cursor]) {
      event.preventDefault();
      go(results[cursor].href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary md:w-72 lg:w-80"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden flex-1 text-left md:inline">Search…</span>
        <kbd className="hidden rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] md:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[10vh]">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-popover shadow-2xl animate-fade-in"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                onKeyDown={onListKeyDown}
                placeholder="Search agents, prompts, conversations…"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-[360px] overflow-y-auto scrollbar-thin p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results for “{query}”.
                </p>
              ) : (
                results.map((result, index) => (
                  <button
                    key={`${result.group}-${result.id}`}
                    type="button"
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => go(result.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                      index === cursor ? "bg-secondary" : "hover:bg-secondary/60",
                    )}
                  >
                    <result.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{result.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {result.hint}
                      </span>
                    </span>
                    <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {result.group}
                    </span>
                    {index === cursor && (
                      <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
