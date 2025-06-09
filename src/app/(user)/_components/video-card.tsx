"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import VideoActionDropdown from "@/app/(user)/_components/video-action-dropdown";

export type VideoCardProps = {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    source: string;
    duration: number;
    views: number;
    author: {
        id: number;
        name: string;
        username: string;
        avatar: string;
    };
};

const VideoCard = ({ video }: { video: VideoCardProps }) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        return () => {
            if (videoElement) {
                videoElement.pause();
            }
        };
    }, []);

    const handleMouseEnter = () => {
        setIsHovering(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;

            playPromiseRef.current = videoRef.current.play();

            if (playPromiseRef.current !== undefined) {
                playPromiseRef.current
                    .then(() => {})
                    .catch((err) => {
                        console.log("Không thể phát video:", err);
                        playPromiseRef.current = null;
                    });
            }
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (videoRef.current) {
            if (playPromiseRef.current !== null) {
                playPromiseRef.current
                    .then(() => {
                        if (videoRef.current) {
                            videoRef.current.pause();
                        }
                        playPromiseRef.current = null;
                    })
                    .catch(() => {
                        playPromiseRef.current = null;
                    });
            } else {
                videoRef.current.pause();
            }
        }
    };

    return (
        <div className="flex flex-col">
            <Link href={`/video/${video.id}`} className="block">
                <div
                    className="relative w-full aspect-[9/16]"
                    onMouseEnter={() => handleMouseEnter()}
                    onMouseLeave={() => handleMouseLeave()}
                >
                    {!isHovering && (
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            className="rounded-lg object-cover cursor-pointer"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE4MTgxOCIvPjwvc3ZnPg=="
                            loading="lazy"
                        />
                    )}

                    <video
                        ref={videoRef}
                        src={video.source}
                        className={cn(
                            "absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 cursor-pointer",
                            isHovering ? "opacity-100" : "opacity-0"
                        )}
                        muted
                        loop
                        playsInline
                        preload="none"
                    />

                    {video.duration && !isHovering && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {Math.floor(video.duration / 60)}:
                            {video.duration % 60 < 10
                                ? `0${video.duration % 60}`
                                : video.duration % 60}
                        </div>
                    )}

                    {isHovering && (
                        <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center gap-1">
                            <div className="bg-red-500 h-2 w-2 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
            </Link>
            <div className="flex flex-col mt-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white line-clamp-2">{video.title}</span>
                    <VideoActionDropdown />
                </div>
                <div className="text-xs font-bold text-[#AAAAAA] flex items-center justify-between mt-1">
                    <span>@{video.author.username}</span>
                    <span>
                        {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views}{" "}
                        views
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
