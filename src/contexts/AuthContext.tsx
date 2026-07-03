import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/AuthModal";

export type Role = "customer" | "admin" | null;

export interface AuthValue {
  user: User | null;
  session: Session | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  displayName: string;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; needsConfirm?: boolean }>;
  signOut: () => Promise<void>;
  openAuth: () => void;
  closeAuth: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

function mapAuthError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "Wrong email or password.";
  if (/email not confirmed/i.test(msg)) return "Confirm your email first — check your inbox.";
  return msg;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Fetch the profile role whenever the signed-in user changes.
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setRole(null);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", uid)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setRole((data?.role as Role) ?? "customer");
      });
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data: statusRows } = await supabase.rpc("login_status", { p_email: email });
    const status = Array.isArray(statusRows) ? statusRows[0] : statusRows;
    if (status?.locked) {
      const mins = Math.ceil((status.retry_after_seconds ?? 0) / 60);
      return { error: `Too many attempts. Try again in ${mins} min.` };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    await supabase.rpc("record_login_attempt", { p_email: email, p_success: !error });
    if (error) return { error: mapAuthError(error.message) };
    return {};
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    return { needsConfirm: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setRole(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user: session?.user ?? null,
      session,
      role,
      isAuthenticated: !!session,
      isLoading,
      displayName:
        (session?.user?.user_metadata?.full_name as string) || session?.user?.email || "there",
      signIn,
      signUp,
      signOut,
      openAuth: () => setModalOpen(true),
      closeAuth: () => setModalOpen(false),
    }),
    [session, role, isLoading, signIn, signUp, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AuthContext.Provider>
  );
}
