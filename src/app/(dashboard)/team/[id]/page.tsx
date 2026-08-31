import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, Bot, Coins, Mail, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { Sparkline } from "@/components/charts/sparkline";
import { agents } from "@/data/agents";
import { getRole, roles } from "@/data/roles";
import { usageByMember, usageDaily } from "@/data/usage";
import { recentActivity, users } from "@/data/users";
import { formatCompact, formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";

export function generateStaticParams() {
  return users.map((user) => ({ id: user.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: users.find((user) => user.id === params.id)?.name ?? "Member" };
}

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const user = users.find((item) => item.id === params.id);
  if (!user) notFound();

  const usage = usageByMember.find((row) => row.id === user.id);
  const role = roles.find((item) => item.name === user.role) ?? getRole("role_member")!;
  const ownedAgents = agents.filter((agent) => agent.owner === user.name);
  const activity = recentActivity.filter((item) => item.actor === user.name);
  const allowed = role.permissions.filter((permission) => permission.view);

  return (
    <>
      <PageHeader
        title={user.name}
        description={user.email}
        breadcrumbs={[{ label: "Team Members", href: "/team" }, { label: user.name }]}
        actions={
          <a
            href={`mailto:${user.email}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Send email
          </a>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="text-center">
            <Avatar name={user.name} size="lg" className="mx-auto h-16 w-16 text-lg" />
            <p className="mt-3 text-base font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="primary">{user.role}</Badge>
              <Badge tone={statusTone[user.status]} dot className="capitalize">
                {user.status}
              </Badge>
            </div>
            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-left text-sm">
              {[
                { label: "Workspace", value: user.team },
                { label: "Joined", value: formatDate(user.joinedAt) },
                { label: "Last active", value: <RelativeTime value={user.lastActive} /> },
                { label: "Agents owned", value: String(ownedAgents.length) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Tokens (30d)"
              value={usage ? formatCompact(usage.inputTokens + usage.outputTokens) : "0"}
              change={usage?.changePct}
              icon={Coins}
            />
            <StatCard label="Requests" value={usage ? formatNumber(usage.requests) : "0"} icon={MessagesSquare} />
            <StatCard label="Cost" value={usage ? formatCurrency(usage.cost) : "$0"} icon={Activity} invertChange />
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Usage trend</CardTitle>
                <CardDescription>Requests attributed to this member over 30 days.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Sparkline data={usageDaily} dataKey="requests" height={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Permissions from {role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </div>
              <Link href="/roles" className="text-xs font-medium text-primary hover:underline">
                Edit role
              </Link>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-1.5">
                {allowed.map((permission) => (
                  <li key={permission.module}>
                    <Badge tone="outline">{permission.module}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Agents owned</CardTitle>
              <CardDescription>Agents this member maintains.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {ownedAgents.length === 0 ? (
              <p className="px-5 pb-5 text-xs text-muted-foreground">
                This member does not own any agents yet.
              </p>
            ) : (
              <TableWrapper>
                <Table className="min-w-[420px]">
                  <THead>
                    <TR className="hover:bg-transparent">
                      <TH>Agent</TH>
                      <TH>Status</TH>
                      <TH className="text-right">Runs (30d)</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {ownedAgents.map((agent) => (
                      <TR key={agent.id}>
                        <TD>
                          <Link href={`/agents/${agent.id}`} className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                            <Bot className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                            {agent.name}
                          </Link>
                        </TD>
                        <TD>
                          <Badge tone={statusTone[agent.status]} dot className="capitalize">
                            {agent.status}
                          </Badge>
                        </TD>
                        <TD className="text-right text-sm">{formatNumber(agent.runs30d)}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Activity log</CardTitle>
              <CardDescription>What this member changed recently.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recorded activity in this period.</p>
            ) : (
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="text-muted-foreground">{item.action}</span>{" "}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground"><RelativeTime value={item.at} /></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
