"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { EllipsisVertical, Hash } from "lucide-react";

import { cn } from "@/lib/utils";
import { icons } from "@/constants/icons";
import { Button } from "@/components/ui/button";
import { HttpError } from "@/utils/errors/HttpError";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatNumberToSocialStyle } from "@/utils/common";
import { Video, VideoLikeStatus } from "@/types/video.types";
import { useUserStore } from "@/providers/user-store-provider";
import { PanelConfig } from "@/app/(user)/_components/right-panel";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/app/(user)/_components/confirm-dialog";
import { followUser, unfollowUser } from "@/apiRequests/client/user.client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomVideoPlayer from "@/app/(user)/_components/custom-video-player";
import {
    dislikeVideo,
    getVideoLikeStatus,
    likeVideo,
    undislikeVideo,
    unlikeVideo,
} from "@/apiRequests/client";
import {
    useCheckFollowStatusQuery,
    useVideoLikeDislikeCommentCountQuery,
} from "@/queries/useVideo";

interface VideoDetailProps {
    video: Video;
    isVisible: boolean;
    isShowRightPanel: boolean;
    panelConfigs: Record<string, PanelConfig>;
    onOpenPanel: (panel: PanelConfig) => void;
}

const VideoDetail = ({
    video,
    isVisible,
    isShowRightPanel,
    panelConfigs,
    onOpenPanel,
}: VideoDetailProps) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    const isCompactView = useMediaQuery("(max-width: 1249px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 380px)");
    const isExtraSmallScreen = useMediaQuery("(max-width: 350px)");
    const is340pxScreen = useMediaQuery("(max-width: 340px)");

    const [actionStyles, setActionStyles] = useState({});
    const [isActionsOverlapping, setIsActionsOverlapping] = useState(false);

    const router = useRouter();

    const { user } = useUserStore((state) => state);

    const [userInfo, setUserInfo] = useState(user);

    useEffect(() => {
        setUserInfo(user);
    }, [user]);

    const [likeCount, setLikeCount] = useState<number>(() => video.likeCnt || 0);

    const [commentCount, setCommentCount] = useState<number>(() => video.commentCnt || 0);

    const [likeDislikeStatus, setLikeDislikeStatus] = useState<VideoLikeStatus>({
        liked: false,
        disliked: false,
    });

    const {
        data: followStatusData,
        // isLoading: isFollowStatusLoading,
        refetch: refetchFollowStatus,
    } = useCheckFollowStatusQuery(video.user.id ?? "", !!video.user.id);

    const [isFollowing, setIsFollowing] = useState<boolean>(followStatusData?.data ?? false);

    useEffect(() => {
        setIsFollowing(followStatusData?.data ?? false);
    }, [followStatusData?.data]);

    const {} = useVideoLikeDislikeCommentCountQuery(video.id);

    const fetchLikeDislikeStatus = async () => {
        try {
            const response = await getVideoLikeStatus({
                videoId: video.id,
                userId: userInfo?.id ?? "",
            });

            if (response.status === 200) {
                setLikeDislikeStatus(response.data);
            }
        } catch (error) {
            console.error("Error fetching like/dislike status:", error);
        }
    };

    const clearState = () => {
        setLikeCount(0);
        setLikeDislikeStatus({ liked: false, disliked: false });
    };

    const queryClient = useQueryClient();

    // Lấy dữ liệu từ hook API
    const { data: videoCountData } = useVideoLikeDislikeCommentCountQuery(video.id, {
        refetchInterval: 10000,
    });

    const serverLikeCount = videoCountData?.data?.likeCnt;
    const serverCommentCount = videoCountData?.data?.commentCnt;

    useEffect(() => {
        if (serverLikeCount !== undefined) {
            setLikeCount(serverLikeCount);
        }
        if (serverCommentCount !== undefined) {
            setCommentCount(serverCommentCount);
        }
    }, [serverLikeCount, serverCommentCount]);

    useEffect(() => {
        // Check if user is logged in and has liked/disliked the video
        if (userInfo?.id ?? "") {
            // Fetch like/dislike status from API or local storage
            // For now, we will just set it to false
            fetchLikeDislikeStatus();
        } else {
            clearState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo?.id]);

    useEffect(() => {
        const calculatePosition = () => {
            if (!videoContainerRef.current || !actionsRef.current) return;

            const videoRect = videoContainerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const actionsWidth = actionsRef.current.offsetWidth;

            const videoRightEdge = videoRect.right;
            const potentialRightEdge = videoRightEdge + actionsWidth + 20;

            const wouldOverlap = potentialRightEdge >= viewportWidth - 20;
            setIsActionsOverlapping(wouldOverlap);

            if (isExtraSmallScreen) {
                setActionStyles({
                    right: "5px",
                    bottom: "16px",
                });
                return;
            }

            if (isVerySmallScreen) {
                setActionStyles({
                    right: "5px",
                    bottom: "30px",
                });
                return;
            }

            if (isCompactView || wouldOverlap) {
                setActionStyles({
                    right: "8px",
                    bottom: "30px",
                    transform: "none",
                });
            } else {
                setActionStyles({
                    right: "-20px",
                    transform: "translateX(100%)",
                    bottom: "20px",
                });
            }
        };

        setTimeout(calculatePosition, 100);

        window.addEventListener("resize", calculatePosition);

        return () => {
            window.removeEventListener("resize", calculatePosition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVerySmallScreen, isCompactView]);

    const handleLikeClick = async () => {
        const preStatus = { ...likeDislikeStatus };
        const preLikeCount = likeCount;
        try {
            if (likeDislikeStatus.liked) {
                setLikeDislikeStatus((prev) => ({ ...prev, liked: false }));
                setLikeCount((prev) => Math.max(prev - 1, 0)); // Decrease like count

                // call API to remove like
                await unlikeVideo({
                    videoId: video.id,
                    userId: userInfo?.id ?? "",
                });
            } else {
                setLikeDislikeStatus((prev) => ({
                    ...prev,
                    liked: true,
                    disliked: false,
                }));

                setLikeCount((prev) => prev + 1); // Increase like count

                // call API to like video and remove dislike if any
                await Promise.all([
                    likeVideo({
                        videoId: video.id,
                        userId: userInfo?.id ?? "",
                    }),
                    undislikeVideo({
                        videoId: video.id,
                        userId: userInfo?.id ?? "",
                    }),
                ]);
            }

            // Update video list like count in cache
            queryClient.invalidateQueries({
                queryKey: ["video-like-dislike-comment-count", video.id],
            });
        } catch (error) {
            console.log("Error handling like click:", error);
            if (error instanceof HttpError) {
                // restore previous state if error occurs
                setLikeDislikeStatus(preStatus);
                setLikeCount(preLikeCount); // Restore previous like count
            }
        }
    };

    const handleDislikeClick = async () => {
        const preStatus = { ...likeDislikeStatus };
        const preLikeCount = likeCount;
        try {
            // decrease like count if disliked
            if (likeDislikeStatus.liked) {
                setLikeCount((prev) => Math.max(prev - 1, 0));
            }

            if (likeDislikeStatus.disliked) {
                setLikeDislikeStatus((prev) => ({ ...prev, disliked: false }));
                // call API to remove dislike
                await undislikeVideo({
                    videoId: video.id,
                    userId: userInfo?.id ?? "",
                });
            } else {
                setLikeDislikeStatus((prev) => ({
                    ...prev,
                    disliked: true,
                    liked: false,
                }));
                // call API to dislike video and remove like if any
                await Promise.all([
                    dislikeVideo({
                        videoId: video.id,
                        userId: userInfo?.id ?? "",
                    }),
                    unlikeVideo({
                        videoId: video.id,
                        userId: userInfo?.id ?? "",
                    }),
                ]);
            }

            queryClient.invalidateQueries({
                queryKey: ["video-like-dislike-comment-count", video.id],
            });
        } catch (error) {
            console.log("Error handling dislike click:", error);
            if (error instanceof HttpError) {
                // restore previous state if error occurs
                setLikeDislikeStatus(preStatus);
                setLikeCount(preLikeCount); // Restore previous like count
            }
        }
    };

    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const handleFollowClick = async () => {
        if (isFollowingLoading) return; // Prevent multiple clicks
        setIsFollowingLoading(true); // Set loading state to true
        try {
            let response;
            setIsFollowing((prev) => !prev); // Toggle follow state
            if (isFollowing) {
                response = await unfollowUser(video.user.id ?? "");
            } else {
                response = await followUser(video.user.id ?? "");
            }

            console.log(">>> Follow response:", response);
            if (response && response.status === 200) {
                // re-fetch follow status
                await refetchFollowStatus();
            }
        } catch (error) {
            console.error("Error following user:", { error });
            if (error instanceof HttpError) {
                // Handle specific HTTP error cases here
                console.error("HTTP Error:", error.message);
            } else {
                // Handle other types of errors
                console.error("Unexpected Error:", error);
            }

            // Optionally, revert the follow state if an error occurs
            setIsFollowing((prev) => !prev); // Revert follow state
        } finally {
            setIsFollowingLoading(false); // Reset loading state
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden" ref={videoRef}>
            <div
                className={`w-full h-full grid grid-cols-3 transition-transform duration-500 ease-in-out ${
                    !isCompactView && isShowRightPanel ? "transform -translate-x-1/3" : ""
                }`}
            >
                <div className={`${isCompactView ? "hidden" : "block"} mt-auto`}>
                    <div className="flex flex-col gap-2 p-4">
                        {video && video?.tags && video.tags.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-400 bg-sidebar/80 rounded-md px-4 py-2.5 w-fit">
                                <Hash color="#fff" size={35} strokeWidth={2} />
                                <div className="flex flex-wrap gap-2 text-sm text-white max-w-full">
                                    {video.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="cursor-pointer hover:underline"
                                            // onClick={() => onOpenPanel(panelConfigs)}
                                        >
                                            {tag.tagName}
                                        </span>
                                    ))}
                                    {/* <span className="text-white font-medium cursor-pointer hover:underline">
                                    shorts
                                </span>
                                <span>{formatViews(video.viewCnt)} video</span> */}
                                </div>
                            </div>
                        )}
                        <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
                        <p className="text-sm text-gray-400">{video.script}</p>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={undefined} />
                                <AvatarFallback>{video.user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">
                                    {video.user.firstName} {video.user.lastName}
                                </span>
                                <span className="text-xs text-gray-400">
                                    @{video.user.username}
                                </span>
                            </div>
                            {userInfo?.id && (
                                <Button
                                    size="sm"
                                    className="rounded-full font-semibold text-[10px] md:text-xs py-0.5 px-2 md:py-1 md:px-3 h-6 md:h-8"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle follow action here
                                        handleFollowClick();
                                    }}
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`flex items-center justify-center h-full relative ${
                        isCompactView ? "col-span-3" : ""
                    }`}
                >
                    <div
                        className="h-full max-h-[calc(100vh-120px)] flex items-center justify-center relative"
                        ref={videoContainerRef}
                        style={{
                            width: is340pxScreen ? "100%" : "initial", // Adjust width for very small screens
                        }}
                    >
                        <CustomVideoPlayer
                            src={"https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4"}
                            // || video.videoUrl
                            autoPlay={true}
                            muted={false}
                            isVisible={isVisible}
                            isShowVideoInfo={isShowRightPanel}
                            video={video}
                            className="h-auto max-h-full aspect-[9/16]"
                            showMiniBanner={isCompactView}
                            isFollowing={isFollowing}
                            onFollowClick={handleFollowClick}
                            user={userInfo ?? undefined}
                        />

                        <div
                            ref={actionsRef}
                            className={`absolute flex flex-col gap-3 items-center transition-all duration-300 z-20 ${
                                isActionsOverlapping ? "bg-black/20 p-2 rounded-lg" : ""
                            }`}
                            style={actionStyles}
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col items-center gap-1 text-white text-sm">
                                    {userInfo?.id ?? "" ? (
                                        <button
                                            onClick={() => handleLikeClick()}
                                            className={cn(
                                                "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer",
                                                {
                                                    "bg-slate-400": likeDislikeStatus.liked,
                                                    "bg-white/10 hover:bg-white/20 transition-colors duration-200":
                                                        !likeDislikeStatus.liked,
                                                }
                                            )}
                                        >
                                            <Image
                                                src={icons.like.svg}
                                                alt="Like"
                                                width={20}
                                                height={20}
                                                className="w-4 h-4 md:w-5 md:h-5"
                                            />
                                        </button>
                                    ) : (
                                        <ConfirmDialog
                                            dialogTitle="You need to log in to like this video"
                                            dialogDescription={
                                                "Please log in to your account to like this video."
                                            }
                                            confirmText="Sign In"
                                            cancelText="Cancel"
                                            confirmAction={() => {
                                                // Redirect to login page
                                                router.push("/user/signin");
                                            }}
                                            cancelAction={() => {}}
                                        >
                                            <button
                                                className={cn(
                                                    "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer",
                                                    {
                                                        "bg-slate-400": likeDislikeStatus.liked,
                                                        "bg-white/10 hover:bg-white/20 transition-colors duration-200":
                                                            !likeDislikeStatus.liked,
                                                    }
                                                )}
                                            >
                                                <Image
                                                    src={icons.like.svg}
                                                    alt="Like"
                                                    width={20}
                                                    height={20}
                                                    className="w-4 h-4 md:w-5 md:h-5"
                                                />
                                            </button>
                                        </ConfirmDialog>
                                    )}
                                    <span className="text-xs md:text-sm font-medium">
                                        {formatNumberToSocialStyle(likeCount)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center gap-1 text-white text-sm">
                                    {userInfo?.id ?? "" ? (
                                        <button
                                            onClick={() => handleDislikeClick()}
                                            className={cn(
                                                "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer",
                                                {
                                                    "bg-slate-400": likeDislikeStatus.disliked,
                                                    "bg-white/10 hover:bg-white/20":
                                                        !likeDislikeStatus.disliked,
                                                }
                                            )}
                                        >
                                            <Image
                                                src={icons.dislike.svg}
                                                alt="Dislike"
                                                width={20}
                                                height={20}
                                                className="w-4 h-4 md:w-5 md:h-5"
                                            />
                                        </button>
                                    ) : (
                                        <ConfirmDialog
                                            dialogTitle="You need to log in to dislike this video"
                                            dialogDescription={
                                                "Please log in to your account to dislike this video."
                                            }
                                            confirmText="Sign In"
                                            cancelText="Cancel"
                                            confirmAction={() => {
                                                // Redirect to login page
                                                router.push("/user/signin");
                                            }}
                                            cancelAction={() => {}}
                                        >
                                            <button
                                                className={cn(
                                                    "w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer",
                                                    {
                                                        "bg-slate-400": likeDislikeStatus.disliked,
                                                        "bg-white/10 hover:bg-white/20":
                                                            !likeDislikeStatus.disliked,
                                                    }
                                                )}
                                            >
                                                <Image
                                                    src={icons.dislike.svg}
                                                    alt="Dislike"
                                                    width={20}
                                                    height={20}
                                                    className="w-4 h-4 md:w-5 md:h-5"
                                                />
                                            </button>
                                        </ConfirmDialog>
                                    )}
                                    <span className="text-xs md:text-sm font-medium w-11 truncate">
                                        Dislike
                                    </span>
                                </div>

                                {userInfo?.id ? (
                                    <button
                                        className="flex flex-col items-center gap-1 text-white text-sm"
                                        onClick={() => onOpenPanel(panelConfigs.comments)}
                                    >
                                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                            <Image
                                                src={icons.comment.svg}
                                                alt="Comment"
                                                width={20}
                                                height={20}
                                                className="w-4 h-4 md:w-5 md:h-5"
                                            />
                                        </div>
                                        <span className="text-xs md:text-sm font-medium">
                                            {formatNumberToSocialStyle(commentCount)}
                                        </span>
                                    </button>
                                ) : (
                                    <ConfirmDialog
                                        dialogTitle="You need to log in to comment on this video"
                                        dialogDescription={
                                            "Please log in to your account to comment on this video."
                                        }
                                        confirmText="Sign In"
                                        cancelText="Cancel"
                                        confirmAction={() => {
                                            // Redirect to login page
                                            router.push("/user/signin");
                                        }}
                                        cancelAction={() => {}}
                                    >
                                        <button className="flex flex-col items-center gap-1 text-white text-sm">
                                            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                                <Image
                                                    src={icons.comment.svg}
                                                    alt="Comment"
                                                    width={20}
                                                    height={20}
                                                    className="w-4 h-4 md:w-5 md:h-5"
                                                />
                                            </div>
                                            <span className="text-xs md:text-sm font-medium">
                                                {formatNumberToSocialStyle(commentCount)}
                                            </span>
                                        </button>
                                    </ConfirmDialog>
                                )}

                                <button
                                    className="flex flex-col items-center gap-1 text-white text-sm"
                                    onClick={() => onOpenPanel(panelConfigs.share)}
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <Image
                                            src={icons.share.svg}
                                            alt="Share"
                                            width={20}
                                            height={20}
                                            className="w-4 h-4 md:w-5 md:h-5"
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium truncate">
                                        Chia sẻ
                                    </span>
                                </button>

                                <button
                                    className="flex flex-col items-center gap-1 text-white text-sm"
                                    onClick={() => onOpenPanel(panelConfigs.details)}
                                >
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                        <EllipsisVertical className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <span className="text-xs md:text-sm font-medium truncate">
                                        Details
                                    </span>
                                </button>

                                <div
                                    className="w-9 h-9 md:w-11 md:h-11 cursor-pointer mt-2 mx-auto"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent video click event
                                        e.preventDefault(); // Prevent default action
                                        if (video.user.id) {
                                            router.push(`/profile/${video.user.id}`);
                                        }
                                    }}
                                >
                                    <Avatar className="w-9 h-9 md:w-11 md:h-11 rounded-md">
                                        <AvatarImage src={undefined} />
                                        <AvatarFallback>
                                            {video.user.username.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={isCompactView ? "hidden" : "block"}></div>
            </div>
        </div>
    );
};

VideoDetail.updateCommentCount = (videoId: number | string, queryClient: QueryClient) => {
    queryClient.invalidateQueries({
        queryKey: ["video-like-dislike-comment-count", videoId],
    });
};

export default VideoDetail;
