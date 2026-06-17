import { DashboardLayout } from "@/components/DashboardLayout";

const FAQ = [
  {
    q: "How does the Image Studio work?",
    a: "Type a prompt and hit Generate. With an OpenAI key set, you get real images; otherwise Yawn produces a deterministic, on-brand placeholder. Every result is saved to your history.",
  },
  {
    q: "What does the Web Crawler return?",
    a: "It scrapes the URL, summarises the content, and extracts competitive intelligence — key topics, tone analysis, and marketing insights — plus a ready-to-use automation template.",
  },
  {
    q: "Do I need API keys?",
    a: "No. Yawn runs fully offline with built-in mocks. Add ANTHROPIC_API_KEY / OPENAI_API_KEY / FIRECRAWL_API_KEY in .env to enable live providers.",
  },
  {
    q: "Where is my data stored?",
    a: "In a local JSON store on the server by default. Swap in the included Drizzle/Postgres schema to use a real database like Supabase.",
  },
];

export default function Help() {
  return (
    <DashboardLayout title="Help & Docs">
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-muted-foreground">
          Need a hand? Ask the assistant in the bottom-right corner, or browse the basics below.
        </p>
        <dl className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="border-2 border-border bg-card p-6">
              <dt className="font-extrabold text-lg mb-2">{f.q}</dt>
              <dd className="text-foreground/90 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </DashboardLayout>
  );
}
