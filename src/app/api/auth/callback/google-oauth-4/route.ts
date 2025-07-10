import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("Custom Google OAuth callback hit");

    // Log để debug
    const url = request.nextUrl;
    console.log("Callback URL:", url.toString());
    console.log("Search params:", Object.fromEntries(url.searchParams.entries()));

    // Redirect về trang signin với error parameter
    const signInUrl = new URL("/user/signin", request.url);
    signInUrl.searchParams.set("error", "callback_error");
    signInUrl.searchParams.set("message", "Authentication process interrupted");

    return NextResponse.redirect(signInUrl);
}

export async function POST(request: NextRequest) {
    // Xử lý POST request nếu cần
    return GET(request);
}
