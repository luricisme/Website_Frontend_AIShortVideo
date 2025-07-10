export default function FiltersLoadingSkeleton() {
    return (
        <>
            {/* Categories skeleton */}
            <div className="flex gap-2.5 overflow-x-auto">
                <div className="h-10 w-16 bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-10 w-20 bg-gray-700 rounded-full animate-pulse flex-shrink-0"
                    />
                ))}
            </div>

            {/* Tags section skeleton */}
            <div className="mt-4">
                <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-8 w-16 bg-gray-700 rounded-full animate-pulse" />
                    ))}
                </div>
            </div>
        </>
    );
}
