import { tiktokLinkAccount } from "@/apiRequests/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { code, state } = await request.json();

        const cookieStore = await cookies();
        const savedState = cookieStore.get("tiktok_oauth_state")?.value;

        cookieStore.delete("tiktok_oauth_state");

        if (!code) {
            return NextResponse.json(
                { error: "Invalid request", message: "No authorization code provided" },
                { status: 400 }
            );
        }

        if (savedState && state !== savedState) {
            return NextResponse.json(
                { error: "Security error", message: "Invalid state parameter" },
                { status: 400 }
            );
        }

        const backendResponse = await tiktokLinkAccount(code);

        console.log(">>> Backend Response:", backendResponse);

        if (!backendResponse.data) {
            const errorMessage = backendResponse.message || "Failed to link TikTok account";

            // For development mode - simulate successful response if backend is not available
            if (process.env.NODE_ENV === "development") {
                console.log("DEV MODE: Simulating successful TikTok linking");
                return NextResponse.json({
                    success: true,
                    message: "TikTok account linked successfully (DEV MODE)",
                    tiktokUsername: "TikTok_User123",
                });
            }

            return NextResponse.json(
                {
                    error: backendResponse?.errors || "Backend error",
                    message: errorMessage,
                },
                { status: backendResponse.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "TikTok account linked successfully",
            tiktokUsername: null,
        });
    } catch (error) {
        console.error("Error linking TikTok account:", error);

        // For development mode
        if (process.env.NODE_ENV === "development") {
            console.log("DEV MODE: Simulating successful response after error");
            return NextResponse.json({
                success: true,
                message: "TikTok account linked successfully (DEV MODE)",
                tiktokUsername: "TikTok_User123",
            });
        }

        return NextResponse.json(
            {
                error: "Server error",
                message: error instanceof Error ? error.message : "An unknown error occurred",
            },
            { status: 500 }
        );
    }
}
