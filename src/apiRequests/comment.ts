import { apiBasicResponseSchema, apiResponseSchema } from "@/types/api/common";
import { commentListResponseSchema, commentSchema } from "@/types/comment.types";
import http from "@/utils/api/client";

const URL = "/video/comment";

const getComments = (videoId: number) => {
    return http.get(`${URL}/${videoId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(commentListResponseSchema),
    });
};

const commentVideo = ({
    videoId,
    userId,
    content,
}: {
    videoId: number | string;
    userId: number | string;
    content: string;
}) => {
    return http.post(`${URL}`, {
        body: {
            videoId,
            userId,
            content,
        },
        requireAuth: false,
        responseSchema: apiResponseSchema(commentSchema),
    });
};

const updateComment = (commendId: number | string, content: string) => {
    return http.patch(`${URL}/${commendId}`, {
        body: {
            content,
        },
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

const deleteComment = (commentId: number | string) => {
    return http.delete(`${URL}/${commentId}`, {
        requireAuth: false,
        responseSchema: apiBasicResponseSchema,
    });
};

export const commentApiRequests = {
    getComments: getComments,
    commentVideo: commentVideo,
    updateComment: updateComment,
    deleteComment: deleteComment,
};
