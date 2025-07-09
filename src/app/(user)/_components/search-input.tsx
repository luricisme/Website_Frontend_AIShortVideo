"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { searchVideos } from "@/apiRequests/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "@/types/video.types";
import { useVideosSearchStore } from "@/providers/videos-search-store-provider";

interface VideoSearchResultsProps {
    videos: Video[];
    isLoading?: boolean;
    onVideoClick?: (video: Video) => void;
    pagination?: {
        pageNo: number;
        pageSize: number;
        totalPage: number;
        totalElements: number;
    };
    searchQuery?: string;
    onViewAllClick?: () => void;
}

const VideoSearchResults = ({
    videos,
    isLoading = false,
    onVideoClick = () => {},
    pagination,
    searchQuery = "",
    onViewAllClick = () => {},
}: VideoSearchResultsProps) => {
    if (isLoading) {
        return (
            <div className="p-4 sm:p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-3">
                        <Skeleton className="h-12 w-16 sm:h-12 sm:w-20 rounded" />
                        <div className="flex-1">
                            <Skeleton className="h-4 sm:h-4 w-full mb-1" />
                            <Skeleton className="h-3 sm:h-3 w-2/3" />
                        </div>
                    </div>
                ))}
                <Skeleton className="h-8 sm:h-8 w-full mt-2" />
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div className="p-4 sm:p-4 text-center text-muted-foreground">
                <div className="mb-2 text-sm">No videos found</div>
                {searchQuery && <div className="text-xs">Try searching for something else</div>}
            </div>
        );
    }

    return (
        <div className="max-h-60 sm:max-h-80 overflow-hidden flex flex-col bg-background border-0 sm:border border-border rounded-none sm:rounded-lg shadow-sm">
            {pagination && (
                <div className="px-4 sm:px-3 py-2 sm:py-2 border-b border-border bg-muted/20 flex items-center justify-between">
                    <div className="text-sm sm:text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{videos.length}</span>{" "}
                        <span className="hidden sm:inline">of </span>
                        <span className="sm:hidden">/</span>{" "}
                        <span className="font-medium text-foreground">
                            {pagination.totalElements}
                        </span>
                    </div>
                    {pagination.totalElements > pagination.pageSize && (
                        <div className="text-sm sm:text-xs text-muted-foreground font-medium">
                            {pagination.totalPage} <span className="hidden sm:inline">pages</span>
                            <span className="sm:hidden">p</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-2 sm:p-2">
                    {videos.map((video, index) => (
                        <div
                            key={video.id}
                            className="flex items-center gap-3 sm:gap-3 p-3 sm:p-3 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors group"
                            onClick={() => onVideoClick(video)}
                        >
                            <div className="w-16 h-12 sm:w-16 sm:h-12 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                                {video.thumbnail ? (
                                    <Image
                                        src="https://images.unsplash.com/photo-1548637724-cbc39e0c8d3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXRpZnVsJTIwd29tYW58ZW58MHx8MHx8fDA%3D"
                                        alt={video.title}
                                        width={64}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">
                                            No image
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm sm:text-sm truncate text-foreground group-hover:text-accent-foreground">
                                    {video.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    {video.user?.username || "Unknown User"}
                                    {video.category && (
                                        <>
                                            <span className="mx-1">•</span>
                                            <span className="text-foreground/70 font-medium">
                                                {video.category}
                                            </span>
                                        </>
                                    )}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {video.viewCnt && <span>{video.viewCnt} views</span>}
                                    {video.length && video.viewCnt && <span>•</span>}
                                    {video.length && <span>{video.length}s</span>}
                                    <span className="ml-auto text-muted-foreground/60 font-mono text-xs sm:text-xs">
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {pagination && pagination.totalElements > videos.length && (
                <div className="border-t border-border bg-muted/10 flex-shrink-0">
                    <div className="p-3 sm:p-2">
                        <button
                            type="button"
                            onClick={onViewAllClick}
                            className="w-full py-2 sm:py-1.5 px-4 sm:px-3 bg-primary text-primary-foreground text-sm sm:text-xs font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 sm:gap-1.5"
                        >
                            <Search size={14} className="sm:w-3 sm:h-3" />
                            <span>View all {pagination.totalElements} results</span>
                        </button>

                        <div className="mt-2 sm:mt-1 text-center text-xs text-muted-foreground">
                            <span>
                                {pagination.totalElements - videos.length} more •{" "}
                                <span className="hidden sm:inline">
                                    Press{" "}
                                    <kbd className="px-1 py-0.5 text-xs font-mono bg-muted border border-border rounded text-[10px]">
                                        Enter
                                    </kbd>{" "}
                                    for all {pagination.totalPage} pages
                                </span>
                                <span className="sm:hidden">
                                    {pagination.totalPage} pages total
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setSearchQuery, clearSearch } = useVideosSearchStore((state) => state);

    const initialQuery = searchParams.get("q") || "";
    const [localSearchQuery, setLocalSearchQuery] = useState(initialQuery);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const popoverContentRef = useRef<HTMLDivElement>(null);

    // Window width tracking
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 0
    );

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Initialize store
    useEffect(() => {
        if (initialQuery) {
            setSearchQuery(initialQuery);
            setDebouncedQuery(initialQuery);
        }
    }, [initialQuery, setSearchQuery]);

    // Debounce search
    const debouncedSetSearchResults = useDebounce((query: string) => {
        setDebouncedQuery(query);
    }, 300);

    // Search query
    const { data: searchResults, isLoading: isSearchLoading } = useQuery({
        queryKey: ["searchVideos", debouncedQuery],
        queryFn: () => searchVideos({ query: debouncedQuery, pageSize: 10 }),
        enabled: debouncedQuery.length > 0,
        staleTime: 30000,
    });

    //Popover state management
    useEffect(() => {
        if (debouncedQuery.length > 0 && isInputFocused) {
            setIsSearchOpen(true);
        } else {
            setIsSearchOpen(false);
        }
    }, [debouncedQuery, isInputFocused]);

    // Handle input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        debouncedSetSearchResults(value);
    };

    //  Focus handler
    const handleInputFocus = () => {
        setIsInputFocused(true);
        if (localSearchQuery.trim().length > 0) {
            setDebouncedQuery(localSearchQuery.trim());
        }
    };

    //  Blur handler với proper timing
    const handleInputBlur = (e: React.FocusEvent) => {
        const relatedTarget = e.relatedTarget as Element;

        //  Check if clicking on popover content
        setTimeout(() => {
            const isClickInsidePopover = popoverContentRef.current?.contains(relatedTarget);

            if (!isClickInsidePopover && !searchInputRef.current?.matches(":focus")) {
                setIsInputFocused(false);
            }
        }, 100);
    };
    // const handleInputBlur = () => {
    //     console.log("Input blurred, checking focus state...");
    //     setTimeout(() => {
    //         if (!searchInputRef.current?.matches(":focus")) {
    //             setIsInputFocused(false);
    //         }
    //     }, 150);
    // };

    // Sync URL changes
    useEffect(() => {
        const urlQuery = searchParams.get("q") || "";
        if (urlQuery !== localSearchQuery) {
            setLocalSearchQuery(urlQuery);
            setDebouncedQuery(urlQuery);
            setSearchQuery(urlQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, setSearchQuery]);

    // Handlers
    const handleVideoClick = (video: Video) => {
        setIsSearchOpen(false);
        setIsInputFocused(false);
        router.push(`/shorts/${video.id}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localSearchQuery.trim()) {
            setIsSearchOpen(false);
            setIsInputFocused(false);
            setSearchQuery(localSearchQuery.trim());
            // updateQueryParam(localSearchQuery.trim());
            setDebouncedQuery(localSearchQuery.trim());

            router.push(`/?q=${encodeURIComponent(localSearchQuery.trim())}`);
            router.refresh();

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;

            const searchContainer = document.querySelector("[data-search-container]");
            const popoverElement =
                document.querySelector("[data-search-popover]") ||
                document.querySelector("[data-radix-popover-content]");

            // console.log("Target element:", target);
            // console.log("Search container:", searchContainer);
            // console.log("Popover element:", popoverElement);

            // console.log(
            //     ">>> is target inside search container:",
            //     searchContainer?.contains(target)
            // );
            // console.log(">>> is target inside popover element:", popoverElement?.contains(target));

            // console.log(
            //     ">>> should close search:",
            //     !searchContainer?.contains(target) && !popoverElement?.contains(target)
            // );

            if (!searchContainer?.contains(target) && !popoverElement?.contains(target)) {
                console.log("Closing search popover");
                setIsSearchOpen(false);
                setIsInputFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClearSearch = () => {
        setLocalSearchQuery("");
        setDebouncedQuery("");
        setIsSearchOpen(false);
        setIsInputFocused(false);
        clearSearch();
        updateQueryParam("");
        setTimeout(() => {
            searchInputRef.current?.focus();
            setIsInputFocused(true);
        }, 0);
    };

    const updateQueryParam = (query: string) => {
        const currentPath = window.location.pathname;
        const params = new URLSearchParams(searchParams.toString());

        if (query.trim()) {
            params.set("q", query.trim());
        } else {
            params.delete("q");
        }

        const newUrl = `${currentPath}${params.toString() ? "?" + params.toString() : ""}`;
        router.replace(newUrl, { scroll: false });
    };

    return (
        <div
            data-search-container
            className="relative flex items-center justify-center w-full max-w-[400px]"
        >
            <Popover open={isSearchOpen} onOpenChange={() => {}}>
                <PopoverTrigger asChild>
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        <div className="relative">
                            <button
                                type="submit"
                                className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Search"
                            >
                                <Search size={18} strokeWidth={3} className="sm:w-5 sm:h-5" />
                            </button>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search videos..."
                                value={localSearchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                className="w-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-8 sm:pr-10 border border-input rounded-full focus:outline-none bg-background transition-colors focus:ring-2 focus:ring-ring focus:border-input placeholder:text-muted-foreground text-foreground text-sm"
                                aria-label="Search input"
                            />
                            {localSearchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 z-10 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-1 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={14} className="sm:w-4 sm:h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </PopoverTrigger>

                <PopoverContent
                    data-search-popover
                    ref={popoverContentRef}
                    className="w-screen sm:w-[400px] max-w-none sm:max-w-[400px] mx-0 sm:mx-auto rounded-none sm:rounded-lg border-x-0 sm:border-x p-0 border-y border-border shadow-md"
                    align={windowWidth < 640 ? "center" : "start"}
                    side="bottom"
                    sideOffset={windowWidth < 640 ? 0 : 5}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onEscapeKeyDown={() => {
                        setIsSearchOpen(false);
                        setIsInputFocused(false);
                        searchInputRef.current?.blur();
                    }}
                >
                    <VideoSearchResults
                        videos={searchResults?.data.items || []}
                        isLoading={isSearchLoading}
                        onVideoClick={handleVideoClick}
                        pagination={
                            searchResults?.data
                                ? {
                                      pageNo: searchResults.data.pageNo,
                                      pageSize: searchResults.data.pageSize,
                                      totalPage: searchResults.data.totalPage,
                                      totalElements: searchResults.data.totalElements,
                                  }
                                : undefined
                        }
                        searchQuery={localSearchQuery}
                        onViewAllClick={() =>
                            handleSearchSubmit({
                                preventDefault: () => {},
                            } as React.FormEvent)
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SearchInput;
