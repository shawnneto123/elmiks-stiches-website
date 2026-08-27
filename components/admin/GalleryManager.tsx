"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
} from "@/app/admin/actions";

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setFormError("Please select or upload a customer photo first.");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("image_url", imageUrl);
      formData.set("caption", caption.trim());
      formData.set("display_order", displayOrder.toString());

      const result = await createGalleryImageAction(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      // Prepend optimistic item
      const newImage: GalleryImage = {
        id: result.id || Date.now().toString(),
        image_url: imageUrl,
        caption: caption.trim() || null,
        display_order: displayOrder,
        created_at: new Date().toISOString(),
      };

      setImages((prev) => [newImage, ...prev]);
      setImageUrl("");
      setCaption("");
      setDisplayOrder(0);
      setFormSuccess("Customer photo published to gallery successfully!");
    } catch (err: any) {
      setFormError(err.message || "Failed to add photo to gallery.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo from the customer gallery?"
    );
    if (!confirmed) return;

    setDeletingId(image.id);

    try {
      const result = await deleteGalleryImageAction(image.id, image.image_url);
      if (result.error) {
        alert(`Failed to delete: ${result.error}`);
        return;
      }

      setImages((prev) => prev.filter((item) => item.id !== image.id));
    } catch (err: any) {
      alert(err.message || "Failed to delete gallery image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full min-w-0">
      {/* Upload Card */}
      <div className="bg-white dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Upload Customer Photo
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-light">
            Add photos of clients and muses wearing Elmik Stitches garments (stored in the gallery-images bucket).
          </p>
        </div>

        {formError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleAddImage} className="space-y-4">
          <ImageUploader
            initialUrl={imageUrl}
            onUpload={(url) => {
              setImageUrl(url);
              setFormError(null);
            }}
            label="Client Photograph"
            bucketName="gallery-images"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Caption or Client Name{" "}
              <span className="text-neutral-400 dark:text-neutral-500 font-normal normal-case">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='e.g., "Chioma radiant in our emerald bespoke evening gown"'
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Display Order{" "}
              <span className="text-neutral-400 dark:text-neutral-500 font-normal normal-case">
                (Lower numbers appear first)
              </span>
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full sm:w-32 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !imageUrl}
            className="w-full min-h-[48px] bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white dark:border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving to Gallery...</span>
              </>
            ) : (
              <span>Publish Photo to Gallery</span>
            )}
          </button>
        </form>
      </div>

      {/* Existing Gallery Images List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50">
            Published Photos ({images.length})
          </h2>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-light">
            Tap photo to view live layout
          </span>
        </div>

        {images.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 text-sm transition-colors">
            No gallery photos uploaded yet. Upload your first customer photo above!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900/90 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs flex flex-col justify-between group transition-colors"
              >
                <div className="relative aspect-[3/4] w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.caption || "Customer gallery photo"}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 line-clamp-2 italic font-light">
                    {item.caption || "(No caption provided)"}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                      Order: {item.display_order}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold disabled:opacity-50 min-h-[36px] px-2 flex items-center"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
