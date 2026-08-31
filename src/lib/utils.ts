import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names while letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

/** 1_240_000 -> "1.24M" — used across metric tiles and chart axes. */
export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number, maximumFractionDigits = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(maximumFractionDigits)}%`;
}

export function formatDate(input: string | Date, style: "short" | "long" = "short") {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(
    "en-US",
    style === "short"
      ? { month: "short", day: "numeric", year: "numeric" }
      : { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" },
  ).format(date);
}

/**
 * Relative time without pulling in a date library.
 * Mock timestamps are ISO strings, so this stays deterministic per render.
 */
export function formatRelativeTime(input: string | Date) {
  const date = typeof input === "string" ? new Date(input) : input;
  // The bundled mock data uses fixed dates that may sit slightly ahead of the
  // viewer's clock. Clamp to the past so timestamps never read "in 3 hours".
  const seconds = Math.min(0, Math.round((date.getTime() - Date.now()) / 1000));
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const formatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit || unit === "second") {
      return formatter.format(Math.round(seconds / secondsInUnit), unit);
    }
  }
  return "";
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Rough token estimate (~4 characters per token) for the demo counters. */
export function estimateTokens(text: string) {
  return Math.max(1, Math.round(text.trim().length / 4));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Deterministic pseudo-random generator so mock charts never re-shuffle. */
export function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}
