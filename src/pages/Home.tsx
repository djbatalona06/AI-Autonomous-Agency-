import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/button";

const EASE = [0.23, 1, 0.32, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const FEED = [
  "Generated 10 product images",
  "Scraped competitor blog",
  "Analyzed market trends",
  "Built automation template",
  "Drafted 5 social assets",
  "Mapped industry insights",
];

const FEATURES = [
  {
    icon: "🎨",
    title: "AI Image Studio",
    body: "Generate on-brand product visuals in seconds. Test creative, iterate fast, keep every result.",
  },
  {
    icon: "🕷️",
    title: "Web Crawler",
    body: "Scrape any competitor, then get topics, tone, and marketing plays — automatically.",
  },
  {
    icon: "📚",
    title: "Project History",
    body: "Every generation and scrape is saved per-account. Revisit, reuse, and build on your work.",
  },
];

function TopNav() {
  const { isAuthenticated, user, logout, loginUrl } = useAuth();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-card border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
          Yawn
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm font-semibold text-foreground truncate max-w-[10rem]">
                {user?.name}
              </span>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" variant="outline" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <a href={loginUrl}>
              <Button size="sm">Get Started</Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function MarqueeTrack() {
  return (
    <div className="flex shrink-0">
      {FEED.map((t, i) => (
        <span key={i} className="flex items-center gap-3 pr-12 text-lg font-bold text-foreground">
          <span className="text-primary">✓</span>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, loginUrl } = useAuth();
  const reduce = usePrefersReducedMotion();
  const ctaHref = isAuthenticated ? "/dashboard" : loginUrl;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16">
          <motion.div
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="visible"
            className="max-w-4xl"
          >
            <motion.p
              variants={item}
              className="inline-block border-2 border-border bg-secondary px-3 py-1 text-sm font-bold uppercase tracking-widest mb-6"
            >
              AI Automation Agency
            </motion.p>
            <motion.h1
              variants={item}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight"
            >
              Automate <br />
              the <span className="text-primary">Boring.</span>
            </motion.h1>
            <motion.p variants={item} className="mt-8 text-xl sm:text-2xl font-semibold max-w-2xl">
              Wake up your business with AI-powered automation. Generate images, scrape competitors,
              and scale without the grind.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <a href={ctaHref}>
                <Button size="lg">{isAuthenticated ? "Go to Dashboard →" : "Start Automating →"}</Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline">
                  See what it does
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Automation Feed marquee */}
        <section className="bg-secondary border-y-2 border-border overflow-hidden py-5" aria-hidden>
          <div className="flex w-max animate-marquee">
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-4xl sm:text-5xl font-extrabold mb-14"
          >
            Built for <span className="text-primary">scale.</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.article
                key={f.title}
                initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                className="border-2 border-border bg-card p-8 hover:bg-secondary transition-colors"
              >
                <div className="text-5xl mb-5" aria-hidden>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-extrabold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary text-primary-foreground border-t-2 border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-8">Ready to automate?</h2>
            <a href={ctaHref}>
              <Button size="lg" variant="outline" className="bg-card">
                {isAuthenticated ? "Open Dashboard →" : "Start Free →"}
              </Button>
            </a>
          </div>
        </section>

        <footer className="bg-card border-t-2 border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span className="font-extrabold text-primary text-lg">Yawn</span>
            <span>Automate the Boring. Wake Up Your Business.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
