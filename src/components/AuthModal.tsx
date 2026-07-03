import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { Lock, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Mode = "in" | "up";
type Msg = { kind: "err" | "ok" | "info"; text: string } | null;

const MSG_STYLES: Record<NonNullable<Msg>["kind"], string> = {
  err: "bg-destructive/10 border-destructive/40 text-[#ffb3c0]",
  ok: "bg-success/10 border-success/40 text-[#9af0c4]",
  info: "bg-highlight/10 border-highlight/40 text-[#ffe79a]",
};

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [, navigate] = useLocation();
  const reduce = usePrefersReducedMotion();

  const [mode, setMode] = useState<Mode>("in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);

  function reset() {
    setMsg(null);
    setBusy(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (password.length < 8) {
      setMsg({ kind: "err", text: "Password must be at least 8 characters." });
      return;
    }
    setBusy(true);
    if (mode === "in") {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setMsg({ kind: "err", text: error });
        setBusy(false);
        return;
      }
      onClose();
      navigate("/dashboard");
    } else {
      const { error, needsConfirm } = await signUp(email.trim(), password, fullName.trim());
      if (error) {
        setMsg({ kind: "err", text: error });
        setBusy(false);
        return;
      }
      if (needsConfirm) {
        setMsg({ kind: "info", text: "Check your inbox to confirm your email, then sign in." });
        setMode("in");
        setBusy(false);
        return;
      }
      onClose();
      navigate("/dashboard");
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    reset();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-auto bg-black/70 backdrop-blur-sm p-4 sm:p-10"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to Yawn"
            className="w-full max-w-md rounded-2xl border border-border bg-popover shadow-[0_40px_100px_-30px_#000]"
            initial={reduce ? false : { y: 14, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { y: 14, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border bg-secondary rounded-full px-3 py-1.5 font-mono">
                  <Lock size={13} /> Secure access
                </span>
                <h3 className="font-serif text-2xl font-semibold mt-3 tracking-tight">
                  {mode === "in" ? "Sign in to Yawn" : "Create your account"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid place-items-center w-8 h-8 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 pt-4">
              <div className="flex gap-1.5 bg-background border border-border rounded-xl p-1.5 mb-4">
                {(["in", "up"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      mode === m ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "in" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>

              {msg && (
                <div className={`text-sm rounded-xl border px-3 py-2.5 mb-3.5 ${MSG_STYLES[msg.kind]}`} role="alert">
                  {msg.text}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-3.5">
                {mode === "up" && (
                  <div>
                    <label htmlFor="fullName" className="block text-sm text-muted-foreground font-semibold mb-1.5">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm text-muted-foreground font-semibold mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm text-muted-foreground font-semibold mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === "in" ? "current-password" : "new-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-3 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-60 active:scale-[0.98] transition-transform"
                >
                  {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
                </button>
                <p className="text-xs text-faint text-center leading-relaxed">
                  Protected by a 3-attempt / 15-minute lockout. We never store your password — auth is
                  handled by Supabase.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
