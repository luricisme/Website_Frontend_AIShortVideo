import { apiBasicResponseSchema, apiResponseSchema } from "@/types/api/common";
import { User, userSchema } from "@/types/user.types";
import http from "@/utils/api/client";
import { z } from "zod";

const URL = "/users";

export const logout = () => {
    return http.post(`/auth/logout`, {
        requireAuth: true,
        responseSchema: apiBasicResponseSchema,
    });
};

export const getProfile = (userId: string | number) => {
    return http.get(`${URL}/${userId}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(userSchema),
    });
};

export const updateProfile = ({
    userId,
    dataUpdate,
}: {
    userId: string | number;
    dataUpdate: User;
}) => {
    return http.put(`${URL}/${userId}`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(userSchema),
        body: dataUpdate,
    });
};

export const updateAvatar = (avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    // console.log("Updating avatar with formData:", formData);

    return http.post(`${URL}/avatar`, {
        requireAuth: true,
        body: formData,
        responseSchema: apiResponseSchema(z.string()),
    });
};

export const followUser = (userId: string | number) => {
    return http.post(`${URL}/${userId}/follow`, {
        requireAuth: true,
        body: {},
        responseSchema: apiBasicResponseSchema,
    });
};

export const unfollowUser = (userId: string | number) => {
    return http.delete(`${URL}/${userId}/follow`, {
        requireAuth: true,
        responseSchema: apiBasicResponseSchema,
    });
};

export const getFollowers = (userId: string | number) => {
    return http.get(`${URL}/${userId}/follower`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(userSchema.array()),
    });
};

export const getFollowing = (userId: string | number) => {
    return http.get(`${URL}/${userId}/following`, {
        requireAuth: false,
        responseSchema: apiResponseSchema(userSchema.array()),
    });
};

export const checkFollowing = (userId: string | number) => {
    return http.get(`${URL}/${userId}/is-following`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(z.boolean()),
    });
};
