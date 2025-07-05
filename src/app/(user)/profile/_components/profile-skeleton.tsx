import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
    <div className="min-h-screen text-white mb-10">
        <div className="mx-auto max-w-6xl px-4">
            {/* Profile Header Skeleton */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                    <div className="flex space-x-8">
                        <div className="text-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="text-center">
                            <Skeleton className="h-6 w-12 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio Skeleton */}
            <div className="mb-8 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Tabs Skeleton */}
            <div className="border-b border-zinc-800 mb-6">
                <div className="flex space-x-8">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Video Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-video w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ProfileSkeleton;
