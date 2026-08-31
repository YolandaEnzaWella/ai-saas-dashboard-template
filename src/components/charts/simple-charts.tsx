"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame, ChartLegend, ChartTooltip, axisProps, chartColors, gridProps } from "./chart-kit";
import { formatCompact } from "@/lib/utils";

export function SimpleBarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  bars,
  height = 280,
  layout = "vertical",
  valueFormatter,
}: {
  data: T[];
  xKey: string;
  bars: { key: string; name: string; color?: string }[];
  height?: number;
  /** "vertical" = upright columns; "horizontal" = bars running left to right. */
  layout?: "vertical" | "horizontal";
  valueFormatter?: (value: number) => string;
}) {
  const horizontal = layout === "horizontal";
  return (
    <div>
      <ChartFrame height={height}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 12, left: horizontal ? 8 : -12, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid {...gridProps} vertical={horizontal} horizontal={!horizontal} />
            {horizontal ? (
              <>
                <XAxis type="number" {...axisProps} tickFormatter={(v: number) => formatCompact(v)} />
                <YAxis type="category" dataKey={xKey} {...axisProps} width={120} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} {...axisProps} minTickGap={16} />
                <YAxis {...axisProps} width={48} tickFormatter={(v: number) => formatCompact(v)} />
              </>
            )}
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
              content={
                <ChartTooltip
                  formatter={(value) => (valueFormatter ? valueFormatter(value) : formatCompact(value))}
                />
              }
            />
            {bars.map((bar, index) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                fill={bar.color ?? chartColors[index % chartColors.length]}
                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                maxBarSize={horizontal ? 18 : 42}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
      {bars.length > 1 && (
        <ChartLegend
          className="mt-3 justify-center"
          items={bars.map((bar, index) => ({
            label: bar.name,
            color: bar.color ?? chartColors[index % chartColors.length],
          }))}
        />
      )}
    </div>
  );
}

export function SimpleLineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  lines,
  height = 280,
  valueFormatter,
}: {
  data: T[];
  xKey: string;
  lines: { key: string; name: string; color?: string }[];
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  return (
    <div>
      <ChartFrame height={height}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xKey} {...axisProps} minTickGap={20} />
            <YAxis {...axisProps} width={48} tickFormatter={(v: number) => formatCompact(v)} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              content={
                <ChartTooltip
                  formatter={(value) => (valueFormatter ? valueFormatter(value) : formatCompact(value))}
                />
              }
            />
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color ?? chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>
      {lines.length > 1 && (
        <ChartLegend
          className="mt-3 justify-center"
          items={lines.map((line, index) => ({
            label: line.name,
            color: line.color ?? chartColors[index % chartColors.length],
          }))}
        />
      )}
    </div>
  );
}

export function DonutChart({
  data,
  height = 240,
  centerLabel,
  centerValue,
  unit = "%",
}: {
  data: { name: string; value: number }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
  unit?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={(value) => `${value}${unit}`} />} />
          </PieChart>
        </ResponsiveContainer>
        {centerValue && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold">{centerValue}</span>
            {centerLabel && <span className="text-xs text-muted-foreground">{centerLabel}</span>}
          </div>
        )}
      </div>
      <ChartLegend
        className="flex-col items-start gap-2"
        items={data.map((entry, index) => ({
          label: `${entry.name} · ${entry.value}${unit}`,
          color: chartColors[index % chartColors.length],
        }))}
      />
    </div>
  );
}
