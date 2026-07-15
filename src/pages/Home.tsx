import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ParticleField";
import { HeroKoala } from "@/components/HeroKoala";
import { HeroMetrics, MetricChip } from "@/components/HeroMetrics";
import { AboutOwner } from "@/components/AboutOwner";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Seo } from "@/components/Seo";
import { BRAND } from "@/data/brand";

const EASE = [0.23, 1, 0.32, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
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

function MarqueeTrack() {
  return (
    <div className="flex shrink-0">
      {FEED.map((t, i) => (
        <span key={i} className="flex items-center gap-3 pr-12 text-lg font-semibold text-foreground/90">
          <span className="text-primary">✓</span>
          {t}
        </span>
      ))}
    </div>
  );
}

/** Opens the auth modal for guests, or links to the dashboard when signed in. */
function PrimaryCta({ authed, guest }: { authed: string; guest: string }) {
  const { isAuthenticated, openAuth } = useAuth();
  return isAuthenticated ? (
    <Link href="/dashboard">
      <Button size="lg">{authed}</Button>
    </Link>
  ) : (
    <Button size="lg" onClick={openAuth}>
      {guest}
    </Button>
  );
}

export default function Home() {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <Seo title={BRAND.name} description={BRAND.description} path="/" />
      <SiteNav />

      <main className="pt-16">
        {/* Hero with live particle field */}
        <section className="relative overflow-hidden hero-glow">
          <div className="absolute inset-0 z-0" aria-hidden>
            <ParticleField />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
              <motion.div
                variants={container}
                initial={reduce ? false : "hidden"}
                animate="visible"
                className="max-w-xl"
              >
                <motion.p
                  variants={item}
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight"
                >
                  AI automation agency · since 2026
                </motion.p>
                <motion.h1
                  variants={item}
                  className="font-serif text-6xl sm:text-8xl lg:text-9xl font-semibold leading-[0.95] tracking-tight mt-5"
                >
                  Automate <br />
                  the <span className="text-primary">boring.</span>
                </motion.h1>
                <motion.p
                  variants={item}
                  className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
                >
                  Yawn builds the AI automations that catch what your team can't: instant lead
                  follow-up, order and invoice chasing, and daily briefs — so leads, carts, and
                  invoices stop slipping through the cracks. Every workflow is validated before it
                  ever touches production.
                </motion.p>
                <motion.div variants={item} className="mt-10 flex flex-wrap gap-4" id="start">
                  <PrimaryCta authed="Go to dashboard →" guest="Start automating →" />
                  <a href="#features">
                    <Button size="lg" variant="outline">
                      See what it does
                    </Button>
                  </a>
                </motion.div>
                <motion.div
                  variants={item}
                  className="mt-9 flex flex-wrap gap-6 text-sm text-faint"
                >
                  <span><b className="text-muted-foreground font-semibold">25</b> templates</span>
                  <span><b className="text-muted-foreground font-semibold">5</b> verticals</span>
                  <span><b className="text-muted-foreground font-semibold">$750</b> floor · install in days</span>
                </motion.div>
              </motion.div>

              {/* Right: koala mascot co-star with floating busywork chips */}
              <div className="relative mt-4 lg:mt-0">
                <MetricChip label="9 unread DMs" index={1} className="absolute -left-4 top-6 z-20 hidden lg:inline-flex" />
                <MetricChip label="Invoice past due" index={2} className="absolute -right-3 top-28 z-20 hidden lg:inline-flex" />
                <MetricChip label="12 new pings" index={0} className="absolute left-8 -bottom-4 z-20 hidden lg:inline-flex" />
                <HeroKoala />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard preview — busywork chips, five lanes, option wheel */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <HeroMetrics />
        </section>

        {/* Automation Feed marquee */}
        <section className="bg-secondary border-y border-border overflow-hidden py-5" aria-hidden>
          <div className="flex w-max animate-marquee">
            <MarqueeTrack />
            <MarqueeTrack />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-4"
          >
            What's inside
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-serif text-4xl sm:text-5xl font-semibold mb-14 tracking-tight"
          >
            Built for <span className="text-primary">scale.</span>
          </motion.h2>

          <div id="how" className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.article
                key={f.title}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                className="relative crosshair rounded-2xl border border-border bg-card p-8 hover:border-faint transition-colors"
              >
                <div className="text-4xl mb-5" aria-hidden>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* About the owner */}
        <AboutOwner />

        {/* Footer CTA */}
        <section className="border-y border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold mb-8 tracking-tight">
              Ready to automate the <span className="text-primary">boring?</span>
            </h2>
            <PrimaryCta authed="Open dashboard →" guest="Start free →" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
