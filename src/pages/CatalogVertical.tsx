import { Link, useParams } from "wouter";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getVertical, STATUS_LABEL, type TemplateCard } from "@/data/verticals";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

const EASE = [0.23, 1, 0.32, 1] as const;

const grid: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cell: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

function statusClasses(card: TemplateCard) {
  if (card.status === "built") return "text-success border-success/40";
  if (card.status === "slot") return "text-highlight border-highlight/40";
  return "text-muted-foreground border-border";
}

function Card({ card }: { card: TemplateCard }) {
  return (
    <motion.article
      variants={cell}
      className={`rounded-2xl border p-5 ${
        card.flagship ? "border-primary bg-[linear-gradient(165deg,#1a1208,#0e0b07)]" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold tracking-[0.06em] text-highlight">
          {card.id}{card.flagship ? " · flagship" : ""}
        </span>
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusClasses(card)}`}>
          {STATUS_LABEL[card.status]}
        </span>
      </div>
      <h3 className="text-base font-bold mt-3 mb-1.5 tracking-tight">{card.title}</h3>
      <p className="text-sm text-muted-foreground leading-snug">{card.outcome}</p>
      <div className="text-foreground font-semibold text-sm mt-3">{card.price}</div>
    </motion.article>
  );
}

export default function CatalogVertical() {
  const { code = "" } = useParams();
  const reduce = usePrefersReducedMotion();
  const vertical = getVertical(code);

  if (!vertical) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="font-serif text-4xl font-semibold mb-4">Vertical not found.</h1>
          <p className="text-muted-foreground mb-8">That catalog code doesn't exist.</p>
          <Link href="/catalog"><Button>Back to catalog</Button></Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const Icon = vertical.icon;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-24">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} /> All verticals
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-secondary border border-border">
              <Icon size={24} className="text-primary" />
            </span>
            <span className="font-mono text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
              {vertical.buyer}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight mt-4">{vertical.name}</h1>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl">{vertical.blurb}</p>

          <motion.div
            variants={grid}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-4 sm:grid-cols-2 mt-10"
          >
            {vertical.cards.map((c) => (
              <Card key={c.id} card={c} />
            ))}
          </motion.div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a href="/#start"><Button size="lg">Book a build for this →</Button></a>
            <Link href="/pricing"><Button size="lg" variant="outline">See pricing</Button></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
