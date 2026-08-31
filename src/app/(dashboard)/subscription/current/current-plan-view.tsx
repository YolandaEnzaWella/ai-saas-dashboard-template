"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarClock, Check, CircleSlash, Loader2, PauseCircle, Users } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { planById, subscription } from "@/data/billing";
import { quota } from "@/data/usage";
import { team } from "@/data/users";
import { formatCompact, formatCurrency, formatDate } from "@/lib/utils";

export function CurrentPlanView() {
  const { toast } = useToast();
  const plan = planById(subscription.planId)!;
  const [cycle, setCycle] = React.useState(subscription.billingCycle);
  const [action, setAction] = React.useState<"pause" | "cancel" | null>(null);
  const [working, setWorking] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const quotaPct = Math.round((quota.used / quota.limit) * 100);
  const seatPct = Math.round((team.seatsUsed / team.seats) * 100);

  const confirm = () => {
    setWorking(true);
    window.setTimeout(() => {
      setWorking(false);
      toast({
        title: action === "pause" ? "Subscription paused" : "Cancellation scheduled",
        description:
          action === "pause"
            ? "Billing stops now. Your agents are disabled until you resume."
            : `You keep access until ${formatDate(subscription.currentPeriodEnd)}.`,
        tone: "warning",
      });
      setAction(null);
      setReason("");
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Current plan"
        description="What you are paying for right now, and what it includes."
        breadcrumbs={[{ label: "Subscription", href: "/subscription" }, { label: "Current plan" }]}
        actions={
          <Link
            href="/subscription"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            Compare plans
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                {plan.name} plan
                <Badge tone={statusTone[subscription.status]} dot className="capitalize">
                  {subscription.status}
                </Badge>
              </CardTitle>
              <CardDescription>{plan.tagline}</CardDescription>
            </div>
            <p className="text-right">
              <span className="text-2xl font-semibold">
                {formatCurrency(cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice)}
              </span>
              <span className="block text-xs text-muted-foreground">
                per {cycle === "yearly" ? "year" : "month"}
              </span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/60 p-3.5">
              <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                Current period {formatDate(subscription.currentPeriodStart)} –{" "}
                {formatDate(subscription.currentPeriodEnd)}. Renews automatically.
              </p>
              <SegmentedControl
                size="sm"
                value={cycle}
                onChange={(value) => {
                  setCycle(value);
                  toast({
                    title: `Switched to ${value} billing`,
                    description: value === "yearly" ? "You save 20% versus monthly." : "Billed every month from the next period.",
                    tone: "success",
                  });
                }}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly · -20%" },
                ]}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Token allowance</span>
                  <span className="text-muted-foreground">
                    {formatCompact(quota.used)} / {formatCompact(quota.limit)}
                  </span>
                </div>
                <Progress value={quotaPct} tone={quotaPct >= 80 ? "warning" : "primary"} label="Token allowance" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Seats</span>
                  <span className="text-muted-foreground">
                    {team.seatsUsed} / {team.seats}
                  </span>
                </div>
                <Progress value={seatPct} tone="accent" label="Seats used" />
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Included in {plan.name}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Workspace</span>
                <span className="font-medium">{team.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats used</span>
                <span className="font-medium">
                  {team.seatsUsed} of {team.seats}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Extra seat cost</span>
                <span className="font-medium">$12 / month</span>
              </div>
              <Link
                href="/team"
                className="block pt-1 text-xs font-medium text-primary hover:underline"
              >
                Manage team members
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Manage subscription</CardTitle>
                <CardDescription>Pause or cancel at any time.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={() => setAction("pause")}>
                <PauseCircle className="h-4 w-4" aria-hidden />
                Pause subscription
              </Button>
              <Button variant="outline" className="w-full text-danger" onClick={() => setAction("cancel")}>
                <CircleSlash className="h-4 w-4" aria-hidden />
                Cancel subscription
              </Button>
              <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
                Pausing keeps your data and configuration but stops billing and disables agents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={action !== null}
        onClose={() => setAction(null)}
        title={action === "pause" ? "Pause your subscription?" : "Cancel your subscription?"}
        description={
          action === "pause"
            ? "Billing stops immediately. Agents, API keys and integrations are disabled until you resume."
            : `You keep full access until ${formatDate(subscription.currentPeriodEnd)}. After that the workspace becomes read-only for 30 days, then data is deleted.`
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setAction(null)}>
              Keep my plan
            </Button>
            <Button variant="danger" onClick={confirm} disabled={working}>
              {working && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {action === "pause" ? "Pause subscription" : "Cancel subscription"}
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium">
            Tell us why (optional)
          </span>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Too expensive, missing a feature, switching tools…"
            className="min-h-[80px]"
          />
        </label>
      </Modal>
    </>
  );
}
