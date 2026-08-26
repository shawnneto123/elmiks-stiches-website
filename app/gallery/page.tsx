import { createClient } from "@/lib/supabase/server";
import { GalleryImage } from "@/lib/types";
import { GalleryMasonry } from "@/components/GalleryMasonry";
import { BRAND } from "@/lib/constants";
import Link from "next/link";

export const metadata = {
  title: "Customer Gallery",
  description:
    "Explore our customer gallery featuring real clients, muses, and style moments wearing Elmik Stitches ready-to-wear and bespoke designs.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryImages, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const images: GalleryImage[] = galleryImages || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-20 space-y-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          Client Style &amp; Moments
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
          The Elmik Gallery
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
          Real clients, bespoke fittings, and statement occasions. See how our pieces come to life in the everyday world and celebrations across the globe.
        </p>
      </div>

      {/* Main Content: Masonry or Empty State */}
      {images.length > 0 ? (
        <GalleryMasonry images={images} />
      ) : (
        <div className="py-20 px-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              No Gallery Photos Yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              We are preparing our latest client showcase. Tag us on Instagram{" "}
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 font-semibold underline underline-offset-2 hover:text-brand-accent transition"
              >
                {BRAND.instagramHandle}
              </a>{" "}
              to be featured!
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-semibold transition"
            >
              Explore Collections
            </Link>
            <Link
              href="/custom-order"
              className="rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 px-6 py-2.5 text-xs font-semibold transition"
            >
              Request Custom Fit
            </Link>
          </div>
        </div>
      )}

      {/* Instagram UGC Social Callout */}
      <div className="rounded-2xl bg-neutral-900 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left max-w-lg">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
            Join the Elmik Muses
          </span>
          <h3 className="font-serif text-2xl font-bold">Wearing Elmik Stitches?</h3>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Tag us in your photos or send us your fittings on Instagram to be featured on our official gallery and social media.
          </p>
        </div>
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white text-neutral-900 px-8 py-3.5 text-xs font-medium hover:bg-neutral-100 transition whitespace-nowrap shadow-sm"
        >
          Follow {BRAND.instagramHandle}
        </a>
      </div>
    </main>
  );
}
