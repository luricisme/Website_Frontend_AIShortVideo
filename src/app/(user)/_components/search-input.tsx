"use client";

import { Play, Search, User, X } from "lucide-react";
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
    isMobileMode?: boolean;
}

const VideoSearchResults = ({
    videos,
    isLoading = false,
    onVideoClick = () => {},
    pagination,
    searchQuery = "",
    onViewAllClick = () => {},
    isMobileMode = false,
}: VideoSearchResultsProps) => {
    if (isLoading) {
        return (
            <div className={`space-y-3 ${isMobileMode ? "p-4" : "p-4 sm:p-4"}`}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-3">
                        <Skeleton
                            className={`rounded ${
                                isMobileMode ? "h-16 w-20" : "h-12 w-16 sm:h-12 sm:w-20"
                            }`}
                        />
                        <div className="flex-1">
                            <Skeleton
                                className={`w-full mb-1 ${isMobileMode ? "h-5" : "h-4 sm:h-4"}`}
                            />
                            <Skeleton className={`w-2/3 ${isMobileMode ? "h-4" : "h-3 sm:h-3"}`} />
                        </div>
                    </div>
                ))}
                <Skeleton className={`w-full mt-2 ${isMobileMode ? "h-10" : "h-8 sm:h-8"}`} />
            </div>
        );
    }

    if (videos.length === 0) {
        return (
            <div
                className={`text-center text-muted-foreground ${
                    isMobileMode ? "p-6" : "p-4 sm:p-4"
                }`}
            >
                <div className={`mb-2 ${isMobileMode ? "text-base" : "text-sm"}`}>
                    No videos found
                </div>
                {searchQuery && (
                    <div className={`${isMobileMode ? "text-sm" : "text-xs"}`}>
                        Try searching for something else
                    </div>
                )}
            </div>
        );
    }

    const containerClasses = isMobileMode
        ? "max-h-[70vh] overflow-hidden flex flex-col bg-background rounded-lg shadow-sm"
        : "max-h-60 sm:max-h-80 lg:max-h-96 overflow-hidden flex flex-col bg-background border-0 sm:border border-border rounded-none sm:rounded-lg shadow-sm";

    return (
        <div className={containerClasses}>
            {pagination && (
                <div
                    className={`border-b border-border bg-muted/20 flex items-center justify-between ${
                        isMobileMode ? "px-4 py-3" : "px-3 sm:px-4 py-2 sm:py-3"
                    }`}
                >
                    <div
                        className={`text-muted-foreground ${
                            isMobileMode ? "text-sm" : "text-xs sm:text-sm"
                        }`}
                    >
                        <span className="font-medium text-foreground">{videos.length}</span>{" "}
                        <span className={isMobileMode ? "inline" : "hidden sm:inline"}>of </span>
                        <span className={isMobileMode ? "hidden" : "sm:hidden"}>/ </span>{" "}
                        <span className="font-medium text-foreground">
                            {pagination.totalElements}
                        </span>
                    </div>
                    {pagination.totalElements > pagination.pageSize && (
                        <div
                            className={`text-muted-foreground font-medium ${
                                isMobileMode ? "text-sm" : "text-xs sm:text-sm"
                            }`}
                        >
                            {pagination.totalPage}{" "}
                            <span className={isMobileMode ? "inline" : "hidden sm:inline"}>
                                pages
                            </span>
                            <span className={isMobileMode ? "hidden" : "sm:hidden"}>p</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
                <div className={isMobileMode ? "p-2 sm:p-3" : "p-2"}>
                    {videos.map((video, index) => {
                        const itemClasses = isMobileMode
                            ? "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors group"
                            : "flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer transition-colors group";

                        const thumbnailClasses = isMobileMode
                            ? "w-20 h-16 sm:w-24 sm:h-18"
                            : "w-16 h-12 sm:w-18 sm:h-14 lg:w-20 lg:h-16";

                        return (
                            <div
                                key={video.id}
                                className={itemClasses}
                                onClick={() => onVideoClick(video)}
                            >
                                <div
                                    className={`bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border relative ${thumbnailClasses}`}
                                >
                                    {video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            width={isMobileMode ? 96 : 80}
                                            height={isMobileMode ? 72 : 64}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const fallback = e.currentTarget
                                                    .nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = "flex";
                                            }}
                                        />
                                    ) : null}

                                    <div
                                        className={`w-full h-full bg-gradient-to-br from-muted to-muted/70 flex flex-col items-center justify-center ${
                                            video.thumbnail ? "hidden" : "flex"
                                        }`}
                                        style={{ display: video.thumbnail ? "none" : "flex" }}
                                    >
                                        <Play
                                            className={`text-muted-foreground/50 ${
                                                isMobileMode ? "w-6 h-6" : "w-4 h-4 sm:w-5 sm:h-5"
                                            }`}
                                        />
                                        <span
                                            className={`text-muted-foreground/70 text-center mt-1 ${
                                                isMobileMode ? "text-xs" : "text-[10px] sm:text-xs"
                                            }`}
                                        >
                                            Video
                                        </span>
                                    </div>

                                    {video.length && (
                                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-[10px] sm:text-xs">
                                            {video.length}s
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={`font-medium text-foreground group-hover:text-accent-foreground line-clamp-2 ${
                                            isMobileMode
                                                ? "text-sm sm:text-base leading-tight sm:leading-normal"
                                                : "text-xs sm:text-sm lg:text-base leading-tight"
                                        }`}
                                        title={video.title}
                                    >
                                        {video.title}
                                    </h4>

                                    <div
                                        className={`flex items-center gap-1 text-muted-foreground mt-1 ${
                                            isMobileMode ? "text-xs sm:text-sm" : "text-xs"
                                        }`}
                                    >
                                        <User
                                            className={`${
                                                isMobileMode
                                                    ? "w-3 h-3"
                                                    : "w-2.5 h-2.5 sm:w-3 sm:h-3"
                                            }`}
                                        />
                                        <span className="truncate">
                                            {video.user?.username || "Unknown User"}
                                        </span>
                                        {video.category && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span className="text-foreground/70 font-medium truncate">
                                                    {video.category}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div
                                        className={`flex items-center justify-between mt-1 ${
                                            isMobileMode ? "text-xs sm:text-sm" : "text-xs"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            {video.viewCnt && (
                                                <span>{video.viewCnt.toLocaleString()} views</span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-muted-foreground/60 font-mono ${
                                                isMobileMode ? "text-xs" : "text-[10px] sm:text-xs"
                                            }`}
                                        >
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {pagination && pagination.totalElements > videos.length && (
                <div className="border-t border-border bg-muted/10 flex-shrink-0">
                    <div className={isMobileMode ? "p-3 sm:p-4" : "p-2 sm:p-3"}>
                        <button
                            type="button"
                            onClick={onViewAllClick}
                            className={`w-full bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center ${
                                isMobileMode
                                    ? "py-2.5 sm:py-3 px-4 text-sm gap-2"
                                    : "py-2 px-3 sm:px-4 text-xs sm:text-sm gap-1.5 sm:gap-2"
                            }`}
                        >
                            <Search
                                size={isMobileMode ? 16 : 14}
                                className={isMobileMode ? "w-4 h-4" : "w-3.5 h-3.5 sm:w-4 sm:h-4"}
                            />
                            <span>View all {pagination.totalElements} results</span>
                        </button>

                        <div
                            className={`text-center text-muted-foreground ${
                                isMobileMode
                                    ? "mt-2 sm:mt-3 text-xs sm:text-sm"
                                    : "mt-1 sm:mt-2 text-xs"
                            }`}
                        >
                            <span>
                                {pagination.totalElements - videos.length} more •{" "}
                                <span className={isMobileMode ? "inline" : "hidden sm:inline"}>
                                    Press{" "}
                                    <kbd className="px-1 py-0.5 text-xs font-mono bg-muted border border-border rounded text-[10px]">
                                        Enter
                                    </kbd>{" "}
                                    for all {pagination.totalPage} pages
                                </span>
                                <span className={isMobileMode ? "hidden" : "sm:hidden"}>
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

interface SearchInputProps {
    onSearchComplete?: () => void;
    isMobileMode?: boolean;
}

const SearchInput = ({ onSearchComplete, isMobileMode = false }: SearchInputProps) => {
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

    // Popover state management
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

    // Focus handler
    const handleInputFocus = () => {
        setIsInputFocused(true);
        if (localSearchQuery.trim().length > 0) {
            setDebouncedQuery(localSearchQuery.trim());
        }
    };

    // Blur handler với proper timing
    const handleInputBlur = (e: React.FocusEvent) => {
        const relatedTarget = e.relatedTarget as Element;

        // Check if clicking on popover content
        setTimeout(() => {
            const isClickInsidePopover = popoverContentRef.current?.contains(relatedTarget);

            if (!isClickInsidePopover && !searchInputRef.current?.matches(":focus")) {
                setIsInputFocused(false);
            }
        }, 100);
    };

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

        onSearchComplete?.();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localSearchQuery.trim()) {
            setIsSearchOpen(false);
            setIsInputFocused(false);
            setSearchQuery(localSearchQuery.trim());
            setDebouncedQuery(localSearchQuery.trim());

            router.push(`/?q=${encodeURIComponent(localSearchQuery.trim())}`);
            router.refresh();

            window.scrollTo({ top: 0, behavior: "smooth" });

            onSearchComplete?.();
        }
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;

            const searchContainer = document.querySelector("[data-search-container]");
            const popoverElement =
                document.querySelector("[data-search-popover]") ||
                document.querySelector("[data-radix-popover-content]");

            if (!searchContainer?.contains(target) && !popoverElement?.contains(target)) {
                setIsSearchOpen(false);
                setIsInputFocused(false);
            }
        };

        if (!isMobileMode) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            if (!isMobileMode) {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
    }, [isMobileMode]);

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

    const containerClasses = isMobileMode
        ? "relative flex items-center justify-center w-full"
        : "relative flex items-center justify-center w-full max-w-[400px]";

    const popoverClasses = (() => {
        if (isMobileMode) {
            return "w-[calc(100vw-2rem)] max-w-none mx-auto rounded-lg border p-0 shadow-md";
        }

        if (windowWidth < 1024) {
            return "w-[calc(100vw-2rem)] max-w-none mx-auto rounded-lg border p-0 shadow-md";
        }

        if (windowWidth < 640) {
            return "w-[min(calc(100vw-1rem),400px)] max-w-none mx-auto rounded-lg border p-0 shadow-md";
        }

        return "w-[400px] max-w-[400px] mx-auto rounded-lg border p-0 shadow-md";
    })();

    const getSideOffset = () => {
        if (isMobileMode) return 8;
        if (windowWidth < 1024) return 4; 
        if (windowWidth < 640) return 4;
        return 5;
    };

    useEffect(() => {
        if (isMobileMode && searchInputRef.current) {
            const timeoutId = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isMobileMode]);

    return (
        <div data-search-container className={containerClasses}>
            <Popover open={isSearchOpen} onOpenChange={() => {}}>
                <PopoverTrigger asChild>
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        {/* Form content remains the same */}
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
                    className={popoverClasses}
                    align="center"
                    side="bottom"
                    sideOffset={getSideOffset()}
                    collisionPadding={windowWidth < 1024 ? 16 : 8} 
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onEscapeKeyDown={() => {
                        setIsSearchOpen(false);
                        setIsInputFocused(false);
                        searchInputRef.current?.blur();

                        if (isMobileMode) {
                            onSearchComplete?.();
                        }
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
                        isMobileMode={isMobileMode || windowWidth < 1024} 
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SearchInput;
