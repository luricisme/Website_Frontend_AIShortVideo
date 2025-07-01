"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { ChevronDown, ChevronUp, Hash, EllipsisVertical, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideosSkeleton() {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isCompactView = useMediaQuery("(max-width: 1249px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 380px)");
    const isExtraSmallScreen = useMediaQuery("(max-width: 350px)");

    const [actionStyles, setActionStyles] = useState({});
    const [isActionsOverlapping, setIsActionsOverlapping] = useState(false);

    useEffect(() => {
        const calculatePosition = () => {
            const viewportWidth = window.innerWidth;
            const actionsWidth = 60;

            const videoRightEdge = isCompactView ? viewportWidth : (viewportWidth / 3) * 2;
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
    }, [isVerySmallScreen, isCompactView, isExtraSmallScreen]);

    return (
        <div className="relative overflow-hidden bg-black">
            <div className="h-[calc(100vh-80px)] overflow-auto scrollbar-hide snap-y snap-mandatory">
                <div
                    className="h-full overflow-hidden"
                    style={{
                        height: `calc(100vh - 80px)`,
                        scrollSnapAlign: "start",
                        scrollSnapStop: "always",
                    }}
                >
                    <div className="relative w-full h-full bg-black overflow-hidden">
                        <div className="w-full h-full grid grid-cols-3 transition-transform duration-500 ease-in-out">
                            {/* Left Panel - Hidden on compact view */}
                            <div className={`${isCompactView ? "hidden" : "block"} mt-auto`}>
                                <div className="flex flex-col gap-2 p-4">
                                    {/* Tags skeleton */}
                                    <div className="flex items-center gap-2 text-neutral-400 bg-neutral-800/80 rounded-md px-4 py-2.5 w-fit">
                                        <Hash color="#a3a3a3" size={35} strokeWidth={2} />
                                        <div className="flex flex-wrap gap-2 text-sm max-w-full">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>

                                    {/* Title skeleton */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-8 w-3/4" />
                                        <Skeleton className="h-8 w-1/2" />
                                    </div>

                                    {/* Description skeleton */}
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>

                                    {/* User info skeleton */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <Skeleton className="w-8 h-8 rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Center Video Panel */}
                            <div
                                className={`flex items-center justify-center h-full relative ${
                                    isCompactView ? "col-span-3" : ""
                                }`}
                            >
                                <div className="h-full max-h-[calc(100vh-120px)] flex items-center justify-center relative w-full">
                                    {/* Video skeleton - Đảm bảo kích thước đúng */}
                                    <div
                                        className="relative bg-neutral-800 rounded-lg overflow-hidden"
                                        style={{
                                            width: "min(100vw, calc((100vh - 120px) * 9 / 16))",
                                            height: "calc(100vh - 120px)",
                                            maxHeight: "calc(100vh - 120px)",
                                            aspectRatio: "9/16",
                                        }}
                                    >
                                        <Skeleton className="w-full h-full" />

                                        {/* Play button overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center">
                                                <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" />
                                            </div>
                                        </div>

                                        {/* Video controls skeleton */}
                                        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 md:px-4 py-2 md:py-4 bg-gradient-to-b from-black/60 to-transparent">
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                                                <Skeleton className="w-20 md:w-32 h-8 md:h-10 rounded-full" />
                                            </div>
                                            <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                                        </div>

                                        {/* Progress bar skeleton */}
                                        <div className="absolute bottom-0 left-0 right-0 px-2 md:px-4 pb-2 md:pb-4 pt-10 bg-gradient-to-t from-black/60 to-transparent">
                                            <div className="flex items-center gap-1 md:gap-2 text-xs mb-1.5 md:mb-2">
                                                <Skeleton className="h-3 w-8" />
                                                <Skeleton className="h-3 w-1" />
                                                <Skeleton className="h-3 w-8" />
                                            </div>
                                            <div className="relative w-full h-1.5 md:h-2 bg-neutral-600 rounded-full">
                                                <Skeleton className="w-full h-full rounded-full" />
                                                <div className="absolute left-0 top-0 h-full bg-red-500 rounded-full w-1/3" />
                                            </div>
                                        </div>

                                        {/* Mini banner skeleton (compact view) */}
                                        {isCompactView && (
                                            <div className="absolute bottom-15 left-0 right-0 p-2 md:p-4 text-white z-20">
                                                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                                    <Skeleton className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
                                                    <Skeleton className="h-3 md:h-4 w-20" />
                                                    <Skeleton className="h-6 md:h-8 w-16 rounded-full" />
                                                </div>
                                                <Skeleton className="h-4 md:h-5 w-3/4 mb-0.5 md:mb-1" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-3 md:h-4 w-full" />
                                                    <Skeleton className="h-3 md:h-4 w-2/3" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Video info overlay for non-compact view */}
                                        {!isCompactView && !isMobile && (
                                            <div className="absolute hidden md:block md:bottom-15 left-0 right-0 p-2 md:p-4 text-white z-20">
                                                <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                                                    <Skeleton className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
                                                    <Skeleton className="h-3 md:h-4 w-20" />
                                                    <Skeleton className="h-6 md:h-8 w-16 rounded-full" />
                                                </div>
                                                <Skeleton className="h-4 md:h-5 w-3/4 mb-0.5 md:mb-1" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-3 md:h-4 w-full" />
                                                    <Skeleton className="h-3 md:h-4 w-2/3" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons skeleton */}
                                    <div
                                        className={`absolute flex flex-col gap-3 items-center transition-all duration-300 z-20 ${
                                            isActionsOverlapping ? "bg-black/20 p-2 rounded-lg" : ""
                                        }`}
                                        style={actionStyles}
                                    >
                                        <div className="flex flex-col gap-2">
                                            {/* Like button skeleton */}
                                            <div className="flex flex-col items-center gap-1">
                                                <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
                                                <Skeleton className="h-3 md:h-4 w-6" />
                                            </div>

                                            {/* Dislike button skeleton */}
                                            <div className="flex flex-col items-center gap-1">
                                                <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
                                                <Skeleton className="h-3 md:h-4 w-8" />
                                            </div>

                                            {/* Comment button skeleton */}
                                            <div className="flex flex-col items-center gap-1">
                                                <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
                                                <Skeleton className="h-3 md:h-4 w-4" />
                                            </div>

                                            {/* Share button skeleton */}
                                            <div className="flex flex-col items-center gap-1">
                                                <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-full" />
                                                <Skeleton className="h-3 md:h-4 w-8" />
                                            </div>

                                            {/* Details button skeleton */}
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-muted flex items-center justify-center relative">
                                                    <Skeleton className="w-full h-full rounded-full" />
                                                    <EllipsisVertical className="absolute w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                                </div>
                                                <Skeleton className="h-3 md:h-4 w-6" />
                                            </div>

                                            {/* Avatar skeleton */}
                                            <Skeleton className="w-9 h-9 md:w-11 md:h-11 rounded-md mt-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Hidden on compact view */}
                            <div className={isCompactView ? "hidden" : "block"}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation buttons - Hidden on mobile */}
            {!isMobile && (
                <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
                    <button className="p-2 rounded-full bg-black/40 opacity-40 cursor-not-allowed">
                        <ChevronUp size={24} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                        <ChevronDown size={24} className="text-neutral-400" />
                    </button>
                </div>
            )}

            {/* Enhanced Loading indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="flex flex-col items-center space-y-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-600 border-t-white"></div>
                    <div className="text-white text-sm font-medium">Đang tải video...</div>
                </div>
            </div>
        </div>
    );
}
