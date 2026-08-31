"use client";

import Link from "next/link";
import { CreditCard, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@/data/users";

export function UserMenu() {
  const links = [
    { href: "/profile", label: "Profile", icon: UserIcon },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <Dropdown
      panelClassName="w-64"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-secondary"
        >
          <Avatar name={currentUser.name} size="sm" />
          <span className="hidden text-left lg:block">
            <span className="block text-xs font-medium leading-tight">{currentUser.name}</span>
            <span className="block text-[11px] leading-tight text-muted-foreground">
              {currentUser.role}
            </span>
          </span>
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar name={currentUser.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
          <div className="px-2.5 pb-2">
            <Badge tone="primary">{currentUser.team} · {currentUser.role}</Badge>
          </div>
          <DropdownSeparator />
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={close}>
              <DropdownItem>
                <link.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                {link.label}
              </DropdownItem>
            </Link>
          ))}
          <DropdownSeparator />
          <Link href="/login" onClick={close}>
            <DropdownItem tone="danger">
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </DropdownItem>
          </Link>
        </>
      )}
    </Dropdown>
  );
}
