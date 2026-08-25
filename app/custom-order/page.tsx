import { CustomOrderForm } from "@/components/CustomOrderForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Custom Outfit",
  description:
    "Submit your bespoke tailoring request to Elmik Stitches. Share your measurements, fabric preferences, and design inspiration — we'll connect via WhatsApp.",
};

export default function CustomOrderPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
          Request Custom Outfit
        </h1>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Have a bespoke design in mind? Fill out the details below and we&apos;ll begin your custom tailoring consultation via WhatsApp. Share reference images, inspiration, and exact measurements for the best result.
        </p>
      </div>

      <CustomOrderForm />
    </main>
  );
}
