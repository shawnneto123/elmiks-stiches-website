"use client";

import { useState, useTransition } from "react";
import { toggleStockAction } from "@/app/admin/actions";

interface StockToggleProps {
  productId: string;
  initialInStock: boolean;
}

export function StockToggle({ productId, initialInStock }: StockToggleProps) {
  const [inStock, setInStock] = useState(initialInStock);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !inStock;
    // Optimistic UI update
    setInStock(nextState);

    startTransition(async () => {
      const result = await toggleStockAction(productId, nextState);
      if (result.error) {
        // Revert on error
        setInStock(!nextState);
        alert(result.error || "Failed to update stock status.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={inStock ? "Click to mark Out of Stock" : "Click to mark In Stock"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px] ${
        inStock
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      } ${isPending ? "opacity-60 cursor-wait" : ""}`}
    >
      <span
        className={`w-2 h-2 rounded-full transition-colors ${
          inStock ? "bg-emerald-500 dark:bg-emerald-400" : "bg-neutral-400 dark:bg-neutral-500"
        }`}
      />
      <span>{inStock ? "In Stock" : "Out of Stock"}</span>
    </button>
  );
}
