import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

const EASE = [0.23, 1, 0.32, 1] as const;

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

interface Rung {
  tag: string;
  price: string;
  per?: string;
  features: string[];
  featured?: boolean;
}

const RUNGS: Rung[] = [
  {
    tag: "Rung 1 · Template Install",
    price: "$750–$1,500",
    features: ["Config + deploy a pre-built workflow", "14-day warranty", "100% upfront", "Live in days, not weeks"],
  },
  {
    tag: "Rung 2 · Custom Automation",
    price: "$1,500–$5,000",
    featured: true,
    features: ["Net-new build, scoped to you", "1–5+ integrations, AI, branching", "30-day warranty", "50% deposit / 50% on handoff"],
  },
  {
    tag: "Rung 3 · Ops Retainer",
    price: "$500–$1,000",
    per: "/mo",
    features: ["Maintenance, ≤3 hrs/mo", "One small automation included", "Priority fixes", "Optional hosting +$50–$75/mo"],
  },
];

export default function Pricing() {
  const reduce = usePrefersReducedMotion();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-3">Pricing</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold tracking-tight max-w-2xl">
            Straight pricing. No retainers you don't need.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Three ways to work together. Pick the one that matches the job — we'll tell you honestly which it is.
          </p>

          <motion.div
            variants={grid}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-5 md:grid-cols-3 mt-12 items-start"
          >
            {RUNGS.map((r) => (
              <motion.div
                key={r.tag}
                variants={cell}
                className={`relative rounded-2xl p-7 bg-[linear-gradient(165deg,var(--color-card),#0e1014)] ${
                  r.featured
                    ? "border-2 border-primary shadow-[0_24px_60px_-34px_var(--color-primary)]"
                    : "border border-border"
                }`}
              >
                {r.featured && (
                  <span className="absolute -top-3 left-7 text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-primary text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className={`font-mono text-xs font-semibold uppercase tracking-wide ${r.featured ? "text-primary" : "text-highlight"}`}>
                  {r.tag}
                </div>
                <div className="font-serif text-3xl font-semibold tracking-tight mt-3">
                  {r.price}
                  {r.per && <span className="text-base text-faint font-sans font-medium">{r.per}</span>}
                </div>
                <ul className="mt-5 space-y-2.5">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check size={16} className="text-success mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/#start" className="block mt-7">
                  <Button variant={r.featured ? "default" : "outline"} className="w-full">
                    Get started
                  </Button>
                </a>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-faint text-sm mt-8">
            $750 absolute floor. Timelines padded 30%. Signed change order before any scope expansion.
            Warranty covers documented function only.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
