# Nexus AI — AI + SaaS Admin Dashboard Template

A production-grade admin dashboard template for **AI SaaS products**: AI agents, chat,
prompt templates, token usage, usage-based billing, team management and integrations.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **Recharts**.
Every screen ships in light and dark mode, is responsive from 360px up, and is backed by
realistic typed mock data — no empty placeholder charts.

> This is a front-end template. It simulates an AI SaaS product; there is no live backend.
> All data lives in `src/data/` and is typed against `src/lib/types.ts`, so swapping mock
> data for your real API means changing one layer.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (Node host) |
| `npm run build:static` | Static export to `out/` (any static host) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | TypeScript, no emit |

Requires Node.js 18.17 or newer.

**Demo credentials** — the login form is pre-filled. The 2FA screen accepts the code
`824193`.

---

## What is included

### 13 modules

| # | Module | Routes |
| --- | --- | --- |
| 1 | Dashboard | `/dashboard`, `/dashboard/compact` |
| 2 | AI Chat | `/chat`, `/chat/[id]` |
| 3 | AI Agents | `/agents`, `/agents/new`, `/agents/[id]`, `/agents/[id]/edit` |
| 4 | Prompt Management | `/prompts`, `/prompts/new`, `/prompts/[id]` |
| 5 | Usage / Tokens | `/usage`, `/usage/breakdown`, `/usage/reports` |
| 6 | Billing | `/billing`, `/billing/invoices`, `/billing/invoices/[id]`, `/billing/payment-methods` |
| 7 | Subscription | `/subscription`, `/subscription/current` |
| 8 | API Keys | `/api-keys` |
| 9 | Team Members | `/team`, `/team/invite`, `/team/[id]` |
| 10 | Roles & Permissions | `/roles`, `/roles/matrix` |
| 11 | Analytics | `/analytics`, `/analytics/agents`, `/analytics/users` |
| 12 | Notifications | `/notifications`, `/notifications/settings` |
| 13 | Integrations | `/integrations`, `/integrations/[slug]` |

Plus **authentication** (`/login`, `/register`, `/forgot-password`, `/two-factor`),
**settings** (`/settings`, `/profile`) and **error screens** (404, 500) — 40+ views in total.

### Highlights

- **Agent workflow builder** — visual step editor with trigger / LLM / tool / condition /
  output node types, plus a live test panel.
- **AI chat** — multi-thread history with search, markdown rendering (code blocks, tables,
  lists), model selector, typing indicator, attachments, regenerate and copy.
- **Prompt editor** — `{{variable}}` detection with a live resolved preview and version history.
- **Permission matrix** — modules × actions grid with row and column bulk toggles and
  dependency rules (create/edit/delete imply view).
- **Usage & quota** — token trend charts, quota and budget meters with near-limit alerts,
  breakdown by agent / model / member, month-over-month comparison, CSV/PDF export flow.
- **Reveal-once API keys**, scoped permissions, rate limits and a request log.
- **Drag-to-rearrange dashboard widgets** with the layout persisted to `localStorage`.
- **Command palette** — `⌘K` / `Ctrl+K` searches navigation, agents, prompts and conversations.
- **Empty, loading and error states** on every data module.

---

## Folder structure

```
src/
├── app/
│   ├── (auth)/               # Split-screen auth layout
│   │   ├── login/ register/ forgot-password/ two-factor/
│   ├── (dashboard)/          # Sidebar + topbar shell
│   │   ├── layout.tsx
│   │   ├── dashboard/ chat/ agents/ prompts/ usage/ billing/
│   │   ├── subscription/ api-keys/ team/ roles/ analytics/
│   │   └── notifications/ integrations/ settings/ profile/
│   ├── globals.css           # Design tokens (edit here to re-skin)
│   ├── layout.tsx            # Root layout, theme + toast providers
│   ├── not-found.tsx         # 404
│   └── error.tsx             # 500
├── components/
│   ├── ui/                   # Button, Card, Table, Modal, Toast, …
│   ├── layout/               # Sidebar, Topbar, search, theme toggle
│   └── charts/               # Recharts wrappers, heatmap, sparkline
├── data/                     # Typed mock data, one file per domain
├── i18n/                     # String dictionary (i18n-ready)
└── lib/
    ├── types.ts              # Domain entities
    ├── utils.ts              # Formatters and helpers
    └── markdown.tsx          # Dependency-free markdown renderer
```

Each module follows the same shape: a server `page.tsx` that exports metadata and renders a
`*-view.tsx` client component holding the interactive state. Copy any module folder to add
a new one.

---

## Customization

### Colors and theming

Every color is an HSL triple in a CSS custom property. Edit the `:root` and `.dark` blocks in
`src/app/globals.css`:

```css
:root {
  --primary: 258 89% 62%;      /* brand color */
  --accent: 190 92% 42%;
  --radius: 0.75rem;           /* corner rounding, template-wide */
  --chart-1: 258 89% 62%;      /* chart series 1–5 */
}
```

Charts read the same variables, so they follow your palette and switch themes automatically —
no JavaScript involved.

### Navigation

Add a sidebar entry in `src/components/layout/nav-config.ts`. The command palette picks it
up automatically.

### Connecting real data

`src/data/*.ts` exports plain typed objects. Replace an export with a fetch:

```ts
// src/data/agents.ts
export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${process.env.API_URL}/agents`, { next: { revalidate: 60 } });
  return res.json();
}
```

Then `await` it in the module's `page.tsx` and pass the result into the view component.
The types in `src/lib/types.ts` already mirror common LLM and Stripe-style object shapes
(invoice, subscription, payment method), so the mapping is usually one-to-one.

### Internationalization

`src/i18n/en.ts` holds the string dictionary. Add `src/i18n/<locale>.ts` with the same shape,
register it in `src/i18n/index.ts`, and the `Dictionary` type will flag any missing keys.

---

## Deployment

Every route in this template is prerendered, so it runs either as a normal Next.js
app or as a pile of static files.

### Node host (Vercel, Netlify, Render, Docker, VPS)

```bash
npm run build
npm run start
```

### Static host (GitHub Pages, S3, Cloudflare Pages, any CDN)

```bash
npm run build:static      # writes ./out
```

Serve `out/` as-is. If the site is **not** at the domain root — a GitHub Pages
project site lives at `/<repo>/` — set the prefix so routes and assets resolve:

```bash
NEXT_OUTPUT=export NEXT_BASE_PATH=/your-repo-name npm run build:static
```

### GitHub Pages

A workflow is included at `.github/workflows/deploy-pages.yml`. It lints,
typechecks, exports the site with the repository name as the base path, and
publishes it.

1. In the repository: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
2. Push to a branch listed under `on.push.branches` in the workflow, or trigger
   it manually from the **Actions** tab via *Run workflow*.

The site then lives at `https://<owner>.github.io/<repo>/`.

Two things to know: GitHub Pages only serves public repositories unless you are
on a paid plan, and the deploy is entirely static — there is no server, which is
fine here because the template has no backend.

## Browser support

Latest two versions of Chrome, Firefox, Edge and Safari. Tested at 360px, 480px, 768px,
1280px and 1920px.

---

## Credits

- [Next.js](https://nextjs.org/) — MIT
- [Tailwind CSS](https://tailwindcss.com/) — MIT
- [Recharts](https://recharts.org/) — MIT
- [Lucide icons](https://lucide.dev/) — ISC
- [next-themes](https://github.com/pacocoursey/next-themes) — MIT

All dependencies are permissively licensed and free for commercial use. No stock photography
is bundled — avatars are generated from initials.

Full documentation, including a page-by-page walkthrough, is in
[`docs/documentation.html`](docs/documentation.html).
