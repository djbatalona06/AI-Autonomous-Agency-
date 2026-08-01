/** Centralised, typed access to environment configuration. */
export const ENV = {
  port: Number(process.env.PORT ?? 3001),
  isProd: process.env.NODE_ENV === "production",

  // LLM
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  llmModel: process.env.LLM_MODEL ?? "claude-sonnet-4-6",

  // Scraping
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY ?? "",

  // Supabase (auth + data). Anon key is public by design; the server verifies
  // user JWTs with it via supabase.auth.getUser — no service_role required.
  // Both must be set for auth and persistence to work. No hardcoded fallback
  // project: a misconfigured deploy should fail loudly, not silently point at
  // another environment's database.
  supabaseUrl: process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "",

  // Security edge (see server/_core/security.ts). CORS is default-deny; list
  // production origins here (comma-separated). Localhost dev origins are allowed
  // automatically outside production.
  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60_000),
  rateLimitApiMax: Number(process.env.RATE_LIMIT_API_MAX ?? 300),
  /** Tighter budget for the unauthenticated, LLM-spending chat procedure. */
  rateLimitChatMax: Number(process.env.RATE_LIMIT_CHAT_MAX ?? 20),
};

export type AppUser = {
  /** Supabase auth user id (UUID) — the primary key for all per-user data. */
  id: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
};
