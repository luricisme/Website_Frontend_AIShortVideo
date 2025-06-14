"use client";

import { useEffect, useRef } from "react";

/**
 * Hook để debounce một function
 * @param callback Function cần debounce
 * @param delay Thời gian trễ (milliseconds)
 * @returns Function đã được debounce
 */
export const useDebounce = <F extends (...args: unknown[]) => unknown>(
    callback: F,
    delay: number
) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (...args: Parameters<F>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};
