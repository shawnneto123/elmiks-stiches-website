"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductSize } from "@/lib/types";
import { formatNaira } from "@/lib/utils/currency";
import { OrderButton } from "@/components/OrderButton";
import { SizeChartModal } from "@/components/SizeChartModal";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0] : null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Combine primary image with additional images for the gallery
  const allImages = [
    product.image_url,
    ...(product.image_urls ?? []),
  ].filter(Boolean);

  const handleSizeSelect = (size: ProductSize) => {
    setSelectedSize(size);
    setValidationError(null);
  };

  const handleOrderClick = () => {
    if (!selectedSize) {
      setValidationError("Please select a size before ordering.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      setValidationError("Please select a color before ordering.");
      return;
    }
    setValidationError(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full min-w-0">
        {/* Image Gallery */}
        <div className="space-y-3 w-full min-w-0">
          {/* Main Image */}
          <div className="relative aspect-[3/4] w-full max-w-full overflow-hidden bg-neutral-100 rounded-xs">
            {allImages.length > 0 ? (
              <Image
                src={allImages[currentImageIndex]}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover max-w-full"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-serif italic">
                [ {product.title} ]
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 w-full min-w-0">
              {allImages.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden bg-neutral-100 transition-all ${
                    i === currentImageIndex
                      ? "ring-2 ring-brand-accent ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover max-w-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start w-full min-w-0">
          {/* Category Breadcrumb */}
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
            {product.category}
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight break-words">
            {product.title}
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-neutral-900">
            {formatNaira(product.price)}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                product.in_stock ? "bg-emerald-500" : "bg-neutral-400"
              }`}
            />
            <span className="text-xs font-medium text-neutral-600">
              {product.in_stock ? "In Stock" : "Currently Out of Stock"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-neutral-600 leading-relaxed break-words">
              {product.description}
            </p>
          )}

          {/* Size Selector */}
          <div className="w-full min-w-0">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Size
              </label>
              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 transition-colors py-1"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs font-medium rounded-lg border transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector (if product has colors) */}
          {product.colors.length > 0 && (
            <div className="w-full min-w-0">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-3 block">
                Color — {selectedColor ?? "Select"}
              </label>
              <div className="flex flex-wrap gap-2 w-full">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setValidationError(null);
                    }}
                    className={`min-h-[44px] px-4 py-2.5 text-xs font-medium rounded-lg border transition-all flex items-center justify-center ${
                      selectedColor === color
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <p className="text-xs text-red-600 font-medium">{validationError}</p>
          )}

          {/* Order / Restock Button */}
          <div onClick={handleOrderClick} className="w-full">
            <OrderButton
              orderDetails={{
                title: product.title,
                size: selectedSize ?? "",
                color: selectedColor ?? undefined,
                price: product.price,
              }}
              inStock={product.in_stock}
              disabled={!selectedSize || (product.colors.length > 0 && !selectedColor)}
            />
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />
    </>
  );
}
