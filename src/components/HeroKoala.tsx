import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { BorderGlow } from "@/components/BorderGlow";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Wand tip / n8n glyph position as a % of the koala image (measured on the PNG). */
const TIP = { x: 63, y: 30 };

/** Sparkle offsets (in % of the frame) clustered around the wand tip. */
const SPARKS = [
  { dx: 0, dy: 0, size: 10, delay: 0 },
  { dx: -3.4, dy: 2.6, size: 6, delay: 0.35 },
  { dx: 3.2, dy: -2.2, size: 7, delay: 0.7 },
  { dx: 1.6, dy: 4.2, size: 5, delay: 1.05 },
  { dx: -2.2, dy: -3.6, size: 5, delay: 1.4 },
];

/**
 * The hero mascot. The koala PNG has a painted light backdrop, so it's shown in
 * a rounded, aurora-lit "glass panel" (via BorderGlow) that floats gently. An
 * animated sparkle cluster sits over the n8n wand tip so the wand reads as
 * alive. Under `prefers-reduced-motion` the float and sparks are stilled and a
 * soft static halo is shown instead.
 */
export function HeroKoala({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();

  return (
    <div className={cn("relative", className)}>
      {/* Aurora glow behind the panel */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-6 -z-10 rounded-[36px] blur-3xl opacity-70",
          !reduce && "animate-[aurora-drift_7s_ease-in-out_infinite]",
        )}
        style={{
          background:
            "radial-gradient(60% 60% at 65% 35%, var(--color-glow-purple), transparent 70%), radial-gradient(50% 50% at 25% 70%, var(--color-glow-blue), transparent 72%)",
        }}
        aria-hidden
      />

      {/* Outer: scroll-triggered entrance reveal */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Inner: perpetual gentle float (kept separate to avoid clashing with the reveal) */}
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BorderGlow borderRadius={28} glowIntensity={1.1} animated className="overflow-hidden bg-card">
          <div className="relative">
            <img
              src="/yawn-koala.png"
              alt="The Yawn koala mascot, a voxel koala waving an n8n automation wand"
              width={1376}
              height={768}
              className="block w-full select-none"
              draggable={false}
            />

            {/* Wand-tip sparkle overlay */}
            <div
              className="pointer-events-none absolute"
              style={{ left: `${TIP.x}%`, top: `${TIP.y}%`, transform: "translate(-50%, -50%)" }}
              aria-hidden
            >
              {/* soft halo (always present; pulses only when motion is allowed) */}
              <div
                className={cn(
                  "absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl",
                  !reduce && "animate-[aurora-drift_3.4s_ease-in-out_infinite]",
                )}
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-glow-pink) 85%, #fff) 0%, transparent 65%)",
                  opacity: reduce ? 0.5 : undefined,
                }}
              />
              {!reduce &&
                SPARKS.map((s, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full bg-white animate-[wand-spark_2.2s_ease-in-out_infinite]"
                    style={{
                      width: s.size,
                      height: s.size,
                      left: `${s.dx}%`,
                      top: `${s.dy}%`,
                      transform: "translate(-50%, -50%)",
                      animationDelay: `${s.delay}s`,
                      boxShadow: "0 0 10px 2px color-mix(in srgb, var(--color-glow-purple) 80%, #fff)",
                    }}
                  />
                ))}
            </div>
          </div>
          </BorderGlow>
        </motion.div>
      </motion.div>
    </div>
  );
}
