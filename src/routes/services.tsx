import { createFileRoute } from "@tanstack/react-router";
import { Activity, Flame, GraduationCap, HardHat, HeartPulse, LifeBuoy, ShieldCheck, Wind } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Ridgemont Fire & Rescue" },
      { name: "description", content: "Fire suppression, EMS, technical rescue, hazmat, prevention, and community education." },
      { property: "og:title", content: "Services — Ridgemont Fire & Rescue" },
      { property: "og:description", content: "Eight core services for Ridgemont County." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const services = [
  { icon: Flame, title: "Fire Suppression", desc: "Structural, wildland, and vehicle fire response with NFPA 1500 compliant operations." },
  { icon: HeartPulse, title: "Emergency Medical Services", desc: "ALS paramedic units with 24/7 coverage and a 4-minute county-wide response goal." },
  { icon: LifeBuoy, title: "Technical Rescue", desc: "Vehicle extrication, swift-water, rope, trench, and confined-space rescue capability." },
  { icon: Wind, title: "Hazardous Materials", desc: "Certified Hazmat Technicians handling chemical, biological, and radiological incidents." },
  { icon: ShieldCheck, title: "Fire Prevention", desc: "Code enforcement, plan review, and fire investigation for new and existing structures." },
  { icon: HardHat, title: "Building Inspections", desc: "Commercial and multifamily inspections to keep occupants safe and code-compliant." },
  { icon: GraduationCap, title: "Community Education", desc: "School visits, CPR classes, smoke-alarm programs, and station tours by appointment." },
  { icon: Activity, title: "Special Operations", desc: "Drone-assisted search, water-supply tankers, and mutual-aid response across the region." },
];

function Services() {
  return (
    <>
      <section className="bg-[var(--navy-deep)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--brass)] uppercase">Services</div>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Eight core services. One promise: we'll be there.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80">
            From a kitchen fire to a multi-vehicle highway rescue, our crews are equipped, trained,
            and ready 24 hours a day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <article key={s.title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-[var(--brass)] hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--navy-deep)] text-white">
                <s.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h2 className="mt-5 font-display text-lg leading-tight">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="rounded-2xl bg-[var(--navy-deep)] p-10 text-white sm:p-14">
            <h2 className="text-balance text-3xl sm:text-4xl">Need a station tour or smoke-alarm install?</h2>
            <p className="mt-4 max-w-2xl text-white/80">
              Community education and home safety visits are free for Ridgemont County residents.
              Reach out and we'll set it up.
            </p>
            <a href="/contact" className="mt-8 inline-flex rounded-md bg-[var(--ember)] px-5 py-3 text-sm font-semibold hover:bg-[var(--ember)]/90">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
