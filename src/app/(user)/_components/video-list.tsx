"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FetchVideoErrorHandler from "@/app/(user)/_components/fetch-video-error-handler";
import ShortsViewer from "@/app/(user)/_components/shorts-viewer ";
import VideosSkeleton from "@/app/(user)/_components/videos-skeleton";
import { useVideoListQuery, useVideoSearchQuery } from "@/queries/useVideo";
import { useVideosSearchStore } from "@/providers/videos-search-store-provider";
import { Video } from "@/types/video.types";

export default function VideosList() {
    const [retryKey, setRetryKey] = useState(0);

    // Truy cập trạng thái tìm kiếm từ Zustand store
    const { searchQuery, isSearchActive } = useVideosSearchStore((state) => state);

    // Tạo một ref để theo dõi phần tử cuối cùng cho infinite scroll
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    // Query cho danh sách video thông thường
    const {
        data: normalVideoData,
        isLoading: isNormalLoading,
        isError: isNormalError,
        error: normalError,
    } = useVideoListQuery({
        retryKey,
        enabled: !isSearchActive, // Chỉ enabled khi không có tìm kiếm
    });

    // Query cho tìm kiếm video với infinite scroll
    const {
        data: searchData,
        isLoading: isSearchLoading,
        isError: isSearchError,
        error: searchError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useVideoSearchQuery({
        query: searchQuery,
        enabled: isSearchActive, // Chỉ enabled khi có tìm kiếm
    });

    // Xử lý tải thêm dữ liệu khi scroll đến cuối
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && isSearchActive) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isSearchActive]);

    // Tính toán danh sách video hiển thị
    const getVideosToDisplay = useCallback((): Video[] => {
        if (isSearchActive && searchData) {
            // Kết hợp tất cả các trang kết quả tìm kiếm
            return searchData.pages.flatMap((page) => page.data.items);
        } else if (normalVideoData) {
            // Trả về danh sách video bình thường
            return normalVideoData.data.items || [];
        }
        return [];
    }, [isSearchActive, searchData, normalVideoData]);

    const videos = getVideosToDisplay();
    const isLoading = isSearchActive ? isSearchLoading : isNormalLoading;
    const isError = isSearchActive ? isSearchError : isNormalError;
    const error = isSearchActive ? searchError : normalError;

    // Nếu đang tìm kiếm và không có kết quả hiển thị thông báo
    const showNoResults = isSearchActive && !isSearchLoading && videos.length === 0;

    if (isLoading && videos.length === 0) {
        return <VideosSkeleton />;
    }

    if (isError && videos.length === 0) {
        return (
            <FetchVideoErrorHandler
                error={error as Error}
                reset={() => setRetryKey((k) => k + 1)}
            />
        );
    }

    if (showNoResults) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                <p className="text-xl font-semibold mb-2">No videos found</p>
                <p className="text-muted-foreground">
                    Try searching for something else or check your spelling
                </p>
            </div>
        );
    }

    return (
        <>
            <ShortsViewer
                videos={videos}
                initialVideoIndex={0}
                updateUrl={false}
                urlPath="/"
                onLoadMore={isSearchActive && hasNextPage ? () => fetchNextPage() : undefined}
                hasMore={isSearchActive && !!hasNextPage}
                isLoadingMore={isFetchingNextPage}
            />

            {/* Phần tử trigger load more cho infinite scroll */}
            {isSearchActive && hasNextPage && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    {isFetchingNextPage ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    ) : (
                        <div className="text-muted-foreground">Scroll for more videos</div>
                    )}
                </div>
            )}
        </>
    );
}
