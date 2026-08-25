import { Product } from "@/lib/types";
import { formatNaira } from "@/lib/utils/currency";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      {/* 3:4 aspect ratio container — borderless, shadowless per PRD Section 4.1 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-3">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-serif italic">
            [ {product.title} ]
          </div>
        )}

        {/* Stock badge */}
        {!product.in_stock && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-neutral-900/90 text-white backdrop-blur-sm">
            Restock Soon
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors truncate">
          {product.title}
        </h3>
        <p className="text-sm text-neutral-500 font-normal">
          {formatNaira(product.price)}
        </p>
      </div>
    </Link>
  );
}
