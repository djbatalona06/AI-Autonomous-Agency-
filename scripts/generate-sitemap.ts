import { writeFileSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { VERTICALS } from "../src/data/verticals";
import { BRAND } from "../src/data/brand";

/**
 * Generates public/sitemap.xml ahead of `vite build`, so it lands in dist/
 * alongside the other static public assets. Tutorial slugs are read straight
 * out of frontmatter rather than importing src/lib/tutorials.ts, since that
 * module relies on Vite's import.meta.glob (not available under plain tsx).
 */

const tutorialsDir = join(import.meta.dirname, "..", "src", "content", "tutorials");
const tutorialSlugs = readdirSync(tutorialsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = readFileSync(join(tutorialsDir, f), "utf-8");
    const match = /^slug:\s*(.+)$/m.exec(raw);
    return match?.[1].trim();
  })
  .filter((s): s is string => Boolean(s));

const staticPaths = ["/", "/catalog", "/pricing", "/tutorials"];
const verticalPaths = VERTICALS.map((v) => `/catalog/${v.code.toLowerCase()}`);
const tutorialPaths = tutorialSlugs.map((slug) => `/tutorials/${slug}`);

const urls = [...staticPaths, ...verticalPaths, ...tutorialPaths];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${BRAND.url}${path}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(import.meta.dirname, "..", "public", "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
