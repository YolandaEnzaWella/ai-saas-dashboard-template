"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { UsagePoint } from "@/lib/types";
import { formatCompact } from "@/lib/utils";
import { ChartFrame, ChartLegend, ChartTooltip, axisProps, chartColors, gridProps } from "./chart-kit";

/** Turn "2026-08-02" into "Aug 2"; leave "W3" / "Aug" labels untouched. */
function formatTick(value: string | number) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return String(value);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export function UsageAreaChart({
  data,
  height = 300,
  showLegend = true,
}: {
  data: UsagePoint[];
  height?: number;
  showLegend?: boolean;
}) {
  return (
    <div>
      <ChartFrame height={height}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="fillInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartColors[0]} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors[1]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColors[1]} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey="date" {...axisProps} minTickGap={24} tickFormatter={formatTick} />
            <YAxis {...axisProps} tickFormatter={(value: number) => formatCompact(value)} width={48} />
            <Tooltip
              content={<ChartTooltip formatter={(value) => `${formatCompact(value)} tokens`} labelFormatter={formatTick} />}
              cursor={{ stroke: "hsl(var(--border))" }}
            />
            <Area
              type="monotone"
              dataKey="inputTokens"
              name="Input"
              stroke={chartColors[0]}
              strokeWidth={2}
              fill="url(#fillInput)"
            />
            <Area
              type="monotone"
              dataKey="outputTokens"
              name="Output"
              stroke={chartColors[1]}
              strokeWidth={2}
              fill="url(#fillOutput)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartFrame>
      {showLegend && (
        <ChartLegend
          className="mt-3 justify-center"
          items={[
            { label: "Input tokens", color: chartColors[0] },
            { label: "Output tokens", color: chartColors[1] },
          ]}
        />
      )}
    </div>
  );
}
