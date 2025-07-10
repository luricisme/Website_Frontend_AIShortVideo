"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

import { cn } from "@/lib/utils";
import { Video } from "@/types/video.types";
import { formatNumberToSocialStyle } from "@/utils/common";

const VideoCard = ({ video }: { video: Video }) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);
    const [videoError, setVideoError] = useState<boolean>(false);
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cleanup = useCallback(() => {
        if (playPromiseRef.current) {
            playPromiseRef.current
                .then(() => {
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                })
                .catch(() => {});
            playPromiseRef.current = null;
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    useEffect(() => {
        setImageError(false);
        setVideoError(false);
        setVideoLoaded(false);
    }, [video.id, video.thumbnail, video.videoUrl]);

    const hasValidVideoUrl = useCallback(() => {
        return (
            video.videoUrl &&
            video.videoUrl.trim() !== "" &&
            (video.videoUrl.startsWith("http") || video.videoUrl.startsWith("/"))
        );
    }, [video.videoUrl]);

    const getVideoSource = () => {
        // For production: only return if we have a valid video URL
        if (hasValidVideoUrl()) {
            return video.videoUrl;
        }

        // For testing/development: fallback video
        // Remove this in production or make it configurable
        if (process.env.NODE_ENV === "development") {
            console.warn("Using fallback video for development");
            return "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4";
        }

        // Production: no fallback, return null
        return null;
    };

    const handleMouseEnter = useCallback(() => {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Only proceed if we have a valid video source
        const videoSource = getVideoSource();
        if (!videoSource) {
            return; // No video to play
        }

        // Delay hover effect to avoid excessive loading
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);

            if (videoRef.current && !videoError && videoSource) {
                videoRef.current.currentTime = 0;
                playPromiseRef.current = videoRef.current.play();

                if (playPromiseRef.current !== undefined) {
                    playPromiseRef.current
                        .then(() => {
                            // Video started playing successfully
                        })
                        .catch((err) => {
                            console.warn("Video play failed:", err);
                            setVideoError(true);
                            playPromiseRef.current = null;
                        });
                }
            }
        }, 200);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoError, hasValidVideoUrl]);

    const handleMouseLeave = useCallback(() => {
        // Clear hover timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        setIsHovering(false);
        cleanup();
    }, [cleanup]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const handleVideoLoadedData = useCallback(() => {
        setVideoLoaded(true);
        setVideoError(false);
    }, []);

    const handleVideoError = useCallback(() => {
        console.warn("Video failed to load:", video.videoUrl);
        setVideoError(true);
        setVideoLoaded(false);
    }, [video.videoUrl]);

    const shouldShowVideo = () => {
        const videoSource = getVideoSource();
        return videoSource && !videoError;
    };

    const shouldShowVideoFallback = () => {
        return !hasValidVideoUrl() || videoError;
    };

    return (
        <div className="flex flex-col">
            <Link href={`/shorts/${video.id}`} className="block">
                <div
                    className="relative w-full aspect-[9/16] group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {!isHovering && (
                        <>
                            {!imageError && video.thumbnail ? (
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    className="rounded-lg object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE4MTgxOCIvPjwvc3ZnPg=="
                                    loading="lazy"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-zinc-700/50 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-8 h-8 text-zinc-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-zinc-400 font-medium">
                                            {video.title.length > 15
                                                ? `${video.title.substring(0, 15)}...`
                                                : video.title}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1">No preview</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {isHovering && shouldShowVideo() && (
                        <>
                            <video
                                ref={videoRef}
                                src={getVideoSource()!}
                                className={cn(
                                    "absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 cursor-pointer",
                                    videoLoaded ? "opacity-100" : "opacity-0"
                                )}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onLoadedData={handleVideoLoadedData}
                                onError={handleVideoError}
                                poster={video.thumbnail || undefined}
                            />

                            {!videoLoaded && !videoError && (
                                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </>
                    )}

                    {isHovering && shouldShowVideoFallback() && (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-4 bg-zinc-700/30 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-zinc-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-zinc-400 font-medium mb-1">
                                    Video Unavailable
                                </p>
                                <p className="text-xs text-zinc-600">
                                    {!hasValidVideoUrl() ? "No video source" : "Failed to load"}
                                </p>
                                {process.env.NODE_ENV === "development" && !hasValidVideoUrl() && (
                                    <p className="text-xs text-yellow-600 mt-2">
                                        Dev: No videoUrl provided
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {video.length && !isHovering && (
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded transition-opacity duration-200">
                            {Math.floor(video.length / 60)}:
                            {(Math.floor(video.length) % 60).toString().padStart(2, "0")}
                        </div>
                    )}

                    {isHovering && videoLoaded && !videoError && shouldShowVideo() && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            LIVE
                        </div>
                    )}

                    {!isHovering && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {shouldShowVideo() ? (
                                    <svg
                                        className="w-6 h-6 text-white ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6 text-zinc-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex flex-col mt-2 space-y-1">
                <Link
                    href={`/shorts/${video.id}`}
                    onClick={() => {
                        cleanup();
                    }}
                    className="line-clamp-2 text-white text-sm hover:text-zinc-300 transition-colors duration-200"
                >
                    {video.title}
                </Link>
                <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-xs">
                        {formatNumberToSocialStyle(video.viewCnt)} views
                    </span>

                    {process.env.NODE_ENV === "development" && (
                        <span className="text-xs">
                            {hasValidVideoUrl() ? (
                                <span className="text-green-600">✓ Video</span>
                            ) : (
                                <span className="text-red-600">✗ No Video</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
