import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApp } from "./app";
import { ENV } from "./_core/env";

// Load .env if present (Node 20.6+ has process.loadEnvFile).
try {
  process.loadEnvFile?.();
} catch {
  /* no .env file — fine, we fall back to mocks */
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = createApp();

// In production, serve the built client and let the SPA handle routing.
// (On Vercel this branch is unused — static output is served by the platform
// and the API runs as a serverless function in `api/index.ts`.)
if (ENV.isProd) {
  const clientDir = path.join(__dirname, "..", "dist");
  app.use(express.static(clientDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
  if (!fs.existsSync(path.join(clientDir, "index.html"))) {
    console.warn("[Server] dist/index.html not found — run `npm run build` first.");
  }
}

app.listen(ENV.port, () => {
  console.log(`\n  Yawn server → http://localhost:${ENV.port}`);
  console.log(
    `  LLM: ${ENV.anthropicApiKey ? "anthropic" : ENV.openaiApiKey ? "openai" : "mock"} · ` +
      `Images: ${ENV.openaiApiKey ? "openai" : "placeholder"} · ` +
      `Scrape: ${ENV.firecrawlApiKey ? "firecrawl" : "fetch"}`,
  );
  if (!ENV.isProd) console.log(`  Client (dev) → http://localhost:5173\n`);
});
