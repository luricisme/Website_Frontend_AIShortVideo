import {
    dislikeVideo,
    getVideoById,
    getVideoLikeDislikeCommentCount,
    getVideoLikeStatus,
    getVideos,
    incrementVideoViewCount,
    likeVideo,
    undislikeVideo,
    unlikeVideo,
} from "@/apiRequests/client";
import { commentApiRequests } from "@/apiRequests/comment";
import VideoDetail from "@/app/(user)/_components/video-detail";
import { ApiResponse } from "@/types/api/common";
import { Comment, CommentListResponse } from "@/types/comment.types";
import { Video, VideoLikeStatus, VideoListResponse } from "@/types/video.types";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVideoListQuery = ({ retryKey }: { retryKey?: string | number }) => {
    const key = retryKey ? ["videos", retryKey] : ["videos"];

    return useQuery({
        queryKey: ["videos", key],
        queryFn: getVideos,
    });
};

export const useVideoDetailQuery = (
    videoId: number | string | null | undefined,
    options?: {
        enabled?: boolean;
        retry?: number;
        staleTime?: number;
        gcTime?: number;
        refetchOnWindowFocus?: boolean;
    }
) => {
    return useQuery({
        queryKey: ["video", videoId],
        queryFn: () => {
            if (!videoId) {
                throw new Error("Video ID is required to fetch video details.");
            }
            return getVideoById(videoId);
        },
        enabled: !!videoId && options?.enabled !== false, // Chỉ enabled khi có videoId và không bị disable
        retry: options?.retry ?? 1, // Default retry 1 lần
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // Cache 5 phút
        gcTime: options?.gcTime ?? 10 * 60 * 1000, // Garbage collect sau 10 phút
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false, // Không refetch khi focus window
        ...options, //
    });
};

export const useVideoLikeStatusQuery = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return useQuery({
        queryKey: ["video-like-status", videoId, userId],
        queryFn: () => getVideoLikeStatus({ videoId, userId }),
        enabled: !!videoId && !!userId,
    });
};

function updateVideoListLikeCount(
    queryClient: QueryClient,
    videoId: number | string,
    delta: number
) {
    queryClient.setQueryData(["videos"], (old: VideoListResponse) => {
        if (!old?.items) return old;

        return {
            ...old,
            items: old.items.map((v: Video) =>
                v.id === videoId ? { ...v, likeCnt: Math.max((v.likeCnt ?? 0) + delta, 0) } : v
            ),
        };
    });
}

// Like mutation
export const useLikeVideoMutation = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: likeVideo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["video-like-status", videoId, userId] });
            const previousStatus = queryClient.getQueryData<VideoLikeStatus>([
                "video-like-status",
                videoId,
                userId,
            ]);
            const previousVideos = queryClient.getQueryData(["videos"]);

            // Update status
            queryClient.setQueryData(
                ["video-like-status", videoId, userId],
                (old: VideoLikeStatus) => ({
                    ...(old || {}),
                    liked: true,
                    disliked: false,
                })
            );
            // Update like count (tăng 1)
            updateVideoListLikeCount(queryClient, videoId, 1);

            return { previousStatus, previousVideos };
        },
        onError: (_err, _vars, context) => {
            // Rollback nếu lỗi
            if (context?.previousStatus) {
                queryClient.setQueryData(
                    ["video-like-status", videoId, userId],
                    context.previousStatus
                );
            }
            if (context?.previousVideos) {
                queryClient.setQueryData(["videos"], context.previousVideos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["video-like-status", videoId, userId] });
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

// Unlike mutation
export const useUnlikeVideoMutation = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unlikeVideo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["video-like-status", videoId, userId] });
            const previousStatus = queryClient.getQueryData<VideoLikeStatus>([
                "video-like-status",
                videoId,
                userId,
            ]);
            const previousVideos = queryClient.getQueryData(["videos"]);

            queryClient.setQueryData(
                ["video-like-status", videoId, userId],
                (old: VideoLikeStatus) => ({
                    ...(old || {}),
                    liked: false,
                    disliked: false,
                })
            );
            // Update like count (giảm 1)
            updateVideoListLikeCount(queryClient, videoId, -1);

            return { previousStatus, previousVideos };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousStatus) {
                queryClient.setQueryData(
                    ["video-like-status", videoId, userId],
                    context.previousStatus
                );
            }
            if (context?.previousVideos) {
                queryClient.setQueryData(["videos"], context.previousVideos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["video-like-status", videoId, userId] });
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

// Dislike mutation
export const useDislikeVideoMutation = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dislikeVideo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["video-like-status", videoId, userId] });
            const previousStatus = queryClient.getQueryData<VideoLikeStatus>([
                "video-like-status",
                videoId,
                userId,
            ]);
            const previousVideos = queryClient.getQueryData(["videos"]);

            queryClient.setQueryData(
                ["video-like-status", videoId, userId],
                (old: VideoLikeStatus) => ({
                    ...(old || {}),
                    liked: false,
                    disliked: true,
                })
            );
            // Nếu trước đó đã like, giảm like count
            const prev = previousStatus;
            if (prev?.liked) updateVideoListLikeCount(queryClient, videoId, -1);

            return { previousStatus, previousVideos };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousStatus) {
                queryClient.setQueryData(
                    ["video-like-status", videoId, userId],
                    context.previousStatus
                );
            }
            if (context?.previousVideos) {
                queryClient.setQueryData(["videos"], context.previousVideos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["video-like-status", videoId, userId] });
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

// Undislike mutation
export const useUndislikeVideoMutation = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: undislikeVideo,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["video-like-status", videoId, userId] });
            const previousStatus = queryClient.getQueryData<VideoLikeStatus>([
                "video-like-status",
                videoId,
                userId,
            ]);
            const previousVideos = queryClient.getQueryData(["videos"]);

            queryClient.setQueryData(
                ["video-like-status", videoId, userId],
                (old: VideoLikeStatus) => ({
                    ...(old || {}),
                    liked: false,
                    disliked: false,
                })
            );
            // Không thay đổi like count khi undislike

            return { previousStatus, previousVideos };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousStatus) {
                queryClient.setQueryData(
                    ["video-like-status", videoId, userId],
                    context.previousStatus
                );
            }
            if (context?.previousVideos) {
                queryClient.setQueryData(["videos"], context.previousVideos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["video-like-status", videoId, userId] });
            queryClient.invalidateQueries({ queryKey: ["videos"] });
        },
    });
};

// Get video like/dislike/comment count
export const useVideoLikeDislikeCommentCountQuery = (
    videoId: number | string,
    options?: {
        refetchInterval?: number;
        enabled?: boolean;
    }
) => {
    return useQuery({
        queryKey: ["video-like-dislike-comment-count", videoId],
        queryFn: () => getVideoLikeDislikeCommentCount(videoId),
        enabled: options?.enabled !== undefined ? options.enabled : !!videoId,
        refetchInterval: options?.refetchInterval || 60000, // Mặc định 10 giây
        refetchIntervalInBackground: false, // Không refetch khi tab không hoạt động
    });
};

function updateVideoListViewCount(
    queryClient: QueryClient,
    videoId: number | string,
    delta: number = 1
) {
    queryClient.setQueryData(["videos"], (old: VideoListResponse) => {
        if (!old?.items) return old;

        return {
            ...old,
            items: old.items.map((v: Video) =>
                v.id === videoId ? { ...v, viewCnt: (v.viewCnt ?? 0) + delta } : v
            ),
        };
    });
}

// incrementVideoViewCount
export const useIncrementVideoViewCountMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (videoId: number | string) => incrementVideoViewCount(videoId),
        onMutate: async (videoId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["videos"] });

            // Snapshot the previous value
            const previousVideos = queryClient.getQueryData(["videos"]);
            const previousVideo = queryClient.getQueryData(["video", videoId]);

            // Optimistically update to the new value
            updateVideoListViewCount(queryClient, videoId, 1);

            // Return a context object with the snapshotted value
            return { previousVideos, previousVideo };
        },
        onError: (err, videoId, context) => {
            // Rollback if error
            if (context?.previousVideos) {
                queryClient.setQueryData(["videos"], context.previousVideos);
            }

            if (context?.previousVideo) {
                queryClient.setQueryData(["video", videoId], context.previousVideo);
            }
        },
        onSuccess: (response, videoId, context) => {
            if (response.alreadyCounted) {
                console.log(
                    `View for video ${videoId} was already counted, rolling back optimistic update`
                );
                // Rollback optimistic update vì view không thực sự tăng
                if (context?.previousVideos) {
                    queryClient.setQueryData(["videos"], context.previousVideos);
                }

                if (context?.previousVideo) {
                    queryClient.setQueryData(["video", videoId], context.previousVideo);
                }

                // Không invalidate queries vì data không thay đổi
                return;
            }

            // View count thực sự tăng, invalidate để sync với server
            queryClient.invalidateQueries({
                queryKey: ["videos"],
            });
            queryClient.invalidateQueries({
                queryKey: ["video", videoId],
            });
        },
    });
};

// video comment
export const useVideoCommentQuery = (
    videoId: number,
    options?: {
        enabled?: boolean;
        polling?: boolean;
        pollingInterval?: number;
    }
) => {
    const getPollingInterval = () => {
        if (!options?.polling) return false;

        // Base interval
        let interval = options?.pollingInterval || 30000;

        // Increase interval if tab is hidden
        if (typeof document !== "undefined" && document.hidden) {
            interval = interval * 2; // 60s when tab hidden
        }

        return interval;
    };

    return useQuery({
        queryKey: ["comments", videoId],
        queryFn: () => {
            if (!videoId) {
                throw new Error("Video ID is required to fetch comments.");
            }
            return commentApiRequests.getComments(videoId);
        },
        staleTime: 15 * 1000, // 10 giây - ngắn hơn để comment mới xuất hiện nhanh
        gcTime: 5 * 60 * 1000, // 5 phút
        refetchOnWindowFocus: true, // Refetch khi focus lại window
        refetchInterval: getPollingInterval(), // Poll mỗi 30s nếu enabled
        refetchIntervalInBackground: false, // Không poll khi tab không active
        select: (data) => data.data?.items || [], // Extract comments array
        enabled: options?.enabled !== false,
    });
};

export const useSubmitCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            userId: number;
            videoId: number;
            content: string;
            avatar?: string | null;
            username?: string | null;
        }) => {
            const persistedData = {
                videoId: data.videoId,
                userId: data.userId,
                content: data.content,
            };
            return await commentApiRequests.commentVideo(persistedData);
        },

        onMutate: async (newComment) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["comments", newComment.videoId] });

            // Snapshot the previous value
            const previousComments: ApiResponse<CommentListResponse> = (queryClient.getQueryData([
                "comments",
                newComment.videoId,
            ]) || []) as ApiResponse<CommentListResponse>;

            const optimisticComment: Comment = {
                id: `temp-${Date.now()}`, // Temporary ID
                content: newComment.content,
                username: newComment.username || "Anonymous",
                avatar: newComment.avatar || null,
                userId: newComment.userId,
                createdAt: new Date().toISOString(),
            };

            // Optimistically update to the new value
            queryClient.setQueryData(
                ["comments", newComment.videoId],
                (old: ApiResponse<CommentListResponse>) => {
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            items: [optimisticComment, ...(old.data?.items || [])],
                        },
                    };
                }
            );

            // Return a context object with the snapshotted value
            return { previousComments };
        },
        onError: (err, newComment, context) => {
            // Rollback if error
            if (context?.previousComments) {
                queryClient.setQueryData(
                    ["comments", newComment.videoId],
                    context.previousComments
                );
            }
        },
        onSettled: (data, error, newComment) => {
            // Invalidate queries to get fresh data from server
            queryClient.invalidateQueries({ queryKey: ["comments", newComment.videoId] });
        },
        onSuccess: (response, variables) => {
            if (response.status === 201) {
                queryClient.invalidateQueries({
                    queryKey: ["comments", variables.videoId],
                });

                VideoDetail.updateCommentCount(variables.videoId, queryClient);
                console.log("Comment submitted successfully");
            }
        },
    });
};
