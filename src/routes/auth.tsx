import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Stackforge Client Portal" },
      { name: "description", content: "Sign in or create an account to access your Stackforge client portal." },
      { property: "og:title", content: "Sign in — Stackforge Client Portal" },
      { property: "og:description", content: "Track projects and submit requests in the Stackforge client portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/portal" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/portal`, data: { full_name: name } },
      });
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account.");
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  };

  const field = "w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col px-6 pt-36">
        <div className="glass-panel rounded-3xl p-8">
          <h1 className="text-3xl font-bold">{mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your projects, updates and requests.</p>
          <button onClick={google} className="mt-6 w-full rounded-xl border border-border py-3 text-sm font-medium hover:bg-secondary">
            Continue with Google
          </button>
          <div className="my-5 text-center text-xs text-muted-foreground">or</div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "up" && <input className={field} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />}
            <input className={field} type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={field} type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={busy} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
              {mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
