import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Mark() {
  return (
    <span className="inline-grid place-items-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-sm font-extrabold shadow-[0_6px_20px_-8px_var(--color-primary)]">
      Y
    </span>
  );
}

const NAV_LINKS = [
  { href: "/catalog", label: "[ verticals ]" },
  { href: "/tutorials", label: "[ tutorials ]" },
  { href: "/pricing", label: "[ pricing ]" },
  { href: "/#features", label: "[ why us ]" },
];

export function SiteNav() {
  const { isAuthenticated, displayName, signOut, openAuth } = useAuth();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
          <Mark />
          Yawn
        </Link>
        <div className="hidden md:flex items-center gap-6 font-mono text-[13px] text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm font-medium text-muted-foreground truncate max-w-[10rem]">
                {displayName}
              </span>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => void signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={openAuth}>
              Get started
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-faint">
        <span className="flex items-center gap-2 font-bold text-foreground">
          <Mark /> Yawn
        </span>
        <div className="flex items-center gap-4">
          <Link href="/catalog" className="hover:text-foreground transition-colors">Catalog</Link>
          <Link href="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <span>Automate the Boring.</span>
        </div>
      </div>
    </footer>
  );
}
