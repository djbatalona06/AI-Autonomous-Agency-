import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MfaSetup } from "@/components/auth/MfaSetup";

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const change = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password updated.");
    },
    onError: (e) => toast.error(e.message || "Could not update password."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    change.mutate({ currentPassword: current, newPassword: next });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
      <Input
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        required
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Input
        type="password"
        autoComplete="new-password"
        placeholder="New password"
        required
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <Input
        type="password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        At least 12 characters, with upper & lower case, a number, and a symbol.
      </p>
      <Button type="submit" disabled={change.isPending}>
        {change.isPending ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { data: health } = trpc.system.health.useQuery();

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-8">
        <section className="border-2 border-border bg-card p-6">
          <h2 className="text-xl font-extrabold mb-4">Profile</h2>
          <dl className="space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-semibold">{user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold break-all">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-semibold capitalize">{user?.role ?? "user"}</dd>
            </div>
          </dl>
        </section>

        <section className="border-2 border-border bg-card p-6 space-y-8">
          <h2 className="text-xl font-extrabold">Security</h2>

          <div>
            <h3 className="font-bold mb-3 uppercase tracking-wide text-sm">Change password</h3>
            <ChangePassword />
          </div>

          <div className="border-t-2 border-border pt-6">
            <h3 className="font-bold mb-3 uppercase tracking-wide text-sm">
              Two-factor authentication
            </h3>
            <MfaSetup />
          </div>
        </section>

        <section className="border-2 border-border bg-card p-6">
          <h2 className="text-xl font-extrabold mb-4">AI providers</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Set API keys in <code className="bg-secondary px-1">.env</code> to switch from built-in
            mocks to live providers.
          </p>
          <dl className="space-y-3">
            {health &&
              Object.entries(health.providers).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground capitalize">{k}</dt>
                  <dd className="font-semibold">
                    <span className="border-2 border-border px-2 py-0.5 text-xs uppercase tracking-wide">
                      {v}
                    </span>
                  </dd>
                </div>
              ))}
          </dl>
        </section>

        <Button variant="destructive" onClick={logout}>
          Log out
        </Button>
      </div>
    </DashboardLayout>
  );
}
