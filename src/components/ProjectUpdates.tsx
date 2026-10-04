import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Update = { id: string; message: string; created_at: string; author_id: string };

export function ProjectUpdates({ projectId, userId }: { projectId: string; userId: string }) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [msg, setMsg] = useState("");

  const load = () =>
    supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at")
      .then(({ data }) => setUpdates(data ?? []));

  useEffect(() => {
    void load();
  }, [projectId]);

  const post = async () => {
    if (!msg.trim()) return;
    const { error } = await supabase.from("project_updates").insert({ project_id: projectId, author_id: userId, message: msg.trim() });
    if (error) { toast.error(error.message); return; }
    setMsg("");
    load();
  };

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Updates</p>
      <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
        {updates.length === 0 && <p className="text-sm text-muted-foreground">No updates yet.</p>}
        {updates.map((u) => (
          <div key={u.id} className="rounded-lg bg-secondary px-3 py-2 text-sm">
            <p>{u.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {u.author_id === userId ? "You" : "Stackforge"} · {new Date(u.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder="Write an update…"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        <button onClick={post} className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Post</button>
      </div>
    </div>
  );
}
