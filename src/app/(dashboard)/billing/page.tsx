import type { Metadata } from "next";
import { BillingOverview } from "./billing-overview";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return <BillingOverview />;
}
