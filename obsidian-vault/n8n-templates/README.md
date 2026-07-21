---
tags: [n8n-brainstorm, index]
---

# n8n Templates Vault

Open this folder (`obsidian-vault/n8n-templates/`) directly in Obsidian as a vault, or add it
as a folder inside an existing vault — every note here is plain Markdown with YAML
frontmatter, no Obsidian-specific plugins required.

This is the Obsidian-facing mirror of `docs/n8n-brainstorm/` — same content, filed as one
note per node design instead of one file per vertical, so it's easy to browse, tag-filter, and
link from Obsidian.

## Verticals

- [[Sales Index]]
- [[Ecommerce Index]]
- [[Wholesaling REI Index]]
- [[Productivity Index]]
- [[Small Business Index]]

## How new notes arrive

`.github/workflows/n8n-brainstorm-scrape.yml` runs daily at 12:00 AM (America/Los_Angeles).
Its second stage (`obsidian-vault-sync`) files each new node design here, one note per idea,
named `YYYY-MM-DD-<id>-<slug>.md`, tagged `n8n-brainstorm` + `vertical/<code>` (+
`new-candidate` when nothing in `src/data/verticals.ts` covers it yet). Pull the branch/PR
it opens and this vault is current.
