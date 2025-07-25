import { apiBasicResponseSchema, apiResponseSchema } from "@/types/api/common";
import {
    videoLikeDislikeCommentCountSchema,
    videoLikeStatusResponseSchema,
    videoListByCategoryNameSchema,
    videoListBySearchQuerySchema,
    videoListByTagNameSchema,
    videoListByUserIdSchema,
    videoListResponseSchema,
    videoSchema,
    videoTopPopularTagListResponseSchema,
    videoTopTrendingCategoryListResponseSchema,
    videoTrendingMonthlySchema,
} from "@/types/video.types";
import http from "@/utils/api/client";

const URL = "/video";

export const getVideos = () => {
    return http.get(URL, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListResponseSchema),
    });
};

export const getVideoById = (videoId: number | string) => {
    return http.get(`${URL}/${videoId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoSchema),
    });
};

export const getVideoLikeStatus = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return http.get(`${URL}/check-like-dislike-status/${videoId}?userId=${userId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoLikeStatusResponseSchema),
    });
};

export const likeVideo = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return http.post(`${URL}/like/${videoId}?userId=${userId}`, {
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

export const unlikeVideo = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return http.delete(`${URL}/like/${videoId}?userId=${userId}`, {
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

export const dislikeVideo = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return http.post(`${URL}/dislike/${videoId}?userId=${userId}`, {
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

export const undislikeVideo = ({
    videoId,
    userId,
}: {
    videoId: number | string;
    userId: number | string;
}) => {
    return http.delete(`${URL}/dislike/${videoId}?userId=${userId}`, {
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

export const getVideoLikeDislikeCommentCount = (videoId: number | string) => {
    return http.get(`${URL}/count/${videoId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoLikeDislikeCommentCountSchema),
    });
};

export const incrementVideoViewCount = async (videoId: number | string) => {
    console.log(">>> Calling Next.js route handler for video:", videoId);

    const response = await fetch(`/api/videos/${videoId}/view`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to update view count: ${response.status}`);
    }

    const result = await response.json();
    console.log(">>> Route handler response:", result);

    return result;
};

export const getTopTrendingCategories = () => {
    return http.get(`${URL}/top-trending-categories`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoTopTrendingCategoryListResponseSchema),
    });
};

export const getTopPopularTags = () => {
    return http.get(`${URL}/top-popular-tags`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoTopPopularTagListResponseSchema),
    });
};

export const getVideosByTagName = async ({
    tagName,
    pageNo = 1,
    pageSize = 10,
}: {
    tagName: string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/tag/${tagName}?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListByTagNameSchema),
    });
};

export const getVideosByCategoryName = async ({
    categoryName,
    pageNo = 1,
    pageSize = 10,
}: {
    categoryName: string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/category/${categoryName}?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListByCategoryNameSchema),
    });
};

export const searchVideos = async ({
    query,
    pageNo = 1,
    pageSize = 10,
}: {
    query: string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        search: `title:${query},category:${query},style:${query},target:${query},script:${query}`,
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/search?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListBySearchQuerySchema),
    });
};

export const getVideosByUserId = async ({
    userId,
    pageNo = 1,
    pageSize = 10,
}: {
    userId: number | string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/my-video/${userId}?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListByUserIdSchema),
    });
};

export const getLikedVideosByUserId = async ({
    userId,
    pageNo = 1,
    pageSize = 10,
}: {
    userId: number | string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/my-liked-video/${userId}?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListByUserIdSchema),
    });
};

export const getVideosTrendingMonthly = async ({
    pageNo = 1,
    pageSize = 10,
}: {
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`${URL}/trending-month?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoTrendingMonthlySchema),
    });
};

export const updateVideoTitle = async ({
    videoId,
    title,
}: {
    videoId: number | string;
    title: string;
}) => {
    return http.patch(`${URL}/update-title/${videoId}`, {
        requireAuth: true,
        body: { title },
        responseSchema: apiBasicResponseSchema,
    });
};

export const deleteVideo = async (videoId: number | string) => {
    return http.delete(`${URL}/delete-video/${videoId}`, {
        requireAuth: true,
        responseSchema: apiBasicResponseSchema,
    });
};
