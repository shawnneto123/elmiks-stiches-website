export default function ProductLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-14 w-full max-w-full overflow-x-hidden min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 w-full min-w-0">
        {/* Gallery skeleton */}
        <div className="space-y-3 w-full min-w-0">
          <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            <div className="w-16 h-20 bg-neutral-100 rounded animate-pulse" />
            <div className="w-16 h-20 bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6 w-full min-w-0">
          <div className="h-3 w-20 bg-neutral-100 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-neutral-100 rounded animate-pulse" />
          <div className="h-6 w-32 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-neutral-100 rounded animate-pulse" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-12 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-12 w-full sm:w-64 bg-neutral-100 rounded-full animate-pulse mt-6" />
        </div>
      </div>
    </main>
  );
}
