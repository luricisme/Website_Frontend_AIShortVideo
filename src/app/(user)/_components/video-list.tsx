"use client";

import { useState } from "react";
import FetchVideoErrorHandler from "@/app/(user)/_components/fetch-video-error-handler";
import ShortsViewer from "@/app/(user)/_components/shorts-viewer ";
import VideosSkeleton from "@/app/(user)/_components/videos-skeleton";
import { useVideoListQuery } from "@/queries/useVideo";

export default function VideosList() {
    const [retryKey, setRetryKey] = useState(0);
    const { data, isLoading, isError, error } = useVideoListQuery({ retryKey });

    const videos = data?.data.items || [];

    if (isLoading) {
        return <VideosSkeleton />;
    }

    if (isError) {
        return (
            <FetchVideoErrorHandler
                error={error as Error}
                reset={() => setRetryKey((k) => k + 1)}
            />
        );
    }

    return <ShortsViewer videos={videos} initialVideoIndex={0} updateUrl={false} urlPath="/" />;
}
