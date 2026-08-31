"use client";

import * as React from "react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

/**
 * Relative timestamps depend on `Date.now()`, which differs between the
 * prerendered HTML and the hydration pass. Rendering the absolute date first
 * and swapping to relative after mount keeps hydration deterministic.
 */
export function RelativeTime({ value, className }: { value: string; className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <time dateTime={value} title={formatDate(value, "long")} className={className}>
      {mounted ? formatRelativeTime(value) : formatDate(value)}
    </time>
  );
}
