"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Clock, Download, MessagesSquare, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker, type DateRangeId } from "@/components/ui/date-range-picker";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { useToast } from "@/components/ui/toast";
import { DonutChart, SimpleBarChart, SimpleLineChart } from "@/components/charts/simple-charts";
import { Heatmap } from "@/components/charts/heatmap";
import {
  activityHeatmap,
  agentPerformance,
  channelSplit,
  conversationTrend,
  errorBreakdown,
  intentSplit,
  latencyDistribution,
} from "@/data/analytics";
import { agents } from "@/data/agents";
import { formatNumber } from "@/lib/utils";

export function AnalyticsView() {
  const { toast } = useToast();
  const [range, setRange] = React.useState<DateRangeId>("30d");
  const [segment, setSegment] = React.useState("all");

  const totalConversations = conversationTrend.reduce((sum, point) => sum + point.conversations, 0);
  const avgSession =
    conversationTrend.reduce((sum, point) => sum + point.avgSessionMin, 0) / conversationTrend.length;
  const totalErrors = errorBreakdown.reduce((sum, row) => sum + row.count, 0);
  const weightedSuccess =
    agentPerformance.reduce((sum, row) => sum + row.successRate * row.runs, 0) /
    agentPerformance.reduce((sum, row) => sum + row.runs, 0);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Performance, reliability and engagement across your AI workspace."
        actions={
          <>
            <Select
              aria-label="Segment"
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              className="w-auto min-w-[160px]"
            >
              <option value="all">All agents</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </Select>
            <DateRangePicker value={range} onChange={setRange} />
            <Button
              variant="outline"
              onClick={() => toast({ title: "Export queued", description: "Analytics data as CSV.", tone: "info" })}
            >
              <Download className="h-4 w-4" aria-hidden />
              Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversations" value={formatNumber(totalConversations)} change={9.8} icon={MessagesSquare} />
        <StatCard label="Avg session" value={`${avgSession.toFixed(1)} min`} change={3.2} icon={Clock} />
        <StatCard label="Success rate" value={`${weightedSuccess.toFixed(1)}%`} change={0.9} icon={Activity} />
        <StatCard label="Errors" value={formatNumber(totalErrors)} change={-12.4} invertChange icon={AlertTriangle} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Conversation volume</CardTitle>
              <CardDescription>Daily conversations and new users.</CardDescription>
            </div>
            <Link href="/analytics/users" className="text-xs font-medium text-primary hover:underline">
              User analytics
            </Link>
          </CardHeader>
          <CardContent>
            <SimpleLineChart
              data={conversationTrend}
              xKey="date"
              height={280}
              lines={[
                { key: "conversations", name: "Conversations" },
                { key: "newUsers", name: "New users" },
              ]}
              valueFormatter={(value) => formatNumber(value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Traffic by channel</CardTitle>
              <CardDescription>Where requests originate.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart data={channelSplit} height={200} centerValue="4" centerLabel="channels" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Agent success rate</CardTitle>
              <CardDescription>Weighted by run volume.</CardDescription>
            </div>
            <Link href="/analytics/agents" className="text-xs font-medium text-primary hover:underline">
              Agent detail
            </Link>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={agentPerformance}
              xKey="agent"
              layout="horizontal"
              height={260}
              bars={[{ key: "successRate", name: "Success rate" }]}
              valueFormatter={(value) => `${value}%`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Latency distribution</CardTitle>
              <CardDescription>How long runs actually take.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={latencyDistribution}
              xKey="bucket"
              height={260}
              bars={[{ key: "runs", name: "Runs" }]}
              valueFormatter={(value) => `${formatNumber(value)} runs`}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Activity heatmap</CardTitle>
            <CardDescription>Runs by day of week and hour (UTC).</CardDescription>
          </div>
          <Badge tone="outline">Peak: Wed 14:00</Badge>
        </CardHeader>
        <CardContent>
          <Heatmap rows={activityHeatmap} />
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Error breakdown</CardTitle>
              <CardDescription>What is actually failing.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {errorBreakdown.map((row) => (
                <li key={row.reason}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{row.reason}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(row.count)} · {row.share}%
                    </span>
                  </div>
                  <Progress
                    value={row.share}
                    tone={row.share > 30 ? "danger" : row.share > 15 ? "warning" : "primary"}
                    label={row.reason}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Intent mix</CardTitle>
              <CardDescription>What people ask agents to do.</CardDescription>
            </div>
            <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <DonutChart data={intentSplit} height={220} centerValue="5" centerLabel="intents" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
