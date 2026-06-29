import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/recruitment", label: "Recruitment" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Emergency strip */}
      <div className="bg-[var(--ember)] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 text-xs sm:text-sm">
          <span className="font-semibold tracking-wide uppercase">Emergency? Call 911 immediately</span>
          <a href="tel:5550117" className="hidden items-center gap-1.5 hover:underline sm:inline-flex">
            <Phone className="h-3.5 w-3.5" /> Non-emergency: (555) 011-7000
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background border-b border-transparent",
        )}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[var(--navy-deep)] text-white">
              <Shield className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="font-display text-sm leading-none tracking-wide uppercase sm:text-base">
                Ridgemont Fire & Rescue
              </div>
              <div className="mt-1 text-[10px] font-medium tracking-[0.15em] text-muted-foreground uppercase sm:text-xs">
                Station 7 · Est. 1923
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "rounded-md px-3 py-2 text-sm font-semibold text-foreground bg-secondary" }}
                activeOptions={{ exact: true }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/recruitment"
              className="ml-2 inline-flex items-center rounded-md bg-[var(--navy-deep)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--navy)]"
            >
              Join the Crew
            </Link>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                    activeProps={{ className: "block rounded-md px-3 py-2.5 text-sm font-semibold bg-secondary" }}
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/recruitment"
                  onClick={() => setOpen(false)}
                  className="block rounded-md bg-[var(--navy-deep)] px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Join the Crew
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
