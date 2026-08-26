import { BRAND } from "@/lib/constants";
import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";

export const metadata = {
  title: "Contact & Store Location",
  description:
    "Visit the Elmik Stitches store at Efab City Estate, Jabi, Abuja or contact our styling team on WhatsApp for orders and bespoke tailoring.",
};

export default function ContactPage() {
  const primaryPhone = BRAND.phones[0];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-20 space-y-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
          Visit Our Studio &amp; Contact Us
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
          We welcome you to visit our physical showroom in Abuja or reach out directly via WhatsApp for orders, custom tailoring inquiries, and worldwide delivery support.
        </p>
      </div>

      {/* Grid: Details on Left, Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact & Location Cards */}
        <div className="space-y-6">
          {/* Physical Address Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-1">
                Physical Location
              </span>
              <h2 className="font-serif text-xl font-bold text-neutral-900">Showroom Address</h2>
            </div>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {BRAND.address}
            </p>
            <p className="text-xs text-neutral-400">
              Convenient parking available on-site.
            </p>
          </div>

          {/* Operating Hours Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-1">
                Store Schedule
              </span>
              <h2 className="font-serif text-xl font-bold text-neutral-900">Hours of Operation</h2>
            </div>
            <div className="space-y-2 text-sm text-neutral-700 divide-y divide-neutral-100">
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-neutral-900">Physical Store:</span>
                <span>{BRAND.storeHours}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-neutral-900">Online &amp; WhatsApp:</span>
                <span className="text-neutral-900 font-medium">{BRAND.onlineHours}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium text-neutral-900">Sunday:</span>
                <span className="text-neutral-500">Store Closed (Online orders open)</span>
              </div>
            </div>
          </div>

          {/* WhatsApp, Phone & Email Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 text-white shadow-sm space-y-5">
            <div className="space-y-1.5">
              <h2 className="font-serif text-xl font-bold">Direct Inquiries &amp; Orders</h2>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Have questions about available sizes, bespoke timelines, or fabric choices? Connect directly with our concierge team.
              </p>
            </div>

            {/* Clickable Phone & Email Links */}
            <div className="pt-2 border-t border-neutral-800 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-neutral-400">Call / WhatsApp:</span>
                <div className="flex flex-wrap items-center gap-3">
                  {BRAND.phones.map((p) => (
                    <a
                      key={p.raw}
                      href={`tel:${p.tel}`}
                      className="text-white hover:text-brand-accent transition underline font-medium"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                <span className="text-neutral-400">Email:</span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-white hover:text-brand-accent transition underline font-medium"
                >
                  {BRAND.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {/* Intentionally NOT using round-robin here: general inquiries 
                   go to the primary/main number. Product-order traffic uses
                   the load-balanced getNextWhatsAppNumber() in OrderButton
                   and CustomOrderForm. */}
              <a
                href={`https://wa.me/${primaryPhone.raw}?text=${encodeURIComponent("Hello Elmik Stitches, I have an inquiry about your collections.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-3 text-xs font-semibold transition text-center shadow-sm"
              >
                Chat on WhatsApp
              </a>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 text-neutral-300 hover:text-white px-6 py-3 text-xs font-medium hover:bg-neutral-800 transition text-center"
              >
                Instagram: {BRAND.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Google Map */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
            <GoogleMapEmbed />
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs text-neutral-500 leading-relaxed">
            <strong>Directions Tip:</strong> We are located within Efab City Estate, Jabi, Mbora District, Abuja. Security at the gate will grant visitor access to House 67, 2nd Avenue upon mention of Elmik Stitches.
          </div>
        </div>
      </div>
    </main>
  );
}
