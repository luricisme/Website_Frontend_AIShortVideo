"use client";

import PlatformStats from "@/app/(user)/dashboard/_components/platform-stats";
import StatsOverview from "@/app/(user)/dashboard/_components/stats-overview";
import { VideoDetailModal } from "@/app/(user)/dashboard/_components/video-detail-model/video-detail-modal";
import VideoTable from "@/app/(user)/dashboard/_components/video-table/video-table";
import UnauthorizedProfile from "@/app/(user)/profile/_components/unauthorized-profile";
import { PlatformPieChart, ViewsTrendChart } from "@/components/charts/dashboard-charts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useUserStore } from "@/providers/user-store-provider";
import { useGetVideosByUserIdQuery } from "@/queries/useVideo";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
    // Mock data for date range selection
    const {
        dateRange,
        totalStats,
        videoStats,
        // recentVideos,
        viewsTrendData,
        platformData,
    } = useDashboardData();

    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    const { user: currentUser } = useUserStore((state) => state);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: videosResponse,
        isLoading: isVideosLoading,
        error: videosError,
        refetch: refetchVideos,
    } = useGetVideosByUserIdQuery({
        userId: currentUser?.id || 0,
        pageNo: currentPage,
        pageSize: pageSize,
        enabled: !!currentUser?.id, // Only fetch if user exists
    });

    const videos = videosResponse?.data.items || [];
    const totalVideos = videosResponse?.data.totalElements || 0;
    const totalPages = videosResponse?.data.totalPage || 0;

    if (!currentUser || (currentUser && !currentUser.id)) {
        return <UnauthorizedProfile />;
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

                {/* <div className="mb-8">
                    <Select defaultValue={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                            <SelectItem value="this-week">This week</SelectItem>
                            <SelectItem value="this-month">This month</SelectItem>
                            <SelectItem value="3-months">Last 3 months</SelectItem>
                            <SelectItem value="all-time">All time</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}

                <StatsOverview
                    dateRange={dateRange}
                    totalStats={totalStats}
                    videoStats={videoStats}
                />

                <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-zinc-800">
                            My videos
                        </TabsTrigger>
                        <TabsTrigger value="platforms" className="data-[state=active]:bg-zinc-800">
                            Platforms
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Views over time
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        {dateRange === "this-week" && "View growth this week"}
                                        {dateRange === "this-month" && "View growth this month"}
                                        {dateRange === "3-months" &&
                                            "View growth in the last 3 months"}
                                        {dateRange === "all-time" && "View growth since launch"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ViewsTrendChart data={viewsTrendData} dateRange={dateRange} />
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Platform distribution
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Views by platform
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PlatformPieChart data={platformData} />
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Featured videos
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Best performing videos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                                    {/* {recentVideos.map((video) => (
                                        <VideoCard key={video.id} video={video} />
                                    ))} */}
                                </div>
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

                    <TabsContent value="platforms" className="mt-6">
                        <PlatformStats />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
