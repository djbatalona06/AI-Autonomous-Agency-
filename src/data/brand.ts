/**
 * Single source of truth for Yawn's brand facts. Reused across meta tags,
 * OpenGraph defaults, and JSON-LD structured data so every surface (site,
 * tutorials, schema.org markup) describes the agency the exact same way.
 * Consistent, repeated descriptions are what build the "consensus" AI
 * search systems weigh when deciding whether to cite/mention a brand.
 */

/**
 * Origin the site is actually served from. Canonicals, OG urls, JSON-LD, and
 * the generated sitemap all derive from this, so it must match the domain
 * Google sees — a canonical pointing at a domain this deployment does not
 * serve gets every page dropped from the index.
 *
 * Override with `VITE_SITE_URL` when a real domain is attached. Read from both
 * `import.meta.env` (Vite client build) and `process.env` (plain `tsx`, used by
 * scripts/generate-sitemap.ts), since this module is imported by both.
 */
function siteUrl(): string {
  const fromVite =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_SITE_URL as string | undefined)
      : undefined;
  const fromNode =
    typeof process !== "undefined" ? process.env?.VITE_SITE_URL : undefined;
  return (fromVite || fromNode || "https://ai-autonomous-agency.vercel.app").replace(/\/$/, "");
}

export const BRAND = {
  name: "Yawn",
  legalName: "Yawn AI Automation Agency",
  tagline: "Automate the Boring. Wake Up Your Business.",
  description:
    "Yawn is an AI automation agency that builds lead follow-up, order operations, and back-office workflows for sales teams, e-commerce stores, small businesses, and real estate wholesalers — so nothing falls through the cracks between an inbound lead and a closed deal.",
  url: siteUrl(),
  logo: "/yawn-koala.png",
  sameAs: [] as string[],
} as const;

export const DEFAULT_OG_IMAGE = `${BRAND.url}${BRAND.logo}`;
