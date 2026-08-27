import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6 w-full min-w-0">
      {/* Top Header with Back Link */}
      <div className="space-y-1">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Add New Product
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
          Upload photo and enter garment details to add to the Elmik Stitches catalog.
        </p>
      </div>

      {/* Product Creation Form */}
      <div className="bg-white dark:bg-neutral-900/90 p-5 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs transition-colors">
        <ProductForm />
      </div>
    </main>
  );
}
