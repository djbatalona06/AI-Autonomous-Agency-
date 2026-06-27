import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * CursorEffect — a glowing brand-purple cursor dot plus a larger ring that
 * trails behind with a springy lag. The ring swells when hovering interactive
 * elements (a, button, [role=button], [data-cursor]).
 *
 * Fixed, full-page, and `pointer-events: none` so it never blocks clicks.
 * Disabled on touch / coarse pointers; honours `prefers-reduced-motion` by
 * dropping the trailing lag (the ring tracks the dot 1:1).
 */
export function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    // Skip on devices without a fine pointer (touch screens, etc.)
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Live target = real mouse position. Ring lerps toward it each frame.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: target.x, y: target.y };
    let hovering = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      // The dot is always pinned exactly to the cursor.
      dot.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const isInteractive = (el: Element | null) =>
      !!el?.closest("a, button, [role='button'], input, textarea, select, [data-cursor='hover']");

    const onOver = (e: MouseEvent) => {
      hovering = isInteractive(e.target as Element);
      ring.style.setProperty("--ring-scale", hovering ? "1.6" : "1");
      ring.style.borderColor = hovering
        ? "rgba(182,102,210,0.95)"
        : "rgba(182,102,210,0.6)";
    };

    const render = () => {
      // Spring/lerp toward target; reduced-motion → instant follow.
      const ease = reduce ? 1 : 0.18;
      ringPos.x += (target.x - ringPos.x) * ease;
      ringPos.y += (target.y - ringPos.y) * ease;
      const scale = ring.style.getPropertyValue("--ring-scale") || "1";
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 opacity-0 transition-[border-color] duration-200 will-change-transform"
        style={{
          borderColor: "rgba(182,102,210,0.6)",
          boxShadow: "0 0 18px rgba(182,102,210,0.35), inset 0 0 12px rgba(182,102,210,0.25)",
        }}
      />
      {/* Core dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-3 w-3 rounded-full opacity-0 will-change-transform"
        style={{
          background: "#b666d2",
          boxShadow: "0 0 12px rgba(182,102,210,0.9), 0 0 28px rgba(182,102,210,0.5)",
        }}
      />
    </div>
  );
}
