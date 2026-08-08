import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ridgemont Fire & Rescue" },
      { name: "description", content: "Non-emergency contact for Ridgemont Fire & Rescue: phone, email, station addresses, and contact form." },
      { property: "og:title", content: "Contact Ridgemont Fire & Rescue" },
      { property: "og:description", content: "Non-emergency contact and station info." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || ""),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
    const { error } = await supabase.from("contact_submissions").insert(payload);
    setSubmitting(false);
    if (error) { toast.error("Could not send. Please try again."); return; }
    setDone(true);
    toast.success("Message sent. We'll be in touch.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <section className="bg-[var(--navy-deep)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--brass)] uppercase">Contact us</div>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Non-emergency? We're here to help.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80">
            For emergencies always dial <span className="font-semibold text-white">911</span>. For
            everything else — inspections, tours, paperwork, questions — reach us below.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <ContactCard icon={Phone} title="Phone" lines={["Non-emergency: (555) 011-7000", "Admin office: (555) 011-7100"]} />
          <ContactCard icon={Mail} title="Email" lines={["info@ridgemontfire.gov", "recruit@ridgemontfire.gov"]} />
          <ContactCard icon={MapPin} title="Stations" lines={["Station 7 · 1923 Liberty Ave", "Station 12 · 88 Oakridge Dr", "Station 5 · 410 Mill Creek Rd"]} />
          <ContactCard icon={Clock} title="Office hours" lines={["Mon–Fri · 8:00 AM – 5:00 PM", "Stations staffed 24 / 7 / 365"]} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {done ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--brass)] text-[var(--navy-deep)]">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <h2 className="mt-4 font-display text-2xl">Message sent</h2>
              <p className="mt-2 text-sm text-muted-foreground">Thanks for reaching out. We'll respond within 1 business day.</p>
              <button onClick={() => setDone(false)} className="mt-6 text-sm font-semibold text-[var(--navy)] underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Subject" name="subject" required />
              </div>
              <Field label="Message" name="message" required textarea />
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-md bg-[var(--ember)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ember)]/90 disabled:opacity-60">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Send message
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <iframe
            title="Station map"
            src="https://www.google.com/maps?q=United+States&output=embed"
            width="100%"
            height="380"
            loading="lazy"
            className="rounded-xl border border-border"
            style={{ border: 0 }}
          />
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon: Icon, title, lines }: { icon: typeof Phone; title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--navy-deep)] text-white">
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <h3 className="font-display text-base tracking-wide uppercase">{title}</h3>
      </div>
      <ul className="mt-3 space-y-1 pl-13 text-sm text-muted-foreground">
        {lines.map((l) => <li key={l}>{l}</li>)}
      </ul>
    </div>
  );
}

function Field({
  label, name, type = "text", required, textarea,
}: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-wider uppercase text-foreground/80">{label}{required && <span className="text-[var(--ember)]"> *</span>}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={5} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20" />
      ) : (
        <input name={name} type={type} required={required} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20" />
      )}
    </label>
  );
}
