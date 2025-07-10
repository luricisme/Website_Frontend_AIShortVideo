"use client";

import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { User } from "@/types/user.types";
import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useIncrementVideoViewCountMutation } from "@/queries/useVideo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomVideoPlayerProps {
    src: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    isVisible?: boolean;
    isShowVideoInfo?: boolean;
    video?: Video;
    showMiniBanner?: boolean;
    isFollowing: boolean; // Thêm prop này nếu cần
    onFollowClick?: () => void; // Callback khi nhấn nút theo dõi
    user?: User;
}

const THRESHOLD_SECONDS = 5; // Ngưỡng thời gian tính view cho video ngắn

export default function CustomVideoPlayer({
    src,
    className,
    autoPlay = false,
    muted = false,
    isVisible = false,
    isShowVideoInfo = false,
    video = undefined,
    showMiniBanner = false,
    isFollowing,
    onFollowClick = () => {},
    user = undefined,
}: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);
    const attemptedPlayRef = useRef(false);
    const userInteractedRef = useRef(false);
    const hidePlayButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const isMobile = useMediaQuery("(max-width: 640px)");
    const is340pxScreen = useMediaQuery("(max-width: 340px)");

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(muted);
    const [userPrefersMuted, setUserPrefersMuted] = useState(muted);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [firstPlayAttempt, setFirstPlayAttempt] = useState(true);
    const [showControls, setShowControls] = useState(false);

    // State để theo dõi việc đã tính view
    // const [viewCounted, setViewCounted] = useState(false);
    const viewingTimeRef = useRef<number>(0);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const apiCalledRef = useRef<boolean>(false);

    const incrementViewMutation = useIncrementVideoViewCountMutation();

    const getViewThreshold = (videoDuration: number) => {
        if (videoDuration <= THRESHOLD_SECONDS) {
            return Math.max(videoDuration * 0.5, 1);
        } else if (videoDuration <= 10) {
            return 3;
        } else {
            return THRESHOLD_SECONDS;
        }
    };

    const callViewCountAPI = (videoId: number | string, reason: string) => {
        if (apiCalledRef.current) {
            // console.log(">>> API already called, skipping...");
            return;
        }

        console.log(`>>> 🎯 CALLING VIEW API for reason: ${reason}`);
        apiCalledRef.current = true;
        // setViewCounted(true);

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        incrementViewMutation.mutate(videoId);
        // console.log(`✅ View counted for video ${videoId} - ${reason}`);
    };

    useEffect(() => {
        // console.log(">>> Main effect triggered");

        if (!isVisible || !video?.id || apiCalledRef.current || duration === 0) {
            // console.log(">>> Early return:", {
            //     isVisible,
            //     videoId: video?.id,
            //     apiCalled: apiCalledRef.current,
            //     duration,
            // });
            return;
        }

        const viewThreshold = getViewThreshold(duration);

        // console.log(">>> Video setup:", {
        //     videoId: video.id,
        //     duration,
        //     viewThreshold,
        //     isPlaying,
        //     apiCalled: apiCalledRef.current,
        // });

        if (intervalIdRef.current) {
            // console.log(">>> Clearing existing interval");
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        if (isPlaying && !apiCalledRef.current) {
            // console.log(">>> Creating interval for view counting");

            intervalIdRef.current = setInterval(() => {
                // console.log(">>> === INTERVAL TICK ===");

                // Kiểm tra lại để tránh race condition
                if (apiCalledRef.current) {
                    // console.log(">>> Stopping interval - API already called");
                    if (intervalIdRef.current) {
                        clearInterval(intervalIdRef.current);
                        intervalIdRef.current = null;
                    }
                    return;
                }

                viewingTimeRef.current += 1;
                // console.log(">>> Interval tick - viewing time:", viewingTimeRef.current);

                // Kiểm tra nếu đạt ngưỡng và chưa tính view
                if (viewingTimeRef.current >= viewThreshold && !apiCalledRef.current) {
                    // console.log(">>> 🎯 Calling API from interval");
                    callViewCountAPI(video.id, `interval-based after ${viewingTimeRef.current}s`);
                }
            }, 1000);

            // console.log(">>> Interval created with ID:", intervalIdRef.current);
        } else {
            // console.log(">>> Not creating interval:", {
            //     isPlaying,
            //     apiCalled: apiCalledRef.current,
            // });
        }

        return () => {
            // console.log(">>> Cleanup function called");
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible, video?.id, duration, isPlaying]);

    useEffect(() => {
        if (!apiCalledRef.current && video?.id && duration > 0 && currentTime > 0) {
            const viewThreshold = getViewThreshold(duration);
            const watchedPercentage = (currentTime / duration) * 100;

            if (watchedPercentage >= 80) {
                // console.log(">>> Short video progress:", {
                //     watchedPercentage: watchedPercentage.toFixed(1) + "%",
                //     viewingTime: viewingTimeRef.current,
                //     threshold: viewThreshold,
                //     apiCalled: apiCalledRef.current,
                // });
            }

            if (
                watchedPercentage >= 90 &&
                viewingTimeRef.current >= viewThreshold &&
                !apiCalledRef.current
            ) {
                // console.log(">>> 🎯 Calling API for short video");
                callViewCountAPI(video.id, `short video ${watchedPercentage.toFixed(1)}%`);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, duration, video?.id]);

    useEffect(() => {
        // console.log(">>> 🔄 Resetting for new video/src");
        // setViewCounted(false);
        viewingTimeRef.current = 0;
        apiCalledRef.current = false;

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }, [src, video?.id]);

    const formatTime = useCallback((time: number) => {
        if (!isFinite(time) || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    const progressPercentage = useMemo(() => {
        return duration > 0 && isFinite(duration) && isFinite(currentTime)
            ? Math.max(0, Math.min((currentTime / duration) * 100, 100))
            : 0;
    }, [currentTime, duration]);

    const updateDuration = useCallback(() => {
        if (videoRef.current?.duration) {
            const newDuration = videoRef.current.duration;
            if (isFinite(newDuration) && !isNaN(newDuration) && newDuration !== duration) {
                setDuration(newDuration);
            }
        }
    }, [duration]);

    const handleMouseEnter = useCallback(() => {
        setShowControls(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!isDragging && !isDraggingVolume) {
            setShowControls(false);
        }
    }, [isDragging, isDraggingVolume]);

    const playVideo = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (firstPlayAttempt) {
                video.muted = true;
                setIsMuted(true);
            } else {
                video.muted = userPrefersMuted;
                setIsMuted(userPrefersMuted);
            }

            await video.play();
            setIsPlaying(true);
            setVideoError(false);

            if (firstPlayAttempt) {
                setFirstPlayAttempt(false);
                if (!userPrefersMuted && userInteractedRef.current) {
                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current.muted = false;
                            setIsMuted(false);
                        }
                    }, 500);
                }
            }
        } catch (error) {
            console.warn("Không thể phát video:", error);
            setVideoError(true);
            setIsPlaying(false);
        }
    }, [firstPlayAttempt, userPrefersMuted]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isVisible && autoPlay && !attemptedPlayRef.current) {
            attemptedPlayRef.current = true;
            playVideo();
        } else if (!isVisible && isPlaying) {
            video.pause();
            setIsPlaying(false);
        }
    }, [isVisible, autoPlay, playVideo, isPlaying]);

    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setVideoError(false);
        attemptedPlayRef.current = false;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        const timeoutId = setTimeout(() => {
            if (isVisible && autoPlay && videoRef.current) {
                playVideo();
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [src, isVisible, autoPlay, playVideo]);

    useEffect(() => {
        const handleUserInteraction = () => {
            if (userInteractedRef.current) return;

            userInteractedRef.current = true;

            if (!userPrefersMuted && videoRef.current && isPlaying) {
                videoRef.current.muted = false;
                setIsMuted(false);
            }

            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
            document.removeEventListener("keydown", handleUserInteraction);
        };

        if (!userInteractedRef.current) {
            document.addEventListener("click", handleUserInteraction, { passive: true });
            document.addEventListener("touchstart", handleUserInteraction, { passive: true });
            document.addEventListener("keydown", handleUserInteraction);
        }

        return () => {
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
            document.removeEventListener("keydown", handleUserInteraction);
        };
    }, [isPlaying, userPrefersMuted]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        userInteractedRef.current = true;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
        } else {
            playVideo();
        }

        if (hidePlayButtonTimeoutRef.current) {
            clearTimeout(hidePlayButtonTimeoutRef.current);
        }

        setShowPlayButton(true);
        hidePlayButtonTimeoutRef.current = setTimeout(() => {
            setShowPlayButton(false);
            hidePlayButtonTimeoutRef.current = null;
        }, 800);

        setShowControls(true);
    }, [isPlaying, playVideo]);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        userInteractedRef.current = true;

        const newMutedState = !isMuted;
        video.muted = newMutedState;
        setIsMuted(newMutedState);
        setUserPrefersMuted(newMutedState);

        if (!newMutedState && volume === 0) {
            setVolume(0.5);
            video.volume = 0.5;
        }
    }, [isMuted, volume]);

    const toggleFullscreen = useCallback(() => {
        if (!videoRef.current) return;

        userInteractedRef.current = true;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    }, []);

    const calculateVolumeFromPosition = useCallback(
        (clientX: number): number => {
            if (!volumeSliderRef.current) return volume;

            const rect = volumeSliderRef.current.getBoundingClientRect();
            const clickX = clientX - rect.left;
            const width = rect.width;

            if (width <= 0) return volume;

            return Math.max(0, Math.min(clickX / width, 1));
        },
        [volume]
    );

    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            userInteractedRef.current = true;

            if (progressBarRef.current && videoRef.current && duration > 0) {
                const rect = progressBarRef.current.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const newTime = Math.max(0, Math.min((clickX / width) * duration, duration));
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        },
        [duration]
    );

    const handleVolumeClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            userInteractedRef.current = true;

            const newVolume = calculateVolumeFromPosition(e.clientX);
            setVolume(newVolume);

            if (videoRef.current) {
                videoRef.current.volume = newVolume;

                if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                    setUserPrefersMuted(false);
                    videoRef.current.muted = false;
                } else if (newVolume === 0 && !isMuted) {
                    setIsMuted(true);
                    setUserPrefersMuted(true);
                    videoRef.current.muted = true;
                }
            }
        },
        [calculateVolumeFromPosition, isMuted]
    );

    const handleTouchStart = useCallback(() => {
        setShowControls(true);
    }, []);

    const handleTouchEnd = useCallback(() => {
        setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (!isDragging && video.currentTime !== currentTime) {
                animationFrameRef.current = requestAnimationFrame(() => {
                    setCurrentTime(video.currentTime);
                    if (duration === 0) updateDuration();
                });
            }
        };

        const handlePlay = () => {
            setIsPlaying(true);
            updateDuration();
        };

        const handlePause = () => setIsPlaying(false);

        const handleEnded = () => {
            if (isVisible) {
                video.currentTime = 0;
                if (!userPrefersMuted && !firstPlayAttempt && userInteractedRef.current) {
                    video.muted = false;
                    setIsMuted(false);
                }
                video.play().catch((err) => console.warn("Phát lại tự động thất bại:", err));
            }
        };

        const handleError = () => {
            setVideoError(true);
            setIsPlaying(false);
        };

        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("loadeddata", updateDuration);
        video.addEventListener("canplay", updateDuration);
        video.addEventListener("durationchange", updateDuration);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);
        video.addEventListener("error", handleError);

        updateDuration();

        return () => {
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("loadeddata", updateDuration);
            video.removeEventListener("canplay", updateDuration);
            video.removeEventListener("durationchange", updateDuration);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
            video.removeEventListener("error", handleError);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [
        isDragging,
        duration,
        isVisible,
        userPrefersMuted,
        firstPlayAttempt,
        currentTime,
        updateDuration,
    ]);

    useEffect(() => {
        if (!isDragging && !isDraggingVolume) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && progressBarRef.current && videoRef.current && duration > 0) {
                const rect = progressBarRef.current.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const newTime = Math.max(0, Math.min((clickX / width) * duration, duration));
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }

            if (isDraggingVolume && volumeSliderRef.current && videoRef.current) {
                const newVolume = calculateVolumeFromPosition(e.clientX);
                if (Math.abs(newVolume - volume) > 0.01) {
                    setVolume(newVolume);
                    videoRef.current.volume = newVolume;

                    if (newVolume > 0 && isMuted) {
                        setIsMuted(false);
                        setUserPrefersMuted(false);
                        videoRef.current.muted = false;
                    } else if (newVolume === 0 && !isMuted) {
                        setIsMuted(true);
                        setUserPrefersMuted(true);
                        videoRef.current.muted = true;
                    }
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsDraggingVolume(false);

            if (!isMobile) {
                setTimeout(() => setShowControls(false), 2000);
            }
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: false });
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        isDragging,
        isDraggingVolume,
        duration,
        calculateVolumeFromPosition,
        volume,
        isMuted,
        isMobile,
    ]);

    useEffect(() => {
        return () => {
            if (hidePlayButtonTimeoutRef.current) {
                clearTimeout(hidePlayButtonTimeoutRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`relative h-full w-full bg-black rounded-lg overflow-hidden ${
                className || ""
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                loop
                playsInline
                preload="metadata"
                muted={isMuted}
            />

            {(!isPlaying || videoError) && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" />
                    </div>
                </div>
            )}

            <div
                className={`absolute top-0 left-0 right-0 flex justify-between items-center px-2 md:px-4 py-2 md:py-4 bg-gradient-to-b from-black/60 to-transparent z-10
                    transition-opacity duration-300 ${
                        showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    }`}
            >
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        ) : (
                            <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" />
                        )}
                    </button>

                    <div
                        className={`flex items-center gap-1 rounded-full transition-all duration-300 overflow-hidden ${
                            showVolumeSlider && !isMobile
                                ? "bg-white/20 pr-2 md:pr-4"
                                : "bg-transparent"
                        }`}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        <button
                            onClick={toggleMute}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            ) : (
                                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            )}
                        </button>

                        {!isMobile && (
                            <div
                                className={`transition-all duration-300 ${
                                    showVolumeSlider ? "w-20 md:w-32 opacity-100" : "w-0 opacity-0"
                                }`}
                            >
                                <div
                                    className="py-2 md:py-3 px-1 md:px-2"
                                    onMouseEnter={() => setIsHoveringVolume(true)}
                                    onMouseLeave={() => setIsHoveringVolume(false)}
                                >
                                    <div
                                        ref={volumeSliderRef}
                                        className="cursor-pointer relative h-5 md:h-6 flex items-center"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDraggingVolume(true);
                                            handleVolumeClick(e);
                                        }}
                                        onClick={handleVolumeClick}
                                    >
                                        <div className="w-full h-1 bg-white/40 rounded-full relative">
                                            <div
                                                className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-75"
                                                style={{
                                                    width: `${(isMuted ? 0 : volume) * 100}%`,
                                                }}
                                            />
                                            <div
                                                className={`absolute w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-all duration-75 shadow-md ${
                                                    isHoveringVolume || isDraggingVolume
                                                        ? "scale-125 md:scale-150"
                                                        : "scale-100"
                                                }`}
                                                style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                    <Maximize className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
            </div>

            {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/50 flex items-center justify-center animate-ping">
                        {isPlaying ? (
                            <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        ) : (
                            <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                        )}
                    </div>
                </div>
            )}

            {showMiniBanner && video && (
                <div className="absolute bottom-15 left-0 right-0 p-2 md:p-4 text-white z-20 ">
                    <div
                        className={`flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap ${
                            is340pxScreen ? "max-w-[200px]" : "max-w-[300px]"
                        } md:max-w-[280px]`}
                    >
                        <Avatar className="w-6 h-6 md:w-8 md:h-8">
                            <AvatarImage src={video.user?.avatar || undefined} />
                            <AvatarFallback>{video.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <p className="text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                            @{video.user.username}
                        </p>

                        {user?.id && (
                            <Button
                                size="sm"
                                className="rounded-full font-semibold text-[10px] md:text-xs py-0.5 px-2 md:py-1 md:px-3 h-6 md:h-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert("is following: " + isFollowing);
                                    // Handle follow action here
                                    onFollowClick(); // Call the provided callback
                                }}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </div>

                    <h2 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1 line-clamp-1 md:max-w-[270px] max-w-[265px]">
                        {video.title}
                    </h2>

                    <p className="text-xs md:text-sm line-clamp-2 max-w-[265px] md:max-w-[270px]">
                        {video.script}
                    </p>
                </div>
            )}

            <div
                className={`absolute bottom-0 left-0 right-0 px-2 md:px-4 pb-2 md:pb-4 pt-10 bg-gradient-to-t from-black/60 to-transparent z-10
                    transition-opacity duration-300 ${
                        showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    }`}
            >
                <div className="flex items-center gap-1 md:gap-2 text-white text-[10px] md:text-xs mb-1.5 md:mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <div
                    ref={progressBarRef}
                    className="relative w-full h-1.5 md:h-2 bg-white/30 rounded-full cursor-pointer touch-none"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                        handleProgressClick(e);
                    }}
                    onTouchStart={(e) => {
                        const touch = e.touches[0];
                        if (progressBarRef.current && videoRef.current && duration > 0) {
                            const rect = progressBarRef.current.getBoundingClientRect();
                            const touchX = touch.clientX - rect.left;
                            const width = rect.width;
                            const newTime = Math.max(
                                0,
                                Math.min((touchX / width) * duration, duration)
                            );
                            videoRef.current.currentTime = newTime;
                            setCurrentTime(newTime);
                        }
                    }}
                    onMouseEnter={() => setIsHoveringProgress(true)}
                    onMouseLeave={() => setIsHoveringProgress(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                    />
                    <div
                        className={`absolute w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-opacity duration-200 shadow-lg ${
                            isHoveringProgress || isDragging ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ left: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {isShowVideoInfo && !isMobile && (
                <div className="absolute hidden md:block md:bottom-15 left-0 right-0 p-2 md:p-4 text-white z-20">
                    <div
                        className={`flex items-center gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap ${
                            is340pxScreen ? "max-w-[200px]" : "max-w-[300px]"
                        } md:max-w-[280px]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Avatar className="w-6 h-6 md:w-8 md:h-8">
                            <AvatarImage src={video?.user.avatar || undefined} />
                            <AvatarFallback>{video?.user.username.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <p className="text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                            @{video?.user.username}
                        </p>

                        {user?.id && (
                            <Button
                                size="sm"
                                className="rounded-full font-semibold text-[10px] md:text-xs py-0.5 px-2 md:py-1 md:px-3 h-6 md:h-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFollowClick(); // Call the provided callback
                                }}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </div>

                    <h2 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1 line-clamp-1 md:max-w-[270px] max-w-[265px]">
                        {video?.title}
                    </h2>

                    <p className="text-xs md:text-sm line-clamp-2 md:max-w-[270px] max-w-[265px]">
                        {video?.script}
                    </p>
                </div>
            )}
        </div>
    );
}
