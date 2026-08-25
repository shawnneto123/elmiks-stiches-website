import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-3 flex items-center justify-around z-40">
      <Link href="/admin" className="text-xs text-neutral-600 hover:text-neutral-900 font-medium text-center">
        Dashboard
      </Link>
      <Link href="/admin/products/new" className="text-xs text-neutral-600 hover:text-neutral-900 font-medium text-center">
        + Add Product
      </Link>
    </nav>
  );
}
