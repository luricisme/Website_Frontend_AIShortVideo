import { z } from "zod";

export interface UserLocalStorage {
    id: number | string;
    username: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar: string | null;
}

export interface AuthResponseUser {
    email?: string;
    id?: number | string;
    name?: string;
    role?: string;
}

export const followerResponseSchema = z.object({
    pageNo: z.number().optional(),
    pageSize: z.number().optional(),
    totalElements: z.number().optional(),
    items: z
        .array(
            z.object({
                username: z.string().min(1, "Username is required"),
                userId: z.union([z.number(), z.string()]).optional(),
            })
        )
        .optional()
        .nullable(),
});

export const userStatusSchema = z.enum(["ALL", "ACTIVE", "INACTIVE", "PENDING", "DELETED"]);

export const userSortCriteriaSchema = z.enum([
    "id",
    "firstName",
    "lastName",
    "email",
    "status",
    "createdAt",
    "updatedAt",
]);

export const userSortDirectionSchema = z.enum(["asc", "desc"]);

export const usersOverviewSchema = z.object({
    numActive: z.number().optional(),
    numInactive: z.number().optional(),
    numNewUserToday: z.number().optional(),
});

export const userGrowthDataSchema = z.object({
    totalUser: z.number().optional().nullable(),
    periodStart: z.string().optional().nullable(),
    periodEnd: z.string().optional().nullable(),
    previousUserCount: z.number().optional().nullable(),
    followingUserCount: z.number().optional().nullable(),
    growthPercent: z.number().optional().nullable(),
});

export const userSchema = z.object({
    id: z.union([z.number(), z.string()]).optional(), // id can be a number or a string, and is optional
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string(),
    role: z.string().optional(),
    username: z.string().min(1, "Username is required"),
    bio: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    instagram: z.string().nullable().optional(),
    tiktok: z.string().nullable().optional(),
    youtube: z.string().nullable().optional(),
    twitter: z.string().nullable().optional(),
    followers: followerResponseSchema.optional(),
    followings: followerResponseSchema.optional(),
    updatedAt: z.string().optional().nullable(),
    createdAt: z.string().optional().nullable(),
    totalVideo: z.number().optional().nullable(),
    status: userStatusSchema.optional(),
});

// Type
export type User = z.infer<typeof userSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type UserSortCriteria = z.infer<typeof userSortCriteriaSchema>;
export type UserSortDirection = z.infer<typeof userSortDirectionSchema>;
export type UsersOverview = z.infer<typeof usersOverviewSchema>;
export type UserGrowthData = z.infer<typeof userGrowthDataSchema>;
