/**
 * Security content registry.
 *
 * Policy markdown lives in `src/content/security/*.md`. Each file is expected to
 * start with a `# Title` heading followed by a `_Last updated…_` line, but we do
 * not depend on that format — we fall back gracefully when it is absent.
 *
 * We use Vite's `import.meta.glob` to bundle every markdown file as a raw string
 * at build time. A relative glob path is used (rather than the `@` alias) because
 * raw glob imports with the alias can be flaky across Vite versions; a relative
 * path from this file (`src/lib`) to `src/content/security` is unambiguous.
 */

const files = import.meta.glob("../content/security/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type PolicyCategory = "Core Policies" | "Legal";

export interface Policy {
  /** Filename without the `.md` extension, e.g. `password-policy`. */
  slug: string;
  /** First `# ` heading, or a humanized version of the slug. */
  title: string;
  /** Raw markdown body (full file contents). */
  body: string;
  /** Which group this policy belongs to in the Security Center. */
  category: PolicyCategory;
}

/** Slugs that belong in the "Legal" group; everything else *-policy is "Core". */
const LEGAL_SLUGS = new Set(["privacy-policy", "terms-of-service"]);

/** Preferred display order for the well-known core policies. */
const CORE_ORDER = [
  "information-security-policy",
  "access-control-policy",
  "password-policy",
  "acceptable-use-policy",
  "incident-response-policy",
  "vulnerability-management-policy",
  "data-retention-policy",
  "backup-recovery-policy",
  "change-management-policy",
  "vendor-management-policy",
];

const LEGAL_ORDER = ["privacy-policy", "terms-of-service"];

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/i, "");
}

/** Turn `access-control-policy` into `Access Control Policy`. */
function humanize(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Extract the first level-1 markdown heading, if present. */
function extractTitle(body: string, slug: string): string {
  for (const line of body.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match) return match[1].trim();
  }
  return humanize(slug);
}

function categoryFor(slug: string): PolicyCategory {
  return LEGAL_SLUGS.has(slug) ? "Legal" : "Core Policies";
}

function orderIndex(slug: string, category: PolicyCategory): number {
  const list = category === "Legal" ? LEGAL_ORDER : CORE_ORDER;
  const idx = list.indexOf(slug);
  // Unknown slugs sort after the known ones, alphabetically.
  return idx === -1 ? list.length : idx;
}

const policies: Policy[] = Object.entries(files ?? {})
  .map(([path, raw]) => {
    const slug = slugFromPath(path);
    const body = typeof raw === "string" ? raw : "";
    return {
      slug,
      title: extractTitle(body, slug),
      body,
      category: categoryFor(slug),
    } satisfies Policy;
  })
  .sort((a, b) => {
    if (a.category !== b.category) {
      // Core Policies before Legal.
      return a.category === "Core Policies" ? -1 : 1;
    }
    const ai = orderIndex(a.slug, a.category);
    const bi = orderIndex(b.slug, b.category);
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title);
  });

const bySlug = new Map(policies.map((p) => [p.slug, p]));

/** All policies, sorted by category then preferred order. Empty if none exist. */
export const securityPolicies: readonly Policy[] = policies;

/** The ordered category groups, used to render the Security Center. */
export const POLICY_CATEGORIES: readonly PolicyCategory[] = ["Core Policies", "Legal"];

/** Policies belonging to a given category, in sorted order. */
export function policiesByCategory(category: PolicyCategory): Policy[] {
  return policies.filter((p) => p.category === category);
}

/** Look up a single policy by slug. Returns `undefined` if not found. */
export function getPolicy(slug: string): Policy | undefined {
  return bySlug.get(slug);
}

/** Convenience: true when no policy markdown was found at build time. */
export const hasPolicies = policies.length > 0;
