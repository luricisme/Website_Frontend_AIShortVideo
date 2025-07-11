import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface StatsOverviewProps {
    // Data từ API /dashboard/overview
    overviewData?: {
        totalVideo: number;
        totalView: number;
        totalFollower: number;
        totalFollowing: number;
        viewBestVideo: number | null;
    };
    isLoading?: boolean;
}

const StatsOverview = ({
                           overviewData,
                           isLoading = false
                       }: StatsOverviewProps) => {
    // Default values khi không có data
    const defaultOverview = {
        totalVideo: 0,
        totalView: 0,
        totalFollower: 0,
        totalFollowing: 0,
        viewBestVideo: null,
    };

    const stats = overviewData || defaultOverview;

    // Tính engagement rate tạm thời (có thể thêm vào API sau)
    // const engagementRate = stats.totalView > 0 ? ((stats.totalFollower / stats.totalView) * 100).toFixed(1) : 0;

    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[...Array(5)].map((_, index) => (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="h-5 bg-zinc-800 rounded animate-pulse"></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-zinc-800 rounded animate-pulse mb-2"></div>
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Tổng video</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{stats.totalVideo}</div>
                    <p className="text-xs text-zinc-500 mt-1">Video đã tạo</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle>
                        Tổng lượt xem
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{stats.totalView.toLocaleString()}</div>
                    <p className="text-xs text-zinc-500 mt-1">Lượt xem tổng cộng</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle>
                        Người theo dõi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">
                        {stats.totalFollower.toLocaleString()}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Người theo dõi hiện tại</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                    <CardTitle>
                        Đang theo dõi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{stats.totalFollowing.toLocaleString()}</div>
                    <p className="text-xs text-zinc-500 mt-1">Số người đang theo dõi</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatsOverview;