"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Coins, Download, Gauge, Repeat, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker, type DateRangeId } from "@/components/ui/date-range-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { useToast } from "@/components/ui/toast";
import { UsageAreaChart } from "@/components/charts/usage-area-chart";
import { SimpleBarChart } from "@/components/charts/simple-charts";
import { monthOverMonth, quota, usageByAgent, usageByModel, usageByRange } from "@/data/usage";
import { formatCompact, formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils";

export function UsageOverview() {
  const { toast } = useToast();
  const [range, setRange] = React.useState<DateRangeId>("30d");
  const series = usageByRange[range];

  const inputTotal = series.reduce((sum, point) => sum + point.inputTokens, 0);
  const outputTotal = series.reduce((sum, point) => sum + point.outputTokens, 0);
  const requests = series.reduce((sum, point) => sum + point.requests, 0);
  const cost = series.reduce((sum, point) => sum + point.cost, 0);

  const quotaPct = Math.round((quota.used / quota.limit) * 100);
  const nearLimit = quotaPct >= quota.softAlertAt * 100;
  const [previous, current] = monthOverMonth;
  const momChange = ((current.tokens - previous.tokens) / previous.tokens) * 100;

  const exportReport = (format: "CSV" | "PDF") =>
    toast({
      title: `${format} export queued`,
      description: "You will get an email when the report is ready to download.",
      tone: "info",
    });

  return (
    <>
      <PageHeader
        title="Usage & Tokens"
        description="Track token consumption, request volume and cost against your quota."
        actions={
          <>
            <DateRangePicker value={range} onChange={setRange} />
            <Button variant="outline" onClick={() => exportReport("CSV")}>
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport("PDF")}>
              <Download className="h-4 w-4" aria-hidden />
              Export PDF
            </Button>
          </>
        }
      />

      {nearLimit && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-warning" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">You have used {quotaPct}% of your monthly token quota</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              At the current rate you will hit the limit before {formatDate(quota.resetsOn)}. Add an
              extra token pack or upgrade to avoid throttling.
            </p>
          </div>
          <Link
            href="/subscription"
            className="inline-flex h-9 shrink-0 items-center rounded-md bg-warning px-4 text-sm font-medium text-warning-foreground transition-opacity hover:opacity-90"
          >
            Increase quota
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Input tokens" value={formatCompact(inputTotal)} change={11.2} icon={Coins} />
        <StatCard label="Output tokens" value={formatCompact(outputTotal)} change={14.8} icon={TrendingUp} />
        <StatCard label="Requests" value={formatNumber(requests)} change={7.4} icon={Repeat} />
        <StatCard label="Cost" value={formatCurrency(cost)} change={9.1} invertChange icon={Gauge} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Quota and budget</CardTitle>
            <CardDescription>Resets on {formatDate(quota.resetsOn)}.</CardDescription>
          </div>
          <Link href="/billing" className="text-xs font-medium text-primary hover:underline">
            Manage limits
          </Link>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Token quota</span>
              <span className="text-muted-foreground">
                {formatCompact(quota.used)} / {formatCompact(quota.limit)}
              </span>
            </div>
            <Progress value={quotaPct} tone={nearLimit ? "warning" : "primary"} label="Token quota" />
            <p className="mt-2 text-xs text-muted-foreground">
              {formatCompact(quota.limit - quota.used)} tokens remaining ({100 - quotaPct}%)
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Spending limit</span>
              <span className="text-muted-foreground">
                {formatCurrency(quota.spendUsed)} / {formatCurrency(quota.spendLimit)}
              </span>
            </div>
            <Progress
              value={(quota.spendUsed / quota.spendLimit) * 100}
              tone="success"
              label="Spending limit"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Alerts fire at 80% and again at 100% of the budget.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Token usage over time</CardTitle>
              <CardDescription>Input versus output tokens per period.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <UsageAreaChart data={series} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Month over month</CardTitle>
              <CardDescription>August 2026 versus July 2026.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-secondary/60 p-4 text-center">
              <p className="text-2xl font-semibold">{formatPercent(momChange)}</p>
              <p className="mt-1 text-xs text-muted-foreground">change in total tokens</p>
            </div>
            <dl className="space-y-3 text-sm">
              {monthOverMonth.map((month) => (
                <div key={month.label} className="border-b border-border pb-3 last:border-0">
                  <dt className="text-xs text-muted-foreground">{month.label}</dt>
                  <dd className="mt-1 flex items-center justify-between">
                    <span className="font-medium">{formatCompact(month.tokens)} tokens</span>
                    <span className="text-muted-foreground">{formatCurrency(month.cost)}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <Link href="/usage/breakdown" className="block text-center text-xs font-medium text-primary hover:underline">
              See the full breakdown
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Tokens by agent</CardTitle>
              <CardDescription>Top consumers this period.</CardDescription>
            </div>
            <Badge tone="outline">{usageByAgent.length} agents</Badge>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={usageByAgent.map((row) => ({
                label: row.label,
                input: row.inputTokens,
                output: row.outputTokens,
              }))}
              xKey="label"
              layout="horizontal"
              height={260}
              bars={[
                { key: "input", name: "Input" },
                { key: "output", name: "Output" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Cost by model</CardTitle>
              <CardDescription>Where the spend actually goes.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={usageByModel.map((row) => ({ label: row.label, cost: row.cost }))}
              xKey="label"
              height={260}
              bars={[{ key: "cost", name: "Cost" }]}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
