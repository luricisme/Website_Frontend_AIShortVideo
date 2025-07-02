import { z } from "zod";

// Comment schema
export const commentSchema = z.object({
    id: z.number().or(z.string()), // Allow both number and string for id
    userId: z.number(),
    avatar: z.string().nullable().optional(),
    username: z.string(),
    content: z.string(),
    createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});

// CommentListResponse schema
export const commentListResponseSchema = z.object({
    totalElements: z.number(),
    items: z.array(commentSchema),
});

// Type
export type Comment = z.infer<typeof commentSchema>;
export type CommentListResponse = z.infer<typeof commentListResponseSchema>;
