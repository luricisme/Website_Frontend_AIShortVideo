"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export const useBodyScroll = (disabled = true) => {
    const originalStyleRef = useRef<string>("");
    const isDisabledRef = useRef<boolean>(false);
    const pathname = usePathname();

    const cleanup = useCallback(() => {
        if (isDisabledRef.current && typeof window !== "undefined") {
            document.body.style.overflow = originalStyleRef.current || "";
            isDisabledRef.current = false;
            console.log("🔓 Body scroll restored");
        }
    }, []);

    const applyScrollLock = useCallback(() => {
        if (typeof window === "undefined") return;

        if (!isDisabledRef.current) {
            // Lưu style gốc
            originalStyleRef.current = document.body.style.overflow || "";

            // Apply scroll lock
            document.body.style.overflow = "hidden";
            isDisabledRef.current = true;

            console.log("🔒 Body scroll disabled");
        }
    }, []);

    useEffect(() => {
        if (disabled) {
            applyScrollLock();
        } else {
            cleanup();
        }

        // Cleanup khi effect re-run hoặc unmount
        return cleanup;
    }, [disabled, applyScrollLock, cleanup]);

    useEffect(() => {
        return cleanup;
    }, [pathname, cleanup]);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && isDisabledRef.current) {
                document.body.style.overflow = originalStyleRef.current || "";
                console.log("🧹 Component unmount cleanup");
            }
        };
    }, []);

    // Handle visibility change (tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isDisabledRef.current) {
                // Tab bị ẩn, temporarily restore scroll
                document.body.style.overflow = originalStyleRef.current || "";
            } else if (!document.hidden && disabled) {
                // Tab visible lại, re-apply scroll lock
                document.body.style.overflow = "hidden";
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [disabled]);
};

/**
 * Global Body Scroll Manager
 * Cho multiple components cần disable scroll cùng lúc
 */
class BodyScrollManager {
    private static instance: BodyScrollManager;
    private lockCount = 0;
    private originalOverflow = "";
    private isLocked = false;

    static getInstance(): BodyScrollManager {
        if (!BodyScrollManager.instance) {
            BodyScrollManager.instance = new BodyScrollManager();
        }
        return BodyScrollManager.instance;
    }

    lock(): () => void {
        if (typeof window === "undefined") return () => {};

        this.lockCount++;

        if (!this.isLocked) {
            this.originalOverflow = document.body.style.overflow || "";
            document.body.style.overflow = "hidden";
            this.isLocked = true;
            console.log("🔒 Global body scroll locked");
        }

        // Return unlock function
        return () => {
            this.unlock();
        };
    }

    private unlock(): void {
        if (typeof window === "undefined") return;

        this.lockCount = Math.max(0, this.lockCount - 1);

        if (this.lockCount === 0 && this.isLocked) {
            document.body.style.overflow = this.originalOverflow;
            this.isLocked = false;
            console.log("🔓 Global body scroll unlocked");
        }
    }

    forceUnlock(): void {
        if (typeof window === "undefined") return;

        this.lockCount = 0;
        if (this.isLocked) {
            document.body.style.overflow = this.originalOverflow;
            this.isLocked = false;
            console.log("🔄 Global body scroll force unlocked");
        }
    }
}

export const useBodyScrollAdvanced = (disabled = true) => {
    const unlockRef = useRef<(() => void) | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (disabled && !unlockRef.current) {
            const manager = BodyScrollManager.getInstance();
            unlockRef.current = manager.lock();
        } else if (!disabled && unlockRef.current) {
            unlockRef.current();
            unlockRef.current = null;
        }

        return () => {
            if (unlockRef.current) {
                unlockRef.current();
                unlockRef.current = null;
            }
        };
    }, [disabled]);

    // Cleanup on navigation
    useEffect(() => {
        return () => {
            if (unlockRef.current) {
                unlockRef.current();
                unlockRef.current = null;
            }
        };
    }, [pathname]);
};

export const useBodyScrollSimple = (disabled = true) => {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const body = document.body;
        const originalOverflow = body.style.overflow;

        if (disabled) {
            body.style.overflow = "hidden";
        }

        // Cleanup function
        const cleanup = () => {
            body.style.overflow = originalOverflow || "";
        };

        return cleanup;
    }, [disabled]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined") {
                document.body.style.overflow = "";
            }
        };
    }, [pathname]);
};

/**
 * 🛡️ Defensive Hook với Error Handling
 * Cho production environments
 */
export const useBodyScrollProduction = (disabled = true) => {
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cleanup = useCallback(() => {
        try {
            if (typeof window !== "undefined" && document?.body) {
                document.body.style.overflow = "";
                console.log("✅ Body scroll cleanup successful");
            }
        } catch (error) {
            console.warn("⚠️ Body scroll cleanup error:", error);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            if (disabled) {
                document.body.style.overflow = "hidden";
            } else {
                cleanup();
            }

            return cleanup;
        } catch (error) {
            console.warn("⚠️ Body scroll setup error:", error);
            return cleanup;
        }
    }, [disabled, cleanup]);

    // Navigation cleanup
    useEffect(() => {
        return cleanup;
    }, [pathname, cleanup]);

    // Delayed cleanup as fallback
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                cleanup();
            }, 100);
        };
    }, [cleanup]);
};

/**
 * 🎪 Enhanced Scroll Container Hook
 */
type ScrollContainerOptions = {
    height?: string;
    hideScrollbar?: boolean;
    snapType?: "snap-x" | "snap-y" | "snap-both" | "";
    snapStrictness?: "snap-mandatory" | "snap-proximity" | "";
    className?: string;
};

export const useScrollContainer = (options: ScrollContainerOptions = {}) => {
    const {
        height = "h-screen",
        hideScrollbar = true,
        snapType = "snap-y",
        snapStrictness = "snap-mandatory",
        className = "",
    } = options;

    const scrollbarClasses = hideScrollbar ? "scrollbar-hide overflow-y-auto" : "overflow-y-auto";

    const snapClasses = snapType && snapStrictness ? `${snapType} ${snapStrictness}` : "";

    return [height, scrollbarClasses, snapClasses, className].filter(Boolean).join(" ").trim();
};

/**
 * 🎯 Default Export - Recommended cho Next.js
 */
export default useBodyScrollSimple;
