import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden>
          <path
            d="M12 3.5 4.5 8v8L12 20.5 19.5 16V8L12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-sm font-semibold tracking-tight">
          Nexus<span className="text-primary">AI</span>
        </span>
      )}
    </span>
  );
}
