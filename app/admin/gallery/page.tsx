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
    <main className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Customer Gallery
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 font-light">
            Manage client showcase photos and social proof.
          </p>
        </div>
      </div>

      <GalleryManager initialImages={images} />
    </main>
  );
}
