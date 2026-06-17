import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";

const ACTIONS = [
  { icon: "🎨", title: "Image Studio", body: "Generate AI images", href: "/studio/images" },
  { icon: "🕷️", title: "Web Crawler", body: "Scrape & analyze sites", href: "/studio/crawler" },
  { icon: "📚", title: "Project History", body: "Revisit your work", href: "/dashboard/history" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const reduce = usePrefersReducedMotion();
  const { data } = trpc.projects.getAll.useQuery({ limit: 100 });

  const stats = [
    { label: "Images generated", value: data?.images.length ?? 0 },
    { label: "Sites crawled", value: data?.scrapes.length ?? 0 },
    { label: "Total projects", value: data?.total ?? 0 },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-extrabold">
            Welcome back, <span className="text-primary">{user?.name?.split(" ")[0] ?? "there"}</span>.
          </h2>
          <p className="text-muted-foreground mt-2">Pick a tool and start automating.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border-2 border-border bg-card p-5">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <motion.div
              key={a.href}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={a.href}
                className="block border-2 border-border bg-card p-8 hover:bg-secondary transition-colors group"
              >
                <div className="text-5xl mb-4 transition-transform group-hover:scale-110" aria-hidden>
                  {a.icon}
                </div>
                <h3 className="text-2xl font-extrabold mb-1">{a.title}</h3>
                <p className="text-muted-foreground">{a.body}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
