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

export const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    username: z.string(),
    bio: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    instagram: z.string().nullable().optional(),
    tiktok: z.string().nullable().optional(),
    youtube: z.string().nullable().optional(),
});

// Type
export type User = z.infer<typeof userSchema>;
