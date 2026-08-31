"use client";

import * as React from "react";
import Link from "next/link";
import { History, Loader2, Lock, Plus, ShieldCheck, Table2, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/switch";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/components/ui/toast";
import { permissionAudit, permissionModules, roles as seedRoles } from "@/data/roles";
import { users } from "@/data/users";
import type { Role } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

export function RolesView() {
  const { toast } = useToast();
  const [roles, setRoles] = React.useState<Role[]>(seedRoles);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", description: "", basedOn: "role_member" });
  const [assign, setAssign] = React.useState({ userId: users[2].id, roleId: "role_member" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const create = () => {
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 3) nextErrors.name = "Give the role a name.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCreating(true);
    window.setTimeout(() => {
      setCreating(false);
      setCreateOpen(false);
      const base = roles.find((role) => role.id === form.basedOn);
      setRoles((current) => [
        ...current,
        {
          id: `role_${Date.now()}`,
          name: form.name,
          description: form.description || `Custom role based on ${base?.name}.`,
          isSystem: false,
          members: 0,
          permissions: base ? base.permissions.map((permission) => ({ ...permission })) : [],
        },
      ]);
      setForm({ name: "", description: "", basedOn: "role_member" });
      toast({ title: "Role created", description: `${form.name} is ready to assign.`, tone: "success" });
    }, 700);
  };

  const assignRole = () => {
    const user = users.find((item) => item.id === assign.userId);
    const role = roles.find((item) => item.id === assign.roleId);
    setAssignOpen(false);
    toast({ title: "Role assigned", description: `${user?.name} is now a ${role?.name}.`, tone: "success" });
  };

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="Control what each role can view, create, edit and delete."
        actions={
          <>
            <Button variant="outline" onClick={() => setAssignOpen(true)}>
              <Users className="h-4 w-4" aria-hidden />
              Assign role
            </Button>
            <Link
              href="/roles/matrix"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Table2 className="h-4 w-4" aria-hidden />
              Matrix editor
            </Link>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              New role
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
          const granted = role.permissions.filter((permission) => permission.view).length;
          const members = users.filter((user) => user.role === role.name);
          return (
            <Card key={role.id} className="flex flex-col">
              <CardContent className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" aria-hidden />
                  </span>
                  {role.isSystem ? (
                    <Badge tone="outline" className="gap-1">
                      <Lock className="h-3 w-3" aria-hidden />
                      System
                    </Badge>
                  ) : (
                    <Badge tone="primary">Custom</Badge>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold">{role.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{role.description}</p>

                <div className="mt-4 flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2.5 text-xs">
                  <span className="text-muted-foreground">Modules visible</span>
                  <span className="font-semibold">
                    {granted} / {permissionModules.length}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {members.length} member{members.length === 1 ? "" : "s"}
                  </p>
                  {members.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nobody has this role yet.</p>
                  ) : (
                    <div className="flex items-center -space-x-2">
                      {members.slice(0, 5).map((member) => (
                        <Avatar key={member.id} name={member.name} size="sm" className="ring-2 ring-card" />
                      ))}
                      {members.length > 5 && (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
                          +{members.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="border-t border-border px-5 py-3">
                <Link
                  href={`/roles/matrix?role=${role.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Edit permissions
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-primary" aria-hidden />
              Permission audit log
            </CardTitle>
            <CardDescription>Every change to roles and assignments.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {permissionAudit.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <Avatar name={entry.actor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{entry.actor}</span>{" "}
                    <span className="text-muted-foreground">{entry.action}</span>{" "}
                    <span className="font-medium">{entry.target}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(entry.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a custom role"
        description="Start from an existing role, then fine-tune permissions in the matrix editor."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Create role
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Role name" htmlFor="role-name" error={errors.name}>
            <Input
              id="role-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Support Lead"
            />
          </Field>
          <Field label="Description" htmlFor="role-description">
            <Textarea
              id="role-description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Manages support agents and prompts, no billing access."
              className="min-h-[72px]"
            />
          </Field>
          <Field label="Based on" htmlFor="role-base" hint="Permissions are copied from this role.">
            <Select
              id="role-base"
              value={form.basedOn}
              onChange={(event) => setForm((current) => ({ ...current, basedOn: event.target.value }))}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>

      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign a role"
        description="Change a member's role without leaving this page."
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={assignRole}>Assign role</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Member" htmlFor="assign-user">
            <Select
              id="assign-user"
              value={assign.userId}
              onChange={(event) => setAssign((current) => ({ ...current, userId: event.target.value }))}
            >
              {users
                .filter((user) => user.role !== "Owner")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.email}
                  </option>
                ))}
            </Select>
          </Field>
          <Field label="New role" htmlFor="assign-role">
            <Select
              id="assign-role"
              value={assign.roleId}
              onChange={(event) => setAssign((current) => ({ ...current, roleId: event.target.value }))}
            >
              {roles
                .filter((role) => role.name !== "Owner")
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
            </Select>
          </Field>
          <label className="flex items-start gap-2.5 rounded-md border border-border p-3">
            <Checkbox checked onChange={() => undefined} />
            <span className="text-xs text-muted-foreground">
              Notify the member by email about their new permissions.
            </span>
          </label>
        </div>
      </Modal>
    </>
  );
}
