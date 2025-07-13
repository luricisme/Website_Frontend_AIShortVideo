import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { envServer } from "@/constants/env.server";

// Các route không cần kiểm tra phân quyền
const USER_PUBLIC = ["/user/signin", "/user/register"];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: envServer.NEXTAUTH_SECRET });
    const pathname = request.nextUrl.pathname;

    // Nếu truy cập các route public thì cho qua
    if (USER_PUBLIC.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Nếu là admin và vào route user thì redirect về /admin
    if (token && token.role === "ROLE_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/profile/:path*", "/trending/:path*", "/dashboard/:path*", "/shorts/:path*"],
};
