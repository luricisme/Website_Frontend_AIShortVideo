import { apiBasicResponseSchema, apiResponseSchema } from "@/types/api/common";
import { videoLikeStatusResponseSchema, videoSchema } from "@/types/video.types";
import http from "@/utils/api/client";

const URL = "/video";

export const getVideoById = (videoId: number) => {
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
