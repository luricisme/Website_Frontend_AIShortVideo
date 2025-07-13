import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
    getNumberOfCreatedTags,
    getNumberOfCreatedVideosToday,
    getTags,
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
