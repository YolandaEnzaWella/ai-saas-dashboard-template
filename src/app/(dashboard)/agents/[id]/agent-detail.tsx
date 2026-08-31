"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDown,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  GitBranch,
  Pencil,
  Terminal,
  Wrench,
  XCircle,
} from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { SimpleLineChart } from "@/components/charts/simple-charts";
import { modelName } from "@/data/agents";
import type { Agent } from "@/lib/types";
import { cn, formatCompact, formatDate, formatNumber, formatRelativeTime } from "@/lib/utils";

const stepTone = {
  trigger: "border-accent/40 bg-accent/5",
  llm: "border-primary/40 bg-primary/5",
  tool: "border-warning/40 bg-warning/5",
  condition: "border-chart-5/40 bg-chart-5/5",
  output: "border-success/40 bg-success/5",
} as const;

export function AgentDetail({ agent }: { agent: Agent }) {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(agent.enabled);
  const [tab, setTab] = React.useState("overview");

  const latency = agent.history
    .slice()
    .reverse()
    .map((run) => ({ at: formatDate(run.startedAt), ms: run.durationMs, tokens: run.tokens }));

  return (
    <>
      <PageHeader
        title={agent.name}
        description={agent.description}
        breadcrumbs={[{ label: "AI Agents", href: "/agents" }, { label: agent.name }]}
        actions={
          <>
            <span className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs">
              <Switch
                checked={enabled}
                onChange={(value) => {
                  setEnabled(value);
                  toast({
                    title: value ? "Agent enabled" : "Agent disabled",
                    description: `${agent.name} is now ${value ? "accepting" : "rejecting"} runs.`,
                    tone: value ? "success" : "warning",
                  });
                }}
                size="sm"
                label="Toggle agent"
              />
              {enabled ? "Enabled" : "Disabled"}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Agent duplicated", description: `${agent.name} (copy) created as a draft.`, tone: "success" })
              }
            >
              <Copy className="h-4 w-4" aria-hidden />
              Duplicate
            </Button>
            <Link
              href={`/agents/${agent.id}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit agent
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Runs (30d)" value={formatNumber(agent.runs30d)} change={12.1} icon={Activity} />
        <StatCard label="Success rate" value={`${agent.successRate}%`} change={0.6} icon={CheckCircle2} />
        <StatCard label="Avg response" value={`${(agent.avgResponseMs / 1000).toFixed(2)}s`} change={-4.8} invertChange icon={Clock} />
        <StatCard label="Tokens (30d)" value={formatCompact(agent.tokens30d)} change={9.4} icon={Coins} />
      </div>

      <Card className="mt-6">
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "overview", label: "Configuration" },
            { id: "workflow", label: "Workflow", count: agent.steps.length },
            { id: "runs", label: "Run history", count: agent.history.length },
            { id: "versions", label: "Versions", count: agent.versions.length },
          ]}
        />

        <CardContent>
          {tab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    System prompt
                  </h3>
                  <pre className="overflow-x-auto scrollbar-thin whitespace-pre-wrap rounded-md border border-border bg-secondary/50 p-4 font-mono text-xs leading-relaxed">
                    {agent.systemPrompt}
                  </pre>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Enabled tools
                  </h3>
                  {agent.tools.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No tools attached to this agent.</p>
                  ) : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {agent.tools.map((tool) => (
                        <li
                          key={tool.id}
                          className="flex items-start gap-2.5 rounded-md border border-border p-3"
                        >
                          <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                          <span>
                            <span className="block text-sm font-medium">{tool.name}</span>
                            <span className="block text-xs text-muted-foreground">{tool.description}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                {[
                  { label: "Status", value: <Badge tone={statusTone[agent.status]} dot className="capitalize">{agent.status}</Badge> },
                  { label: "Model", value: modelName(agent.model) },
                  { label: "Category", value: agent.category },
                  { label: "Owner", value: agent.owner },
                  { label: "Created", value: formatDate(agent.createdAt) },
                  { label: "Last updated", value: formatRelativeTime(agent.updatedAt) },
                  { label: "Current version", value: agent.versions[0]?.version ?? "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0">
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className="text-right text-sm font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "workflow" && (
            <ol className="mx-auto max-w-xl">
              {agent.steps.map((step, index) => (
                <li key={step.id}>
                  <div className={cn("rounded-lg border p-4", stepTone[step.type])}>
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-[11px] font-semibold">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm font-medium">{step.title}</span>
                      <Badge tone="outline" className="capitalize">
                        {step.type}
                      </Badge>
                    </div>
                    <p className="mt-1.5 pl-[34px] text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < agent.steps.length - 1 && (
                    <div className="flex justify-center py-1.5">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}

          {tab === "runs" &&
            (agent.history.length === 0 ? (
              <EmptyState
                icon={Terminal}
                title="No runs yet"
                description="This agent has not been invoked. Enable it and send a request to see execution logs here."
              />
            ) : (
              <div className="space-y-6">
                <SimpleLineChart
                  data={latency}
                  xKey="at"
                  height={200}
                  lines={[{ key: "ms", name: "Duration (ms)" }]}
                  valueFormatter={(value) => `${value} ms`}
                />
                <TableWrapper>
                  <Table>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH>Run</TH>
                        <TH>Trigger</TH>
                        <TH>Status</TH>
                        <TH className="text-right">Duration</TH>
                        <TH className="text-right">Tokens</TH>
                        <TH>Started</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {agent.history.map((run) => (
                        <TR key={run.id}>
                          <TD className="font-mono text-xs">{run.id}</TD>
                          <TD className="text-sm text-muted-foreground">{run.trigger}</TD>
                          <TD>
                            <span className="flex items-center gap-1.5 text-sm">
                              {run.status === "success" ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-danger" aria-hidden />
                              )}
                              <span className="capitalize">{run.status}</span>
                            </span>
                          </TD>
                          <TD className="text-right text-sm">{run.durationMs} ms</TD>
                          <TD className="text-right text-sm">{formatNumber(run.tokens)}</TD>
                          <TD className="text-sm text-muted-foreground">{formatRelativeTime(run.startedAt)}</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </TableWrapper>
              </div>
            ))}

          {tab === "versions" && (
            <ul className="space-y-3">
              {agent.versions.map((version, index) => (
                <li
                  key={version.version}
                  className="flex flex-wrap items-start gap-3 rounded-lg border border-border p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <GitBranch className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {version.version}
                      {index === 0 && <Badge tone="success">Current</Badge>}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{version.summary}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {version.author} · {formatDate(version.createdAt, "long")}
                    </p>
                  </div>
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({ title: `Restored ${version.version}`, description: "A new version was created from this snapshot.", tone: "success" })
                      }
                    >
                      Restore
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
