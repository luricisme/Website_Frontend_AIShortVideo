"use client"

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Flag,
    Search,
    Award,
    Eye,
    Trash2,
    Bell
} from "lucide-react";

export default function ContentManagementDashboard() {
    const [page, setPage] = useState(1);

    // Mock data for reported videos
    const reportedVideos = [
        {
            id: 1,
            title: "Future City Concepts",
            creator: "James Wilson",
            reporter: {
                name: "Victoria Johnson",
                id: "#2438"
            },
            reason: "Misinformation",
            reasonDetails: "Contains inaccurate financial advice that could mislead viewers",
            status: "Pending",
            priority: "High",
            date: "Jan 15, 2025",
            timeAgo: "1 hour ago"
        },
        {
            id: 2,
            title: "AI Privacy Concerns",
            creator: "Emma Johnson",
            reporter: {
                name: "Sarah Chen",
                id: "#8742"
            },
            reason: "Copyright",
            reasonDetails: "Images used appear to be copyrighted without proper attribution",
            status: "Under Review",
            priority: "Medium",
            date: "May 04, 2025",
            timeAgo: "16 hours ago"
        },
        {
            id: 3,
            title: "Tech Review 2025",
            creator: "Alex Thompson",
            reporter: {
                name: "Multiple Reports",
                count: 5,
            },
            reason: "Technical Issue",
            reasonDetails: "Video freezes at 0:32, audio continues but no visual",
            status: "Pending",
            priority: "Low",
            date: "May 02, 2025",
            timeAgo: "3 days ago"
        },
        {
            id: 4,
            title: "Modern Art Trends",
            creator: "Sofia Mendez",
            reporter: {
                name: "Nina Rodriguez",
                id: "#9721"
            },
            reason: "Copyright",
            reasonDetails: "Artwork shown in video appears to be used without permission",
            status: "Resolved",
            priority: "Medium",
            date: "Apr 30, 2025",
            timeAgo: "5 days ago"
        }
    ];

    return (
        <div className="py-8 px-10 max-w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold">Content Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Bell size={25} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            AU
                        </div>
                        <span className="ml-2">Admin User</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-6 mt-8">
                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Flag className="h-8 w-8 text-red-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Pending Reports</p>
                                <h1 className="text-3xl font-bold">18</h1>
                                <p className="text-green-600 mt-1">+3 this week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Award className="h-8 w-8 text-yellow-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Under Review</p>
                                <h1 className="text-3xl font-bold">7</h1>
                                <p className="text-green-600 mt-1">+2 today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className="text-gray-500 mb-2">Resolved Today</p>
                                <h1 className="text-3xl font-bold">12</h1>
                                <p className="text-green-600 mt-1">84% approval rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Report Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Video title or reporter"
                                        className="pl-8"
                                    />
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
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="review">Under Review</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Priority</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Priorities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Report Type</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="copyright">Copyright</SelectItem>
                                        <SelectItem value="misinformation">Misinformation</SelectItem>
                                        <SelectItem value="technical">Technical Issue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <Select defaultValue="latest">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Latest First" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Latest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="priority">Priority</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end mt-4 pt-2">
                                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
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
                        <CardTitle className="text-lg">Reported Videos</CardTitle>
                        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Bulk Approve
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/5">REPORTED CONTENT</TableHead>
                                    <TableHead className="w-1/6">REPORTER</TableHead>
                                    <TableHead className="w-1/4">REASON</TableHead>
                                    <TableHead className="w-1/8">STATUS</TableHead>
                                    <TableHead className="w-1/8">PRIORITY</TableHead>
                                    <TableHead className="w-1/8">DATE</TableHead>
                                    <TableHead className="w-1/10">ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportedVideos.map((video) => (
                                    <TableRow key={video.id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                                                <div>
                                                    <p className="font-medium">{video.title}</p>
                                                    <p className="text-xs text-gray-500">Creator: {video.creator}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                                                <div>
                                                    <p className="text-sm">{video.reporter.name}</p>
                                                    {video.reporter.id ? (
                                                        <p className="text-xs text-gray-500">User {video.reporter.id}</p>
                                                    ) : (
                                                        <p className="text-xs text-gray-500">{video.reporter.count} users</p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <Badge className={
                                                    video.reason === "Copyright" ? "bg-yellow-100 text-yellow-800" :
                                                        video.reason === "Misinformation" ? "bg-red-100 text-red-800" :
                                                            "bg-blue-100 text-blue-800"
                                                }>
                                                    {video.reason}
                                                </Badge>
                                                <p className="text-xs text-gray-600 mt-1">{video.reasonDetails}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                video.status === "Pending" ? "bg-red-100 text-red-800" :
                                                    video.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-green-100 text-green-800"
                                            }>
                                                <span className="mr-1">•</span> {video.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                video.priority === "High" ? "bg-red-100 text-red-800" :
                                                    video.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-green-100 text-green-800"
                                            }>
                                                {video.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">{video.date}</p>
                                                <p className="text-xs text-gray-500">{video.timeAgo}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700 cursor-pointer">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-500">Showing 1 to 4 of 12,345 results</p>
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
        </div>
    );
}