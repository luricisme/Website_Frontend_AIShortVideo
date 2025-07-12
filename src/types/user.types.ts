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
    updatedAt: z.string().optional(),
});

// Type
export type User = z.infer<typeof userSchema>;
