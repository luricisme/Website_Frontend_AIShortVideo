"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface TopInteractedVideo {
    title: string;
    totalInteraction: number;
    videoUrl: string;
}

interface FeaturedVideoCardProps {
    video: TopInteractedVideo;
    onClick?: () => void;
}

const FeaturedVideoCard = ({ video, onClick }: FeaturedVideoCardProps) => {
    const [isHovering, setIsHovering] = useState<boolean>(false);
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
        setVideoError(false);
        setVideoLoaded(false);
    }, [video.videoUrl]);

    const hasValidVideoUrl = useCallback(() => {
        return (
            video.videoUrl &&
            video.videoUrl.trim() !== "" &&
            (video.videoUrl.startsWith("http") || video.videoUrl.startsWith("/"))
        );
    }, [video.videoUrl]);

    const getVideoSource = () => {
        if (hasValidVideoUrl()) {
            return video.videoUrl;
        }
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
            return;
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
        <div
            className="bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-lg overflow-hidden transition-all h-120 duration-200 cursor-pointer group"
            onClick={onClick}
        >
            <div
                className="relative aspect-video h-100 bg-zinc-900 overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {!isHovering && (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
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
                            <p className="text-xs text-zinc-600 mt-1">Hover to preview</p>
                        </div>
                    </div>
                )}

                {isHovering && shouldShowVideo() && (
                    <>
                        <video
                            ref={videoRef}
                            src={getVideoSource()!}
                            className={cn(
                                "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 cursor-pointer",
                                videoLoaded ? "opacity-100" : "opacity-0"
                            )}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onLoadedData={handleVideoLoadedData}
                            onError={handleVideoError}
                        />

                        {!videoLoaded && !videoError && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </>
                )}

                {isHovering && shouldShowVideoFallback() && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
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
                        </div>
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

                {isHovering && videoLoaded && !videoError && shouldShowVideo() && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        LIVE
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">
                    {video.title}
                </h3>

                <div className="flex items-center justify-between">
                    <Badge
                        variant="secondary"
                        className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        {video.totalInteraction} interactions
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default FeaturedVideoCard;