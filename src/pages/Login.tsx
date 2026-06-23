import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);

  const login = trpc.auth.login.useMutation({
    onSuccess: async (res) => {
      if (res.status === "mfa_required") {
        setMfaRequired(true);
        toast.message("Enter the code from your authenticator app.");
        return;
      }
      await utils.auth.me.invalidate();
      toast.success("Welcome back!");
      setLocation("/dashboard");
    },
    onError: (e) => toast.error(e.message || "Sign in failed."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate({ email, password, totp: mfaRequired ? totp : undefined });
  }

  return (
    <AuthShell title="Sign in" subtitle="Welcome back to Yawn.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mfaRequired}
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={mfaRequired}
          />
        </Field>
        {mfaRequired && (
          <Field label="Authentication code" hint="6-digit code from your app, or a recovery code.">
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="123456"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
            />
          </Field>
        )}
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : mfaRequired ? "Verify & sign in" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="underline font-semibold hover:text-foreground">
          Forgot password?
        </Link>
        <Link href="/signup" className="underline font-semibold hover:text-foreground">
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}
