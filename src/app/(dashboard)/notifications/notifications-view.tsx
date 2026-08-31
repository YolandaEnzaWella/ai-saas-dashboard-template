"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  Bot,
  CheckCheck,
  CreditCard,
  Server,
  Settings,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { notifications as seed } from "@/data/notifications";
import type { Notification } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

const typeIcon = { system: Server, billing: CreditCard, team: Users, agent: Bot } as const;
const typeTone = {
  system: "bg-secondary text-muted-foreground",
  billing: "bg-warning/15 text-warning",
  team: "bg-accent/15 text-accent",
  agent: "bg-primary/10 text-primary",
} as const;

export function NotificationsView() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Notification[]>(seed);
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");

  const filtered = items
    .filter((item) => {
      if (tab === "unread") return !item.read;
      if (tab !== "all") return item.type === tab;
      return true;
    })
    .filter((item) => {
      const needle = query.trim().toLowerCase();
      return !needle || item.title.toLowerCase().includes(needle) || item.message.toLowerCase().includes(needle);
    })
    .sort((a, b) => b.at.localeCompare(a.at));

  const unread = items.filter((item) => !item.read).length;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    toast({ title: "All caught up", description: "Every notification was marked as read.", tone: "success" });
  };

  const toggleRead = (id: string) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));

  const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const clearAll = () => {
    setItems([]);
    toast({ title: "Notifications cleared", description: "Your inbox is empty.", tone: "info" });
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Everything that happened in your workspace, newest first."
        actions={
          <>
            <Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
              <CheckCheck className="h-4 w-4" aria-hidden />
              Mark all read
            </Button>
            <Button variant="outline" onClick={clearAll} disabled={items.length === 0}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Clear all
            </Button>
            <Link
              href="/notifications/settings"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              <Settings className="h-4 w-4" aria-hidden />
              Preferences
            </Link>
          </>
        }
      />

      <Card>
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "All", count: items.length },
            { id: "unread", label: "Unread", count: unread },
            { id: "system", label: "System", count: items.filter((i) => i.type === "system").length },
            { id: "billing", label: "Billing", count: items.filter((i) => i.type === "billing").length },
            { id: "team", label: "Team", count: items.filter((i) => i.type === "team").length },
            { id: "agent", label: "Agent", count: items.filter((i) => i.type === "agent").length },
          ]}
        />
        <CardContent className="space-y-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search notifications…"
            className="max-w-sm"
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={items.length === 0 ? BellOff : Bell}
              title={items.length === 0 ? "No notifications" : "Nothing matches this filter"}
              description={
                items.length === 0
                  ? "When agents run, invoices arrive or teammates join, you will see it here."
                  : "Try a different tab or clear the search term."
              }
              action={
                items.length === 0 ? (
                  <Link href="/notifications/settings" className="text-xs font-medium text-primary hover:underline">
                    Review notification preferences
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((item) => {
                const Icon = typeIcon[item.type];
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "group flex gap-3 px-1 py-4 transition-colors",
                      !item.read && "bg-primary/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        typeTone[item.type],
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        {!item.read && <Badge tone="primary">New</Badge>}
                        <Badge tone="outline" className="capitalize">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{formatRelativeTime(item.at)}</span>
                        {item.href && (
                          <Link href={item.href} className="font-medium text-primary hover:underline">
                            View details
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => toggleRead(item.id)}
                        aria-label={item.read ? "Mark as unread" : "Mark as read"}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <CheckCheck className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label="Delete notification"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <p className="min-w-0 flex-1 text-xs text-muted-foreground">
            Want a toast when something important happens? Enable real-time alerts in preferences.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: "Agent run failed",
                description: "Data Extractor timed out on a 62-page PDF.",
                tone: "error",
              })
            }
          >
            Preview a toast
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
