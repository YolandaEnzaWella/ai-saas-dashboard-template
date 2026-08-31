"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Bot, CheckCheck, CreditCard, Server, Trash2, Users } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { notifications as seed } from "@/data/notifications";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";

const typeIcon = {
  system: Server,
  billing: CreditCard,
  team: Users,
  agent: Bot,
} as const;

const typeTone = {
  system: "bg-secondary text-muted-foreground",
  billing: "bg-warning/15 text-warning",
  team: "bg-accent/15 text-accent",
  agent: "bg-primary/10 text-primary",
} as const;

/** Bell panel (FR-NTF-01/03). State is local so the demo feels interactive. */
export function NotificationPanel() {
  const [items, setItems] = React.useState<Notification[]>(seed);
  const unread = items.filter((item) => !item.read).length;

  const markAllRead = () =>
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  const toggleRead = (id: string) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
    );
  const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <Dropdown
      panelClassName="w-[min(92vw,380px)] p-0"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-danger-foreground">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <CheckCheck className="h-3.5 w-3.5" aria-hidden />
          Mark all read
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-xs text-muted-foreground">
            You are all caught up.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.slice(0, 8).map((item) => {
              const Icon = typeIcon[item.type];
              return (
                <li
                  key={item.id}
                  className={cn(
                    "group flex gap-3 px-4 py-3 transition-colors hover:bg-secondary/60",
                    !item.read && "bg-primary/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      typeTone[item.type],
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      <RelativeTime value={item.at} />
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => toggleRead(item.id)}
                      aria-label={item.read ? "Mark as unread" : "Mark as read"}
                      className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label="Delete notification"
                      className="rounded p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-border p-2">
        <Link
          href="/notifications"
          className="block rounded-md px-3 py-2 text-center text-xs font-medium text-primary transition-colors hover:bg-secondary"
        >
          View all notifications
        </Link>
      </div>
    </Dropdown>
  );
}
