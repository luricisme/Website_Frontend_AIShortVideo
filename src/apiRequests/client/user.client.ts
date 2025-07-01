import { apiResponseSchema } from "@/types/api/common";
import { User, userSchema } from "@/types/user.types";
import http from "@/utils/api/client";

const URL = "/users";

export const getProfile = (userId: string | number) => {
    return http.get(`${URL}/${userId}`, {
        requireAuth: false,
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
