import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Shield, Twitter } from "lucide-react";

const facebookPageUrl =
  import.meta.env.VITE_FACEBOOK_PAGE_URL ?? "https://www.facebook.com/facebook";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--navy-deep)] text-white/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-white/10">
              <Shield className="h-5 w-5" />
            </div>
            <div className="font-display tracking-wide uppercase">Ridgemont Fire</div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Protecting Ridgemont County since 1923. Courage, integrity, service.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] text-[var(--brass)] uppercase">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-white/80 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-white/80 hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link to="/recruitment" className="text-white/80 hover:text-white">
                Recruitment
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white/80 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] text-[var(--brass)] uppercase">
            Station 7
          </h4>
          <address className="mt-4 space-y-2 text-sm text-white/80 not-italic">
            <div>1923 Liberty Avenue</div>
            <div>Ridgemont, RG 04108</div>
            <div className="pt-2">
              <a href="tel:5550117000" className="hover:text-white">
                (555) 011-7000
              </a>
            </div>
            <div>
              <a href="mailto:info@ridgemontfire.gov" className="hover:text-white">
                info@ridgemontfire.gov
              </a>
            </div>
          </address>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.15em] text-[var(--brass)] uppercase">
            Emergency
          </h4>
          <div className="mt-4 rounded-md border border-white/15 bg-white/5 p-4">
            <div className="text-xs text-white/60 uppercase">Life-threatening</div>
            <div className="mt-1 font-display text-3xl">911</div>
            <div className="mt-3 text-xs text-white/60">Available 24 / 7 / 365</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Ridgemont Fire & Rescue. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="hover:text-white">
              Staff Login
            </Link>
            <span>·</span>
            <span>An equal opportunity employer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
