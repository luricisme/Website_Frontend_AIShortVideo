"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/queries/use-user-info";
import ProfilePage from "@/app/(user)/profile/_components/profile-page";
import { useUserStore } from "@/providers/user-store-provider";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

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
            <div className="min-h-screen flex items-center justify-center select-none">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <p className="text-white">Loading User...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-red-400">Error Loading User</h2>
                    <p className="text-gray-400">
                        {error instanceof Error ? error.message : "Failed to load user profile"}
                    </p>
                    <div className="space-x-4">
                        <Button onClick={() => refetch()} variant="outline">
                            Try Again
                        </Button>
                        <Button onClick={() => router.push("/admin")} variant="secondary">
                            Go Admin Dashboard
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
                    <Button onClick={() => router.push("/admin")} variant="secondary">
                        Go Admin Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div>
            {/* Back To Users */}
            <div className="flex items-center justify-between mb-9 -mt-5">
                <Link href="/admin/users">
                    <Button variant="link">
                        <MoveLeft
                            strokeWidth={3}
                            className="w-5 h-5 text-zinc-400 hover:text-zinc-200 transition-colors"
                        />
                        Back to Users
                    </Button>
                </Link>
            </div>
            <ProfilePage
                activeTab={activeTab}
                onTabChange={handleTabChange}
                videos={[]}
                user={user}
                isFetching={isLoading}
                isOtherUser={currentUser?.id !== user.id ? true : false} // Check if the profile is of another user
                currentUser={currentUser ? currentUser : undefined} // Pass current user if available
            />
        </div>
    );
}
