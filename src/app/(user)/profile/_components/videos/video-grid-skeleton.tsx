import { Skeleton } from "@/components/ui/skeleton";

const VideoGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg bg-zinc-800" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-zinc-800" />
                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                </div>
            </div>
        ))}
    </div>
);

export default VideoGridSkeleton;
