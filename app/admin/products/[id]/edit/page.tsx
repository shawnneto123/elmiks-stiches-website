import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6 w-full min-w-0">
      {/* Top Header with Back Link */}
      <div className="space-y-1">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mb-2"
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
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          Edit Product
        </h1>
        <p className="text-xs text-neutral-500">
          Update pricing, sizes, description, or stock status for this piece.
        </p>
      </div>

      {/* Product Edit Form */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs">
        <ProductForm initialProduct={product as Product} />
      </div>
    </main>
  );
}
