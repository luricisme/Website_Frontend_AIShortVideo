import {apiBasicResponseSchema, apiResponseSchema} from "@/types/api/common";
// import { User, userSchema } from "@/types/user.types";
import http from "@/utils/api/client";
import { z } from "zod";

const URL = "/dashboard";

// Schemas cho response data
export const dashboardOverviewSchema = z.object({
    totalVideo: z.number(),
    totalView: z.number(),
    totalFollower: z.number(),
    totalFollowing: z.number(),
    viewBestVideo: z.union([z.number(), z.null()]),
});

export const platformStatisticSchema = z.object({
    viewCount: z.number(),
    commentCount: z.number(),
    likeCount: z.number(),
    dislikeCount: z.number(),
    interactionPercent: z.number(),
});

export const viewStatisticSchema = z.object({
    totalView: z.number(),
    youtubeView: z.number(),
    tiktokView: z.number(),
    mainView: z.number(),
});

// API functions
export const getDashboardOverview = async () => {
    return http.get(`${URL}/overview`, {
        requireAuth: true, // Hoặc true nếu cần auth
        responseSchema: apiResponseSchema(dashboardOverviewSchema),
    });
};

export const getPlatformStatistic = async (platform: string) => {
    return http.get(`${URL}/platform_statistic?platform=${platform}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(platformStatisticSchema),
    });
};

export const getViewStatistic = async () => {
    return http.get(`${URL}/view_statistic`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(viewStatisticSchema),
    });
};

export const getViewsByCategory = async (page = 1, pageSize = 10) => {
    return http.get(`${URL}/view_by_cate?page=${page}&pageSize=${pageSize}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(viewStatisticSchema),
    })
};
