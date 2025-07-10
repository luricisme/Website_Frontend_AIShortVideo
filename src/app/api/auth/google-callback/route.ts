import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Lấy authorization code từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
        return NextResponse.redirect(new URL("/user/signin?error=no_code", request.url));
    }

    try {
        // console.log(">>> Received Google OAuth code:", code);
        // console.log(">>> Received state:", state);

        // Parse state để lấy returnTo URL
        let returnTo = "/";
        if (state) {
            try {
                const decodedState = JSON.parse(decodeURIComponent(state));
                returnTo = decodedState.returnTo || "/";
            } catch (error) {
                console.error("Error parsing state:", error);
            }
        }

        // Tạo URL để redirect đến trang signin với code và callbackUrl
        const signInUrl = new URL("/user/signin", request.url);
        signInUrl.searchParams.set("google_code", code);
        signInUrl.searchParams.set("callbackUrl", returnTo);

        return NextResponse.redirect(signInUrl);
    } catch (error) {
        console.error("Google callback error:", error);
        return NextResponse.redirect(new URL("/user/signin?error=auth_failed", request.url));
    }
}
