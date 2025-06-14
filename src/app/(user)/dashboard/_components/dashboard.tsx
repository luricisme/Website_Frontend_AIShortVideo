"use client";

import VideoCard from "@/app/(user)/_components/video-card";
import StatsOverview from "@/app/(user)/dashboard/_components/stats-overview";
import VideoTable from "@/app/(user)/dashboard/_components/video-table";
import { PlatformPieChart, ViewsTrendChart } from "@/components/charts/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useState } from "react";

const Dashboard = () => {
    // Mock data for date range selection
    const {
        dateRange,
        setDateRange,
        totalStats,
        videoStats,
        recentVideos,
        viewsTrendData,
        platformData,
    } = useDashboardData();

    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

    return (
        <div className="text-white pb-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold mb-6">Thống kê nội dung</h1>

                <div className="mb-8">
                    <Select defaultValue={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
                            <SelectValue placeholder="Chọn khoảng thời gian" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700">
                            <SelectItem value="this-week">Tuần này</SelectItem>
                            <SelectItem value="this-month">Tháng này</SelectItem>
                            <SelectItem value="3-months">3 tháng gần đây</SelectItem>
                            <SelectItem value="all-time">Tất cả</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <StatsOverview
                    dateRange={dateRange}
                    totalStats={totalStats}
                    videoStats={videoStats}
                />

                <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
                            Tổng quan
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-zinc-800">
                            Video của tôi
                        </TabsTrigger>
                        <TabsTrigger value="platforms" className="data-[state=active]:bg-zinc-800">
                            Theo nền tảng
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Lượt xem theo thời gian
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        {dateRange === "this-week" &&
                                            "Tăng trưởng lượt xem tuần này"}
                                        {dateRange === "this-month" &&
                                            "Tăng trưởng lượt xem tháng này"}
                                        {dateRange === "3-months" &&
                                            "Tăng trưởng lượt xem 3 tháng gần đây"}
                                        {dateRange === "all-time" &&
                                            "Tăng trưởng lượt xem từ khi phát hành"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ViewsTrendChart data={viewsTrendData} dateRange={dateRange} />
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Phân bổ theo nền tảng
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Lượt xem theo nền tảng
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
                                    Video nổi bật
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Video có hiệu suất tốt nhất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                                    {recentVideos.map((video) => (
                                        <VideoCard key={video.id} video={video} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                        <VideoTable videoStats={videoStats} onVideoSelect={setSelectedVideo} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
export default Dashboard;
