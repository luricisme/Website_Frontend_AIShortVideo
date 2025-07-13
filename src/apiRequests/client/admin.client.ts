import { apiBasicResponseSchema, apiResponseSchema } from "@/types/api/common";
import { userGrowthDataSchema, userSchema, usersOverviewSchema } from "@/types/user.types";
import { createPaginatedSchema, tagListResponseSchema, videoListSchema } from "@/types/video.types";
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

export const getUsers = async (
    {
        page,
        pageSize,
        name,
        status,
        sort_criteria,
        sort_direction,
    }: {
        page: number;
        pageSize: number;
        name?: string;
        status?: "ALL" | "ACTIVE" | "INACTIVE" | "PENDING" | "DELETED";
        sort_criteria?:
            | "id"
            | "firstName"
            | "lastName"
            | "email"
            | "status"
            | "createdAt"
            | "updatedAt";
        sort_direction?: "asc" | "desc";
    } = {
        page: 1,
        pageSize: 10,
        status: "ALL",
    }
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (name) params.append("name", name);
    if (status) params.append("status", status);
    if (sort_criteria) params.append("sort_criteria", sort_criteria);
    if (sort_direction) params.append("sort_direction", sort_direction);

    return http.get(`/admin/users?${params.toString()}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(createPaginatedSchema(userSchema)),
    });
};

export const getUsersOverview = async () => {
    return http.get(`/admin/users/overview`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(usersOverviewSchema),
    });
};

export const deleteUser = async (userId: number | string) => {
    return http.delete(`/admin/users/${userId}`, {
        requireAuth: true,
        responseSchema: apiBasicResponseSchema,
    });
};

type PeriodType = "day" | "week" | "month";
export const getUserGrowth = async (periodType: PeriodType, numPeriod: number = 3) => {
    const params = new URLSearchParams({
        period_type: periodType,
        num_period: numPeriod.toString(),
    });

    return http.get(`/admin/users/growth?${params.toString()}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(userGrowthDataSchema),
    });
};
