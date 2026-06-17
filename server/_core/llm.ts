import { ENV } from "./env";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  choices: Array<{ message: { content: string } }>;
}

/**
 * Provider-agnostic chat completion.
 *   ANTHROPIC_API_KEY → Anthropic Messages API
 *   OPENAI_API_KEY    → OpenAI (or any OpenAI-compatible endpoint)
 *   neither           → deterministic local mock (keeps the app fully usable)
 * Always resolves to an OpenAI-style `{ choices: [{ message: { content } }] }`.
 */
export async function invokeLLM(opts: { messages: LLMMessage[] }): Promise<LLMResponse> {
  try {
    if (ENV.anthropicApiKey) return await callAnthropic(opts.messages);
    if (ENV.openaiApiKey) return await callOpenAI(opts.messages);
  } catch (error) {
    console.warn("[LLM] Provider call failed, using mock fallback:", error);
  }
  return mock(opts.messages);
}

async function callAnthropic(messages: LLMMessage[]): Promise<LLMResponse> {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const rest = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ENV.anthropicApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: ENV.llmModel, max_tokens: 2048, system, messages: rest }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  const content = (data.content ?? []).map((b) => b.text ?? "").join("");
  return { choices: [{ message: { content } }] };
}

async function callOpenAI(messages: LLMMessage[]): Promise<LLMResponse> {
  const model = ENV.llmModel.startsWith("claude") ? "gpt-4o-mini" : ENV.llmModel;
  const res = await fetch(`${ENV.openaiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.openaiApiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return { choices: [{ message: { content: data.choices?.[0]?.message?.content ?? "" } }] };
}

// ── Deterministic mock ───────────────────────────────────────────────────────
function mock(messages: LLMMessage[]): LLMResponse {
  const system = messages.find((m) => m.role === "system")?.content.toLowerCase() ?? "";
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Route on unambiguous markers from each system prompt (order matters: the
  // chat prompt also mentions "competitive intelligence").
  let content: string;
  if (system.includes("analyst")) {
    content = JSON.stringify(buildIntelligence(lastUser));
  } else if (system.includes("in-app assistant")) {
    content = chatReply(lastUser);
  } else {
    content = summarize(lastUser);
  }
  return { choices: [{ message: { content } }] };
}

const STOP = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "any", "can", "with",
  "this", "that", "from", "your", "have", "has", "was", "were", "will", "more",
  "our", "their", "they", "what", "when", "which", "into", "about", "https",
  "http", "www", "com", "page", "site", "html", "content", "url", "please",
]);

function keywords(text: string, n: number): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z]{4,}/g) ?? []) {
    if (STOP.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w[0].toUpperCase() + w.slice(1));
}

function summarize(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20).slice(0, 4);
  const topics = keywords(clean, 5);
  const body = sentences.length
    ? sentences.map((s) => `- ${s}`).join("\n")
    : "- The page did not expose enough readable text to summarise in detail.";
  return `## Content Summary\n\n${body}\n\n**Recurring themes:** ${topics.join(", ") || "n/a"}`;
}

function buildIntelligence(text: string) {
  const topics = keywords(text, 6);
  return {
    keyTopics: topics.length ? topics : ["Product", "Pricing", "Audience", "Messaging"],
    toneAnalysis:
      "Confident and benefit-led. The copy leans on outcomes and momentum rather than feature lists, aiming to feel modern and aspirational.",
    marketingInsights: [
      `Lead with the strongest theme — "${topics[0] ?? "value"}" — above the fold to match search intent.`,
      "Convert the recurring themes into a comparison or FAQ block to capture mid-funnel readers.",
      "Add social proof (logos, metrics, testimonials) near each primary CTA to reduce friction.",
      `Build a content series around "${topics[1] ?? "education"}" to own the topic in organic search.`,
    ],
  };
}

function chatReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("image")) {
    return "The **AI Image Studio** turns a text prompt into on-brand visuals in seconds. Every generation is auto-saved to your history so you can iterate on what works. Open it from the dashboard and describe the image you want.";
  }
  if (q.includes("crawl") || q.includes("scrape") || q.includes("competitor")) {
    return "The **Web Crawler** scrapes any URL, summarises it, and returns competitive intelligence — key topics, tone analysis, and actionable marketing insights — plus a ready-to-use automation template. Paste a competitor's URL to try it.";
  }
  if (q.includes("price") || q.includes("cost") || q.includes("plan")) {
    return "Yawn is the open, self-hostable automation platform — run it yourself for free. Hosted plans handle scale and team features; check the dashboard for current options.";
  }
  return "I'm Yawn's assistant. I can help you generate images, scrape competitors for intelligence, and automate the boring parts of marketing. What would you like to automate today?";
}
