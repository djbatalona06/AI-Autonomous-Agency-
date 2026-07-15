import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { BorderGlow } from "@/components/BorderGlow";
import { OptionWheel } from "@/components/OptionWheel";
import { VERTICALS } from "@/data/verticals";
import { cn } from "@/lib/utils";

/** The busywork the koala "yawns away" — sample alerts, not live data. */
const CHIPS = [
  "2 conflicts",
  "9 unread DMs",
  "47 unread",
  "12 new pings",
  "Invoice past due",
  "Missed lead",
  "Follow up?",
  "Manual data entry",
];

/** Derive a truthful "from" floor for a lane by parsing the min price in its cards. */
function laneFloor(prices: string[]): string {
  const nums = prices
    .map((p) => Number(p.replace(/[^0-9.–-]/g, "").split(/[–-]/)[0]))
    .filter((n) => Number.isFinite(n) && n > 0);
  return nums.length ? `from $${Math.min(...nums).toLocaleString()}` : "";
}

/** A floating "busywork" pill. Gently bobs unless reduced-motion is set. */
export function MetricChip({ label, index = 0, className }: { label: string; index?: number; className?: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.span
      animate={reduce ? undefined : { y: [0, index % 2 === 0 ? -6 : 6, 0] }}
      transition={reduce ? undefined : { duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur",
        "shadow-[0_8px_24px_-16px_var(--color-glow-purple)]",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-highlight" aria-hidden />
      {label}
    </motion.span>
  );
}

/** The decorative "dashboard preview" section: a busywork chip cloud, a Five
 *  Lanes card (real verticals + floor prices), and the OptionWheel selector. */
export function HeroMetrics() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      {/* Left: busywork chip cloud */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight mb-4">
          What Yawn is already watching
        </p>
        <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
          The busywork, <span className="text-primary">handled.</span>
        </h3>
        <div className="flex flex-wrap gap-2.5" aria-hidden>
          {CHIPS.map((c, i) => (
            <MetricChip key={c} label={c} index={i} />
          ))}
        </div>
      </div>

      {/* Right: five lanes + wheel */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-center">
        <BorderGlow borderRadius={22} className="bg-card p-5">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-highlight">Five lanes</span>
            <span className="font-mono text-[11px] text-faint">$750 floor</span>
          </div>
          <ul className="divide-y divide-border/70">
            {VERTICALS.map((v) => (
              <li key={v.code} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2.5">
                  <v.icon className="size-4 text-muted-foreground" aria-hidden />
                  <span className="font-mono text-xs text-faint w-8">{v.code}</span>
                  <span className="text-sm font-medium text-foreground">{v.name}</span>
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {laneFloor(v.cards.map((c) => c.price))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-faint">
            <span><b className="text-muted-foreground font-semibold">25</b> templates</span>
            <span><b className="text-muted-foreground font-semibold">5</b> verticals</span>
          </div>
        </BorderGlow>

        <div>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-highlight">
            Jump to a lane
          </p>
          <OptionWheel />
        </div>
      </div>
    </div>
  );
}
