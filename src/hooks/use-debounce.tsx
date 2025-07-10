"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hook để debounce một function
 * @param callback Function cần debounce
 * @param delay Thời gian trễ (milliseconds)
 * @returns Function đã được debounce
 */
export const useDebounce = <T extends unknown[], R>(callback: (...args: T) => R, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        (...args: T) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
};
