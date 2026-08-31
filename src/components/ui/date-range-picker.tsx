"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "./dropdown";
import { cn } from "@/lib/utils";

export const dateRanges = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "12w", label: "Last 12 weeks" },
  { id: "12m", label: "Last 12 months" },
] as const;

export type DateRangeId = (typeof dateRanges)[number]["id"];

/** Dashboard-wide date filter (FR-DSH-06). */
export function DateRangePicker({
  value,
  onChange,
  className,
}: {
  value: DateRangeId;
  onChange: (value: DateRangeId) => void;
  className?: string;
}) {
  const active = dateRanges.find((range) => range.id === value) ?? dateRanges[1];
  return (
    <Dropdown
      className={className}
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-secondary",
          )}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
          {active.label}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownLabel>Date range</DropdownLabel>
          {dateRanges.map((range) => (
            <DropdownItem
              key={range.id}
              onClick={() => {
                onChange(range.id);
                close();
              }}
              className={range.id === value ? "bg-secondary" : undefined}
            >
              {range.label}
            </DropdownItem>
          ))}
          <DropdownSeparator />
          <DropdownItem onClick={close}>Custom range…</DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
