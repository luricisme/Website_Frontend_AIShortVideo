import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Minus } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    // ⚠️ NEW: Optional props để control hiển thị
    showItemsInfo?: boolean;
    showPageSizeSelector?: boolean;
    showFullInfo?: boolean; // Shorthand để show both
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange = () => {},
    // ⚠️ Default values
    showItemsInfo = true,
    showPageSizeSelector = true,
    showFullInfo = true,
}: PaginationProps) => {
    // Handle Previous button
    const handlePrevious = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };

    // Handle Next button
    const handleNext = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    // Handle First button
    const handleFirst = () => {
        onPageChange(1);
    };

    // Handle Last button
    const handleLast = () => {
        onPageChange(totalPages);
    };

    // ⚠️ Calculate start and end item numbers
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // ⚠️ Handle edge cases
    if (totalPages === 0) return null;

    // ⚠️ Determine what to show on left side
    const shouldShowItemsInfo = showFullInfo && showItemsInfo;
    const shouldShowPageSizeSelector = showFullInfo && showPageSizeSelector && onItemsPerPageChange;
    const shouldShowLeftSide = shouldShowItemsInfo || shouldShowPageSizeSelector;

    return (
        <div
            className={`flex ${
                shouldShowLeftSide
                    ? "flex-col lg:flex-row items-start lg:items-center justify-between"
                    : "flex-col items-center justify-center" // ⚠️ CENTER when no left side
            } mt-6 gap-4`}
        >
            {/* ⚠️ Left side - CONDITIONAL RENDERING */}
            {shouldShowLeftSide && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Item range info */}
                    {shouldShowItemsInfo && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <span className="whitespace-nowrap">Showing {startItem}</span>
                            <Minus className="h-3 w-3" strokeWidth={3} />
                            <span className="whitespace-nowrap">
                                {endItem} of {totalItems} items
                            </span>
                        </div>
                    )}

                    {/* Separator dot - only show if both items are visible */}
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
                            >
                                <SelectTrigger className="h-8 w-[60px] text-xs">
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

            {/* ⚠️ Navigation Controls - ALWAYS CENTERED when no left side */}
            <div
                className={`flex items-center gap-1 sm:gap-2 ${
                    shouldShowLeftSide
                        ? "w-full lg:w-auto justify-center lg:justify-end"
                        : "justify-center" // ⚠️ Always center when no left side
                }`}
            >
                {/* First page button - hidden on mobile when space is limited */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirst}
                    disabled={currentPage === 1 || totalPages === 0}
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
                    disabled={currentPage === 1 || totalPages === 0}
                    className="h-8 w-8 p-0"
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* ⚠️ Page numbers - responsive display */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Calculate which page to show - max 5 buttons
                        let pageToShow;
                        if (totalPages <= 5) {
                            // Show all pages if 5 or fewer
                            pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                            // Show first 5 pages when current page is in first 3
                            pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            // Show last 5 pages when current page is in last 3
                            pageToShow = totalPages - 4 + i;
                        } else {
                            // Show current page in center with 2 pages on each side
                            pageToShow = currentPage - 2 + i;
                        }

                        // Skip if calculated page exceeds total pages
                        if (pageToShow > totalPages || pageToShow < 1) return null;

                        return (
                            <Button
                                key={pageToShow}
                                variant={currentPage === pageToShow ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageToShow)}
                                className={`h-8 w-8 p-0 text-xs ${
                                    currentPage === pageToShow
                                        ? "bg-primary text-primary-foreground"
                                        : ""
                                }`}
                                aria-label={`Go to page ${pageToShow}`}
                                aria-current={currentPage === pageToShow ? "page" : undefined}
                            >
                                {pageToShow}
                            </Button>
                        );
                    })}

                    {/* ⚠️ Show ellipsis and last page on mobile when there are many pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <span className="px-2 text-muted-foreground text-sm">...</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="h-8 w-8 p-0 text-xs sm:hidden"
                                aria-label={`Go to last page ${totalPages}`}
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                </div>

                {/* Next page button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-8 w-8 p-0"
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page button - hidden on mobile when space is limited */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLast}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="hidden sm:flex h-8 w-8 p-0"
                    aria-label="Go to last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>

            {/* ⚠️ Mobile-only: Current page indicator - only show when left side is hidden */}
            {!shouldShowLeftSide && (
                <div className="text-center text-sm text-muted-foreground w-full lg:hidden">
                    Page {currentPage} of {totalPages}
                </div>
            )}
        </div>
    );
};

export default Pagination;
