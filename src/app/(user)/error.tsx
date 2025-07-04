"use client";

import { Button } from "@/components/ui/button";
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
                <h2 className="text-xl font-semibold">
                    Error occurs!
                </h2>
                <p className="text-neutral-400">{error.message || "An unexpected error occurred."}</p>
                <Button
                    onClick={reset}
                    className="px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
