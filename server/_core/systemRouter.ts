import { ENV } from "./env";
import { publicProcedure, router } from "../trpc";

export const systemRouter = router({
  health: publicProcedure.query(() => ({
    status: "ok" as const,
    time: new Date().toISOString(),
    providers: {
      llm: ENV.anthropicApiKey ? "anthropic" : ENV.openaiApiKey ? "openai" : "mock",
      images: ENV.openaiApiKey ? "openai" : "placeholder",
      scrape: ENV.firecrawlApiKey ? "firecrawl" : "fetch",
    },
  })),
});
