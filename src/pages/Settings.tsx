import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { user, displayName, role, signOut } = useAuth();
  const { data: health } = trpc.system.health.useQuery();

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-8">
        <section className="border-2 border-border bg-card p-6">
          <h2 className="text-xl font-extrabold mb-4">Profile</h2>
          <dl className="space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-semibold">{displayName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold break-all">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-semibold capitalize">{role ?? "customer"}</dd>
            </div>
          </dl>
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

        <Button variant="destructive" onClick={() => void signOut()}>
          Log out
        </Button>
      </div>
    </DashboardLayout>
  );
}
