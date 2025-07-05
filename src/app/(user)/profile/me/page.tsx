"use client";

import React, { useEffect, useState } from "react";

import { useUserStore } from "@/providers/user-store-provider";
import { User as UserType } from "@/types/user.types";
import ProfileSkeleton from "@/app/(user)/profile/_components/profile-skeleton";
import ProfileError from "@/app/(user)/profile/_components/profile-error";
import UnauthorizedProfile from "@/app/(user)/profile/_components/unauthorized-profile";
import { useSession } from "next-auth/react";
import ProfilePage from "@/app/(user)/profile/_components/profile-page";
import EditProfilePage from "@/app/(user)/profile/_components/edit-profile-page";

export default function UserProfileApp() {
    const [currentPage, setCurrentPage] = useState("profile");
    const [activeTab, setActiveTab] = useState("my-videos");
    const [userProfile, setUserProfile] = useState<UserType>();

    const { status } = useSession();
    const { user, isFetching, error } = useUserStore((state) => state);

    useEffect(() => {
        if (user) {
            setUserProfile(user);
        }
    }, [user]);

    // Sample video data
    // const VIDEO_LIST = [
    //     {
    //         id: 1,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    //     {
    //         id: 2,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    //     {
    //         id: 3,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    //     {
    //         id: 4,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    //     {
    //         id: 5,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    //     {
    //         id: 6,
    //         title: "AI Portraits",
    //         description: "A collection of AI-generated portraits.",
    //         thumbnail:
    //             "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    //         source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
    //         duration: 324,
    //         views: 123456,
    //         author: {
    //             id: 1,
    //             name: "John Doe",
    //             username: "johndoe",
    //             avatar: "https://example.com/john-doe.jpg",
    //         },
    //     },
    // ];

    const handleEditProfile = () => {
        setCurrentPage("edit");
    };

    const handleCancelEdit = () => {
        setCurrentPage("profile");
    };

    const handleEditSuccess = () => {
        setCurrentPage("profile");
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if ((isFetching || status === "loading") && !user) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return <ProfileError error={error} onRetry={() => window.location.reload()} />;
    }

    if (!user) {
        return <UnauthorizedProfile />;
    }

    return (
        <div>
            {currentPage === "profile" && (
                <ProfilePage
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onEditProfile={handleEditProfile}
                    videos={[]}
                    user={userProfile || user}
                    isFetching={isFetching}
                    isOtherUser={false} // Assuming this is the current user's profile
                />
            )}
            {currentPage === "edit" && (
                <EditProfilePage
                    userProfile={userProfile}
                    onCancel={handleCancelEdit}
                    onSuccess={handleEditSuccess}
                    user={user}
                />
            )}
        </div>
    );
}
