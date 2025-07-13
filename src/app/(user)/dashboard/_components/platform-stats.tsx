import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Youtube, TrendingUp, MessageCircle, Heart, ThumbsDown, Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PlatformStats = ({ data, isLoading }) => {
    // Hiển thị loading state
    if (isLoading) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {/* <Eye className="h-5 w-5" /> */}
                        <Youtube className="h-5 w-5" />
                        {/* Thống kê nền tảng */}
                        Platform Statistics
                    </CardTitle>
                    <CardDescription className="text-zinc-400">Platform statistics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Hiển thị khi không có dữ liệu
    if (!data) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="flex items-center justify-center p-8">
                    {/* <span className="text-zinc-400">Không có dữ liệu</span> */}
                    <span className="text-zinc-400">No data available</span>
                </CardContent>
            </Card>
        );
    }

    // Cấu hình platform
    const platformConfig = {
        youtube: {
            name: "YouTube",
            icon: Youtube,
            color: "text-red-600",
            bgColor: "bg-red-600",
        },
        // Có thể thêm các platform khác
        tiktok: {
            name: "TikTok",
            icon: TrendingUp,
            color: "text-pink-600",
            bgColor: "bg-pink-600",
        },
        // ... other platforms
    };

    const currentPlatform = platformConfig.youtube;
    const IconComponent = currentPlatform.icon;

    // Tính toán progress (giả sử max values để hiển thị progress bar)
    const maxValues = {
        viewCount: 1000000, // 1M views
        commentCount: 10000, // 10K comments
        likeCount: 50000, // 50K likes
        dislikeCount: 5000, // 5K dislikes
        interactionPercent: 100, // 100%
    };

    const calculateProgress = (value: number | null | undefined, max: number) => {
        if (value === undefined || value === null || isNaN(value)) {
            return 0;
        }
        return Math.min((value / max) * 100, 100);
    };

    // Format số
    const formatNumber = (num: number | null | undefined) => {
        if (num === undefined || num === null || isNaN(num)) {
            return "0";
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toLocaleString();
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center pb-2">
                <IconComponent className={`w-6 h-6 ${currentPlatform.color} mr-2`} />
                <CardTitle className="text-xl font-semibold">{currentPlatform.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Tổng lượt xem */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="flex items-center">
                                <TrendingUp className="w-4 h-4 me-2" />
                                {/* Tổng lượt xem */}
                                Total Views
                            </span>
                            <span className="font-medium">{formatNumber(data.viewCount || 0)}</span>
                        </div>
                        <Progress
                            value={calculateProgress(data.viewCount || 0, maxValues.viewCount)}
                            className="h-1 bg-zinc-800"
                            indicatorClassName={currentPlatform.bgColor}
                        />
                    </div>

                    {/* Bình luận */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="flex items-center">
                                <MessageCircle className="w-4 h-4 me-2" />
                                {/* Bình luận */}
                                Comments
                            </span>
                            <span className="font-medium">
                                {formatNumber(data.commentCount || 0)}
                            </span>
                        </div>
                        <Progress
                            value={calculateProgress(
                                data.commentCount || 0,
                                maxValues.commentCount
                            )}
                            className="h-1 bg-zinc-800"
                            indicatorClassName={currentPlatform.bgColor}
                        />
                    </div>

                    {/* Lượt thích */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="flex items-center">
                                <Heart className="w-4 h-4 me-2" />
                                {/* Lượt thích */}
                                Likes
                            </span>
                            <span className="font-medium">{formatNumber(data.likeCount || 0)}</span>
                        </div>
                        <Progress
                            value={calculateProgress(data.likeCount || 0, maxValues.likeCount)}
                            className="h-1 bg-zinc-800"
                            indicatorClassName={currentPlatform.bgColor}
                        />
                    </div>

                    {/* Lượt không thích */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="flex items-center">
                                <ThumbsDown className="w-4 h-4 me-2" />
                                {/* Lượt không thích */}
                                Dislikes
                            </span>
                            <span className="font-medium">
                                {formatNumber(data.dislikeCount || 0)}
                            </span>
                        </div>
                        <Progress
                            value={calculateProgress(
                                data.dislikeCount || 0,
                                maxValues.dislikeCount
                            )}
                            className="h-1 bg-zinc-800"
                            indicatorClassName="bg-red-600"
                        />
                    </div>

                    {/* Tỷ lệ tương tác */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">
                                {/* Tỷ lệ tương tác */}
                                {/* Tiếng anh */}
                                Interaction Rate
                            </span>
                            <span className="font-medium">
                                {(data.interactionPercent || 0).toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            value={data.interactionPercent || 0}
                            className="h-1 bg-zinc-800"
                            indicatorClassName={currentPlatform.bgColor}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlatformStats;
