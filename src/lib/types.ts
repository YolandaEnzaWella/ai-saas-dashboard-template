/**
 * Domain entities from SRS §6. Every mock file in `src/data` is typed against
 * these, so swapping mock data for a real API only means changing the loader.
 */

export type Status = "active" | "idle" | "error" | "draft" | "archived";
export type RoleName = "Owner" | "Admin" | "Member" | "Viewer" | "Billing Manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  avatar: string;
  status: "active" | "pending" | "disabled";
  lastActive: string;
  joinedAt: string;
  team: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  planId: string;
  seats: number;
  seatsUsed: number;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
}

export interface AgentRun {
  id: string;
  startedAt: string;
  durationMs: number;
  status: "success" | "failed" | "running";
  tokens: number;
  trigger: string;
}

export interface AgentVersion {
  version: string;
  createdAt: string;
  author: string;
  summary: string;
}

export interface AgentStep {
  id: string;
  title: string;
  type: "trigger" | "llm" | "tool" | "condition" | "output";
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  status: Status;
  enabled: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  runs30d: number;
  successRate: number;
  avgResponseMs: number;
  tokens30d: number;
  tools: AgentTool[];
  steps: AgentStep[];
  history: AgentRun[];
  versions: AgentVersion[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  tokenCount: number;
  model?: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface Conversation {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  messageCount: number;
  preview: string;
  messages: Message[];
}

export interface PromptVersion {
  version: string;
  createdAt: string;
  author: string;
  note: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  variables: string[];
  status: "published" | "draft";
  uses: number;
  rating: number;
  updatedAt: string;
  author: string;
  versions: PromptVersion[];
}

export interface UsagePoint {
  date: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
  cost: number;
}

export interface UsageBreakdownRow {
  id: string;
  label: string;
  type: "agent" | "model" | "member";
  inputTokens: number;
  outputTokens: number;
  requests: number;
  cost: number;
  changePct: number;
}

export interface Invoice {
  id: string;
  number: string;
  subscriptionId: string;
  amount: number;
  tax: number;
  status: "paid" | "pending" | "overdue" | "refunded";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  period: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
  country: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  method: string;
  amount: number;
  status: "succeeded" | "pending" | "failed" | "refunded";
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  tokensIncluded: number;
  seats: string;
  featured: boolean;
  features: string[];
  notIncluded: string[];
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
}

export interface Subscription {
  id: string;
  teamId: string;
  planId: string;
  status: "active" | "trialing" | "paused" | "canceled";
  billingCycle: "monthly" | "yearly";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  seats: number;
  amount: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  createdBy: string;
  status: "active" | "revoked";
  rateLimit: string;
  requests30d: number;
  environment: "production" | "development";
}

export interface ApiKeyLog {
  id: string;
  keyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  at: string;
  ip: string;
}

export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  members: number;
  permissions: Permission[];
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  connected: boolean;
  icon: string;
  color: string;
  connectedAt?: string;
  account?: string;
  scopes: string[];
  webhookUrl?: string;
  events: { id: string; event: string; status: "delivered" | "failed" | "retrying"; at: string }[];
}

export interface Notification {
  id: string;
  type: "system" | "billing" | "team" | "agent";
  title: string;
  message: string;
  at: string;
  read: boolean;
  href?: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  avatar: string;
  action: string;
  target: string;
  at: string;
  type: "agent" | "billing" | "team" | "prompt" | "api";
}
