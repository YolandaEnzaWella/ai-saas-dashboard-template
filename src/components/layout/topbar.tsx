"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { GlobalSearch } from "./global-search";
import { NotificationPanel } from "./notification-panel";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
      >
        <Menu className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Link
          href="/agents/new"
          className="hidden h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 sm:inline-flex"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New agent
        </Link>
        <ThemeToggle />
        <NotificationPanel />
        <UserMenu />
      </div>
    </header>
  );
}
