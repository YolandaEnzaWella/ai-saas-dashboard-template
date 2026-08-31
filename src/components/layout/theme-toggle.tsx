"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Dropdown, DropdownItem, DropdownLabel } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Theme is unknown until hydration; render a stable placeholder to avoid a mismatch.
  React.useEffect(() => setMounted(true), []);

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ] as const;

  const Icon = !mounted ? Sun : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <Dropdown
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-label="Toggle theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownLabel>Appearance</DropdownLabel>
          {options.map((option) => (
            <DropdownItem
              key={option.id}
              onClick={() => {
                setTheme(option.id);
                close();
              }}
              className={cn(mounted && theme === option.id && "bg-secondary")}
            >
              <option.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              {option.label}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}
