import Link from "next/link";
import { Bot, CreditCard, KeyRound, Sparkles, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { recentActivity } from "@/data/users";
import { formatRelativeTime } from "@/lib/utils";

const typeIcon = {
  agent: Bot,
  billing: CreditCard,
  team: Users,
  prompt: Sparkles,
  api: KeyRound,
} as const;

/** Recent activity feed (FR-DSH-03). */
export function ActivityFeed({ limit = 8 }: { limit?: number }) {
  return (
    <ul className="divide-y divide-border">
      {recentActivity.slice(0, limit).map((item) => {
        const Icon = typeIcon[item.type];
        return (
          <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar name={item.actor} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">
                <span className="font-medium">{item.actor}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>{" "}
                <span className="font-medium">{item.target}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3 w-3" aria-hidden />
                {formatRelativeTime(item.at)}
              </p>
            </div>
          </li>
        );
      })}
      <li className="pt-3">
        <Link href="/analytics" className="text-xs font-medium text-primary hover:underline">
          View full activity log
        </Link>
      </li>
    </ul>
  );
}
