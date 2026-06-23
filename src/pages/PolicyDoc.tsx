import { type ReactNode } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { PolicyMarkdown } from "@/components/ui/markdown";
import { getPolicy, type Policy } from "@/lib/securityContent";

function DocShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b-2 border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
            Yawn
          </Link>
          <Link href="/security">
            <Button size="sm" variant="outline">
              ← Security Center
            </Button>
          </Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">{children}</main>
    </div>
  );
}

/** Shared renderer used by PolicyDoc, Privacy and Terms. */
export function PolicyDocView({ policy }: { policy: Policy | undefined }) {
  if (!policy) {
    return (
      <DocShell>
        <div className="border-2 border-border bg-card p-10 text-center">
          <p className="text-6xl font-extrabold text-primary mb-4">404</p>
          <h1 className="text-2xl font-extrabold mb-2">Policy not found</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find the document you're looking for. It may have moved or not been
            published yet.
          </p>
          <div className="mt-6">
            <Link href="/security">
              <Button>← Back to Security Center</Button>
            </Link>
          </div>
        </div>
      </DocShell>
    );
  }

  return (
    <DocShell>
      <article className="border-2 border-border bg-card p-6 sm:p-10">
        <PolicyMarkdown>{policy.body}</PolicyMarkdown>
      </article>
      <div className="mt-8">
        <Link href="/security">
          <Button variant="outline">← Back to Security Center</Button>
        </Link>
      </div>
    </DocShell>
  );
}

export default function PolicyDoc() {
  const params = useParams<{ slug: string }>();
  const policy = params.slug ? getPolicy(params.slug) : undefined;
  return <PolicyDocView policy={policy} />;
}
