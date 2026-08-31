import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntegrationDetail } from "./integration-detail";
import { getIntegration, integrations } from "@/data/integrations";

export function generateStaticParams() {
  return integrations.map((integration) => ({ slug: integration.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: getIntegration(params.slug)?.name ?? "Integration" };
}

export default function IntegrationPage({ params }: { params: { slug: string } }) {
  const integration = getIntegration(params.slug);
  if (!integration) notFound();
  return <IntegrationDetail integration={integration} />;
}
