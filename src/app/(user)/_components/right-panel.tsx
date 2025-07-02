"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface PanelConfig {
    title: string;
    content: ReactNode;
}

interface RightPanelProps {
    isVisible: boolean;
    isPanelVisible: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    isCompactView?: boolean;
}

const RightPanel = ({
    isVisible,
    isPanelVisible,
    title,
    children,
    onClose,
    containerRef = undefined,
    isCompactView = false,
}: RightPanelProps) => {
    const [rightPosition, setRightPosition] = useState(60);
    const { state, open, isMobile: sidebarIsMobile, openMobile } = useSidebar();
    const isMobile = useMediaQuery("(max-width: 767px)");

    const shouldShowAsModal = isMobile || isCompactView;

    useEffect(() => {
        const updatePosition = () => {
            if (containerRef?.current && !shouldShowAsModal) {
                const rect = containerRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const rightOffset = viewportWidth - rect.right;
                setRightPosition(rightOffset);
            }
        };

        updatePosition();

        window.addEventListener("resize", updatePosition);

        let observer: ResizeObserver | null = null;
        if (containerRef?.current) {
            observer = new ResizeObserver(() => {
                updatePosition();
            });
            observer.observe(containerRef.current);
        }

        const timeoutId = setTimeout(updatePosition, 300);

        return () => {
            window.removeEventListener("resize", updatePosition);
            clearTimeout(timeoutId);
            if (observer) {
                observer.disconnect();
            }
        };
    }, [containerRef, state, open, sidebarIsMobile, openMobile, shouldShowAsModal]);

    return (
        <>
            {isPanelVisible && shouldShowAsModal && (
                <div
                    className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                        isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <div
                className={`fixed z-50 bg-sidebar/90 backdrop-blur-sm 
                    transition-all duration-500 ease-in-out
                    ${
                        shouldShowAsModal
                            ? "inset-x-0 bottom-0 rounded-t-2xl w-full h-[85vh] flex flex-col"
                            : "top-[80px] bottom-0 w-1/3 right-0 flex flex-col"
                    }
                    ${
                        isVisible
                            ? shouldShowAsModal
                                ? "transform translate-y-0 opacity-100"
                                : "transform translate-x-0 opacity-100"
                            : shouldShowAsModal
                            ? "transform translate-y-full opacity-0"
                            : "transform translate-x-full opacity-0"
                    }
                `}
                style={{
                    visibility: isPanelVisible ? "visible" : "hidden",
                    ...(shouldShowAsModal ? {} : { right: `${rightPosition}px` }),
                }}
            >
                {/* Header - Fixed */}
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-white/10 bg-sidebar/90 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200"
                    >
                        <X className="text-white" size={18} />
                    </button>
                </div>

                {/* Modal handle indicator */}
                {shouldShowAsModal && (
                    <div className="flex-shrink-0 flex justify-center py-2 border-b border-white/10">
                        <div className="w-12 h-1 rounded-full bg-white/20" />
                    </div>
                )}

                {/* Content - Scrollable */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <div className="text-white h-full">{children}</div>
                </div>
            </div>
        </>
    );
};

export default RightPanel;
