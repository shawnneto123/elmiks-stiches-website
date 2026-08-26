"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GalleryImage } from "@/lib/types";

interface GalleryMasonryProps {
  images: GalleryImage[];
}

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  // Close lightbox on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeImage) {
        setActiveImage(null);
      }
    },
    [activeImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  return (
    <>
      {/* Responsive Multi-Column Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 w-full min-w-0">
        {images.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full">
              {/* Natural aspect ratio image with next/image */}
              <Image
                src={item.image_url}
                alt={item.caption || `Elmik Stitches Customer Photo ${index + 1}`}
                width={800}
                height={1000}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                priority={index < 3}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover overlay with zoom icon and caption preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </span>
                </div>

                {item.caption && (
                  <p className="text-white text-xs sm:text-sm font-medium leading-snug line-clamp-3">
                    &ldquo;{item.caption}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Permanent Caption beneath card if exists */}
            {item.caption && (
              <div className="p-3 bg-white border-t border-neutral-100">
                <p className="text-xs text-neutral-700 italic leading-relaxed">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Full-Screen Lightbox Modal */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customer Photo Lightbox"
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            aria-label="Close Lightbox"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-neutral-950/40 border border-neutral-800/80 shadow-2xl p-2 sm:p-4"
          >
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl">
              <Image
                src={activeImage.image_url}
                alt={activeImage.caption || "Elmik Stitches Customer Photo"}
                width={1200}
                height={1600}
                className="max-h-[75vh] w-auto h-auto object-contain rounded-lg"
                priority
              />
            </div>

            {activeImage.caption && (
              <div className="w-full text-center pt-3 pb-1 px-4">
                <p className="text-sm text-neutral-200 font-serif italic">
                  &ldquo;{activeImage.caption}&rdquo;
                </p>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mt-1 block">
                  Elmik Stitches Muse
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
