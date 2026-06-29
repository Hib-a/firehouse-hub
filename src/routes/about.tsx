import { createFileRoute } from "@tanstack/react-router";
import { Award, Flag, Users } from "lucide-react";
import stationImg from "@/assets/station.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Ridgemont Fire & Rescue" },
      { name: "description", content: "A century of service. Meet the leadership, history, and values of Ridgemont Fire & Rescue." },
      { property: "og:title", content: "About Ridgemont Fire & Rescue" },
      { property: "og:description", content: "A century of service to Ridgemont County." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-[var(--navy-deep)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--brass)] uppercase">About us</div>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            A century of running toward what others run from.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80">
            Founded in 1923 by volunteers from the Ridgemont Mill District, our department has grown
            into a full-time, three-station operation serving 64,000 residents across 87 square miles.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2">
        <div>
          <img src={stationImg} alt="Station 7 exterior" width={1600} height={1000} loading="lazy" className="rounded-xl object-cover shadow-lg" />
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">Our mission</div>
          <h2 className="mt-2 text-3xl sm:text-4xl">Protect life, property, and environment — every call, every time.</h2>
          <p className="mt-5 text-muted-foreground">
            We exist to serve the people of Ridgemont County with skill, integrity, and compassion.
            That mission shapes every shift, every drill, and every dollar.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { v: "1923", k: "Founded" },
              { v: "84", k: "Personnel" },
              { v: "64K", k: "Residents Served" },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-border bg-card p-4">
                <div className="font-display tabular text-3xl">{s.v}</div>
                <div className="mt-1 text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl sm:text-4xl">Our values</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Flag, t: "Courage", d: "We answer every call without hesitation, regardless of risk." },
              { icon: Users, t: "Service", d: "We belong to the community we serve — neighbors first, always." },
              { icon: Award, t: "Excellence", d: "We train hard so our worst day is still safer than yesterday." },
            ].map((v) => (
              <div key={v.t} className="rounded-xl border border-border bg-card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--navy-deep)] text-white">
                  <v.icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <h3 className="mt-5 font-display text-xl">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-3xl sm:text-4xl">Leadership</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Chief Daniel R. Hayes", role: "Fire Chief" },
            { name: "Asst. Chief Maria Ortiz", role: "Operations" },
            { name: "Batt. Chief James Cole", role: "Training" },
            { name: "Capt. Lena Whitaker", role: "EMS Director" },
          ].map((p) => (
            <div key={p.name} className="rounded-xl border border-border bg-card p-6">
              <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)]" />
              <h3 className="mt-4 font-display text-base leading-tight">{p.name}</h3>
              <div className="mt-1 text-xs font-medium tracking-wider text-[var(--ember)] uppercase">{p.role}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
