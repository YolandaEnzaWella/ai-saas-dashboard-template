import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  success: "bg-success/10 text-success dark:bg-success/20",
  warning: "bg-warning/15 text-warning dark:bg-warning/20",
  danger: "bg-danger/10 text-danger dark:bg-danger/20",
  accent: "bg-accent/10 text-accent dark:bg-accent/20",
  outline: "border border-border text-muted-foreground",
} as const;

export type BadgeTone = keyof typeof tones;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Shared status → tone mapping so agents, invoices and runs read consistently. */
export const statusTone: Record<string, BadgeTone> = {
  active: "success",
  success: "success",
  succeeded: "success",
  paid: "success",
  connected: "success",
  delivered: "success",
  published: "primary",
  running: "accent",
  trialing: "accent",
  idle: "neutral",
  draft: "neutral",
  archived: "neutral",
  paused: "warning",
  pending: "warning",
  retrying: "warning",
  error: "danger",
  failed: "danger",
  overdue: "danger",
  revoked: "danger",
  canceled: "danger",
  disabled: "neutral",
  refunded: "outline",
};
