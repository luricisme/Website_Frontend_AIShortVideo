import Link from "next/link";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { FacebookIcon } from "react-share";
import { useEffect, useState } from "react";

import { icons } from "@/constants/icons";
import { User } from "@/types/user.types";
import { Video } from "@/types/video.types";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/table/pagination";
import VideoGrid from "@/app/(user)/profile/_components/videos/video-grid";
import { followUser, unfollowUser } from "@/apiRequests/client/user.client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    useCheckFollowStatusQuery,
    useGetLikedVideosByUserIdQuery,
    useGetVideosByUserIdQuery,
} from "@/queries/useVideo";

interface ProfilePageProps {
    activeTab: string;
    onTabChange?: (tab: string) => void;
    onEditProfile?: () => void;
    videos?: Video[];
    user: User;
    isFetching: boolean;
    isOtherUser: boolean;
    currentUser?: User;
}

const ProfilePage = ({
    activeTab,
    onTabChange = () => {},
    onEditProfile = () => {},
    user,
    isFetching,
    isOtherUser = false,
    currentUser = undefined,
}: ProfilePageProps) => {
    console.log(">>> ProfilePage user:", user);
    const [myVideosPage, setMyVideosPage] = useState(1);
    const [myVideosPageSize, setMyVideosPageSize] = useState(12);
    const [likedVideosPage, setLikedVideosPage] = useState(1);
    const [likedVideosPageSize, setLikedVideosPageSize] = useState(12);

    const {
        data: videosData,
        isLoading: isVideosLoading,
        error: videosError,
        refetch: refetchVideos,
    } = useGetVideosByUserIdQuery({
        userId: user.id ?? "",
        pageNo: myVideosPage - 1, // API uses 0-based indexing
        pageSize: myVideosPageSize,
        enabled: !!user.id,
    });

    const {
        data: likedVideosData,
        isLoading: isLikedVideosLoading,
        error: likedVideosError,
        refetch: refetchLikedVideos,
    } = useGetLikedVideosByUserIdQuery({
        userId: user.id ?? "",
        pageNo: likedVideosPage - 1, // API uses 0-based indexing
        pageSize: likedVideosPageSize,
        enabled: !!user.id,
    });

    const { data: followStatusData, refetch: refetchFollowStatus } = useCheckFollowStatusQuery(
        user.id ?? "",
        isOtherUser && !!user.id
    );

    const [isFollowing, setIsFollowing] = useState<boolean>(followStatusData?.data ?? false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);

    useEffect(() => {
        if (!isOtherUser) return;
        setIsFollowing(followStatusData?.data ?? false);
    }, [followStatusData?.data, isOtherUser]);

    useEffect(() => {
        if (activeTab === "my-videos") {
            setMyVideosPage(1);
        } else if (activeTab === "liked-videos") {
            setLikedVideosPage(1);
        }
    }, [activeTab]);

    const handleMyVideosPageChange = (page: number) => {
        setMyVideosPage(page);
    };

    const handleMyVideosPageSizeChange = (pageSize: number) => {
        setMyVideosPageSize(pageSize);
        setMyVideosPage(1); // Reset to first page when changing page size
    };

    const handleLikedVideosPageChange = (page: number) => {
        setLikedVideosPage(page);
    };

    const handleLikedVideosPageSizeChange = (pageSize: number) => {
        setLikedVideosPageSize(pageSize);
        setLikedVideosPage(1); // Reset to first page when changing page size
    };

    const handleFollowClick = async () => {
        if (isFollowingLoading) return;
        setIsFollowingLoading(true);
        try {
            let response;
            setIsFollowing((prev) => !prev);
            if (isFollowing) {
                response = await unfollowUser(user.id ?? "");
            } else {
                response = await followUser(user.id ?? "");
            }

            if (response && response.status === 200) {
                await refetchFollowStatus();
            }
        } catch (error) {
            console.error("Error following user:", { error });
            setIsFollowing((prev) => !prev); // Revert on error
        } finally {
            setIsFollowingLoading(false);
        }
    };

    const myVideos = videosData?.data.items || [];
    const myVideosPagination = videosData?.data;

    const likedVideos = likedVideosData?.data.items || [];
    const likedVideosPagination = likedVideosData?.data;

    return (
        <div className="min-h-screen text-white mb-10">
            <div className="mx-auto max-w-6xl px-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                    <Avatar className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
                        <AvatarImage
                            src={user?.avatar || undefined}
                            alt={`${user?.firstName} ${user?.lastName}`}
                        />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-2xl font-bold">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-zinc-400">@{user?.username}</p>
                        </div>
                        {isOtherUser == false ? (
                            <div className="my-4 flex flex-wrap gap-2">
                                <button
                                    onClick={onEditProfile}
                                    className="px-4 py-1.5 border border-zinc-600 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
                                    disabled={isFetching}
                                >
                                    Edit Profile
                                </button>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-1.5 text-sm hover:bg-purple-600 transition-colors"
                                >
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            </div>
                        ) : currentUser && currentUser.id !== user.id ? (
                            <div className="my-4 flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    className="rounded-full font-semibold text-[10px] md:text-xs py-0.5 px-2 md:py-1 md:px-3 h-6 md:h-8"
                                    onClick={handleFollowClick}
                                    disabled={isFollowingLoading}
                                >
                                    {isFollowingLoading ? (
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                    ) : isFollowing ? (
                                        "Unfollow"
                                    ) : (
                                        "Follow"
                                    )}
                                </Button>
                            </div>
                        ) : null}

                        <div className="flex space-x-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold">
                                    {user?.followers?.totalElements ?? 0}
                                </div>
                                <div className="text-zinc-400 text-sm">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">
                                    {user?.followings?.totalElements ?? 0}
                                </div>
                                <div className="text-zinc-400 text-sm">Following</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">
                                    {myVideosPagination?.totalElements || 0}
                                </div>
                                <div className="text-zinc-400 text-sm">Videos</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* >>>>>>>>>>> Test TikTok <<<<<<<<<<< */}
                {/* <TikTokButton></TikTokButton> */}
                {/* >>>>>>>>>>> Test TikTok <<<<<<<<<<< */}

                {/* Bio and Links */}
                <div className="mb-8">
                    <p className="text-white mb-2">{user?.bio}</p>
                    {user?.facebook && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            {/* Icon */}
                            <FacebookIcon className="w-4 h-4 rounded-full" />
                            <Link
                                href={`${user?.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-white transition-colors"
                            >
                                {user?.facebook}
                            </Link>
                        </div>
                    )}
                    {user?.instagram && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            {/* Icon */}
                            <div>
                                <Image
                                    src={icons.instagram.svg}
                                    alt="Instagram Icon"
                                    width={16}
                                    height={16}
                                    className="w-4 h-4 rounded-full inline-block"
                                />
                            </div>
                            <Link
                                href={`${user?.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-white transition-colors"
                            >
                                {user?.instagram}
                            </Link>
                        </div>
                    )}
                    {user?.tiktok && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            <div className="flex items-center p-0.5 justify-center w-4 h-4 rounded-full bg-white">
                                <Image
                                    src={icons.tiktok.svg}
                                    alt="Tiktok Icon"
                                    width={16}
                                    height={16}
                                />
                            </div>
                            <Link
                                href={`${user?.tiktok}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-white transition-colors"
                            >
                                {user?.tiktok}
                            </Link>
                        </div>
                    )}
                    {user?.youtube && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            <div>
                                <Image
                                    src={icons.youtube.svg}
                                    alt="Youtube Icon"
                                    width={16}
                                    height={16}
                                    className="w-4 h-4 rounded-full inline-block"
                                />
                            </div>
                            <Link
                                href={`${user?.youtube}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-white transition-colors"
                            >
                                {user?.youtube}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => onTabChange("my-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "my-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            My Videos ({myVideosPagination?.totalElements || 0})
                        </button>
                        <button
                            onClick={() => onTabChange("liked-videos")}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === "liked-videos"
                                    ? "text-white border-b-2 border-white"
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            Liked Videos ({likedVideosPagination?.totalElements || 0})
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "my-videos" && (
                    <div>
                        <VideoGrid
                            videos={myVideos}
                            isLoading={isVideosLoading}
                            error={videosError}
                            onRetry={refetchVideos}
                        />

                        {myVideosPagination && myVideosPagination.totalElements > 0 && (
                            <Pagination
                                currentPage={myVideosPage}
                                totalPages={myVideosPagination.totalPage}
                                onPageChange={handleMyVideosPageChange}
                                totalItems={myVideosPagination.totalElements}
                                itemsPerPage={myVideosPageSize}
                                onItemsPerPageChange={handleMyVideosPageSizeChange}
                                showFullInfo={false}
                                isLoading={isVideosLoading}
                            />
                        )}
                    </div>
                )}

                {activeTab === "liked-videos" && (
                    <div>
                        <VideoGrid
                            videos={likedVideos}
                            isLoading={isLikedVideosLoading}
                            error={likedVideosError}
                            onRetry={refetchLikedVideos}
                        />

                        {likedVideosPagination && likedVideosPagination.totalElements > 0 && (
                            <Pagination
                                currentPage={likedVideosPage}
                                totalPages={likedVideosPagination.totalPage}
                                onPageChange={handleLikedVideosPageChange}
                                totalItems={likedVideosPagination.totalElements}
                                itemsPerPage={likedVideosPageSize}
                                onItemsPerPageChange={handleLikedVideosPageSizeChange}
                                showFullInfo={false}
                                isLoading={isLikedVideosLoading}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProfilePage;
