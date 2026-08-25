import { createClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";
import { Product, ProductCategory } from "@/lib/types";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilterBar } from "@/components/CategoryFilterBar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Resolve the URL slug back to the canonical category name
function resolveCategory(slug: string): ProductCategory | null {
  const decoded = decodeURIComponent(slug).toLowerCase();
  const match = CATEGORIES.find((c) => c.toLowerCase() === decoded);
  return match ?? null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = resolveCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category} Collection`,
    description: `Shop ${category} from Elmik Stitches — curated ready-to-wear fashion from Abuja. Order via WhatsApp.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = resolveCategory(slug);

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Failed to fetch ${category} products:`, error.message);
  }

  const filteredProducts: Product[] = (products as Product[]) ?? [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
          {category}
        </h1>
        <p className="text-sm text-neutral-500">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "piece" : "pieces"} in this category
        </p>
      </div>

      <CategoryFilterBar activeCategory={category} />

      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-400 text-sm font-medium">
            No products in this category yet.
          </p>
          <p className="text-neutral-400 text-xs mt-1">
            New {category.toLowerCase()} pieces will appear here once added.
          </p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </main>
  );
}
