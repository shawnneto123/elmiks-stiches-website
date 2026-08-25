import { BRAND } from "@/lib/constants";

export function GoogleMapEmbed() {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
      <iframe
        title="Elmik Stitches Store Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${encodeURIComponent(BRAND.address)}&output=embed`}
      />
    </div>
  );
}
