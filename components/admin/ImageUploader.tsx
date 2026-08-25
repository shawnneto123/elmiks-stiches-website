"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  initialUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export function ImageUploader({
  initialUrl = "",
  onUpload,
  label = "Product Photo",
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const libraryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image is too large. Maximum size is 8MB.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(data.path);

      setImageUrl(publicUrl);
      onUpload(publicUrl);
    } catch (err: any) {
      setUploadError(
        err.message || "Failed to upload image. You can also paste an image URL directly below."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    setImageUrl(manualUrl.trim());
    onUpload(manualUrl.trim());
    setShowUrlInput(false);
    setManualUrl("");
    setUploadError(null);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    onUpload("");
    if (libraryInputRef.current) libraryInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-3 w-full min-w-0">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
          {label} <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-neutral-500 hover:text-neutral-900 underline transition-colors"
        >
          {showUrlInput ? "Hide URL input" : "Or enter image link"}
        </button>
      </div>

      {/* Manual URL Input Option */}
      {showUrlInput && (
        <div className="flex gap-2 w-full min-w-0">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... image link"
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
          />
          <button
            type="button"
            onClick={handleManualUrlSubmit}
            className="px-3 py-2 text-xs bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 shrink-0"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview Container or Upload Actions */}
      {imageUrl ? (
        <div className="relative aspect-[3/4] max-w-[240px] mx-auto rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm group">
          <Image
            src={imageUrl}
            alt="Product Preview"
            fill
            sizes="240px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => libraryInputRef.current?.click()}
              className="w-full max-w-[160px] px-3 py-1.5 bg-white/95 hover:bg-white text-neutral-900 text-xs font-medium rounded-lg shadow-sm text-center"
            >
              Choose from Library
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="w-full max-w-[160px] px-3 py-1.5 bg-white/95 hover:bg-white text-neutral-900 text-xs font-medium rounded-lg shadow-sm text-center"
            >
              Take New Photo
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="w-full max-w-[160px] px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg shadow-sm text-center"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Main Drag/Tap Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all bg-white hover:bg-neutral-50 flex flex-col items-center justify-center gap-3 ${
              isUploading ? "border-brand-accent bg-brand-accent/5" : "border-neutral-200"
            }`}
          >
            {isUploading ? (
              <div className="space-y-2 py-4">
                <div className="w-8 h-8 mx-auto border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-neutral-700">Uploading photo to Supabase...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-xs font-semibold text-neutral-800">
                    Upload Product Photograph
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Portrait 3:4 recommended (JPG, PNG, WebP up to 8MB)
                  </p>
                </div>

                {/* Two Distinct Explicit Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-sm pt-2">
                  <button
                    type="button"
                    onClick={() => libraryInputRef.current?.click()}
                    className="flex-1 min-h-[42px] px-4 py-2.5 rounded-lg border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-98"
                  >
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
                      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                    </svg>
                    <span>Photo Library / Files</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 min-h-[42px] px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-98"
                  >
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
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>Take Photo (Camera)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Input 1: Standard File / Photo Library Picker */}
      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Input 2: Direct Camera Capture for Mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {uploadError && (
        <p className="text-xs text-red-600 font-medium">{uploadError}</p>
      )}
    </div>
  );
}
