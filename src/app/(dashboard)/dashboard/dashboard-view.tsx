"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  Coins,
  DollarSign,
  GripVertical,
  LayoutGrid,
  MessagesSquare,
  Rows3,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/tabs";
import { DateRangePicker, type DateRangeId } from "@/components/ui/date-range-picker";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UsageAreaChart } from "@/components/charts/usage-area-chart";
import { SimpleBarChart } from "@/components/charts/simple-charts";
import { ActivityFeed } from "./activity-feed";
import { AgentStatusWidget } from "./agent-status-widget";
import { usageByAgent, usageByRange, quota } from "@/data/usage";
import { agents } from "@/data/agents";
import { conversations } from "@/data/conversations";
import { cn, formatCompact, formatCurrency, formatNumber } from "@/lib/utils";

type WidgetId = "usage" | "agents" | "activity" | "breakdown";

const widgetOrderKey = "nexus:dashboard-widgets";
const defaultOrder: WidgetId[] = ["usage", "agents", "activity", "breakdown"];

export function DashboardView({ density: initialDensity = "expanded" }: { density?: "compact" | "expanded" }) {
  const [range, setRange] = React.useState<DateRangeId>("30d");
  const [density, setDensity] = React.useState<"compact" | "expanded">(initialDensity);
  const [order, setOrder] = React.useState<WidgetId[]>(defaultOrder);
  const [dragging, setDragging] = React.useState<WidgetId | null>(null);

  // Restore the buyer-facing widget arrangement after mount (FR-DSH-05).
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(widgetOrderKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as WidgetId[];
      if (parsed.length === defaultOrder.length) setOrder(parsed);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const persist = (next: WidgetId[]) => {
    setOrder(next);
    try {
      window.localStorage.setItem(widgetOrderKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const onDrop = (target: WidgetId) => {
    if (!dragging || dragging === target) return;
    const next = [...order];
    next.splice(next.indexOf(target), 0, ...next.splice(next.indexOf(dragging), 1));
    persist(next);
    setDragging(null);
  };

  const series = usageByRange[range];
  const totalTokens = series.reduce((sum, point) => sum + point.inputTokens + point.outputTokens, 0);
  const totalRequests = series.reduce((sum, point) => sum + point.requests, 0);
  const totalCost = series.reduce((sum, point) => sum + point.cost, 0);
  const activeAgents = agents.filter((agent) => agent.status === "active").length;
  const quotaPct = Math.round((quota.used / quota.limit) * 100);
  const compact = density === "compact";

  const widgets: Record<WidgetId, { title: string; span: string; body: React.ReactNode; action?: React.ReactNode }> = {
    usage: {
      title: "Usage trend",
      span: "xl:col-span-2",
      action: (
        <Link href="/usage" className="text-xs font-medium text-primary hover:underline">
          Open usage
        </Link>
      ),
      body: <UsageAreaChart data={series} height={compact ? 220 : 300} />,
    },
    agents: {
      title: "Agent status",
      span: "",
      action: (
        <Link href="/agents" className="text-xs font-medium text-primary hover:underline">
          All agents
        </Link>
      ),
      body: <AgentStatusWidget limit={compact ? 3 : 5} />,
    },
    activity: {
      title: "Recent activity",
      span: "",
      body: <ActivityFeed limit={compact ? 4 : 7} />,
    },
    breakdown: {
      title: "Tokens by agent",
      span: "xl:col-span-2",
      action: (
        <Link href="/usage/breakdown" className="text-xs font-medium text-primary hover:underline">
          Full breakdown
        </Link>
      ),
      body: (
        <SimpleBarChart
          data={usageByAgent.map((row) => ({
            label: row.label,
            tokens: row.inputTokens + row.outputTokens,
          }))}
          xKey="label"
          layout="horizontal"
          height={compact ? 200 : 260}
          bars={[{ key: "tokens", name: "Tokens" }]}
          valueFormatter={(value) => `${formatCompact(value)} tokens`}
        />
      ),
    },
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your AI workspace at a glance."
        actions={
          <>
            <SegmentedControl
              value={density}
              onChange={setDensity}
              options={[
                { value: "expanded", label: "Expanded" },
                { value: "compact", label: "Compact" },
              ]}
            />
            <DateRangePicker value={range} onChange={setRange} />
          </>
        }
      />

      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-4")}>
        <StatCard
          label="Tokens used"
          value={formatCompact(totalTokens)}
          change={12.4}
          hint="vs previous period"
          icon={Coins}
          compact={compact}
        />
        <StatCard
          label="Active agents"
          value={String(activeAgents)}
          change={4.2}
          hint={`${agents.length} total`}
          icon={Bot}
          compact={compact}
        />
        <StatCard
          label="Conversations"
          value={formatNumber(totalRequests)}
          change={8.9}
          hint={`${conversations.length} open threads`}
          icon={MessagesSquare}
          compact={compact}
        />
        <StatCard
          label="Current spend"
          value={formatCurrency(totalCost)}
          change={6.1}
          hint="month to date"
          icon={DollarSign}
          invertChange
          compact={compact}
        />
      </div>

      <Card className="mt-4">
        <CardContent className={cn("flex flex-wrap items-center gap-4", compact && "py-4")}>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Token quota — August 2026</p>
              <p className="text-xs text-muted-foreground">
                {formatCompact(quota.used)} / {formatCompact(quota.limit)} ({quotaPct}%)
              </p>
            </div>
            <Progress value={quotaPct} tone={quotaPct >= 80 ? "warning" : "primary"} label="Token quota" />
          </div>
          {quotaPct >= quota.softAlertAt * 100 && (
            <Badge tone="warning" dot>
              Approaching quota limit
            </Badge>
          )}
          <Link
            href="/subscription"
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Manage plan
          </Link>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        {density === "compact" ? <Rows3 className="h-3.5 w-3.5" aria-hidden /> : <LayoutGrid className="h-3.5 w-3.5" aria-hidden />}
        Drag a card by its handle to rearrange your dashboard.
      </div>

      <div className="mt-3 grid gap-4 xl:grid-cols-3">
        {order.map((id) => {
          const widget = widgets[id];
          return (
            <Card
              key={id}
              draggable
              onDragStart={() => setDragging(id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDrop(id)}
              onDragEnd={() => setDragging(null)}
              className={cn(
                widget.span,
                "transition-opacity",
                dragging === id && "opacity-50 ring-2 ring-primary",
              )}
            >
              <CardHeader>
                <div className="flex min-w-0 items-center gap-2">
                  <GripVertical
                    className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                    aria-hidden
                  />
                  <CardTitle className="truncate">{widget.title}</CardTitle>
                </div>
                {widget.action}
              </CardHeader>
              <CardContent className={cn(compact && "pt-4")}>{widget.body}</CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Avg response time", value: "1.42s", detail: "across all agents", icon: Activity },
          { label: "Success rate", value: "97.8%", detail: "last 30 days", icon: Bot },
          { label: "Cost per 1K tokens", value: "$0.0094", detail: "blended average", icon: DollarSign },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-4 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                <item.icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div>
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">
                  {item.label} · {item.detail}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
