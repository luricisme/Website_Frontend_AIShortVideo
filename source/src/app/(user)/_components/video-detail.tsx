"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, Hash } from "lucide-react";
import Image from "next/image";
import CustomVideoPlayer from "@/app/(user)/_components/custom-video-player";

export type VideoType = {
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

interface VideoDetailProps {
    video: VideoType;
}

const VideoDetail = ({ video }: VideoDetailProps) => {
    // State để kiểm soát hiển thị video
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef<HTMLDivElement>(null);

    // Hàm định dạng số lượt xem
    const formatViews = (views: number) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)} Tr`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)} N`;
        }
        return views.toString();
    };

    // Theo dõi khi nào video visible để phát/dừng
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Đặt ngưỡng cao hơn để đảm bảo video chỉ hiển thị khi gần như toàn bộ nó nằm trong viewport
                setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.8);
            },
            { threshold: [0.8, 0.9] }
        );

        const currentRef = videoRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div className="grid grid-cols-3 h-full" ref={videoRef}>
            <div className="mt-auto">
                <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2 text-gray-400 bg-sidebar/80 rounded-md px-4 py-2.5 w-fit">
                        <Hash color="#fff" size={35} strokeWidth={2} />
                        <div className="flex flex-col text-sm">
                            <span className="text-white font-medium cursor-pointer hover:underline">
                                shorts
                            </span>
                            <span>{formatViews(video.views)} video</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
                    <p className="text-sm text-gray-400">{video.description}</p>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={video.author.avatar} />
                            <AvatarFallback>{video.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                                {video.author.name}
                            </span>
                            <span className="text-xs text-gray-400">@{video.author.username}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 h-full">
                <CustomVideoPlayer
                    src={video.source}
                    autoPlay={true}
                    muted={false}
                    isVisible={isVisible}
                />
                <div className="flex flex-col justify-end gap-3 mb-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/like-icon.svg"}
                                    alt="Like"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-medium">{formatViews(107000)}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/dislike-icon.svg"}
                                    alt="Dislike"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-medium w-11 truncate">Không thích</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/comment-icon.svg"}
                                    alt="Comment"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-medium">604</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Image
                                    src={"/icon/share-icon.svg"}
                                    alt="Share"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-medium truncate">Chia sẻ</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white text-sm">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <EllipsisVertical />
                            </div>
                        </div>
                    </div>
                    <Avatar className="w-11 h-11 rounded-md">
                        <AvatarImage src={video.author.avatar} />
                        <AvatarFallback>{video.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default VideoDetail;
