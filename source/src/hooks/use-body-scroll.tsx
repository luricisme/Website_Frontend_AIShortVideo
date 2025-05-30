// hooks/useBodyScroll.js
import { useEffect } from "react";

/**
 * Custom hook để quản lý scroll của body
 * @param {boolean} disabled - true để ẩn scroll, false để hiện scroll
 */
export const useBodyScroll = (disabled = true) => {
    useEffect(() => {
        if (disabled) {
            // Lưu trạng thái scroll hiện tại
            const originalStyle = window.getComputedStyle(document.body).overflow;

            // Ẩn scroll
            document.body.style.overflow = "hidden";

            // Cleanup: khôi phục scroll ban đầu
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [disabled]);
};

/**
 * Hook để tạo className cho scroll container có thể tái sử dụng
 * @param {Object} options - Các tùy chọn cho scroll container
 */
type ScrollContainerOptions = {
    height?: string;
    hideScrollbar?: boolean;
    snapType?: string;
    snapStrictness?: string;
};

export const useScrollContainer = (options: ScrollContainerOptions = {}) => {
    const {
        height = "h-screen",
        hideScrollbar = true,
        snapType = "snap-y",
        snapStrictness = "snap-mandatory",
    } = options;

    const scrollbarClasses = hideScrollbar ? "scrollbar-hide overflow-y-auto" : "overflow-y-auto";

    const snapClasses = snapType && snapStrictness ? `${snapType} ${snapStrictness}` : "";

    return `${height} ${scrollbarClasses} ${snapClasses}`.trim();
};
