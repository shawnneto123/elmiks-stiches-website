export default function CategoryLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="mb-8">
        <div className="h-9 w-48 bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse mt-3" />
      </div>

      {/* Category filter skeleton */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-20 bg-neutral-100 rounded-full animate-pulse flex-shrink-0"
          />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-neutral-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
