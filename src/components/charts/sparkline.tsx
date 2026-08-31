"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline<T extends object>({
  data,
  dataKey,
  color = "hsl(var(--chart-1))",
  height = 40,
}: {
  data: readonly T[];
  dataKey: string;
  color?: string;
  height?: number;
}) {
  const gradientId = `spark-${dataKey}-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data as T[]} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
