"use client";
import React, { useState } from "react";
import {
    Search,
    Edit,
    // Eye,
    Trash,
    Bell,
    Plus,
    TrendingUp,
    Hash,
} from "lucide-react";
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

export default function TagManagementDashboard() {
    // const [page, setPage] = useState(1);
    const [page] = useState(1);

    // Mock data for tags
    const tags = [
        {
            id: 1,
            name: "#ArtificialIntelligence",
            category: "Technology",
            status: "Trending",
            videos: "3,524",
            growth: "+24%",
            created: "Jan 10, 2025",
        },
        {
            id: 2,
            name: "#TravelVlogs",
            category: "Travel",
            status: "Trending",
            videos: "2,871",
            growth: "+18%",
            created: "Jan 15, 2025",
        },
        {
            id: 3,
            name: "#GamingTips",
            category: "Gaming",
            status: "Growing",
            videos: "1,456",
            growth: "-5%",
            created: "Dec 20, 2024",
        },
        {
            id: 4,
            name: "#CookingBasics",
            category: "Food",
            status: "Trending",
            videos: "2,103",
            growth: "+32%",
            created: "Jan 03, 2025",
        },
    ];

    return (
        <div className="py-8 px-10 max-w-full min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold">Tag Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Bell size={25} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            3
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            AU
                        </div>
                        <span className="ml-2">Admin User</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-8 mb-6">
                {/* Active Tags Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Hash className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Active Tags</p>
                                <h1 className="text-3xl font-bold">248</h1>
                                <p className="text-green-600 mt-1">+12 this week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Trending Usage</p>
                                <h1 className="text-3xl font-bold">+32%</h1>
                                <p className="text-green-600 mt-1">+5.4% vs last week</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <div>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Tag Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2 pe-5">
                                <label className="block text-sm font-medium mb-2">
                                    Search Tags
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input placeholder="Search by tag name" className="pl-8" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="travel">Travel</SelectItem>
                                        <SelectItem value="gaming">Gaming</SelectItem>
                                        <SelectItem value="food">Food</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <Select defaultValue="all">
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <Select defaultValue="newest">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Newest First" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="oldest">Oldest First</SelectItem>
                                        <SelectItem value="mostVideos">Most Videos</SelectItem>
                                        <SelectItem value="highestGrowth">
                                            Highest Growth
                                        </SelectItem>
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

            <div className="py-2 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">All Tags</CardTitle>
                        <Button
                            variant="outline"
                            className="bg-purple-600 text-white hover:bg-purple-700"
                        >
                            <Plus className="me-2 h-5 w-5" />
                            Add New Tag
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-6">
                            {tags.map((tag) => (
                                <Card key={tag.id} className="overflow-hidden">
                                    <CardContent>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h2 className="font-semibold text-start text-lg">
                                                    {tag.name}
                                                </h2>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors duration-200">
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 cursor-pointer transition-colors duration-200">
                                                    <Trash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <span className="text-gray-500">Category:</span>
                                                <span className="ml-1 font-medium">
                                                    {tag.category}
                                                </span>
                                            </div>
                                            <div
                                                className={`flex items-center ${
                                                    tag.growth.startsWith("+")
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {tag.growth.startsWith("+") ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                                                )}
                                                {tag.growth}
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm mt-4">
                                            <div>
                                                <span className="text-gray-500">Videos:</span>
                                                <span className="ml-1 font-medium">
                                                    {tag.videos}
                                                </span>
                                            </div>
                                            <div
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    tag.status === "Trending"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {tag.status}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
        </div>
    );
}
