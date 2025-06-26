import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Lấy authorization code từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    try {
        // Gửi authorization code đến backend để xác thực

        console.log(">>> Received code:", code);
        console.log(">>> Received state:", state);

        return NextResponse.redirect(new URL(`/user/signin?code=${code}`, request.url));
    } catch (error) {
        console.error("Google callback error:", error);
        return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }
}
