"use client";

import PlatformStats from "@/app/(user)/dashboard/_components/platform-stats";
import StatsOverview from "@/app/(user)/dashboard/_components/stats-overview";
import { VideoDetailModal } from "@/app/(user)/dashboard/_components/video-detail-model/video-detail-modal";
import VideoTable from "@/app/(user)/dashboard/_components/video-table/video-table";
import UnauthorizedProfile from "@/app/(user)/profile/_components/unauthorized-profile";
import FeaturedVideoCard from "./videoCard"; // Component mới cho featured videos
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/providers/user-store-provider";
import { useGetVideosByUserIdQuery } from "@/queries/useVideo";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
    useDashboardOverviewQuery,
    usePlatformStatisticQuery,
    useViewsByCategoryQuery,
    useViewStatisticQuery,
    useTopInteractedVideosQuery // Import query mới
} from "@/queries/useDashboard";
import {ViewsPieChart} from "@/app/(user)/dashboard/_components/ViewsPieChart";
import ViewsByCategoryChart from "@/app/(user)/dashboard/_components/ViewByCategory";

const Dashboard = () => {
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    const { user: currentUser } = useUserStore((state) => state);
    const [selectedPlatform] = useState("youtube");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: overviewData,
        isLoading: isOverviewLoading,
        error: overviewError,
        refetch: refetchOverview,
    } = useDashboardOverviewQuery(!!currentUser?.id);

    const {
        data: platformData,
        isLoading: isPlatformLoading,
        error: platformError,
        refetch: refetchPlatform,
    } = usePlatformStatisticQuery({
        platform: selectedPlatform,
        enabled: !!currentUser?.id,
    });

    const {
        data: viewData,
        isLoading: isViewLoading,
        error: viewError,
        refetch: refetchView,
    } = useViewStatisticQuery(!!currentUser?.id);

    const {
        data: categoryData,
        isLoading: isCategoryLoading,
    } = useViewsByCategoryQuery(1, 10, !!currentUser?.id);

    // Query mới cho top interacted videos
    const {
        data: topInteractedData,
        isLoading: isTopInteractedLoading,
        error: topInteractedError,
        refetch: refetchTopInteracted,
    } = useTopInteractedVideosQuery(0, 10, !!currentUser?.id);

    const {
        data: videosResponse,
        isLoading: isVideosLoading,
        error: videosError,
        refetch: refetchVideos,
    } = useGetVideosByUserIdQuery({
        userId: currentUser?.id || 0,
        pageNo: currentPage,
        pageSize: pageSize,
        enabled: !!currentUser?.id,
    });

    const videos = videosResponse?.data.items || [];
    const totalVideos = videosResponse?.data.totalElements || 0;
    const totalPages = videosResponse?.data.totalPage || 0;
    const overview = overviewData?.data;
    const topInteractedVideos = topInteractedData?.data.items || [];

    if (!currentUser || (currentUser && !currentUser.id)) {
        return <UnauthorizedProfile />;
    }

    if ((overviewError || platformError || viewError || videosError || topInteractedError) &&
        !isOverviewLoading && !isPlatformLoading && !isViewLoading && !isVideosLoading && !isTopInteractedLoading) {
        return (
            <div className="text-white pb-10">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold mb-6">Content Analytics</h1>
                    <Alert className="bg-red-900/20 border-red-500/50 text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>Unable to load dashboard data. Please try again.</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    refetchOverview();
                                    refetchPlatform();
                                    refetchView();
                                    refetchVideos();
                                    refetchTopInteracted();
                                }}
                                className="ml-4"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (videosError && !isVideosLoading) {
        return (
            <div className="text-white pb-10">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-3xl font-bold mb-6">Content Analytics</h1>

                    <Alert className="bg-red-900/20 border-red-500/50 text-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>Unable to load video data. Please try again.</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetchVideos()}
                                className="ml-4"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white pb-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold mb-6">Content Analytics</h1>

                <StatsOverview
                    overviewData={overview}
                    isLoading={isOverviewLoading}
                />

                <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="bg-zinc-900 border border-zinc-800 gap-2">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-zinc-800">
                            My videos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <PlatformStats
                                data={platformData}
                                isLoading={isPlatformLoading}
                            />
                            <ViewsPieChart
                                data={viewData}
                                isLoading={isViewLoading}
                            />
                            <ViewsByCategoryChart
                                data={categoryData}
                                isLoading={isCategoryLoading}
                            />
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Featured videos
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Top performing videos by interactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isTopInteractedLoading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className="space-y-2">
                                                <Skeleton className="aspect-video bg-zinc-800 rounded-lg" />
                                                <Skeleton className="h-4 bg-zinc-800" />
                                                <Skeleton className="h-3 bg-zinc-800 w-2/3" />
                                            </div>
                                        ))}
                                    </div>
                                ) : topInteractedVideos.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                                        {topInteractedVideos.map((video, index) => (
                                            <FeaturedVideoCard
                                                key={`${video.videoUrl}-${index}`}
                                                video={video}
                                                onClick={() => {
                                                    // Có thể mở modal hoặc navigate đến video detail
                                                    window.open(video.videoUrl, '_blank');
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-zinc-400">
                                        <p>No featured videos available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                        <VideoTable
                            videos={videos}
                            isLoading={isVideosLoading}
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
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;