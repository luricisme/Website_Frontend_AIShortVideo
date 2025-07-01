import { videoApiRequests } from "@/apiRequests/video";
import ShortsViewer from "@/app/(user)/_components/shorts-viewer ";

export default async function VideosList() {
    const {
        data: { items: videos },
    } = await videoApiRequests.getVideos();

    return <ShortsViewer videos={videos} initialVideoIndex={0} updateUrl={false} urlPath="/" />;
}
