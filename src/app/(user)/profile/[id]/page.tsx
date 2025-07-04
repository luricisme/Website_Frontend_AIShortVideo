"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/queries/use-user-info";
import ProfilePage from "@/app/(user)/profile/_components/profile-page";
import { useUserStore } from "@/providers/user-store-provider";

export default function UserProfileApp() {
    const params = useParams();

    const userId = params.id as string;

    const [activeTab, setActiveTab] = useState("my-videos");

    const router = useRouter();

    const { data: userResponse, isLoading, isError, error, refetch } = useUserProfileQuery(userId);

    const user = userResponse?.data;

    const { user: currentUser } = useUserStore((state) => state);

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-red-400">Error Loading Profile</h2>
                    <p className="text-gray-400">
                        {error instanceof Error ? error.message : "Failed to load user profile"}
                    </p>
                    <div className="space-x-4">
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                        <Button onClick={() => router.push("/")} variant="secondary">
                            Go Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Handle case where user data doesn't exist
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-yellow-400">Profile Not Found</h2>
                    <p className="text-gray-400">The requested user profile could not be found.</p>
                    <Button onClick={() => router.push("/")} variant="secondary">
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <ProfilePage
                activeTab={activeTab}
                onTabChange={handleTabChange}
                videos={VIDEO_LIST}
                user={user}
                isFetching={isLoading}
                isOtherUser={currentUser?.id !== user.id ? true : false} // Check if the profile is of another user
            />
        </div>
    );
}
