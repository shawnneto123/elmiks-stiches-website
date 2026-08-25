import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatNaira } from "@/lib/utils/currency";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("title, description, price, image_url, category")
    .eq("id", id)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  const p = product as Pick<Product, "title" | "description" | "price" | "image_url" | "category">;

  return {
    title: p.title,
    description:
      p.description ??
      `${p.title} — ${p.category} from Elmik Stitches. ${formatNaira(p.price)}. Order via WhatsApp.`,
    openGraph: {
      title: `${p.title} | Elmik Stitches`,
      description:
        p.description ??
        `Shop ${p.title} from our ${p.category} collection.`,
      images: p.image_url ? [{ url: p.image_url, alt: p.title }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14">
      <ProductDetailClient product={product as Product} />
    </main>
  );
}
