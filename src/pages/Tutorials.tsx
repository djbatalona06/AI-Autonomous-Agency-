import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TUTORIALS } from "@/lib/tutorials";
import { getVertical } from "@/data/verticals";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Seo } from "@/components/Seo";

const EASE = [0.23, 1, 0.32, 1] as const;

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Tutorials() {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Tutorials"
        description="Step-by-step guides to automating lead follow-up, cart recovery, client intake, email triage, and more — the exact workflows Yawn builds for clients."
        path="/tutorials"
      />
      <SiteNav />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-3">Tutorials</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold tracking-tight max-w-2xl">
            How to automate the busywork.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Practical, step-by-step guides to the automations Yawn builds for clients — pick the one
            that matches your problem.
          </p>

          <motion.div
            variants={grid}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-4 sm:grid-cols-2 mt-12"
          >
            {TUTORIALS.map((t) => {
              const vertical = getVertical(t.vertical);
              return (
                <motion.div key={t.slug} variants={cell}>
                  <Link
                    href={`/tutorials/${t.slug}`}
                    className="group flex flex-col justify-between h-full rounded-2xl border border-border bg-card p-6 hover:border-faint transition-colors"
                  >
                    <div>
                      {vertical && (
                        <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-highlight">
                          {vertical.name}
                        </span>
                      )}
                      <h2 className="text-lg font-bold mt-2 mb-2 tracking-tight">{t.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read guide <ArrowUpRight size={15} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
