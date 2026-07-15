import { useState, type KeyboardEvent } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { VERTICALS } from "@/data/verticals";
import { cn } from "@/lib/utils";

const RADIUS = 92; // px from wheel center to each item

/**
 * A radial "jump to a lane" selector. The five real verticals sit on a ring;
 * the active one snaps to the top and the center hub navigates to its catalog
 * page (`/catalog/<code>`). Arrow keys rotate the selection, Enter/Space opens.
 * Under `prefers-reduced-motion` the ring doesn't spin — the active item is
 * simply highlighted in place.
 */
export function OptionWheel({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [, navigate] = useLocation();
  const reduce = usePrefersReducedMotion();

  const items = VERTICALS;
  const n = items.length;
  const step = 360 / n;
  const wheelRotation = reduce ? 0 : -active * step;
  const activeV = items[active];

  const open = () => navigate(`/catalog/${activeV.code.toLowerCase()}`);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      setActive((a) => (a + 1) % n);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      setActive((a) => (a - 1 + n) % n);
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      open();
      e.preventDefault();
    }
  }

  return (
    <div
      role="listbox"
      aria-label="Explore automation lanes"
      aria-activedescendant={`wheel-${activeV.code}`}
      tabIndex={0}
      onKeyDown={onKey}
      className={cn(
        "relative mx-auto size-[236px] rounded-full outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {/* faint guide ring */}
      <div className="absolute inset-3 rounded-full border border-border/70" aria-hidden />

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: wheelRotation }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
      >
        {items.map((v, i) => {
          const angle = (i * step - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          const isActive = i === active;
          const Icon = v.icon;
          return (
            <button
              key={v.code}
              id={`wheel-${v.code}`}
              role="option"
              aria-selected={isActive}
              aria-label={`${v.name} lane`}
              title={v.name}
              onClick={() => (isActive ? open() : setActive(i))}
              style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
              className={cn(
                "absolute left-1/2 top-1/2 grid place-items-center rounded-full border transition-colors",
                isActive
                  ? "size-12 border-transparent bg-secondary text-foreground shadow-[0_0_0_1px_var(--color-glow-purple),0_8px_28px_-8px_var(--color-glow-purple)]"
                  : "size-10 border-border bg-card text-muted-foreground hover:text-foreground hover:border-faint",
              )}
            >
              {/* counter-rotate the content so icons stay upright while the ring spins */}
              <motion.span
                className="grid place-items-center"
                animate={{ rotate: -wheelRotation }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
              >
                <Icon className={isActive ? "size-5" : "size-4"} aria-hidden />
              </motion.span>
            </button>
          );
        })}
      </motion.div>

      {/* center hub — opens the active lane's catalog */}
      <div className="absolute inset-0 grid place-items-center">
        <button
          onClick={open}
          className="grid size-[104px] place-items-center rounded-full border border-border bg-card/80 backdrop-blur text-center transition-colors hover:border-faint"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-highlight">Explore</span>
          <span className="font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
            {activeV.name}
          </span>
          <span className="text-xs text-muted-foreground">{activeV.code} →</span>
        </button>
      </div>
    </div>
  );
}
