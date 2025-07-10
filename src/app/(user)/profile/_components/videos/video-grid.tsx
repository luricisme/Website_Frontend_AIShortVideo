import VideoCard from "@/app/(user)/_components/video-card";
import EmptyState from "@/app/(user)/profile/_components/videos/video-grid-empty-state";
import ErrorState from "@/app/(user)/profile/_components/videos/video-grid-error-state";
import VideoGridSkeleton from "@/app/(user)/profile/_components/videos/video-grid-skeleton";
import { Video } from "@/types/video.types";
import { HttpError } from "@/utils/errors/HttpError";

const VideoGrid = ({
    videos,
    isLoading,
    error,
    onRetry,
}: {
    videos: Video[];
    isLoading: boolean;
    error: Error | null;
    onRetry: () => void;
}) => {
    if (isLoading) return <VideoGridSkeleton />;

    if (error)
        return (
            <ErrorState
                message={error instanceof HttpError ? error.message : "Cannot load videos"}
                onRetry={onRetry}
            />
        );

    if (videos.length === 0) return <EmptyState message="No videos found" />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
};

export default VideoGrid;
