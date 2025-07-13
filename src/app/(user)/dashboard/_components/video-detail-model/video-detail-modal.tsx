import {
    Eye,
    // Facebook,
    MessageSquare,
    PlayCircle,
    ThumbsUp,
    Youtube,
} from "lucide-react";
// import { Progress } from "@/components/ui/progress";

import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDetailPreview from "@/app/(user)/dashboard/_components/video-detail-model/video-detail-preview";

interface VideoDetailModalProps {
    video: Video;
    onClose: () => void;
}

export const VideoDetailModal = ({ video, onClose }: VideoDetailModalProps) => {
    return (
        <Card className="bg-zinc-900 border-zinc-800 mt-6">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl font-semibold line-clamp-2 leading-tight">
                        {video.title || "Untitled Video"}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1 text-sm">
                        {video.id && <span>ID: {video.id}</span>}
                    </CardDescription>
                </div>
                <Button
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800 shrink-0 w-full sm:w-auto"
                    onClick={onClose}
                >
                    Close
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Video preview section */}
                    <div className="space-y-4">
                        <VideoDetailPreview video={video} />

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center text-zinc-400 mb-1">
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Views</span>
                                </div>
                                <div className="text-lg sm:text-xl font-bold truncate">
                                    {(video.viewCnt || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center text-zinc-400 mb-1">
                                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Likes</span>
                                </div>
                                <div className="text-lg sm:text-xl font-bold truncate">
                                    {(video.likeCnt || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center text-zinc-400 mb-1">
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Comments</span>
                                </div>
                                <div className="text-lg sm:text-xl font-bold truncate">
                                    {(video.commentCnt || 0).toLocaleString()}
                                </div>
                            </div>

                            <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center text-zinc-400 mb-1">
                                    <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Duration</span>
                                </div>
                                <div className="text-lg sm:text-xl font-bold">
                                    {video.length ? (
                                        <>
                                            {Math.floor(video.length / 60)}:
                                            {(Math.floor(video.length) % 60)
                                                .toString()
                                                .padStart(2, "0")}
                                        </>
                                    ) : (
                                        <span className="text-zinc-500 text-base">--:--</span>
                                    )}
                                </div>
                            </div>

                            {/* <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                <div className="flex items-center text-zinc-400 mb-1">
                                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Chia sẻ</span>
                                </div>
                                <div className="text-lg sm:text-xl font-bold truncate">
                                    {video.shares.toLocaleString()}
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Platform performance và demographics */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-4 text-base sm:text-lg">
                                Platform Performance
                            </h3>

                            <div className="space-y-3 sm:space-y-4">
                                {/* YouTube */}
                                <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center min-w-0">
                                            <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3 shrink-0" />
                                            <span className="font-medium text-sm sm:text-base truncate">
                                                YouTube
                                            </span>
                                        </div>
                                        {/* <span className="text-sm sm:text-base shrink-0">{video.platforms.youtube.toLocaleString()}</span> */}
                                        <span className="text-xs sm:text-sm text-zinc-400 shrink-0">
                                            Coming soon
                                        </span>
                                    </div>
                                    {/* <Progress
                                        value={(video.platforms.youtube / video.viewCnt) * 100}
                                        className="h-2 bg-zinc-700"
                                        indicatorClassName="bg-red-600"
                                    /> */}
                                    <div className="text-xs text-zinc-500">
                                        Integration with YouTube Analytics
                                    </div>
                                </div>

                                {/* Facebook */}
                                {/* <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center min-w-0">
                                            <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3 shrink-0" />
                                            <span className="font-medium text-sm sm:text-base truncate">
                                                Facebook
                                            </span>
                                        </div>
                                        <span className="text-sm sm:text-base shrink-0">{video.platforms.facebook.toLocaleString()}</span>
                                        <span className="text-xs sm:text-sm text-zinc-400 shrink-0">
                                            Coming soon
                                        </span>
                                    </div>
                                    <Progress
                                        value={(video.platforms.facebook / video.viewCnt) * 100}
                                        className="h-2 bg-zinc-700"
                                        indicatorClassName="bg-blue-600"
                                    />
                                    <div className="text-xs text-zinc-500">
                                        Integration with Facebook Insights
                                    </div>
                                </div> */}

                                {/* TikTok */}
                                {/* <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center min-w-0">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0"
                                                fill="currentColor"
                                            >
                                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 013.83-4.33v-3.7a6.37 6.37 0 00-5.94 9.94 6.37 6.37 0 0010.98-4.4s0-.08 0-.12V9.4a8.16 8.16 0 003.55.77v-3.48z" />
                                            </svg>
                                            <span className="font-medium text-sm sm:text-base truncate">
                                                TikTok
                                            </span>
                                        </div>
                                        <span className="text-sm sm:text-base shrink-0">{video.platforms.tiktok.toLocaleString()}</span>
                                        <span className="text-xs sm:text-sm text-zinc-400 shrink-0">
                                            Coming soon
                                        </span>
                                    </div>
                                    <Progress
                                        value={(video.platforms.tiktok / video.viewCnt) * 100}
                                        className="h-2 bg-zinc-700"
                                        indicatorClassName="bg-zinc-300"
                                    />
                                    <div className="text-xs text-zinc-500">
                                        Integration with TikTok Analytics
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-700">
                            <h4 className="font-medium mb-3 text-sm sm:text-base">
                                Video Information
                            </h4>
                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Status:</span>
                                    <span className="text-green-400 font-medium">Published</span>
                                </div>
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-zinc-400 shrink-0">Video ID:</span>
                                    <span className="font-mono text-xs text-right break-all">
                                        {video.id}
                                    </span>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Has Video:</span>
                                    <span
                                        className={
                                            video.videoUrl ? "text-green-400" : "text-red-400"
                                        }
                                    >
                                        {video.videoUrl ? "✓ Available" : "✗ Missing"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-400">Thumbnail:</span>
                                    <span
                                        className={
                                            video.thumbnail ? "text-green-400" : "text-red-400"
                                        }
                                    >
                                        {video.thumbnail ? "✓ Available" : "✗ Missing"}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
