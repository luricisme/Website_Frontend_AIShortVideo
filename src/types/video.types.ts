import { userSchema } from "@/types/user.types";
import { z } from "zod";

// VideoTag schema
export const videoTagSchema = z.object({
    videoId: z.number(),
    tagName: z.string(),
});

export const tagSchema = z.object({
    tagName: z.string(),
    videoCnt: z.number(),
});

// Video schema
export const videoSchema = z.object({
    id: z.number(),
    title: z.string(),
    category: z.string(),
    style: z.string(),
    target: z.string(),
    script: z.string(),
    audioUrl: z.string().nullable().optional(),
    videoUrl: z.string().nullable().optional(),
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

export const createPaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        pageNo: z.number(),
        pageSize: z.number(),
        totalPage: z.number(),
        totalElements: z.number(),
        items: z.array(itemSchema),
    });

export const videoListResponseSchema = z.object({
    totalElements: z.number(),
    items: z.array(videoSchema),
});

export const paginatedVideoListSchema = createPaginatedSchema(videoSchema);

export const videoListByTagNameSchema = paginatedVideoListSchema;
export const videoListByCategoryNameSchema = paginatedVideoListSchema;
export const videoListBySearchQuerySchema = paginatedVideoListSchema;
export const videoListByUserIdSchema = paginatedVideoListSchema;
export const videoTrendingMonthlySchema = paginatedVideoListSchema;

export const tagListResponseSchema = createPaginatedSchema(tagSchema);

export const videoLikeStatusResponseSchema = z.object({
    liked: z.boolean(),
    disliked: z.boolean(),
});

export const videoLikeDislikeCommentCountSchema = z.object({
    likeCnt: z.number(),
    dislikeCnt: z.number(),
    commentCnt: z.number(),
});

export const videoTopTrendingCategorySchema = z.object({
    category: z.string(),
    totalViews: z.number(),
});

export const videoTopTrendingCategoryListResponseSchema = z.array(videoTopTrendingCategorySchema);

export const videoTopPopularTagSchema = z.object({
    tagName: z.string(),
    videoCnt: z.number(),
});

export const videoTopPopularTagListResponseSchema = z.array(videoTopPopularTagSchema);

export type VideoTag = z.infer<typeof videoTagSchema>;
export type Video = z.infer<typeof videoSchema>;
export type VideoListResponse = z.infer<typeof videoListResponseSchema>;
export type PaginatedVideoList = z.infer<typeof paginatedVideoListSchema>;
export type Tag = z.infer<typeof tagSchema>;

export type VideoListByTagName = PaginatedVideoList;
export type VideoListByCategoryName = PaginatedVideoList;
export type VideoListBySearchQuery = PaginatedVideoList;
export type VideoListByUserId = PaginatedVideoList;
export type VideoTrendingMonthly = PaginatedVideoList;

export type VideoLikeStatus = z.infer<typeof videoLikeStatusResponseSchema>;
export type VideoLikeDislikeCommentCount = z.infer<typeof videoLikeDislikeCommentCountSchema>;
export type VideoTopTrendingCategory = z.infer<typeof videoTopTrendingCategorySchema>;
export type VideoTopTrendingCategoryListResponse = z.infer<
    typeof videoTopTrendingCategoryListResponseSchema
>;
export type VideoTopPopularTag = z.infer<typeof videoTopPopularTagSchema>;
export type VideoTopPopularTagListResponse = z.infer<typeof videoTopPopularTagListResponseSchema>;

export type PaginatedResponse<T> = {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalElements: number;
    items: T[];
};
