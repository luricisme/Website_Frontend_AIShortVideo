import {
    CheckCircle,
    Eye,
    // Facebook,
    MessageSquare,
    PlayCircle,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
// import { Progress } from "@/components/ui/progress";

import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoDetailPreview from "@/app/admin/videos/_components/video-detail-model/video-detail-preview";

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
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
                    {/* Video preview section */}
                    <div className="flex justify-center items-start lg:col-span-1">
                        <div
                            className="
                w-full
                max-w-[320px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[320px] xl:max-w-[360px]
                max-h-[500px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[500px]
                mx-auto
                flex-shrink-0
            "
                        >
                            <VideoDetailPreview video={video} />
                        </div>
                    </div>
                    {/* Platform performance và demographics */}
                    <div className="space-y-6 mt-15 sm:mt-5 md:mt-[-8px] lg:mt-0 lg:col-span-3 w-full">
                        <div>
                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="grid  sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                        <div className="flex items-center text-zinc-400 mb-1">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="text-xs sm:text-sm">Status</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold truncate text-green-400 capitalize">
                                            {video.status.toLowerCase() || "Unknown"}
                                        </div>
                                    </div>

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

                                    {/* Dislike */}
                                    <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg">
                                        <div className="flex items-center text-zinc-400 mb-1">
                                            <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="text-xs sm:text-sm">Dislikes</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold truncate">
                                            {(video.dislikeCnt || 0).toLocaleString()}
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
                                                <span className="text-zinc-500 text-base">
                                                    --:--
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Video Script */}
                                <div className="bg-zinc-800 p-3 sm:p-4 rounded-lg mt-4">
                                    <div className="flex items-center text-zinc-400 mb-1">
                                        <span className="text-xs sm:text-sm">Script</span>
                                    </div>
                                    <div className="text-sm sm:text-base text-zinc-300">
                                        {video.script || "No script available"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
