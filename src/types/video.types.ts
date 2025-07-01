import { userSchema } from "@/types/user.types";
import { z } from "zod";

// VideoTag schema
export const videoTagSchema = z.object({
    videoId: z.number(),
    tagName: z.string(),
});

// Video schema
export const videoSchema = z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    style: z.string(),
    target: z.string(),
    script: z.string(),
    audioUrl: z.string(),
    videoUrl: z.string(),
    likeCnt: z.number(),
    dislikeCnt: z.number(),
    commentCnt: z.number(),
    viewCnt: z.number(),
    length: z.number(),
    thumbnail: z.string(),
    status: z.string(),
    user: userSchema,
    tags: z.array(videoTagSchema).optional(),
});

// VideoListResponse schema
export const videoListResponseSchema = z.object({
    totalElements: z.number(),
    items: z.array(videoSchema),
});

// VideoLikeStatus schema
export const videoLikeStatusResponseSchema = z.object({
    liked: z.boolean(),
    disliked: z.boolean(),
});

// Type
export type VideoTag = z.infer<typeof videoTagSchema>;
export type Video = z.infer<typeof videoSchema>;
export type VideoListResponse = z.infer<typeof videoListResponseSchema>;
export type VideoLikeStatus = z.infer<typeof videoLikeStatusResponseSchema>;
