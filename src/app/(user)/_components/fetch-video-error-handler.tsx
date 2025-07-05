"use client";

import { useEffect } from "react";

export default function FetchVideoErrorHandler({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Videos loading error:", { error });
    }, [error]);

    return (
        <div className="h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center space-y-4 p-6">
                <h2 className="text-xl font-semibold">{error?.message || "An error occurred!"}</h2>
                <p className="text-neutral-400">Failed to load videos. Please try again.</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
