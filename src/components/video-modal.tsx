"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X, Heart, MessageCircle, Share, MoreHorizontal, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

type VideoModalProps = {
    video: {
        id: number;
        title: string;
        description: string;
        thumbnail: string;
        source: string;
        duration: number;
        views: number;
        likes?: number;
        comments?: number;
        author: {
            id: number;
            name: string;
            username: string;
            avatar: string;
        };
    };
};

const VideoModal = ({ video }: VideoModalProps) => {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                router.back();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [router]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, []);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    const formatCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => router.back()} />

            {/* Modal Content */}
            <div className="relative w-full h-full max-w-md mx-auto bg-black flex flex-col">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <MoreHorizontal size={24} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="flex-1 relative">
                    <video
                        ref={videoRef}
                        src={video.source}
                        className="w-full h-full object-cover cursor-pointer"
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={handleVideoClick}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />

                    {/* Play/Pause Overlay */}
                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={handleVideoClick}
                        >
                            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                            </div>
                        </div>
                    )}

                    {/* Volume Control */}
                    <button
                        onClick={toggleMute}
                        className="absolute bottom-20 left-4 text-white hover:text-gray-300 transition-colors"
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>

                    {/* Right Side Actions */}
                    <div className="absolute bottom-20 right-4 flex flex-col space-y-4">
                        {/* Author Avatar */}
                        <div className="relative">
                            <Image
                                src={video.author.avatar}
                                alt={video.author.name}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-white"
                            />
                            {!isFollowing && (
                                <button
                                    onClick={() => setIsFollowing(true)}
                                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#7C4DFF] rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-[#6C3CE6] transition-colors"
                                >
                                    +
                                </button>
                            )}
                        </div>

                        {/* Like Button */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`text-white hover:text-gray-300 transition-colors ${
                                    isLiked ? "text-red-500" : ""
                                }`}
                            >
                                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                            </button>
                            <span className="text-white text-xs mt-1">
                                {formatCount((video.likes || 0) + (isLiked ? 1 : 0))}
                            </span>
                        </div>

                        {/* Comment Button */}
                        <div className="flex flex-col items-center">
                            <button className="text-white hover:text-gray-300 transition-colors">
                                <MessageCircle size={28} />
                            </button>
                            <span className="text-white text-xs mt-1">
                                {formatCount(video.comments || 0)}
                            </span>
                        </div>

                        {/* Share Button */}
                        <div className="flex flex-col items-center">
                            <button className="text-white hover:text-gray-300 transition-colors">
                                <Share size={28} />
                            </button>
                            <span className="text-white text-xs mt-1">Share</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="text-white">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">@{video.author.username}</span>
                            {isFollowing && (
                                <span className="text-gray-400 text-sm">• Following</span>
                            )}
                        </div>
                        <p className="text-sm mb-2">{video.title}</p>
                        {video.description && (
                            <p className="text-sm text-gray-300 line-clamp-2">
                                {video.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
