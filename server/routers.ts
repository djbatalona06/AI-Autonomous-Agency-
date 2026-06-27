import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "../shared/const";
import { createSessionToken, sessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import {
  saveImageGeneration,
  getImageGenerationsByUserId,
  saveWebScrape,
  getWebScrapesByUserId,
  getUserById,
  updateUser,
  recordAuthEvent,
} from "./db";
import { ENV, type AppUser } from "./_core/env";
import {
  register as registerUser,
  verifyLogin,
  requestPasswordReset as issuePasswordReset,
  resetPassword as performPasswordReset,
  changePassword as performChangePassword,
} from "./_core/authService";
import { verifyPassword } from "./_core/password";
import {
  generateSecret,
  keyUri,
  verifyToken,
  generateRecoveryCodes,
  hashRecoveryCode,
} from "./_core/mfa";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { scrapeUrl } from "./_core/scrape";
import { SsrfError } from "./_core/ssrf";
import { wrapUntrusted, INJECTION_GUARD } from "./_core/aiSafety";

/** Public-safe user shape — never leaks password/MFA hashes. */
function safeUser(u: AppUser) {
  return {
    id: u.id,
    openId: u.openId,
    name: u.name,
    email: u.email,
    role: u.role,
    mfaEnabled: u.mfaEnabled,
    createdAt: u.createdAt,
    lastSignedIn: u.lastSignedIn,
  };
}

function clientIp(req: { ip?: string } | undefined): string | null {
  return req?.ip ?? null;
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    /** Current user — ALWAYS returns the public-safe shape (never hashes/secrets). */
    me: publicProcedure.query(({ ctx }) => (ctx.user ? safeUser(ctx.user) : null)),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      if (ctx.user) {
        await recordAuthEvent({ userId: ctx.user.id, type: "logout", ip: clientIp(ctx.req) });
      }
      ctx.res.clearCookie(COOKIE_NAME, { ...sessionCookieOptions, maxAge: undefined });
      return { success: true } as const;
    }),

    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
          name: z.string().max(120).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const result = await registerUser(input.email, input.password, input.name ?? null);
        if (!result.ok) throw new TRPCError({ code: "BAD_REQUEST", message: result.error });

        const token = createSessionToken(result.user.openId);
        ctx.res.cookie(COOKIE_NAME, token, sessionCookieOptions);
        await recordAuthEvent({ userId: result.user.id, type: "register", ip: clientIp(ctx.req) });
        return { status: "ok" as const, user: safeUser(result.user) };
      }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
          /** TOTP code or a recovery code, required when the account has MFA enabled. */
          totp: z.string().optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const result = await verifyLogin(input.email, input.password);
        if (!result.ok) {
          await recordAuthEvent({
            userId: null,
            type: result.reason === "locked" ? "login_locked" : "login_failed",
            ip: clientIp(ctx.req),
          });
          if (result.reason === "locked") {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message:
                "Account temporarily locked after too many failed attempts. Please try again later.",
            });
          }
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }

        const user = result.user;

        if (user.mfaEnabled) {
          // No code yet → tell the client to collect one (not an error).
          if (!input.totp) return { status: "mfa_required" as const };

          const code = input.totp.trim();
          let verified = user.mfaSecret ? verifyToken(user.mfaSecret, code) : false;

          // Fall back to single-use recovery codes; consume on match.
          if (!verified) {
            const hash = hashRecoveryCode(code);
            if (user.mfaRecoveryHashes.includes(hash)) {
              verified = true;
              await updateUser(user.id, {
                mfaRecoveryHashes: user.mfaRecoveryHashes.filter((h) => h !== hash),
              });
            }
          }

          if (!verified) {
            await recordAuthEvent({
              userId: user.id,
              type: "mfa_challenge_failed",
              ip: clientIp(ctx.req),
            });
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid authentication code." });
          }
        }

        const token = createSessionToken(user.openId);
        ctx.res.cookie(COOKIE_NAME, token, sessionCookieOptions);
        await recordAuthEvent({ userId: user.id, type: "login", ip: clientIp(ctx.req) });
        return { status: "ok" as const, user: safeUser(user) };
      }),

    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const issued = await issuePasswordReset(input.email);
        await recordAuthEvent({
          userId: null,
          type: "password_reset_requested",
          ip: clientIp(ctx.req),
        });
        // Respond identically whether or not the email exists (no enumeration).
        // Outside production we return the token so the flow is testable without
        // an email provider wired up.
        return {
          success: true as const,
          ...(!ENV.isProd && issued ? { devToken: issued.token } : {}),
        };
      }),

    resetPassword: publicProcedure
      .input(z.object({ token: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const result = await performPasswordReset(input.token, input.password);
        if (!result.ok) throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        await recordAuthEvent({ userId: result.user.id, type: "password_reset", ip: clientIp(ctx.req) });
        return { success: true as const };
      }),

    changePassword: protectedProcedure
      .input(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const result = await performChangePassword(
          ctx.user.id,
          input.currentPassword,
          input.newPassword,
        );
        if (!result.ok) throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        await recordAuthEvent({ userId: ctx.user.id, type: "password_changed", ip: clientIp(ctx.req) });
        return { success: true as const };
      }),

    /** Begin MFA enrollment: provisions a secret + recovery codes (not yet enabled). */
    mfaSetup: protectedProcedure.mutation(async ({ ctx }) => {
      const secret = generateSecret();
      const recoveryCodes = generateRecoveryCodes();
      await updateUser(ctx.user.id, {
        mfaSecret: secret,
        mfaEnabled: false,
        mfaRecoveryHashes: recoveryCodes.map(hashRecoveryCode),
      });
      await recordAuthEvent({ userId: ctx.user.id, type: "mfa_setup", ip: clientIp(ctx.req) });
      const account = ctx.user.email ?? ctx.user.openId;
      return { secret, otpauthUri: keyUri(account, secret), recoveryCodes };
    }),

    /** Confirm enrollment by verifying a code against the provisioned secret. */
    mfaEnable: protectedProcedure
      .input(z.object({ token: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const fresh = await getUserById(ctx.user.id);
        if (!fresh?.mfaSecret) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Start MFA setup first." });
        }
        if (!verifyToken(fresh.mfaSecret, input.token)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "That code is incorrect. Try again." });
        }
        await updateUser(ctx.user.id, { mfaEnabled: true });
        await recordAuthEvent({ userId: ctx.user.id, type: "mfa_enabled", ip: clientIp(ctx.req) });
        return { success: true as const };
      }),

    /** Disable MFA — requires the account password to re-authenticate. */
    mfaDisable: protectedProcedure
      .input(z.object({ password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const fresh = await getUserById(ctx.user.id);
        if (!fresh) throw new TRPCError({ code: "NOT_FOUND", message: "Account not found." });
        if (!fresh.passwordHash || !(await verifyPassword(fresh.passwordHash, input.password))) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Password is incorrect." });
        }
        await updateUser(ctx.user.id, {
          mfaEnabled: false,
          mfaSecret: null,
          mfaRecoveryHashes: [],
        });
        await recordAuthEvent({ userId: ctx.user.id, type: "mfa_disabled", ip: clientIp(ctx.req) });
        return { success: true as const };
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
