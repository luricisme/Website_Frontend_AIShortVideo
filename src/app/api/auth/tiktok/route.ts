import { envServer } from "@/constants/env.server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // tạo và lưu state để bảo mật
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);

    const redirectUrl = request.nextUrl.searchParams.get("redirect_url") || "/";

    const cookieStore = await cookies();

    cookieStore.set("tiktok_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 phút
        path: "/",
    });

    // Lưu redirect URL vào cookie để sử dụng sau khi TikTok trả về
    cookieStore.set("tiktok_oauth_redirect", redirectUrl, {
        path: "/",
        maxAge: 60 * 10, // 10 phút
    });

    // Tạo URL TikTok OAuth
    const url = new URL("https://www.tiktok.com/v2/auth/authorize/");

    url.searchParams.append("client_key", envServer.TIKTOK_CLIENT_ID || "");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "user.info.basic");
    // url.searchParams.append("redirect_uri", `${envServer.NEXTAUTH_URL}/api/auth/tiktok/callback`);
    url.searchParams.append(
        "redirect_uri",
        `https://webhook.site/bb322c5b-11d4-4b41-addc-1fb083377406`
    );
    url.searchParams.append("state", state);

    // Chuyển hướng đến TikTok OAuth
    return NextResponse.redirect(url.toString(), 302);
}
