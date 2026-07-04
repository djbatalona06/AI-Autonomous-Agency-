import { useContext } from "react";
import { AuthContext, type AuthValue } from "@/contexts/AuthContext";

/** Supabase-backed auth. Must be used within <AuthProvider> (mounted in App). */
export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
