"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import VideoDetail from "@/app/(user)/_components/video-detail";
import { useDebounce } from "@/hooks/use-debounce";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBodyScroll, useScrollContainer } from "@/hooks/use-body-scroll";

// Danh sách video mẫu (có thể lấy từ API hoặc từ một file riêng)
const VIDEO_LIST = [
    {
        id: 1,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    // Giữ nguyên các video khác...
    {
        id: 2,
        title: "Đồi Núi Tự Nhiên",
        description: "Cảnh quay tuyệt đẹp về thiên nhiên.",
        thumbnail:
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmF0dXJlfGVufDB8fDB8fHww",
        source: "https://www.w3schools.com/tags/mov_bbb.mp4",
        duration: 245,
        views: 87321,
        author: {
            id: 2,
            name: "Minh Hà",
            username: "minhha",
            avatar: "https://example.com/minhha.jpg",
        },
    },
    {
        id: 3,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 4,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 5,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
    {
        id: 6,
        title: "AI Portraits",
        description: "A collection of AI-generated portraits.",
        thumbnail:
            "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
        source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
        duration: 324,
        views: 123456,
        author: {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            avatar: "https://example.com/john-doe.jpg",
        },
    },
];

const ShortsPage = () => {
    const params = useParams();
    const initialVideoId = params?.id ? String(params.id) : null;

    useBodyScroll(true); // Ẩn scroll của body
    const scrollContainerClass = useScrollContainer({
        height: "h-[calc(100vh-80px)]",
        hideScrollbar: true,
        snapType: "snap-y",
        snapStrictness: "snap-mandatory",
    });

    // Tìm video hiện tại từ ID và sắp xếp lại danh sách video
    const getInitialVideoAndIndex = () => {
        if (!initialVideoId) {
            return { index: 0, videos: VIDEO_LIST };
        }

        const id = parseInt(initialVideoId);
        const selectedVideoIndex = VIDEO_LIST.findIndex((video) => video.id === id);

        if (selectedVideoIndex === -1) {
            return { index: 0, videos: VIDEO_LIST };
        }

        // Thay vì sắp xếp lại, chỉ cần xác định index ban đầu
        return { index: selectedVideoIndex, videos: VIDEO_LIST };
    };

    const { index: initialIndex, videos } = getInitialVideoAndIndex();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(initialIndex);
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

        // Hủy timeout cũ nếu có
        if (urlUpdateTimeoutRef.current) {
            clearTimeout(urlUpdateTimeoutRef.current);
        }

        // Đặt timeout mới để tránh cập nhật URL quá thường xuyên
        urlUpdateTimeoutRef.current = setTimeout(() => {
            const videoId = videos[currentVideoIndex].id;
            // Sử dụng History API để thay đổi URL mà không tải lại trang
            window.history.replaceState({ id: videoId }, "", `/shorts/${videoId}`);
        }, 300);

        return () => {
            if (urlUpdateTimeoutRef.current) {
                clearTimeout(urlUpdateTimeoutRef.current);
            }
        };
    }, [currentVideoIndex, videos, hasInitialized]);

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
            const initialScrollPosition = initialIndex * (window.innerHeight - HEADER_HEIGHT);
            containerRef.current?.scrollTo({
                top: initialScrollPosition,
                behavior: "auto",
            });

            // Đánh dấu đã khởi tạo
            setHasInitialized(true);
        };

        // Đặt timeout để đảm bảo rằng container đã được render
        setTimeout(scrollToInitialVideo, 100);
    }, [initialIndex]);

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
        <div className="relative h-screen bg-black overflow-hidden">
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

export default ShortsPage;
