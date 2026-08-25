"use client";

import { Product } from "@/lib/types";

interface ProductFormProps {
  initialProduct?: Product;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">Product Title</label>
        <input
          type="text"
          defaultValue={initialProduct?.title || ""}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-sm"
          placeholder="e.g. Silk Wrap Dress"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1">Price (₦)</label>
        <input
          type="number"
          defaultValue={initialProduct?.price || ""}
          className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-sm"
          placeholder="25000"
        />
      </div>
      {/* Full form fields to be wired in Phase 5 */}
    </form>
  );
}
