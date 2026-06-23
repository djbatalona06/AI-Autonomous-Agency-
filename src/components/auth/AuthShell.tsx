import { type ReactNode } from "react";
import { Link } from "wouter";

/** Centered, brutalist card layout shared by the auth pages. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b-2 border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-primary tracking-tight">
            Yawn
          </Link>
          <Link href="/" className="text-sm font-semibold underline hover:text-foreground">
            ← Home
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="border-2 border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground font-semibold">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Labelled form field with an optional hint line. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold uppercase tracking-wide mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1.5">{hint}</span>}
    </label>
  );
}
