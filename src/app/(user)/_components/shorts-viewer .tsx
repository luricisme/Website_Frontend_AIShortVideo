"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import VideoDetail from "@/app/(user)/_components/video-detail";
import { useDebounce } from "@/hooks/use-debounce";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBodyScroll, useScrollContainer } from "@/hooks/use-body-scroll";

interface Video {
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
}

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
    useBodyScroll(true); // Ẩn scroll của body
    const scrollContainerClass = useScrollContainer({
        height: "h-[calc(100vh-80px)]",
        hideScrollbar: true,
        snapType: "snap-y",
        snapStrictness: "snap-mandatory",
    });

    const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const HEADER_HEIGHT = 80;
    const [isScrolling, setIsScrolling] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Khởi tạo refs cho mỗi video
    useEffect(() => {
        videoRefs.current = videoRefs.current.slice(0, videos.length);
    }, [videos]);

    // Cập nhật URL khi chuyển video, nhưng sử dụng replaceState thay vì router.push
    useEffect(() => {
        // Không cần cập nhật URL khi mới khởi tạo trang
        if (!hasInitialized) return;

        // Nếu không cần cập nhật URL, thoát sớm
        if (!updateUrl) return;

        // Hủy timeout cũ nếu có
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current);
        }

        // Đặt timeout mới để tránh cập nhật URL quá thường xuyên
        urlUpdateTimeoutRef.current = setTimeout(() => {
            const videoId = videos[currentVideoIndex].id;
            // Sử dụng History API để thay đổi URL mà không tải lại trang
            window.history.replaceState({ id: videoId }, "", `${urlPath}/${videoId}`);
        }, 300);

        return () => {
            if (urlUpdateTimeoutRef.current) {
                clearTimeout(urlUpdateTimeoutRef.current);
            }
        };
    }, [currentVideoIndex, videos, hasInitialized, updateUrl, urlPath]);

    // Tạo hàm xử lý scroll với debounce
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

    // Xử lý sự kiện scroll
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

    // Xử lý wheel event
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

    // Xử lý phím mũi tên
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

    // Cuộn đến video ban đầu khi trang được tải
    useEffect(() => {
        if (!containerRef.current) return;

        const scrollToInitialVideo = () => {
            // Đặt chiều cao cụ thể cho mỗi phần tử video
            videoRefs.current.forEach((ref) => {
                if (ref) {
                    ref.style.height = `${window.innerHeight - HEADER_HEIGHT}px`;
                }
            });

            // Cuộn đến video được chọn ban đầu
            const initialScrollPosition = initialVideoIndex * (window.innerHeight - HEADER_HEIGHT);
            containerRef.current?.scrollTo({
                top: initialScrollPosition,
                behavior: "auto",
            });

            // Đánh dấu đã khởi tạo
            setHasInitialized(true);
        };

        // Đặt timeout để đảm bảo rằng container đã được render
        setTimeout(scrollToInitialVideo, 100);
    }, [initialVideoIndex]);

    // Hàm xử lý nhấn vào nút điều hướng
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

    return (
        <div className="relative bg-black overflow-hidden">
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
                        <VideoDetail video={video} />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng đơn giản hóa - chỉ có lên/xuống */}
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
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
        </div>
    );
};

export default ShortsViewer;
