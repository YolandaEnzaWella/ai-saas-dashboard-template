"use client";

import * as React from "react";
import Link from "next/link";
import { Blocks, Check, Plus, Settings2 } from "lucide-react";
import { IntegrationIcon } from "@/components/layout/integration-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { integrationCategories, integrations as seed } from "@/data/integrations";
import type { Integration } from "@/lib/types";
import { RelativeTime } from "@/components/ui/relative-time";

export function IntegrationsView() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = React.useState<Integration[]>(seed);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [tab, setTab] = React.useState("all");

  const filtered = integrations.filter((integration) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery =
      !needle ||
      integration.name.toLowerCase().includes(needle) ||
      integration.description.toLowerCase().includes(needle);
    const matchesCategory = category === "all" || integration.category === category;
    const matchesTab =
      tab === "all" || (tab === "connected" ? integration.connected : !integration.connected);
    return matchesQuery && matchesCategory && matchesTab;
  });

  const connect = (integration: Integration) => {
    setIntegrations((current) =>
      current.map((item) =>
        item.id === integration.id
          ? {
              ...item,
              connected: !item.connected,
              connectedAt: item.connected ? undefined : new Date().toISOString(),
              account: item.connected ? undefined : "amara@nexus.ai",
            }
          : item,
      ),
    );
    toast({
      title: integration.connected ? "Integration disconnected" : "Integration connected",
      description: integration.connected
        ? `${integration.name} no longer receives events.`
        : `${integration.name} is ready to use in your agents.`,
      tone: integration.connected ? "warning" : "success",
    });
  };

  const connectedCount = integrations.filter((integration) => integration.connected).length;

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect Nexus AI to the tools your team already uses."
        actions={
          <Button
            variant="outline"
            onClick={() => toast({ title: "Request sent", description: "We will let you know when it is available.", tone: "info" })}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Request an integration
          </Button>
        }
      />

      <Card className="mb-4">
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "All", count: integrations.length },
            { id: "connected", label: "Connected", count: connectedCount },
            { id: "available", label: "Available", count: integrations.length - connectedCount },
          ]}
        />
        <CardContent className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search integrations…"
            className="min-w-[200px] flex-1"
          />
          <Select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-auto min-w-[170px]"
          >
            <option value="all">All categories</option>
            {integrationCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Blocks}
          title="No integrations found"
          description="Nothing matches this search. Request an integration and we will look at adding it."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((integration) => (
            <Card key={integration.id} className="flex flex-col">
              <CardContent className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: integration.color }}
                  >
                    <IntegrationIcon name={integration.icon} className="h-5 w-5" />
                  </span>
                  {integration.connected ? (
                    <Badge tone="success" dot>
                      Connected
                    </Badge>
                  ) : (
                    <Badge tone="outline">Not connected</Badge>
                  )}
                </div>

                <Link href={`/integrations/${integration.slug}`} className="mt-3 block">
                  <h3 className="text-sm font-semibold hover:text-primary">{integration.name}</h3>
                </Link>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {integration.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone="outline">{integration.category}</Badge>
                  {integration.connected && integration.connectedAt && (
                    <span className="text-[11px] text-muted-foreground">
                      since <RelativeTime value={integration.connectedAt} />
                    </span>
                  )}
                </div>
              </CardContent>

              <div className="flex items-center gap-2 border-t border-border px-5 py-3">
                <Button
                  variant={integration.connected ? "outline" : "primary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => connect(integration)}
                >
                  {integration.connected ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      Disconnect
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
                <Link
                  href={`/integrations/${integration.slug}`}
                  aria-label={`Configure ${integration.name}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Settings2 className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
