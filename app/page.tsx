import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatNaira } from "@/lib/utils/currency";
import { BRAND, CATEGORIES } from "@/lib/constants";
import { Product } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch latest 8 in-stock products for featured section
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const featuredProducts: Product[] = (products as Product[]) ?? [];
  const heroProduct = featuredProducts[0] ?? null;
  const gridProducts = featuredProducts.slice(1, 5);

  return (
    <main className="flex-1">
      {/* 1. Hero Section */}
      <section className="relative bg-neutral-50/80 border-b border-neutral-100 py-16 sm:py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-500">
            Abuja Atelier &bull; Worldwide Delivery
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
            Contemporary Elegance, <br className="hidden sm:inline" />
            Tailored to Perfection.
          </h1>

          <p className="text-neutral-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Discover exquisite Ready-To-Wear collections and bespoke tailoring crafted for modern silhouettes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto rounded-full bg-neutral-900 text-white px-8 py-3.5 text-sm font-medium hover:bg-neutral-800 transition shadow-sm text-center"
            >
              Shop Collection
            </Link>
            <Link
              href="/custom-order"
              className="w-full sm:w-auto rounded-full bg-white text-neutral-900 border border-neutral-300 px-8 py-3.5 text-sm font-medium hover:bg-neutral-50 transition text-center"
            >
              Request Custom Outfit
            </Link>
          </div>

          {/* Quick Category Chips */}
          <div className="pt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none touch-pan-x pb-2">
            <span className="text-xs text-neutral-400 font-medium mr-1 flex-shrink-0">Quick Browse:</span>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <Link
                key={cat}
                href={`/shop/${encodeURIComponent(cat.toLowerCase())}`}
                className="flex-shrink-0 min-h-[44px] px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-neutral-200 transition text-xs font-medium flex items-center justify-center active:scale-95 shadow-2xs"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Collection — Bento Layout (PRD Section 4.1) */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Curated Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mt-1">
              Featured New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-neutral-900 hover:text-neutral-600 underline underline-offset-4"
          >
            View All Pieces →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-neutral-400 text-sm">
              New pieces coming soon — check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Main Hero Bento Cell (Spans 2 cols & 2 rows on large screens) */}
            {heroProduct && (
              <div className="col-span-2 lg:col-span-2 lg:row-span-2 group flex flex-col">
                <Link
                  href={`/product/${heroProduct.id}`}
                  className="relative aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-neutral-100 flex flex-col justify-end p-6 md:p-8 transition"
                >
                  {heroProduct.image_url ? (
                    <Image
                      src={heroProduct.image_url}
                      alt={heroProduct.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-200/60 flex items-center justify-center text-neutral-400 text-sm font-serif italic">
                      [ {heroProduct.title} ]
                    </div>
                  )}
                  <div className="relative z-10 bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-neutral-200/60 shadow-sm space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                      Featured Statement Piece
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition">
                      {heroProduct.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-normal">
                      {formatNaira(heroProduct.price)}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Standard Grid Cells */}
            {gridProducts.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <Link href={`/product/${product.id}`} className="block">
                  {/* 3:4 borderless, shadowless card on neutral-100 per PRD Section 4.1 */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-3">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 text-center p-4">
                        <span>[ {product.title} ]</span>
                      </div>
                    )}
                    {!product.in_stock && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900/90 text-white backdrop-blur-sm">
                        Restock Soon
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-normal">
                      {formatNaira(product.price)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Bespoke Custom Tailoring Spotlight */}
      <section className="bg-neutral-900 text-white py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold-light">
              Bespoke Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Have a Specific Vision in Mind?
            </h2>
            <p className="text-neutral-300 text-base leading-relaxed max-w-xl font-light">
              Beyond our ready-to-wear collections, our master tailors in Abuja craft one-of-a-kind bespoke garments for weddings, formal galas, and special milestones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-800">
              <div>
                <span className="text-lg font-serif font-bold text-brand-gold-light">01</span>
                <h4 className="text-sm font-semibold text-neutral-200 mt-1">Submit Details</h4>
                <p className="text-xs text-neutral-400 mt-1">Share your measurements and inspiration notes.</p>
              </div>
              <div>
                <span className="text-lg font-serif font-bold text-brand-gold-light">02</span>
                <h4 className="text-sm font-semibold text-neutral-200 mt-1">Consult on WhatsApp</h4>
                <p className="text-xs text-neutral-400 mt-1">Refine fabrics and styling with our team.</p>
              </div>
              <div>
                <span className="text-lg font-serif font-bold text-brand-gold-light">03</span>
                <h4 className="text-sm font-semibold text-neutral-200 mt-1">Tailored &amp; Delivered</h4>
                <p className="text-xs text-neutral-400 mt-1">Precision cut and shipped worldwide.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/custom-order"
                className="inline-block rounded-full bg-white text-neutral-900 px-8 py-3.5 text-sm font-medium hover:bg-neutral-100 transition shadow-sm"
              >
                Start Custom Request
              </Link>
            </div>
          </div>

          <div className="bg-neutral-800/80 rounded-2xl p-8 sm:p-10 border border-neutral-700/80 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">The Elmik Stitches Promise</h3>
            <ul className="space-y-4 text-sm text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-base leading-none mt-0.5">&bull;</span>
                <span><strong>Exact Silhouette Fitting:</strong> Precision tailored to your body dimensions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-base leading-none mt-0.5">&bull;</span>
                <span><strong>Premium Fabrics:</strong> Sourced high-grade silks, brocades, linens, and velvets.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-accent text-base leading-none mt-0.5">&bull;</span>
                <span><strong>Worldwide Shipping:</strong> Safe domestic &amp; international door-to-door delivery.</span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-neutral-400">
              Store Studio: {BRAND.address}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Heritage / Visit Store Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          Visit Our Abuja Studio
        </h2>
        <p className="text-neutral-600 text-sm max-w-xl mx-auto">
          Experience our garments in person at our physical store in Jabi, Abuja. Open Monday to Saturday, 9:00 AM – 5:30 PM.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-neutral-600 underline underline-offset-4"
          >
            View Map &amp; Store Information →
          </Link>
        </div>
      </section>
    </main>
  );
}
