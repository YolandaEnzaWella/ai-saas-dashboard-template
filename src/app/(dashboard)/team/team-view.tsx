"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MoreHorizontal, Search, ShieldCheck, Trash2, UserMinus, UserPlus, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { StatCard } from "@/components/ui/stat-card";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { roles } from "@/data/roles";
import { team, users as seedUsers } from "@/data/users";
import type { RoleName, User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";

export function TeamView() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(seedUsers);
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [pendingRemove, setPendingRemove] = React.useState<User | null>(null);

  const filtered = users.filter((user) => {
    const needle = query.trim().toLowerCase();
    return (
      (!needle || user.name.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle)) &&
      (role === "all" || user.role === role) &&
      (status === "all" || user.status === status)
    );
  });

  const changeRole = (id: string, next: RoleName) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role: next } : user)));
    const user = users.find((item) => item.id === id);
    toast({ title: "Role updated", description: `${user?.name} is now a ${next}.`, tone: "success" });
  };

  const toggleActive = (id: string) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status: user.status === "disabled" ? "active" : "disabled" } : user,
      ),
    );
  };

  const remove = () => {
    if (!pendingRemove) return;
    setUsers((current) => current.filter((user) => user.id !== pendingRemove.id));
    toast({ title: "Member removed", description: `${pendingRemove.name} lost access to this workspace.`, tone: "success" });
    setPendingRemove(null);
  };

  const active = users.filter((user) => user.status === "active").length;
  const pending = users.filter((user) => user.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Team Members"
        description="Everyone with access to this workspace, and what they can do."
        actions={
          <Link
            href="/team/invite"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Invite members
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active members" value={String(active)} icon={Users} hint={`of ${team.seats} seats`} />
        <StatCard label="Pending invites" value={String(pending)} icon={Mail} hint="expire after 7 days" />
        <StatCard label="Admins" value={String(users.filter((u) => u.role === "Admin" || u.role === "Owner").length)} icon={ShieldCheck} />
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground">Seat usage</p>
          <p className="mt-3 text-2xl font-semibold">
            {team.seatsUsed}
            <span className="ml-1 text-sm font-normal text-muted-foreground">/ {team.seats}</span>
          </p>
          <Progress
            className="mt-3"
            value={(team.seatsUsed / team.seats) * 100}
            tone="accent"
            label="Seat usage"
          />
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name or email…"
            className="min-w-[200px] flex-1"
          />
          <Select
            aria-label="Filter by role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-auto min-w-[150px]"
          >
            <option value="all">All roles</option>
            {roles.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-auto min-w-[140px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="disabled">Disabled</option>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No members match these filters"
              description="Clear the filters, or invite someone new to the workspace."
              className="m-5"
              action={
                <Link
                  href="/team/invite"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                >
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Invite members
                </Link>
              }
            />
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Member</TH>
                    <TH>Role</TH>
                    <TH>Status</TH>
                    <TH>Last active</TH>
                    <TH>Joined</TH>
                    <TH className="w-10" />
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((user) => (
                    <TR key={user.id}>
                      <TD>
                        <Link href={`/team/${user.id}`} className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium hover:text-primary">
                              {user.name}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </span>
                        </Link>
                      </TD>
                      <TD>
                        <Select
                          aria-label={`Role for ${user.name}`}
                          value={user.role}
                          onChange={(event) => changeRole(user.id, event.target.value as RoleName)}
                          disabled={user.role === "Owner"}
                          className="h-8 w-auto min-w-[140px] text-xs"
                        >
                          {roles.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      </TD>
                      <TD>
                        <Badge tone={statusTone[user.status]} dot className="capitalize">
                          {user.status === "pending" ? "Pending invite" : user.status}
                        </Badge>
                      </TD>
                      <TD className="text-sm text-muted-foreground"><RelativeTime value={user.lastActive} /></TD>
                      <TD className="text-sm text-muted-foreground">{formatDate(user.joinedAt)}</TD>
                      <TD>
                        <Dropdown
                          trigger={({ toggle }) => (
                            <button
                              type="button"
                              onClick={toggle}
                              aria-label={`Actions for ${user.name}`}
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden />
                            </button>
                          )}
                        >
                          {(close) => (
                            <>
                              <DropdownLabel>{user.name}</DropdownLabel>
                              <Link href={`/team/${user.id}`} onClick={close}>
                                <DropdownItem>
                                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
                                  View profile
                                </DropdownItem>
                              </Link>
                              {user.status === "pending" && (
                                <DropdownItem
                                  onClick={() => {
                                    toast({ title: "Invitation resent", description: `A new link was sent to ${user.email}.`, tone: "success" });
                                    close();
                                  }}
                                >
                                  <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                                  Resend invite
                                </DropdownItem>
                              )}
                              <DropdownItem
                                disabled={user.role === "Owner"}
                                onClick={() => {
                                  toggleActive(user.id);
                                  close();
                                }}
                              >
                                <UserMinus className="h-4 w-4 text-muted-foreground" aria-hidden />
                                {user.status === "disabled" ? "Re-enable member" : "Disable member"}
                              </DropdownItem>
                              <DropdownSeparator />
                              <DropdownItem
                                tone="danger"
                                disabled={user.role === "Owner"}
                                onClick={() => {
                                  setPendingRemove(user);
                                  close();
                                }}
                              >
                                <Trash2 className="h-4 w-4" aria-hidden />
                                Remove from workspace
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
        </CardContent>
      </Card>

      <Modal
        open={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        title="Remove this member?"
        description={`${pendingRemove?.name ?? ""} will immediately lose access. Their agents and prompts stay in the workspace.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingRemove(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={remove}>
              Remove member
            </Button>
          </>
        }
      />
    </>
  );
}
