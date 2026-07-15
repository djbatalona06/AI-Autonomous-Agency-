import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Node = { x: number; y: number; vx: number; vy: number; c: string };

/** Aurora accent palette (purple → pink → blue) — mirrors --color-glow-* tokens. */
const AURORA = ["#c084fc", "#f472b6", "#38bdf8"];
const LINK = "148, 163, 184"; // slate-400 rgb for faint node-to-node links
const CURSOR = "192, 132, 252"; // glow-purple rgb for cursor links

type ParticleFieldProps = {
  className?: string;
  /** Node colors, cycled by index. Defaults to the purple/pink/blue aurora. */
  colors?: string[];
  /** Area (px²) per node — smaller = denser. Node count is capped for perf. */
  density?: number;
  /** RGB triple ("r, g, b") for node-to-node connector lines. */
  linkColor?: string;
  /** RGB triple ("r, g, b") for the line drawn from each node to the cursor. */
  cursorColor?: string;
};

/**
 * Mouse-tracking particle field (constellation). Drifting nodes connect with
 * thin lines when near each other or the cursor, and gently repel from the
 * pointer. Canvas-based, DPR-capped, pauses when the tab is hidden. Under
 * `prefers-reduced-motion` it renders a single static sparse frame.
 *
 * Colors, density, and link/cursor line colors are configurable; defaults land
 * on the aurora palette so the hero reads purple/pink/blue out of the box.
 */
export function ParticleField({
  className,
  colors = AURORA,
  density = 14000,
  linkColor = LINK,
  cursorColor = CURSOR,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const canvas = canvasEl; // non-null alias so nested closures keep the type
    const ctx = ctx2d;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;

    const palette = (i: number) => colors[i % colors.length];

    function build() {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? canvas.clientWidth;
      height = parent?.clientHeight ?? canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(90, Math.round((width * height) / density));
      nodes = Array.from({ length: target }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: palette(i),
      }));
    }

    function draw(animate: boolean) {
      ctx.clearRect(0, 0, width, height);
      const linkDist = 120;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (animate) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          if (mouse.active) {
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130 && d2 > 0.01) {
              const f = (1 - Math.sqrt(d2) / 130) * 0.6;
              const inv = 1 / Math.sqrt(d2);
              n.x += dx * inv * f;
              n.y += dy * inv * f;
            }
          }
        }

        // connector lines to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const a = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(${linkColor},${a.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // line to cursor
        if (mouse.active) {
          const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (dist < 160) {
            const a = (1 - dist / 160) * 0.5;
            ctx.strokeStyle = `rgba(${cursorColor},${a.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = n.c;
        ctx.beginPath();
        // Slightly larger dots for the lead accent color for a touch of depth.
        ctx.arc(n.x, n.y, n.c === colors[0] ? 2.2 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let running = true;
    function loop() {
      if (!running) return;
      draw(true);
      raf = requestAnimationFrame(loop);
    }

    function onResize() {
      build();
      if (reduce) draw(false);
    }
    function onMove(e: PointerEvent) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce && !running) {
        running = true;
        loop();
      }
    }

    build();
    if (reduce) {
      draw(false);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVisibility);
      loop();
    }
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, colors, density, linkColor, cursorColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
