import { useRef, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A container whose border lights up with an aurora (purple → pink → blue)
 * gradient that tracks the pointer. A radial spotlight follows the cursor and
 * intensifies as it nears the container's edge, so the frame feels reactive.
 *
 * Native (no WebGL): a `radial-gradient` mask painted on a border-sized layer,
 * positioned via CSS custom props updated on `pointermove`. Under
 * `prefers-reduced-motion` the pointer listener is skipped and a soft static
 * glow is shown instead.
 */
type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  /** Gradient stops for the border sheen. */
  colors?: string[];
  /** Corner radius in px. */
  borderRadius?: number;
  /** 0–1.5 — opacity multiplier for the pointer spotlight. */
  glowIntensity?: number;
  /** Radius (px) of the pointer spotlight. Larger = softer falloff. */
  glowRadius?: number;
  /** When true, the border sheen also slowly drifts on its own. */
  animated?: boolean;
};

export function BorderGlow({
  children,
  className,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  borderRadius = 24,
  glowIntensity = 1,
  glowRadius = 260,
  animated = false,
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    el.style.setProperty("--go", String(glowIntensity));
  }
  function onLeave() {
    ref.current?.style.setProperty("--go", "0");
  }

  const gradient = `linear-gradient(130deg, ${colors.join(", ")})`;

  const style = {
    "--bg-radius": `${borderRadius}px`,
    "--bg-gradient": gradient,
    "--go": reduce ? String(0.4 * glowIntensity) : "0",
    "--gx": "50%",
    "--gy": "0%",
    "--glow-radius": `${glowRadius}px`,
    borderRadius: `${borderRadius}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reduce ? undefined : onLeave}
      style={style}
      className={cn("border-glow relative", animated && !reduce && "border-glow--animated", className)}
    >
      {children}
    </div>
  );
}
