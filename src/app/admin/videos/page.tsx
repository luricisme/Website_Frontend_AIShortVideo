"use client";
import React, { useState } from "react";
import { CheckCircle, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetVideosQuery, useNumberOfCreatedVideosTodayQuery } from "@/queries/use-admin";
import { Skeleton } from "@/components/ui/skeleton";
import VideoTable from "@/app/admin/videos/_components/video-table";
import { VideoDetailModal } from "@/app/admin/videos/_components/video-detail-model/video-detail-modal";

export default function VideoManagementDashboard() {
    // const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    // Mock data for users
    const {
        data: videosResponse,
        isLoading: isVideosLoading,
        isFetching: isVideosFetching,
        error: videosError,
        refetch: refetchVideos,
    } = useGetVideosQuery({
        pageNo: currentPage,
        pageSize: pageSize,
    });

    const videos = videosResponse?.data.items || [];
    const totalVideos = videosResponse?.data.totalElements || 0;
    const totalPages = videosResponse?.data.totalPage || 0;

    const {
        data: numberOfCreatedVideosToday,
        isLoading: isLoadingNumberOfCreatedVideosToday,
        isError: isErrorNumberOfCreatedVideosToday,
        error: errorNumberOfCreatedVideosToday,
    } = useNumberOfCreatedVideosTodayQuery();

    return (
        <>
            {/* Stats Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* New Videos Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <Video
                                    className="h-8 w-8 text-blue-500"
                                    strokeWidth={1.5}
                                    fill="currentColor"
                                />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">New Videos Today</p>
                                <h1 className="text-3xl font-bold">
                                    {isLoadingNumberOfCreatedVideosToday ? (
                                        <>
                                            <Skeleton className="h-8 w-24" />
                                        </>
                                    ) : isErrorNumberOfCreatedVideosToday ? (
                                        <>
                                            <span className="text-red-500">
                                                {errorNumberOfCreatedVideosToday.message}
                                            </span>
                                        </>
                                    ) : (
                                        <> {numberOfCreatedVideosToday?.data}</>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Published Videos</p>
                                <h1 className="text-3xl font-bold">
                                    {isVideosLoading ? (
                                        <>
                                            <Skeleton className="h-8 w-24" />
                                        </>
                                    ) : videosError ? (
                                        <>
                                            <span className="text-red-500">
                                                {videosError.message}
                                            </span>
                                        </>
                                    ) : (
                                        <> {totalVideos}</>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className={"py-2 mb-12"}>
                <VideoTable
                    videos={videos}
                    isLoading={isVideosFetching || isVideosLoading}
                    error={videosError}
                    onVideoSelect={setSelectedVideo}
                    onRefresh={refetchVideos}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalVideos}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />

                {selectedVideo && (
                    <VideoDetailModal
                        video={videos.find((v) => v.id === selectedVideo)!}
                        onClose={() => setSelectedVideo(null)}
                    />
                )}
            </div>
        </>
    );
}
