"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Mặc định false trên server
        if (typeof window === "undefined") return;

        const media = window.matchMedia(query);

        // Cập nhật trạng thái ban đầu
        setMatches(media.matches);

        // Callback được gọi khi media query thay đổi
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Đăng ký listener
        media.addEventListener("change", listener);

        // Cleanup
        return () => {
            media.removeEventListener("change", listener);
        };
    }, [query]);

    return matches;
}
