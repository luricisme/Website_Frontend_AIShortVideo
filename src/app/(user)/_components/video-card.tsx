"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Video } from "@/types/video.types";
import { formatNumberToSocialStyle } from "@/utils/common";

const VideoCard = ({ video }: { video: Video }) => {
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
            <Link href={`/shorts/${video.id}`} className="block">
                <div
                    className="relative w-full aspect-[9/16]"
                    onMouseEnter={() => handleMouseEnter()}
                    onMouseLeave={() => handleMouseLeave()}
                >
                    {!isHovering && (
                        <Image
                            src={
                                video.thumbnail ??
                                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
                            }
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
                        src={"https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4"}
                        className={cn(
                            "absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 cursor-pointer",
                            isHovering ? "opacity-100" : "opacity-0"
                        )}
                        muted
                        loop
                        playsInline
                        preload="none"
                    />

                    {video.length && !isHovering && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {Math.floor(video.length / 60)}:
                            {video.length % 60 < 10 ? `0${video.length % 60}` : video.length % 60}
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
                <div className="text-xs font-bold text-[#AAAAAA] flex flex-col gap-0.5 mt-1">
                    {/* title */}
                    <Link
                        href={`/shorts/${video.id}`}
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.pause();
                            }
                        }}
                        className="line-clamp-2 text-white text-sm"
                    >
                        {video.title}
                    </Link>
                    <span className="text-white">
                        {formatNumberToSocialStyle(video.viewCnt)} views
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
