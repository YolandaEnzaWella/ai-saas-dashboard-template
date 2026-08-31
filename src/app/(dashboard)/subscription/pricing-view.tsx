"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Minus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { addOns, plans, subscription } from "@/data/billing";
import type { Plan } from "@/lib/types";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";

export function PricingView() {
  const { toast } = useToast();
  const [cycle, setCycle] = React.useState<"monthly" | "yearly">(subscription.billingCycle);
  const [pending, setPending] = React.useState<Plan | null>(null);
  const [confirming, setConfirming] = React.useState(false);

  const currentIndex = plans.findIndex((plan) => plan.id === subscription.planId);
  const priceOf = (plan: Plan) => (cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice);

  const confirmChange = () => {
    if (!pending) return;
    setConfirming(true);
    window.setTimeout(() => {
      setConfirming(false);
      const upgrade = plans.indexOf(pending) > currentIndex;
      toast({
        title: upgrade ? "Plan upgraded" : "Downgrade scheduled",
        description: upgrade
          ? `You are now on ${pending.name}. The prorated charge appears on your next invoice.`
          : `You stay on your current plan until ${subscription.currentPeriodEnd}, then move to ${pending.name}.`,
        tone: "success",
      });
      setPending(null);
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Plans & pricing"
        description="Change plan at any time. Upgrades apply immediately, downgrades at the end of the period."
        actions={
          <Link
            href="/subscription/current"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Current plan
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <SegmentedControl
          value={cycle}
          onChange={setCycle}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
        <Badge tone="success">Save 20% with yearly billing</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const isCurrent = plan.id === subscription.planId;
          const isEnterprise = plan.id === "plan_enterprise";
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col",
                plan.featured && "border-primary shadow-md shadow-primary/10",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{plan.name}</h3>
                  {isCurrent && <Badge tone="primary">Current</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>

                <div className="mt-5">
                  {isEnterprise ? (
                    <p className="text-3xl font-semibold tracking-tight">Custom</p>
                  ) : (
                    <p className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">
                        {formatCurrency(priceOf(plan))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /{cycle === "yearly" ? "year" : "month"}
                      </span>
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {plan.tokensIncluded > 0
                      ? `${formatCompact(plan.tokensIncluded)} tokens included · ${plan.seats}`
                      : plan.seats}
                  </p>
                </div>

                {isCurrent ? (
                  <Button variant="outline" className="mt-5 w-full" disabled>
                    Your current plan
                  </Button>
                ) : isEnterprise ? (
                  <Button variant="outline" className="mt-5 w-full" onClick={() => setPending(plan)}>
                    Contact sales
                  </Button>
                ) : (
                  <Button
                    variant={plan.featured ? "primary" : "outline"}
                    className="mt-5 w-full"
                    onClick={() => setPending(plan)}
                  >
                    {index > currentIndex ? "Upgrade" : "Downgrade"} to {plan.name}
                  </Button>
                )}

                <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              Add-ons
            </CardTitle>
            <CardDescription>Extend any plan without changing tiers.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium">{addOn.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{addOn.description}</p>
              <p className="mt-3 text-lg font-semibold">
                {formatCurrency(addOn.price)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">{addOn.unit}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => toast({ title: "Add-on activated", description: `${addOn.name} was added to your subscription.`, tone: "success" })}
              >
                Add to plan
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Frequently asked</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {[
            { q: "What happens when I hit my token quota?", a: "Requests keep working and overage bills at $0.0094 per 1K tokens. Set a spending limit in Billing to cap it." },
            { q: "Can I switch between monthly and yearly?", a: "Yes. Switching to yearly applies a prorated credit for the unused part of the current month." },
            { q: "Do unused tokens roll over?", a: "Plan tokens reset each period. Tokens bought as an add-on pack stay valid for 12 months." },
            { q: "How do downgrades work?", a: "You keep your current features until the end of the billing period, then move to the lower tier." },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-medium">{item.q}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title={`Switch to ${pending?.name ?? ""}?`}
        description={
          pending && plans.indexOf(pending) > currentIndex
            ? "The new plan takes effect immediately and you are charged a prorated amount today."
            : "Your current features stay active until the end of this billing period."
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button onClick={confirmChange} disabled={confirming}>
              {confirming && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Confirm change
            </Button>
          </>
        }
      >
        {pending && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-muted-foreground">New plan</dt>
              <dd className="font-medium">{pending.name}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-3">
              <dt className="text-muted-foreground">Billing</dt>
              <dd className="font-medium">
                {pending.monthlyPrice === 0 && pending.id === "plan_enterprise"
                  ? "Custom quote"
                  : `${formatCurrency(cycle === "yearly" ? pending.yearlyPrice : pending.monthlyPrice)} / ${cycle === "yearly" ? "year" : "month"}`}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Token allowance</dt>
              <dd className="font-medium">
                {pending.tokensIncluded > 0 ? `${formatCompact(pending.tokensIncluded)} / month` : "Negotiated"}
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </>
  );
}
