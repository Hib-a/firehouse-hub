import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Age helper: today minus N years as YYYY-MM-DD
function yearsAgoISO(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

const MAX_DOB = yearsAgoISO(18); // must be at least 18
const MIN_DOB = yearsAgoISO(70); // reasonable upper bound

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long")
    .regex(/^[A-Za-zÀ-ÿ' -]+$/, "Letters, spaces, hyphens and apostrophes only"),
  email: z.string().trim().email("Enter a valid email address").max(120, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+\-()\s]+$/, "Digits, spaces and + - ( ) only")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Enter a valid phone number"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => v <= MAX_DOB, "You must be at least 18 years old")
    .refine((v) => v >= MIN_DOB, "Please enter a valid date of birth"),
  certifications: z.string().trim().max(500, "Keep this under 500 characters").optional().or(z.literal("")),
  experience: z.string().trim().max(1000, "Keep this under 1000 characters").optional().or(z.literal("")),
  why_join: z
    .string()
    .trim()
    .min(30, "Please write at least 30 characters")
    .max(1000, "Keep this under 1000 characters"),
});

type FormValues = z.infer<typeof schema>;

function Recruitment() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const whyLen = (watch("why_join") ?? "").length;
  const expLen = (watch("experience") ?? "").length;

  async function onSubmit(values: FormValues) {
    const payload = {
      full_name: values.full_name,
      email: values.email.toLowerCase(),
      phone: values.phone.replace(/\s+/g, " ").trim(),
      date_of_birth: values.dob,
      certifications: values.certifications || "",
      experience: values.experience || "",
      why_join: values.why_join,
    };
    const { error } = await supabase.from("recruitment_applications").insert(payload);
    if (error) {
      toast.error("Could not submit. Please try again in a moment.");
      return;
    }
    setDone(true);
    toast.success("Application received. We'll reach out within 5 business days.");
    reset();
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldWrap label="Full name" required error={errors.full_name?.message}>
                <input
                  {...register("full_name")}
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  aria-invalid={!!errors.full_name}
                  className={inputCls(!!errors.full_name)}
                />
              </FieldWrap>

              <FieldWrap label="Email" required error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={120}
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
              </FieldWrap>

              <FieldWrap label="Phone" required error={errors.phone?.message} hint="Digits, spaces and + - ( ) only">
                <input
                  {...register("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  pattern="[0-9+\-()\s]{8,20}"
                  placeholder="+1 (555) 123-4567"
                  aria-invalid={!!errors.phone}
                  className={inputCls(!!errors.phone)}
                />
              </FieldWrap>

              <FieldWrap label="Date of birth" required error={errors.dob?.message} hint="Must be 18 or older">
                <input
                  {...register("dob")}
                  type="date"
                  min={MIN_DOB}
                  max={MAX_DOB}
                  aria-invalid={!!errors.dob}
                  className={inputCls(!!errors.dob)}
                />
              </FieldWrap>
            </div>

            <FieldWrap
              label="Certifications"
              error={errors.certifications?.message}
              hint="Type your certifications and years, e.g. “EMT-B (2024), CPR/AED (2025)”. Bring originals to the interview — do not upload files."
            >
              <textarea
                {...register("certifications")}
                rows={3}
                maxLength={500}
                aria-invalid={!!errors.certifications}
                className={inputCls(!!errors.certifications)}
              />
            </FieldWrap>

            <FieldWrap
              label="Relevant experience"
              error={errors.experience?.message}
              hint={`${expLen}/1000`}
            >
              <textarea
                {...register("experience")}
                rows={4}
                maxLength={1000}
                aria-invalid={!!errors.experience}
                className={inputCls(!!errors.experience)}
              />
            </FieldWrap>

            <FieldWrap
              label="Why do you want to join?"
              required
              error={errors.why_join?.message}
              hint={`${whyLen}/1000 — minimum 30 characters`}
            >
              <textarea
                {...register("why_join")}
                rows={5}
                maxLength={1000}
                aria-invalid={!!errors.why_join}
                className={inputCls(!!errors.why_join)}
              />
            </FieldWrap>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ember)]/90 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit application
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function inputCls(hasError: boolean) {
  return [
    "mt-2 w-full rounded-md border bg-card px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2",
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-input focus:border-[var(--navy)] focus:ring-[var(--navy)]/20",
  ].join(" ");
}

function FieldWrap({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase text-foreground/80">
        {label}
        {required && <span className="text-[var(--ember)]"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
