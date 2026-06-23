import { type ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  POLICY_CATEGORIES,
  hasPolicies,
  policiesByCategory,
  type PolicyCategory,
} from "@/lib/securityContent";

const CATEGORY_BLURB: Record<PolicyCategory, string> = {
  "Core Policies":
    "The operational controls that govern how we build, run, and protect the Yawn platform.",
  Legal: "The agreements and notices that cover your data and your use of Yawn.",
};

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b-2 border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
            Yawn
          </Link>
          <Link href="/">
            <Button size="sm" variant="outline">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">{children}</main>
    </div>
  );
}

function PolicyCard({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  return (
    <Link
      href={`/security/${slug}`}
      className="group flex items-center justify-between gap-4 border-2 border-border bg-card p-5 hover:bg-secondary transition-colors"
    >
      <div className="min-w-0">
        <h3 className="font-extrabold text-lg truncate">{title}</h3>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">/{`security/${slug}`}</p>
      </div>
      <span aria-hidden className="text-2xl text-primary shrink-0 group-hover:translate-x-1 transition-transform">
        →
      </span>
    </Link>
  );
}

export default function SecurityCenter() {
  return (
    <PageShell>
      {/* Header */}
      <header className="mb-12">
        <p className="inline-block border-2 border-border bg-secondary px-3 py-1 text-sm font-bold uppercase tracking-widest mb-6">
          Security Center
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[0.95]">
          How Yawn keeps your <span className="text-primary">data safe.</span>
        </h1>
        <p className="mt-6 text-lg font-semibold text-foreground/90 max-w-3xl">
          Security is not a checkbox at Yawn — it is part of how we build. Below are the policies
          that govern our security program, from access control and incident response to data
          retention and our legal commitments. Every control listed is one we actually run today.
        </p>
      </header>

      {!hasPolicies ? (
        <div className="border-2 border-border bg-card p-10 text-center">
          <div className="text-5xl mb-4" aria-hidden>
            🛡️
          </div>
          <h2 className="text-2xl font-extrabold mb-2">Policies are being published</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our security documentation is being finalized and will appear here shortly. Check back
            soon.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {POLICY_CATEGORIES.map((category) => {
            const policies = policiesByCategory(category);
            if (policies.length === 0) return null;
            return (
              <section key={category}>
                <h2 className="text-2xl font-extrabold uppercase tracking-wide border-b-2 border-border pb-2 mb-2">
                  {category}
                </h2>
                <p className="text-muted-foreground mb-5">{CATEGORY_BLURB[category]}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {policies.map((p) => (
                    <PolicyCard key={p.slug} slug={p.slug} title={p.title} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <footer className="mt-16 pt-8 border-t-2 border-border flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="font-extrabold text-primary text-lg">Yawn</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="underline font-semibold hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="underline font-semibold hover:text-foreground">
            Terms
          </Link>
        </div>
      </footer>
    </PageShell>
  );
}
