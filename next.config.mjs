/**
 * Two build modes:
 *
 * - Default (`npm run build`) — a normal Next.js server build for Vercel,
 *   Netlify, Docker or any Node host.
 * - Static (`npm run build:static`) — sets NEXT_OUTPUT=export to emit a plain
 *   `out/` folder for static hosts such as GitHub Pages. Every route in this
 *   template is prerendered, so nothing is lost in this mode.
 *
 * On GitHub Pages a project site is served from /<repo>/, so set
 * NEXT_BASE_PATH=/<repo> to prefix routes and assets.
 *
 * @type {import('next').NextConfig}
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export",
        // Pages resolves /dashboard/ to /dashboard/index.html reliably.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
