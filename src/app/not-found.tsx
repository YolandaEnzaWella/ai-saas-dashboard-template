import Link from "next/link";
import { ArrowLeft, Compass, LifeBuoy, Search } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const suggestions = [
  { href: "/dashboard", label: "Dashboard", description: "Metrics, usage and recent activity" },
  { href: "/agents", label: "AI Agents", description: "Build and monitor your agents" },
  { href: "/chat", label: "AI Chat", description: "Talk to an agent" },
  { href: "/billing", label: "Billing", description: "Invoices and payment methods" },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center">
      <Logo />
      <p className="mt-10 font-mono text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you are looking for was moved, renamed, or never existed. Check the URL or start
        from one of the sections below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>
        <Link
          href="/settings"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <LifeBuoy className="h-4 w-4" aria-hidden />
          Contact support
        </Link>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <p className="mb-3 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Compass className="h-3.5 w-3.5" aria-hidden />
          Popular destinations
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
