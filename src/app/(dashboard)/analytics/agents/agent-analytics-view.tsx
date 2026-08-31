"use client";

import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { SimpleBarChart } from "@/components/charts/simple-charts";
import { agentPerformance, errorBreakdown, latencyDistribution } from "@/data/analytics";
import { agents } from "@/data/agents";
import { formatNumber } from "@/lib/utils";

export function AgentAnalyticsView() {
  const totalRuns = agentPerformance.reduce((sum, row) => sum + row.runs, 0);
  const avgLatency =
    agentPerformance.reduce((sum, row) => sum + row.responseMs * row.runs, 0) / totalRuns;
  const weightedSuccess =
    agentPerformance.reduce((sum, row) => sum + row.successRate * row.runs, 0) / totalRuns;
  const worst = [...agentPerformance].sort((a, b) => b.errorRate - a.errorRate)[0];

  return (
    <>
      <PageHeader
        title="Agent performance"
        description="Response time, success rate and error rate for every agent."
        breadcrumbs={[{ label: "Analytics", href: "/analytics" }, { label: "Agent performance" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total runs" value={formatNumber(totalRuns)} change={11.4} icon={Activity} />
        <StatCard label="Avg response" value={`${(avgLatency / 1000).toFixed(2)}s`} change={-6.2} invertChange icon={Clock} />
        <StatCard label="Success rate" value={`${weightedSuccess.toFixed(1)}%`} change={0.8} icon={CheckCircle2} />
        <StatCard label="Highest error rate" value={`${worst.errorRate}%`} hint={worst.agent} icon={AlertTriangle} invertChange />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Response time by agent</CardTitle>
              <CardDescription>Average milliseconds per run.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={agentPerformance}
              xKey="agent"
              layout="horizontal"
              height={280}
              bars={[{ key: "responseMs", name: "Response time" }]}
              valueFormatter={(value) => `${value} ms`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Error rate by agent</CardTitle>
              <CardDescription>Share of runs that failed.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={agentPerformance}
              xKey="agent"
              layout="horizontal"
              height={280}
              bars={[{ key: "errorRate", name: "Error rate" }]}
              valueFormatter={(value) => `${value}%`}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Per-agent detail</CardTitle>
            <CardDescription>Sorted by run volume.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TableWrapper>
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH>Agent</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Runs</TH>
                  <TH className="text-right">Avg response</TH>
                  <TH className="text-right">Error rate</TH>
                  <TH className="w-40">Success rate</TH>
                </TR>
              </THead>
              <TBody>
                {[...agentPerformance]
                  .sort((a, b) => b.runs - a.runs)
                  .map((row) => {
                    const agent = agents.find((item) => item.name === row.agent);
                    return (
                      <TR key={row.agent}>
                        <TD>
                          {agent ? (
                            <Link href={`/agents/${agent.id}`} className="text-sm font-medium hover:text-primary">
                              {row.agent}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium">{row.agent}</span>
                          )}
                        </TD>
                        <TD>
                          {agent && (
                            <Badge tone={statusTone[agent.status]} dot className="capitalize">
                              {agent.status}
                            </Badge>
                          )}
                        </TD>
                        <TD className="text-right text-sm">{formatNumber(row.runs)}</TD>
                        <TD className="text-right text-sm">{row.responseMs} ms</TD>
                        <TD className="text-right text-sm">
                          <span className={row.errorRate > 5 ? "font-medium text-danger" : ""}>
                            {row.errorRate}%
                          </span>
                        </TD>
                        <TD>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={row.successRate}
                              tone={row.successRate >= 97 ? "success" : row.successRate >= 93 ? "warning" : "danger"}
                              className="h-1.5 flex-1"
                            />
                            <span className="w-11 shrink-0 text-right text-xs text-muted-foreground">
                              {row.successRate}%
                            </span>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
              </TBody>
            </Table>
          </TableWrapper>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Latency buckets</CardTitle>
              <CardDescription>Where the tail actually is.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={latencyDistribution}
              xKey="bucket"
              height={240}
              bars={[{ key: "runs", name: "Runs" }]}
              valueFormatter={(value) => `${formatNumber(value)} runs`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Failure reasons</CardTitle>
              <CardDescription>Ranked by frequency.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {errorBreakdown.map((row) => (
                <li key={row.reason}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{row.reason}</span>
                    <span className="text-muted-foreground">{formatNumber(row.count)}</span>
                  </div>
                  <Progress value={row.share} tone={row.share > 30 ? "danger" : "warning"} label={row.reason} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
