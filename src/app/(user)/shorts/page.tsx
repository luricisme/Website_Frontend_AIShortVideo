"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShortsIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/shorts/1");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <div className="text-white text-xl">Đang tải shorts...</div>
        </div>
    );
}
