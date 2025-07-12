import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Maximize, Pause, Play, PlayCircle, Volume2, VolumeX } from "lucide-react";

import { Video } from "@/types/video.types";

const VideoDetailPreview = ({ video }: { video: Video }) => {
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);

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

        // For testing/development: fallback video
        if (process.env.NODE_ENV === "development") {
            return "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4";
        }

        return null;
    };

    const handleImageError = useCallback(() => {
        console.log(">>> Modal thumbnail error for:", video.thumbnail);
        setImageError(true);
    }, [video.thumbnail]);

    const handleVideoError = useCallback(() => {
        console.log(">>> Modal video error for:", video.videoUrl);
        setVideoError(true);
        setIsVideoLoaded(false);
    }, [video.videoUrl]);

    const handleVideoLoadedData = useCallback(() => {
        console.log(">>> Modal video loaded:", video.videoUrl);
        setVideoError(false);
        setIsVideoLoaded(true);
    }, [video.videoUrl]);

    const handleVideoPlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handleVideoPause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const togglePlayPause = useCallback(() => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            playPromiseRef.current = videoRef.current.play();
            if (playPromiseRef.current !== undefined) {
                playPromiseRef.current
                    .then(() => {
                        // Video playing successfully
                    })
                    .catch((err) => {
                        console.warn("Video play failed:", err);
                        setVideoError(true);
                    });
            }
        }
    }, [isPlaying]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    useEffect(() => {
        setImageError(false);
        setVideoError(false);
        setIsVideoLoaded(false);
        setIsPlaying(false);
        setIsMuted(true);
    }, [video.id, video.thumbnail, video.videoUrl]);

    useEffect(() => {
        const videoRefCurrent = videoRef.current;
        return () => {
            if (playPromiseRef.current) {
                playPromiseRef.current
                    .then(() => {
                        if (videoRefCurrent) {
                            videoRefCurrent.pause();
                        }
                    })
                    .catch(() => {});
            }
        };
    }, []);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const handleFullscreenChange = () => {
            if (document.fullscreenElement === videoEl) {
                videoEl.style.width = "100vw";
                videoEl.style.height = "100vh";
                videoEl.style.objectFit = "contain";
                videoEl.style.backgroundColor = "#000";
            } else {
                videoEl.style.width = "";
                videoEl.style.height = "";
                videoEl.style.objectFit = "";
                videoEl.style.backgroundColor = "";
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const handleFullscreen = useCallback(() => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    }, []);

    const videoSource = getVideoSource();

    return (
        <div
            className="w-full rounded-lg overflow-hidden mb-4 bg-zinc-800 relative group
                       aspect-video sm:aspect-video md:aspect-[4/3] lg:aspect-video"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {videoSource && !videoError ? (
                <>
                    <video
                        ref={videoRef}
                        src={videoSource}
                        className="w-full h-full object-cover"
                        poster={video.thumbnail || undefined}
                        muted={isMuted}
                        loop
                        playsInline
                        onError={handleVideoError}
                        onLoadedData={handleVideoLoadedData}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onClick={togglePlayPause}
                    />

                    {isVideoLoaded && (
                        <div
                            className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${
                                showControls || !isPlaying ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <button
                                onClick={togglePlayPause}
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                                         bg-black/50 backdrop-blur-sm rounded-full 
                                         flex items-center justify-center text-white 
                                         hover:bg-black/70 transition-colors duration-200"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                ) : (
                                    <Play className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ml-0.5 sm:ml-1" />
                                )}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 
                                         w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
                                         bg-black/50 backdrop-blur-sm rounded-full 
                                         flex items-center justify-center text-white 
                                         hover:bg-black/70 transition-colors duration-200"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                ) : (
                                    <Volume2 className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                )}
                            </button>

                            <button
                                onClick={handleFullscreen}
                                className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4
                                       w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                                       bg-black/50 backdrop-blur-sm rounded-full
                                       flex items-center justify-center text-white
                                       hover:bg-black/70 transition-colors duration-200"
                                title="Toggle Fullscreen"
                            >
                                <Maximize className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            </button>

                            <div
                                className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 
                                          bg-green-500/90 backdrop-blur-sm text-white 
                                          text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full
                                          font-medium"
                            >
                                {isPlaying ? "Playing" : "Paused"}
                            </div>
                        </div>
                    )}

                    {!isVideoLoaded && !videoError && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                          border-2 border-white/30 border-t-white rounded-full animate-spin"
                            ></div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {!imageError && video.thumbnail ? (
                        <div className="relative w-full h-full">
                            <Image
                                key={`${video.id}-${video.thumbnail}`}
                                src={video.thumbnail}
                                fill
                                alt={video.title || "Video thumbnail"}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMzOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMzOCIgZmlsbD0iIzI3MjcyNyIvPjwvc3ZnPg=="
                                unoptimized={process.env.NODE_ENV === "development"}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 600px"
                            />

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                                <div className="text-center max-w-xs">
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                                                  mx-auto mb-2 sm:mb-3 
                                                  bg-black/50 backdrop-blur-sm rounded-full 
                                                  flex items-center justify-center"
                                    >
                                        <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <p className="text-white text-xs sm:text-sm font-medium mb-1">
                                        Thumbnail Only
                                    </p>
                                    <p className="text-white/70 text-xs">Video not available</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 
                                      flex items-center justify-center p-4"
                        >
                            <div className="text-center max-w-sm">
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                                              mx-auto mb-3 sm:mb-4 
                                              bg-zinc-700/30 rounded-full 
                                              flex items-center justify-center"
                                >
                                    {!video.thumbnail && !videoSource ? (
                                        <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-zinc-500" />
                                    ) : (
                                        <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-zinc-500" />
                                    )}
                                </div>
                                <h3
                                    className="text-sm sm:text-base md:text-lg font-medium text-zinc-300 mb-2 
                                             line-clamp-2 leading-tight"
                                >
                                    {video.title || "Untitled Video"}
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 mb-2">
                                    {!video.thumbnail && !videoSource
                                        ? "No media available"
                                        : !videoSource
                                        ? "Video not available"
                                        : "Failed to load media"}
                                </p>
                                {process.env.NODE_ENV === "development" && (
                                    <div className="text-xs text-yellow-600 space-y-1 break-all">
                                        <p className="truncate">
                                            Thumb: {video.thumbnail || "None"}
                                        </p>
                                        <p className="truncate">
                                            Video: {video.videoUrl || "None"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {video.length && (
                <div
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 
                              bg-black/70 backdrop-blur-sm text-white 
                              text-xs px-2 py-1 rounded font-medium"
                >
                    {Math.floor(video.length / 60)}:
                    {(Math.floor(video.length) % 60).toString().padStart(2, "0")}
                </div>
            )}
        </div>
    );
};

export default VideoDetailPreview;
