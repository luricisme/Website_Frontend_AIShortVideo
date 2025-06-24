"use client";

import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisVertical, Hash } from "lucide-react";
import Image from "next/image";
import CustomVideoPlayer from "@/app/(user)/_components/custom-video-player";
import { PanelConfig } from "@/app/(user)/_components/right-panel";
import { useMediaQuery } from "@/hooks/use-media-query";

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
    isVisible: boolean;
    isShowRightPanel: boolean;
    panelConfigs: Record<string, PanelConfig>;
    onOpenPanel: (panel: PanelConfig) => void;
}

const VideoDetail = ({
    video,
    isVisible,
    isShowRightPanel,
    panelConfigs,
    onOpenPanel,
}: VideoDetailProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    const isCompactView = useMediaQuery("(max-width: 1249px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 380px)");
    const isExtraSmallScreen = useMediaQuery("(max-width: 350px)");

    const [actionStyles, setActionStyles] = useState({});
    const [isActionsOverlapping, setIsActionsOverlapping] = useState(false);

    const formatViews = (views: number) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)} Tr`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)} N`;
        }
        return views.toString();
    };

    useEffect(() => {
        const calculatePosition = () => {
            if (!videoContainerRef.current || !actionsRef.current) return;

            const videoRect = videoContainerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const actionsWidth = actionsRef.current.offsetWidth;

            const videoRightEdge = videoRect.right;
            const potentialRightEdge = videoRightEdge + actionsWidth + 20;

            const wouldOverlap = potentialRightEdge >= viewportWidth - 20;
            setIsActionsOverlapping(wouldOverlap);

            if (isExtraSmallScreen) {
                setActionStyles({
                    right: "5px",
                    bottom: "16px",
                });
                return;
            }

            if (isVerySmallScreen) {
                setActionStyles({
                    right: "5px",
                    bottom: "16px",
                });
                return;
            }

            if (isCompactView || wouldOverlap) {
                setActionStyles({
                    right: "8px",
                    bottom: "16px",
                    transform: "none",
                });
            } else {
                setActionStyles({
                    right: "-20px",
                    transform: "translateX(100%)",
                    bottom: "20px",
                });
            }
        };

        setTimeout(calculatePosition, 100);

        window.addEventListener("resize", calculatePosition);

        return () => {
            window.removeEventListener("resize", calculatePosition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerySmallScreen, isCompactView]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden" ref={videoRef}>
            <div
                className={`w-full h-full grid grid-cols-3 transition-transform duration-500 ease-in-out ${
                    !isCompactView && isShowRightPanel ? "transform -translate-x-1/3" : ""
                }`}
            >
                <div className={`${isCompactView ? "hidden" : "block"} mt-auto`}>
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
                                <span className="text-xs text-gray-400">
                                    @{video.author.username}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`flex items-center justify-center h-full relative ${
                        isCompactView ? "col-span-3" : ""
                    }`}
                >
                    <div
                        className="h-full max-h-[calc(100vh-120px)] flex items-center justify-center relative"
                        ref={videoContainerRef}
                    >
                        <CustomVideoPlayer
                            src={video.source}
                            autoPlay={true}
                            muted={false}
                            isVisible={isVisible}
                            isShowVideoInfo={isShowRightPanel}
                            video={video}
                            className="h-auto max-h-full aspect-[9/16]"
                            showMiniBanner={isCompactView}
                        />

                        <div
                            ref={actionsRef}
                            className={`absolute flex flex-col gap-3 items-center transition-all duration-300 ${
                                isActionsOverlapping ? "bg-black/20 p-2 rounded-lg" : ""
                            }`}
                            style={actionStyles}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col items-center gap-1 text-white text-sm">
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <Image
                                            src={"/icon/like-icon.svg"}
                                            alt="Like"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium">
                                        {formatViews(107000)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-1 text-white text-sm">
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <Image
                                            src={"/icon/dislike-icon.svg"}
                                            alt="Dislike"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium w-11 truncate">
                                        Không thích
                                    </span>
                                </div>

                                <button
                                    className="flex flex-col items-center gap-1 text-white text-sm"
                                    onClick={() => onOpenPanel(panelConfigs.comments)}
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <Image
                                            src={"/icon/comment-icon.svg"}
                                            alt="Comment"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium">604</span>
                                </button>

                                <button
                                    className="flex flex-col items-center gap-1 text-white text-sm"
                                    onClick={() => onOpenPanel(panelConfigs.share)}
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <Image
                                            src={"/icon/share-icon.svg"}
                                            alt="Share"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium truncate">
                                        Chia sẻ
                                    </span>
                                </button>

                                <button
                                    className="flex flex-col items-center gap-1 text-white text-sm"
                                    onClick={() => onOpenPanel(panelConfigs.details)}
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <EllipsisVertical className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium truncate">
                                        Chi tiết
                                    </span>
                                </button>

                                <div
                                    className="w-9 h-9 md:w-11 md:h-11 cursor-pointer mt-2"
                                    onClick={() => onOpenPanel(panelConfigs.playlist)}
                                >
                                    <Avatar className="w-9 h-9 md:w-11 md:h-11 rounded-md">
                                        <AvatarImage src={video.author.avatar} />
                                        <AvatarFallback>
                                            {video.author.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={isCompactView ? "hidden" : "block"}></div>
            </div>
        </div>
    );
};

export default VideoDetail;
