/**
 * Single source of truth for Yawn's brand facts. Reused across meta tags,
 * OpenGraph defaults, and JSON-LD structured data so every surface (site,
 * tutorials, schema.org markup) describes the agency the exact same way.
 * Consistent, repeated descriptions are what build the "consensus" AI
 * search systems weigh when deciding whether to cite/mention a brand.
 */

export const BRAND = {
  name: "Yawn",
  legalName: "Yawn AI Automation Agency",
  tagline: "Automate the Boring. Wake Up Your Business.",
  description:
    "Yawn is an AI automation agency that builds lead follow-up, order operations, and back-office workflows for sales teams, e-commerce stores, small businesses, and real estate wholesalers — so nothing falls through the cracks between an inbound lead and a closed deal.",
  url: "https://yawn.ai",
  logo: "/yawn-koala.png",
  sameAs: [] as string[],
} as const;

export const DEFAULT_OG_IMAGE = `${BRAND.url}${BRAND.logo}`;
