"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";

const NAV_LINKS = [
  { name: "Shop", href: "/shop" },
  { name: "Gallery", href: "/gallery" },
  { name: "Custom Order", href: "/custom-order" },
  { name: "Size Guide", href: "/size-chart" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when mobile full-screen drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Don't render public storefront header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-10 md:h-20">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none py-1"
            aria-label="Elmik Stitches Home"
          >
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-md overflow-hidden bg-black flex-shrink-0 group-hover:opacity-95 transition-opacity">
              <Image
                src="/logo.png"
                alt="Elmik Stitches Logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors py-2 ${
                    isActive
                      ? "text-neutral-900 font-semibold border-b-2 border-brand-accent pb-0.5"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Header Action */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/custom-order"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 text-white px-5 py-2.5 text-xs font-semibold hover:bg-neutral-800 transition shadow-xs active:scale-95"
            >
              Custom Order
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button (Min 44x44px touch target) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-neutral-900 hover:bg-neutral-100 active:scale-95 transition-all focus:outline-none flex items-center justify-center"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Drawer (fixed inset-0 z-50 bg-white) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-white md:hidden flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Elmik Stitches Home"
            >
              <div className="relative h-8 w-8 rounded-md overflow-hidden bg-black flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Elmik Stitches Logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-neutral-900">
                {BRAND.name}
              </span>
            </Link>

            {/* Close ("X") Button (Min 44x44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition focus:outline-none flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Stacked Navigation Links with generous min 48px touch targets */}
          <div className="px-6 py-6 flex-1 flex flex-col justify-start">
            <nav className="flex flex-col" aria-label="Mobile Drawer Navigation">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[48px] py-3.5 text-lg font-medium border-b border-neutral-100 flex items-center justify-between transition-colors ${
                      isActive
                        ? "text-brand-accent font-semibold"
                        : "text-neutral-800 hover:text-neutral-900"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`text-sm ${
                        isActive ? "text-brand-accent" : "text-neutral-300"
                      }`}
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Drawer Bottom Actions & Information */}
          <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-4">
            <Link
              href="/custom-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[48px] flex items-center justify-center rounded-full bg-neutral-900 text-white py-3.5 text-sm font-semibold hover:bg-neutral-800 transition active:scale-98 shadow-sm text-center"
            >
              Request Custom Outfit
            </Link>

            <div className="pt-2 text-xs text-neutral-500 space-y-1 text-center font-light">
              <p>Abuja Studio &bull; {BRAND.storeHours}</p>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-neutral-700 hover:text-neutral-900 underline underline-offset-2 mt-1"
              >
                Instagram: {BRAND.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
