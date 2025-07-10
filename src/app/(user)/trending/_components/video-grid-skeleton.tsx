
export default function VideoGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-gray-700 rounded animate-pulse" />
            ))}
        </div>
    );
}