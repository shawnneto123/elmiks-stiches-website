import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 md:px-10 py-16 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="text-center max-w-md mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent">
          404 &bull; Error
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
          The garment or page you are looking for does not exist or has been moved. Explore our catalog or return to the storefront.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-8 py-3.5 text-xs font-semibold transition shadow-sm text-center"
          >
            Return to Home
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-900 px-8 py-3.5 text-xs font-semibold transition text-center"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
