export function KoalaShowcase() {
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
