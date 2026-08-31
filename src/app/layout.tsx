import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nexus AI — AI SaaS Admin Dashboard",
    template: "%s · Nexus AI",
  },
  description:
    "Admin dashboard template for AI SaaS products: agents, chat, prompts, token usage, billing and team management.",
  applicationName: "Nexus AI",
  authors: [{ name: "Nexus AI Template" }],
  keywords: ["AI dashboard", "SaaS admin", "AI agent", "Next.js template", "Tailwind CSS"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
