import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const request = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: (res) => {
      setSent(true);
      // In non-production the API returns a token so the flow is testable
      // without an email provider wired up.
      if ("devToken" in res && res.devToken) {
        setDevLink(`/reset-password?token=${encodeURIComponent(res.devToken)}`);
      }
    },
    onError: (e) => toast.error(e.message || "Something went wrong."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    request.mutate({ email });
  }

  return (
    <AuthShell title="Reset password" subtitle="We'll email you a reset link.">
      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-foreground/90">
            If an account exists for <strong>{email}</strong>, a password reset link is on its way.
            Check your inbox (and spam folder).
          </p>
          {devLink && (
            <div className="border-2 border-border bg-secondary p-3 text-sm">
              <p className="font-bold uppercase tracking-wide text-xs mb-1">Dev mode</p>
              <Link href={devLink} className="underline font-semibold break-all">
                Continue to reset →
              </Link>
            </div>
          )}
          <Link href="/login" className="inline-block underline font-semibold text-sm">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Email">
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={request.isPending}>
              {request.isPending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-center">
            <Link href="/login" className="underline font-semibold hover:text-foreground">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
