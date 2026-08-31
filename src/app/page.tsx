import type { Metadata } from "next";
import { RootRedirect } from "./root-redirect";

export const metadata: Metadata = {
  title: "Nexus AI",
  // A static export cannot issue a server redirect, so the entry point is a
  // client-side redirect with a <meta refresh> fallback for crawlers.
  other: { refresh: "0; url=./dashboard" },
};

export default function RootPage() {
  return <RootRedirect />;
}
