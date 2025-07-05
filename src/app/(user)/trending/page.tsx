"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import VideoCard from "@/app/(user)/_components/video-card";
import {
    FiltersLoadingSkeleton,
    Pagination,
    VideoGridSkeleton,
} from "@/app/(user)/trending/_components";
import {
    useGetCategoriesQuery,
    useGetPopularTagsQuery,
    useGetTrendingVideosQuery,
} from "@/queries/useVideo";

export default function TrendingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [activeCategory, setActiveCategory] = useState<string | undefined>(
        searchParams.get("category") || undefined
    );
    const [activeTag, setActiveTag] = useState<string | undefined>(
        searchParams.get("tag") || undefined
    );
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

    useEffect(() => {
        const category = searchParams.get("category");
        const tag = searchParams.get("tag");
        const page = parseInt(searchParams.get("page") || "1", 10);

        setActiveCategory(category || undefined);
        setActiveTag(tag || undefined);
        setCurrentPage(page);
    }, [searchParams]);

    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();

    const { data: tagsData, isLoading: tagsLoading } = useGetPopularTagsQuery();

    const hasRequiredData = Boolean(categoriesData?.data?.length);
    const shouldFetchVideos = hasRequiredData || activeCategory || activeTag;

    const {
        data: videosData,
        isLoading: videosLoading,
        isFetching,
    } = useGetTrendingVideosQuery(
        {
            activeCategory: activeCategory,
            activeTag: activeTag,
            currentPage: currentPage,
            pageSize: 1,
        },
        {
            enabled: shouldFetchVideos,
        }
    );

    const categories = categoriesData?.data || [];
    const tags = tagsData?.data || [];
    const videos = videosData?.data?.items || [];

    const isInitialLoading =
        categoriesLoading || tagsLoading || (shouldFetchVideos && videosLoading && !videos.length);

    const handleCategoryChange = (categoryName?: string) => {
        // Immediate UI update
        setActiveCategory(categoryName);
        setActiveTag(undefined);
        setCurrentPage(1);

        // Update URL
        const params = new URLSearchParams();
        if (categoryName) {
            params.set("category", categoryName);
        }

        startTransition(() => {
            const url = params.toString() ? `/trending?${params.toString()}` : "/trending";
            router.push(url);
        });
    };

    const handleTagChange = (tagName: string) => {
        const formattedTag = tagName;

        if (activeTag === formattedTag) {
            // Clear tag
            setActiveTag(undefined);
            setActiveCategory(undefined);
            setCurrentPage(1);

            startTransition(() => {
                router.push("/trending");
            });
        } else {
            // Set new tag
            setActiveTag(formattedTag);
            setActiveCategory(undefined);
            setCurrentPage(1);

            const params = new URLSearchParams();
            params.set("tag", formattedTag);

            startTransition(() => {
                router.push(`/trending?${params.toString()}`);
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (activeTag) params.set("tag", activeTag);
        if (page !== 1) params.set("page", page.toString());

        startTransition(() => {
            const url = params.toString() ? `/trending?${params.toString()}` : "/trending";
            router.push(url);
        });
    };

    return (
        <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-3xl">Trending Now</h1>
                <TrendingUp color="#7C4DFF" strokeWidth={3} />
            </div>

            {categoriesLoading || tagsLoading ? (
                <FiltersLoadingSkeleton />
            ) : (
                <>
                    {/* Category Filter */}
                    <div
                        className={`flex items-center gap-2.5 flex-wrap ${
                            isFetching ? "opacity-75" : ""
                        }`}
                    >
                        <button
                            onClick={() => handleCategoryChange()}
                            disabled={isPending}
                            className={`px-4 py-2 text-sm font-bold text-white rounded-full cursor-pointer whitespace-nowrap transition-all duration-200 ${
                                !activeCategory && !activeTag
                                    ? "bg-[#7C4DFF] shadow-lg shadow-purple-500/25"
                                    : "bg-[#2A2A2A] hover:bg-[#7C4DFF] hover:shadow-lg hover:shadow-purple-500/25"
                            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            All
                            {!activeCategory && !activeTag && isFetching && (
                                <span className="ml-2 inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                            )}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.category + category.totalViews}
                                onClick={() => handleCategoryChange(category.category)}
                                disabled={isPending}
                                className={`px-4 py-2 text-sm font-semibold text-white rounded-full cursor-pointer whitespace-nowrap transition-all duration-200 ${
                                    activeCategory === category.category
                                        ? "bg-[#7C4DFF] shadow-lg shadow-purple-500/25"
                                        : "bg-[#2A2A2A] hover:bg-[#7C4DFF] hover:shadow-lg hover:shadow-purple-500/25"
                                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {category.category}
                                {activeCategory === category.category && isFetching && (
                                    <span className="ml-2 inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tag Filter */}
                    <div className="mt-4">
                        <h2 className="font-bold text-xl">Popular Hashtags</h2>
                        <div
                            className={`flex items-center gap-2 mt-2 flex-wrap ${
                                isFetching ? "opacity-75" : ""
                            }`}
                        >
                            {tags.map((tag) => {
                                const tagName = tag.tagName.startsWith("#")
                                    ? tag.tagName
                                    : `#${tag.tagName}`;
                                const isActive = `#${activeTag}` === tagName;

                                return (
                                    <button
                                        key={tag.tagName + tag.videoCnt}
                                        onClick={() => handleTagChange(tag.tagName)}
                                        disabled={isPending}
                                        className={`px-3 py-[6px] rounded-full text-xs font-bold cursor-pointer transition-all duration-200 ${
                                            isActive
                                                ? "text-white bg-[#7C4DFF] shadow-lg shadow-purple-500/25"
                                                : "text-[#7C4DFF] hover:text-white hover:bg-[#7C4DFF] hover:shadow-lg hover:shadow-purple-500/25"
                                        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                        style={{
                                            background: isActive
                                                ? "#7C4DFF"
                                                : "rgba(124, 77, 255, 0.2)",
                                        }}
                                    >
                                        {tagName}
                                        {isActive && isFetching && (
                                            <span className="ml-1 inline-block w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Videos Section */}
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-xl">
                        {activeCategory
                            ? `${activeCategory} Videos`
                            : activeTag
                            ? `Videos with ${activeTag}`
                            : "Top Trending Today"}
                    </h2>
                    {isFetching && (
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    )}
                </div>

                {isInitialLoading ? (
                    <VideoGridSkeleton />
                ) : videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                            {videos.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={videosData?.data?.pageNo || 1}
                            totalPages={videosData?.data?.totalPage || 1}
                            totalCount={videosData?.data?.totalElements || 0}
                            onPageChange={handlePageChange}
                            isLoading={isPending || isFetching}
                        />
                    </>
                ) : shouldFetchVideos ? (
                    <div className="text-gray-400 text-center py-8">
                        <div className="text-lg mb-2">No videos found</div>
                        {(activeCategory || activeTag) && (
                            <button
                                onClick={() => handleCategoryChange()}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                ← Back to all trending videos
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
