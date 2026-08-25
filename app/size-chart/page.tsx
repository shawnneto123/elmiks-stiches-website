import Link from "next/link";
import { SizeChartTable } from "@/components/SizeChartTable";

export const metadata = {
  title: "Size Guide & Body Measurements | Elmik Stitches",
  description:
    "Explore the Elmik Stitches sizing guide and measurement conversions to find your ideal fit for Ready-To-Wear gowns, dresses, and sets.",
};

export default function SizeChartPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-20 space-y-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Fitting &amp; Sizing
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
          Size Guide &amp; Measurements
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
          Use our comprehensive measurement chart below to select your standard Ready-To-Wear size, or consult our measuring guidelines for custom orders.
        </p>
      </div>

      {/* Main Table Component */}
      <div className="bg-neutral-50/70 p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-sm space-y-6">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
            Standard Size Matrix
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Toggle between Inches (&quot;) and Centimeters (cm).
          </p>
        </div>

        <SizeChartTable />
      </div>

      {/* How to Measure Guidelines */}
      <div className="space-y-6 pt-4">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 text-center sm:text-left">
          How to Measure Your Body
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white border border-neutral-200/70 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900 text-lg">01.</span>
              <h3 className="font-semibold text-neutral-900 text-sm">Bust / Chest</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Measure around the fullest part of your bust, keeping the measuring tape comfortably level under your arms and across your shoulder blades.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-neutral-200/70 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900 text-lg">02.</span>
              <h3 className="font-semibold text-neutral-900 text-sm">Natural Waist</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Measure around your natural waistline (the narrowest part of your torso, typically 1–2 inches above your belly button).
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-neutral-200/70 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900 text-lg">03.</span>
              <h3 className="font-semibold text-neutral-900 text-sm">Hips</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Stand with feet together and measure around the fullest part of your hips and buttocks, ensuring the tape remains horizontal.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-neutral-200/70 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-neutral-900 text-lg">04.</span>
              <h3 className="font-semibold text-neutral-900 text-sm">Dress / Garment Length</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Measure vertically from the highest point of your shoulder down over your bust to your desired hemline (knee, midi, or floor length).
            </p>
          </div>
        </div>
      </div>

      {/* Bespoke Tailoring Callout */}
      <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left max-w-lg">
          <h3 className="font-serif text-2xl font-bold">Between Sizes or Need Custom Fit?</h3>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            Our atelier specializes in tailored bespoke pieces. Submit your unique dimensions and we will craft the garment to fit your silhouette flawlessly.
          </p>
        </div>
        <Link
          href="/custom-order"
          className="rounded-full bg-white text-neutral-900 px-8 py-3.5 text-xs font-medium hover:bg-neutral-100 transition whitespace-nowrap"
        >
          Request Custom Order
        </Link>
      </div>
    </main>
  );
}
