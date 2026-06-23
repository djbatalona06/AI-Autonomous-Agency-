import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Signup() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Account created. Welcome to Yawn!");
      setLocation("/dashboard");
    },
    onError: (e) => toast.error(e.message || "Could not create account."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    register.mutate({ email, password, name: name.trim() || undefined });
  }

  return (
    <AuthShell title="Create account" subtitle="Start automating the boring stuff.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name">
          <Input
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Visionary"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field
          label="Password"
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
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="underline font-semibold hover:text-foreground">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
