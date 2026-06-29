import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import recruitImg from "@/assets/recruitment-cta.jpg";

export const Route = createFileRoute("/recruitment")({
  head: () => ({
    meta: [
      { title: "Recruitment — Join Ridgemont Fire & Rescue" },
      { name: "description", content: "Become a firefighter or paramedic with Ridgemont Fire & Rescue. Requirements, benefits, and online application." },
      { property: "og:title", content: "Join Ridgemont Fire & Rescue" },
      { property: "og:description", content: "Now hiring for the 2026 academy class." },
      { property: "og:url", content: "/recruitment" },
    ],
    links: [{ rel: "canonical", href: "/recruitment" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "Entry-Level Firefighter / Paramedic",
        description: "Join the 2026 Ridgemont Fire Academy class.",
        hiringOrganization: { "@type": "Organization", name: "Ridgemont Fire & Rescue" },
        employmentType: "FULL_TIME",
      }),
    }],
  }),
  component: Recruitment,
});

const requirements = [
  "Age 18 or older",
  "High school diploma or GED",
  "Valid driver's license",
  "U.S. citizen or legal authorization to work",
  "Pass CPAT physical and written exam",
  "EMT-B certification (or willing to obtain in academy)",
];

const benefits = [
  "Competitive starting salary $58k + overtime",
  "Full medical, dental, vision",
  "Pension after 5 years",
  "Paid academy training (16 weeks)",
  "Tuition reimbursement up to $5k/yr",
  "48/96 schedule with consecutive days off",
];

const steps = [
  { n: "01", t: "Apply Online", d: "Submit the form below — takes 5 minutes." },
  { n: "02", t: "Written Exam", d: "Standard cognitive and situational judgment test." },
  { n: "03", t: "CPAT", d: "Candidate Physical Ability Test — timed obstacle course." },
  { n: "04", t: "Interview Panel", d: "Meet with chief officers and crew representatives." },
  { n: "05", t: "Background & Medical", d: "Background check, polygraph, and medical exam." },
  { n: "06", t: "Academy", d: "16-week paid recruit academy starting January." },
];

function Recruitment() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      date_of_birth: (fd.get("dob") as string) || null,
      certifications: String(fd.get("certifications") || ""),
      experience: String(fd.get("experience") || ""),
      why_join: String(fd.get("why_join") || ""),
    };
    const { error } = await supabase.from("recruitment_applications").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Check your details and try again.");
      return;
    }
    setDone(true);
    toast.success("Application received. We'll reach out within 5 business days.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] text-white">
        <div className="absolute inset-0">
          <img src={recruitImg} alt="" width={1600} height={1000} loading="eager" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)] via-[var(--navy-deep)]/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--brass)] uppercase">Now hiring</div>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Build a career you can stand behind.
          </h1>
          <p className="mt-6 max-w-xl text-white/80">
            Applications are open for the 2026 Ridgemont Fire Academy class. We're looking for
            disciplined, community-minded people who want to serve.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2">
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">Requirements</div>
          <h2 className="mt-2 text-3xl sm:text-4xl">What you need to apply</h2>
          <ul className="mt-6 space-y-3">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brass)]/20 text-[var(--ember)]"><Check className="h-3 w-3" strokeWidth={3} /></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">Benefits</div>
          <h2 className="mt-2 text-3xl sm:text-4xl">What you get</h2>
          <ul className="mt-6 space-y-3">
            {benefits.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brass)]/20 text-[var(--ember)]"><Check className="h-3 w-3" strokeWidth={3} /></span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <h2 className="text-3xl sm:text-4xl">The hiring process</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-xl border border-border bg-card p-6">
                <div className="font-display tabular text-3xl text-[var(--ember)]">{s.n}</div>
                <h3 className="mt-3 font-display text-lg">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="mx-auto max-w-3xl px-4 py-20">
        <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--ember)] uppercase">Application</div>
        <h2 className="mt-2 text-3xl sm:text-4xl">Start your application</h2>
        <p className="mt-3 text-muted-foreground">No commitments — we'll be in touch within 5 business days.</p>

        {done ? (
          <div className="mt-10 rounded-xl border border-[var(--brass)] bg-[var(--brass)]/10 p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--brass)] text-[var(--navy-deep)]">
              <Check className="h-6 w-6" strokeWidth={3} />
            </div>
            <h3 className="mt-4 font-display text-2xl">Application received</h3>
            <p className="mt-2 text-sm text-muted-foreground">Watch your inbox — we'll be in touch soon.</p>
            <button onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-[var(--navy)] underline">Submit another</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="full_name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <Field label="Date of birth" name="dob" type="date" />
            </div>
            <Field label="Certifications (EMT, CPR, etc.)" name="certifications" />
            <Field label="Relevant experience" name="experience" textarea />
            <Field label="Why do you want to join?" name="why_join" textarea />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ember)]/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit application
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function Field({
  label, name, type = "text", required, textarea,
}: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase text-foreground/80">{label}{required && <span className="text-[var(--ember)]"> *</span>}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={4} className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm shadow-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20" />
      ) : (
        <input name={name} type={type} required={required} className="mt-2 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm shadow-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20" />
      )}
    </label>
  );
}
