"use client";

import { useState } from "react";

interface StockToggleProps {
  productId: string;
  initialInStock: boolean;
}

export function StockToggle({ productId, initialInStock }: StockToggleProps) {
  const [inStock, setInStock] = useState(initialInStock);

  return (
    <button
      type="button"
      onClick={() => setInStock(!inStock)}
      className={`px-3 py-1 text-xs rounded-full font-medium transition ${
        inStock
          ? "bg-emerald-100 text-emerald-800"
          : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {inStock ? "In Stock" : "Out of Stock"}
    </button>
  );
}
