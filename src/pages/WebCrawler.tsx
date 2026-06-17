import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Markdown } from "@/components/ui/markdown";

type Intel = {
  keyTopics?: string[];
  toneAnalysis?: string;
  marketingInsights?: string[];
};

export default function WebCrawler() {
  const [url, setUrl] = useState("");
  const reduce = usePrefersReducedMotion();
  const utils = trpc.useUtils();

  const { data: scrapes = [], isLoading } = trpc.crawler.getHistory.useQuery({ limit: 20 });

  const scrape = trpc.crawler.scrape.useMutation({
    onSuccess: async () => {
      toast.success("Site scraped!");
      setUrl("");
      await utils.crawler.getHistory.invalidate();
    },
    onError: (e) => toast.error(e.message || "Failed to scrape site"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) return toast.error("Please enter a URL");
    try {
      new URL(value);
    } catch {
      return toast.error("Please enter a valid URL (include https://)");
    }
    scrape.mutate({ url: value });
  }

  return (
    <DashboardLayout title="Web Crawler">
      <div className="max-w-5xl mx-auto space-y-10">
        <p className="text-muted-foreground -mt-4">
          Paste a URL to scrape it, summarise the content, and extract competitive intelligence.
        </p>

        {/* URL form */}
        <div className="border-2 border-border bg-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="url" className="block text-sm font-bold">
              Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={scrape.isPending}
              />
              <Button type="submit" disabled={scrape.isPending} className="sm:w-44">
                {scrape.isPending ? (
                  <>
                    <Spinner /> Scraping…
                  </>
                ) : (
                  "Scrape"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        <section>
          <h2 className="text-2xl font-extrabold mb-5">Scrape history</h2>

          {isLoading ? (
            <div className="border-2 border-border bg-card p-12 flex justify-center">
              <Spinner className="w-8 h-8 text-primary" />
            </div>
          ) : scrapes.length === 0 ? (
            <div className="border-2 border-border bg-card p-12 text-center text-muted-foreground">
              No scrapes yet. Enter a URL above to get started.
            </div>
          ) : (
            <div className="space-y-8">
              {scrapes.map((s, i) => {
                const ci = (s.competitiveIntelligence ?? {}) as Intel;
                return (
                  <motion.article
                    key={s.id}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.4) }}
                    className="border-2 border-border bg-card"
                  >
                    <header className="border-b-2 border-border bg-secondary p-5">
                      <h3 className="font-extrabold text-lg break-all">{s.url}</h3>
                      <time className="text-xs text-secondary-foreground/70">
                        {new Date(s.createdAt).toLocaleString()}
                      </time>
                    </header>

                    <div className="p-5 sm:p-6 space-y-6">
                      <div>
                        <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-widest">
                          Content summary
                        </h4>
                        <div className="border-2 border-border bg-background p-4 max-h-80 overflow-y-auto">
                          <Markdown>{s.markdownSummary || "_No summary available._"}</Markdown>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-widest">
                          Competitive intelligence
                        </h4>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="border-2 border-border bg-background p-4">
                            <h5 className="font-bold mb-2">Key topics</h5>
                            <ul className="space-y-1 text-sm text-foreground/90">
                              {ci.keyTopics?.length ? (
                                ci.keyTopics.map((t, k) => <li key={k}>• {t}</li>)
                              ) : (
                                <li className="text-muted-foreground">No topics identified</li>
                              )}
                            </ul>
                          </div>
                          <div className="border-2 border-border bg-background p-4">
                            <h5 className="font-bold mb-2">Tone analysis</h5>
                            <p className="text-sm text-foreground/90">
                              {ci.toneAnalysis ?? "No tone analysis available"}
                            </p>
                          </div>
                          <div className="border-2 border-border bg-background p-4">
                            <h5 className="font-bold mb-2">Marketing insights</h5>
                            <ul className="space-y-1 text-sm text-foreground/90">
                              {ci.marketingInsights?.length ? (
                                ci.marketingInsights.slice(0, 4).map((t, k) => <li key={k}>• {t}</li>)
                              ) : (
                                <li className="text-muted-foreground">No insights available</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-widest">
                          Automation template
                        </h4>
                        <div className="border-2 border-border bg-background p-4 max-h-72 overflow-y-auto">
                          <Markdown>{s.automationTemplate || "_No template generated._"}</Markdown>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
