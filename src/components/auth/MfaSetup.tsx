import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Two-factor (TOTP) enrollment + management. The server provisions a secret and
 * one-time recovery codes; the QR is rendered client-side from the otpauth URI
 * so the secret never has to round-trip as an image.
 */
export function MfaSetup() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [recovery, setRecovery] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");

  const setup = trpc.auth.mfaSetup.useMutation({
    onSuccess: async (res) => {
      setSecret(res.secret);
      setRecovery(res.recoveryCodes);
      try {
        const QRCode = await import("qrcode");
        setQr(await QRCode.toDataURL(res.otpauthUri, { margin: 1, width: 200 }));
      } catch {
        setQr(null); // Fall back to manual secret entry.
      }
    },
    onError: (e) => toast.error(e.message || "Could not start MFA setup."),
  });

  const enable = trpc.auth.mfaEnable.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setQr(null);
      setSecret(null);
      setRecovery([]);
      setCode("");
      toast.success("Two-factor authentication is now on.");
    },
    onError: (e) => toast.error(e.message || "Verification failed."),
  });

  const disable = trpc.auth.mfaDisable.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      setDisablePassword("");
      toast.success("Two-factor authentication disabled.");
    },
    onError: (e) => toast.error(e.message || "Could not disable MFA."),
  });

  // ── Already enabled: offer to disable (requires password) ──
  if (user?.mfaEnabled) {
    return (
      <div className="space-y-3">
        <p className="inline-block border-2 border-border bg-secondary px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
          MFA enabled
        </p>
        <p className="text-sm text-muted-foreground">
          Two-factor authentication is protecting your account. Enter your password to turn it off.
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={disablePassword}
            onChange={(e) => setDisablePassword(e.target.value)}
          />
          <Button
            variant="destructive"
            disabled={disable.isPending || !disablePassword}
            onClick={() => disable.mutate({ password: disablePassword })}
          >
            Disable
          </Button>
        </div>
      </div>
    );
  }

  // ── Enrollment in progress: show QR + recovery codes + verify ──
  if (secret) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Scan this QR code with Google Authenticator, 1Password, Authy, or any TOTP app — then
          enter the 6-digit code to finish.
        </p>
        {qr && (
          <img
            src={qr}
            alt="MFA QR code"
            width={200}
            height={200}
            className="border-2 border-border bg-white p-2"
          />
        )}
        <p className="text-xs break-all">
          Can't scan? Enter this secret manually:{" "}
          <code className="bg-secondary px-1">{secret}</code>
        </p>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide mb-1">Recovery codes</p>
          <p className="text-xs text-muted-foreground mb-2">
            Save these somewhere safe. Each can be used once if you lose your device.
          </p>
          <ul className="grid grid-cols-2 gap-1 text-sm font-mono">
            {recovery.map((c) => (
              <li key={c} className="border-2 border-border px-2 py-1">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2">
          <Input
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button disabled={enable.isPending || code.trim().length < 6} onClick={() => enable.mutate({ token: code.trim() })}>
            Verify & enable
          </Button>
        </div>
      </div>
    );
  }

  // ── Not set up yet ──
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Add a second factor (TOTP) for stronger account security. Required for admin accounts.
      </p>
      <Button onClick={() => setup.mutate()} disabled={setup.isPending}>
        {setup.isPending ? "Preparing…" : "Set up two-factor auth"}
      </Button>
    </div>
  );
}
