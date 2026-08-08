import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Flame, HeartPulse, LifeBuoy, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-firetruck.jpg";
import recruitImg from "@/assets/recruitment-cta.jpg";
import { RunStatsBanner } from "@/components/site/RunStatsBanner";
import { supabase } from "@/integrations/supabase/client";

const facebookPageUrl =
  import.meta.env.VITE_FACEBOOK_PAGE_URL ?? "https://www.facebook.com/facebook";
const facebookPageUrlEncoded = encodeURIComponent(facebookPageUrl);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ridgemont Fire & Rescue — Protecting Our Community 24/7" },
      {
        name: "description",
        content:
          "Ridgemont Fire & Rescue Station 7 — fire suppression, EMS, rescue, hazmat, and community education for Ridgemont County.",
      },
      { property: "og:title", content: "Ridgemont Fire & Rescue — Station 7" },
      {
        property: "og:description",
        content:
          "Serving Ridgemont County 24/7. View latest news, run statistics, and join the crew.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] text-white">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Fire crew at sunset with apparatus"
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-deep)]/95 via-[var(--navy-deep)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center px-4 py-24 sm:py-32 lg:min-h-[88vh]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ember)]" />
            Currently in service · Station 7
          </div>
          <h1 className="mt-6 text-balance font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Courage on call.
            <br />
            <span className="text-[var(--brass)]">Service in every shift.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
            Ridgemont Fire & Rescue has protected our county since 1923 — answering fires, medical
            emergencies, and rescues around the clock with a crew that trains relentlessly.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/recruitment"
              className="group inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--ember)]/30 transition-all hover:bg-[var(--ember)]/90"
            >
              Join the Crew
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
            >
              What We Do
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Statistics */}
      <div className="relative bg-[var(--navy-deep)] py-10 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-4 gap-2 md:gap-13">
            {[
              { k: "Years", v: "100+" },
              { k: "Firefighters", v: "84" },
              { k: "Apparatus", v: "12" },
              { k: "Stations", v: "3" },
            ].map((s) => (
              <div
                key={s.k}
                className="
            group
            rounded-xl md:rounded-2xl
            border border-white/40
            bg-white/15
            px-2 py-3
            md:p-6
            backdrop-blur
            transition-all duration-300
            md:hover:-translate-y-2
            md:hover:border-ember
            md:hover:bg-white/10
          "
              >
                <h3
                  className="
            font-display
            text-lg
            sm:text-xl
            md:text-4xl
            font-bold
          text-white
            leading-none
          "
                >
                  {s.v}
                </h3>

                <div
                  className="
            mt-2
            h-[2px]
            w-6
            md:w-12
            bg-[var(--ember)]
            transition-all
            duration-300
            md:group-hover:w-20
          "
                />

                <p
                  className="
            mt-2
            text-[9px]
            sm:text-[10px]
            md:text-xs
            uppercase
            tracking-[0.12em]
            md:tracking-[0.25em]
            text-white/70
            leading-tight
            text-center
            md:text-left
          "
                >
                  {s.k}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const items = [
    {
      icon: Flame,
      title: "Fire Suppression",
      desc: "Structural, wildland, and vehicle fire response with NFPA-trained crews.",
    },
    {
      icon: HeartPulse,
      title: "Emergency Medical",
      desc: "Advanced Life Support paramedics responding within minutes county-wide.",
    },
    {
      icon: LifeBuoy,
      title: "Technical Rescue",
      desc: "Vehicle extrication, water rescue, rope, and confined-space operations.",
    },
    {
      icon: ShieldCheck,
      title: "Prevention & Ed",
      desc: "Inspections, smoke-alarm programs, and school visits that save lives.",
    },
  ];
  return (
    <section className="bg-[#CC1B1B]/5">
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">
              What we do
            </div>
            <h2 className="mt-2 text-balance text-3xl sm:text-4xl">Four divisions. One mission.</h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--navy)] hover:underline"
          >
            All services <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-[var(--brass)] hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--navy-deep)] text-white">
                <it.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 font-display text-lg">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const { data: posts } = useQuery({
    queryKey: ["news_posts_home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("id, title, excerpt, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20">
        {/* --- Centered section heading --- */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">
            Latest news
          </div>
          <h2 className="mt-4 text-balance text-3xl sm:text-5xl">Straight from the station.</h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Real-time updates from our Facebook page, plus official announcements from the
            department.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:items-start">
          {/* LEFT: Facebook Feed Card */}
          <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1877F2]/40 hover:shadow-xl">
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                  <path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-foreground">
                  Ridgemont Fire Department
                </p>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  Official Facebook Page
                </p>
              </div>
            </div>

            <div className="relative mx-4 mb-2 h-[420px] overflow-hidden rounded-xl border border-border/60 bg-white md:h-[620px]">
              <div aria-hidden className="absolute inset-0 flex flex-col gap-3 p-4">
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="flex-1 animate-pulse rounded-lg bg-muted" />
              </div>

              <iframe
                title="Ridgemont Fire Facebook Feed"
                src={`https://www.facebook.com/plugins/page.php?href=${facebookPageUrlEncoded}&tabs=timeline&width=500&height=420&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height="420"
                className="absolute inset-0 h-full w-full bg-white md:hidden"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                allow="encrypted-media"
                loading="lazy"
              />

              <iframe
                title="Ridgemont Fire Facebook Feed"
                src={`https://www.facebook.com/plugins/page.php?href=${facebookPageUrlEncoded}&tabs=timeline&width=500&height=620&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="100%"
                height="620"
                className="absolute inset-0 hidden h-full w-full bg-white md:block"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                allow="encrypted-media"
                loading="lazy"
              />
            </div>

            <div className="px-5 pb-5 pt-3">
              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1464cc]"
              >
                View Full Page on Facebook
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>

          {/* RIGHT: Department news list */}
          <div className="space-y-4">
            <ul className="space-y-4">
              {(posts ?? []).map((p, i) => (
                <li
                  key={p.id}
                  className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-[var(--brass)]"
                >
                  <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.18em] text-[var(--ember)] uppercase">
                    <span>#{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px flex-1 bg-border" />
                    <time>
                      {new Date(p.published_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug transition-colors group-hover:text-[var(--navy)]">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                  )}
                </li>
              ))}

              {(!posts || posts.length === 0) && (
                <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No announcements yet — check back soon.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecruitmentCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] text-white">
      <div className="absolute inset-0">
        <img
          src={recruitImg}
          alt="Firefighters at station"
          width={1600}
          height={1000}
          loading="lazy"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)] via-[var(--navy-deep)]/85 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--brass)] uppercase">
            Now hiring
          </div>
          <h2 className="mt-3 text-balance font-display text-4xl leading-tight sm:text-5xl">
            Answer the call.
            <br />
            <span className="text-white/70">Build a career that matters.</span>
          </h2>
          <p className="mt-5 max-w-xl text-white/80">
            We're hiring entry-level firefighters and paramedics for the 2026 academy. Competitive
            pay, full benefits, and the best crew you'll ever work with.
          </p>
          <Link
            to="/recruitment"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-6 py-3 text-sm font-semibold shadow-lg shadow-black/30 transition-all hover:bg-[var(--ember)]/90"
          >
            Start your application <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <RunStatsBanner />
      <ServicesPreview />
      <NewsSection />
      <RecruitmentCTA />
    </>
  );
}
