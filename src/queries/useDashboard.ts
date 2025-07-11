import { useQuery } from "@tanstack/react-query";
import {
    getDashboardOverview,
    getPlatformStatistic,
    getViewStatistic,
    getViewsByCategory, getTopInteractedVideos
} from "@/apiRequests/client";

export const useDashboardOverviewQuery = (enabled = true) => {
    return useQuery({
        queryKey: ["dashboard-overview"],
        queryFn: getDashboardOverview,
        enabled,
        staleTime: 5 * 60 * 1000, // 5 phút
        gcTime: 10 * 60 * 1000, // 10 phút
    });
};

export const usePlatformStatisticQuery = ({
                                              platform,
                                              enabled = true,
                                          }: {
    platform: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ["platform-statistic", platform],
        queryFn: () => getPlatformStatistic(platform),
        enabled: !!platform && enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useViewStatisticQuery = (enabled = true) => {
    return useQuery({
        queryKey: ["view-statistic"],
        queryFn: getViewStatistic,
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useViewsByCategoryQuery = (page = 1, pageSize = 10, enabled = true) => {
    return useQuery({
        queryKey: ["views-by-category", page, pageSize],
        queryFn: () => getViewsByCategory(page, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useTopInteractedVideosQuery = (pageNo = 0, pageSize = 10, enabled = true) => {
    return useQuery({
        queryKey: ["top-interacted-videos", pageNo, pageSize],
        queryFn: () => getTopInteractedVideos(pageNo, pageSize),
        enabled,
        staleTime: 5 * 60 * 1000, // 5 phút
        gcTime: 10 * 60 * 1000, // 10 phút
    });
};
