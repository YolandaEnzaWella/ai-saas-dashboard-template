"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, LifeBuoy, RotateCw, ServerCrash } from "lucide-react";
import { Logo } from "@/components/layout/logo";

/**
 * Route-level error boundary — the 500 page of this template.
 * `reset` re-renders the segment without a full page reload.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Replace with your error reporter (Sentry, Bugsnag, …).
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12 text-center">
      <Logo />
      <span className="mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <ServerCrash className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-6 font-mono text-sm font-medium text-danger">500</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Something broke on our side
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page failed to render. Our team has been notified — try again, and if it keeps happening
        send us the reference below.
      </p>

      {error.digest && (
        <p className="mt-4 rounded-md border border-border bg-secondary/60 px-3 py-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
        >
          <RotateCw className="h-4 w-4" aria-hidden />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
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
    </main>
  );
}
