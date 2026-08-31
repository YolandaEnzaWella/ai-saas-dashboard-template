"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker, type DateRangeId } from "@/components/ui/date-range-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { DonutChart } from "@/components/charts/simple-charts";
import { usageByAgent, usageByMember, usageByModel } from "@/data/usage";
import type { UsageBreakdownRow } from "@/lib/types";
import { cn, formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

const datasets: Record<string, UsageBreakdownRow[]> = {
  agent: usageByAgent,
  model: usageByModel,
  member: usageByMember,
};

export function BreakdownView() {
  const { toast } = useToast();
  const [dimension, setDimension] = React.useState<keyof typeof datasets>("agent");
  const [range, setRange] = React.useState<DateRangeId>("30d");
  const [query, setQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<"tokens" | "requests" | "cost">("tokens");

  const rows = datasets[dimension]
    .filter((row) => row.label.toLowerCase().includes(query.trim().toLowerCase()))
    .map((row) => ({ ...row, tokens: row.inputTokens + row.outputTokens }))
    .sort((a, b) => {
      if (sortKey === "requests") return b.requests - a.requests;
      if (sortKey === "cost") return b.cost - a.cost;
      return b.tokens - a.tokens;
    });

  const totalTokens = rows.reduce((sum, row) => sum + row.tokens, 0);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);

  return (
    <>
      <PageHeader
        title="Usage breakdown"
        description="Split token consumption by agent, model or team member."
        breadcrumbs={[{ label: "Usage", href: "/usage" }, { label: "Breakdown" }]}
        actions={
          <>
            <DateRangePicker value={range} onChange={setRange} />
            <Button
              variant="outline"
              onClick={() => toast({ title: "Export queued", description: "Your CSV will arrive by email.", tone: "info" })}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Tabs
            className="px-3"
            value={dimension}
            onChange={(id) => setDimension(id as keyof typeof datasets)}
            items={[
              { id: "agent", label: "By agent", count: usageByAgent.length },
              { id: "model", label: "By model", count: usageByModel.length },
              { id: "member", label: "By member", count: usageByMember.length },
            ]}
          />
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Filter rows…"
                className="min-w-[180px] flex-1"
              />
              <Tabs
                className="border-0"
                value={sortKey}
                onChange={(id) => setSortKey(id as typeof sortKey)}
                items={[
                  { id: "tokens", label: "Tokens" },
                  { id: "requests", label: "Requests" },
                  { id: "cost", label: "Cost" },
                ]}
              />
            </div>

            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Name</TH>
                    <TH className="text-right">Input</TH>
                    <TH className="text-right">Output</TH>
                    <TH className="text-right">Requests</TH>
                    <TH className="text-right">Cost</TH>
                    <TH className="text-right">Change</TH>
                    <TH className="w-32">Share</TH>
                  </TR>
                </THead>
                <TBody>
                  {rows.map((row) => {
                    const share = totalTokens > 0 ? (row.tokens / totalTokens) * 100 : 0;
                    const up = row.changePct >= 0;
                    return (
                      <TR key={row.id}>
                        <TD className="font-medium">{row.label}</TD>
                        <TD className="text-right text-sm">{formatCompact(row.inputTokens)}</TD>
                        <TD className="text-right text-sm">{formatCompact(row.outputTokens)}</TD>
                        <TD className="text-right text-sm">{formatNumber(row.requests)}</TD>
                        <TD className="text-right text-sm font-medium">{formatCurrency(row.cost)}</TD>
                        <TD className="text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 text-xs font-medium",
                              up ? "text-success" : "text-danger",
                            )}
                          >
                            {up ? <ArrowUpRight className="h-3 w-3" aria-hidden /> : <ArrowDownRight className="h-3 w-3" aria-hidden />}
                            {formatPercent(row.changePct)}
                          </span>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-2">
                            <Progress value={share} className="h-1.5 flex-1" />
                            <span className="w-9 shrink-0 text-right text-[11px] text-muted-foreground">
                              {share.toFixed(0)}%
                            </span>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </TableWrapper>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">
                {rows.length} rows · {formatCompact(totalTokens)} tokens
              </span>
              <span className="font-semibold">{formatCurrency(totalCost)} total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold">Share of tokens</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Distribution across the current dimension.
              </p>
            </div>
            <DonutChart
              height={200}
              unit="%"
              centerValue={formatCompact(totalTokens)}
              centerLabel="tokens"
              data={rows.slice(0, 5).map((row) => ({
                name: row.label,
                value: Number(((row.tokens / totalTokens) * 100).toFixed(1)),
              }))}
            />
            <div className="rounded-md bg-secondary/60 p-3.5 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Reading this chart</p>
              Percentages are of the filtered rows, not of your total quota. Switch dimension above
              to compare models or people instead.
            </div>
            <Badge tone="outline">Range: {range}</Badge>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
