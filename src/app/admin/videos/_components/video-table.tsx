import {
    AlertCircle,
    // BarChart3,
    Eye,
    RefreshCw,
    PlayCircle,
} from "lucide-react";
// import Link from "next/link";

import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/table/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VideoTableSkeleton from "@/app/admin/videos/_components/video-table-skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoThumbnail from "@/app/(user)/dashboard/_components/video-table/video-table-thumbnail";
import EditVideoInfoDialog from "@/app/(user)/dashboard/_components/video-table/edit-video-title-dialog";
import DeleteVideoAlertDialog from "@/app/(user)/dashboard/_components/video-table/video-delete-alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface VideoTableProps {
    videos: Video[];
    isLoading: boolean;
    error: Error | null;
    onVideoSelect: (videoId: number) => void;
    onRefresh: () => void;
    onUpdateSuccess?: () => void;
    // Pagination props
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const VideoTable = ({
    videos,
    isLoading,
    error,
    onVideoSelect,
    onRefresh,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onUpdateSuccess = () => {},
}: VideoTableProps) => {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <span className="uppercase">All videos</span>
                    {error && (
                        <Button variant="outline" size="sm" onClick={onRefresh} className="ml-4">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    )}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Manage and track performance of all videos
                    {!isLoading && ` (${totalItems} videos)`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Error state */}
                {error && !isLoading && (
                    <Alert className="bg-red-900/20 border-red-500/50 text-red-200 mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Unable to load video list. Please try again.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                                <TableHead>Video</TableHead>
                                <TableHead className="text-right">Creator</TableHead>
                                <TableHead className="text-right">Category</TableHead>
                                <TableHead className="text-right">Tags</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Duration</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Loading state */}
                        {isLoading && <VideoTableSkeleton />}

                        {/* Data state */}
                        {!isLoading && !error && (
                            <TableBody>
                                {videos.length > 0 ? (
                                    videos.map((video) => (
                                        <TableRow
                                            key={video.id}
                                            className="hover:bg-zinc-800/50 border-zinc-800"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <VideoThumbnail video={video} />
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-[150px] text-sm font-medium">
                                                            {video.title || "Untitled Video"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {video.user?.username || "Unknown"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {video.category || "Uncategorized"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {video.tags && video.tags?.length > 0
                                                        ? video.tags
                                                              .map((tag) => tag.tagName)
                                                              .join(", ")
                                                        : "No tags"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {(video.viewCnt || 0).toLocaleString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {video.length
                                                        ? `${Math.floor(video.length / 60)}:${(
                                                              Math.floor(video.length) % 60
                                                          )
                                                              .toString()
                                                              .padStart(2, "0")}`
                                                        : "N/A"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-1">
                                                    <Button
                                                        title="View details"
                                                        onClick={() => onVideoSelect(video.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <EditVideoInfoDialog
                                                        video={video}
                                                        isAdmin={true}
                                                        onUpdateSuccess={onUpdateSuccess}
                                                    />
                                                    <DeleteVideoAlertDialog
                                                        video={video}
                                                        isAdmin={true}
                                                        onRefresh={onRefresh}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="text-zinc-400">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                                    <PlayCircle className="w-8 h-8 text-zinc-600" />
                                                </div>
                                                <p className="font-medium">No videos yet</p>
                                                <p className="text-sm mt-2">
                                                    Create your first video to get started
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </div>

                {/* Pagination - only show if has data and not loading */}
                {!isLoading && !error && totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        totalItems={totalItems}
                        itemsPerPage={pageSize}
                        onItemsPerPageChange={onPageSizeChange}
                        isLoading={isLoading}
                        itemType="videos"
                        showFullInfo={true}
                        updateUrlQuery={true} // Update URL query params for pagination
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default VideoTable;
