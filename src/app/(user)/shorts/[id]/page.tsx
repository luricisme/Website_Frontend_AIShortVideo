import { getVideoDetail } from "@/apiRequests/video";
import { envServer } from "@/constants/env.server";
import ShortsPage from "@/app/(user)/shorts/[id]/shorts-page-client";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const { id } = await params;
        const videoId = id ? parseInt(id, 10) : null;

        console.log("🔍 Generating metadata for video:", videoId);

        if (!videoId) {
            return {
                title: "Invalid Video",
                description: "The video ID is invalid.",
            };
        }

        const video = await getVideoDetail(videoId);

        if (!video || !video.data) {
            return {
                title: "Video Not Found",
                description: "The requested video does not exist.",
            };
        }

        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: video.data.title,
            description: video.data.script || "Watch this amazing video.",
            openGraph: {
                title: video.data.title,
                description: video.data.script || "Watch this amazing video.",
                // ⚠️ Use relative URL - metadataBase will resolve it
                url: `/shorts/${videoId}`,
                siteName: "AI Short Video Platform",
                type: "video.other",
                images: [
                    {
                        // ⚠️ Use absolute URL or ensure thumbnail is full URL
                        // url: video.data.thumbnail?.startsWith("http")
                        //     ? video.data.thumbnail
                        //     : `${envServer.NEXTAUTH_URL}/default-thumbnail.jpg`,
                        url: video.data.thumbnail,
                        width: 1200, // ⚠️ Facebook recommended size
                        height: 630,
                        alt: video.data.title,
                        type: "image/jpeg",
                    },
                    ...previousImages,
                ],
                videos: [
                    {
                        // ⚠️ Use absolute URL for video
                        url: video.data.videoUrl?.startsWith("http")
                            ? video.data.videoUrl
                            : `${envServer.NEXTAUTH_URL}/shorts/${videoId}`,
                        width: 1280,
                        height: 720,
                        type: "video/mp4",
                    },
                ],
                // ⚠️ Add more OG properties
                locale: "en_US",
            },
            twitter: {
                card: "summary_large_image",
                title: video.data.title,
                description: video.data.script || "Watch this amazing video.",
                // ⚠️ Fix Twitter images format
                images: {
                    // url: video.data.thumbnail?.startsWith("http")
                    //     ? video.data.thumbnail
                    //     : `${envServer.NEXTAUTH_URL}/default-thumbnail.jpg`,
                    url: video.data.thumbnail,
                    alt: video.data.title,
                },
                creator: "@yourusername", // ⚠️ Add your Twitter handle
                site: "@yoursite",
            },
            authors: [{ name: video.data.user?.username || "AI Video Creator" }],
            category: video.data.category || "Entertainment",
            keywords: [video.data.category || "video", "shorts", "entertainment", "ai-generated"],
            // ⚠️ Enhanced robots configuration
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },
            other: {
                "video:duration": video.data.length?.toString() || "30",
                "video:release_date": new Date().toISOString(),
                // ⚠️ Add Facebook App ID if you have one
                "fb:app_id": "your_facebook_app_id", // Replace with actual ID
            },
        };
    } catch (error) {
        console.error("❌ Error generating metadata:", error);
        return {
            title: "Video Not Found",
            description: "The requested video does not exist.",
            openGraph: {
                title: "Video Not Found",
                description: "The requested video does not exist.",
                type: "website",
                images: [
                    {
                        url: "/default-error.jpg", // ⚠️ Relative URL
                        width: 1200,
                        height: 630,
                        alt: "Video Not Found",
                    },
                ],
            },
            twitter: {
                card: "summary",
                title: "Video Not Found",
                description: "The requested video does not exist.",
                images: {
                    url: "/default-error.jpg", // ⚠️ Relative URL
                    alt: "Video Not Found",
                },
            },
        };
    }
}

export default function Page() {
    return <ShortsPage />;
}
