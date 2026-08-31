import type { AddOn, Invoice, PaymentMethod, Plan, Subscription, Transaction } from "@/lib/types";

export const plans: Plan[] = [
  {
    id: "plan_free",
    name: "Free",
    tagline: "Kick the tires on a single agent.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    tokensIncluded: 100_000,
    seats: "1 seat",
    featured: false,
    features: ["1 AI agent", "100K tokens / month", "Community support", "7-day usage history"],
    notIncluded: ["Team roles", "API keys", "Custom integrations", "SSO"],
  },
  {
    id: "plan_pro",
    name: "Pro",
    tagline: "For solo builders shipping to production.",
    monthlyPrice: 49,
    yearlyPrice: 470,
    tokensIncluded: 5_000_000,
    seats: "3 seats",
    featured: false,
    features: ["10 AI agents", "5M tokens / month", "Email support", "90-day usage history", "5 API keys", "Standard integrations"],
    notIncluded: ["Custom roles", "SSO", "Audit log export"],
  },
  {
    id: "plan_team",
    name: "Team",
    tagline: "Shared agents, roles and usage controls.",
    monthlyPrice: 199,
    yearlyPrice: 1910,
    tokensIncluded: 20_000_000,
    seats: "25 seats",
    featured: true,
    features: ["Unlimited agents", "20M tokens / month", "Priority support", "Unlimited history", "Unlimited API keys", "All integrations", "Custom roles & permissions", "Spending limits"],
    notIncluded: ["SSO / SAML", "Dedicated capacity"],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    tagline: "Compliance, SSO and dedicated capacity.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    tokensIncluded: 0,
    seats: "Unlimited seats",
    featured: false,
    features: ["Everything in Team", "SSO / SAML & SCIM", "Dedicated capacity", "Custom data retention", "99.9% uptime SLA", "Named support engineer", "Audit log export"],
    notIncluded: [],
  },
];

export const addOns: AddOn[] = [
  { id: "add_tokens", name: "Extra token pack", description: "5M additional tokens, valid for 12 months.", price: 39, unit: "per pack" },
  { id: "add_seats", name: "Additional seats", description: "Add collaborators beyond your plan limit.", price: 12, unit: "per seat / month" },
  { id: "add_retention", name: "Extended retention", description: "Keep conversation logs for 24 months.", price: 29, unit: "per month" },
  { id: "add_support", name: "Priority support", description: "One-hour first response, 24/5 coverage.", price: 99, unit: "per month" },
];

export const subscription: Subscription = {
  id: "sub_01",
  teamId: "team_01",
  planId: "plan_team",
  status: "active",
  billingCycle: "monthly",
  currentPeriodStart: "2026-08-01",
  currentPeriodEnd: "2026-08-31",
  seats: 25,
  amount: 199,
};

export const currentBill = {
  base: 199,
  overage: 84.4,
  addOns: 39,
  credits: -12,
  tax: 24.53,
  get total() {
    return this.base + this.overage + this.addOns + this.credits + this.tax;
  },
  estimatedNext: 362.8,
  dueOn: "2026-09-05",
};

export const invoices: Invoice[] = [
  {
    id: "inv_0831", number: "INV-2026-0831", subscriptionId: "sub_01", amount: 334.93, tax: 24.53,
    status: "pending", issuedAt: "2026-08-31", dueAt: "2026-09-05", period: "Aug 1 – Aug 31, 2026",
    items: [
      { description: "Team plan — 25 seats", quantity: 1, unitPrice: 199, total: 199 },
      { description: "Token overage (8.98M tokens)", quantity: 8980, unitPrice: 0.0094, total: 84.4 },
      { description: "Extra token pack", quantity: 1, unitPrice: 39, total: 39 },
      { description: "Referral credit", quantity: 1, unitPrice: -12, total: -12 },
    ],
  },
  {
    id: "inv_0813", number: "INV-2026-0813", subscriptionId: "sub_01", amount: 288.12, tax: 21.1,
    status: "paid", issuedAt: "2026-07-31", dueAt: "2026-08-05", paidAt: "2026-08-02", period: "Jul 1 – Jul 31, 2026",
    items: [
      { description: "Team plan — 25 seats", quantity: 1, unitPrice: 199, total: 199 },
      { description: "Token overage (7.24M tokens)", quantity: 7240, unitPrice: 0.0094, total: 68.02 },
    ],
  },
  {
    id: "inv_0742", number: "INV-2026-0742", subscriptionId: "sub_01", amount: 264.5, tax: 19.4,
    status: "overdue", issuedAt: "2026-06-30", dueAt: "2026-07-05", period: "Jun 1 – Jun 30, 2026",
    items: [
      { description: "Team plan — 25 seats", quantity: 1, unitPrice: 199, total: 199 },
      { description: "Token overage (4.9M tokens)", quantity: 4900, unitPrice: 0.0094, total: 46.1 },
    ],
  },
  {
    id: "inv_0688", number: "INV-2026-0688", subscriptionId: "sub_01", amount: 241.86, tax: 17.8,
    status: "paid", issuedAt: "2026-05-31", dueAt: "2026-06-05", paidAt: "2026-06-01", period: "May 1 – May 31, 2026",
    items: [
      { description: "Team plan — 25 seats", quantity: 1, unitPrice: 199, total: 199 },
      { description: "Token overage (2.66M tokens)", quantity: 2660, unitPrice: 0.0094, total: 25.06 },
    ],
  },
  {
    id: "inv_0621", number: "INV-2026-0621", subscriptionId: "sub_01", amount: 218.9, tax: 16.1,
    status: "paid", issuedAt: "2026-04-30", dueAt: "2026-05-05", paidAt: "2026-05-03", period: "Apr 1 – Apr 30, 2026",
    items: [{ description: "Team plan — 25 seats", quantity: 1, unitPrice: 199, total: 199 }],
  },
  {
    id: "inv_0574", number: "INV-2026-0574", subscriptionId: "sub_01", amount: 64.2, tax: 4.7,
    status: "refunded", issuedAt: "2026-03-31", dueAt: "2026-04-05", paidAt: "2026-04-02", period: "Mar 1 – Mar 31, 2026",
    items: [{ description: "Pro plan — 3 seats", quantity: 1, unitPrice: 49, total: 49 }],
  },
];

export function getInvoice(id: string) {
  return invoices.find((invoice) => invoice.id === id);
}

export const paymentMethods: PaymentMethod[] = [
  { id: "pm_01", brand: "Visa", last4: "4242", expiry: "09/2028", holder: "Nexus Labs Inc.", isDefault: true, country: "US" },
  { id: "pm_02", brand: "Mastercard", last4: "8210", expiry: "03/2027", holder: "Amara Okafor", isDefault: false, country: "US" },
  { id: "pm_03", brand: "Amex", last4: "1005", expiry: "11/2026", holder: "Nexus Labs Inc.", isDefault: false, country: "GB" },
];

export const transactions: Transaction[] = [
  { id: "txn_01", date: "2026-08-02", description: "Invoice INV-2026-0813", method: "Visa •••• 4242", amount: 288.12, status: "succeeded" },
  { id: "txn_02", date: "2026-08-14", description: "Extra token pack", method: "Visa •••• 4242", amount: 39, status: "succeeded" },
  { id: "txn_03", date: "2026-07-05", description: "Invoice INV-2026-0742", method: "Visa •••• 4242", amount: 264.5, status: "failed" },
  { id: "txn_04", date: "2026-06-01", description: "Invoice INV-2026-0688", method: "Mastercard •••• 8210", amount: 241.86, status: "succeeded" },
  { id: "txn_05", date: "2026-05-03", description: "Invoice INV-2026-0621", method: "Visa •••• 4242", amount: 218.9, status: "succeeded" },
  { id: "txn_06", date: "2026-04-02", description: "Invoice INV-2026-0574", method: "Visa •••• 4242", amount: 64.2, status: "refunded" },
  { id: "txn_07", date: "2026-08-28", description: "Seat add-on (2 seats)", method: "Visa •••• 4242", amount: 24, status: "pending" },
];

export function planById(id: string) {
  return plans.find((plan) => plan.id === id);
}
