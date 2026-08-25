import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilterBar } from "@/components/CategoryFilterBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full Elmik Stitches collection — gowns, dresses, tops, two-piece sets, jeans, skirts, and casual wear. Order directly via WhatsApp.",
};

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error.message);
  }

  const allProducts: Product[] = (products as Product[]) ?? [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
          Shop All Pieces
        </h1>
        <p className="text-sm text-neutral-500">
          {allProducts.length} {allProducts.length === 1 ? "piece" : "pieces"} available
        </p>
      </div>

      <CategoryFilterBar />

      {allProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-400 text-sm font-medium">
            No products available yet.
          </p>
          <p className="text-neutral-400 text-xs mt-1">
            Check back soon — new pieces are added regularly.
          </p>
        </div>
      ) : (
        <ProductGrid products={allProducts} />
      )}
    </main>
  );
}
