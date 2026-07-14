export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  vertical: string;
  persona: string;
  body: string;
}

const RAW_FILES = import.meta.glob("../content/tutorials/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** Minimal frontmatter parser — flat `key: value` pairs only, no nesting. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

export const TUTORIALS: Tutorial[] = Object.values(RAW_FILES)
  .map((raw) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: meta.slug ?? "",
      title: meta.title ?? "",
      description: meta.description ?? "",
      vertical: meta.vertical ?? "",
      persona: meta.persona ?? "",
      body,
    };
  })
  .filter((t) => t.slug)
  .sort((a, b) => a.title.localeCompare(b.title));

export function getTutorial(slug: string): Tutorial | undefined {
  return TUTORIALS.find((t) => t.slug === slug);
}
