# n8n Workflow Brainstorm Library

Auto-populated by a daily scrape of [n8n.io/workflows](https://n8n.io/workflows/) for the automation agency's brainstorming pipeline. Covers the 5 client verticals: Sales, Ecommerce, Wholesaling/REI, Productivity, Small Business.

- **Obsidian:** this folder is a self-contained vault section — open `n8n-workflows/` directly as an Obsidian vault (or a folder inside your existing vault). `_index.md` is the map-of-content; every vertical file uses frontmatter + wikilinks so backlinks/graph view work out of the box.
- **Google Drive:** a mirror lives in **My Drive → n8n Templates** for non-technical review and file drops after future scrape runs (raw `.json` exports, screenshots, client-facing summaries).
- **Template library:** once a design here is built and validated (Claude Code + n8n MCP, per the delivery SOP), promote it into the private `templates/{slug}/` repo with `workflow.json`, `README.md`, a demo clip, and a `CHANGELOG.md`.
- **Cadence:** refreshed daily at 12:00 AM. Each vertical file has a `## Pipeline Log` section where new candidates are appended — nothing here gets silently overwritten.

See `_index.md` for the full map.
