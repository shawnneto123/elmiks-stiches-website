"use client";

import { useState } from "react";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp/roundRobin";
import { OrderDetails } from "@/lib/types";

interface OrderButtonProps {
  orderDetails: Omit<OrderDetails, "isRestockRequest">;
  inStock: boolean;
  disabled?: boolean;
}

export function OrderButton({ orderDetails, inStock, disabled }: OrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      const url = await getWhatsAppOrderUrl({
        ...orderDetails,
        isRestockRequest: !inStock,
      });
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsLoading(false);
    }
  };

  if (!inStock) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="w-full sm:w-auto rounded-full border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10 px-8 py-3.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center active:scale-98"
      >
        {isLoading ? "Connecting..." : "Request Restock via WhatsApp"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-3.5 text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-center active:scale-98"
    >
      {isLoading ? "Connecting..." : "Order via WhatsApp"}
    </button>
  );
}
