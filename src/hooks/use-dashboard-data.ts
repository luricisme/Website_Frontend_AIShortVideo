import { useState, useMemo } from "react";

export type VideoStats = {
    id: number;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    publishDate: string;
    thumbnail: string;
    growth: number;
    platforms: {
        youtube: number;
        facebook: number;
        tiktok: number;
    };
};

export type VideoProps = {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    source: string;
    duration: number;
    author: {
        name: string;
        id: number;
        username: string;
        avatar: string;
    };
};

export const useDashboardData = () => {
    const [dateRange, setDateRange] = useState("this-week");

    // Dữ liệu tổng quan thay đổi theo khoảng thời gian
    const totalStats = useMemo(() => {
        switch (dateRange) {
            case "this-week":
                return {
                    videos: 36,
                    views: 125690,
                    followers: 1245,
                    engagement: 8.7,
                    // Dữ liệu hiển thị thay đổi
                    videoDelta: 2,
                    viewsGrowth: 15.2,
                    followersDelta: 45,
                    engagementDelta: 1.2,
                    monthlyGrowth: 14.5,
                };
            case "this-month":
                return {
                    videos: 36,
                    views: 245690,
                    followers: 1245,
                    engagement: 8.7,
                    videoDelta: 5,
                    viewsGrowth: 24.5,
                    followersDelta: 120,
                    engagementDelta: 2.5,
                    monthlyGrowth: 24.5,
                };
            case "3-months":
                return {
                    videos: 36,
                    views: 580450,
                    followers: 1245,
                    engagement: 8.7,
                    videoDelta: 12,
                    viewsGrowth: 38.7,
                    followersDelta: 350,
                    engagementDelta: 3.8,
                    monthlyGrowth: 38.7,
                };
            case "all-time":
                return {
                    videos: 36,
                    views: 1245690,
                    followers: 1245,
                    engagement: 8.7,
                    videoDelta: 36,
                    viewsGrowth: 0,
                    followersDelta: 1245,
                    engagementDelta: 0,
                    monthlyGrowth: 85.3,
                };
            default:
                return {
                    videos: 36,
                    views: 125690,
                    followers: 1245,
                    engagement: 8.7,
                    videoDelta: 2,
                    viewsGrowth: 15.2,
                    followersDelta: 45,
                    engagementDelta: 1.2,
                    monthlyGrowth: 14.5,
                };
        }
    }, [dateRange]);

    const recentVideos = useMemo(() => {
        const baseVideos = [
            {
                id: 1,
                title: "AI Portraits Collection",
                description: "Exploring the art of AI-generated portraits and creative imagery.",
                thumbnail:
                    "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
                source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
                duration: 324,
                views: 123456,
                author: {
                    id: 1,
                    name: "HLeNam",
                    username: "hlenam",
                    avatar: "https://example.com/hlenam.jpg",
                },
            },
            {
                id: 2,
                title: "Future City Concepts",
                description: "Visualizing the cities of tomorrow with advanced AI technology.",
                thumbnail:
                    "https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZ1dHVyaXN0aWMlMjBjaXR5fGVufDB8fDB8fHww",
                source: "https://cdn.pixabay.com/video/2025/04/15/264823_large.mp4",
                duration: 285,
                views: 98750,
                author: {
                    id: 1,
                    name: "HLeNam",
                    username: "hlenam",
                    avatar: "https://example.com/hlenam.jpg",
                },
            },
            {
                id: 3,
                title: "Abstract Animations",
                description: "Mesmerizing abstract animations created with cutting-edge AI tools.",
                thumbnail:
                    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3QlMjBhcnR8ZW58MHx8MHx8fDA%3D",
                source: "https://cdn.pixabay.com/video/2025/05/02/265426_large.mp4",
                duration: 198,
                views: 87620,
                author: {
                    id: 1,
                    name: "HLeNam",
                    username: "hlenam",
                    avatar: "https://example.com/hlenam.jpg",
                },
            },
        ];

        // Logic để sắp xếp lại video nổi bật theo khoảng thời gian
        if (dateRange === "this-week") {
            return [...baseVideos];
        } else if (dateRange === "this-month") {
            return [...baseVideos].sort((a, b) => b.views - a.views);
        } else if (dateRange === "3-months") {
            return [...baseVideos].sort((a, b) => a.id - b.id);
        } else if (dateRange === "all-time") {
            return [...baseVideos].sort((a, b) => b.id - a.id);
        }

        return baseVideos;
    }, [dateRange]);

    // Dữ liệu thống kê video chi tiết
    const videoStats = useMemo(() => {
        const baseStats = [
            {
                id: 1,
                title: "AI Portraits Collection",
                views: 45280,
                likes: 3245,
                comments: 156,
                shares: 278,
                publishDate: "2025-05-28",
                thumbnail:
                    "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
                growth: 24,
                platforms: {
                    youtube: 22380,
                    facebook: 15670,
                    tiktok: 7230,
                },
            },
            {
                id: 2,
                title: "Future City Concepts",
                views: 32450,
                likes: 2180,
                comments: 98,
                shares: 345,
                publishDate: "2025-05-15",
                thumbnail:
                    "https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZ1dHVyaXN0aWMlMjBjaXR5fGVufDB8fDB8fHww",
                growth: 18,
                platforms: {
                    youtube: 15670,
                    facebook: 10450,
                    tiktok: 6330,
                },
            },
            {
                id: 3,
                title: "Abstract Animations",
                views: 28760,
                likes: 1920,
                comments: 87,
                shares: 125,
                publishDate: "2025-06-01",
                thumbnail:
                    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3QlMjBhcnR8ZW58MHx8MHx8fDA%3D",
                growth: 32,
                platforms: {
                    youtube: 12450,
                    facebook: 8970,
                    tiktok: 7340,
                },
            },
            {
                id: 4,
                title: "Nature Through AI",
                views: 18450,
                likes: 1240,
                comments: 63,
                shares: 89,
                publishDate: "2025-06-05",
                thumbnail:
                    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlfGVufDB8fDB8fHww",
                growth: 12,
                platforms: {
                    youtube: 8750,
                    facebook: 5890,
                    tiktok: 3810,
                },
            },
        ];

        // Điều chỉnh dữ liệu dựa theo khoảng thời gian
        if (dateRange === "this-week") {
            return baseStats.map((stat) => ({
                ...stat,
                views: Math.round(stat.views * 0.5), // Giảm số lượt xem
                growth: stat.growth * 1.5, // Tăng tỷ lệ tăng trưởng do đo lường trong 1 tuần
            }));
        } else if (dateRange === "this-month") {
            return baseStats;
        } else if (dateRange === "3-months") {
            return baseStats.map((stat) => ({
                ...stat,
                views: Math.round(stat.views * 2.3),
                growth: stat.growth * 0.8,
            }));
        } else if (dateRange === "all-time") {
            return baseStats.map((stat) => ({
                ...stat,
                views: Math.round(stat.views * 5.1),
                growth: stat.growth * 0.4,
            }));
        }

        return baseStats;
    }, [dateRange]);

    // Dữ liệu xu hướng lượt xem thay đổi theo khoảng thời gian
    const viewsTrendData = useMemo(() => {
        switch (dateRange) {
            case "this-week":
                return [
                    { day: "T2", views: 12450, engagement: 7.2 },
                    { day: "T3", views: 14780, engagement: 8.1 },
                    { day: "T4", views: 18920, engagement: 9.3 },
                    { day: "T5", views: 15670, engagement: 7.8 },
                    { day: "T6", views: 22340, engagement: 10.2 },
                    { day: "T7", views: 25670, engagement: 11.4 },
                    { day: "CN", views: 28750, engagement: 12.1 },
                ];
            case "this-month":
                return [
                    { day: "Tuần 1", views: 45780, engagement: 8.5 },
                    { day: "Tuần 2", views: 52450, engagement: 9.2 },
                    { day: "Tuần 3", views: 58920, engagement: 10.3 },
                    { day: "Tuần 4", views: 65870, engagement: 11.8 },
                ];
            case "3-months":
                return [
                    { day: "Tháng 4", views: 145780, engagement: 7.5 },
                    { day: "Tháng 5", views: 189450, engagement: 8.2 },
                    { day: "Tháng 6", views: 245690, engagement: 9.3 },
                ];
            case "all-time":
                return [
                    { day: "Q1/2025", views: 345780, engagement: 6.5 },
                    { day: "Q2/2025", views: 489450, engagement: 7.2 },
                    { day: "Q3/2025", views: 545690, engagement: 8.3 },
                    { day: "Q4/2025", views: 645870, engagement: 9.8 },
                ];
            default:
                return [
                    { day: "T2", views: 12450, engagement: 7.2 },
                    { day: "T3", views: 14780, engagement: 8.1 },
                    { day: "T4", views: 18920, engagement: 9.3 },
                    { day: "T5", views: 15670, engagement: 7.8 },
                    { day: "T6", views: 22340, engagement: 10.2 },
                    { day: "T7", views: 25670, engagement: 11.4 },
                    { day: "CN", views: 28750, engagement: 12.1 },
                ];
        }
    }, [dateRange]);

    // Dữ liệu phân bổ theo nền tảng
    const platformData = useMemo(() => {
        switch (dateRange) {
            case "this-week":
                return [
                    { name: "YouTube", value: 62835, color: "#ff0000" },
                    { name: "Facebook", value: 47740, color: "#3b5998" },
                    { name: "TikTok", value: 38170, color: "#69c9d0" },
                ];
            case "this-month":
                return [
                    { name: "YouTube", value: 125670, color: "#ff0000" },
                    { name: "Facebook", value: 95480, color: "#3b5998" },
                    { name: "TikTok", value: 76340, color: "#69c9d0" },
                ];
            case "3-months":
                return [
                    { name: "YouTube", value: 289041, color: "#ff0000" },
                    { name: "Facebook", value: 219604, color: "#3b5998" },
                    { name: "TikTok", value: 175582, color: "#69c9d0" },
                ];
            case "all-time":
                return [
                    { name: "YouTube", value: 635918, color: "#ff0000" },
                    { name: "Facebook", value: 483129, color: "#3b5998" },
                    { name: "TikTok", value: 386280, color: "#69c9d0" },
                ];
            default:
                return [
                    { name: "YouTube", value: 62835, color: "#ff0000" },
                    { name: "Facebook", value: 47740, color: "#3b5998" },
                    { name: "TikTok", value: 38170, color: "#69c9d0" },
                ];
        }
    }, [dateRange]);

    // Thêm dữ liệu cho biểu đồ so sánh nền tảng
    const platformComparisonData = useMemo(() => {
        switch (dateRange) {
            case "this-week":
                return [
                    { platform: "YouTube", views: 62835, engagement: 7.8, subscribers: 623 },
                    { platform: "Facebook", views: 47740, engagement: 9.2, subscribers: 435 },
                    { platform: "TikTok", views: 38170, engagement: 12.4, subscribers: 290 },
                ];
            case "this-month":
                return [
                    { platform: "YouTube", views: 125670, engagement: 7.8, subscribers: 1245 },
                    { platform: "Facebook", views: 95480, engagement: 9.2, subscribers: 870 },
                    { platform: "TikTok", views: 76340, engagement: 12.4, subscribers: 580 },
                ];
            case "3-months":
                return [
                    { platform: "YouTube", views: 289041, engagement: 7.8, subscribers: 2863 },
                    { platform: "Facebook", views: 219604, engagement: 9.2, subscribers: 2001 },
                    { platform: "TikTok", views: 175582, engagement: 12.4, subscribers: 1334 },
                ];
            case "all-time":
                return [
                    { platform: "YouTube", views: 635918, engagement: 7.8, subscribers: 6298 },
                    { platform: "Facebook", views: 483129, engagement: 9.2, subscribers: 4402 },
                    { platform: "TikTok", views: 386280, engagement: 12.4, subscribers: 2935 },
                ];
            default:
                return [
                    { platform: "YouTube", views: 62835, engagement: 7.8, subscribers: 623 },
                    { platform: "Facebook", views: 47740, engagement: 9.2, subscribers: 435 },
                    { platform: "TikTok", views: 38170, engagement: 12.4, subscribers: 290 },
                ];
        }
    }, [dateRange]);

    return {
        dateRange,
        setDateRange,
        totalStats,
        recentVideos,
        videoStats,
        viewsTrendData,
        platformData,
        platformComparisonData, // Thêm dữ liệu so sánh nền tảng
    };
};
