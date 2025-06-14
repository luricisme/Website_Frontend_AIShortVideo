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
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange = () => {},
    
}: PaginationProps) => {
    // Xử lý nút Previous
    const handlePrevious = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };

    // Xử lý nút Next
    const handleNext = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    // Xử lý nút First
    const handleFirst = () => {
        onPageChange(1);
    };

    // Xử lý nút Last
    const handleLast = () => {
        onPageChange(totalPages);
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
                <div className="text-sm text-zinc-400 flex items-center space-x-1">
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1}
                    <Minus className="h-4 w-3" strokeWidth={4} />
                    {Math.min(currentPage * itemsPerPage, totalItems)} trên {totalItems} mục
                </div>

                <div className="w-2 h-2 rounded-full bg-white/20"></div>

                {onItemsPerPageChange && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-zinc-400">Hiển thị</span>
                        <Select
                            value={String(itemsPerPage)}
                            onValueChange={(value) => onItemsPerPageChange(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px] bg-zinc-800 border-zinc-700">
                                <SelectValue placeholder={String(itemsPerPage)} />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700">
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-zinc-400">mục mỗi trang</span>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Hiển thị tối đa 5 nút trang
                        let pageToShow;
                        if (totalPages <= 5) {
                            pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                            pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageToShow = totalPages - 4 + i;
                        } else {
                            pageToShow = currentPage - 2 + i;
                        }

                        if (pageToShow > totalPages) return null;

                        return (
                            <Button
                                key={i}
                                variant={currentPage === pageToShow ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageToShow)}
                                className={
                                    currentPage === pageToShow
                                        ? "bg-purple-600 border-purple-700 hover:bg-purple-700 text-white"
                                        : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                                }
                            >
                                {pageToShow}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
export default Pagination;
