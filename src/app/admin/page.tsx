"use client";

import React from "react";
import { useState } from "react";
import {
    Users,
    Video,
    TrendingUp,
    Flag,
    ChevronRight,
    Plus,
    Eye,
    // Trash2, CheckCircle,
    Edit,
    Trash,
} from "lucide-react";
import {
    BarChart,
    Bar,
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// import {Button} from "@/components/ui/button";

// Mock data for the charts
const userGrowthData = [
    { name: "10:00", regularUsers: 2000, driveByUsers: 300 },
    { name: "12:00", regularUsers: 3000, driveByUsers: 400 },
    { name: "17:00", regularUsers: 3500, driveByUsers: 450 },
    { name: "18:00", regularUsers: 4000, driveByUsers: 500 },
    { name: "19:00", regularUsers: 4500, driveByUsers: 550 },
    { name: "20:00", regularUsers: 5000, driveByUsers: 600 },
    { name: "21:00", regularUsers: 5500, driveByUsers: 650 },
];

const contentCreationData = [
    { name: "16:00", videos: 200 },
    { name: "18:00", videos: 250 },
    { name: "17:00", videos: 350 },
    { name: "18:00", videos: 240 },
    { name: "19:00", videos: 220 },
    { name: "20:00", videos: 280 },
    { name: "21:00", videos: 180 },
];

const usageByFeatureData = [
    { name: "Video Upload", value: 35 },
    { name: "Video Sharing", value: 25 },
    { name: "Commenting", value: 20 },
    { name: "Live Stream", value: 15 },
    { name: "Other Features", value: 5 },
];

const popularTags = [
    { name: "#TikTokHacks", videos: "12.5k", growth: "+24%" },
    { name: "#MusicVideos", videos: "9.3k", growth: "+17%" },
    { name: "#DanceTrend", videos: "5.7k", growth: "+14%" },
    { name: "#ShortStories", videos: "2.8k", growth: "-3%" },
];

const recentVideos = [
    {
        id: 1,
        name: "Future City Concepts",
        creator: "Victoria Johnson",
        category: "Technology",
        status: "Active",
        views: "4200",
        publish: "Jan 15, 2025",
    },
    {
        id: 2,
        name: "Future City Concepts",
        creator: "Victoria Johnson",
        category: "Technology",
        status: "Active",
        views: "4200",
        publish: "Jan 15, 2025",
    },
    {
        id: 3,
        name: "Future City Concepts",
        creator: "Victoria Johnson",
        category: "Technology",
        status: "Active",
        views: "4200",
        publish: "Jan 15, 2025",
    },
];

const recentActivity = [
    {
        type: "user-registered",
        details: "Username: UserXYZ412",
        time: "2 minutes ago",
    },
    {
        type: "video-created",
        details: "Title: Future City Concepts",
        time: "15 minutes ago",
    },
    {
        type: "content-reported",
        details: "VideoID: XVD-6273",
        time: "34 minutes ago",
    },
    {
        type: "trending-tag",
        details: "#AI #Science gaining popularity",
        time: "1 hour ago",
    },
];

// Donut chart component for Usage by Feature
type DonutChartData = { name: string; value: number }[];
const DonutChart = ({ data }: { data: DonutChartData }) => {
    const COLORS = ["#8884d8", "#9f7aea", "#82ca9d", "#ffc658", "#ff8042"];

    // Calculate the circumference and dash offset for each segment
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    const total = data.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
    let currentOffset = 0;

    return (
        <div className="flex justify-center items-center h-64">
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="60" fill="white" />

                    {data.map((entry: { value: number }, index: number) => {
                        const strokeDasharray = (entry.value / total) * circumference;
                        const strokeDashoffset = currentOffset;
                        currentOffset -= strokeDasharray;

                        return (
                            <circle
                                key={`circle-${index}`}
                                cx="100"
                                cy="100"
                                r="60"
                                fill="transparent"
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth="30"
                                strokeDasharray={`${strokeDasharray} ${
                                    circumference - strokeDasharray
                                }`}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                                style={{ transition: "stroke-dashoffset 0.3s ease" }}
                            />
                        );
                    })}

                    <circle cx="100" cy="100" r="45" fill="white" />
                </svg>
            </div>

            <div className="ml-4">
                {data.map(
                    (
                        entry: {
                            name:
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                      unknown,
                                      string | React.JSXElementConstructor<unknown>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | Promise<
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | React.ReactPortal
                                      | React.ReactElement<
                                            unknown,
                                            string | React.JSXElementConstructor<unknown>
                                        >
                                      | Iterable<React.ReactNode>
                                      | null
                                      | undefined
                                  >
                                | null
                                | undefined;
                        },
                        index: number
                    ) => (
                        <div key={`legend-${index}`} className="flex items-center mb-1">
                            <div
                                className="w-3 h-3 mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-xs">{entry.name}</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [activeTimeRange, setActiveTimeRange] = useState("Daily");

    return (
        <>
            {/* Current Date & Time */}
            <Card className={" "}>
                <CardContent className="flex justify-between items-center">
                    <div>
                        <div className="text-sm text-gray-500">Current Date & Time (UTC)</div>
                        <div>2025-05-20 01:17:03</div>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded">
                        <div className="text-purple-600 font-medium">Admin Dashboard</div>
                        <div className="text-sm text-purple-400">Welcome back, Admin!</div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-8 mt-8">
                {/* Users Card */}
                <Card className={" "}>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Total Users</p>
                                <h1 className="text-3xl font-bold">12,345</h1>
                                <p className="text-green-600 mt-1">+2.5% vs last week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={" "}>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Users className="h-8 w-8 text-purple-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Total Videos</p>
                                <h1 className="text-3xl font-bold">87,629</h1>
                                <p className="text-green-600 mt-1">+6.5% vs last week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="py-4 grid grid-cols-2 gap-8 my-4">
                {/* User Growth Chart */}
                <Card className=" py-6 rounded-md shadow-sm ">
                    <CardContent className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">User Growth</h2>
                        <div className="flex space-x-2">
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "Daily"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setActiveTimeRange("Daily")}
                            >
                                Daily
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "Weekly"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setActiveTimeRange("Weekly")}
                            >
                                Weekly
                            </button>
                            <button
                                className={`px-2 py-1 text-xs rounded ${
                                    activeTimeRange === "Monthly"
                                        ? "bg-purple-100 text-purple-600"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setActiveTimeRange("Monthly")}
                            >
                                Monthly
                            </button>
                        </div>
                    </CardContent>

                    <div className="h-64 px-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="regularUsers"
                                    stroke="#8884d8"
                                    name="Regular daily use"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="driveByUsers"
                                    stroke="#82ca9d"
                                    name="Single drop-in use"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Content Creation Chart */}
                <Card className=" py-4 rounded-md shadow-sm ">
                    <CardContent className="flex justify-between items-center mb-4 px-8">
                        <h2 className="text-xl font-medium">Content Creation</h2>
                        <div className="flex space-x-2">
                            <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
                                7 Days
                            </button>
                            <button className="px-2 py-1 text-xs rounded bg-gray-100">
                                30 Days
                            </button>
                        </div>
                    </CardContent>

                    <div className="h-64 px-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contentCreationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="videos"
                                    name="Video Uploads"
                                    fill="#a78bfa"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* More Charts and Tables */}
            <div className="py-4 grid grid-cols-2 gap-8">
                {/* Usage by Feature */}
                <Card className=" p-4 rounded-md shadow-sm ">
                    <h2 className="font-medium mb-2">AI Usage by Feature</h2>
                    <DonutChart data={usageByFeatureData} />
                </Card>

                {/* Popular Tags */}
                <Card className=" p-4 rounded-md shadow-sm ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">Popular Tags</h2>
                        <button className="text-blue-500 text-sm">Manage</button>
                    </div>

                    <div className="space-y-4">
                        {popularTags.map((tag, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{tag.name}</div>
                                    <div className="text-sm text-gray-500">{tag.videos} videos</div>
                                </div>
                                <div
                                    className={`text-sm ${
                                        tag.growth.startsWith("+")
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {tag.growth}
                                </div>
                            </div>
                        ))}

                        <button className="w-full bg-purple-500 text-white py-2 rounded-md flex items-center justify-center">
                            <Plus size={16} />
                            <span className="ml-1">Add New Tag</span>
                        </button>
                    </div>
                </Card>
            </div>

            {/* Recent Videos */}
            <div className="py-4">
                <Card className=" rounded-md shadow-sm ">
                    <CardHeader className="flex justify-between items-center border-b">
                        <CardTitle className="font-medium">Recent Videos</CardTitle>
                        <button className="cursor-pointer text-blue-500 text-sm flex items-center">
                            View All
                            <ChevronRight size={14} />
                        </button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader className={""}>
                                <TableRow>
                                    <TableHead className="w-1/4">VIDEO</TableHead>
                                    <TableHead className="w-1/7">CREATOR</TableHead>
                                    <TableHead className="w-1/7">CATEGORY</TableHead>
                                    <TableHead className="w-1/7">STATUS</TableHead>
                                    <TableHead className="w-1/7">VIEWS</TableHead>
                                    <TableHead className="w-1/6">PUBLISHED</TableHead>
                                    <TableHead className="w-1/9">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentVideos.map((video) => (
                                    <TableRow key={video.id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 rounded me-3 bg-gray-200"></div>
                                                <div>
                                                    <p className="font-medium">{video.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{video.creator}</TableCell>
                                        <TableCell>{video.category}</TableCell>
                                        <TableCell>
                                            <div
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    video.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : video.status === "Inactive"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                <div
                                                    className="h-2 w-2 mr-1 rounded-full ${
                                                video.status === 'Active' ? 'bg-green-400' :
                                                video.status === 'Inactive' ? 'bg-yellow-400' :
                                                'bg-red-400'
                                              }"
                                                ></div>
                                                {video.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>{video.views}</TableCell>
                                        <TableCell>{video.publish}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="py-4">
                <Card className=" rounded-md shadow-sm">
                    <CardHeader className="flex justify-between items-center border-b">
                        <h2 className="font-medium">Recent Activity</h2>
                        <button className="text-blue-500 text-sm flex items-center">
                            View All
                            <ChevronRight size={14} />
                        </button>
                    </CardHeader>

                    <CardContent className="px-8 space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start">
                                <div
                                    className={`p-2 rounded-full mr-3 ${
                                        activity.type === "user-registered"
                                            ? "bg-blue-100"
                                            : activity.type === "video-created"
                                            ? "bg-purple-100"
                                            : activity.type === "content-reported"
                                            ? "bg-yellow-100"
                                            : "bg-green-100"
                                    }`}
                                >
                                    {activity.type === "user-registered" && (
                                        <Users size={16} className="text-blue-500" />
                                    )}
                                    {activity.type === "video-created" && (
                                        <Video size={16} className="text-purple-500" />
                                    )}
                                    {activity.type === "content-reported" && (
                                        <Flag size={16} className="text-yellow-500" />
                                    )}
                                    {activity.type === "trending-tag" && (
                                        <TrendingUp size={16} className="text-green-500" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div className="font-medium">
                                            {activity.type === "user-registered" &&
                                                "New user registered"}
                                            {activity.type === "video-created" &&
                                                "New video created"}
                                            {activity.type === "content-reported" &&
                                                "Content reported"}
                                            {activity.type === "trending-tag" && "New trending tag"}
                                        </div>
                                        <div className="text-xs text-gray-500">{activity.time}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">{activity.details}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
