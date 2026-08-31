import type { AuditEntry, Role } from "@/lib/types";

export const permissionModules = [
  "Dashboard",
  "AI Chat",
  "AI Agents",
  "Prompts",
  "Usage",
  "Billing",
  "Subscription",
  "API Keys",
  "Team Members",
  "Roles",
  "Analytics",
  "Notifications",
  "Integrations",
];

function permissions(preset: "all" | "admin" | "member" | "viewer" | "billing") {
  return permissionModules.map((module) => {
    const billingModule = ["Billing", "Subscription"].includes(module);
    const adminModule = ["Roles", "Team Members"].includes(module);
    switch (preset) {
      case "all":
        return { module, view: true, create: true, edit: true, delete: true };
      case "admin":
        return {
          module,
          view: true,
          create: !billingModule,
          edit: !billingModule,
          delete: !billingModule && module !== "Roles",
        };
      case "member":
        return {
          module,
          view: !billingModule && !adminModule,
          create: ["AI Chat", "AI Agents", "Prompts", "API Keys"].includes(module),
          edit: ["AI Chat", "AI Agents", "Prompts", "API Keys"].includes(module),
          delete: ["AI Chat", "Prompts"].includes(module),
        };
      case "billing":
        return {
          module,
          view: ["Dashboard", "Usage", "Billing", "Subscription", "Analytics", "Notifications"].includes(module),
          create: billingModule,
          edit: billingModule,
          delete: false,
        };
      default:
        return {
          module,
          view: ["Dashboard", "Analytics", "Usage", "Notifications"].includes(module),
          create: false,
          edit: false,
          delete: false,
        };
    }
  });
}

export const roles: Role[] = [
  {
    id: "role_owner", name: "Owner", description: "Full access to every module, including billing and role management.",
    isSystem: true, members: 1, permissions: permissions("all"),
  },
  {
    id: "role_admin", name: "Admin", description: "Manages agents, prompts and people. No billing access.",
    isSystem: true, members: 2, permissions: permissions("admin"),
  },
  {
    id: "role_member", name: "Member", description: "Uses chat and agents, manages their own API keys.",
    isSystem: true, members: 6, permissions: permissions("member"),
  },
  {
    id: "role_viewer", name: "Viewer", description: "Read-only access to dashboards and analytics.",
    isSystem: true, members: 2, permissions: permissions("viewer"),
  },
  {
    id: "role_billing", name: "Billing Manager", description: "Custom role focused on invoices, payment methods and plans.",
    isSystem: false, members: 1, permissions: permissions("billing"),
  },
];

export function getRole(id: string) {
  return roles.find((role) => role.id === id);
}

export const permissionAudit: AuditEntry[] = [
  { id: "aud_01", actor: "Amara Okafor", action: "granted billing:edit to", target: "Billing Manager", at: "2026-08-28T10:14:00Z" },
  { id: "aud_02", actor: "Amara Okafor", action: "created custom role", target: "Billing Manager", at: "2026-08-28T10:02:00Z" },
  { id: "aud_03", actor: "Hana Yamamoto", action: "changed role of Mei Chen to", target: "Member", at: "2026-08-21T16:30:00Z" },
  { id: "aud_04", actor: "Amara Okafor", action: "revoked agents:delete from", target: "Admin", at: "2026-08-14T09:45:00Z" },
  { id: "aud_05", actor: "Daniel Reyes", action: "assigned Viewer role to", target: "Jonah Weber", at: "2026-07-30T11:12:00Z" },
];
