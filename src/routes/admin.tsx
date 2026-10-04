import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectUpdates } from "@/components/ProjectUpdates";
import { useAuth } from "@/hooks/useAuth";
import type { Tables, Enums } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Stackforge Labs" },
      { name: "description", content: "Manage all client projects, statuses and progress." },
      { property: "og:title", content: "Admin Dashboard — Stackforge Labs" },
      { property: "og:description", content: "Internal project management for the Stackforge team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES: Enums<"project_status">[] = ["discovery", "design", "development", "testing", "launched", "on_hold"];

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = async () => {
    const [{ data: p }, { data: pr }] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name, company"),
    ]);
    setProjects(p ?? []);
    setProfiles(Object.fromEntries((pr ?? []).map((x) => [x.id, x.full_name || x.company || "Client"])));
  };

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);

  const update = async (id: string, patch: Partial<Tables<"projects">>) => {
    const { error } = await supabase.from("projects").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  if (!user) return <div className="min-h-screen bg-background" />;
  if (!isAdmin)
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="pt-40 text-center text-muted-foreground">You don't have admin access.</p>
      </div>
    );

  const pipeline = STATUSES.map((s) => ({ s, n: projects.filter((p) => p.status === s).length }));
  const revenue = projects.reduce((a, p) => a + Number(p.budget ?? 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <h1 className="text-4xl font-bold tracking-tight">Admin dashboard</h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Projects" value={projects.length} />
          <Stat label="Clients" value={new Set(projects.map((p) => p.client_id)).size} />
          <Stat label="New requests" value={projects.filter((p) => p.status === "discovery").length} />
          <Stat label="Pipeline value" value={`$${revenue.toLocaleString()}`} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
          {pipeline.map(({ s, n }) => (
            <div key={s} className="rounded-xl border border-border/60 p-3 text-center">
              <p className="text-xl font-bold">{n}</p>
              <p className="text-xs capitalize text-muted-foreground">{s.replace("_", " ")}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {projects.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
          {projects.map((p) => (
            <div key={p.id} className="glass-panel rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{profiles[p.client_id] ?? "Client"} · {p.service}{p.budget ? ` · $${Number(p.budget).toLocaleString()}` : ""}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select value={p.status} onChange={(e) => update(p.id, { status: e.target.value as Enums<"project_status"> })} className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                  <input type="range" min={0} max={100} step={5} value={p.progress} onChange={(e) => update(p.id, { progress: Number(e.target.value) })} className="w-28 accent-[var(--primary)]" />
                  <span className="w-10 text-sm">{p.progress}%</span>
                  <input type="date" value={p.due_date ?? ""} onChange={(e) => update(p.id, { due_date: e.target.value || null })} className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm" />
                  <button onClick={() => setOpen(open === p.id ? null : p.id)} className="text-sm text-primary">{open === p.id ? "Hide" : "Updates"}</button>
                </div>
              </div>
              {open === p.id && <ProjectUpdates projectId={p.id} userId={user.id} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
