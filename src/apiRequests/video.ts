import { apiResponseSchema } from "@/types/api/common";
import { videoListResponseSchema } from "@/types/video.types";
import { serverHttp } from "@/utils/api/server";

const URL = "/video";

const getVideos = () => {
    return serverHttp.getPublic(URL, apiResponseSchema(videoListResponseSchema));
};

export const videoApiRequests = {
    getVideos: getVideos,
};
