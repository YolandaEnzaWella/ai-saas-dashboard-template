"use client";

import { cn } from "@/lib/utils";

/**
 * CSS-grid heatmap (FR-ANL-01). Recharts has no heatmap primitive, and a grid
 * of divs keeps the bundle smaller than pulling in a second chart library.
 */
export function Heatmap({
  rows,
  max,
  className,
}: {
  rows: { day: string; hours: number[] }[];
  max?: number;
  className?: string;
}) {
  const peak = max ?? Math.max(...rows.flatMap((row) => row.hours));

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-thin", className)}>
      <div className="min-w-[620px]">
        <div className="flex gap-1 pl-10 pb-1.5">
          {Array.from({ length: 24 }).map((_, hour) => (
            <span
              key={hour}
              className="flex-1 text-center text-[10px] text-muted-foreground"
              aria-hidden
            >
              {hour % 3 === 0 ? `${hour}` : ""}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          {rows.map((row) => (
            <div key={row.day} className="flex items-center gap-1">
              <span className="w-9 shrink-0 text-[11px] text-muted-foreground">{row.day}</span>
              {row.hours.map((value, hour) => (
                <div
                  key={hour}
                  title={`${row.day} ${String(hour).padStart(2, "0")}:00 — ${value} runs`}
                  className="h-6 flex-1 rounded-[3px] transition-transform hover:scale-110"
                  style={{
                    backgroundColor: `hsl(var(--chart-1) / ${0.08 + (value / peak) * 0.92})`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
          <span>Less</span>
          {[0.12, 0.32, 0.55, 0.78, 1].map((step) => (
            <span
              key={step}
              className="h-3 w-3 rounded-[3px]"
              style={{ backgroundColor: `hsl(var(--chart-1) / ${step})` }}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
