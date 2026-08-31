import type { Integration } from "@/lib/types";

export const integrationCategories = [
  "Communication",
  "Automation",
  "Storage",
  "Productivity",
  "Developer",
  "CRM",
  "Analytics",
];

function events(seed: number) {
  const statuses = ["delivered", "delivered", "failed", "delivered", "retrying"] as const;
  return Array.from({ length: 5 }, (_, i) => ({
    id: `evt_${seed}_${i}`,
    event: ["agent.run.completed", "conversation.created", "invoice.paid", "quota.threshold", "agent.run.failed"][i],
    status: statuses[(seed + i) % statuses.length],
    at: new Date(Date.UTC(2026, 7, 31, 8, 0) - i * 5_400_000).toISOString(),
  }));
}

export const integrations: Integration[] = [
  {
    id: "int_slack", name: "Slack", slug: "slack", category: "Communication",
    description: "Send agent results into channels and trigger runs from a slash command.",
    connected: true, icon: "MessageSquare", color: "#4A154B",
    connectedAt: "2026-08-29T10:12:00Z", account: "nexus-labs.slack.com",
    scopes: ["chat:write", "commands", "channels:read"],
    webhookUrl: "https://hooks.nexus.ai/slack/8f2a1c9d",
    events: events(1),
  },
  {
    id: "int_zapier", name: "Zapier", slug: "zapier", category: "Automation",
    description: "Connect agents to 6,000+ apps without writing glue code.",
    connected: true, icon: "Zap", color: "#FF4F00",
    connectedAt: "2026-07-11T14:00:00Z", account: "amara@nexus.ai",
    scopes: ["agents:read", "chat:write"],
    webhookUrl: "https://hooks.nexus.ai/zapier/1b77e320",
    events: events(2),
  },
  {
    id: "int_gdrive", name: "Google Drive", slug: "google-drive", category: "Storage",
    description: "Index documents from shared drives into your agent knowledge base.",
    connected: true, icon: "HardDrive", color: "#1A73E8",
    connectedAt: "2026-06-02T09:20:00Z", account: "docs@nexus.ai",
    scopes: ["drive.readonly"],
    webhookUrl: "https://hooks.nexus.ai/gdrive/c40a92f1",
    events: events(3),
  },
  {
    id: "int_notion", name: "Notion", slug: "notion", category: "Productivity",
    description: "Read pages as context and write agent output back to a database.",
    connected: false, icon: "FileText", color: "#111111",
    scopes: ["read_content", "insert_content"], events: [],
  },
  {
    id: "int_github", name: "GitHub", slug: "github", category: "Developer",
    description: "Review pull requests and open issues from agent findings.",
    connected: true, icon: "GitBranch", color: "#24292F",
    connectedAt: "2026-05-18T11:00:00Z", account: "nexus-labs",
    scopes: ["repo:read", "pull_request:write"],
    webhookUrl: "https://hooks.nexus.ai/github/77d13b0a",
    events: events(4),
  },
  {
    id: "int_hubspot", name: "HubSpot", slug: "hubspot", category: "CRM",
    description: "Enrich contacts and log agent-generated call briefs.",
    connected: false, icon: "Users", color: "#FF7A59",
    scopes: ["crm.objects.contacts.read", "crm.objects.notes.write"], events: [],
  },
  {
    id: "int_linear", name: "Linear", slug: "linear", category: "Productivity",
    description: "Turn triaged bug reports into Linear issues automatically.",
    connected: false, icon: "SquareKanban", color: "#5E6AD2",
    scopes: ["issues:create"], events: [],
  },
  {
    id: "int_segment", name: "Segment", slug: "segment", category: "Analytics",
    description: "Stream conversation and usage events into your warehouse.",
    connected: false, icon: "BarChart3", color: "#52BD95",
    scopes: ["track", "identify"], events: [],
  },
  {
    id: "int_stripe", name: "Stripe", slug: "stripe", category: "Analytics",
    description: "Sync subscription and invoice data with your billing system.",
    connected: true, icon: "CreditCard", color: "#635BFF",
    connectedAt: "2026-03-14T08:00:00Z", account: "acct_1NxeQ2",
    scopes: ["invoices:read", "subscriptions:read"],
    webhookUrl: "https://hooks.nexus.ai/stripe/9021ab4c",
    events: events(5),
  },
  {
    id: "int_discord", name: "Discord", slug: "discord", category: "Communication",
    description: "Run community support agents inside your Discord server.",
    connected: false, icon: "MessagesSquare", color: "#5865F2",
    scopes: ["bot", "messages.read"], events: [],
  },
  {
    id: "int_s3", name: "Amazon S3", slug: "amazon-s3", category: "Storage",
    description: "Archive conversation transcripts to your own bucket.",
    connected: false, icon: "Database", color: "#FF9900",
    scopes: ["s3:PutObject"], events: [],
  },
  {
    id: "int_webhook", name: "Custom Webhook", slug: "custom-webhook", category: "Developer",
    description: "Post every workspace event to an endpoint you control.",
    connected: true, icon: "Webhook", color: "#0EA5E9",
    connectedAt: "2026-08-04T12:30:00Z", account: "https://api.acme.dev/nexus",
    scopes: ["events:all"],
    webhookUrl: "https://api.acme.dev/nexus/events",
    events: events(6),
  },
];

export function getIntegration(slug: string) {
  return integrations.find((integration) => integration.slug === slug);
}
