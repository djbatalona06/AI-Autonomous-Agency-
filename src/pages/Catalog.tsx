import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Lock, Star } from "lucide-react";
import { VERTICALS, type Vertical } from "@/data/verticals";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useAuth } from "@/_core/hooks/useAuth";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";

const EASE = [0.23, 1, 0.32, 1] as const;

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const cell: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function trackGlow(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function BubbleCard({ v }: { v: Vertical }) {
  const Icon = v.icon;
  const accent = v.star;
  return (
    <motion.div variants={cell}>
      <Link
        href={`/catalog/${v.code.toLowerCase()}`}
        onMouseMove={trackGlow}
        className={`group relative flex flex-col justify-between min-h-[200px] rounded-2xl border p-6 overflow-hidden transition-[transform,border-color] duration-200 hover:-translate-y-1.5 ${
          accent ? "border-highlight/40 hover:border-highlight" : "border-border hover:border-faint"
        } bg-[linear-gradient(165deg,var(--color-card),#0e1014)]`}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "radial-gradient(420px 220px at var(--mx,50%) var(--my,0%), rgba(255,92,53,0.16), transparent 70%)" }}
          aria-hidden
        />
        {v.star && (
          <span className="absolute top-4 right-4 text-highlight" aria-hidden>
            <Star size={16} fill="currentColor" />
          </span>
        )}
        <div className="relative">
          <div className={`font-mono text-xs font-semibold tracking-[0.08em] ${accent ? "text-primary" : "text-highlight"}`}>
            {v.code}{v.star ? " · flagship" : ""}
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <Icon size={22} className={accent ? "text-primary" : "text-muted-foreground"} />
            <span className="text-lg font-bold text-foreground">{v.name}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2 leading-snug">{v.blurb}</p>
        </div>
        <div className="relative flex items-center justify-between mt-4">
          <span className="text-xs text-faint">{v.cards.length} templates</span>
          <span className={`grid place-items-center w-7 h-7 rounded-full transition-colors ${
            accent ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
          }`}>
            <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Catalog() {
  const reduce = usePrefersReducedMotion();
  const { openAuth } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-3">The catalog</p>
              <h1 className="font-serif text-5xl sm:text-6xl font-semibold tracking-tight">Pick your lane.</h1>
              <p className="text-muted-foreground mt-4 max-w-md">
                Each bubble is a productized catalog — quotable templates with a problem, an outcome, and a price.
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
              hover · tap to open
            </span>
          </div>

          <motion.div
            variants={grid}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {VERTICALS.map((v) => (
              <BubbleCard key={v.code} v={v} />
            ))}

            <motion.div variants={cell}>
              <button
                type="button"
                onClick={openAuth}
                onMouseMove={trackGlow}
                className="group relative flex flex-col justify-between text-left w-full min-h-[200px] rounded-2xl border border-highlight/30 p-6 overflow-hidden hover:-translate-y-1.5 transition-transform bg-[linear-gradient(165deg,#1a1208,#0e0b07)]"
              >
                <div className="relative">
                  <div className="font-mono text-xs font-semibold tracking-[0.08em] text-primary">ACCOUNT</div>
                  <div className="flex items-center gap-2.5 mt-3">
                    <Lock size={22} className="text-highlight" />
                    <span className="text-lg font-bold text-foreground">Client login</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 leading-snug">
                    Track your active builds, warranty windows, and retainer hours.
                  </p>
                </div>
                <div className="relative flex items-center justify-between mt-4">
                  <span className="text-xs text-faint">Supabase auth</span>
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-secondary border border-border text-highlight">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </button>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
