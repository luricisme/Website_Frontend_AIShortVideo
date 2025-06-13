"use client";

import StatsOverview from "@/app/(user)/dashboard/_components/stats-overview";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const Dashboard = () => {
    // Mock data for date range selection
    const { dateRange, setDateRange, totalStats, videoStats } = useDashboardData();

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
            </div>
        </div>
    );
};
export default Dashboard;
