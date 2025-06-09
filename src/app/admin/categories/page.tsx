"use client"
import React, { useState } from "react";
import {
    Search, Bell, CheckCircle, Folder, Network, PieChart, Rocket, Edit, Eye, Trash2, Plus
} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export default function CategoryManagementDashboard() {
    const [page, setPage] = useState(1);

    // Mock data cho categories
    const categories = [
        {
            id: 1,
            name: "Technology",
            description: "AI, gadgets, programming, and digital innovations",
            videos: 5632,
            subcategories: 8,
            growth: "+8.3%",
            status: "Active",
            popularSubcategories: ["AI Tools", "Web Dev", "Data Science"]
        },
        {
            id: 2,
            name: "Business",
            description: "Entrepreneurship, finance, and marketing strategies",
            videos: 3421,
            subcategories: 6,
            growth: "+5.2%",
            status: "Active",
            popularSubcategories: ["Startup", "Marketing", "Finance"]
        },
        {
            id: 3,
            name: "Education",
            description: "Online learning, tutorials, and skill development",
            videos: 2834,
            subcategories: 12,
            growth: "+12.1%",
            status: "Active",
            popularSubcategories: ["Online Courses", "Tutorials", "Certifications"]
        },
        {
            id: 4,
            name: "Health & Fitness",
            description: "Wellness, nutrition, and physical training",
            videos: 1945,
            subcategories: 5,
            growth: "+3.7%",
            status: "Active",
            popularSubcategories: ["Nutrition", "Workout", "Mental Health"]
        },
        {
            id: 5,
            name: "Entertainment",
            description: "Movies, music, gaming, and pop culture",
            videos: 4521,
            subcategories: 9,
            growth: "+6.8%",
            status: "Active",
            popularSubcategories: ["Gaming", "Movies", "Music"]
        },
        {
            id: 6,
            name: "Travel",
            description: "Destinations, tips, and cultural experiences",
            videos: 1287,
            subcategories: 4,
            growth: "+2.1%",
            status: "Active",
            popularSubcategories: ["Destinations", "Tips", "Culture"]
        }
    ];

    // Mock data cho subcategories
    const subcategories = [
        {
            id: 1,
            name: "AI Tools",
            parentCategory: "Technology",
            status: "Active",
            videos: 1245
        },
        {
            id: 2,
            name: "Web Dev",
            parentCategory: "Technology",
            status: "Active",
            videos: 987
        },
        {
            id: 3,
            name: "AI Education",
            parentCategory: "Education",
            status: "Active",
            videos: 1064
        },
        {
            id: 4,
            name: "Data Science",
            parentCategory: "Technology",
            status: "Active",
            videos: 756
        },
        {
            id: 5,
            name: "Digital Marketing",
            parentCategory: "Business",
            status: "Active",
            videos: 643
        }
    ];

    // Pagination cho categories
    const itemsPerPage = 6;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCategories = categories.slice(startIndex, endIndex);

    return (
        <div className="py-8 px-10 max-w-full min-h-screen  ">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold ">Content Categories Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Bell size={25} className="" />
                        <span className="absolute -top-1 -right-1 bg-red-500  text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                    </div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center ">
                            AU
                        </div>
                        <span className="ml-2 ">Admin User</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-8 mb-6">
                {/* Total Categories Card */}
                <Card className="">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Folder className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className=" mb-2">Total Categories</p>
                                <h1 className="text-3xl font-bold ">15</h1>
                                <p className="text-green-600 mt-1">+2 this month</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Network className="h-8 w-8 text-purple-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className=" mb-2">Subcategories</p>
                                <h1 className="text-3xl font-bold ">48</h1>
                                <p className="text-green-600 mt-1">+5 this month</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <PieChart className="h-8 w-8 text-red-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className=" mb-2">Most Popular</p>
                                <h1 className="text-3xl font-bold ">Technology</h1>
                                <p className=" mt-1">38%<span className={"text-green-600"}> +3,2%</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-50 rounded-full w-15 h-15 flex items-center justify-center mb-2 me-6">
                                <Rocket className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div className={"flex flex-col"}>
                                <p className=" mb-2">Fastest Growing</p>
                                <h1 className="text-3xl font-bold ">AI Education</h1>
                                <p className=" mt-1">+14,2%<span className={"text-green-600"}> this month</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <div>
                <Card className="mb-6 ">
                    <CardHeader>
                        <CardTitle className={"text-lg "}>Category Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-4">
                            <div className={"col-span-2 pe-5"}>
                                <label className="block text-sm font-medium mb-2 ">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 " />
                                    <Input
                                        placeholder="Search categories..."
                                        className="pl-8    placeholder:"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 ">Status</label>
                                <Select defaultValue="all">
                                    <SelectTrigger className="  ">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent className=" ">
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 ">Sort By</label>
                                <Select defaultValue="all">
                                    <SelectTrigger className="  ">
                                        <SelectValue placeholder="All Priorities" />
                                    </SelectTrigger>
                                    <SelectContent className=" ">
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="oldest">Oldest</SelectItem>
                                        <SelectItem value="most-videos">Most Videos</SelectItem>
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

            {/* Categories Grid */}
            <div className={"py-2 mb-12"}>
                <Card className="">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg ">All Categories</CardTitle>
                        <Button variant="default" className="bg-purple-600  hover:bg-purple-700">
                            <CheckCircle className="me-2 h-4 w-4" />
                            Add New Category
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {currentCategories.map((category) => (
                                <Card key={category.id} className=" ">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold ">{category.name}</h3>
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {category.status}
                                            </span>
                                        </div>

                                        <p className=" text-sm mb-4">{category.description}</p>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className=" text-xs">Videos</p>
                                                <p className=" font-bold">{category.videos.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className=" text-xs">Subcategories</p>
                                                <p className=" font-bold">{category.subcategories}</p>
                                            </div>
                                            <div>
                                                <p className=" text-xs">Growth</p>
                                                <p className="text-green-600 font-bold">{category.growth}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className=" text-xs mb-2">Popular Subcategories:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {category.popularSubcategories.map((sub, index) => (
                                                    <span key={index} className="bg-zinc-500  text-xs px-2 py-1 rounded">
                                                        {sub}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-start">
                                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300  p-2">
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center">
                            <p className=" text-sm">
                                Showing {startIndex + 1} to {Math.min(endIndex, categories.length)} of {categories.length} categories
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="   "
                                >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={page === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPage(i + 1)}
                                        className={page === i + 1
                                            ? "bg-purple-600 hover:bg-purple-700"
                                            : "   "
                                        }
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="   "
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Subcategories Management */}
            <Card className="">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg ">Subcategories Management</CardTitle>
                    <Button className="bg-purple-600 hover:bg-purple-700 ">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Subcategory
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b ">
                                <th className="text-left py-3 px-4  font-medium">Subcategory</th>
                                <th className="text-left py-3 px-4  font-medium">Parent Category</th>
                                <th className="text-left py-3 px-4  font-medium">Status</th>
                                <th className="text-left py-3 px-4  font-medium">Videos</th>
                                <th className="text-left py-3 px-4  font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subcategories.map((sub) => (
                                <tr key={sub.id} className="border-b  hover:">
                                    <td className="py-3 px-4 ">{sub.name}</td>
                                    <td className="py-3 px-4 ">{sub.parentCategory}</td>
                                    <td className="py-3 px-4">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {sub.status}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 ">{sub.videos.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300  p-1">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300  p-1">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300  p-1">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <p className=" text-sm">
                            Showing 1 to {subcategories.length} of 48 results
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
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
    );
}