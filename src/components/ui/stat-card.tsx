import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "./card";
import { cn, formatPercent } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  hint,
  icon: Icon,
  invertChange = false,
  compact = false,
}: {
  label: string;
  value: string;
  change?: number;
  hint?: string;
  icon: LucideIcon;
  /** Set for metrics where a rise is bad, e.g. spend or error rate. */
  invertChange?: boolean;
  compact?: boolean;
}) {
  const positive = change === undefined ? true : invertChange ? change < 0 : change > 0;
  const ChangeIcon = (change ?? 0) >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("flex flex-col justify-between", compact ? "p-4" : "p-5")}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className={cn("mt-3 font-semibold tracking-tight", compact ? "text-xl" : "text-2xl")}>
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-success" : "text-danger",
            )}
          >
            <ChangeIcon className="h-3.5 w-3.5" aria-hidden />
            {formatPercent(change)}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}
