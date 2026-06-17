import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { authRouter } from "./_core/auth";
import { ENV } from "./_core/env";

// Load .env if present (Node 20.6+ has process.loadEnvFile).
try {
  process.loadEnvFile?.();
} catch {
  /* no .env file — fine, we fall back to mocks */
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(cookieParser());

// Auth + tRPC API
app.use("/api/auth", authRouter);
app.use(
  "/trpc",
  createExpressMiddleware({ router: appRouter, createContext }),
);

// In production, serve the built client and let the SPA handle routing.
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
