"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
/** Demo-only: the simulated authenticator accepts this code (NFR 4.2). */
const DEMO_CODE = "824193";

export function TwoFactorForm() {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(42);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const timer = window.setInterval(
      () => setSecondsLeft((value) => (value > 0 ? value - 1 : 30)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? ""));
    inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Enter all six digits.");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    window.setTimeout(() => {
      if (code === DEMO_CODE) {
        router.push("/dashboard");
        return;
      }
      setSubmitting(false);
      setError("That code is not valid. Try the demo code below.");
    }, 700);
  };

  return (
    <div>
      <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShieldCheck className="h-5 w-5" aria-hidden />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">Two-factor authentication</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter the 6-digit code from your authenticator app.
      </p>

      <form onSubmit={onSubmit} className="mt-7">
        <div className="flex gap-2" onPaste={onPaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={onKeyDown(index)}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={`Digit ${index + 1}`}
              maxLength={1}
              className={cn(
                "h-12 w-full rounded-md border bg-card text-center text-lg font-semibold transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                error ? "border-danger" : "border-input",
              )}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}

        <p className="mt-3 text-xs text-muted-foreground">
          Code refreshes in <span className="font-medium text-foreground">{secondsLeft}s</span>
        </p>

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? "Verifying…" : "Verify and continue"}
        </Button>
      </form>

      <div className="mt-5 rounded-md border border-dashed border-border bg-secondary/50 px-3.5 py-3 text-xs text-muted-foreground">
        Demo code: <span className="font-mono font-medium text-foreground">{DEMO_CODE}</span>
      </div>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          Lost your device?{" "}
          <button type="button" className="font-medium text-primary hover:underline">
            Use a recovery code
          </button>
        </p>
        <Link href="/login" className="inline-block text-xs text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
