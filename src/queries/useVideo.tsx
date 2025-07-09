import { ApiResponse } from "@/types/api/common";
import { commentApiRequests } from "@/apiRequests/comment";
import VideoDetail from "@/app/(user)/_components/video-detail";
import { checkFollowing } from "@/apiRequests/client/user.client";
import { Comment, CommentListResponse } from "@/types/comment.types";
import {
    Video,
    VideoLikeStatus,
    VideoListResponse,
    VideoTopTrendingCategoryListResponse,
} from "@/types/video.types";
import {
    QueryClient,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    dislikeVideo,
    getLikedVideosByUserId,
    getTopPopularTags,
    getTopTrendingCategories,
    getVideoById,
    getVideoLikeDislikeCommentCount,
    getVideoLikeStatus,
    getVideos,
    getVideosByCategoryName,
    getVideosByTagName,
    getVideosByUserId,
    incrementVideoViewCount,
    likeVideo,
    searchVideos,
    undislikeVideo,
    unlikeVideo,
} from "@/apiRequests/client";

export const useVideoListQuery = ({
    retryKey,
    enabled = true,
}: {
    retryKey?: string | number;
    enabled?: boolean;
}) => {
    const key = retryKey ? ["videos", retryKey] : ["videos"];

    return useQuery({
        queryKey: ["videos", key],
        queryFn: getVideos,
        enabled: enabled, // Chỉ chạy khi enabled là true
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

export const useUpdateCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            commentId,
            content,
            videoId,
        }: {
            commentId: number | string;
            content: string;
            videoId?: number | string;
        }) => {
            if (!commentId || !content) {
                throw new Error(
                    `Video ${videoId}:::Comment ID and content are required to update a comment.`
                );
            }
            return await commentApiRequests.updateComment(commentId, content);
        },

        onMutate: async ({ commentId, content, videoId }) => {
            // Target specific video's comments
            const queryKey = videoId ? ["comments", videoId] : ["comments"];

            await queryClient.cancelQueries({ queryKey });

            const previousComments =
                queryClient.getQueryData<ApiResponse<CommentListResponse>>(queryKey);

            queryClient.setQueryData(queryKey, (old: ApiResponse<CommentListResponse>) => {
                if (!old?.data?.items) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.map((c) =>
                            c.id === commentId ? { ...c, content } : c
                        ),
                    },
                };
            });

            return { previousComments, queryKey };
        },

        onError: (err, variables, context) => {
            if (context?.previousComments && context?.queryKey) {
                queryClient.setQueryData(context.queryKey, context.previousComments);
            }
        },

        onSettled: (data, error, variables, context) => {
            if (context?.queryKey) {
                queryClient.invalidateQueries({ queryKey: context.queryKey });
            }
        },

        onSuccess: (response, { commentId, videoId }) => {
            if (response.status === 200) {
                const queryKey = videoId ? ["comments", videoId] : ["comments"];
                queryClient.invalidateQueries({ queryKey });
                console.log(`Comment ${commentId} updated successfully`);
            }
        },
    });
};

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            commentId,
            videoId,
        }: {
            commentId: number | string;
            videoId?: number | string;
        }) => {
            if (!commentId) {
                throw new Error(`Video ${videoId}:::Comment ID is required to delete a comment.`);
            }
            return await commentApiRequests.deleteComment(commentId);
        },

        onMutate: async ({ commentId, videoId }) => {
            const queryKey = videoId ? ["comments", videoId] : ["comments"];

            await queryClient.cancelQueries({ queryKey });

            const previousComments =
                queryClient.getQueryData<ApiResponse<CommentListResponse>>(queryKey);

            queryClient.setQueryData(queryKey, (old: ApiResponse<CommentListResponse>) => {
                if (!old?.data?.items) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.filter((c) => c.id !== commentId),
                    },
                };
            });

            return { previousComments, queryKey };
        },

        onError: (err, variables, context) => {
            if (context?.previousComments && context?.queryKey) {
                queryClient.setQueryData(context.queryKey, context.previousComments);
            }
        },

        onSettled: (data, error, variables, context) => {
            if (context?.queryKey) {
                queryClient.invalidateQueries({ queryKey: context.queryKey });
            }
        },

        onSuccess: (response, { commentId, videoId }) => {
            if (response.status === 204) {
                if (videoId) {
                    VideoDetail.updateCommentCount(videoId, queryClient);
                }
                console.log(`Comment ${commentId} deleted successfully`);
            }
        },
    });
};

export const useCheckFollowStatusQuery = (userId: number | string, enabled?: boolean) => {
    return useQuery({
        queryKey: ["follow-status", userId],
        queryFn: () => {
            if (!userId) {
                throw new Error("User ID is required to check follow status.");
            }
            return checkFollowing(userId);
        },
        enabled: enabled, // Only run if userId is provided
    });
};

export const useGetCategoriesQuery = () => {
    return useQuery({
        queryKey: ["trending-categories"],
        queryFn: () => getTopTrendingCategories(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 2, // 2 hours
    });
};

export const useGetPopularTagsQuery = () => {
    return useQuery({
        queryKey: ["popular-tags"],
        queryFn: () => getTopPopularTags(),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 2, // 2 hours
    });
};

export const useGetTrendingVideosQuery = (
    {
        activeCategory,
        activeTag,
        currentPage = 1,
        pageSize = 10,
    }: {
        activeCategory?: string;
        activeTag?: string;
        currentPage?: number;
        pageSize?: number;
    },
    {
        enabled = false, // Chỉ chạy khi có category hoặc tag
    }: {
        enabled: boolean | string | null | undefined;
    }
) => {
    const queryClient = useQueryClient();
    // const categories =
    //     (
    //         queryClient.getQueryData([
    //             "trending-categories",
    //         ]) as ApiResponse<VideoTopTrendingCategoryListResponse>
    //     ).data || [];

    const categories =
        queryClient.getQueryData<ApiResponse<VideoTopTrendingCategoryListResponse>>([
            "trending-categories",
        ])?.data || [];

    // console.log("useGetTrendingVideosQuery categories:", categories);
    // console.log(">>> is enabled:", enabled);

    return useQuery({
        queryKey: ["trending-videos", activeCategory, activeTag, currentPage, pageSize],
        queryFn: () => {
            if (activeCategory) {
                return getVideosByCategoryName({
                    categoryName: activeCategory,
                    pageNo: currentPage,
                    pageSize: pageSize,
                });
            } else if (activeTag) {
                return getVideosByTagName({
                    tagName: activeTag,
                    pageNo: currentPage,
                    pageSize: pageSize,
                });
            } else {
                // default use first category
                if (categories?.length > 0) {
                    return getVideosByCategoryName({
                        categoryName: categories[0].category,
                        pageNo: currentPage,
                        pageSize: pageSize,
                    });
                }

                // If no category or tag is active, return empty response with correct shape
                return Promise.resolve({
                    status: 200,
                    message: "No category or tag selected",
                    data: {
                        pageNo: currentPage,
                        pageSize: pageSize,
                        totalPage: 0,
                        totalElements: 0,
                        items: [] as Video[],
                    },
                    errors: [],
                });
            }
        },
        enabled: !!enabled, // Wait for categories
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useVideoSearchQuery = ({
    query,
    pageSize = 10,
    enabled = true,
}: {
    query: string;
    pageSize?: number;
    enabled?: boolean;
}) => {
    return useInfiniteQuery({
        queryKey: ["search-videos-infinite", query, pageSize],
        queryFn: ({ pageParam = 1 }) =>
            searchVideos({
                query,
                pageSize,
                pageNo: pageParam as number,
            }),
        enabled: enabled && !!query,
        getNextPageParam: (lastPage) => {
            // Nếu có trang tiếp theo thì trả về số trang, ngược lại trả về undefined
            return lastPage.data.pageNo < lastPage.data.totalPage
                ? lastPage.data.pageNo + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            return firstPage.data.pageNo > 1 ? firstPage.data.pageNo - 1 : undefined;
        },
        staleTime: 5 * 60 * 1000, // 5 phút
        initialPageParam: 1,
    });
};

export const useGetVideosByUserIdQuery = ({
    userId,
    pageNo = 1,
    pageSize = 10,
    enabled = true,
}: {
    userId: number | string;
    pageNo?: number;
    pageSize?: number;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ["my-videos", userId, pageNo, pageSize],
        queryFn: () => getVideosByUserId({ userId, pageNo, pageSize }),
        enabled: !!userId && enabled,
        staleTime: 5 * 60 * 1000, // 5 phút
        gcTime: 10 * 60 * 1000, // 10 phút
    });
};

export const useGetLikedVideosByUserIdQuery = ({
    userId,
    pageNo = 1,
    pageSize = 10,
    enabled = true,
}: {
    userId: number | string;
    pageNo?: number;
    pageSize?: number;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ["my-liked-videos", userId, pageNo, pageSize],
        queryFn: () => getLikedVideosByUserId({ userId, pageNo, pageSize }),
        enabled: !!userId && enabled,
        staleTime: 5 * 60 * 1000, // 5 phút
        gcTime: 10 * 60 * 1000, // 10 phút
    });
};
