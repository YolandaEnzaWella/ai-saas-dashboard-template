"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const rules = [
  { id: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { id: "case", label: "Upper and lowercase letters", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: "number", label: "At least one number", test: (value: string) => /\d/.test(value) },
  { id: "symbol", label: "At least one symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = React.useState({ name: "", workspace: "", email: "", password: "" });
  const [accepted, setAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const passed = rules.filter((rule) => rule.test(form.password)).length;
  const strengthTone = ["bg-danger", "bg-danger", "bg-warning", "bg-warning", "bg-success"][passed];

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) nextErrors.name = "Tell us your name.";
    if (form.workspace.trim().length < 2) nextErrors.workspace = "Pick a workspace name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (passed < 3) nextErrors.password = "Choose a stronger password.";
    if (!accepted) nextErrors.terms = "Accept the terms to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your workspace</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Start on the free tier — no card required.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input id="name" value={form.name} onChange={set("name")} placeholder="Amara Okafor" autoComplete="name" />
        </Field>

        <Field label="Workspace name" htmlFor="workspace" error={errors.workspace} hint="This is what your team will see.">
          <Input id="workspace" value={form.workspace} onChange={set("workspace")} placeholder="Nexus Labs" />
        </Field>

        <Field label="Work email" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <Input id="password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  index < passed ? strengthTone : "bg-muted",
                )}
              />
            ))}
          </div>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {rules.map((rule) => {
              const ok = rule.test(form.password);
              return (
                <li
                  key={rule.id}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px]",
                    ok ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <Check className="h-3 w-3 shrink-0" aria-hidden />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </Field>

        <div>
          <Checkbox
            id="terms"
            checked={accepted}
            onChange={setAccepted}
            label="I agree to the Terms of Service and Privacy Policy"
          />
          {errors.terms && <p className="mt-1.5 text-xs text-danger">{errors.terms}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? "Creating workspace…" : "Create workspace"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
