import http from "@/lib/api";

export const getYoutubeStatistics = ({
    userId,
    videoId,
}: {
    userId: number | string;
    videoId: number | string;
}) => {
    const params = new URLSearchParams();
    params.append("userId", userId.toString());
    params.append("videoId", videoId.toString());
    return http.get(`/public/youtube/statistic`);
};
