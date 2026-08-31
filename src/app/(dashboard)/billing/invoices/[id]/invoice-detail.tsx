"use client";

import Link from "next/link";
import { Download, Printer, Send } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { paymentMethods } from "@/data/billing";
import type { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const { toast } = useToast();
  const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
  const card = paymentMethods.find((method) => method.isDefault);

  return (
    <>
      <PageHeader
        title={invoice.number}
        description={`Billing period ${invoice.period}`}
        breadcrumbs={[
          { label: "Billing", href: "/billing" },
          { label: "Invoices", href: "/billing/invoices" },
          { label: invoice.number },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => toast({ title: "Invoice sent", description: "A copy was emailed to your billing contact.", tone: "success" })}
            >
              <Send className="h-4 w-4" aria-hidden />
              Email copy
            </Button>
            <Button onClick={() => toast({ title: "Download started", description: `${invoice.number}.pdf`, tone: "info" })}>
              <Download className="h-4 w-4" aria-hidden />
              Download PDF
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
            <div>
              <p className="text-lg font-semibold">Nexus AI, Inc.</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                548 Market Street, Suite 22
                <br />
                San Francisco, CA 94104
                <br />
                billing@nexus.ai
              </p>
            </div>
            <div className="text-right">
              <Badge tone={statusTone[invoice.status]} className="capitalize">
                {invoice.status}
              </Badge>
              <p className="mt-3 text-2xl font-semibold">{formatCurrency(invoice.amount)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {invoice.status === "paid" && invoice.paidAt
                  ? `Paid ${formatDate(invoice.paidAt)}`
                  : `Due ${formatDate(invoice.dueAt)}`}
              </p>
            </div>
          </div>

          <div className="grid gap-6 border-b border-border py-6 sm:grid-cols-3">
            {[
              { label: "Billed to", value: ["Nexus Labs", "Amara Okafor", "amara@nexus.ai"] },
              { label: "Invoice details", value: [invoice.number, `Issued ${formatDate(invoice.issuedAt)}`, `Due ${formatDate(invoice.dueAt)}`] },
              {
                label: "Payment method",
                value: card ? [`${card.brand} •••• ${card.last4}`, `Expires ${card.expiry}`, card.holder] : ["No card on file"],
              },
            ].map((block) => (
              <div key={block.label}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {block.label}
                </p>
                {block.value.map((line) => (
                  <p key={line} className="text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="py-6">
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Description</TH>
                    <TH className="text-right">Qty</TH>
                    <TH className="text-right">Unit price</TH>
                    <TH className="text-right">Amount</TH>
                  </TR>
                </THead>
                <TBody>
                  {invoice.items.map((item) => (
                    <TR key={item.description} className="hover:bg-transparent">
                      <TD className="text-sm">{item.description}</TD>
                      <TD className="text-right text-sm text-muted-foreground">{item.quantity}</TD>
                      <TD className="text-right text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)}
                      </TD>
                      <TD className="text-right text-sm font-medium">{formatCurrency(item.total)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          </div>

          <div className="ml-auto max-w-xs space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>

          {invoice.status === "overdue" && (
            <div className="mt-6 rounded-lg border border-danger/40 bg-danger/10 p-4">
              <p className="text-sm font-medium">This invoice is overdue</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The last charge attempt failed. Update your card or retry the payment.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => toast({ title: "Payment retried", description: "We will email you the result shortly.", tone: "info" })}
                >
                  Retry payment
                </Button>
                <Link
                  href="/billing/payment-methods"
                  className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-secondary"
                >
                  Update payment method
                </Link>
              </div>
            </div>
          )}

          <p className="mt-8 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            Questions about this invoice? Reply to billing@nexus.ai and quote {invoice.number}.
            Payments are processed in USD.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
