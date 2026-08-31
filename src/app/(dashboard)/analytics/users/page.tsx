import type { Metadata } from "next";
import { Clock, MessagesSquare, TrendingUp, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { SimpleLineChart } from "@/components/charts/simple-charts";
import { Heatmap } from "@/components/charts/heatmap";
import { activityHeatmap, conversationTrend, retentionCohorts, topUsers } from "@/data/analytics";
import { formatCompact, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "User analytics" };

export default function UserAnalyticsPage() {
  const totalConversations = conversationTrend.reduce((sum, point) => sum + point.conversations, 0);
  const newUsers = conversationTrend.reduce((sum, point) => sum + point.newUsers, 0);
  const avgSession =
    conversationTrend.reduce((sum, point) => sum + point.avgSessionMin, 0) / conversationTrend.length;

  return (
    <>
      <PageHeader
        title="User analytics"
        description="How your team actually uses the workspace: volume, session length and retention."
        breadcrumbs={[{ label: "Analytics", href: "/analytics" }, { label: "User analytics" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversations" value={formatNumber(totalConversations)} change={9.8} icon={MessagesSquare} />
        <StatCard label="New users" value={String(newUsers)} change={14.2} icon={UserPlus} />
        <StatCard label="Avg session" value={`${avgSession.toFixed(1)} min`} change={3.2} icon={Clock} />
        <StatCard label="Week-4 retention" value="59%" change={5.1} icon={TrendingUp} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Engagement over time</CardTitle>
            <CardDescription>Conversations, new users and average session length.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleLineChart
            data={conversationTrend}
            xKey="date"
            height={300}
            lines={[
              { key: "conversations", name: "Conversations" },
              { key: "newUsers", name: "New users" },
              { key: "avgSessionMin", name: "Avg session (min)" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Most active members</CardTitle>
              <CardDescription>By conversation count this period.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TableWrapper>
              <Table className="min-w-[480px]">
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Member</TH>
                    <TH className="text-right">Conversations</TH>
                    <TH className="text-right">Tokens</TH>
                    <TH className="text-right">Avg session</TH>
                  </TR>
                </THead>
                <TBody>
                  {topUsers.map((user) => (
                    <TR key={user.name}>
                      <TD>
                        <span className="flex items-center gap-2.5">
                          <Avatar name={user.name} size="sm" />
                          <span className="text-sm font-medium">{user.name}</span>
                        </span>
                      </TD>
                      <TD className="text-right text-sm">{formatNumber(user.conversations)}</TD>
                      <TD className="text-right text-sm">{formatCompact(user.tokens)}</TD>
                      <TD className="text-right text-sm">{user.avgSessionMin} min</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Retention by cohort</CardTitle>
              <CardDescription>Share of each month&rsquo;s new users still active.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TableWrapper>
              <Table className="min-w-[420px]">
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Cohort</TH>
                    {["Week 0", "Week 1", "Week 2", "Week 3", "Week 4"].map((label) => (
                      <TH key={label} className="text-center">
                        {label}
                      </TH>
                    ))}
                  </TR>
                </THead>
                <TBody>
                  {retentionCohorts.map((cohort) => (
                    <TR key={cohort.cohort}>
                      <TD className="text-sm font-medium">{cohort.cohort}</TD>
                      {([cohort.week0, cohort.week1, cohort.week2, cohort.week3, cohort.week4] as number[]).map(
                        (value, index) => (
                          <TD key={index} className="p-1.5 text-center">
                            {value === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              <span
                                className={cn(
                                  "block rounded px-2 py-1.5 text-xs font-medium",
                                  value >= 80
                                    ? "text-primary-foreground"
                                    : value >= 60
                                      ? "text-foreground"
                                      : "text-foreground",
                                )}
                                style={{ backgroundColor: `hsl(var(--chart-1) / ${value / 130})` }}
                              >
                                {value}%
                              </span>
                            )}
                          </TD>
                        ),
                      )}
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>When people work</CardTitle>
            <CardDescription>Sessions by day of week and hour (UTC).</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Heatmap rows={activityHeatmap} />
        </CardContent>
      </Card>
    </>
  );
}
