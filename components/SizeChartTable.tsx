"use client";

import { useState } from "react";

interface SizeRow {
  size: string;
  ukSize: string;
  usSize: string;
  bustIn: string;
  bustCm: string;
  waistIn: string;
  waistCm: string;
  hipsIn: string;
  hipsCm: string;
}

// Elmik Stitches official RTW size chart (sourced from brand physical chart)
const SIZE_DATA: SizeRow[] = [
  {
    size: "M",
    ukSize: "10 - 12",
    usSize: "6 - 8",
    bustIn: '40"',
    bustCm: "102 cm",
    waistIn: '35"',
    waistCm: "89 cm",
    hipsIn: '44"',
    hipsCm: "112 cm",
  },
  {
    size: "L",
    ukSize: "14 - 16",
    usSize: "10 - 12",
    bustIn: '42"',
    bustCm: "107 cm",
    waistIn: '37"',
    waistCm: "94 cm",
    hipsIn: '48"',
    hipsCm: "122 cm",
  },
  {
    size: "XL",
    ukSize: "18 - 20",
    usSize: "14 - 16",
    bustIn: '45"',
    bustCm: "114 cm",
    waistIn: '39"',
    waistCm: "99 cm",
    hipsIn: '52"',
    hipsCm: "132 cm",
  },
  {
    size: "XXL",
    ukSize: "22",
    usSize: "18",
    bustIn: '48"',
    bustCm: "122 cm",
    waistIn: '42"',
    waistCm: "107 cm",
    hipsIn: '56"',
    hipsCm: "142 cm",
  },
  {
    size: "XXXL",
    ukSize: "24",
    usSize: "20",
    bustIn: '50"',
    bustCm: "127 cm",
    waistIn: '44"',
    waistCm: "112 cm",
    hipsIn: '58"',
    hipsCm: "147 cm",
  },
];

export function SizeChartTable() {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [activeSizeTab, setActiveSizeTab] = useState<string>("M");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const currentSizeRow = SIZE_DATA.find((r) => r.size === activeSizeTab) ?? SIZE_DATA[0];

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Controls: Unit Segmented Tabs + View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
          Measurement Unit
        </span>

        <div className="flex items-center gap-2">
          {/* Unit Toggle Tabs (44px min touch target) */}
          <div className="grid grid-cols-2 p-1 bg-neutral-200/70 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-full w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`min-h-[44px] px-5 py-2 text-xs font-semibold rounded-full transition-all text-center flex items-center justify-center active:scale-95 ${
                unit === "in"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`min-h-[44px] px-5 py-2 text-xs font-semibold rounded-full transition-all text-center flex items-center justify-center active:scale-95 ${
                unit === "cm"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Centimeters (cm)
            </button>
          </div>

          {/* Mobile View Toggle (Card vs Full Table) */}
          <div className="sm:hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === "cards" ? "table" : "cards"))}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center shadow-2xs"
            >
              {viewMode === "cards" ? "Full Matrix" : "Size Tabs"}
            </button>
          </div>
        </div>
      </div>

      {/* 1. Mobile Interactive Size Tabs & Detail Card */}
      <div className={`${viewMode === "table" ? "hidden" : "block"} sm:hidden space-y-4 w-full min-w-0`}>
        {/* Horizontal Size Tabs */}
        <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {SIZE_DATA.map((row) => {
            const size = row.size;
            const isActive = activeSizeTab === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setActiveSizeTab(size)}
                className={`flex-1 min-w-[50px] min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center active:scale-95 ${
                  isActive
                    ? "bg-brand-accent text-white dark:text-neutral-950 shadow-xs font-bold"
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Selected Size Breakdown Card */}
        <div className="bg-white dark:bg-neutral-900/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
                Selected Size
              </span>
              <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Size {currentSizeRow.size}
              </h3>
            </div>
            <div className="text-right text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
              <p>UK: <strong className="text-neutral-900 dark:text-white">{currentSizeRow.ukSize}</strong></p>
              <p>US: <strong className="text-neutral-900 dark:text-white">{currentSizeRow.usSize}</strong></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs w-full">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-100 dark:border-neutral-800 min-w-0">
              <span className="text-neutral-500 dark:text-neutral-400 block mb-1 truncate text-[11px]">Bust / Chest</span>
              <strong className="text-sm text-neutral-900 dark:text-neutral-100 block truncate">
                {unit === "in" ? currentSizeRow.bustIn : currentSizeRow.bustCm}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-100 dark:border-neutral-800 min-w-0">
              <span className="text-neutral-500 dark:text-neutral-400 block mb-1 truncate text-[11px]">Natural Waist</span>
              <strong className="text-sm text-neutral-900 dark:text-neutral-100 block truncate">
                {unit === "in" ? currentSizeRow.waistIn : currentSizeRow.waistCm}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-100 dark:border-neutral-800 min-w-0">
              <span className="text-neutral-500 dark:text-neutral-400 block mb-1 truncate text-[11px]">Hips</span>
              <strong className="text-sm text-neutral-900 dark:text-neutral-100 block truncate">
                {unit === "in" ? currentSizeRow.hipsIn : currentSizeRow.hipsCm}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full Matrix Table (Always visible on desktop, toggleable on mobile) */}
      <div className={`${viewMode === "cards" ? "hidden sm:block" : "block"} w-full min-w-0`}>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 scrollbar-none touch-pan-x w-full max-w-full">
          <table className="w-full text-left border-collapse text-xs sm:text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                <th className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">Size</th>
                <th className="py-3.5 px-4">UK Equiv.</th>
                <th className="py-3.5 px-4">US Equiv.</th>
                <th className="py-3.5 px-4">Bust</th>
                <th className="py-3.5 px-4">Waist</th>
                <th className="py-3.5 px-4">Hips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {SIZE_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-50/40 dark:bg-neutral-950/40">
                    {row.size}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">{row.ukSize}</td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">{row.usSize}</td>
                  <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200 font-medium">
                    {unit === "in" ? row.bustIn : row.bustCm}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200 font-medium">
                    {unit === "in" ? row.waistIn : row.waistCm}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-800 dark:text-neutral-200 font-medium">
                    {unit === "in" ? row.hipsIn : row.hipsCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic">
        * Note: Measurements reflect standard body dimensions. For custom bespoke tailoring, select &quot;Custom Order&quot;.
      </p>
    </div>
  );
}
