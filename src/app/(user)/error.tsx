"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Videos loading error:", error);
    }, [error]);

    return (
        <div className="h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center space-y-4 p-6">
                <h2 className="text-xl font-semibold">Có lỗi xảy ra!</h2>
                <p className="text-neutral-400">Không thể tải video. Vui lòng thử lại.</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );
}
