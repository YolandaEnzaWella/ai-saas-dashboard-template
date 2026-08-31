"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  size = "md",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const small = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        small ? "h-[18px] w-8" : "h-5 w-9",
        checked ? "bg-primary" : "bg-muted-foreground/35",
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute left-0.5 inline-block rounded-full bg-white shadow transition-transform",
          small ? "h-3.5 w-3.5" : "h-4 w-4",
          checked ? (small ? "translate-x-[14px]" : "translate-x-4") : "translate-x-0",
        )}
      />
    </button>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Visible text rendered next to the box. */
  label?: string;
  /** Accessible name for a checkbox with no visible label, e.g. a grid cell. */
  ariaLabel?: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel ?? (label ? undefined : "Toggle")}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border-input accent-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label && (
        <label htmlFor={id} className="cursor-pointer text-sm text-foreground">
          {label}
        </label>
      )}
    </span>
  );
}
