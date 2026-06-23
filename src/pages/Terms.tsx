import { type ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PolicyMarkdown } from "@/components/ui/markdown";
import { getPolicy } from "@/lib/securityContent";

function LegalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">{children}</main>
    </div>
  );
}

export default function Terms() {
  const policy = getPolicy("terms-of-service");

  return (
    <LegalShell>
      {policy ? (
        <article className="border-2 border-border bg-card p-6 sm:p-10">
          <PolicyMarkdown>{policy.body}</PolicyMarkdown>
        </article>
      ) : (
        <div className="border-2 border-border bg-card p-10 text-center">
          <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our terms of service are being finalized and will be published here shortly.
          </p>
          <div className="mt-6">
            <Link href="/security">
              <Button variant="outline">Visit the Security Center</Button>
            </Link>
          </div>
        </div>
      )}
    </LegalShell>
  );
}
