"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, FileText, GitBranch, Loader2, Save, Send, Star, Variable } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { promptCategories } from "@/data/prompts";
import type { Prompt } from "@/lib/types";
import { estimateTokens, formatDate, formatNumber } from "@/lib/utils";

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Prompt editor with dynamic variables and live preview (FR-PRM-02/03). */
export function PromptEditor({ prompt }: { prompt?: Prompt }) {
  const { toast } = useToast();
  const editing = Boolean(prompt);
  const [tab, setTab] = React.useState("editor");
  const [saving, setSaving] = React.useState<"draft" | "publish" | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    title: prompt?.title ?? "",
    description: prompt?.description ?? "",
    category: prompt?.category ?? promptCategories[0],
    tags: prompt?.tags.join(", ") ?? "",
    content: prompt?.content ?? "",
  });

  const variables = React.useMemo(() => {
    const found = new Set<string>();
    for (const match of form.content.matchAll(VARIABLE_PATTERN)) found.add(match[1]);
    return [...found];
  }, [form.content]);

  const [values, setValues] = React.useState<Record<string, string>>({});

  const preview = React.useMemo(
    () =>
      form.content.replace(VARIABLE_PATTERN, (_, name: string) => values[name] || `{{${name}}}`),
    [form.content, values],
  );

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = (mode: "draft" | "publish") => {
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 3) nextErrors.title = "Give the prompt a title.";
    if (form.content.trim().length < 20) nextErrors.content = "The prompt body needs at least 20 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setTab("editor");
      return;
    }
    setSaving(mode);
    window.setTimeout(() => {
      setSaving(null);
      toast({
        title: mode === "publish" ? "Prompt published" : "Draft saved",
        description:
          mode === "publish"
            ? `${form.title} is now available to your whole team.`
            : `${form.title} was saved as a draft.`,
        tone: "success",
      });
    }, 700);
  };

  return (
    <>
      <PageHeader
        title={editing ? `Edit ${prompt?.title}` : "New prompt template"}
        description="Use double braces to define a variable, e.g. {{customer_name}}."
        breadcrumbs={[
          { label: "Prompts", href: "/prompts" },
          { label: editing ? prompt!.title : "New" },
        ]}
        actions={
          <>
            <Link
              href="/prompts"
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Cancel
            </Link>
            <Button variant="outline" onClick={() => save("draft")} disabled={saving !== null}>
              {saving === "draft" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
              Save draft
            </Button>
            <Button onClick={() => save("publish")} disabled={saving !== null}>
              {saving === "publish" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              Publish
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
                { id: "editor", label: "Editor" },
                { id: "preview", label: "Preview" },
                ...(editing ? [{ id: "versions", label: "Versions", count: prompt!.versions.length }] : []),
              ]}
            />
            <CardContent className="space-y-5">
              {tab === "editor" && (
                <>
                  <Field label="Title" htmlFor="prompt-title" error={errors.title}>
                    <Input
                      id="prompt-title"
                      value={form.title}
                      onChange={(event) => set("title", event.target.value)}
                      placeholder="Ticket First Reply"
                    />
                  </Field>

                  <Field label="Description" htmlFor="prompt-description">
                    <Input
                      id="prompt-description"
                      value={form.description}
                      onChange={(event) => set("description", event.target.value)}
                      placeholder="Empathetic first response with a proposed fix."
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Category" htmlFor="prompt-category">
                      <Select
                        id="prompt-category"
                        value={form.category}
                        onChange={(event) => set("category", event.target.value)}
                      >
                        {promptCategories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Tags" htmlFor="prompt-tags" hint="Comma separated.">
                      <Input
                        id="prompt-tags"
                        value={form.tags}
                        onChange={(event) => set("tags", event.target.value)}
                        placeholder="support, email, tone"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Prompt body"
                    htmlFor="prompt-content"
                    error={errors.content}
                    hint={`${estimateTokens(form.content)} estimated tokens · ${variables.length} variables detected`}
                  >
                    <Textarea
                      id="prompt-content"
                      value={form.content}
                      onChange={(event) => set("content", event.target.value)}
                      placeholder="You are replying to {{customer_name}} about a {{severity}} issue…"
                      className="min-h-[280px] font-mono text-xs"
                    />
                  </Field>
                </>
              )}

              {tab === "preview" && (
                <div className="space-y-4">
                  {variables.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {variables.map((variable) => (
                        <Field key={variable} label={variable} htmlFor={`var-${variable}`}>
                          <Input
                            id={`var-${variable}`}
                            value={values[variable] ?? ""}
                            onChange={(event) =>
                              setValues((current) => ({ ...current, [variable]: event.target.value }))
                            }
                            placeholder={`Sample ${variable}`}
                          />
                        </Field>
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      Resolved prompt
                    </p>
                    <pre className="overflow-x-auto scrollbar-thin whitespace-pre-wrap rounded-md border border-border bg-secondary/50 p-4 font-mono text-xs leading-relaxed">
                      {preview || "Nothing to preview yet."}
                    </pre>
                  </div>
                </div>
              )}

              {tab === "versions" && editing && (
                <ul className="space-y-3">
                  {prompt!.versions.map((version, index) => (
                    <li key={version.version} className="flex items-start gap-3 rounded-lg border border-border p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <GitBranch className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-medium">
                          {version.version}
                          {index === 0 && <Badge tone="success">Current</Badge>}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{version.note}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {version.author} · {formatDate(version.createdAt, "long")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Variable className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Variables
                </CardTitle>
                <CardDescription>Detected from the prompt body.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {variables.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No variables yet. Add one with <code className="font-mono">{"{{name}}"}</code>.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {variables.map((variable) => (
                    <li key={variable}>
                      <Badge tone="primary" className="font-mono text-[11px]">
                        {`{{${variable}}}`}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {editing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" aria-hidden />
                  Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge tone={statusTone[prompt!.status]} className="capitalize">
                    {prompt!.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Times used</span>
                  <span className="font-medium">{formatNumber(prompt!.uses)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average rating</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-3 w-3 fill-warning text-warning" aria-hidden />
                    {prompt!.rating > 0 ? prompt!.rating.toFixed(1) : "Not rated"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-medium">{prompt!.author}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">{formatDate(prompt!.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
