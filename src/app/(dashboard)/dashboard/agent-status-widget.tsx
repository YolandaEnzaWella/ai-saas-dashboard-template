import Link from "next/link";
import { Badge, statusTone } from "@/components/ui/badge";
import { agents } from "@/data/agents";
import { formatCompact } from "@/lib/utils";

/** Compact agent status widget (FR-DSH-04). */
export function AgentStatusWidget({ limit = 5 }: { limit?: number }) {
  const counts = agents.reduce<Record<string, number>>((acc, agent) => {
    acc[agent.status] = (acc[agent.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        {(["active", "idle", "error"] as const).map((status) => (
          <div key={status} className="rounded-md bg-secondary/70 px-2 py-2.5">
            <p className="text-lg font-semibold">{counts[status] ?? 0}</p>
            <p className="text-[11px] capitalize text-muted-foreground">{status}</p>
          </div>
        ))}
      </div>
      <ul className="space-y-2.5">
        {agents.slice(0, limit).map((agent) => (
          <li key={agent.id} className="flex items-center gap-3">
            <Link
              href={`/agents/${agent.id}`}
              className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary"
            >
              {agent.name}
            </Link>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatCompact(agent.tokens30d)}
            </span>
            <Badge tone={statusTone[agent.status]} dot className="shrink-0 capitalize">
              {agent.status}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
