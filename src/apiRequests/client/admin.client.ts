import { apiResponseSchema } from "@/types/api/common";
import { tagListResponseSchema, videoListSchema } from "@/types/video.types";
import http from "@/utils/api/client";
import z from "zod";

export const getNumberOfCreatedVideosToday = async () => {
    return http.get(`/video/count-created-video-today`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(z.number()),
    });
};

export const getNumberOfCreatedTags = async () => {
    return http.get(`/video/count-created-tag`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(z.number()),
    });
};

export const getTags = async ({
    pageNo = 0,
    pageSize = 5,
}: {
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    return http.get(`/video/tags?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(tagListResponseSchema),
    });
};

export const getVideos = async ({
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

    return http.get(`/video/all-videos?${params.toString()}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(videoListSchema),
    });
};
