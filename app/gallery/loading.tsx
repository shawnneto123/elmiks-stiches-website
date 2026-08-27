export default function GalleryLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-20 space-y-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header skeleton */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800/60 rounded-full mx-auto animate-pulse" />
        <div className="h-10 w-64 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg mx-auto animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-neutral-100 dark:bg-neutral-800/60 rounded mx-auto animate-pulse" />
      </div>

      {/* Masonry skeleton grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {[380, 520, 440, 490, 410, 560].map((height, i) => (
          <div
            key={i}
            style={{ height: `${height}px` }}
            className="w-full bg-neutral-100 dark:bg-neutral-800/60 rounded-xl animate-pulse break-inside-avoid"
          />
        ))}
      </div>
    </main>
  );
}
