import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";

export default function ProjectHistory() {
  const { data, isLoading } = trpc.projects.getAll.useQuery({ limit: 100 });

  return (
    <DashboardLayout title="Project History">
      <div className="max-w-6xl mx-auto space-y-12">
        {isLoading ? (
          <div className="border-2 border-border bg-card p-12 flex justify-center">
            <Spinner className="w-8 h-8 text-primary" />
          </div>
        ) : (
          <>
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-extrabold">Images</h2>
                <Link href="/studio/images" className="text-sm font-bold text-primary underline">
                  Open studio →
                </Link>
              </div>
              {data && data.images.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {data.images.map((img) => (
                    <div key={img.id} className="border-2 border-border bg-card">
                      <div className="aspect-square bg-secondary overflow-hidden">
                        <img src={img.imageUrl} alt={img.prompt} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <p className="p-3 text-xs text-foreground/90 line-clamp-2">{img.prompt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground border-2 border-border bg-card p-6">No images yet.</p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-extrabold">Crawled sites</h2>
                <Link href="/studio/crawler" className="text-sm font-bold text-primary underline">
                  Open crawler →
                </Link>
              </div>
              {data && data.scrapes.length > 0 ? (
                <ul className="space-y-3">
                  {data.scrapes.map((s) => (
                    <li key={s.id} className="border-2 border-border bg-card p-4 flex justify-between gap-4">
                      <span className="font-semibold break-all">{s.url}</span>
                      <time className="text-xs text-muted-foreground shrink-0">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground border-2 border-border bg-card p-6">No scrapes yet.</p>
              )}
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
