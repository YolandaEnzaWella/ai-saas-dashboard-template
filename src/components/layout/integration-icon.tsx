import {
  BarChart3,
  Blocks,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  MessageSquare,
  MessagesSquare,
  SquareKanban,
  Users,
  Webhook,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit map instead of `import * as Icons from "lucide-react"` — a namespace
 * import defeats tree shaking and pulls the entire icon set into the bundle.
 */
const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  MessageSquare,
  MessagesSquare,
  SquareKanban,
  Users,
  Webhook,
  Zap,
};

export function IntegrationIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Blocks;
  return <Icon className={className} aria-hidden />;
}
