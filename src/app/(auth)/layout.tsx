import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const highlights = [
  "13 modules covering agents, prompts, usage and billing",
  "Light and dark themes on every screen",
  "40+ pages built with typed mock data",
];

/** Split layout shared by login, register, password reset and 2FA. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" aria-label="Nexus AI home">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nexus AI. A ThemeForest dashboard template.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.5) 0, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.35) 0, transparent 40%)",
          }}
        />
        <div className="relative">
          <p className="text-sm font-medium opacity-80">Nexus AI Platform</p>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Ship your AI product without designing the admin panel first.
          </h2>
          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm opacity-90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-sm leading-relaxed opacity-90">
            “We replaced three weeks of dashboard work with this template and shipped our beta on
            schedule.”
          </p>
          <p className="mt-3 text-xs opacity-70">Product lead, AI automation startup</p>
        </div>
      </aside>
    </div>
  );
}
