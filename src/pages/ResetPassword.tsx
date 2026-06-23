import { useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = useMemo(() => new URLSearchParams(search).get("token") ?? "", [search]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const reset = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated. Please sign in.");
      setLocation("/login");
    },
    onError: (e) => toast.error(e.message || "Could not reset password."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    reset.mutate({ token, password });
  }

  if (!token) {
    return (
      <AuthShell title="Reset password">
        <p className="text-sm text-foreground/90">
          This reset link is missing or invalid. Request a new one to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block underline font-semibold text-sm"
        >
          Request a new link →
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="New password"
          hint="At least 12 characters, with upper & lower case, a number, and a symbol."
        >
          <Input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm new password">
          <Input
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
