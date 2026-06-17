import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const reduce = usePrefersReducedMotion();
  const utils = trpc.useUtils();

  const { data: images = [], isLoading } = trpc.images.getHistory.useQuery({ limit: 24 });

  const generate = trpc.images.generate.useMutation({
    onSuccess: async () => {
      toast.success("Image generated!");
      setPrompt("");
      await utils.images.getHistory.invalidate();
    },
    onError: (e) => toast.error(e.message || "Failed to generate image"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    generate.mutate({ prompt: prompt.trim() });
  }

  function download(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `yawn-${name}`.replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <DashboardLayout title="AI Image Studio">
      <div className="max-w-6xl mx-auto space-y-10">
        <p className="text-muted-foreground -mt-4">
          Describe an image and generate an on-brand visual. Every result is saved to your history.
        </p>

        {/* Prompt form */}
        <div className="border-2 border-border bg-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="prompt" className="block text-sm font-bold">
              Image prompt
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A bold brutalist poster for a coffee brand, purple palette…"
                disabled={generate.isPending}
              />
              <Button type="submit" disabled={generate.isPending} className="sm:w-44">
                {generate.isPending ? (
                  <>
                    <Spinner /> Generating…
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Gallery */}
        <section>
          <h2 className="text-2xl font-extrabold mb-5">Your images</h2>

          {isLoading ? (
            <div className="border-2 border-border bg-card p-12 flex justify-center">
              <Spinner className="w-8 h-8 text-primary" />
            </div>
          ) : images.length === 0 ? (
            <div className="border-2 border-border bg-card p-12 text-center text-muted-foreground">
              No images yet. Generate your first one above.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, i) => (
                <motion.figure
                  key={img.id}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                  className="border-2 border-border bg-card group"
                >
                  <div className="aspect-square bg-secondary overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-4 space-y-3">
                    <p className="text-sm text-foreground/90 line-clamp-2">{img.prompt}</p>
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-muted-foreground">
                        {new Date(img.createdAt).toLocaleDateString()}
                      </time>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => download(img.imageUrl, img.prompt)}
                      >
                        Download
                      </Button>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
