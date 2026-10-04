import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectUpdates } from "@/components/ProjectUpdates";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — Stackforge Labs" },
      { name: "description", content: "Track your Stackforge projects, progress and updates in one place." },
      { property: "og:title", content: "Client Portal — Stackforge Labs" },
      { property: "og:description", content: "Your projects, progress and team updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortalPage,
});

export const SERVICES = ["Web App", "Mobile App", "AI Automation", "Cloud & DevOps", "Data & Analytics", "Security", "Integration", "Design"];
export const statusLabel: Record<string, string> = {
  discovery: "Discovery", design: "Design", development: "Development", testing: "Testing", launched: "Launched", on_hold: "On hold",
};

function PortalPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", service: SERVICES[0]!, budget: "" });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = () =>
    user &&
    supabase.from("projects").select("*").eq("client_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data ?? []));

  useEffect(() => { void load(); }, [user]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("projects").insert({
      client_id: user.id, name: form.name, description: form.description, service: form.service,
      budget: form.budget ? Number(form.budget) : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Project request submitted");
    setForm({ name: "", description: "", service: SERVICES[0]!, budget: "" });
    setShowNew(false);
    load();
  };

  if (!user) return <div className="min-h-screen bg-background" />;
  const field = "w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <h1 className="text-4xl font-bold tracking-tight">Your projects</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNew((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              <Plus className="size-4" /> New request
            </button>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Total", projects.length],
            ["Active", projects.filter((p) => !["launched", "on_hold"].includes(p.status)).length],
            ["Launched", projects.filter((p) => p.status === "launched").length],
            ["Avg. progress", projects.length ? Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) + "%" : "—"],
          ].map(([l, v]) => (
            <div key={l as string} className="glass-panel rounded-2xl p-5">
              <p className="text-3xl font-bold text-primary">{v}</p>
              <p className="text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        {showNew && (
          <form onSubmit={create} className="glass-panel mt-8 grid gap-3 rounded-2xl p-6 md:grid-cols-2">
            <input required className={field} placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className={field} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <textarea className={`${field} md:col-span-2`} rows={3} placeholder="What do you want to build?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="number" className={field} placeholder="Estimated budget (USD, optional)" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <button className="rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground">Submit request</button>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No projects yet — submit your first request.
            </div>
          )}
          {projects.map((p) => (
            <div key={p.id} className="glass-panel rounded-2xl p-6">
              <button className="w-full text-left" onClick={() => setOpen(open === p.id ? null : p.id)}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{p.name}</h2>
                    <p className="text-sm text-muted-foreground">{p.service}{p.due_date ? ` · Due ${p.due_date}` : ""}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{statusLabel[p.status]}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.progress}% complete</p>
              </button>
              {open === p.id && (
                <>
                  {p.description && <p className="mt-4 text-sm text-muted-foreground">{p.description}</p>}
                  <ProjectUpdates projectId={p.id} userId={user.id} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
