/** Centralised, typed access to environment configuration. */

const DEFAULT_SESSION_SECRET = "yawn-dev-secret-change-me";
const isProd = process.env.NODE_ENV === "production";

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * FAIL CLOSED: in production the session secret MUST be set to a real value.
 * A weak/default secret would let anyone forge session cookies, so we refuse
 * to boot rather than run insecurely.
 */
const sessionSecret = process.env.SESSION_SECRET ?? DEFAULT_SESSION_SECRET;
if (isProd && (!process.env.SESSION_SECRET || sessionSecret === DEFAULT_SESSION_SECRET)) {
  throw new Error(
    "[env] SESSION_SECRET must be set to a strong, non-default value in production. " +
      "Refusing to start with an insecure session secret.",
  );
}

export const ENV = {
  port: num(process.env.PORT, 3001),
  isProd,
  isVercel: !!process.env.VERCEL,
  sessionSecret,

  // Sessions
  sessionTtlDays: num(process.env.SESSION_TTL_DAYS, 7),

  // Rate limiting (in-memory, per serverless instance — see app.ts).
  rateLimitWindowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitAuthMax: num(process.env.RATE_LIMIT_AUTH_MAX, 20),
  rateLimitGlobalMax: num(process.env.RATE_LIMIT_GLOBAL_MAX, 300),

  // LLM
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  llmModel: process.env.LLM_MODEL ?? "claude-sonnet-4-6",

  // Scraping
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY ?? "",
};

export type AppUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";

  // ── Authentication ──
  /** Argon2id encoded hash (`$argon2id$...`). Empty for legacy/demo users. */
  passwordHash: string;
  mfaEnabled: boolean;
  /** otplib base32 secret; null until MFA is set up. */
  mfaSecret: string | null;
  /** SHA-256 hashes of single-use recovery codes. */
  mfaRecoveryHashes: string[];
  failedAttempts: number;
  /** ISO timestamp; account is locked until this time (null = not locked). */
  lockedUntil: string | null;
  createdAt: string;
  lastSignedIn: string | null;
};
