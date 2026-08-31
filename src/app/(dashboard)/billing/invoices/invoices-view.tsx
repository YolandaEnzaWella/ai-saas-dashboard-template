"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Receipt } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { TBody, TD, TH, THead, TR, Table, TableWrapper } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { invoices, transactions } from "@/data/billing";
import { formatCurrency, formatDate } from "@/lib/utils";

export function InvoicesView() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("invoices");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const withinRange = (date: string) =>
    (!from || date >= from) && (!to || date <= to);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (status === "all" || invoice.status === status) &&
      withinRange(invoice.issuedAt) &&
      (invoice.number.toLowerCase().includes(query.trim().toLowerCase()) ||
        invoice.period.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      withinRange(transaction.date) &&
      transaction.description.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Invoices & transactions"
        description="Every charge on this workspace, with filters for finance reconciliation."
        breadcrumbs={[{ label: "Billing", href: "/billing" }, { label: "Invoices" }]}
        actions={
          <Button
            variant="outline"
            onClick={() => toast({ title: "Export queued", description: "All invoices as CSV.", tone: "info" })}
          >
            <Download className="h-4 w-4" aria-hidden />
            Export all
          </Button>
        }
      />

      <Card>
        <Tabs
          className="px-3"
          value={tab}
          onChange={setTab}
          items={[
            { id: "invoices", label: "Invoices", count: invoices.length },
            { id: "transactions", label: "Transactions", count: transactions.length },
          ]}
        />
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search invoice number or period…"
              className="min-w-[200px] flex-1"
            />
            {tab === "invoices" && (
              <Field label="Status" htmlFor="invoice-status" className="w-auto">
                <Select
                  id="invoice-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="min-w-[140px]"
                >
                  <option value="all">All statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="refunded">Refunded</option>
                </Select>
              </Field>
            )}
            <Field label="From" htmlFor="filter-from" className="w-auto">
              <Input id="filter-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </Field>
            <Field label="To" htmlFor="filter-to" className="w-auto">
              <Input id="filter-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </Field>
          </div>

          {tab === "invoices" ? (
            filteredInvoices.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No invoices match these filters"
                description="Widen the date range or clear the status filter to see more."
              />
            ) : (
              <TableWrapper>
                <Table>
                  <THead>
                    <TR className="hover:bg-transparent">
                      <TH>Invoice</TH>
                      <TH>Period</TH>
                      <TH>Issued</TH>
                      <TH>Due</TH>
                      <TH>Status</TH>
                      <TH className="text-right">Amount</TH>
                      <TH className="text-right">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {filteredInvoices.map((invoice) => (
                      <TR key={invoice.id}>
                        <TD>
                          <Link href={`/billing/invoices/${invoice.id}`} className="text-sm font-medium hover:text-primary">
                            {invoice.number}
                          </Link>
                        </TD>
                        <TD className="text-sm text-muted-foreground">{invoice.period}</TD>
                        <TD className="text-sm text-muted-foreground">{formatDate(invoice.issuedAt)}</TD>
                        <TD className="text-sm text-muted-foreground">{formatDate(invoice.dueAt)}</TD>
                        <TD>
                          <Badge tone={statusTone[invoice.status]} className="capitalize">
                            {invoice.status}
                          </Badge>
                        </TD>
                        <TD className="text-right text-sm font-medium">{formatCurrency(invoice.amount)}</TD>
                        <TD className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast({ title: "Download started", description: `${invoice.number}.pdf`, tone: "info" })}
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden />
                            PDF
                          </Button>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </TableWrapper>
            )
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <TR className="hover:bg-transparent">
                    <TH>Date</TH>
                    <TH>Description</TH>
                    <TH>Method</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Amount</TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredTransactions.map((transaction) => (
                    <TR key={transaction.id}>
                      <TD className="text-sm text-muted-foreground">{formatDate(transaction.date)}</TD>
                      <TD className="text-sm font-medium">{transaction.description}</TD>
                      <TD className="text-sm text-muted-foreground">{transaction.method}</TD>
                      <TD>
                        <Badge tone={statusTone[transaction.status]} className="capitalize">
                          {transaction.status}
                        </Badge>
                      </TD>
                      <TD className="text-right text-sm font-medium">{formatCurrency(transaction.amount)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          )}
        </CardContent>
      </Card>
    </>
  );
}
