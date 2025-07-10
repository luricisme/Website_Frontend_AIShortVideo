import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Video } from "@/types/video.types";

const VideoThumbnail = ({ video }: { video: Video }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback(() => {
        console.log(">>> Image error for:", video.thumbnail);
        setImageError(true);
    }, [video.thumbnail]);

    useEffect(() => {
        setImageError(false);
    }, [video.thumbnail, video.id]);

    return (
        <div className="w-12 h-8 rounded overflow-hidden bg-zinc-800">
            {!imageError && video.thumbnail ? (
                <Image
                    src={video.thumbnail}
                    alt={video.title || "Video thumbnail"}
                    width={48}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjMyIiBmaWxsPSIjMjcyNzI3Ii8+PC9zdmc+"
                    unoptimized={process.env.NODE_ENV === "development"}
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                    <PlayCircle className="w-4 h-4 text-zinc-500" />
                </div>
            )}
        </div>
    );
};

export default VideoThumbnail;
