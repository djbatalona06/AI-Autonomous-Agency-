import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", icon: "▦", href: "/dashboard" },
  { label: "Image Studio", icon: "🎨", href: "/studio/images" },
  { label: "Web Crawler", icon: "🕷️", href: "/studio/crawler" },
  { label: "Project History", icon: "📚", href: "/dashboard/history" },
  { label: "Settings", icon: "⚙️", href: "/dashboard/settings" },
  { label: "Help & Docs", icon: "📖", href: "/dashboard/help" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b-2 border-border">
        <Link href="/" className="text-3xl font-extrabold text-primary tracking-tight">
          Yawn
        </Link>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">AI Automation</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Primary">
        {NAV.map((item) => {
          const active = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border-2 font-semibold transition-colors duration-150",
                active
                  ? "border-border bg-primary text-primary-foreground"
                  : "border-transparent text-foreground hover:border-border hover:bg-secondary",
              )}
            >
              <span aria-hidden className="text-xl leading-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-border space-y-3">
        <div className="px-1">
          <p className="font-bold text-foreground truncate">{user?.name ?? "User"}</p>
          <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={logout}>
          Log out
        </Button>
      </div>
    </div>
  );
}

export function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduce = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r-2 border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r-2 border-border md:hidden"
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              role="dialog"
              aria-label="Navigation menu"
            >
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b-2 border-border bg-card px-4 md:px-8 py-4 flex items-center gap-3">
          <button
            type="button"
            className="md:hidden border-2 border-border w-10 h-10 flex items-center justify-center active:scale-[0.97] transition-transform"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <span aria-hidden className="text-xl leading-none">
              ☰
            </span>
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold text-foreground truncate">{title}</h1>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
