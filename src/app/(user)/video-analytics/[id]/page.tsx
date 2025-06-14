"use client";

import { PlatformPieChart, ViewsTrendChart } from "@/components/charts/dashboard-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Download,
    ExternalLink,
    Eye,
    MessageSquare,
    Share2,
    ThumbsUp,
    TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Params = {
    id: string;
};

interface VideoAnalyticsPageProps {
    params: Promise<Params>;
}

const VideoAnalyticsPage = ({ params }: VideoAnalyticsPageProps) => {
    // Mock data - trong thực tế sẽ fetch từ API
    const { id: videoId } = use(params);

    const [dateRange, setDateRange] = useState("this-week");

    const videoData = useMemo(() => {
        const baseData = {
            id: parseInt(videoId),
            title: "AI Portraits Collection",
            description:
                "A collection of AI-generated portraits showcasing various styles and techniques.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=800&auto=format&fit=crop&q=60",
            publishDate: "2025-05-28",
            duration: "5:24",
            status: "published",
        };

        // Điều chỉnh dữ liệu theo khoảng thời gian
        switch (dateRange) {
            case "this-week":
                return {
                    ...baseData,
                    totalViews: 45280,
                    totalLikes: 3245,
                    totalComments: 156,
                    totalShares: 278,
                    growth: 24,
                    platforms: {
                        youtube: { views: 22380, likes: 1890, comments: 87, shares: 145 },
                        facebook: { views: 15670, likes: 1120, comments: 45, shares: 89 },
                        tiktok: { views: 7230, likes: 235, comments: 24, shares: 44 },
                    },
                };
            case "this-month":
                return {
                    ...baseData,
                    totalViews: 125690,
                    totalLikes: 8420,
                    totalComments: 456,
                    totalShares: 687,
                    growth: 18,
                    platforms: {
                        youtube: { views: 62845, likes: 4870, comments: 256, shares: 354 },
                        facebook: { views: 41230, likes: 2650, comments: 134, shares: 218 },
                        tiktok: { views: 21615, likes: 900, comments: 66, shares: 115 },
                    },
                };
            case "3-months":
                return {
                    ...baseData,
                    totalViews: 289450,
                    totalLikes: 19780,
                    totalComments: 876,
                    totalShares: 1452,
                    growth: 15,
                    platforms: {
                        youtube: { views: 147120, likes: 11426, comments: 512, shares: 742 },
                        facebook: { views: 92624, likes: 5934, comments: 254, shares: 486 },
                        tiktok: { views: 49706, likes: 2420, comments: 110, shares: 224 },
                    },
                };
            case "all-time":
                return {
                    ...baseData,
                    totalViews: 547890,
                    totalLikes: 38650,
                    totalComments: 2450,
                    totalShares: 3870,
                    growth: 45,
                    platforms: {
                        youtube: { views: 273945, likes: 21450, comments: 1425, shares: 1935 },
                        facebook: { views: 191762, likes: 12350, comments: 735, shares: 1274 },
                        tiktok: { views: 82183, likes: 4850, comments: 290, shares: 661 },
                    },
                };
            default:
                return {
                    ...baseData,
                    totalViews: 45280,
                    totalLikes: 3245,
                    totalComments: 156,
                    totalShares: 278,
                    growth: 24,
                    platforms: {
                        youtube: { views: 22380, likes: 1890, comments: 87, shares: 145 },
                        facebook: { views: 15670, likes: 1120, comments: 45, shares: 89 },
                        tiktok: { views: 7230, likes: 235, comments: 24, shares: 44 },
                    },
                };
        }
    }, [videoId, dateRange]);

    const viewsOverTime = useMemo(() => {
        switch (dateRange) {
            case "this-week":
                return [
                    { day: "03/06", views: 3800, engagement: 7.8 },
                    { day: "04/06", views: 5200, engagement: 10.1 },
                    { day: "05/06", views: 7100, engagement: 11.3 },
                    { day: "06/06", views: 8900, engagement: 9.7 },
                    { day: "07/06", views: 11200, engagement: 12.4 },
                    { day: "08/06", views: 7980, engagement: 10.8 },
                    { day: "09/06", views: 9100, engagement: 11.2 },
                ];
            case "this-month":
                return [
                    { day: "Tuần 1", views: 24500, engagement: 8.7 },
                    { day: "Tuần 2", views: 32780, engagement: 9.5 },
                    { day: "Tuần 3", views: 35670, engagement: 10.2 },
                    { day: "Tuần 4", views: 42740, engagement: 11.5 },
                ];
            case "3-months":
                return [
                    { day: "Tháng 4", views: 85670, engagement: 7.8 },
                    { day: "Tháng 5", views: 92450, engagement: 8.9 },
                    { day: "Tháng 6", views: 111330, engagement: 10.2 },
                ];
            case "all-time":
                return [
                    { day: "Q1/2025", views: 125670, engagement: 6.5 },
                    { day: "Q2/2025", views: 289450, engagement: 8.7 },
                    { day: "Q3/2025", views: 132770, engagement: 10.2 },
                ];
            default:
                return [
                    { day: "03/06", views: 3800, engagement: 7.8 },
                    { day: "04/06", views: 5200, engagement: 10.1 },
                    { day: "05/06", views: 7100, engagement: 11.3 },
                    { day: "06/06", views: 8900, engagement: 9.7 },
                    { day: "07/06", views: 11200, engagement: 12.4 },
                    { day: "08/06", views: 7980, engagement: 10.8 },
                    { day: "09/06", views: 9100, engagement: 11.2 },
                ];
        }
    }, [dateRange]);

    const audienceRetention = useMemo(() => {
        return [
            { time: "0:00", retention: 100 },
            { time: "0:30", retention: 95 },
            { time: "1:00", retention: 88 },
            { time: "1:30", retention: 82 },
            { time: "2:00", retention: 76 },
            { time: "2:30", retention: 71 },
            { time: "3:00", retention: 65 },
            { time: "3:30", retention: 58 },
            { time: "4:00", retention: 52 },
            { time: "4:30", retention: 45 },
            { time: "5:00", retention: 38 },
            { time: "5:24", retention: 32 },
        ];
    }, []);

    // Dữ liệu phân bổ theo nền tảng
    const platformData = useMemo(
        () => [
            { name: "YouTube", value: videoData.platforms.youtube.views, color: "#ff0000" },
            { name: "Facebook", value: videoData.platforms.facebook.views, color: "#3b5998" },
            { name: "TikTok", value: videoData.platforms.tiktok.views, color: "#69c9d0" },
        ],
        [videoData]
    );

    // Các hàm tính toán tỷ lệ
    const getLikeRatio = () => {
        return Math.round((videoData.totalLikes / videoData.totalViews) * 100 * 10) / 10;
    };

    const getCommentRatio = () => {
        return Math.round((videoData.totalComments / videoData.totalViews) * 100 * 10) / 10;
    };

    const getShareRatio = () => {
        return Math.round((videoData.totalShares / videoData.totalViews) * 100 * 10) / 10;
    };

    // Dữ liệu so sánh hiệu suất
    const getPerformanceComparison = () => {
        switch (dateRange) {
            case "this-week":
                return {
                    views: 24,
                    likes: 18,
                    comments: 12,
                    shares: 24,
                };
            case "this-month":
                return {
                    views: 18,
                    likes: 15,
                    comments: 10,
                    shares: 20,
                };
            case "3-months":
                return {
                    views: 15,
                    likes: 12,
                    comments: 8,
                    shares: 16,
                };
            case "all-time":
                return {
                    views: 45,
                    likes: 32,
                    comments: 28,
                    shares: 38,
                };
            default:
                return {
                    views: 24,
                    likes: 18,
                    comments: 12,
                    shares: 24,
                };
        }
    };

    const performanceData = getPerformanceComparison();

    return (
        <div className="min-h-screen text-white pb-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{videoData.title}</h1>
                        <p className="text-zinc-400 mt-1">
                            Phát hành: {videoData.publishDate} • Thời lượng: {videoData.duration}
                        </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
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
                        <Badge variant={videoData.status === "published" ? "default" : "secondary"}>
                            {videoData.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </Badge>
                    </div>
                </div>

                {/* Video Preview & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-4">
                                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={videoData.thumbnail}
                                        alt={videoData.title}
                                        width={400}
                                        height={225}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Button className="w-full" variant="outline">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Xem video
                                    </Button>
                                    <Button className="w-full" variant="outline">
                                        <Download className="w-4 h-4 mr-2" />
                                        Tải xuống
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center text-zinc-400 mb-1">
                                        <Eye className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Lượt xem</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {videoData.totalViews.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-emerald-500">
                                        {dateRange === "this-week" &&
                                            `+${videoData.growth}% tuần này`}
                                        {dateRange === "this-month" &&
                                            `+${videoData.growth}% tháng này`}
                                        {dateRange === "3-months" &&
                                            `+${videoData.growth}% trong 3 tháng`}
                                        {dateRange === "all-time" &&
                                            `+${videoData.growth}% tổng thể`}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center text-zinc-400 mb-1">
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Lượt thích</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {videoData.totalLikes.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-emerald-500">
                                        {dateRange === "this-week" &&
                                            `+${getLikeRatio()}% tuần này`}
                                        {dateRange === "this-month" &&
                                            `+${getLikeRatio()}% tháng này`}
                                        {dateRange === "3-months" &&
                                            `+${getLikeRatio()}% trong 3 tháng`}
                                        {dateRange === "all-time" && `+${getLikeRatio()}% tổng thể`}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center text-zinc-400 mb-1">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Bình luận</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {videoData.totalComments.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-emerald-500">
                                        {dateRange === "this-week" &&
                                            `+${getCommentRatio()}% tuần này`}
                                        {dateRange === "this-month" &&
                                            `+${getCommentRatio()}% tháng này`}
                                        {dateRange === "3-months" &&
                                            `+${getCommentRatio()}% trong 3 tháng`}
                                        {dateRange === "all-time" &&
                                            `+${getCommentRatio()}% tổng thể`}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center text-zinc-400 mb-1">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Chia sẻ</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {videoData.totalShares.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-emerald-500">
                                        {dateRange === "this-week" &&
                                            `+${getShareRatio()}% tuần này`}
                                        {dateRange === "this-month" &&
                                            `+${getShareRatio()}% tháng này`}
                                        {dateRange === "3-months" &&
                                            `+${getShareRatio()}% trong 3 tháng`}
                                        {dateRange === "all-time" &&
                                            `+${getShareRatio()}% tổng thể`}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Detailed Analytics */}
                <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="platforms">Nền tảng</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle>Lượt xem theo thời gian</CardTitle>
                                    <CardDescription>
                                        {dateRange === "this-week" &&
                                            "Tăng trưởng lượt xem 7 ngày qua"}
                                        {dateRange === "this-month" &&
                                            "Tăng trưởng lượt xem tháng này"}
                                        {dateRange === "3-months" &&
                                            "Tăng trưởng lượt xem 3 tháng gần đây"}
                                        {dateRange === "all-time" &&
                                            "Tăng trưởng lượt xem từ khi phát hành"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ViewsTrendChart data={viewsOverTime} dateRange={dateRange} />
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle>Phân bổ theo nền tảng</CardTitle>
                                    <CardDescription>
                                        {dateRange === "this-week" &&
                                            "Lượt xem theo nền tảng trong tuần này"}
                                        {dateRange === "this-month" &&
                                            "Lượt xem theo nền tảng trong tháng này"}
                                        {dateRange === "3-months" &&
                                            "Lượt xem theo nền tảng trong 3 tháng qua"}
                                        {dateRange === "all-time" &&
                                            "Lượt xem theo nền tảng từ khi phát hành"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PlatformPieChart data={platformData} />
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800 mt-6">
                            <CardHeader>
                                <CardTitle>Độ giữ chân khán giả</CardTitle>
                                <CardDescription>
                                    Tỷ lệ người xem theo thời gian của video
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={audienceRetention}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="time" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#1F2937",
                                                    border: "1px solid #374151",
                                                    borderRadius: "8px",
                                                    color: "#F3F4F6",
                                                }}
                                                formatter={(value) => [`${value}%`, "Độ giữ chân"]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="retention"
                                                stroke="#8B5CF6"
                                                fill="#8B5CF6"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thêm phần so sánh hiệu suất */}
                        <Card className="bg-zinc-900 border-zinc-800 mt-6">
                            <CardHeader>
                                <CardTitle>So sánh hiệu suất</CardTitle>
                                <CardDescription>
                                    {dateRange === "this-week" && "So sánh với tuần trước"}
                                    {dateRange === "this-month" && "So sánh với tháng trước"}
                                    {dateRange === "3-months" && "So sánh với 3 tháng trước đó"}
                                    {dateRange === "all-time" && "Phân tích xu hướng tổng thể"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400">
                                            Lượt xem
                                        </h3>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-bold text-emerald-500">
                                                +{performanceData.views}%
                                            </p>
                                            <TrendingUp className="h-4 w-4 ml-2 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400">
                                            Lượt thích
                                        </h3>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-bold text-emerald-500">
                                                +{performanceData.likes}%
                                            </p>
                                            <TrendingUp className="h-4 w-4 ml-2 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400">
                                            Bình luận
                                        </h3>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-bold text-emerald-500">
                                                +{performanceData.comments}%
                                            </p>
                                            <TrendingUp className="h-4 w-4 ml-2 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-zinc-400">
                                            Chia sẻ
                                        </h3>
                                        <div className="flex items-center">
                                            <p className="text-2xl font-bold text-emerald-500">
                                                +{performanceData.shares}%
                                            </p>
                                            <TrendingUp className="h-4 w-4 ml-2 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="platforms" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {Object.entries(videoData.platforms).map(([platform, data]) => (
                                <Card key={platform} className="bg-zinc-900 border-zinc-800">
                                    <CardHeader>
                                        <CardTitle className="capitalize">{platform}</CardTitle>
                                        <CardDescription>
                                            {dateRange === "this-week" && "Hiệu suất tuần này"}
                                            {dateRange === "this-month" && "Hiệu suất tháng này"}
                                            {dateRange === "3-months" &&
                                                "Hiệu suất 3 tháng gần đây"}
                                            {dateRange === "all-time" && "Hiệu suất tổng thể"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Lượt xem</span>
                                                <span className="font-semibold">
                                                    {data.views.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Lượt thích</span>
                                                <span className="font-semibold">
                                                    {data.likes.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Bình luận</span>
                                                <span className="font-semibold">
                                                    {data.comments.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">Chia sẻ</span>
                                                <span className="font-semibold">
                                                    {data.shares.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
export default VideoAnalyticsPage;
