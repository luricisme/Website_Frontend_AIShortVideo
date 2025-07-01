import { apiResponseSchema } from "@/types/api/common";
import { commentListResponseSchema } from "@/types/comment.types";
import http from "@/utils/api/client";

const URL = "/video/comment";

const getComments = (videoId: number) => {
    return http.get(`${URL}/${videoId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(commentListResponseSchema),
    });
};

export const commentApiRequests = {
    getComments: getComments,
};
