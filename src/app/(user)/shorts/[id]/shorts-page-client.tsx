"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Video } from "@/types/video.types";
import { useVideoDetailQuery } from "@/queries/useVideo";
import ShortsViewer from "@/app/(user)/_components/shorts-viewer ";

const ShortsPage = () => {
    const router = useRouter();
    const params = useParams();
    const initialVideoId = params?.id ? String(params.id) : null;
    const videoId = initialVideoId ? parseInt(initialVideoId, 10) : null;

    const {
        data: videoResponse,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useVideoDetailQuery(videoId, {
        enabled: !!videoId,
    });

    useEffect(() => {
        if (isError && error && !isLoading) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Cannot load video details. Please try again later.");
            }

            // Redirect về home nếu video không tồn tại
            router.replace("/");
        }
    }, [isError, error, router, isLoading]);

    if (isLoading || !videoId) {
        return (
            <div className="min-h-screen flex items-center justify-center select-none">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Loading</p>
                </div>
            </div>
        );
    }

    // Error state hoặc không có data
    if (isError || !isSuccess || !videoResponse?.data) {
        return null; // Component sẽ redirect trong useEffect
    }

    const video = videoResponse.data;

    return (
        <ShortsViewer
            videos={[video as Video]}
            initialVideoIndex={0}
            updateUrl={false}
            urlPath="/"
        />
    );
};

export default ShortsPage;
