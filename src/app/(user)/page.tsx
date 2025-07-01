import { Suspense } from "react";
import VideosSkeleton from "./_components/videos-skeleton";
import VideosList from "@/app/(user)/_components/video-list";

export default function Home() {
    return (
        <Suspense fallback={<VideosSkeleton />}>
            <VideosList />
        </Suspense>
    );
}
