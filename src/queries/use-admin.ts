import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    deleteUser,
    getNumberOfCreatedTags,
    getNumberOfCreatedVideosToday,
    getTags,
    getUserGrowth,
    getUsers,
    getUsersOverview,
    getVideos,
} from "@/apiRequests/client/admin.client";

export const useNumberOfCreatedVideosTodayQuery = () => {
    return useQuery({
        queryKey: ["admin", "created-videos-today"],
        queryFn: getNumberOfCreatedVideosToday,
    });
};

export const useNumberOfCreatedTagsQuery = () => {
    return useQuery({
        queryKey: ["admin", "created-tags"],
        queryFn: getNumberOfCreatedTags,
    });
};

export const useGetTagsQuery = ({
    pageNo = 0,
    pageSize = 5,
}: {
    pageNo?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["admin", "tags", { pageNo, pageSize }],
        queryFn: () => getTags({ pageNo, pageSize }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useGetVideosQuery = ({
    pageNo = 1,
    pageSize = 10,
}: {
    pageNo?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["admin", "videos", { pageNo, pageSize }],
        queryFn: () => getVideos({ pageNo, pageSize }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * export const getUsers = async (
    {
        page,
        pageSize,
        name,
        status,
        sort_criteria,
        sort_direction,
    }: {
        page: number;
        pageSize: number;
        name?: string;
        status?: "ALL" | "ACTIVE" | "INACTIVE" | "PENDING" | "DELETED";
        sort_criteria?:
            | "id"
            | "firstName"
            | "lastName"
            | "email"
            | "status"
            | "createdAt"
            | "updatedAt";
        sort_direction?: "asc" | "desc";
    } = {
        page: 1,
        pageSize: 10,
        status: "ALL",
    }
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (name) params.append("name", name);
    if (status) params.append("status", status);
    if (sort_criteria) params.append("sort_criteria", sort_criteria);
    if (sort_direction) params.append("sort_direction", sort_direction);

    return http.get(`/admin/user?${params.toString()}`, {
        requireAuth: true,
        responseSchema: apiResponseSchema(createPaginatedSchema(userSchema)),
    });
};
 */

export const useGetUsersQuery = ({
    page = 1,
    pageSize = 10,
    name,
    status,
    sort_criteria,
    sort_direction,
}: {
    page?: number;
    pageSize?: number;
    name?: string;
    status?: "ALL" | "ACTIVE" | "INACTIVE" | "PENDING" | "DELETED";
    sort_criteria?:
        | "id"
        | "firstName"
        | "lastName"
        | "email"
        | "status"
        | "createdAt"
        | "updatedAt";
    sort_direction?: "asc" | "desc";
}) => {
    return useQuery({
        queryKey: [
            "admin",
            "users",
            { page, pageSize, name, status, sort_criteria, sort_direction },
        ],
        queryFn: () => getUsers({ page, pageSize, name, status, sort_criteria, sort_direction }),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useGetUsersOverviewQuery = () => {
    return useQuery({
        queryKey: ["admin", "users-overview"],
        queryFn: getUsersOverview,
    });
};

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: number | string) => {
            return deleteUser(userId);
        },
        onSuccess: () => {
            // Invalidate the users query to refresh the data
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
};

type PeriodType = "day" | "week" | "month";
export const useGetUserGrowthQuery = ({
    periodType = "month",
    numPeriod = 3,
}: {
    periodType?: PeriodType;
    numPeriod?: number;
}) => {
    return useQuery({
        queryKey: ["admin", "user-growth", { periodType, numPeriod }],
        queryFn: () => getUserGrowth(periodType, numPeriod),
        placeholderData: keepPreviousData,
    });
};
