import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils/currency";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block w-full min-w-0">
      {/* 3:4 aspect ratio container — borderless, shadowless per PRD Section 4.1 */}
      <div className="relative aspect-[3/4] w-full max-w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 rounded-lg mb-2.5 border border-transparent dark:border-neutral-800/80 transition-colors">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out max-w-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 dark:text-neutral-500 font-serif italic p-3 text-center">
            [ {product.title} ]
          </div>
        )}

        {/* Stock badge */}
        {!product.in_stock && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-900/90 text-white backdrop-blur-sm">
            Restock Soon
          </span>
        )}
      </div>

      <div className="space-y-0.5 w-full min-w-0">
        <h3 className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-brand-accent transition-colors truncate w-full">
          {product.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
          {formatNaira(product.price)}
        </p>
      </div>
    </Link>
  );
}
