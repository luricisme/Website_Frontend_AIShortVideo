import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    showItemsInfo?: boolean;
    showPageSizeSelector?: boolean;
    showFullInfo?: boolean;
    isLoading?: boolean;
    itemType?: string;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange = () => {},
    showItemsInfo = true,
    showPageSizeSelector = true,
    showFullInfo = true,
    isLoading = false,
    itemType = "items",
}: PaginationProps) => {
    // Handle navigation
    const handlePrevious = () => {
        if (isLoading) return;
        onPageChange(Math.max(currentPage - 1, 1));
    };

    const handleNext = () => {
        if (isLoading) return;
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    const handleFirst = () => {
        if (isLoading) return;
        onPageChange(1);
    };

    const handleLast = () => {
        if (isLoading) return;
        onPageChange(totalPages);
    };

    const handlePageChange = (page: number) => {
        if (isLoading) return;
        onPageChange(page);
    };

    const getVisiblePages = () => {
        const delta = 2;
        const pages = [];

        // Show all pages if 7 or fewer
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show first page
        pages.push(1);

        // Add dots if there's a gap after first page
        if (currentPage > delta + 2) {
            pages.push("...");
        }

        // Add pages around current page
        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                // Avoid duplicates
                pages.push(i);
            }
        }

        // Add dots if there's a gap before last page
        if (currentPage < totalPages - delta - 1) {
            pages.push("...");
        }

        // Always show last page (if > 1)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    // Calculate start and end item numbers
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Handle edge cases
    if (totalPages === 0) return null;

    // Determine what to show on left side
    const shouldShowItemsInfo = showFullInfo && showItemsInfo;
    const shouldShowPageSizeSelector = showFullInfo && showPageSizeSelector && onItemsPerPageChange;
    const shouldShowLeftSide = shouldShowItemsInfo || shouldShowPageSizeSelector;

    return (
        <div
            className={`flex ${
                shouldShowLeftSide
                    ? "flex-col lg:flex-row items-start lg:items-center justify-between"
                    : "flex-col items-center justify-center"
            } mt-6 gap-4`}
        >
            {/* Left side */}
            {shouldShowLeftSide && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Item range info */}
                    {shouldShowItemsInfo && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <span className="whitespace-nowrap">Showing {startItem}</span>
                            <Minus className="h-3 w-3" strokeWidth={3} />
                            <span className="whitespace-nowrap">
                                {endItem} of {totalItems} {itemType}
                            </span>
                            {isLoading && <span className="ml-2 text-primary">Loading...</span>}
                        </div>
                    )}

                    {shouldShowItemsInfo && shouldShowPageSizeSelector && (
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-border"></div>
                    )}

                    {/* Page size selector */}
                    {shouldShowPageSizeSelector && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                Show
                            </span>
                            <Select
                                value={String(itemsPerPage)}
                                onValueChange={(value) => onItemsPerPageChange(Number(value))}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="h-8 w-[65px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                per page
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div
                className={`flex items-center gap-1 sm:gap-2 ${
                    shouldShowLeftSide
                        ? "w-full lg:w-auto justify-center lg:justify-end"
                        : "justify-center"
                } ${isLoading ? "opacity-50" : ""}`}
            >
                {/* First page button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirst}
                    disabled={currentPage === 1 || totalPages === 0 || isLoading}
                    className="hidden sm:flex h-8 w-8 p-0"
                    aria-label="Go to first page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || totalPages === 0 || isLoading}
                    className="h-8 w-8 p-0"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-muted-foreground text-sm cursor-default"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = page as number;
                        return (
                            <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={isLoading}
                                className={`h-8 w-8 p-0 text-xs ${
                                    currentPage === pageNumber
                                        ? "bg-primary text-primary-foreground"
                                        : ""
                                }`}
                                aria-label={`Go to page ${pageNumber}`}
                                aria-current={currentPage === pageNumber ? "page" : undefined}
                            >
                                {pageNumber}
                            </Button>
                        );
                    })}
                </div>

                {/* Next page button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                    className="h-8 w-8 p-0"
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLast}
                    disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                    className="hidden sm:flex h-8 w-8 p-0"
                    aria-label="Go to last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Mobile indicator when no left side */}
            {!shouldShowLeftSide && (
                <div className="text-center text-sm text-muted-foreground w-full lg:hidden">
                    Page {currentPage} of {totalPages} ({totalItems} total {itemType})
                    {isLoading && <span className="ml-2 text-primary">Loading...</span>}
                </div>
            )}
        </div>
    );
};

export default Pagination;
