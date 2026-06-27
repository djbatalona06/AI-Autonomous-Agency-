/**
 * KoalaShowcase — the cyber-grid koala mascot animation.
 *
 * `background` mode renders it full-bleed (no frame) so it can sit behind the
 * hero as a perched-on-a-tree backdrop. The iframe internally cover-scales its
 * 1920×1080 stage to fill whatever box we give it, and `pointer-events: none`
 * lets clicks + the custom cursor pass straight through to the page above.
 */
export function KoalaShowcase({ background = false }: { background?: boolean }) {
  if (background) {
    return (
      <iframe
        src="/animations/yawn-koala/index.html?bg=1"
        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        title="Yawn — cyber koala mascot"
        allow="autoplay"
        aria-hidden="true"
        tabIndex={-1}
      />
    );
  }

  return (
    <div className="w-full aspect-video border-2 border-border bg-black overflow-hidden">
      <iframe
        src="/animations/yawn-koala/index.html"
        className="w-full h-full"
        title="Yawn — Kaiju Koala agency showreel"
        allow="autoplay"
        loading="lazy"
      />
    </div>
  );
}
