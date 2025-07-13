"use client";

import React, { useEffect, useState } from "react";
import { Users, Video, TrendingUp, TrendingDown } from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import { USER_STATUS } from "@/constants/user-status";
import { Card, CardContent } from "@/components/ui/card";
import { useGetUsersQuery, useGetVideosQuery, useGetUserGrowthQuery } from "@/queries/use-admin";

// Types
type PeriodType = "day" | "week" | "month";
export default function AdminDashboard() {
    const [activeTimeRange, setActiveTimeRange] = useState<PeriodType>("day");

    const [utcTime, setUtcTime] = useState("");

    useEffect(() => {
        const now = new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            dateStyle: "full",
            timeStyle: "long",
        });
        setUtcTime(now);
    }, []);

    const {
        data: usersData,
        isLoading: isUsersLoading,
        isFetching: isUsersFetching,
        error: usersError,
    } = useGetUsersQuery({
        page: 1,
        pageSize: 5,
        status: USER_STATUS.ALL,
    });

    const totalUsers = usersData?.data?.totalElements || 0;

    const {
        data: videosResponse,
        isLoading: isVideosLoading,
        isFetching: isVideosFetching,
        error: videosError,
    } = useGetVideosQuery({
        pageNo: 1,
        pageSize: 5,
    });

    const totalVideos = videosResponse?.data.totalElements || 0;

    const {
        data: growthResponse,
        isLoading: growthLoading,
        isError: growthError,
        error: growthErrorMessage,
    } = useGetUserGrowthQuery({
        periodType: activeTimeRange,
        numPeriod: 3,
    });

    const growthData = growthResponse?.data;

    const getChartData = () => {
        if (!growthData) return [];

        const periodLabels = {
            day: "Previous Day",
            week: "Previous Week",
            month: "Previous Month",
        };

        const currentLabels = {
            day: "Current Day",
            week: "Current Week",
            month: "Current Month",
        };

        return [
            {
                name: periodLabels[activeTimeRange],
                users: growthData.previousUserCount,
                type: "previous",
            },
            {
                name: currentLabels[activeTimeRange],
                users: growthData.followingUserCount,
                type: "current",
            },
        ];
    };

    const getGrowthIndicator = () => {
        if (!growthData) return null;

        const isPositive = (growthData.growthPercent ?? 0) > 0;
        const Icon = isPositive ? TrendingUp : TrendingDown;
        const colorClass = isPositive ? "text-green-600" : "text-red-600";
        const bgClass = isPositive ? "bg-green-50" : "bg-red-50";

        return (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${bgClass}`}>
                <Icon className={`h-4 w-4 ${colorClass}`} />
                <span className={`text-sm font-medium ${colorClass}`}>
                    {isPositive ? "+" : ""}
                    {(growthData.growthPercent ?? 0).toFixed(1)}%
                </span>
            </div>
        );
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "--";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const chartData = getChartData();
    const pieData = chartData.map((item) => ({
        name: item.name,
        value: item.users,
        color: item.type === "previous" ? "#8884d8" : "#82ca9d",
    }));

    return (
        <>
            {/* Current Date & Time */}
            <Card className="">
                <CardContent className="flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-500">Current Date & Time (UTC)</div>
                        <div>{utcTime}</div>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded">
                        <div className="text-purple-600 font-medium">Admin Dashboard</div>
                        <div className="text-sm text-purple-400">Welcome back, Admin!</div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 mt-8">
                {/* Users Card */}
                <Card className="">
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Total Users</p>
                                {isUsersLoading || isUsersFetching ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : usersError ? (
                                    <span className="text-red-500">
                                        {usersError.message || "Failed to fetch users"}
                                    </span>
                                ) : (
                                    <h1 className="text-3xl font-bold">{totalUsers}</h1>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Videos Card */}
                <Card className="">
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-200 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Video className="h-8 w-8 text-purple-500" fill="currentColor" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Total Videos</p>
                                {isVideosLoading || isVideosFetching ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : videosError ? (
                                    <span className="text-red-500">
                                        {videosError.message || "Failed to fetch videos"}
                                    </span>
                                ) : (
                                    <h1 className="text-3xl font-bold">{totalVideos}</h1>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Growth Rate Card */}
                <Card className="">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Growth Rate</p>
                                {growthLoading ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : growthError ? (
                                    <span className="text-red-500 text-sm">Error</span>
                                ) : (
                                    <h1 className="text-3xl font-bold">
                                        {growthData
                                            ? `${(growthData.growthPercent ?? 0).toFixed(1)}%`
                                            : "--"}
                                    </h1>
                                )}
                            </div>
                            {!growthLoading && !growthError && getGrowthIndicator()}
                        </div>
                    </CardContent>
                </Card>

                {/* New Users Card */}
                <Card className="">
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">New Users</p>
                                {growthLoading ? (
                                    <Skeleton className="h-8 w-20" />
                                ) : growthError ? (
                                    <span className="text-red-500 text-sm">Error</span>
                                ) : (
                                    <h1 className="text-3xl font-bold">
                                        {growthData ? growthData.followingUserCount : "--"}
                                    </h1>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="py-4 gap-8 my-4">
                {/* User Growth Chart */}
                <Card className="py-6 rounded-md shadow-sm">
                    <CardContent className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">User Growth</h2>
                        <div className="flex space-x-2">
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "day"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100 text-black"
                                }`}
                                onClick={() => setActiveTimeRange("day")}
                            >
                                Daily
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "week"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100 text-black"
                                }`}
                                onClick={() => setActiveTimeRange("week")}
                            >
                                Weekly
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "month"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100 text-black"
                                }`}
                                onClick={() => setActiveTimeRange("month")}
                            >
                                Monthly
                            </button>
                        </div>
                    </CardContent>

                    {growthLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Skeleton className="h-full w-full" />
                        </div>
                    ) : growthError ? (
                        <div className="h-64 flex items-center justify-center text-red-500">
                            {growthErrorMessage?.message || "Failed to fetch growth data"}
                        </div>
                    ) : (
                        <div className="h-64 px-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                                    <Legend />
                                    <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.type === "previous"
                                                        ? "#8884d8"
                                                        : "#82ca9d"
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Distribution Chart */}
                <Card className="py-6 rounded-md shadow-sm">
                    <CardContent>
                        <h3 className="text-lg font-medium mb-4">User Distribution</h3>
                        {growthLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Skeleton className="h-full w-full" />
                            </div>
                        ) : growthError ? (
                            <div className="h-64 flex items-center justify-center text-red-500">
                                {growthErrorMessage?.message || "Failed to fetch growth data"}
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value} users`, "Count"]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Period Information */}
                <Card className="py-6 rounded-md shadow-sm">
                    <CardContent>
                        <h3 className="text-lg font-medium mb-4">Period Information</h3>
                        {growthLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : growthError ? (
                            <div className="text-red-500">
                                {growthErrorMessage?.message || "Failed to fetch growth data"}
                            </div>
                        ) : growthData ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border shadow">
                                    <p className="text-sm text-gray-400">Period Start</p>
                                    <p className="font-medium">
                                        {formatDate(growthData.periodStart)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border shadow">
                                    <p className="text-sm text-gray-400">Period End</p>
                                    <p className="font-medium">
                                        {formatDate(growthData.periodEnd)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg border shadow">
                                    <p className="text-sm text-gray-400">Total Users in Period</p>
                                    <p className="font-medium">{growthData.totalUser}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">No data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
