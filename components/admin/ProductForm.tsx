"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductCategory, ProductSize } from "@/lib/types";
import { CATEGORIES, SIZES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils/currency";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/admin/actions";

interface ProductFormProps {
  initialProduct?: Product;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditMode = Boolean(initialProduct);

  const [title, setTitle] = useState(initialProduct?.title || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : "");
  const [category, setCategory] = useState<ProductCategory>(
    initialProduct?.category || CATEGORIES[0]
  );
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>(
    initialProduct?.sizes && initialProduct.sizes.length > 0
      ? initialProduct.sizes
      : ["M", "L"]
  );
  const [colorsInput, setColorsInput] = useState(
    initialProduct?.colors ? initialProduct.colors.join(", ") : ""
  );
  const [imageUrl, setImageUrl] = useState(initialProduct?.image_url || "");
  const [inStock, setInStock] = useState(initialProduct ? initialProduct.in_stock : true);

  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSize = (size: ProductSize) => {
    if (selectedSizes.includes(size)) {
      if (selectedSizes.length === 1) {
        setFieldErrors((prev) => ({
          ...prev,
          sizes: "At least one size must remain selected.",
        }));
        return;
      }
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
    setFieldErrors((prev) => ({ ...prev, sizes: "" }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Product title is required.";
    }

    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errors.price = "Enter a valid price greater than ₦0.";
    }

    if (selectedSizes.length === 0) {
      errors.sizes = "Select at least one available size.";
    }

    if (!imageUrl.trim()) {
      errors.image = "Please upload or provide a product photo.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    formData.append("price", price);
    formData.append("category", category);
    selectedSizes.forEach((s) => formData.append("sizes", s));
    formData.append("colors", colorsInput);
    formData.append("image_url", imageUrl);
    formData.append("in_stock", String(inStock));

    startTransition(async () => {
      if (isEditMode && initialProduct) {
        const res = await updateProductAction(initialProduct.id, formData);
        if (res.error) {
          setFormError(res.error);
        } else {
          router.push("/admin");
          router.refresh();
        }
      } else {
        const res = await createProductAction(formData);
        if (res.error) {
          setFormError(res.error);
        } else {
          router.push("/admin");
          router.refresh();
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!initialProduct) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${initialProduct.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await deleteProductAction(initialProduct.id, initialProduct.image_url);
      if (res.error) {
        setFormError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setFormError("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const parsedPrice = parseFloat(price);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full min-w-0" noValidate>
      {/* Top Banner Error */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-lg">
          {formError}
        </div>
      )}

      {/* Image Uploader */}
      <div>
        <ImageUploader
          initialUrl={imageUrl}
          onUpload={(url) => {
            setImageUrl(url);
            setFieldErrors((prev) => ({ ...prev, image: "" }));
          }}
        />
        {fieldErrors.image && (
          <p className="text-xs text-red-600 font-medium mt-1.5">{fieldErrors.image}</p>
        )}
      </div>

      {/* Product Title */}
      <div>
        <label
          htmlFor="prod-title"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="prod-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="e.g. Adire Silk Wrap Gown"
          className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white transition-colors ${
            fieldErrors.title ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"
          }`}
        />
        {fieldErrors.title && (
          <p className="text-xs text-red-600 font-medium mt-1.5">{fieldErrors.title}</p>
        )}
      </div>

      {/* Price with Live Naira Formatted Preview */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="prod-price"
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
          >
            Price (₦) <span className="text-red-500">*</span>
          </label>
          {!isNaN(parsedPrice) && parsedPrice > 0 && (
            <span className="text-xs font-serif font-bold text-neutral-900">
              Preview: {formatNaira(parsedPrice)}
            </span>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-semibold">
            ₦
          </span>
          <input
            id="prod-price"
            type="number"
            min="0"
            step="100"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setFieldErrors((prev) => ({ ...prev, price: "" }));
            }}
            placeholder="25000"
            className={`w-full pl-8 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white transition-colors ${
              fieldErrors.price ? "border-red-500 ring-1 ring-red-500" : "border-neutral-200"
            }`}
          />
        </div>
        {fieldErrors.price && (
          <p className="text-xs text-red-600 font-medium mt-1.5">{fieldErrors.price}</p>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        <label
          htmlFor="prod-category"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="prod-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Size Multi-Select Chips */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
          Available Sizes <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`min-h-[42px] min-w-[42px] px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {fieldErrors.sizes && (
          <p className="text-xs text-red-600 font-medium mt-1.5">{fieldErrors.sizes}</p>
        )}
      </div>

      {/* Colors Input */}
      <div>
        <label
          htmlFor="prod-colors"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Colors (Optional, comma-separated)
        </label>
        <input
          id="prod-colors"
          type="text"
          value={colorsInput}
          onChange={(e) => setColorsInput(e.target.value)}
          placeholder="e.g. Navy, Emerald, Gold"
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
        />
        <p className="text-[11px] text-neutral-400 mt-1">
          Separate multiple color options with commas.
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="prod-desc"
          className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Description (Optional)
        </label>
        <textarea
          id="prod-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed garment information, fabric type, styling notes..."
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white resize-y"
        />
      </div>

      {/* Stock Status Switch */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-800">
            In Stock Status
          </span>
          <span className="text-[11px] text-neutral-400">
            {inStock
              ? "Item is available for immediate WhatsApp ordering"
              : "Item is marked as out of stock (Request Restock CTA)"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setInStock(!inStock)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            inStock ? "bg-brand-accent" : "bg-neutral-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              inStock ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={isPending || isDeleting}
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          {isPending
            ? isEditMode
              ? "Saving Changes..."
              : "Creating Product..."
            : isEditMode
            ? "Update Product"
            : "Save & Publish Product"}
        </button>

        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 text-center"
          >
            {isDeleting ? "Deleting Product..." : "Delete Product"}
          </button>
        )}
      </div>
    </form>
  );
}
