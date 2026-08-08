import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Login — Ridgemont Fire & Rescue" },
      { name: "description", content: "Department staff sign-in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const value = error as { message?: unknown; error_description?: unknown; code?: unknown };
    if (typeof value.message === "string" && value.message.trim()) return value.message;
    if (typeof value.error_description === "string" && value.error_description.trim()) {
      return value.error_description;
    }
    if (typeof value.code === "string" && value.code.trim()) return value.code.replaceAll("_", " ");
  }
  return "The authentication service could not complete this request. Please try again.";
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [offerSignup, setOfferSignup] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  function humanize(raw: string): string {
    const m = raw.toLowerCase();
    if (m.includes("invalid login"))
      return "That email and password don't match an active account.";
    if (m.includes("email not confirmed"))
      return "This account was created before automatic confirmation was enabled. Remove the old user in Backend → Users, then create the account again.";
    if (m.includes("rate limit"))
      return "Too many attempts. Please wait a few minutes and try again.";
    if (m.includes("already registered") || m.includes("already been registered"))
      return "This email is already registered. Try signing in instead.";
    if (m.includes("password") && (m.includes("6") || m.includes("short")))
      return "Password must be at least 6 characters.";
    if (m.includes("weak") || m.includes("pwned") || m.includes("compromised"))
      return "That password appears in a known data breach. Please pick a different one.";
    if (m.includes("email") && m.includes("invalid")) return "Please enter a valid email address.";
    return raw;
  }

  async function getAdminStatus(userId: string) {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) throw error;
    return data?.role === "admin";
  }

  async function doSignIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const userId = data.user?.id;
    if (!userId) throw new Error("Signed in, but user data is missing.");

    const isAdmin = await getAdminStatus(userId);
    if (!isAdmin) throw new Error("This account is not an admin.");

    toast.success("Signed in");
    navigate({ to: "/admin", replace: true });
  }

  async function doSignUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;

    if (data.user?.identities?.length === 0) {
      throw new Error("This email is already registered. Try signing in instead.");
    }
    if (!data.session) throw new Error("Email not confirmed");

    const userId = data.user?.id;
    if (!userId) throw new Error("Signed in, but user data is missing.");

    const isAdmin = await getAdminStatus(userId);
    if (!isAdmin) throw new Error("This account is not an admin.");

    toast.success("Account created — signing you in");
    navigate({ to: "/admin", replace: true });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInlineError(null);
    setOfferSignup(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(fd.get("password") ?? "");

    try {
      if (mode === "signup") {
        await doSignUp(email, password);
      } else {
        await doSignIn(email, password);
      }
    } catch (err) {
      const raw = getAuthErrorMessage(err);
      const msg = humanize(raw);
      setInlineError(msg);
      // If they tried to sign in but no account exists, offer to create one inline (no red toast)
      if (mode === "signin" && raw.toLowerCase().includes("invalid login")) {
        setOfferSignup({ email, password });
      }
    } finally {
      setLoading(false);
    }
  }

  async function createFromOffer() {
    if (!offerSignup) return;
    setLoading(true);
    setInlineError(null);
    try {
      await doSignUp(offerSignup.email, offerSignup.password);
    } catch (err) {
      const raw = getAuthErrorMessage(err);
      setInlineError(humanize(raw));
    } finally {
      setOfferSignup(null);
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] bg-secondary/40 px-4 py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--navy-deep)] text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-wide uppercase">Staff Login</h1>
            <p className="text-xs text-muted-foreground">Authorized personnel only</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="block text-xs font-bold tracking-wider uppercase">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold tracking-wider uppercase">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20"
            />
            {mode === "signup" && (
              <span className="mt-1 block text-[11px] text-muted-foreground">
                At least 6 characters.
              </span>
            )}
          </label>

          {inlineError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p>{inlineError}</p>
                {offerSignup && (
                  <button
                    type="button"
                    onClick={createFromOffer}
                    disabled={loading}
                    className="mt-2 inline-flex items-center gap-1 rounded-md bg-[var(--navy-deep)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--navy)] disabled:opacity-60"
                  >
                    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                    Create this account instead
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--navy-deep)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--navy)] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "First time here?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setInlineError(null);
              setOfferSignup(null);
            }}
            className="font-semibold text-[var(--navy)] underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          The first account created automatically becomes admin.
        </p>
      </div>
    </section>
  );
}
