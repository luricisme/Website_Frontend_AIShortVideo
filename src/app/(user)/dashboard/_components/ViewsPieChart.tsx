import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader2 } from "lucide-react";

interface ViewStatisticData {
    totalView: number;
    youtubeView: number;
    tiktokView: number;
    mainView: number;
}

interface ViewsPieChartProps {
    data?: {
        data: ViewStatisticData;
    };
    isLoading?: boolean;
}

const COLORS = {
    youtube: "#FF0000",
    main: "#6366F1"
};

export const ViewsPieChart: React.FC<ViewsPieChartProps> = ({
                                                                data,
                                                                isLoading = false
                                                            }) => {
    if (isLoading) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Views Distribution
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Views breakdown by platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data?.data) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Views Distribution
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Views breakdown by platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px] text-zinc-500">
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { totalView, youtubeView, mainView } = data.data;

    // Chỉ hiển thị các platform có views > 0
    const chartData = [
        ...(youtubeView > 0 ? [{ name: "YouTube", value: youtubeView, color: COLORS.youtube }] : []),
        ...(mainView > 0 ? [{ name: "ASVC", value: mainView, color: COLORS.main }] : [])
    ];

    // Nếu không có data hoặc tổng views = 0
    if (chartData.length === 0 || totalView === 0) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Views Distribution
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Views breakdown by platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px] text-zinc-500">
                        No views recorded yet
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Views Distribution
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Total views: {totalView.toLocaleString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [value.toLocaleString(), "Views"]}
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #374151",
                                borderRadius: "8px",
                                color: "#F3F4F6",
                            }}
                            itemStyle={{
                                color: "#F3F4F6",
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-sm text-zinc-300">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};