import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoiceDetail } from "./invoice-detail";
import { getInvoice, invoices } from "@/data/billing";

export function generateStaticParams() {
  return invoices.map((invoice) => ({ id: invoice.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  return { title: getInvoice(params.id)?.number ?? "Invoice" };
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = getInvoice(params.id);
  if (!invoice) notFound();
  return <InvoiceDetail invoice={invoice} />;
}
