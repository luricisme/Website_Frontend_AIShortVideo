interface CategoryViewData {
    cateName: string;
    viewCount: number;
}

interface ViewsByCategoryResponse {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElements: number;
    items: CategoryViewData[];
}

interface ViewsByCategoryChartProps {
    data?: {
        data: ViewsByCategoryResponse;
    };
    isLoading?: boolean;
}

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";

const COLORS = [
    "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B",
    "#10B981", "#06B6D4", "#84CC16", "#F97316", "#8B5A2B"
];

export const ViewsByCategoryChart: React.FC<ViewsByCategoryChartProps> = ({
                                                                              data,
                                                                              isLoading = false
                                                                          }) => {
    const [chartType, setChartType] = React.useState<'bar' | 'pie'>('bar');

    if (isLoading) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Views by Category
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Content performance by category
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

    if (!data?.data?.items || data.data.items.length === 0) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Views by Category
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Content performance by category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px] text-zinc-500">
                        No category data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { items, totalElements } = data.data;
    const totalViews = items.reduce((sum, item) => sum + item.viewCount, 0);

    // Prepare data for charts
    const chartData = items.map((item, index) => ({
        name: item.cateName,
        value: item.viewCount,
        color: COLORS[index % COLORS.length]
    }));

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    const renderPieChart = () => (
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
    );

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Views by Category
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            {totalElements} categories • {totalViews.toLocaleString()} total views
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={chartType === 'bar' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                            className="h-8"
                        >
                            <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={chartType === 'pie' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('pie')}
                            className="h-8"
                        >
                            <PieChartIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {chartType === 'bar' ? renderBarChart() : renderPieChart()}

                {/* Category Stats */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.slice(0, 4).map((item, index) => (
                        <div key={item.cateName} className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm text-zinc-300 flex-1">{item.cateName}</span>
                            <span className="text-sm font-medium text-white">
                                {item.viewCount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ViewsByCategoryChart;