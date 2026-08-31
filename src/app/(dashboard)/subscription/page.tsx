import type { Metadata } from "next";
import { PricingView } from "./pricing-view";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionPage() {
  return <PricingView />;
}
