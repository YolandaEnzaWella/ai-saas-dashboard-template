"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Eye,
  KeyRound,
  Loader2,
  MoreHorizontal,
  Plus,
  ScrollText,
  Trash2,
} from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/switch";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { apiKeyLogs, apiKeys as seedKeys, apiScopes } from "@/data/api-keys";
import type { ApiKey } from "@/lib/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";

export function ApiKeysView() {
  const { toast } = useToast();
  const [keys, setKeys] = React.useState<ApiKey[]>(seedKeys);
  const [tab, setTab] = React.useState("keys");
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [revealed, setRevealed] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [pendingRevoke, setPendingRevoke] = React.useState<ApiKey | null>(null);
  const [form, setForm] = React.useState({
    name: "",
    environment: "production" as ApiKey["environment"],
    rateLimit: "300 req/min",
    scopes: ["chat:read", "chat:write"] as string[],
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const filtered = keys.filter((key) =>
    key.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggleScope = (scope: string) =>
    setForm((current) => ({
      ...current,
      scopes: current.scopes.includes(scope)
        ? current.scopes.filter((item) => item !== scope)
        : [...current.scopes, scope],
    }));

  const create = () => {
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 3) nextErrors.name = "Name the key after where it will be used.";
    if (form.scopes.length === 0) nextErrors.scopes = "Select at least one scope.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCreating(true);
    window.setTimeout(() => {
      setCreating(false);
      const prefix = form.environment === "production" ? "sk_live" : "sk_test";
      const secret = `${prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 26)}`;
      setKeys((current) => [
        {
          id: `key_${Date.now()}`,
          name: form.name,
          prefix: secret.slice(0, 12),
          scopes: form.scopes,
          createdAt: new Date().toISOString(),
          lastUsedAt: null,
          createdBy: "Amara Okafor",
          status: "active",
          rateLimit: form.rateLimit,
          requests30d: 0,
          environment: form.environment,
        },
        ...current,
      ]);
      setCreateOpen(false);
      setRevealed(secret);
      setForm({ name: "", environment: "production", rateLimit: "300 req/min", scopes: ["chat:read", "chat:write"] });
    }, 800);
  };

  const revoke = () => {
    if (!pendingRevoke) return;
    setKeys((current) =>
      current.map((key) => (key.id === pendingRevoke.id ? { ...key, status: "revoked" } : key)),
    );
    toast({ title: "Key revoked", description: `${pendingRevoke.name} can no longer authenticate.`, tone: "success" });
    setPendingRevoke(null);
  };

  const copySecret = async () => {
    if (!revealed) return;
    try {
      await navigator.clipboard.writeText(revealed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <>
      <PageHeader
        title="API Keys"
        description="Programmatic access to your agents, chat and usage data."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Create key
          </Button>
        }
      />

      <Card>
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "keys", label: "Keys", count: keys.length },
            { id: "logs", label: "Request log", count: apiKeyLogs.length },
          ]}
        />
        <CardContent className="space-y-4">
          {tab === "keys" ? (
            <>
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search keys…"
                className="max-w-sm"
              />
              {filtered.length === 0 ? (
                <EmptyState
                  icon={KeyRound}
                  title="No API keys yet"
                  description="Create a key to call the Nexus API from your backend, a script or a third-party tool."
                  action={<Button onClick={() => setCreateOpen(true)}>Create key</Button>}
                />
              ) : (
                <TableWrapper>
                  <Table>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH>Name</TH>
                        <TH>Key</TH>
                        <TH>Scopes</TH>
                        <TH>Rate limit</TH>
                        <TH className="text-right">Requests (30d)</TH>
                        <TH>Last used</TH>
                        <TH>Status</TH>
                        <TH className="w-10" />
                      </TR>
                    </THead>
                    <TBody>
                      {filtered.map((key) => (
                        <TR key={key.id} className={cn(key.status === "revoked" && "opacity-60")}>
                          <TD>
                            <p className="text-sm font-medium">{key.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {key.createdBy} · {formatDate(key.createdAt)}
                            </p>
                          </TD>
                          <TD>
                            <span className="flex items-center gap-2">
                              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                                {key.prefix}••••••••
                              </code>
                              <Badge tone={key.environment === "production" ? "primary" : "outline"}>
                                {key.environment === "production" ? "live" : "test"}
                              </Badge>
                            </span>
                          </TD>
                          <TD>
                            <span className="flex flex-wrap gap-1">
                              {key.scopes.slice(0, 2).map((scope) => (
                                <Badge key={scope} tone="outline" className="font-mono text-[10px]">
                                  {scope}
                                </Badge>
                              ))}
                              {key.scopes.length > 2 && (
                                <Badge tone="outline">+{key.scopes.length - 2}</Badge>
                              )}
                            </span>
                          </TD>
                          <TD className="text-sm text-muted-foreground">{key.rateLimit}</TD>
                          <TD className="text-right text-sm">{formatNumber(key.requests30d)}</TD>
                          <TD className="text-sm text-muted-foreground">
                            {key.lastUsedAt ? <RelativeTime value={key.lastUsedAt} /> : "Never"}
                          </TD>
                          <TD>
                            <Badge tone={statusTone[key.status]} dot className="capitalize">
                              {key.status}
                            </Badge>
                          </TD>
                          <TD>
                            <Dropdown
                              trigger={({ toggle }) => (
                                <button
                                  type="button"
                                  onClick={toggle}
                                  aria-label={`Actions for ${key.name}`}
                                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                                </button>
                              )}
                            >
                              {(close) => (
                                <>
                                  <DropdownItem
                                    onClick={() => {
                                      toast({
                                        title: "Secrets are shown once",
                                        description: "For security we never store the full key. Rotate it if it was lost.",
                                        tone: "warning",
                                      });
                                      close();
                                    }}
                                  >
                                    <Eye className="h-4 w-4 text-muted-foreground" aria-hidden />
                                    Why can&rsquo;t I see the key?
                                  </DropdownItem>
                                  <DropdownItem
                                    onClick={() => {
                                      setTab("logs");
                                      close();
                                    }}
                                  >
                                    <ScrollText className="h-4 w-4 text-muted-foreground" aria-hidden />
                                    View usage log
                                  </DropdownItem>
                                  <DropdownSeparator />
                                  <DropdownItem
                                    tone="danger"
                                    disabled={key.status === "revoked"}
                                    onClick={() => {
                                      setPendingRevoke(key);
                                      close();
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" aria-hidden />
                                    Revoke key
                                  </DropdownItem>
                                </>
                              )}
                            </Dropdown>
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </TableWrapper>
              )}
            </>
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Time</TH>
                    <TH>Key</TH>
                    <TH>Endpoint</TH>
                    <TH>Method</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Latency</TH>
                    <TH>IP</TH>
                  </TR>
                </THead>
                <TBody>
                  {apiKeyLogs.map((log) => {
                    const keyName = keys.find((key) => key.id === log.keyId)?.name ?? log.keyId;
                    const ok = log.statusCode < 400;
                    return (
                      <TR key={log.id}>
                        <TD className="text-sm text-muted-foreground"><RelativeTime value={log.at} /></TD>
                        <TD className="text-sm font-medium">{keyName}</TD>
                        <TD className="font-mono text-xs">{log.endpoint}</TD>
                        <TD>
                          <Badge tone="outline">{log.method}</Badge>
                        </TD>
                        <TD>
                          <Badge tone={ok ? "success" : log.statusCode >= 500 ? "danger" : "warning"}>
                            {log.statusCode}
                          </Badge>
                        </TD>
                        <TD className="text-right text-sm">{log.latencyMs} ms</TD>
                        <TD className="font-mono text-xs text-muted-foreground">{log.ip}</TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </TableWrapper>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden />
              Keep keys out of client code
            </CardTitle>
            <CardDescription>
              A live key in a browser bundle can be extracted by anyone. Call the API from your
              server, or issue short-lived tokens to the client.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Create key */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create an API key"
        description="Scope the key down to only what the integration needs."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {creating ? "Creating…" : "Create key"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Key name" htmlFor="key-name" error={errors.name} hint="Where will this key be used?">
            <Input
              id="key-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="production-backend"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Environment" htmlFor="key-env">
              <Select
                id="key-env"
                value={form.environment}
                onChange={(event) =>
                  setForm((current) => ({ ...current, environment: event.target.value as ApiKey["environment"] }))
                }
              >
                <option value="production">Production (sk_live)</option>
                <option value="development">Development (sk_test)</option>
              </Select>
            </Field>
            <Field label="Rate limit" htmlFor="key-rate">
              <Select
                id="key-rate"
                value={form.rateLimit}
                onChange={(event) => setForm((current) => ({ ...current, rateLimit: event.target.value }))}
              >
                <option>60 req/min</option>
                <option>120 req/min</option>
                <option>300 req/min</option>
                <option>600 req/min</option>
              </Select>
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium">Scopes</p>
            <div className="space-y-2 rounded-md border border-border p-3">
              {apiScopes.map((scope) => (
                <label key={scope.id} className="flex cursor-pointer items-start gap-2.5">
                  <Checkbox checked={form.scopes.includes(scope.id)} onChange={() => toggleScope(scope.id)} />
                  <span className="min-w-0">
                    <span className="block font-mono text-xs">{scope.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{scope.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.scopes && <p className="mt-1.5 text-xs text-danger">{errors.scopes}</p>}
          </div>
        </div>
      </Modal>

      {/* Reveal once (FR-API-02) */}
      <Modal
        open={revealed !== null}
        onClose={() => {
          setRevealed(null);
          toast({ title: "Key created", description: "Store it somewhere safe — it will not be shown again.", tone: "success" });
        }}
        title="Copy your API key now"
        description="This is the only time the full key is shown. If you lose it you will need to create a new one."
        footer={
          <Button
            onClick={() => {
              setRevealed(null);
              toast({ title: "Key created", description: "Store it somewhere safe — it will not be shown again.", tone: "success" });
            }}
          >
            I have saved it
          </Button>
        }
      >
        <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 p-3">
          <code className="min-w-0 flex-1 break-all font-mono text-xs">{revealed}</code>
          <Button variant="outline" size="sm" onClick={copySecret}>
            {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={pendingRevoke !== null}
        onClose={() => setPendingRevoke(null)}
        title="Revoke this key?"
        description={`Any service using ${pendingRevoke?.name ?? "this key"} will start receiving 401 responses immediately.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingRevoke(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={revoke}>
              Revoke key
            </Button>
          </>
        }
      />
    </>
  );
}
