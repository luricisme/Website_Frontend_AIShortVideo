import { apiBasicResponseSchema } from "@/types/api/common";
import { serverHttp } from "@/utils/api/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const VIEW_TRACKING_HOURS = 1; // Hours to track views for a video
const COOKIE_PREFIX = "video_viewed_";

interface Params {
    id: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<Params> }) {
    try {
        const { id } = await params;
        const videoId = parseInt(id);
        const cookieName = `${COOKIE_PREFIX}${videoId}`;

        // cookie store
        const cookieStore = await cookies();
        const existingCookie = cookieStore.get(cookieName);

        // check if the cookie exists
        if (existingCookie) {
            try {
                const cookieData = JSON.parse(existingCookie.value);
                const now = Date.now();
                const hoursPassed = (now - cookieData.timestamp) / (1000 * 60 * 60); // convert milliseconds to hours

                if (hoursPassed < VIEW_TRACKING_HOURS) {
                    console.log(
                        `Video ${videoId} already viewed within ${VIEW_TRACKING_HOURS} hours`
                    );
                    return NextResponse.json(
                        {
                            success: true,
                            message: "View already counted",
                            alreadyCounted: true,
                        },
                        {
                            status: 208, // Already Reported
                        }
                    );
                }
            } catch (error) {
                console.error("Error parsing cookie:", error);
                // Cookie bị lỗi, tiếp tục xử lý như bình thường
            }
        }

        // Cookie không tồn tại hoặc đã hết hạn, gọi backend API
        console.log(`Calling backend API for video ${videoId}`);

        const response = await serverHttp.patch(
            `/video/view/${videoId}`,
            {},
            apiBasicResponseSchema
        );

        const cookieData = {
            videoId: videoId,
            timestamp: Date.now(),
            viewCounted: true,
        };

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + VIEW_TRACKING_HOURS);

        cookieStore.set(cookieName, JSON.stringify(cookieData), {
            expires: expiryDate,
            path: "/",
            sameSite: "lax",
            httpOnly: true, // Bảo mật hơn
            secure: process.env.NODE_ENV === "production", // HTTPS trong production
        });

        console.log(`View counted and cookie set for video ${videoId}`);

        return NextResponse.json({
            success: true,
            message: "View counted successfully",
            status: response.status,
            alreadyCounted: false,
        });
    } catch (error) {
        console.error("Failed to increment view count:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to increment view count",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
