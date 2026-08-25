import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & Craft",
  description:
    "Learn about Elmik Stitches — premier fashion house based in Abuja, Nigeria, specializing in bespoke tailoring and ready-to-wear luxury.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-20 space-y-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          About Elmik Stitches
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
          The Art of Modern Tailoring
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
          Crafting contemporary silhouettes with timeless elegance from our design studio in Abuja, Nigeria.
        </p>
      </div>

      {/* Main Story Content */}
      <div className="text-neutral-700 text-base leading-relaxed space-y-6">
        <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-200/80">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Our Vision &amp; Heritage</h2>
          <p>
            Founded with a passion for precise craftsmanship and sartorial refinement, <strong>Elmik Stitches</strong> has grown to become a cornerstone of contemporary Ready-To-Wear (RTW) fashion and bespoke tailoring in Abuja.
          </p>
          <p className="mt-3 text-neutral-600">
            We believe luxury is in the details: the drape of a silk boubou, the precision of a corset seam, and the effortless movement of a tailored two-piece set. Every collection is designed to empower women with confidence, elegance, and distinct individuality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Ready-To-Wear (RTW)</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              Curated everyday statement pieces designed for immediate elegance. Our RTW collections span structured gowns, flowing dresses, architectural tops, and chic two-piece sets made from high-grade fabrics.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Bespoke Custom Tailoring</h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              For moments when you need a custom fit. Our master tailors collaborate directly with you via WhatsApp to select premium fabrics, record detailed measurements, and craft one-of-a-kind outfits tailored to your exact physique.
            </p>
          </div>
        </div>

        {/* Pillars of Elmik Stitches */}
        <div className="pt-8 border-t border-neutral-200">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-6 text-center">Our Sartorial Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-white border border-neutral-200/80 space-y-2">
              <span className="font-serif text-lg font-bold text-brand-accent">01</span>
              <h4 className="font-semibold text-neutral-900 text-sm">Flawless Tailoring</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">Every garment is stitched with structural integrity and clean seam finishing.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-neutral-200/80 space-y-2">
              <span className="font-serif text-lg font-bold text-brand-accent">02</span>
              <h4 className="font-semibold text-neutral-900 text-sm">Curated Textiles</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">We source only breathable, long-lasting linens, silks, crepes, and satins.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-neutral-200/80 space-y-2">
              <span className="font-serif text-lg font-bold text-brand-accent">03</span>
              <h4 className="font-semibold text-neutral-900 text-sm">Global Delivery</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">From our Abuja studio to your doorstep anywhere across Nigeria and worldwide.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">Experience Elmik Stitches</h2>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto font-light">
          Explore our latest collection or start a custom tailoring consultation with our styling team.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto rounded-full bg-white text-neutral-900 px-8 py-3 text-sm font-medium hover:bg-neutral-100 transition"
          >
            Explore Catalog
          </Link>
          <Link
            href="/custom-order"
            className="w-full sm:w-auto rounded-full border border-neutral-700 text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition"
          >
            Request Custom Outfit
          </Link>
        </div>
      </div>
    </main>
  );
}
