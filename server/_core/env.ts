/** Centralised, typed access to environment configuration. */
export const ENV = {
  port: Number(process.env.PORT ?? 3001),
  isProd: process.env.NODE_ENV === "production",
  sessionSecret: process.env.SESSION_SECRET ?? "yawn-dev-secret-change-me",

  // LLM
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  llmModel: process.env.LLM_MODEL ?? "claude-sonnet-4-6",

  // Scraping
  firecrawlApiKey: process.env.FIRECRAWL_API_KEY ?? "",

  // Supabase (auth + data). Anon key is public by design; the server verifies
  // user JWTs with it via supabase.auth.getUser — no service_role required.
  supabaseUrl:
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "https://odibvergwcllhsbzbgwa.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "",
};

export type AppUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
};
