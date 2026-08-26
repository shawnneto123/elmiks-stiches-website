import { createClient } from "@/lib/supabase/server";
import { GalleryImage } from "@/lib/types";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata = {
  title: "Customer Gallery CMS",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  const { data: galleryImages } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  const images: GalleryImage[] = galleryImages || [];

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Customer Gallery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage client showcase photos and social proof.
          </p>
        </div>
      </div>

      <GalleryManager initialImages={images} />
    </div>
  );
}
