"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/queries/use-user-info";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import toast from "react-hot-toast";
import EditUserInfo from "@/app/admin/users/update/[id]/_components/edit-user-info-page";

export default function AdminUpdateUser() {
    const params = useParams();

    const userId = params.id as string;

    const router = useRouter();

    const { data: userResponse, isLoading, isError, error, refetch } = useUserProfileQuery(userId);

    const user = userResponse?.data;

    const handleEditSuccess = () => {
        toast.success(`User "${user?.email}" has been updated successfully.`);
        router.push(`/admin/users`); // Redirect to the updated user profile
    };

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

            <EditUserInfo userProfile={user} onSuccess={handleEditSuccess} user={user} />
        </div>
    );
}
