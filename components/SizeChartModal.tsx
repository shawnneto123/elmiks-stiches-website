"use client";

import { useEffect } from "react";
import { SizeChartTable } from "./SizeChartTable";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-size-guide-title"
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 id="modal-size-guide-title" className="font-serif text-2xl font-bold text-neutral-900">
            Size Guide
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Compare your measurements against our sizing guide to find the best fit.
          </p>
        </div>

        <SizeChartTable />
      </div>
    </div>
  );
}
