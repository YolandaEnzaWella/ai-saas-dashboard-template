"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDown,
  Bot,
  GitBranch,
  Loader2,
  Play,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox, Switch } from "@/components/ui/switch";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Markdown } from "@/lib/markdown";
import { agentCategories, agentModels, availableTools } from "@/data/agents";
import type { Agent, AgentStep } from "@/lib/types";
import { cn } from "@/lib/utils";

const stepTone = {
  trigger: "bg-accent/10 text-accent border-accent/30",
  llm: "bg-primary/10 text-primary border-primary/30",
  tool: "bg-warning/10 text-warning border-warning/30",
  condition: "bg-chart-5/10 text-chart-5 border-chart-5/30",
  output: "bg-success/10 text-success border-success/30",
} as const;

const emptyAgent = {
  name: "",
  description: "",
  model: "nexus-large",
  category: "Support",
  systemPrompt: "",
  temperature: 0.7,
  maxTokens: 2048,
  enabled: true,
};

/** Shared create/edit form (FR-AGT-02/04/08). */
export function AgentForm({ agent }: { agent?: Agent }) {
  const { toast } = useToast();
  const editing = Boolean(agent);
  const [tab, setTab] = React.useState("basics");
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    ...emptyAgent,
    name: agent?.name ?? "",
    description: agent?.description ?? "",
    model: agent?.model ?? emptyAgent.model,
    category: agent?.category ?? emptyAgent.category,
    systemPrompt: agent?.systemPrompt ?? "",
    enabled: agent?.enabled ?? true,
  });
  const [tools, setTools] = React.useState<string[]>(agent?.tools.map((tool) => tool.id) ?? []);
  const [steps, setSteps] = React.useState<AgentStep[]>(
    agent?.steps ?? [
      { id: "s1", title: "Trigger", type: "trigger", description: "How the agent is invoked" },
      { id: "s2", title: "Reason", type: "llm", description: "Model call with the system prompt" },
      { id: "s3", title: "Respond", type: "output", description: "Return the result" },
    ],
  );

  const [testInput, setTestInput] = React.useState("Summarize this ticket: the export job fails on files over 40 pages.");
  const [testOutput, setTestOutput] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleTool = (id: string) =>
    setTools((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const addStep = () =>
    setSteps((current) => [
      ...current,
      {
        id: `s${current.length + 1}_${Date.now()}`,
        title: "New step",
        type: "tool",
        description: "Describe what this step does",
      },
    ]);

  const updateStep = (id: string, patch: Partial<AgentStep>) =>
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...patch } : step)));

  const removeStep = (id: string) => setSteps((current) => current.filter((step) => step.id !== id));

  const runTest = () => {
    setTesting(true);
    setTestOutput(null);
    window.setTimeout(() => {
      setTesting(false);
      setTestOutput(
        `**Severity:** P2 — degraded, not blocking\n**Area:** Export pipeline\n**Sentiment:** Frustrated but constructive\n\nSuggested reply:\n\n> Thanks for the detail on the page count — that narrows it a lot. Large exports are timing out at the PDF parsing step. We shipped a fix in v3.1 this morning; can you retry and let me know if it clears?\n\n_Routed to: Support queue · No escalation needed._`,
      );
    }, 1100);
  };

  const save = () => {
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 3) nextErrors.name = "Give the agent a name of at least 3 characters.";
    if (form.description.trim().length < 10) nextErrors.description = "Add a short description (10+ characters).";
    if (form.systemPrompt.trim().length < 20) nextErrors.systemPrompt = "A system prompt of at least 20 characters keeps behavior predictable.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setTab("basics");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({
        title: editing ? "Agent updated" : "Agent created",
        description: `${form.name} was saved as a ${form.enabled ? "live" : "draft"} agent.`,
        tone: "success",
      });
    }, 800);
  };

  return (
    <>
      <PageHeader
        title={editing ? `Edit ${agent?.name}` : "Create an agent"}
        description={
          editing
            ? "Change the configuration, tools and workflow of this agent."
            : "Give the agent a job, pick a model, and wire up the tools it can call."
        }
        breadcrumbs={[
          { label: "AI Agents", href: "/agents" },
          ...(editing ? [{ label: agent!.name, href: `/agents/${agent!.id}` }] : []),
          { label: editing ? "Edit" : "New" },
        ]}
        actions={
          <>
            <Link
              href={editing ? `/agents/${agent!.id}` : "/agents"}
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Cancel
            </Link>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
              {saving ? "Saving…" : editing ? "Save changes" : "Create agent"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Tabs
              className="px-3"
              value={tab}
              onChange={setTab}
              items={[
                { id: "basics", label: "Basics" },
                { id: "tools", label: "Tools", count: tools.length },
                { id: "workflow", label: "Workflow", count: steps.length },
                { id: "advanced", label: "Advanced" },
              ]}
            />

            <CardContent className="space-y-5">
              {tab === "basics" && (
                <>
                  <Field label="Agent name" htmlFor="agent-name" error={errors.name}>
                    <Input
                      id="agent-name"
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder="Support Triage"
                    />
                  </Field>

                  <Field
                    label="Description"
                    htmlFor="agent-description"
                    error={errors.description}
                    hint="One sentence your teammates will see in the agent list."
                  >
                    <Textarea
                      id="agent-description"
                      value={form.description}
                      onChange={(event) => set("description", event.target.value)}
                      placeholder="Classifies inbound tickets and drafts a first reply."
                      className="min-h-[72px]"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Base model" htmlFor="agent-model">
                      <Select
                        id="agent-model"
                        value={form.model}
                        onChange={(event) => set("model", event.target.value)}
                      >
                        {agentModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} — {model.context} context
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Category" htmlFor="agent-category">
                      <Select
                        id="agent-category"
                        value={form.category}
                        onChange={(event) => set("category", event.target.value)}
                      >
                        {agentCategories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>

                  <Field
                    label="System prompt"
                    htmlFor="agent-prompt"
                    error={errors.systemPrompt}
                    hint="Describe the role, the rules and what the agent must never do."
                  >
                    <Textarea
                      id="agent-prompt"
                      value={form.systemPrompt}
                      onChange={(event) => set("systemPrompt", event.target.value)}
                      placeholder="You are a senior support engineer…"
                      className="min-h-[180px] font-mono text-xs"
                    />
                  </Field>
                </>
              )}

              {tab === "tools" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Tools the agent may call during a run. Each one is passed to the model as a
                    function definition.
                  </p>
                  {availableTools.map((tool) => (
                    <label
                      key={tool.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                        tools.includes(tool.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:bg-secondary/50",
                      )}
                    >
                      <Checkbox
                        checked={tools.includes(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Wrench className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                          {tool.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {tool.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {tab === "workflow" && (
                <div>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Visual step builder (FR-AGT-04). Steps run top to bottom; conditions may branch.
                  </p>
                  <ol className="space-y-2">
                    {steps.map((step, index) => (
                      <li key={step.id}>
                        <div
                          className={cn(
                            "rounded-lg border p-3.5",
                            stepTone[step.type],
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-current/15 text-[11px] font-semibold">
                              {index + 1}
                            </span>
                            <input
                              value={step.title}
                              onChange={(event) => updateStep(step.id, { title: event.target.value })}
                              aria-label={`Step ${index + 1} title`}
                              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                            />
                            <select
                              value={step.type}
                              onChange={(event) =>
                                updateStep(step.id, { type: event.target.value as AgentStep["type"] })
                              }
                              aria-label={`Step ${index + 1} type`}
                              className="rounded border border-current/30 bg-transparent px-1.5 py-0.5 text-[11px] capitalize outline-none"
                            >
                              {["trigger", "llm", "tool", "condition", "output"].map((type) => (
                                <option key={type} value={type} className="bg-card text-foreground">
                                  {type}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeStep(step.id)}
                              aria-label={`Remove step ${index + 1}`}
                              className="rounded p-1 opacity-70 transition-opacity hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>
                          <input
                            value={step.description}
                            onChange={(event) => updateStep(step.id, { description: event.target.value })}
                            aria-label={`Step ${index + 1} description`}
                            className="mt-1.5 w-full bg-transparent pl-8 text-xs opacity-80 outline-none"
                          />
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                  <Button variant="outline" size="sm" className="mt-4 w-full" onClick={addStep}>
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                    Add step
                  </Button>
                </div>
              )}

              {tab === "advanced" && (
                <div className="space-y-5">
                  <Field
                    label={`Temperature — ${form.temperature.toFixed(1)}`}
                    htmlFor="temperature"
                    hint="Lower values keep output deterministic; higher values add variety."
                  >
                    <input
                      id="temperature"
                      type="range"
                      min={0}
                      max={2}
                      step={0.1}
                      value={form.temperature}
                      onChange={(event) => set("temperature", Number(event.target.value))}
                      className="w-full accent-[hsl(var(--primary))]"
                    />
                  </Field>

                  <Field label="Max output tokens" htmlFor="max-tokens">
                    <Input
                      id="max-tokens"
                      type="number"
                      min={256}
                      max={8192}
                      step={256}
                      value={form.maxTokens}
                      onChange={(event) => set("maxTokens", Number(event.target.value))}
                    />
                  </Field>

                  <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
                    <div>
                      <p className="text-sm font-medium">Enable agent</p>
                      <p className="text-xs text-muted-foreground">
                        Disabled agents keep their configuration but stop accepting runs.
                      </p>
                    </div>
                    <Switch
                      checked={form.enabled}
                      onChange={(value) => set("enabled", value)}
                      label="Enable agent"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test / preview panel (FR-AGT-08) */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Test this agent
                </CardTitle>
                <CardDescription>Run a sample input without deploying.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={testInput}
                onChange={(event) => setTestInput(event.target.value)}
                aria-label="Test input"
                className="min-h-[96px] text-xs"
              />
              <Button size="sm" className="w-full" onClick={runTest} disabled={testing}>
                {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <Send className="h-3.5 w-3.5" aria-hidden />}
                {testing ? "Running…" : "Run test"}
              </Button>

              {testing && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-3">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-blink rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}

              {testOutput && (
                <div className="rounded-md border border-border bg-secondary/40 p-3.5">
                  <Markdown content={testOutput} />
                  <p className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
                    412 tokens · 1.1s · {agentModels.find((m) => m.id === form.model)?.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Model</span>
                <Badge tone="primary">{agentModels.find((m) => m.id === form.model)?.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tools</span>
                <span className="font-medium">{tools.length} enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Workflow steps</span>
                <span className="font-medium">{steps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated cost</span>
                <span className="font-medium">
                  ${((agentModels.find((m) => m.id === form.model)?.costPer1k ?? 0) * 2).toFixed(3)} / run
                </span>
              </div>
              <p className="flex items-start gap-2 rounded-md bg-secondary/60 p-2.5 text-muted-foreground">
                <GitBranch className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Saving creates a new version. Previous versions stay available on the agent detail
                page.
              </p>
            </CardContent>
          </Card>

          {!editing && (
            <Card>
              <CardContent className="flex items-start gap-3 py-4 text-xs text-muted-foreground">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="min-w-0 leading-relaxed">
                  Start from a template — Support Triage, Data Extractor and Code Reviewer are
                  available as presets in{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 font-mono">src/data/agents.ts</code>.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
