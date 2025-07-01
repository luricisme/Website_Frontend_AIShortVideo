"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/providers/user-store-provider";
import { updateProfile } from "@/apiRequests/client/user.client";
import { userSchema, User as UserType } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoCard, { VideoCardProps } from "@/app/(user)/_components/video-card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function UserProfileApp() {
    const [currentPage, setCurrentPage] = useState("profile");
    const [activeTab, setActiveTab] = useState("my-videos");
    const [userProfile, setUserProfile] = useState<UserType>();

    const { user } = useUserStore((state) => state);

    useEffect(() => {
        if (user) {
            setUserProfile(user);
        }
    }, [user]);

    // Sample video data
    const VIDEO_LIST = [
        {
            id: 1,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 2,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 3,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 4,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 5,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 6,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
    ];

    const VideoGrid = ({ videos }: { videos: VideoCardProps[] }) => (
        <div className="grid grid-cols-4 gap-4 mt-6">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );

    const ProfilePage = () => (
        <div className="min-h-screen text-white mb-10">
            <div className="mx-auto">
                {/* Profile Header */}
                <div className="flex items-center space-x-6 mb-8">
                    <Avatar className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                        <AvatarImage
                            src={userProfile?.avatar || undefined}
                            alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                        />
                        <AvatarFallback>
                            {userProfile?.firstName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex flex-col space-x-4">
                            <h1 className="text-2xl font-bold">
                                {userProfile?.firstName} {userProfile?.lastName}
                            </h1>
                            <p className="text-zinc-400">@{userProfile?.username}</p>
                        </div>
                        <div className="my-2">
                            <button
                                onClick={() => setCurrentPage("edit")}
                                className="px-4 py-1.5 border border-zinc-600 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
                            >
                                Edit Profile
                            </button>
                            <Button
                                variant="secondary"
                                className="ml-4 px-4 py-1.5 text-sm hover:bg-purple-600 transition-colors"
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </div>
                        <div className="flex space-x-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold">{userProfile?.followers ?? 0}</div>
                                <div className="text-zinc-400 text-sm">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{userProfile?.following ?? 0}</div>
                                <div className="text-zinc-400 text-sm">Following</div>
                            </div>
                            {/* <div className="text-center">
                                <div className="font-bold">{userProfile?.videos}</div>
                                <div className="text-zinc-400 text-sm">Videos</div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Bio and Links */}
                <div className="mb-8">
                    <p className="text-white mb-2">{userProfile?.bio}</p>
                    {userProfile?.instagram && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            {/*<Instagram className="w-4 h-4" />*/}
                            <span className="text-sm">{userProfile?.instagram}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("my-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "my-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            My Videos
                        </button>
                        <button
                            onClick={() => setActiveTab("liked-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "liked-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Liked Videos
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "my-videos" && <VideoGrid videos={VIDEO_LIST} />}
                {activeTab === "liked-videos" && <VideoGrid videos={VIDEO_LIST} />}
            </div>
        </div>
    );

    const EditProfilePage = () => {
        const form = useForm<UserType>({
            resolver: zodResolver(userSchema),
            defaultValues: {
                firstName: userProfile?.firstName || "",
                lastName: userProfile?.lastName || "",
                username: userProfile?.username || "",
                bio: userProfile?.bio || "",
                instagram: userProfile?.instagram || "",
                twitter: userProfile?.twitter || "",
                youtube: userProfile?.youtube || "",
                followers: userProfile?.followers || 0,
                following: userProfile?.following || 0,
                email: userProfile?.email || "",
            },
        });

        const handleCancel = () => {
            setCurrentPage("profile");
        };

        const onSubmit = async (data: UserType) => {
            console.log("Form submitted with data:", data);
            // Here you would typically send the data to your API
            // handleProfileUpdate(data);
            try {
                const response = await updateProfile({
                    userId: user?.id || "",
                    dataUpdate: data,
                });

                if (response && response.status === 200) {
                    console.log("Profile updated successfully:", response.data);
                    toast.success("Profile updated successfully!");
                    setUserProfile(response.data);
                    setCurrentPage("profile");
                }
            } catch (error) {
                console.error("Error updating profile:", error);
                if (error instanceof Error) {
                    toast.error(error.message || "Failed to update profile");
                    return;
                }
                toast.error("Failed to update profile");
            }
        };

        return (
            <div className="min-h-screen text-white mb-10">
                <div className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

                    <div className="bg-zinc-900 rounded-lg p-6">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-4 mb-8">
                            <Avatar className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                                <AvatarImage
                                    src={userProfile?.avatar || undefined}
                                    alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                                />
                                <AvatarFallback>
                                    {userProfile?.firstName?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors">
                                Change
                            </button>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Basic Information */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                First Name
                                            </label>
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="First Name"
                                                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Last Name
                                            </label>
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Last Name"
                                                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Username
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Username"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Bio
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            placeholder="Bio"
                                                            rows={3}
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Social network link
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Instagram
                                            </label>
                                            <FormField
                                                control={form.control}
                                                name="instagram"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value ?? ""}
                                                                placeholder="Instagram"
                                                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Twitter
                                            </label>
                                            <FormField
                                                control={form.control}
                                                name="twitter"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value ?? ""}
                                                                placeholder="Twitter"
                                                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                YouTube
                                            </label>
                                            <FormField
                                                control={form.control}
                                                name="youtube"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value ?? ""}
                                                                placeholder="YouTube"
                                                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant={"outline"}
                                        onClick={handleCancel}
                                        className="px-6 py-2 border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
                                    >
                                        Change
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {currentPage === "profile" && <ProfilePage />}
            {currentPage === "edit" && <EditProfilePage />}
        </div>
    );
}
