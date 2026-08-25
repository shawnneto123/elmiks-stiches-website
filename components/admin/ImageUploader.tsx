"use client";

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  return (
    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        id="camera-upload"
      />
      <label htmlFor="camera-upload" className="cursor-pointer text-xs text-neutral-600">
        Tap to upload photo or take picture
      </label>
    </div>
  );
}
