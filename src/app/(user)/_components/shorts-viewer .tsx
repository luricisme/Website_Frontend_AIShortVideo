"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Video } from "@/types/video.types";
import { useDebounce } from "@/hooks/use-debounce";
import { useMediaQuery } from "@/hooks/use-media-query";
import VideoDetail from "@/app/(user)/_components/video-detail";
import { useBodyScroll, useScrollContainer } from "@/hooks/use-body-scroll";
import RightPanel, { PanelConfig } from "@/app/(user)/_components/right-panel";
import {
    CommentsPanel,
    DetailsPanel,
    SharePanel,
    PlaylistPanel,
} from "@/app/(user)/_components/panel-contents";

interface ShortsViewerProps {
    videos: Video[];
    initialVideoIndex?: number;
    updateUrl?: boolean;
    urlPath?: string;
}

const ShortsViewer = ({
    videos,
    initialVideoIndex = 0,
    updateUrl = false,
    urlPath = "/shorts",
}: ShortsViewerProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isCompactView = useMediaQuery("(max-width: 1249px)");

    useBodyScroll(true); // Ẩn scroll của body
    const scrollContainerClass = useScrollContainer({
        height: "h-[calc(100vh-80px)]",
        hideScrollbar: true,
        snapType: "snap-y",
        snapStrictness: "snap-mandatory",
    });

    const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);

    const [isShowRightPanel, setIsShowRightPanel] = useState(false);
    const [isPanelVisible, setIsPanelVisible] = useState(false);
    const [currentPanel, setCurrentPanel] = useState<PanelConfig | null>(null);
    const currentPanelTitleRef = useRef<string | null>(null);

    const panelTimerRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const HEADER_HEIGHT = 80;
    const [isScrolling, setIsScrolling] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, videos.length);
    }, [videos]);

    useEffect(() => {
        if (!hasInitialized) return;

        if (!updateUrl) return;

        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current);
        }

        urlUpdateTimeoutRef.current = setTimeout(() => {
            const videoId = videos[currentVideoIndex].id;
            window.history.replaceState({ id: videoId }, "", `${urlPath}/${videoId}`);
        }, 300);

        return () => {
            if (urlUpdateTimeoutRef.current) {
                clearTimeout(urlUpdateTimeoutRef.current);
            }
        };
    }, [currentVideoIndex, videos, hasInitialized, updateUrl, urlPath]);

    const handleScrollDebounced = useCallback(() => {
        if (!containerRef.current || isScrolling) return;

        const scrollPosition = containerRef.current.scrollTop;
        const viewportHeight = window.innerHeight - HEADER_HEIGHT;
        const index = Math.round(scrollPosition / viewportHeight);

        if (index !== currentVideoIndex && index >= 0 && index < videos.length) {
            setCurrentVideoIndex(index);
        }
    }, [currentVideoIndex, videos.length, isScrolling]);

    const debouncedScroll = useDebounce(handleScrollDebounced, 50);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", debouncedScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", debouncedScroll);
            }
        };
    }, [debouncedScroll]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (isScrolling || !containerRef.current) return;

            setIsScrolling(true);

            const direction = e.deltaY > 0 ? 1 : -1;
            let nextIndex = currentVideoIndex + direction;

            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex >= videos.length) nextIndex = videos.length - 1;

            if (nextIndex !== currentVideoIndex) {
                const viewportHeight = window.innerHeight - HEADER_HEIGHT;
                const targetPosition = nextIndex * viewportHeight;

                containerRef.current.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });

                setCurrentVideoIndex(nextIndex);
            }

            setTimeout(() => {
                setIsScrolling(false);
            }, 800);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener("wheel", handleWheel);
            }
        };
    }, [currentVideoIndex, videos.length, isScrolling]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isScrolling || !containerRef.current) return;

            let nextIndex = currentVideoIndex;

            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                nextIndex = Math.min(currentVideoIndex + 1, videos.length - 1);
            } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                nextIndex = Math.max(currentVideoIndex - 1, 0);
            } else {
                return;
            }

            if (nextIndex !== currentVideoIndex) {
                setIsScrolling(true);

                const viewportHeight = window.innerHeight - HEADER_HEIGHT;
                containerRef.current.scrollTo({
                    top: nextIndex * viewportHeight,
                    behavior: "smooth",
                });

                setCurrentVideoIndex(nextIndex);

                setTimeout(() => {
                    setIsScrolling(false);
                }, 800);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentVideoIndex, videos.length, isScrolling]);

    useEffect(() => {
        if (!containerRef.current) return;

        const scrollToInitialVideo = () => {
            videoRefs.current.forEach((ref) => {
                if (ref) {
                    ref.style.height = `${window.innerHeight - HEADER_HEIGHT}px`;
                }
            });

            const initialScrollPosition = initialVideoIndex * (window.innerHeight - HEADER_HEIGHT);
            containerRef.current?.scrollTo({
                top: initialScrollPosition,
                behavior: "auto",
            });

            setHasInitialized(true);
        };

        setTimeout(scrollToInitialVideo, 100);
    }, [initialVideoIndex]);

    const handleNavClick = (direction: "prev" | "next") => {
        if (isScrolling || !containerRef.current) return;

        setIsScrolling(true);

        let nextIndex = currentVideoIndex;
        if (direction === "next") {
            nextIndex = Math.min(currentVideoIndex + 1, videos.length - 1);
        } else {
            nextIndex = Math.max(currentVideoIndex - 1, 0);
        }

        if (nextIndex !== currentVideoIndex) {
            const viewportHeight = window.innerHeight - HEADER_HEIGHT;
            containerRef.current.scrollTo({
                top: nextIndex * viewportHeight,
                behavior: "smooth",
            });

            setCurrentVideoIndex(nextIndex);
        }

        setTimeout(() => {
            setIsScrolling(false);
        }, 800);
    };

    const handleOpenPanel = (panelConfig: PanelConfig) => {
        const isSamePanel = isShowRightPanel && currentPanel?.title === panelConfig.title;

        if (isSamePanel) {
            handleClosePanel();
        } else {
            currentPanelTitleRef.current = panelConfig.title;

            setCurrentPanel(panelConfig);

            setIsPanelVisible(true);

            setTimeout(() => {
                setIsShowRightPanel(true);
            }, 10);
        }
    };

    const handleClosePanel = () => {
        setIsShowRightPanel(false);

        if (panelTimerRef.current) {
            clearTimeout(panelTimerRef.current);
        }

        panelTimerRef.current = setTimeout(() => {
            setIsPanelVisible(false);
            // Có thể reset panel nếu muốn
            // setCurrentPanel(null);
        }, 500); // Đợi hết animation transform (500ms)
    };

    useEffect(() => {
        return () => {
            if (panelTimerRef.current) {
                clearTimeout(panelTimerRef.current);
            }
        };
    }, []);

    const createPanelConfigs = useCallback(() => {
        const currentVideo = videos[currentVideoIndex];

        return {
            comments: {
                title: "Bình luận",
                content: <CommentsPanel video={currentVideo} />,
            },
            details: {
                title: "Thông tin chi tiết",
                content: <DetailsPanel video={currentVideo} />,
            },
            share: {
                title: "Chia sẻ",
                content: <SharePanel video={currentVideo} />,
            },
            playlist: {
                title: "Danh sách phát",
                content: <PlaylistPanel video={currentVideo} />,
            },
        };
    }, [currentVideoIndex, videos]);

    useEffect(() => {
        // Chỉ cập nhật khi video thay đổi và panel đang hiển thị
        if (
            isShowRightPanel &&
            currentPanel &&
            currentPanelTitleRef.current === currentPanel.title
        ) {
            const panelConfigs = createPanelConfigs();
            const updatedPanel = Object.values(panelConfigs).find(
                (config) => config.title === currentPanel.title
            );

            if (updatedPanel && updatedPanel !== currentPanel) {
                // Cập nhật panel mà không tạo ra vòng lặp
                setCurrentPanel(updatedPanel);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoIndex, createPanelConfigs, isShowRightPanel]);

    const panelConfigs = createPanelConfigs();

    return (
        <div className="relative overflow-hidden bg-black">
            <div ref={containerRef} className={scrollContainerClass}>
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        ref={(el) => {
                            videoRefs.current[index] = el;
                        }}
                        style={{
                            height: `calc(100vh - 80px)`,
                            scrollSnapAlign: "start",
                            scrollSnapStop: "always",
                        }}
                        className="overflow-hidden"
                    >
                        <VideoDetail
                            video={video}
                            isVisible={currentVideoIndex === index}
                            isShowRightPanel={isShowRightPanel}
                            panelConfigs={panelConfigs}
                            onOpenPanel={handleOpenPanel}
                        />
                    </div>
                ))}
            </div>

            {!isMobile && (
                <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
                    <button
                        className={`p-2 rounded-full bg-black/40 text-white cursor-pointer ${
                            currentVideoIndex <= 0
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-black/60"
                        }`}
                        onClick={() => handleNavClick("prev")}
                        disabled={currentVideoIndex <= 0}
                        aria-label="Video trước"
                    >
                        <ChevronUp size={24} />
                    </button>

                    <button
                        className={`p-2 rounded-full bg-black/40 text-white cursor-pointer ${
                            currentVideoIndex >= videos.length - 1
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-black/60"
                        }`}
                        onClick={() => handleNavClick("next")}
                        disabled={currentVideoIndex >= videos.length - 1}
                        aria-label="Video tiếp theo"
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>
            )}

            {currentPanel && (
                <RightPanel
                    isVisible={isShowRightPanel}
                    isPanelVisible={isPanelVisible}
                    title={currentPanel.title}
                    onClose={handleClosePanel}
                    containerRef={containerRef}
                    isCompactView={isCompactView}
                >
                    {currentPanel.content}
                </RightPanel>
            )}
        </div>
    );
};

export default ShortsViewer;
