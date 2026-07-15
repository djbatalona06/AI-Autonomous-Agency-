import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { BorderGlow } from "@/components/BorderGlow";

const EASE = [0.23, 1, 0.32, 1] as const;

const FACTS = ["20-year-old college student", "self-taught builder", "work smarter, not harder"];

/**
 * "About the owner" section. Replaces the old koala-image showcase with a
 * personal founder bio — the koala now lives in the hero. A BorderGlow card
 * carries a pull-quote and a few facts. Motion honors prefers-reduced-motion.
 */
export function AboutOwner() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="grid gap-10 md:grid-cols-2 items-center"
      >
        {/* Left: the bio */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-4">
            About the owner
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.02]">
            Built by a student who’d rather work <span className="text-primary">smarter.</span>
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed max-w-md">
            <p>
              I’m DJ — a 20-year-old college student who got tired of watching good work drown in
              busywork. Between classes, I kept seeing the same thing: leads going cold, invoices
              slipping, and hours vanishing into copy-paste tasks a computer should just handle.
            </p>
            <p>
              So I built Yawn. The whole idea is <span className="text-foreground font-medium">working
              smarter, not harder</span> — let the boring, repetitive stuff run itself so people can
              spend their time on what actually matters. I obsess over ease of use: automations that
              are genuinely simple to set up and quietly do their job, whether you’re in class,
              asleep, or actually living your life.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {FACTS.map((f) => (
              <span
                key={f}
                className="rounded-full border border-border bg-secondary px-3 py-1.5 text-muted-foreground"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: pull-quote card */}
        <BorderGlow borderRadius={28} glowIntensity={1.1} className="bg-card/60 p-8 sm:p-10">
          <blockquote className="font-serif text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-foreground">
            “Automation shouldn’t be a luxury for big teams. If it’s easy enough, everyone gets to
            <span className="text-primary"> stop doing the boring stuff.</span>”
          </blockquote>
          <p className="mt-6 text-sm font-medium text-muted-foreground">— DJ, founder of Yawn</p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/70 pt-6 text-center">
            <div>
              <div className="font-serif text-2xl font-semibold text-foreground">25</div>
              <div className="text-xs text-faint">templates</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-semibold text-foreground">5</div>
              <div className="text-xs text-faint">verticals</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-semibold text-foreground">$750</div>
              <div className="text-xs text-faint">floor</div>
            </div>
          </div>
        </BorderGlow>
      </motion.div>
    </section>
  );
}
