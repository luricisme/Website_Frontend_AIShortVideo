import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
    totalStats: {
        videos: number;
        views: number;
        followers: number;
        engagement: number;
        // Các trường dữ liệu cho so sánh
        videoDelta: number; // Số video thay đổi
        viewsGrowth: number; // % lượt xem tăng/giảm
        followersDelta: number; // Số người theo dõi thay đổi
        engagementDelta: number; // % tương tác thay đổi
    };
    videoStats: Array<{
        views: number;
        title: string;
    }>;
    dateRange: string; // Nhận vào khoảng thời gian được chọn
}

const StatsOverview = ({ totalStats, videoStats, dateRange }: StatsOverviewProps) => {
    // Hàm lấy mô tả so sánh dựa vào khoảng thời gian
    const getComparisonText = () => {
        switch (dateRange) {
            case "this-week":
                return {
                    videos: `${totalStats.videoDelta >= 0 ? "+" : ""}${
                        totalStats.videoDelta
                    } trong tuần này`,
                    views: `${totalStats.viewsGrowth >= 0 ? "+" : ""}${
                        totalStats.viewsGrowth
                    }% so với tuần trước`,
                    followers: `${totalStats.followersDelta >= 0 ? "+" : ""}${
                        totalStats.followersDelta
                    } trong tuần này`,
                    engagement: `${totalStats.engagementDelta >= 0 ? "+" : ""}${
                        totalStats.engagementDelta
                    }% so với tuần trước`,
                };
            case "this-month":
                return {
                    videos: `${totalStats.videoDelta >= 0 ? "+" : ""}${
                        totalStats.videoDelta
                    } trong tháng này`,
                    views: `${totalStats.viewsGrowth >= 0 ? "+" : ""}${
                        totalStats.viewsGrowth
                    }% so với tháng trước`,
                    followers: `${totalStats.followersDelta >= 0 ? "+" : ""}${
                        totalStats.followersDelta
                    } trong tháng này`,
                    engagement: `${totalStats.engagementDelta >= 0 ? "+" : ""}${
                        totalStats.engagementDelta
                    }% so với tháng trước`,
                };
            case "3-months":
                return {
                    videos: `${totalStats.videoDelta >= 0 ? "+" : ""}${
                        totalStats.videoDelta
                    } trong 3 tháng qua`,
                    views: `${totalStats.viewsGrowth >= 0 ? "+" : ""}${
                        totalStats.viewsGrowth
                    }% so với quý trước`,
                    followers: `${totalStats.followersDelta >= 0 ? "+" : ""}${
                        totalStats.followersDelta
                    } trong 3 tháng qua`,
                    engagement: `${totalStats.engagementDelta >= 0 ? "+" : ""}${
                        totalStats.engagementDelta
                    }% so với quý trước`,
                };
            case "all-time":
                return {
                    videos: `Tổng số video đã tạo`,
                    views: `Tổng lượt xem`,
                    followers: `Tổng số người theo dõi`,
                    engagement: `Tỷ lệ tương tác trung bình`,
                };
            default:
                return {
                    videos: `${totalStats.videoDelta >= 0 ? "+" : ""}${
                        totalStats.videoDelta
                    } trong tuần này`,
                    views: `${totalStats.viewsGrowth >= 0 ? "+" : ""}${
                        totalStats.viewsGrowth
                    }% so với tuần trước`,
                    followers: `${totalStats.followersDelta >= 0 ? "+" : ""}${
                        totalStats.followersDelta
                    } trong tuần này`,
                    engagement: `${totalStats.engagementDelta >= 0 ? "+" : ""}${
                        totalStats.engagementDelta
                    }% so với tuần trước`,
                };
        }
    };

    const comparisonText = getComparisonText();

    // Hàm xác định liệu có nên hiển thị chỉ số so sánh hay không
    const shouldShowComparison = () => {
        return dateRange !== "all-time"; // Không hiển thị so sánh với "Tất cả"
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Tổng video</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.videos}</div>
                    <p className="text-xs text-zinc-500 mt-1">
                        {shouldShowComparison() ? comparisonText.videos : comparisonText.videos}
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Tổng lượt xem
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.views.toLocaleString()}</div>
                    {shouldShowComparison() && (
                        <div
                            className={`flex items-center text-xs ${
                                totalStats.viewsGrowth >= 0 ? "text-emerald-500" : "text-red-500"
                            } mt-1`}
                        >
                            {totalStats.viewsGrowth >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>{comparisonText.views}</span>
                        </div>
                    )}
                    {!shouldShowComparison() && (
                        <p className="text-xs text-zinc-500 mt-1">{comparisonText.views}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Người theo dõi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {totalStats.followers.toLocaleString()}
                    </div>
                    {shouldShowComparison() && (
                        <div
                            className={`flex items-center text-xs ${
                                totalStats.followersDelta >= 0 ? "text-emerald-500" : "text-red-500"
                            } mt-1`}
                        >
                            {totalStats.followersDelta >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>{comparisonText.followers}</span>
                        </div>
                    )}
                    {!shouldShowComparison() && (
                        <p className="text-xs text-zinc-500 mt-1">{comparisonText.followers}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Tỷ lệ tương tác
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStats.engagement}%</div>
                    {shouldShowComparison() && (
                        <div
                            className={`flex items-center text-xs ${
                                totalStats.engagementDelta >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                            } mt-1`}
                        >
                            {totalStats.engagementDelta >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>{comparisonText.engagement}</span>
                        </div>
                    )}
                    {!shouldShowComparison() && (
                        <p className="text-xs text-zinc-500 mt-1">{comparisonText.engagement}</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Video tốt nhất
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {videoStats[0]?.views.toLocaleString()}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 truncate">{videoStats[0]?.title}</p>
                </CardContent>
            </Card>
        </div>
    );
};
export default StatsOverview;
