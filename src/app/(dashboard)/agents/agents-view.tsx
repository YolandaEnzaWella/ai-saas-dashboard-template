"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  Copy,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { agentCategories, agents as seedAgents, modelName } from "@/data/agents";
import type { Agent } from "@/lib/types";
import { formatCompact, formatDate } from "@/lib/utils";

export function AgentsView() {
  const { toast } = useToast();
  const [agents, setAgents] = React.useState<Agent[]>(seedAgents);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [pendingDelete, setPendingDelete] = React.useState<Agent | null>(null);

  const filtered = agents.filter((agent) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery =
      !needle ||
      agent.name.toLowerCase().includes(needle) ||
      agent.description.toLowerCase().includes(needle);
    const matchesCategory = category === "all" || agent.category === category;
    const matchesStatus = status === "all" || agent.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const toggleEnabled = (id: string) =>
    setAgents((current) =>
      current.map((agent) =>
        agent.id === id
          ? { ...agent, enabled: !agent.enabled, status: !agent.enabled ? "active" : "idle" }
          : agent,
      ),
    );

  const duplicate = (agent: Agent) => {
    setAgents((current) => [
      { ...agent, id: `${agent.id}_copy_${Date.now()}`, name: `${agent.name} (copy)`, status: "draft", enabled: false },
      ...current,
    ]);
    toast({ title: "Agent duplicated", description: `${agent.name} was copied as a draft.`, tone: "success" });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setAgents((current) => current.filter((agent) => agent.id !== pendingDelete.id));
    toast({ title: "Agent deleted", description: `${pendingDelete.name} was removed.`, tone: "success" });
    setPendingDelete(null);
  };

  const rowMenu = (agent: Agent) => (
    <Dropdown
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Actions for ${agent.name}`}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <>
          <Link href={`/agents/${agent.id}`} onClick={close}>
            <DropdownItem>
              <Play className="h-4 w-4 text-muted-foreground" aria-hidden />
              Open detail
            </DropdownItem>
          </Link>
          <Link href={`/agents/${agent.id}/edit`} onClick={close}>
            <DropdownItem>
              <Pencil className="h-4 w-4 text-muted-foreground" aria-hidden />
              Edit configuration
            </DropdownItem>
          </Link>
          <DropdownItem
            onClick={() => {
              duplicate(agent);
              close();
            }}
          >
            <Copy className="h-4 w-4 text-muted-foreground" aria-hidden />
            Duplicate
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            tone="danger"
            onClick={() => {
              setPendingDelete(agent);
              close();
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );

  return (
    <>
      <PageHeader
        title="AI Agents"
        description="Build, configure and monitor the agents running in your workspace."
        actions={
          <Link
            href="/agents/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New agent
          </Link>
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-center gap-3 py-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search agents…"
            className="min-w-[200px] flex-1"
          />
          <Select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-auto min-w-[150px]"
          >
            <option value="all">All categories</option>
            {agentCategories.map((item) => (
              <option key={item} value={item}>
                {item}
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
            <option value="idle">Idle</option>
            <option value="error">Error</option>
            <option value="draft">Draft</option>
          </Select>
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "grid", label: "Grid" },
              { value: "list", label: "List" },
            ]}
          />
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No agents match your filters"
          description="Try a different search term, or create an agent to automate a workflow your team repeats."
          action={
            <Link
              href="/agents/new"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New agent
            </Link>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((agent) => (
            <Card key={agent.id} className="flex flex-col">
              <CardContent className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge tone={statusTone[agent.status]} dot className="capitalize">
                      {agent.status}
                    </Badge>
                    {rowMenu(agent)}
                  </div>
                </div>
                <Link href={`/agents/${agent.id}`} className="mt-3 block">
                  <h3 className="text-sm font-semibold hover:text-primary">{agent.name}</h3>
                </Link>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {agent.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge tone="outline">{modelName(agent.model)}</Badge>
                  <Badge tone="outline">{agent.category}</Badge>
                  {agent.tools.length > 0 && <Badge tone="outline">{agent.tools.length} tools</Badge>}
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Runs</dt>
                    <dd className="text-sm font-semibold">{formatCompact(agent.runs30d)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Success</dt>
                    <dd className="text-sm font-semibold">{agent.successRate}%</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground">Tokens</dt>
                    <dd className="text-sm font-semibold">{formatCompact(agent.tokens30d)}</dd>
                  </div>
                </dl>
              </CardContent>
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch
                    checked={agent.enabled}
                    onChange={() => toggleEnabled(agent.id)}
                    size="sm"
                    label={`Toggle ${agent.name}`}
                  />
                  {agent.enabled ? "Enabled" : "Disabled"}
                </span>
                <Link href={`/agents/${agent.id}`} className="text-xs font-medium text-primary hover:underline">
                  Open
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <TableWrapper>
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH>Agent</TH>
                  <TH>Model</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Runs (30d)</TH>
                  <TH className="text-right">Success</TH>
                  <TH>Updated</TH>
                  <TH className="w-10" />
                </TR>
              </THead>
              <TBody>
                {filtered.map((agent) => (
                  <TR key={agent.id}>
                    <TD>
                      <Link href={`/agents/${agent.id}`} className="font-medium hover:text-primary">
                        {agent.name}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{agent.description}</p>
                    </TD>
                    <TD className="text-sm text-muted-foreground">{modelName(agent.model)}</TD>
                    <TD>
                      <Badge tone={statusTone[agent.status]} dot className="capitalize">
                        {agent.status}
                      </Badge>
                    </TD>
                    <TD className="text-right text-sm">{formatCompact(agent.runs30d)}</TD>
                    <TD className="text-right text-sm">{agent.successRate}%</TD>
                    <TD className="text-sm text-muted-foreground">{formatDate(agent.updatedAt)}</TD>
                    <TD>{rowMenu(agent)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrapper>
        </Card>
      )}

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this agent?"
        description={`${pendingDelete?.name ?? ""} and its run history will be permanently removed. This cannot be undone.`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete agent
            </Button>
          </>
        }
      />
    </>
  );
}
