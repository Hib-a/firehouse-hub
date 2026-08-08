import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Ridgemont Fire" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type StatsRow = {
  id: string;
  year: number;
  ytd_calls: number;
  structure_fires: number;
  ems_runs: number;
  rescues: number;
  avg_response_seconds: number;
};

function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

useEffect(() => {
  async function checkAdmin() {
    const { data: userData } = await supabase.auth.getUser();

    console.log("Current user ID:", userData.user?.id);

    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userData.user!.id);

    console.log("Returned roles:", data);
    console.log("Supabase error:", error);

    setIsAdmin(data?.some((r) => r.role === "admin") ?? false);
  }

  checkAdmin();
}, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Not authorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your account exists but isn't an admin. Ask another admin to grant access.</p>
        <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-md border border-input px-4 py-2 text-sm">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">Admin</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Dashboard</h1>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-secondary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <StatsEditor />
      <div className="mt-12"><NewsEditor /></div>
    </div>
  );
}

function StatsEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["run_stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("run_stats").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data as StatsRow | null;
    },
  });

  const [form, setForm] = useState<StatsRow | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save() {
    if (!form) return;
    setSaving(true);
    const { error } = await supabase
      .from("run_stats")
      .update({
        year: form.year,
        ytd_calls: form.ytd_calls,
        structure_fires: form.structure_fires,
        ems_runs: form.ems_runs,
        rescues: form.rescues,
        avg_response_seconds: form.avg_response_seconds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Stats updated");
    qc.invalidateQueries({ queryKey: ["run_stats"] });
  }

  if (isLoading || !form) return <div className="rounded-xl border border-border p-6">Loading…</div>;

  const fields: [keyof StatsRow, string][] = [
    ["year", "Year"],
    ["ytd_calls", "YTD Calls"],
    ["structure_fires", "Structure Fires"],
    ["ems_runs", "EMS Runs"],
    ["rescues", "Rescues"],
    ["avg_response_seconds", "Avg Response (seconds)"],
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl">Run Statistics</h2>
      <p className="mt-1 text-sm text-muted-foreground">Edit the numbers displayed on the homepage.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([k, label]) => (
          <label key={k} className="block">
            <span className="block text-xs font-bold tracking-wider uppercase">{label}</span>
            <input
              type="number"
              value={form[k] as number}
              onChange={(e) => setForm({ ...form, [k]: parseInt(e.target.value || "0", 10) })}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20"
            />
          </label>
        ))}
      </div>
      <button onClick={save} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ember)]/90 disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </button>
    </section>
  );
}

type Post = { id: string; title: string; excerpt: string | null; published: boolean; published_at: string };

function NewsEditor() {
  const qc = useQueryClient();
  const { data: posts } = useQuery({
    queryKey: ["news_posts_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_posts").select("id, title, excerpt, published, published_at").order("published_at", { ascending: false });
      if (error) throw error;
      return (data as Post[]) ?? [];
    },
  });

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [creating, setCreating] = useState(false);

  async function create() {
    if (!title.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("news_posts").insert({ title: title.trim(), excerpt: excerpt.trim() || null });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    setTitle(""); setExcerpt("");
    toast.success("Post created");
    qc.invalidateQueries({ queryKey: ["news_posts_admin"] });
    qc.invalidateQueries({ queryKey: ["news_posts_home"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["news_posts_admin"] });
    qc.invalidateQueries({ queryKey: ["news_posts_home"] });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl">News & Announcements</h2>
      <p className="mt-1 text-sm text-muted-foreground">Posts appear in the news section on the homepage.</p>

      <div className="mt-6 rounded-lg border border-dashed border-border p-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short excerpt"
          rows={2} className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
        <button onClick={create} disabled={creating || !title.trim()} className="mt-3 inline-flex items-center gap-2 rounded-md bg-[var(--navy-deep)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--navy)] disabled:opacity-60">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create post
        </button>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {(posts ?? []).map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="font-medium">{p.title}</div>
              {p.excerpt && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
              <div className="mt-1 text-[11px] tracking-wider text-muted-foreground uppercase">{new Date(p.published_at).toLocaleDateString()}</div>
            </div>
            <button onClick={() => remove(p.id)} className="shrink-0 rounded-md border border-input p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {(!posts || posts.length === 0) && <li className="py-8 text-center text-sm text-muted-foreground">No posts yet.</li>}
      </ul>
    </section>
  );
}
