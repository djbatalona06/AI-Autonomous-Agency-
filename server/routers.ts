import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { sessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import {
  saveImageGeneration,
  getImageGenerationsByUserId,
  saveWebScrape,
  getWebScrapesByUserId,
} from "./db";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { scrapeUrl } from "./_core/scrape";
import { SsrfError } from "./_core/ssrf";
import { wrapUntrusted, INJECTION_GUARD } from "./_core/aiSafety";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions, maxAge: undefined });
      return { success: true } as const;
    }),
  }),

  // ── AI Image Studio ──
  images: router({
    generate: protectedProcedure
      .input(z.object({ prompt: z.string().min(1).max(1000) }))
      .mutation(async ({ input, ctx }) => {
        const { url: imageUrl } = await generateImage({ prompt: input.prompt });
        if (!imageUrl) throw new Error("No image returned from generation");

        const row = await saveImageGeneration(ctx.user.id, input.prompt, imageUrl, imageUrl, {
          generatedAt: new Date().toISOString(),
        });
        return { id: row.id, imageUrl, prompt: input.prompt, createdAt: row.createdAt, success: true };
      }),
    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
      .query(({ input, ctx }) => getImageGenerationsByUserId(ctx.user.id, input.limit)),
  }),

  // ── Web Crawler ──
  crawler: router({
    scrape: protectedProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input, ctx }) => {
        let scraped;
        try {
          scraped = await scrapeUrl(input.url);
        } catch (err) {
          // SSRF guard rejections are user input problems, not server faults:
          // surface a safe BAD_REQUEST rather than leaking a 500/stack.
          if (err instanceof SsrfError) {
            throw new TRPCError({ code: "BAD_REQUEST", message: err.message });
          }
          throw err;
        }
        const { title, text } = scraped;
        const rawContent = `# ${title}\n\n${text}`;

        // The scraped page is untrusted: wrap it in injection-resistant
        // delimiters and add the guard to the system prompt so page content
        // cannot hijack the model's instructions.
        const untrusted = wrapUntrusted(text);

        const summaryRes = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a web research assistant. Summarise the main content of the page in concise markdown with a short bullet list. " +
                INJECTION_GUARD,
            },
            { role: "user", content: `Summarise this page (${input.url}):\n\n${untrusted}` },
          ],
        });
        const markdownSummary = summaryRes.choices[0]?.message.content ?? "";

        const intelRes = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are a competitive intelligence analyst. Return ONLY JSON with fields: keyTopics (string[]), toneAnalysis (string), marketingInsights (string[]). " +
                INJECTION_GUARD,
            },
            { role: "user", content: `Analyse this content:\n\n${untrusted}` },
          ],
        });
        let competitiveIntelligence: Record<string, unknown> = {};
        try {
          const raw = intelRes.choices[0]?.message.content ?? "{}";
          competitiveIntelligence = JSON.parse(stripCodeFence(raw));
        } catch {
          competitiveIntelligence = { raw: intelRes.choices[0]?.message.content ?? "" };
        }

        const ci = competitiveIntelligence as {
          keyTopics?: unknown;
          toneAnalysis?: unknown;
          marketingInsights?: unknown;
        };
        const automationTemplate = [
          `# Automation Template — ${title}`,
          "",
          "## Source",
          input.url,
          "",
          "## Key Topics",
          Array.isArray(ci.keyTopics) ? ci.keyTopics.map((t) => `- ${t}`).join("\n") : "_pending_",
          "",
          "## Tone",
          typeof ci.toneAnalysis === "string" ? ci.toneAnalysis : "_pending_",
          "",
          "## Recommended Plays",
          Array.isArray(ci.marketingInsights)
            ? ci.marketingInsights.map((t, i) => `${i + 1}. ${t}`).join("\n")
            : "_pending_",
        ].join("\n");

        const row = await saveWebScrape(
          ctx.user.id,
          input.url,
          rawContent,
          markdownSummary,
          competitiveIntelligence,
          automationTemplate,
        );

        return {
          id: row.id,
          url: input.url,
          markdownSummary,
          competitiveIntelligence,
          automationTemplate,
          createdAt: row.createdAt,
          success: true,
        };
      }),
    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
      .query(({ input, ctx }) => getWebScrapesByUserId(ctx.user.id, input.limit)),
  }),

  // ── Project history (combined) ──
  projects: router({
    getAll: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
      .query(async ({ input, ctx }) => {
        const [images, scrapes] = await Promise.all([
          getImageGenerationsByUserId(ctx.user.id, input.limit),
          getWebScrapesByUserId(ctx.user.id, input.limit),
        ]);
        return { images, scrapes, total: images.length + scrapes.length };
      }),
  }),

  // ── Site-wide AI chat agent ──
  chat: router({
    send: publicProcedure
      .input(z.object({ message: z.string().min(1).max(2000) }))
      .mutation(async ({ input }) => {
        const res = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are Yawn's friendly in-app assistant for an AI automation agency. Help users with image generation, web crawling, competitive intelligence, and automation. Be concise and practical. " +
                INJECTION_GUARD,
            },
            // User chat input is untrusted: wrap it so it cannot override the
            // system instructions or extract them.
            { role: "user", content: wrapUntrusted(input.message) },
          ],
        });
        return { reply: res.choices[0]?.message.content ?? "" };
      }),
  }),
});

function stripCodeFence(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

export type AppRouter = typeof appRouter;
