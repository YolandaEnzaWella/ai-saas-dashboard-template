import type { Notification } from "@/lib/types";

export const notifications: Notification[] = [
  { id: "ntf_01", type: "billing", title: "Token quota at 82%", message: "You have used 16.4M of 20M tokens in the current period.", at: "2026-08-31T07:15:00Z", read: false, href: "/usage" },
  { id: "ntf_02", type: "agent", title: "Data Extractor failed 42 runs", message: "Timeouts on PDFs over 40 pages. A fix was deployed in v3.1.", at: "2026-08-30T11:09:00Z", read: false, href: "/agents/agt_data_extractor" },
  { id: "ntf_03", type: "team", title: "Sofia Marchetti was invited", message: "The invitation expires in 7 days.", at: "2026-08-30T15:30:00Z", read: false, href: "/team" },
  { id: "ntf_04", type: "billing", title: "Invoice INV-2026-0742 is overdue", message: "Payment failed on the Visa ending 4242.", at: "2026-08-29T09:00:00Z", read: true, href: "/billing/invoices/inv_0742" },
  { id: "ntf_05", type: "system", title: "Nexus Reason is generally available", message: "The 256K-context reasoning model is now on all paid plans.", at: "2026-08-28T10:00:00Z", read: true },
  { id: "ntf_06", type: "agent", title: "Support Triage v4.2 deployed", message: "Hana Yamamoto tightened the escalation rules for billing disputes.", at: "2026-08-31T09:04:00Z", read: false, href: "/agents/agt_support_triage" },
  { id: "ntf_07", type: "team", title: "Jonah Weber changed role", message: "Role changed from Member to Viewer by Daniel Reyes.", at: "2026-07-30T11:12:00Z", read: true, href: "/roles" },
  { id: "ntf_08", type: "system", title: "Scheduled maintenance", message: "API latency may increase on Sep 3, 02:00–03:00 UTC.", at: "2026-08-26T08:00:00Z", read: true },
  { id: "ntf_09", type: "billing", title: "Spending limit at 74%", message: "$1,842 of your $2,500 monthly limit is used.", at: "2026-08-25T12:00:00Z", read: true, href: "/billing" },
  { id: "ntf_10", type: "agent", title: "Churn Signal paused", message: "The agent was disabled by Daniel Reyes.", at: "2026-08-05T14:00:00Z", read: true, href: "/agents/agt_churn_signal" },
];

export const notificationPreferences = [
  { id: "agent_failures", category: "Agent", label: "Agent run failures", description: "A run fails or an agent enters an error state.", email: true, inApp: true },
  { id: "agent_deploys", category: "Agent", label: "Agent deployments", description: "Someone deploys a new agent version.", email: false, inApp: true },
  { id: "quota", category: "Billing", label: "Quota thresholds", description: "Token usage crosses 50%, 80% or 100%.", email: true, inApp: true },
  { id: "invoices", category: "Billing", label: "Invoices and payments", description: "New invoice, failed payment or refund.", email: true, inApp: true },
  { id: "spend", category: "Billing", label: "Spending limit alerts", description: "Spend approaches the configured budget.", email: true, inApp: false },
  { id: "invites", category: "Team", label: "Member invitations", description: "Someone joins, is invited or is removed.", email: false, inApp: true },
  { id: "roles", category: "Team", label: "Role changes", description: "A member's role or permissions change.", email: true, inApp: true },
  { id: "product", category: "System", label: "Product updates", description: "New models, features and deprecations.", email: false, inApp: true },
  { id: "maintenance", category: "System", label: "Maintenance windows", description: "Planned downtime and incident updates.", email: true, inApp: true },
];
