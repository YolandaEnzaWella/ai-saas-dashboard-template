"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AlertTriangle, Loader2, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl, Tabs } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { locales } from "@/i18n";
import { team } from "@/data/users";

export function SettingsView() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [tab, setTab] = React.useState("general");
  const [saving, setSaving] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");

  const [general, setGeneral] = React.useState({
    workspace: team.name,
    slug: "nexus-labs",
    description: "AI automation for support and revenue teams.",
    locale: "en",
    timezone: "UTC",
    dateFormat: "MMM D, YYYY",
  });

  const [security, setSecurity] = React.useState({
    twoFactor: true,
    ssoOnly: false,
    sessionTimeout: "24",
    ipAllowlist: "",
    auditExport: true,
  });

  const [defaults, setDefaults] = React.useState({
    model: "nexus-large",
    retention: "12",
    shareAgents: true,
    allowMemberKeys: true,
  });

  React.useEffect(() => setMounted(true), []);

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({ title: "Settings saved", description: "Your workspace settings were updated.", tone: "success" });
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Workspace configuration, security policy and AI defaults."
        actions={
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
            Save changes
          </Button>
        }
      />

      <Card>
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "general", label: "General" },
            { id: "appearance", label: "Appearance" },
            { id: "security", label: "Security" },
            { id: "ai", label: "AI defaults" },
            { id: "danger", label: "Danger zone" },
          ]}
        />
        <CardContent className="space-y-5">
          {tab === "general" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Workspace name" htmlFor="workspace-name">
                  <Input
                    id="workspace-name"
                    value={general.workspace}
                    onChange={(event) => setGeneral((c) => ({ ...c, workspace: event.target.value }))}
                  />
                </Field>
                <Field label="Workspace URL" htmlFor="workspace-slug" hint="app.nexus.ai/{slug}">
                  <Input
                    id="workspace-slug"
                    value={general.slug}
                    onChange={(event) => setGeneral((c) => ({ ...c, slug: event.target.value }))}
                  />
                </Field>
              </div>
              <Field label="Description" htmlFor="workspace-description">
                <Textarea
                  id="workspace-description"
                  value={general.description}
                  onChange={(event) => setGeneral((c) => ({ ...c, description: event.target.value }))}
                  className="min-h-[72px]"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Language" htmlFor="locale" hint="More locales can be added in src/i18n.">
                  <Select
                    id="locale"
                    value={general.locale}
                    onChange={(event) => setGeneral((c) => ({ ...c, locale: event.target.value }))}
                  >
                    {locales.map((locale) => (
                      <option key={locale} value={locale}>
                        {locale === "en" ? "English" : locale}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Time zone" htmlFor="timezone">
                  <Select
                    id="timezone"
                    value={general.timezone}
                    onChange={(event) => setGeneral((c) => ({ ...c, timezone: event.target.value }))}
                  >
                    {["UTC", "America/New_York", "Europe/London", "Asia/Jakarta", "Asia/Singapore"].map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date format" htmlFor="date-format">
                  <Select
                    id="date-format"
                    value={general.dateFormat}
                    onChange={(event) => setGeneral((c) => ({ ...c, dateFormat: event.target.value }))}
                  >
                    <option>MMM D, YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </Select>
                </Field>
              </div>
            </>
          )}

          {tab === "appearance" && (
            <>
              <div>
                <p className="mb-1.5 text-xs font-medium">Theme</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Applies to your account only. System follows your device setting.
                </p>
                {mounted && (
                  <SegmentedControl
                    value={(theme as "light" | "dark" | "system") ?? "system"}
                    onChange={setTheme}
                    options={[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                      { value: "system", label: "System" },
                    ]}
                  />
                )}
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">Brand color</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every color in this template comes from CSS custom properties in{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                    src/app/globals.css
                  </code>
                  . Change <code className="font-mono text-[11px]">--primary</code> to re-skin the
                  whole dashboard.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["--primary", "--accent", "--success", "--warning", "--danger"].map((token) => (
                    <span key={token} className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                      <span
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: `hsl(var(${token}))` }}
                        aria-hidden
                      />
                      <code className="font-mono text-[11px]">{token}</code>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "security" && (
            <>
              {[
                {
                  key: "twoFactor" as const,
                  title: "Require two-factor authentication",
                  description: "Every member must set up an authenticator app before signing in.",
                },
                {
                  key: "ssoOnly" as const,
                  title: "SSO only",
                  description: "Disable password sign-in. Requires the Enterprise plan.",
                },
                {
                  key: "auditExport" as const,
                  title: "Audit log export",
                  description: "Stream permission and access events to your SIEM.",
                },
              ].map((row) => (
                <div key={row.key} className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.description}</p>
                  </div>
                  <Switch
                    checked={security[row.key]}
                    onChange={(value) => setSecurity((c) => ({ ...c, [row.key]: value }))}
                    label={row.title}
                  />
                </div>
              ))}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Session timeout (hours)" htmlFor="session-timeout">
                  <Select
                    id="session-timeout"
                    value={security.sessionTimeout}
                    onChange={(event) => setSecurity((c) => ({ ...c, sessionTimeout: event.target.value }))}
                  >
                    {["8", "24", "72", "168"].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} hours
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label="IP allowlist"
                  htmlFor="ip-allowlist"
                  hint="Comma-separated CIDR ranges. Empty allows all."
                >
                  <Input
                    id="ip-allowlist"
                    value={security.ipAllowlist}
                    onChange={(event) => setSecurity((c) => ({ ...c, ipAllowlist: event.target.value }))}
                    placeholder="203.0.113.0/24"
                  />
                </Field>
              </div>
            </>
          )}

          {tab === "ai" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default model for new agents" htmlFor="default-model">
                  <Select
                    id="default-model"
                    value={defaults.model}
                    onChange={(event) => setDefaults((c) => ({ ...c, model: event.target.value }))}
                  >
                    <option value="nexus-large">Nexus Large</option>
                    <option value="nexus-fast">Nexus Fast</option>
                    <option value="nexus-reason">Nexus Reason</option>
                    <option value="nexus-mini">Nexus Mini</option>
                  </Select>
                </Field>
                <Field label="Conversation retention (months)" htmlFor="retention">
                  <Select
                    id="retention"
                    value={defaults.retention}
                    onChange={(event) => setDefaults((c) => ({ ...c, retention: event.target.value }))}
                  >
                    {["1", "3", "6", "12", "24"].map((months) => (
                      <option key={months} value={months}>
                        {months} months
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              {[
                {
                  key: "shareAgents" as const,
                  title: "Share agents across the workspace",
                  description: "New agents are visible to every member instead of just their creator.",
                },
                {
                  key: "allowMemberKeys" as const,
                  title: "Members can create API keys",
                  description: "Turn off to restrict key creation to admins and owners.",
                },
              ].map((row) => (
                <div key={row.key} className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.description}</p>
                  </div>
                  <Switch
                    checked={defaults[row.key]}
                    onChange={(value) => setDefaults((c) => ({ ...c, [row.key]: value }))}
                    label={row.title}
                  />
                </div>
              ))}
            </>
          )}

          {tab === "danger" && (
            <>
              <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-warning" aria-hidden />
                  Transfer ownership
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hand this workspace to another admin. You keep your account but lose owner
                  permissions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => toast({ title: "Transfer started", description: "The new owner must accept within 48 hours.", tone: "warning" })}
                >
                  Transfer ownership
                </Button>
              </div>

              <div className="rounded-lg border border-danger/40 bg-danger/10 p-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                  Delete workspace
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently removes every agent, conversation, prompt and invoice. This cannot be
                  undone.
                </p>
                <Button variant="danger" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
                  Delete this workspace
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Workspace details</CardTitle>
            <CardDescription>Read-only identifiers for support requests.</CardDescription>
          </div>
          <Badge tone="outline">Team plan</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
          {[
            { label: "Workspace ID", value: team.id },
            { label: "Owner", value: "amara@nexus.ai" },
            { label: "Seats", value: `${team.seatsUsed} / ${team.seats}` },
          ].map((row) => (
            <div key={row.label}>
              <p className="text-xs text-muted-foreground">{row.label}</p>
              <p className="mt-0.5 font-mono text-xs">{row.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setConfirmText("");
        }}
        title="Delete this workspace?"
        description="All data is removed after a 30-day grace period. Active subscriptions are canceled immediately."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={confirmText !== general.workspace}
              onClick={() => {
                setDeleteOpen(false);
                setConfirmText("");
                toast({ title: "Deletion scheduled", description: "You have 30 days to change your mind.", tone: "warning" });
              }}
            >
              Delete workspace
            </Button>
          </>
        }
      >
        <Field
          label={`Type "${general.workspace}" to confirm`}
          htmlFor="confirm-delete"
        >
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={general.workspace}
          />
        </Field>
      </Modal>
    </>
  );
}
