import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

interface CategoryFilterBarProps {
  activeCategory?: string;
}

export function CategoryFilterBar({ activeCategory }: CategoryFilterBarProps) {
  return (
    <div className="w-full overflow-hidden mb-6">
      {/* Exact horizontal scrolling container with touch momentum */}
      <nav
        className="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-none whitespace-nowrap"
        style={{ WebkitOverflowScrolling: "touch" }}
        aria-label="Filter by category"
      >
        <Link
          href="/shop"
          className={`shrink-0 rounded-full min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 flex items-center justify-center ${
            !activeCategory
              ? "bg-brand-accent text-white shadow-xs font-semibold"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
          }`}
        >
          All Pieces
        </Link>
        {CATEGORIES.map((category) => {
          const isActive = activeCategory?.toLowerCase() === category.toLowerCase();
          return (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category.toLowerCase())}`}
              className={`shrink-0 rounded-full min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 flex items-center justify-center ${
                isActive
                  ? "bg-brand-accent text-white shadow-xs font-semibold"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
              }`}
            >
              {category}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
