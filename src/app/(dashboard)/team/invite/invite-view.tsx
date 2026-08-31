"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Link2, Loader2, Mail, Plus, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/components/ui/toast";
import { roles } from "@/data/roles";
import { users } from "@/data/users";
import { formatRelativeTime } from "@/lib/utils";

interface Row {
  id: number;
  email: string;
  role: string;
}

export function InviteView() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>([{ id: 1, email: "", role: "Member" }]);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<number, string>>({});
  const [copied, setCopied] = React.useState(false);

  const inviteLink = "https://app.nexus.ai/join/nexus-labs?token=inv_8f2a1c9d";
  const pending = users.filter((user) => user.status === "pending");

  const addRow = () => setRows((current) => [...current, { id: Date.now(), email: "", role: "Member" }]);
  const removeRow = (id: number) => setRows((current) => current.filter((row) => row.id !== id));
  const update = (id: number, patch: Partial<Row>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const send = () => {
    const nextErrors: Record<number, string> = {};
    rows.forEach((row) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) nextErrors[row.id] = "Enter a valid email address.";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      toast({
        title: `${rows.length} invitation${rows.length > 1 ? "s" : ""} sent`,
        description: "Invites expire in 7 days. You can resend them from the team list.",
        tone: "success",
      });
      setRows([{ id: Date.now(), email: "", role: "Member" }]);
      setMessage("");
    }, 800);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <>
      <PageHeader
        title="Invite team members"
        description="Send email invitations or share a join link with your workspace."
        breadcrumbs={[{ label: "Team Members", href: "/team" }, { label: "Invite" }]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" aria-hidden />
                Email invitations
              </CardTitle>
              <CardDescription>Each person gets a link that expires in 7 days.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {rows.map((row, index) => (
              <div key={row.id} className="flex flex-wrap items-start gap-3">
                <Field
                  label={index === 0 ? "Email address" : ""}
                  htmlFor={`invite-email-${row.id}`}
                  error={errors[row.id]}
                  className="min-w-[200px] flex-1"
                >
                  <Input
                    id={`invite-email-${row.id}`}
                    type="email"
                    value={row.email}
                    onChange={(event) => update(row.id, { email: event.target.value })}
                    placeholder="teammate@company.com"
                  />
                </Field>
                <Field label={index === 0 ? "Role" : ""} htmlFor={`invite-role-${row.id}`} className="w-auto">
                  <Select
                    id={`invite-role-${row.id}`}
                    value={row.role}
                    onChange={(event) => update(row.id, { role: event.target.value })}
                    className="min-w-[150px]"
                  >
                    {roles
                      .filter((item) => item.name !== "Owner")
                      .map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </Select>
                </Field>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label="Remove this invitation"
                    className={index === 0 ? "mt-6 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-danger" : "rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-danger"}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add another
            </Button>

            <Field label="Personal message (optional)" htmlFor="invite-message">
              <Textarea
                id="invite-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi! Joining our AI workspace so we can share agents and prompts."
                className="min-h-[88px]"
              />
            </Field>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
              <Link
                href="/team"
                className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancel
              </Link>
              <Button onClick={send} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                {sending ? "Sending…" : `Send ${rows.length} invitation${rows.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Invite link
                </CardTitle>
                <CardDescription>Anyone with this link can join as a Member.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 p-2.5">
                <code className="min-w-0 flex-1 truncate font-mono text-[11px]">{inviteLink}</code>
                <Button variant="ghost" size="sm" onClick={copyLink}>
                  {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => toast({ title: "Link rotated", description: "The previous link no longer works.", tone: "warning" })}
              >
                Reset link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pending invitations</CardTitle>
                <CardDescription>{pending.length} awaiting acceptance.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {pending.length === 0 ? (
                <p className="text-xs text-muted-foreground">No pending invitations.</p>
              ) : (
                <ul className="space-y-3">
                  {pending.map((user) => (
                    <li key={user.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Invited {formatRelativeTime(user.joinedAt)}
                        </p>
                      </div>
                      <Badge tone="warning">{user.role}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
