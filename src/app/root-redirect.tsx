"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";

/**
 * Entry point. `redirect()` from next/navigation runs on the server and is not
 * available in a static export, so the hop to /dashboard happens on the client.
 */
export function RootRedirect() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Logo />
      <p className="text-sm text-muted-foreground">Opening your workspace…</p>
      <noscript>
        <a href="./dashboard" className="text-sm font-medium text-primary underline">
          Continue to the dashboard
        </a>
      </noscript>
    </main>
  );
}
