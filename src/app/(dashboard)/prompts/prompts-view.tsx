"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, MoreHorizontal, Pencil, Plus, Sparkles, Star, Trash2 } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { promptCategories, prompts as seedPrompts } from "@/data/prompts";
import type { Prompt } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";

export function PromptsView() {
  const { toast } = useToast();
  const [prompts, setPrompts] = React.useState<Prompt[]>(seedPrompts);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState<"uses" | "updated" | "rating">("uses");
  const [tab, setTab] = React.useState("all");

  const filtered = prompts
    .filter((prompt) => {
      const needle = query.trim().toLowerCase();
      const matchesQuery =
        !needle ||
        prompt.title.toLowerCase().includes(needle) ||
        prompt.description.toLowerCase().includes(needle) ||
        prompt.tags.some((tag) => tag.includes(needle));
      const matchesCategory = category === "all" || prompt.category === category;
      const matchesTab = tab === "all" || prompt.status === tab;
      return matchesQuery && matchesCategory && matchesTab;
    })
    .sort((a, b) => {
      if (sort === "uses") return b.uses - a.uses;
      if (sort === "rating") return b.rating - a.rating;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  const duplicate = (prompt: Prompt) => {
    setPrompts((current) => [
      { ...prompt, id: `${prompt.id}_copy_${Date.now()}`, title: `${prompt.title} (copy)`, status: "draft", uses: 0, rating: 0 },
      ...current,
    ]);
    toast({ title: "Prompt duplicated", description: `${prompt.title} was copied as a draft.`, tone: "success" });
  };

  const remove = (prompt: Prompt) => {
    setPrompts((current) => current.filter((item) => item.id !== prompt.id));
    toast({ title: "Prompt deleted", description: `${prompt.title} was removed.`, tone: "success" });
  };

  return (
    <>
      <PageHeader
        title="Prompt Management"
        description="Reusable prompt templates with dynamic variables, versions and usage stats."
        actions={
          <Link
            href="/prompts/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New prompt
          </Link>
        }
      />

      <Card className="mb-4">
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "All", count: prompts.length },
            { id: "published", label: "Published", count: prompts.filter((p) => p.status === "published").length },
            { id: "draft", label: "Drafts", count: prompts.filter((p) => p.status === "draft").length },
          ]}
        />
        <CardContent className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search prompts and tags…"
            className="min-w-[200px] flex-1"
          />
          <Select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-auto min-w-[150px]"
          >
            <option value="all">All categories</option>
            {promptCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Sort prompts"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="w-auto min-w-[150px]"
          >
            <option value="uses">Most used</option>
            <option value="updated">Recently updated</option>
            <option value="rating">Highest rated</option>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No prompts found"
          description="Save a prompt template so your team stops rewriting the same instructions in every chat."
          action={
            <Link
              href="/prompts/new"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" aria-hidden />
              New prompt
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((prompt) => (
            <Card key={prompt.id} className="flex flex-col">
              <CardContent className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Badge tone={statusTone[prompt.status]} className="capitalize">
                    {prompt.status}
                  </Badge>
                  <Dropdown
                    trigger={({ toggle }) => (
                      <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Actions for ${prompt.title}`}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  >
                    {(close) => (
                      <>
                        <Link href={`/prompts/${prompt.id}`} onClick={close}>
                          <DropdownItem>
                            <Pencil className="h-4 w-4 text-muted-foreground" aria-hidden />
                            Open editor
                          </DropdownItem>
                        </Link>
                        <DropdownItem
                          onClick={() => {
                            duplicate(prompt);
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
                            remove(prompt);
                            close();
                          }}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          Delete
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </div>

                <Link href={`/prompts/${prompt.id}`} className="mt-3 block">
                  <h3 className="text-sm font-semibold hover:text-primary">{prompt.title}</h3>
                </Link>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {prompt.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="primary">{prompt.category}</Badge>
                  {prompt.variables.slice(0, 2).map((variable) => (
                    <Badge key={variable} tone="outline" className="font-mono text-[10px]">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                  {prompt.variables.length > 2 && (
                    <Badge tone="outline">+{prompt.variables.length - 2}</Badge>
                  )}
                </div>
              </CardContent>
              <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                <span>{formatNumber(prompt.uses)} uses</span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" aria-hidden />
                  {prompt.rating > 0 ? prompt.rating.toFixed(1) : "—"}
                </span>
                <span><RelativeTime value={prompt.updatedAt} /></span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
