"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface CustomVideoPlayerProps {
    src: string;
    className?: string;
}

export default function CustomVideoPlayer({ src, className }: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const volumeSliderRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);

    // Toggle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setShowPlayButton(true);
                setTimeout(() => setShowPlayButton(false), 800);
            } else {
                videoRef.current.play();
                setShowPlayButton(true);
                setTimeout(() => setShowPlayButton(false), 800);
            }
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.muted = false;
                setIsMuted(false);
                // Restore previous volume if it was 0
                if (volume === 0) {
                    setVolume(0.5);
                    videoRef.current.volume = 0.5;
                }
            } else {
                videoRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarRef.current && videoRef.current && duration > 0) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = Math.max(0, Math.min((clickX / width) * duration, duration));
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // Handle progress bar drag
    const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (duration > 0) {
            setIsDragging(true);
            handleProgressClick(e);
        }
    };

    // Improved volume calculation function
    const calculateVolumeFromPosition = (clientX: number): number => {
        if (!volumeSliderRef.current) return volume;

        const rect = volumeSliderRef.current.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const width = rect.width;

        // Ensure we have a minimum width to prevent division by zero
        if (width <= 0) return volume;

        const newVolume = Math.max(0, Math.min(clickX / width, 1));
        return Math.round(newVolume * 100) / 100; // Round to 2 decimal places for smoother updates
    };

    // Updated volume click handler
    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const newVolume = calculateVolumeFromPosition(e.clientX);
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;

            // Handle mute state
            if (newVolume > 0 && isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            } else if (newVolume === 0 && !isMuted) {
                setIsMuted(true);
                videoRef.current.muted = true;
            }
        }
    };

    // Updated volume drag start handler
    const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingVolume(true);

        // Set initial volume position
        const newVolume = calculateVolumeFromPosition(e.clientX);
        setVolume(newVolume);

        if (videoRef.current) {
            videoRef.current.volume = newVolume;

            if (newVolume > 0 && isMuted) {
                setIsMuted(false);
                videoRef.current.muted = false;
            } else if (newVolume === 0 && !isMuted) {
                setIsMuted(true);
                videoRef.current.muted = true;
            }
        }
    };

    // Format time
    const formatTime = (time: number) => {
        if (!isFinite(time) || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Update duration when video loads or changes
    const updateDuration = () => {
        if (videoRef.current && videoRef.current.duration) {
            const newDuration = videoRef.current.duration;
            if (isFinite(newDuration) && !isNaN(newDuration)) {
                setDuration(newDuration);
            }
        }
    };

    // Video event handlers
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            updateDuration();
        };

        const handleLoadedData = () => {
            updateDuration();
        };

        const handleCanPlay = () => {
            updateDuration();
        };

        const handleDurationChange = () => {
            updateDuration();
        };

        const handleTimeUpdate = () => {
            if (!isDragging && video.currentTime !== undefined) {
                setCurrentTime(video.currentTime);
            }
            // Also update duration if it wasn't set before
            if (duration === 0) {
                updateDuration();
            }
        };

        const handlePlay = () => {
            setIsPlaying(true);
            updateDuration();
        };

        const handlePause = () => setIsPlaying(false);

        // Add multiple event listeners to ensure duration is captured
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("durationchange", handleDurationChange);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        // Try to get duration immediately if available
        updateDuration();

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("durationchange", handleDurationChange);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        };
    }, [isDragging, duration]);

    // Handle mouse events for dragging progress bar
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && progressBarRef.current && videoRef.current && duration > 0) {
                const rect = progressBarRef.current.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const newTime = Math.max(0, Math.min((clickX / width) * duration, duration));
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, duration]);

    // Improved volume dragging handler
    useEffect(() => {
        const handleVolumeMouseMove = (e: MouseEvent) => {
            if (isDraggingVolume && volumeSliderRef.current && videoRef.current) {
                const newVolume = calculateVolumeFromPosition(e.clientX);

                // Only update if there's a meaningful change (prevents micro-jitters)
                if (Math.abs(newVolume - volume) > 0.01) {
                    setVolume(newVolume);
                    videoRef.current.volume = newVolume;

                    // Handle mute state smoothly
                    if (newVolume > 0 && isMuted) {
                        setIsMuted(false);
                        videoRef.current.muted = false;
                    } else if (newVolume === 0 && !isMuted) {
                        setIsMuted(true);
                        videoRef.current.muted = true;
                    }
                }
            }
        };

        const handleVolumeMouseUp = () => {
            setIsDraggingVolume(false);
        };

        if (isDraggingVolume) {
            document.addEventListener("mousemove", handleVolumeMouseMove, { passive: false });
            document.addEventListener("mouseup", handleVolumeMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleVolumeMouseMove);
            document.removeEventListener("mouseup", handleVolumeMouseUp);
        };
    }, [isDraggingVolume, isMuted, volume]);

    // Safe progress percentage calculation
    const progressPercentage =
        duration > 0 && isFinite(duration) && isFinite(currentTime)
            ? Math.max(0, Math.min((currentTime / duration) * 100, 100))
            : 0;

    return (
        <div
            className={`relative w-full bg-black rounded-lg overflow-hidden group ${
                className || ""
            }`}
        >
            {/* Video with proper aspect ratio */}
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain cursor-pointer"
                autoPlay
                onClick={togglePlay}
                loop
                playsInline
                preload="metadata"
            />

            {/* Top Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center gap-2">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                        ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                    </button>

                    {/* Volume Control Container - Improved */}
                    <div
                        className={`flex items-center gap-1 rounded-full transition-all duration-300 overflow-hidden ${
                            showVolumeSlider ? "bg-white/20 pr-4" : "bg-transparent pl-0 pr-0"
                        }`}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        {/* Volume Button */}
                        <button
                            onClick={toggleMute}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-white" />
                            )}
                        </button>

                        {/* Volume Slider - Smoother version */}
                        <div
                            className={`transition-all duration-300 ease-out ${
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
                                    onMouseDown={handleVolumeMouseDown}
                                    onClick={handleVolumeClick}
                                    style={{ userSelect: "none" }}
                                >
                                    {/* Volume Track - Centered and easier to interact with */}
                                    <div className="w-full h-1 bg-white/40 rounded-full relative">
                                        {/* Volume Progress */}
                                        <div
                                            className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-75 ease-out"
                                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                        />
                                        {/* Volume Handle - Smoother transitions */}
                                        <div
                                            className={`absolute w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 top-1/2 transition-all duration-75 ease-out shadow-md ${
                                                isHoveringVolume || isDraggingVolume
                                                    ? "scale-150 shadow-lg"
                                                    : "scale-100"
                                            }`}
                                            style={{
                                                left: `${(isMuted ? 0 : volume) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fullscreen Button */}
                <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded-full hover:bg-white/20 cursor-pointer flex items-center justify-center transition-colors duration-200"
                >
                    <Maximize className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Center Play Button */}
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

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center gap-2 text-white text-xs mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                </div>

                <div
                    ref={progressBarRef}
                    className="relative w-full h-2 bg-white/30 rounded-full cursor-pointer group/progress"
                    onMouseDown={handleProgressMouseDown}
                    onMouseEnter={() => setIsHoveringProgress(true)}
                    onMouseLeave={() => setIsHoveringProgress(false)}
                >
                    {/* Progress Track */}
                    <div
                        className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all duration-150"
                        style={{ width: `${progressPercentage}%` }}
                    />

                    {/* Progress Handle - Always visible when hovering or dragging */}
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
