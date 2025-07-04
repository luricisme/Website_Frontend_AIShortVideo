import { apiResponseSchema } from "@/types/api/common";
import {
    videoListByCategoryNameSchema,
    videoListByTagNameSchema,
    videoListResponseSchema,
    videoSchema,
    videoTopPopularTagListResponseSchema,
    videoTopTrendingCategoryListResponseSchema,
} from "@/types/video.types";
import { serverHttp } from "@/utils/api/server";

const URL = "/video";

const getVideos = () => {
    return serverHttp.getPublic(URL, apiResponseSchema(videoListResponseSchema));
};

export const getVideoDetail = (videoId: number) => {
    return serverHttp.getPublic(`${URL}/${videoId}`, apiResponseSchema(videoSchema));
};

const getTopTrendingCategories = () => {
    return serverHttp.getPublic(
        `${URL}/top-trending-categories`,
        apiResponseSchema(videoTopTrendingCategoryListResponseSchema)
    );
};

const getTopPopularTags = () => {
    return serverHttp.getPublic(
        `${URL}/top-popular-tags`,
        apiResponseSchema(videoTopPopularTagListResponseSchema)
    );
};

const getVideosByTagName = async ({
    tagName,
    pageNo = 1,
    pageSize = 10,
}: {
    tagName: string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await serverHttp.getPublic(
        `${URL}/tag/${tagName}?${params.toString()}`,
        apiResponseSchema(videoListByTagNameSchema),
        {
            next: {
                revalidate: 300, // Revalidate every 5 minutes
            },
        }
    );

    const { pageNo: currentPage, totalPage, totalElements, items } = response.data;
    return {
        videos: items || [],
        totalPages: totalPage || 1,
        totalCount: totalElements || 0,
        currentPage: currentPage || 1,
    };
};

const getVideosByCategoryName = async ({
    categoryName,
    pageNo = 1,
    pageSize = 10,
}: {
    categoryName: string;
    pageNo?: number;
    pageSize?: number;
}) => {
    const params = new URLSearchParams({
        pageNo: pageNo.toString(),
        pageSize: pageSize.toString(),
    });

    const response = await serverHttp.getPublic(
        `${URL}/category/${categoryName}?${params.toString()}`,
        apiResponseSchema(videoListByCategoryNameSchema),
        {
            next: {
                revalidate: 300, // Revalidate every 5 minutes
            },
        }
    );

    const { pageNo: currentPage, totalPage, totalElements, items } = response.data;
    return {
        videos: items || [],
        totalPages: totalPage || 1,
        totalCount: totalElements || 0,
        currentPage: currentPage || 1,
    };
};

export const videoApiRequests = {
    getVideos: getVideos,
    getTopTrendingCategories: getTopTrendingCategories,
    getTopPopularTags: getTopPopularTags,
    getVideosByTagName: getVideosByTagName,
    getVideosByCategoryName: getVideosByCategoryName,
};
