import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
      <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-3">
        Product Not Found
      </h1>
      <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">
        This product may have been removed or the link is incorrect. Browse our collection to find what you&apos;re looking for.
      </p>
      <Link
        href="/shop"
        className="inline-block rounded-full bg-neutral-900 text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition"
      >
        Browse All Products
      </Link>
    </main>
  );
}
