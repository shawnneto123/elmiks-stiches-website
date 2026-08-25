import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils/currency";
import { StockToggle } from "@/components/admin/StockToggle";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const allProducts: Product[] = (products as Product[]) ?? [];
  const inStockCount = allProducts.filter((p) => p.in_stock).length;
  const outOfStockCount = allProducts.length - inStockCount;

  return (
    <main className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 w-full min-w-0">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Inventory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage store catalog and WhatsApp ordering status
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs shrink-0"
        >
          + Add Product
        </Link>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 text-center">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Total
          </span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
            {allProducts.length}
          </span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 text-center">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-600">
            In Stock
          </span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-700">
            {inStockCount}
          </span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 text-center">
          <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Out
          </span>
          <span className="font-serif text-xl sm:text-2xl font-bold text-neutral-600">
            {outOfStockCount}
          </span>
        </div>
      </div>

      {/* Product List */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          Error loading products: {error.message}
        </div>
      )}

      {allProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">
            No products found
          </h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Your catalog is currently empty. Tap below to upload your first luxury piece.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-neutral-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg mt-2"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200 flex items-center gap-3 sm:gap-4 shadow-2xs hover:border-neutral-300 transition-all"
            >
              {/* Product Thumbnail */}
              <div className="relative w-16 h-20 sm:w-18 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400 font-serif">
                    No image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 truncate leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs font-medium text-neutral-700 mt-0.5">
                  {formatNaira(product.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-[11px] font-semibold text-brand-accent hover:text-brand-accent-hover underline"
                  >
                    Edit details
                  </Link>
                  <span className="text-neutral-300 text-xs">•</span>
                  <Link
                    href={`/product/${product.id}`}
                    target="_blank"
                    className="text-[11px] text-neutral-400 hover:text-neutral-600"
                  >
                    View in store
                  </Link>
                </div>
              </div>

              {/* Stock Toggle Action */}
              <div className="shrink-0">
                <StockToggle
                  productId={product.id}
                  initialInStock={product.in_stock}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
