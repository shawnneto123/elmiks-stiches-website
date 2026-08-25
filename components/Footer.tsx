"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, CATEGORIES } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              {BRAND.name}
            </h2>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              High-end Ready-To-Wear (RTW) collections and custom bespoke tailoring. 
              Designed and handcrafted in Abuja, Nigeria with worldwide delivery.
            </p>
            <div className="pt-2">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-white hover:text-neutral-300 transition"
              >
                <span>Follow on Instagram:</span>
                <span className="underline underline-offset-4">{BRAND.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-white transition">
                  Request Custom Outfit
                </Link>
              </li>
              <li>
                <Link href="/size-chart" className="hover:text-white transition">
                  Size Guide & Measurements
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story & Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Visit Store & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Hours */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Studio & Store
            </h3>
            <div className="text-sm text-neutral-400 space-y-2">
              <p className="leading-relaxed">
                {BRAND.address}
              </p>
              <div className="pt-1">
                <p className="text-xs font-medium text-neutral-300">Store Hours:</p>
                <p className="text-xs text-neutral-400">{BRAND.storeHours}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-300">Online Inquiries:</p>
                <p className="text-xs text-neutral-400">24/7 Availability via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fine print */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Abuja, Nigeria</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
