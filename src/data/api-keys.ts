import type { ApiKey, ApiKeyLog } from "@/lib/types";

export const apiScopes = [
  { id: "chat:read", label: "chat:read", description: "Read conversations and messages" },
  { id: "chat:write", label: "chat:write", description: "Create conversations and send messages" },
  { id: "agents:read", label: "agents:read", description: "List and inspect agents" },
  { id: "agents:write", label: "agents:write", description: "Create, edit and deploy agents" },
  { id: "prompts:read", label: "prompts:read", description: "Read prompt templates" },
  { id: "usage:read", label: "usage:read", description: "Read usage and cost data" },
  { id: "billing:read", label: "billing:read", description: "Read invoices and subscription" },
];

export const apiKeys: ApiKey[] = [
  {
    id: "key_01", name: "production-backend", prefix: "sk_live_9f3a", scopes: ["chat:read", "chat:write", "agents:read"],
    createdAt: "2026-02-14T10:00:00Z", lastUsedAt: "2026-08-31T09:10:00Z", createdBy: "Amara Okafor",
    status: "active", rateLimit: "600 req/min", requests30d: 1_284_000, environment: "production",
  },
  {
    id: "key_02", name: "mobile-client-prod", prefix: "sk_live_2c81", scopes: ["chat:read", "chat:write"],
    createdAt: "2026-08-30T18:47:00Z", lastUsedAt: "2026-08-31T08:52:00Z", createdBy: "Mei Chen",
    status: "active", rateLimit: "300 req/min", requests30d: 42_800, environment: "production",
  },
  {
    id: "key_03", name: "analytics-etl", prefix: "sk_live_7de4", scopes: ["usage:read", "billing:read"],
    createdAt: "2026-04-08T09:00:00Z", lastUsedAt: "2026-08-31T06:00:00Z", createdBy: "Tomas Lindqvist",
    status: "active", rateLimit: "60 req/min", requests30d: 8_640, environment: "production",
  },
  {
    id: "key_04", name: "staging-sandbox", prefix: "sk_test_44b0", scopes: ["chat:read", "chat:write", "agents:read", "agents:write", "prompts:read"],
    createdAt: "2026-06-19T11:30:00Z", lastUsedAt: "2026-08-29T14:12:00Z", createdBy: "Ibrahim Diallo",
    status: "active", rateLimit: "120 req/min", requests30d: 96_400, environment: "development",
  },
  {
    id: "key_05", name: "zapier-connector", prefix: "sk_live_5a17", scopes: ["chat:write", "agents:read"],
    createdAt: "2026-03-02T08:15:00Z", lastUsedAt: "2026-08-24T20:40:00Z", createdBy: "Hana Yamamoto",
    status: "active", rateLimit: "120 req/min", requests30d: 21_400, environment: "production",
  },
  {
    id: "key_06", name: "legacy-import", prefix: "sk_live_0b9c", scopes: ["agents:read"],
    createdAt: "2025-11-21T13:00:00Z", lastUsedAt: null, createdBy: "Daniel Reyes",
    status: "revoked", rateLimit: "60 req/min", requests30d: 0, environment: "production",
  },
];

export function getApiKey(id: string) {
  return apiKeys.find((key) => key.id === id);
}

export const apiKeyLogs: ApiKeyLog[] = [
  { id: "log_01", keyId: "key_01", endpoint: "/v1/chat/completions", method: "POST", statusCode: 200, latencyMs: 842, at: "2026-08-31T09:10:00Z", ip: "34.220.14.2" },
  { id: "log_02", keyId: "key_01", endpoint: "/v1/agents/agt_support_triage/run", method: "POST", statusCode: 200, latencyMs: 1240, at: "2026-08-31T09:08:40Z", ip: "34.220.14.2" },
  { id: "log_03", keyId: "key_02", endpoint: "/v1/chat/completions", method: "POST", statusCode: 429, latencyMs: 24, at: "2026-08-31T08:52:10Z", ip: "18.144.90.71" },
  { id: "log_04", keyId: "key_01", endpoint: "/v1/conversations", method: "GET", statusCode: 200, latencyMs: 96, at: "2026-08-31T08:44:00Z", ip: "34.220.14.2" },
  { id: "log_05", keyId: "key_03", endpoint: "/v1/usage", method: "GET", statusCode: 200, latencyMs: 312, at: "2026-08-31T06:00:00Z", ip: "52.14.8.190" },
  { id: "log_06", keyId: "key_04", endpoint: "/v1/agents", method: "POST", statusCode: 422, latencyMs: 61, at: "2026-08-29T14:12:00Z", ip: "10.4.22.8" },
  { id: "log_07", keyId: "key_05", endpoint: "/v1/chat/completions", method: "POST", statusCode: 200, latencyMs: 1104, at: "2026-08-24T20:40:00Z", ip: "104.18.22.11" },
  { id: "log_08", keyId: "key_01", endpoint: "/v1/chat/completions", method: "POST", statusCode: 500, latencyMs: 8420, at: "2026-08-24T18:02:00Z", ip: "34.220.14.2" },
];
