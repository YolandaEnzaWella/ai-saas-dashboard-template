"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CreditCard,
  DollarSign,
  Download,
  Receipt,
  Wallet,
} from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { Switch } from "@/components/ui/switch";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { SimpleBarChart } from "@/components/charts/simple-charts";
import { currentBill, invoices, paymentMethods, planById, subscription } from "@/data/billing";
import { quota, usageMonthly } from "@/data/usage";
import { formatCurrency, formatDate } from "@/lib/utils";

export function BillingOverview() {
  const { toast } = useToast();
  const [budgetAlerts, setBudgetAlerts] = React.useState(true);
  const [spendLimit, setSpendLimit] = React.useState(String(quota.spendLimit));
  const plan = planById(subscription.planId);
  const overdue = invoices.filter((invoice) => invoice.status === "overdue");
  const defaultCard = paymentMethods.find((method) => method.isDefault);

  const spendPct = (quota.spendUsed / Number(spendLimit || 1)) * 100;

  return (
    <>
      <PageHeader
        title="Billing"
        description="Current charges, invoices, payment methods and spending controls."
        actions={
          <>
            <Link
              href="/billing/invoices"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <Receipt className="h-4 w-4" aria-hidden />
              All invoices
            </Link>
            <Link
              href="/subscription"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Manage plan
            </Link>
          </>
        }
      />

      {overdue.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-danger/40 bg-danger/10 p-4">
          <AlertCircle className="h-[18px] w-[18px] shrink-0 text-danger" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {overdue.length} invoice{overdue.length > 1 ? "s are" : " is"} overdue
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {overdue[0].number} for {formatCurrency(overdue[0].amount)} was due{" "}
              {formatDate(overdue[0].dueAt)}. Update your payment method to avoid service limits.
            </p>
          </div>
          <Link
            href={`/billing/invoices/${overdue[0].id}`}
            className="inline-flex h-9 shrink-0 items-center rounded-md bg-danger px-4 text-sm font-medium text-danger-foreground transition-opacity hover:opacity-90"
          >
            Pay now
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current charges" value={formatCurrency(currentBill.total)} change={8.4} invertChange icon={DollarSign} />
        <StatCard label="Estimated next bill" value={formatCurrency(currentBill.estimatedNext)} hint={`due ${formatDate(currentBill.dueOn)}`} icon={CalendarClock} />
        <StatCard label="Current plan" value={plan?.name ?? "—"} hint={`${subscription.seats} seats`} icon={Wallet} />
        <StatCard label="Payment method" value={defaultCard ? `•••• ${defaultCard.last4}` : "None"} hint={defaultCard?.brand} icon={CreditCard} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>This month&rsquo;s charges</CardTitle>
              <CardDescription>
                {formatDate(subscription.currentPeriodStart)} – {formatDate(subscription.currentPeriodEnd)}
              </CardDescription>
            </div>
            <Badge tone="warning">Not yet finalized</Badge>
          </CardHeader>
          <CardContent>
            <TableWrapper>
              <Table className="min-w-[420px]">
                <TBody>
                  {[
                    { label: `${plan?.name} plan — ${subscription.seats} seats`, amount: currentBill.base },
                    { label: "Token overage", amount: currentBill.overage },
                    { label: "Add-ons", amount: currentBill.addOns },
                    { label: "Credits", amount: currentBill.credits },
                    { label: "Tax (VAT 8%)", amount: currentBill.tax },
                  ].map((row) => (
                    <TR key={row.label} className="hover:bg-transparent">
                      <TD className="text-sm text-muted-foreground">{row.label}</TD>
                      <TD className="text-right text-sm font-medium">{formatCurrency(row.amount)}</TD>
                    </TR>
                  ))}
                  <TR className="hover:bg-transparent">
                    <TD className="text-sm font-semibold">Total due</TD>
                    <TD className="text-right text-base font-semibold">{formatCurrency(currentBill.total)}</TD>
                  </TR>
                </TBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Spending limit</CardTitle>
              <CardDescription>Stop runaway usage before it bills.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">{formatCurrency(quota.spendUsed)}</span>
                <span className="text-muted-foreground">of {formatCurrency(Number(spendLimit) || 0)}</span>
              </div>
              <Progress
                value={spendPct}
                tone={spendPct >= 90 ? "danger" : spendPct >= 75 ? "warning" : "success"}
                label="Spending limit"
              />
            </div>
            <Field label="Monthly limit (USD)" htmlFor="spend-limit">
              <Input
                id="spend-limit"
                type="number"
                min={0}
                step={50}
                value={spendLimit}
                onChange={(event) => setSpendLimit(event.target.value)}
              />
            </Field>
            <div className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">Budget alerts</p>
                <p className="text-xs text-muted-foreground">Email at 80% and 100%.</p>
              </div>
              <Switch checked={budgetAlerts} onChange={setBudgetAlerts} label="Budget alerts" />
            </div>
            <Button
              className="w-full"
              onClick={() => toast({ title: "Spending limit saved", description: `New limit: ${formatCurrency(Number(spendLimit) || 0)}.`, tone: "success" })}
            >
              Save limit
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Spend history</CardTitle>
              <CardDescription>Last 12 months.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={usageMonthly.map((point) => ({ month: point.date, cost: point.cost }))}
              xKey="month"
              height={240}
              bars={[{ key: "cost", name: "Spend" }]}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent invoices</CardTitle>
              <CardDescription>Latest four billing periods.</CardDescription>
            </div>
            <Link href="/billing/invoices" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <TableWrapper>
              <Table className="min-w-[480px]">
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Invoice</TH>
                    <TH>Issued</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Amount</TH>
                    <TH className="w-10" />
                  </TR>
                </THead>
                <TBody>
                  {invoices.slice(0, 4).map((invoice) => (
                    <TR key={invoice.id}>
                      <TD>
                        <Link href={`/billing/invoices/${invoice.id}`} className="text-sm font-medium hover:text-primary">
                          {invoice.number}
                        </Link>
                      </TD>
                      <TD className="text-sm text-muted-foreground">{formatDate(invoice.issuedAt)}</TD>
                      <TD>
                        <Badge tone={statusTone[invoice.status]} className="capitalize">
                          {invoice.status}
                        </Badge>
                      </TD>
                      <TD className="text-right text-sm font-medium">{formatCurrency(invoice.amount)}</TD>
                      <TD>
                        <button
                          type="button"
                          aria-label={`Download ${invoice.number}`}
                          onClick={() => toast({ title: "Download started", description: `${invoice.number}.pdf`, tone: "info" })}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
