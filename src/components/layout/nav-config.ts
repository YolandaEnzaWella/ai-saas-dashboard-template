import {
  BarChart3,
  Bell,
  Blocks,
  Bot,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  MessagesSquare,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Sidebar grouping per SRS §5.1. Add a module by adding one entry here. */
export const navigation: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Chat", href: "/chat", icon: MessagesSquare },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "AI Studio",
    items: [
      { label: "AI Agents", href: "/agents", icon: Bot },
      { label: "Prompts", href: "/prompts", icon: Sparkles },
      { label: "Integrations", href: "/integrations", icon: Blocks },
    ],
  },
  {
    label: "Usage & Billing",
    items: [
      { label: "Usage", href: "/usage", icon: BarChart3, badge: "82%" },
      { label: "Billing", href: "/billing", icon: Receipt },
      { label: "Subscription", href: "/subscription", icon: CreditCard },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "API Keys", href: "/api-keys", icon: KeyRound },
      { label: "Team Members", href: "/team", icon: Users },
      { label: "Roles & Permissions", href: "/roles", icon: ShieldCheck },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/** Flat list backing the global search palette. */
export const searchableRoutes = navigation.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.label })),
);
