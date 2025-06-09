"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface CustomVideoPlayerProps {
    src: string;
    className?: string;
    autoPlay?: boolean;
    muted?: boolean;
    isVisible?: boolean;
}

export default function CustomVideoPlayer({
    src,
    className,
    autoPlay = false,
    muted = false,
    isVisible = false,
}: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);
    const attemptedPlayRef = useRef(false);
    const userInteractedRef = useRef(false);
    const hidePlayButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

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

    // Memoized format time function
    const formatTime = useCallback((time: number) => {
        if (!isFinite(time) || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    // Memoized progress percentage calculation
    const progressPercentage = useMemo(() => {
        return duration > 0 && isFinite(duration) && isFinite(currentTime)
            ? Math.max(0, Math.min((currentTime / duration) * 100, 100))
            : 0;
    }, [currentTime, duration]);

    // Debounced update duration function
    const updateDuration = useCallback(() => {
        if (videoRef.current?.duration) {
            const newDuration = videoRef.current.duration;
            if (isFinite(newDuration) && !isNaN(newDuration) && newDuration !== duration) {
                setDuration(newDuration);
            }
        }
    }, [duration]);

    // Optimized play function
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

    // Handle visibility changes with cleanup
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

    // Handle src changes with cleanup
    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        setVideoError(false);
        attemptedPlayRef.current = false;

        // Cancel any pending animation frames
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

    // Optimized user interaction handler
    useEffect(() => {
        const handleUserInteraction = () => {
            if (userInteractedRef.current) return; // Already registered

            userInteractedRef.current = true;

            if (!userPrefersMuted && videoRef.current && isPlaying) {
                videoRef.current.muted = false;
                setIsMuted(false);
            }

            // Remove listeners immediately after first interaction
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

    // Optimized toggle play
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

        // Clear existing timeout
        if (hidePlayButtonTimeoutRef.current) {
            clearTimeout(hidePlayButtonTimeoutRef.current);
        }

        setShowPlayButton(true);
        hidePlayButtonTimeoutRef.current = setTimeout(() => {
            setShowPlayButton(false);
            hidePlayButtonTimeoutRef.current = null;
        }, 800);
    }, [isPlaying, playVideo]);

    // Optimized toggle mute
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

    // Optimized fullscreen toggle
    const toggleFullscreen = useCallback(() => {
        if (!videoRef.current) return;

        userInteractedRef.current = true;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen();
        }
    }, []);

    // Optimized volume calculation
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

    // Optimized progress click handler
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

    // Optimized volume handlers
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

    // Video event handlers with cleanup
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Throttled time update using requestAnimationFrame
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

        // Add event listeners
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

    // Optimized mouse event handlers
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
        };

        document.addEventListener("mousemove", handleMouseMove, { passive: false });
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isDraggingVolume, duration, calculateVolumeFromPosition, volume, isMuted]);

    // Cleanup on unmount
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
            className={`relative w-full bg-black rounded-lg overflow-hidden group ${
                className || ""
            }`}
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
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                        ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                    </button>

                    <div
                        className={`flex items-center gap-1 rounded-full transition-all duration-300 overflow-hidden ${
                            showVolumeSlider ? "bg-white/20 pr-4" : "bg-transparent"
                        }`}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        <button
                            onClick={toggleMute}
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-white" />
                            )}
                        </button>

                        <div
                            className={`transition-all duration-300 ${
                                showVolumeSlider ? "w-32 opacity-100" : "w-0 opacity-0"
                            }`}
                        >
                            <div
                                className="py-3 px-2"
                                onMouseEnter={() => setIsHoveringVolume(true)}
                                onMouseLeave={() => setIsHoveringVolume(false)}
                            >
                                <div
                                    ref={volumeSliderRef}
                                    className="cursor-pointer relative h-6 flex items-center"
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
                                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                        />
                                        <div
                                            className={`absolute w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-all duration-75 shadow-md ${
                                                isHoveringVolume || isDraggingVolume
                                                    ? "scale-150"
                                                    : "scale-100"
                                            }`}
                                            style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                    <Maximize className="w-5 h-5 text-white" />
                </button>
            </div>

            {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center animate-ping">
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                        ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                        )}
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center gap-2 text-white text-xs mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <div
                    ref={progressBarRef}
                    className="relative w-full h-2 bg-white/30 rounded-full cursor-pointer"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                        handleProgressClick(e);
                    }}
                    onMouseEnter={() => setIsHoveringProgress(true)}
                    onMouseLeave={() => setIsHoveringProgress(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                    />
                    <div
                        className={`absolute w-4 h-4 bg-red-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-opacity duration-200 shadow-lg ${
                            isHoveringProgress || isDragging ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ left: `${progressPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
