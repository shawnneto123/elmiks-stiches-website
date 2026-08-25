import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
      <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-3">
        Category Not Found
      </h1>
      <p className="text-sm text-neutral-500 mb-8 max-w-md mx-auto">
        This category doesn&apos;t exist. Browse our full collection instead.
      </p>
      <Link
        href="/shop"
        className="inline-block rounded-full bg-neutral-900 text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition"
      >
        View All Products
      </Link>
    </main>
  );
}
