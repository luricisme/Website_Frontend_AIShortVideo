interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    isLoading,
}: PaginationProps) {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            if (totalPages > 1) {
                rangeWithDots.push(totalPages);
            }
        }

        return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="text-sm text-gray-400">
                Showing page {currentPage} of {totalPages} ({totalCount} total videos)
                {isLoading && <span className="ml-2 text-purple-400">Loading...</span>}
            </div>

            <div className={`flex items-center gap-2 ${isLoading ? "opacity-50" : ""}`}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {getVisiblePages().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === "number" && onPageChange(page)}
                            disabled={page === "..." || isLoading}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                page === currentPage
                                    ? "bg-[#7C4DFF] text-white shadow-lg shadow-purple-500/25"
                                    : page === "..."
                                    ? "text-gray-400 cursor-default"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
