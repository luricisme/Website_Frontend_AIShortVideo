"use client";
import React, { useState } from "react";
import { Search, Edit, Eye, Trash, CheckCircle, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNumberOfCreatedVideosTodayQuery } from "@/queries/use-admin";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoManagementDashboard() {
    // const [page, setPage] = useState(1);
    const [page] = useState(1);

    // Mock data for users
    const videos = [
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
        {
            id: 4,
            name: "Future City Concepts",
            creator: "Victoria Johnson",
            category: "Technology",
            status: "Active",
            views: "4200",
            publish: "Jan 15, 2025",
        },
    ];

    const {
        data: numberOfCreatedVideosToday,
        isLoading: isLoadingNumberOfCreatedVideosToday,
        isError: isErrorNumberOfCreatedVideosToday,
        error: errorNumberOfCreatedVideosToday,
    } = useNumberOfCreatedVideosTodayQuery();

    return (
        <>
            {/* Stats Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* New Videos Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <Video
                                    className="h-8 w-8 text-blue-500"
                                    strokeWidth={1.5}
                                    fill="currentColor"
                                />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">New Videos Today</p>
                                <h1 className="text-3xl font-bold">
                                    {isLoadingNumberOfCreatedVideosToday ? (
                                        <>
                                            <Skeleton className="h-8 w-24" />
                                        </>
                                    ) : isErrorNumberOfCreatedVideosToday ? (
                                        <>
                                            <span className="text-red-500">
                                                {errorNumberOfCreatedVideosToday.message}
                                            </span>
                                        </>
                                    ) : (
                                        <> {numberOfCreatedVideosToday?.data}</>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Published Videos</p>
                                <h1 className="text-3xl font-bold">8,427</h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <CheckCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Deactivated</p>
                                <h1 className="text-3xl font-bold">47</h1>
                                <p className="text-green-600 mt-1">+2 vs last week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Filter Section */}
            <div>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className={"text-lg"}>User Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-4">
                            <div className={"col-span-2 pe-5"}>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Video title or reporter" className="pl-8" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Active</SelectItem>
                                        <SelectItem value="review">Inactive</SelectItem>
                                        <SelectItem value="resolved">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Priorities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="high">Newest</SelectItem>
                                        <SelectItem value="medium">Oldest</SelectItem>
                                        <SelectItem value="low">Most Videos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end mt-4 pt-2">
                                <Button
                                    variant="default"
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className={"py-2 mb-12"}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">All Videos</CardTitle>
                        <Button
                            variant="outline"
                            className="bg-purple-600 text-white hover:bg-purple-700"
                        >
                            <CheckCircle className="me-2 h-4 w-4" />
                            Add New Videos
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <Table>
                            <TableHeader>
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
                                {videos.map((video) => (
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
                                                {video.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>{video.views}</TableCell>
                                        <TableCell>{video.publish}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors duration-200">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 cursor-pointer transition-colors duration-200">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-500">
                                Showing 1 to 4 of 12,345 results
                            </p>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm">
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
