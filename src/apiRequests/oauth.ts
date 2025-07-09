import { apiResponseSchema } from "@/types/api/common";
import { serverHttp } from "@/utils/api/server";
import z from "zod";

export const tiktokLinkAccount = async (code: string) => {
    return serverHttp.postPublic(
        "/auth/oauth/tiktok",
        {
            authorizeCode: code,
        },
        apiResponseSchema(z.boolean())
    );
};
