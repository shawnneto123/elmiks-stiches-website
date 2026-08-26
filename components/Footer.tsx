"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-14 pb-10 border-t border-neutral-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-neutral-800 w-full min-w-0">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3.5 min-w-0">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
              {BRAND.name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-light">
              High-end Ready-To-Wear (RTW) collections and custom bespoke tailoring. 
              Designed and handcrafted in Abuja, Nigeria with worldwide delivery.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-brand-accent transition"
              >
                <span>Instagram:</span>
                <span className="underline underline-offset-4">{BRAND.instagramHandle}</span>
              </a>
              <span className="text-neutral-600 hidden sm:inline">&bull;</span>
              <a
                href={`mailto:${BRAND.email}`}
                className="text-xs text-neutral-400 hover:text-white transition underline underline-offset-4"
              >
                {BRAND.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Explore
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition">
                  Customer Gallery
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-white transition">
                  Request Custom Outfit
                </Link>
              </li>
              <li>
                <Link href="/size-chart" className="hover:text-white transition">
                  Size Guide &amp; Measurements
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Visit Store &amp; Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Phone Contacts */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Studio &amp; Contact
            </h3>
            <div className="text-xs sm:text-sm text-neutral-400 space-y-2.5">
              <p className="leading-relaxed">
                {BRAND.address}
              </p>
              <div className="pt-0.5 space-y-1">
                <p className="text-[11px] font-medium text-neutral-300">Direct Inquiries:</p>
                <div className="flex flex-col gap-1">
                  {BRAND.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:${phone.tel}`}
                      className="text-xs text-neutral-300 hover:text-brand-accent transition inline-flex items-center gap-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-brand-accent"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{phone.display}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-0.5">
                <p className="text-[11px] font-medium text-neutral-300">Store Hours:</p>
                <p className="text-xs text-neutral-400">{BRAND.storeHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fine print */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 text-center sm:text-left">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Abuja, Nigeria</span>
            <span>&bull;</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
