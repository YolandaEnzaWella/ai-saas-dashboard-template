"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, RotateCcw, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/switch";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/input";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { roles as seedRoles } from "@/data/roles";
import type { Permission } from "@/lib/types";
import { cn } from "@/lib/utils";

const actions = ["view", "create", "edit", "delete"] as const;

/** Permission matrix editor — modules x actions (FR-ROL-03). */
export function MatrixView() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") ?? seedRoles[1].id;

  const [roleId, setRoleId] = React.useState(
    seedRoles.some((role) => role.id === initialRole) ? initialRole : seedRoles[1].id,
  );
  const [matrix, setMatrix] = React.useState<Record<string, Permission[]>>(() =>
    Object.fromEntries(seedRoles.map((role) => [role.id, role.permissions.map((p) => ({ ...p }))])),
  );
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const role = seedRoles.find((item) => item.id === roleId)!;
  const permissions = matrix[roleId];
  const locked = role.name === "Owner";

  const toggle = (module: string, action: (typeof actions)[number]) => {
    if (locked) return;
    setDirty(true);
    setMatrix((current) => ({
      ...current,
      [roleId]: current[roleId].map((permission) => {
        if (permission.module !== module) return permission;
        const next = { ...permission, [action]: !permission[action] };
        // Create/edit/delete are meaningless without view, so keep them consistent.
        if (action === "view" && !next.view) {
          next.create = false;
          next.edit = false;
          next.delete = false;
        }
        if (action !== "view" && next[action]) next.view = true;
        return next;
      }),
    }));
  };

  const toggleRow = (module: string, value: boolean) => {
    if (locked) return;
    setDirty(true);
    setMatrix((current) => ({
      ...current,
      [roleId]: current[roleId].map((permission) =>
        permission.module === module
          ? { ...permission, view: value, create: value, edit: value, delete: value }
          : permission,
      ),
    }));
  };

  const toggleColumn = (action: (typeof actions)[number], value: boolean) => {
    if (locked) return;
    setDirty(true);
    setMatrix((current) => ({
      ...current,
      [roleId]: current[roleId].map((permission) => ({
        ...permission,
        [action]: value,
        ...(action !== "view" && value ? { view: true } : {}),
        ...(action === "view" && !value ? { create: false, edit: false, delete: false } : {}),
      })),
    }));
  };

  const reset = () => {
    setMatrix((current) => ({ ...current, [roleId]: role.permissions.map((p) => ({ ...p })) }));
    setDirty(false);
    toast({ title: "Changes discarded", description: `${role.name} was reset to its saved permissions.`, tone: "info" });
  };

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setDirty(false);
      toast({ title: "Permissions saved", description: `${role.name} updated. Members see the change on their next request.`, tone: "success" });
    }, 800);
  };

  const grantedCount = permissions.reduce(
    (sum, permission) => sum + actions.filter((action) => permission[action]).length,
    0,
  );

  return (
    <>
      <PageHeader
        title="Permission matrix"
        description="Grant per-module access for each action. Changes apply to every member with the role."
        breadcrumbs={[{ label: "Roles & Permissions", href: "/roles" }, { label: "Matrix editor" }]}
        actions={
          <>
            <Button variant="outline" onClick={reset} disabled={!dirty || locked}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Discard
            </Button>
            <Button onClick={save} disabled={!dirty || saving || locked}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
              {saving ? "Saving…" : "Save permissions"}
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              aria-label="Select a role"
              value={roleId}
              onChange={(event) => {
                setRoleId(event.target.value);
                setDirty(false);
              }}
              className="w-auto min-w-[180px]"
            >
              {seedRoles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <div>
              <CardTitle>{role.name}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {locked && (
              <Badge tone="outline" className="gap-1">
                <Lock className="h-3 w-3" aria-hidden />
                Not editable
              </Badge>
            )}
            {dirty && <Badge tone="warning">Unsaved changes</Badge>}
            <Badge tone="primary">{grantedCount} grants</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {locked && (
            <p className="border-b border-border bg-secondary/50 px-5 py-3 text-xs text-muted-foreground">
              The Owner role always has full access — it cannot be restricted. Create a custom role
              instead if you need narrower permissions.
            </p>
          )}
          <TableWrapper>
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH className="sticky left-0 bg-card">Module</TH>
                  {actions.map((action) => {
                    const allOn = permissions.every((permission) => permission[action]);
                    return (
                      <TH key={action} className="text-center capitalize">
                        <span className="flex flex-col items-center gap-1.5">
                          {action}
                          <button
                            type="button"
                            disabled={locked}
                            onClick={() => toggleColumn(action, !allOn)}
                            className="text-[10px] font-normal normal-case text-primary hover:underline disabled:opacity-50"
                          >
                            {allOn ? "Clear all" : "Select all"}
                          </button>
                        </span>
                      </TH>
                    );
                  })}
                  <TH className="text-center">Row</TH>
                </TR>
              </THead>
              <TBody>
                {permissions.map((permission) => {
                  const allOn = actions.every((action) => permission[action]);
                  return (
                    <TR key={permission.module}>
                      <TD className="sticky left-0 bg-card text-sm font-medium">{permission.module}</TD>
                      {actions.map((action) => (
                        <TD key={action} className="text-center">
                          <span className="inline-flex justify-center">
                            <Checkbox
                              checked={permission[action]}
                              disabled={locked}
                              onChange={() => toggle(permission.module, action)}
                              ariaLabel={`${action} ${permission.module}`}
                              id={`${roleId}-${permission.module}-${action}`}
                            />
                          </span>
                        </TD>
                      ))}
                      <TD className="text-center">
                        <button
                          type="button"
                          disabled={locked}
                          onClick={() => toggleRow(permission.module, !allOn)}
                          className={cn(
                            "text-xs font-medium text-primary hover:underline disabled:opacity-50",
                          )}
                        >
                          {allOn ? "Clear" : "All"}
                        </button>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </TableWrapper>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-4 py-4 text-xs text-muted-foreground">
          <p className="min-w-0 flex-1">
            Granting <span className="font-medium text-foreground">create</span>,{" "}
            <span className="font-medium text-foreground">edit</span> or{" "}
            <span className="font-medium text-foreground">delete</span> automatically grants{" "}
            <span className="font-medium text-foreground">view</span> — a member cannot change what
            they cannot see.
          </p>
          <Link href="/roles" className="shrink-0 font-medium text-primary hover:underline">
            Back to roles
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
