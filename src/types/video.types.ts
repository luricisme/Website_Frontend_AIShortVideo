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

// VideoLikeDislikeCommentCount schema
export const videoLikeDislikeCommentCountSchema = z.object({
    likeCnt: z.number(),
    dislikeCnt: z.number(),
    commentCnt: z.number(),
});

// VideoTopTrendingCategory schema
export const videoTopTrendingCategorySchema = z.object({
    category: z.string(),
    totalViews: z.number(),
});

// VideoTopTrendingCategoryListResponse schema
export const videoTopTrendingCategoryListResponseSchema = z.array(videoTopTrendingCategorySchema);

// VideoTopPopularTag schema
export const videoTopPopularTagSchema = z.object({
    tagName: z.string(),
    videoCnt: z.number(),
});

// VideoTopPopularTagListResponse schema
export const videoTopPopularTagListResponseSchema = z.array(videoTopPopularTagSchema);

// VideoListByTagName schema
export const videoListByTagNameSchema = z.object({
    pageNo: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalElements: z.number(),
    items: z.array(videoSchema),
});

// VideoListByCategoryName schema
export const videoListByCategoryNameSchema = z.object({
    pageNo: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalElements: z.number(),
    items: z.array(videoSchema),
});

// VideoListBySearchQuery schema
export const videoListBySearchQuerySchema = z.object({
    pageNo: z.number(),
    pageSize: z.number(),
    totalPage: z.number(),
    totalElements: z.number(),
    items: z.array(videoSchema),
});

// Type
export type VideoTag = z.infer<typeof videoTagSchema>;
export type Video = z.infer<typeof videoSchema>;
export type VideoListResponse = z.infer<typeof videoListResponseSchema>;
export type VideoLikeStatus = z.infer<typeof videoLikeStatusResponseSchema>;
export type VideoLikeDislikeCommentCount = z.infer<typeof videoLikeDislikeCommentCountSchema>;
export type VideoTopTrendingCategory = z.infer<typeof videoTopTrendingCategorySchema>;
export type VideoTopTrendingCategoryListResponse = z.infer<
    typeof videoTopTrendingCategoryListResponseSchema
>;
export type VideoTopPopularTag = z.infer<typeof videoTopPopularTagSchema>;
export type VideoTopPopularTagListResponse = z.infer<typeof videoTopPopularTagListResponseSchema>;
export type VideoListByTagName = z.infer<typeof videoListByTagNameSchema>;
export type VideoListByCategoryName = z.infer<typeof videoListByCategoryNameSchema>;
