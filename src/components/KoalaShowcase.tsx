import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * The Yawn koala mascot — rebuilt natively with framer-motion (retires the old
 * 32s GSAP iframe). Scroll-triggered reveal, a gentle spring float on the PNG,
 * and a warm glow. All motion is disabled under prefers-reduced-motion.
 */
export function KoalaShowcase() {
  const reduce = usePrefersReducedMotion();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="relative crosshair grid gap-10 md:grid-cols-2 items-center rounded-3xl border border-border bg-card/60 p-8 sm:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-4">
            Meet the mascot
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.02]">
            The koala that never <span className="text-primary">sleeps on the job.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md">
            While you rest, the workflows run. Every build is wired in n8n, validated node-by-node,
            and shipped only once the whole graph passes — so the boring stuff runs itself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-muted-foreground">n8n-native</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-muted-foreground">validated builds</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-muted-foreground">always on</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-[280px]">
          <div
            className="absolute inset-0 -z-0 blur-3xl opacity-40"
            style={{ background: "radial-gradient(300px 300px at 50% 45%, #ff5c35, transparent 70%)" }}
            aria-hidden
          />
          <motion.div
            className="relative z-10 w-full max-w-[340px]"
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.img
              src="/yawn-koala.png"
              alt="The Yawn koala mascot holding an n8n automation wand"
              className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
