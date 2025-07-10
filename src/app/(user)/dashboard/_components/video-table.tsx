import Pagination from "@/components/table/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Video } from "@/types/video.types";
import { AlertCircle, BarChart3, Edit, Eye, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DeleteVideoAlertDialog = ({ id }: { id: string }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    title="Delete video"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => {
                        // Handle delete video
                        console.log(`Delete video with ID: ${id}`);
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm delete video</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this video? This action cannot be undone.
                        <br />
                        Video ID: {id}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const EditVideoInfoDialog = ({ id }: { id: string }) => {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        title="Edit video"
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={() => {
                            // Handle edit video
                            console.log(`Edit video with ID: ${id}`);
                        }}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit video information</DialogTitle>
                        <DialogDescription>
                            Update your video information. Make sure the information fields are
                            accurate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title-1">Title</Label>
                            <Input id="title-1" name="title" defaultValue="Video Title" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

const VideoTableSkeleton = () => (
    <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-zinc-800">
                <TableCell>
                    <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-8 rounded bg-zinc-800" />
                        <Skeleton className="w-32 h-4 bg-zinc-800" />
                    </div>
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                    </div>
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
);

interface VideoTableProps {
    videos: Video[];
    isLoading: boolean;
    error: Error | null;
    onVideoSelect: (videoId: number) => void;
    onRefresh: () => void;
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
}: VideoTableProps) => {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <span>All my videos</span>
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

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                            <TableHead>Video</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Likes</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right">Shares</TableHead>
                            <TableHead className="text-right">Growth</TableHead>
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
                                                <div className="w-12 h-8 rounded overflow-hidden">
                                                    <Image
                                                        src={
                                                            video.thumbnail ||
                                                            "/placeholder-video.jpg"
                                                        }
                                                        alt={video.title || "Video thumbnail"}
                                                        width={48}
                                                        height={32}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="truncate max-w-[150px]">
                                                    {video.title || "Untitled Video"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(video.viewCnt || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(video.likeCnt || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(video.commentCnt || 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(0).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-emerald-500">+{0}%</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center space-x-2">
                                                <Button
                                                    title="View details"
                                                    onClick={() => onVideoSelect(video.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                </Button>
                                                <Link href={`/video-analytics/${video.id}`}>
                                                    <Button
                                                        title="Analytics"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                    >
                                                        <BarChart3 className="w-4 h-4 mr-1" />
                                                    </Button>
                                                </Link>
                                                <EditVideoInfoDialog id={"" + video.id} />
                                                <DeleteVideoAlertDialog id={"" + video.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="text-zinc-400">
                                            <p>No videos yet</p>
                                            <p className="text-sm mt-2">Create your first video</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>

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
                        showFullInfo={true} // Show all pagination features
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default VideoTable;
