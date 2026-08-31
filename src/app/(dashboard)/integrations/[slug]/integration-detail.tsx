"use client";

import * as React from "react";
import { Check, Copy, ExternalLink, Loader2, Trash2, Webhook } from "lucide-react";
import { IntegrationIcon } from "@/components/layout/integration-icon";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox, Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import type { Integration } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";

const availableEvents = [
  { id: "agent.run.completed", label: "Agent run completed" },
  { id: "agent.run.failed", label: "Agent run failed" },
  { id: "conversation.created", label: "Conversation created" },
  { id: "quota.threshold", label: "Quota threshold reached" },
  { id: "invoice.paid", label: "Invoice paid" },
  { id: "member.invited", label: "Member invited" },
];

export function IntegrationDetail({ integration }: { integration: Integration }) {
  const { toast } = useToast();
  const [connected, setConnected] = React.useState(integration.connected);
  const [tab, setTab] = React.useState("settings");
  const [webhook, setWebhook] = React.useState(integration.webhookUrl ?? "");
  const [events, setEvents] = React.useState<string[]>(["agent.run.completed", "agent.run.failed"]);
  const [saving, setSaving] = React.useState(false);
  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const toggleEvent = (id: string) =>
    setEvents((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({ title: "Configuration saved", description: `${integration.name} settings were updated.`, tone: "success" });
    }, 700);
  };

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhook);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <>
      <PageHeader
        title={integration.name}
        description={integration.description}
        breadcrumbs={[{ label: "Integrations", href: "/integrations" }, { label: integration.name }]}
        actions={
          connected ? (
            <>
              <Button variant="outline" onClick={() => setDisconnectOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden />
                Disconnect
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Save configuration
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setConnected(true);
                toast({ title: "Connected", description: `${integration.name} is ready to use.`, tone: "success" });
              }}
            >
              Connect {integration.name}
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Tabs
            className="px-3"
            value={tab}
            onChange={setTab}
            items={[
              { id: "settings", label: "Configuration" },
              { id: "events", label: "Event log", count: integration.events.length },
            ]}
          />
          <CardContent className="space-y-5">
            {tab === "settings" ? (
              connected ? (
                <>
                  <Field
                    label="Webhook URL"
                    htmlFor="webhook-url"
                    hint="Nexus posts a signed JSON payload to this endpoint."
                  >
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        value={webhook}
                        onChange={(event) => setWebhook(event.target.value)}
                        className="font-mono text-xs"
                      />
                      <Button variant="outline" onClick={copyWebhook} aria-label="Copy webhook URL">
                        {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                      </Button>
                    </div>
                  </Field>

                  <div>
                    <p className="mb-2 text-xs font-medium">Subscribed events</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {availableEvents.map((event) => (
                        <label
                          key={event.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border p-3 transition-colors hover:bg-secondary/50"
                        >
                          <Checkbox checked={events.includes(event.id)} onChange={() => toggleEvent(event.id)} />
                          <span className="min-w-0">
                            <span className="block text-sm">{event.label}</span>
                            <span className="block font-mono text-[10px] text-muted-foreground">{event.id}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium">Granted scopes</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {integration.scopes.map((scope) => (
                        <li key={scope}>
                          <Badge tone="outline" className="font-mono text-[10px]">
                            {scope}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Retry failed deliveries</p>
                      <p className="text-xs text-muted-foreground">
                        Retry up to 5 times with exponential backoff.
                      </p>
                    </div>
                    <Switch checked onChange={() => undefined} label="Retry failed deliveries" />
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={Webhook}
                  title={`${integration.name} is not connected`}
                  description="Connect the integration to configure webhooks, events and scopes."
                  action={
                    <Button
                      onClick={() => {
                        setConnected(true);
                        toast({ title: "Connected", description: `${integration.name} is ready to use.`, tone: "success" });
                      }}
                    >
                      Connect {integration.name}
                    </Button>
                  }
                />
              )
            ) : integration.events.length === 0 ? (
              <EmptyState
                icon={Webhook}
                title="No events yet"
                description="Once this integration starts receiving events, deliveries appear here with their status."
              />
            ) : (
              <TableWrapper>
                <Table>
                  <THead>
                    <TR className="hover:bg-transparent">
                      <TH>Event</TH>
                      <TH>Status</TH>
                      <TH>Delivered</TH>
                      <TH className="text-right">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {integration.events.map((event) => (
                      <TR key={event.id}>
                        <TD className="font-mono text-xs">{event.event}</TD>
                        <TD>
                          <Badge tone={statusTone[event.status]} dot className="capitalize">
                            {event.status}
                          </Badge>
                        </TD>
                        <TD className="text-sm text-muted-foreground">{formatRelativeTime(event.at)}</TD>
                        <TD className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast({ title: "Redelivering", description: `${event.event} was queued again.`, tone: "info" })}
                          >
                            Redeliver
                          </Button>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="text-center">
              <span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: integration.color }}
              >
                <IntegrationIcon name={integration.icon} className="h-7 w-7" />
              </span>
              <p className="mt-3 text-base font-semibold">{integration.name}</p>
              <p className="text-xs text-muted-foreground">{integration.category}</p>
              <div className="mt-3">
                {connected ? (
                  <Badge tone="success" dot>
                    Connected
                  </Badge>
                ) : (
                  <Badge tone="outline">Not connected</Badge>
                )}
              </div>
              <dl className="mt-5 space-y-3 border-t border-border pt-5 text-left text-sm">
                {[
                  { label: "Account", value: connected ? (integration.account ?? "—") : "—" },
                  { label: "Connected", value: connected && integration.connectedAt ? formatDate(integration.connectedAt) : "—" },
                  { label: "Events (7d)", value: String(integration.events.length) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-3">
                    <dt className="text-xs text-muted-foreground">{row.label}</dt>
                    <dd className="truncate text-sm font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Set-up guides and payload reference.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Quick start guide", "Webhook payload reference", "Troubleshooting deliveries"].map((doc) => (
                <a
                  key={doc}
                  href="#"
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                >
                  {doc}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        title={`Disconnect ${integration.name}?`}
        description="Event deliveries stop immediately. Your configuration is kept in case you reconnect."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDisconnectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConnected(false);
                setDisconnectOpen(false);
                toast({ title: "Disconnected", description: `${integration.name} no longer receives events.`, tone: "warning" });
              }}
            >
              Disconnect
            </Button>
          </>
        }
      />
    </>
  );
}
