"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, X, Zap } from "lucide-react";
import { navigation } from "./nav-config";
import { Logo } from "./logo";
import { Progress } from "@/components/ui/progress";
import { quota } from "@/data/usage";
import { cn, formatCompact } from "@/lib/utils";

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const usedPct = Math.round((quota.used / quota.limit) * 100);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-[width,transform] duration-200 lg:translate-x-0",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <Link href="/dashboard" aria-label="Nexus AI home">
            <Logo showWordmark={!collapsed} />
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary lg:inline-flex",
              collapsed && "absolute -right-3 top-5 z-10 border border-border bg-card shadow-sm",
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} aria-hidden />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 py-4">
          {navigation.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="shrink-0 border-t border-border p-3">
            <div className="rounded-lg bg-secondary/70 p-3.5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium">Token quota</span>
                <span className="text-muted-foreground">{usedPct}%</span>
              </div>
              <Progress value={usedPct} tone={usedPct >= 80 ? "warning" : "primary"} label="Token quota used" />
              <p className="mt-2 text-[11px] text-muted-foreground">
                {formatCompact(quota.used)} of {formatCompact(quota.limit)} tokens
              </p>
              <Link
                href="/subscription"
                className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-xs font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                <Zap className="h-3.5 w-3.5" aria-hidden />
                Upgrade plan
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
