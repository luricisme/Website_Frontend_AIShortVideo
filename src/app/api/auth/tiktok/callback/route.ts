import { envServer } from "@/constants/env.server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    const cookieStore = await cookies();
    const redirectUrl = cookieStore.get("tiktok_oauth_redirect")?.value || "/";

    // Xây dựng URL cho trang handler với các tham số cần thiết
    const handlerUrl = new URL(
        `${envServer.NEXTAUTH_URL || "http://localhost:3000"}/callback/tiktok`
    );

    if (code) handlerUrl.searchParams.append("code", code);
    if (state) handlerUrl.searchParams.append("state", state);
    if (error) handlerUrl.searchParams.append("error", error);

    handlerUrl.searchParams.append("callback_url", redirectUrl);

    // Chuyển hướng đến trang handler để xử lý kết quả OAuth
    return NextResponse.redirect(handlerUrl);
}
