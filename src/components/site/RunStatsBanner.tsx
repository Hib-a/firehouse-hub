import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flame, HeartPulse, LifeBuoy, Phone, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  year: number;
  ytd_calls: number;
  structure_fires: number;
  ems_runs: number;
  rescues: number;
  avg_response_seconds: number;
  updated_at: string;
};

function useCountUp(target: number, durationMs = 1400, start = false) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);

  return value;
}

function formatResponse(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function StatTile({
  icon: Icon, label, value, suffix, visible, format,
}: {
  icon: typeof Flame;
  label: string;
  value: number;
  suffix?: string;
  visible: boolean;
  format?: (n: number) => string;
}) {
  const animated = useCountUp(value, 1400, visible);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-center gap-2 text-[var(--ember)]">
        <Icon className="h-4 w-4" strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase">{label}</span>
      </div>
      <div className="tabular mt-3 font-display text-4xl text-foreground sm:text-5xl">
        {format ? format(animated) : animated.toLocaleString()}
        {suffix && <span className="ml-1 text-base font-medium text-muted-foreground">{suffix}</span>}
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[var(--brass)] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

export function RunStatsBanner() {
  const { data, isLoading } = useQuery({
    queryKey: ["run_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("run_stats")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Stats | null;
    },
  });

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stats = data ?? {
    year: new Date().getFullYear(),
    ytd_calls: 0, structure_fires: 0, ems_runs: 0, rescues: 0, avg_response_seconds: 0,
    updated_at: new Date().toISOString(),
  };

  return (
    <section ref={ref} className="relative border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">
              By the Numbers · {stats.year}
            </div>
            <h2 className="mt-2 text-balance text-3xl sm:text-4xl">Always running. Always ready.</h2>
          </div>
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Loading…" : `Updated ${new Date(stats.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <StatTile icon={Phone} label="YTD Calls" value={stats.ytd_calls} visible={visible} />
          <StatTile icon={Flame} label="Structure Fires" value={stats.structure_fires} visible={visible} />
          <StatTile icon={HeartPulse} label="EMS Runs" value={stats.ems_runs} visible={visible} />
          <StatTile icon={LifeBuoy} label="Rescues" value={stats.rescues} visible={visible} />
          <StatTile icon={Timer} label="Avg Response" value={stats.avg_response_seconds} visible={visible} format={formatResponse} suffix="min" />
        </div>
      </div>
    </section>
  );
}
