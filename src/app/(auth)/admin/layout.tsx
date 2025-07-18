import React from "react";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/option";
import { redirect, RedirectType } from "next/navigation";
import { AuthProvider } from "@/app/(auth)/user/_components/auth-provider";

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    console.log("Session in AuthLayout:", session);

    // kiểm tra session có tồn tại hay không
    // nếu có redirect về trang home
    if (session && session.accessToken) {
        if (session.user.role === "ROLE_ADMIN") {
            // Redirect to home if session exists
            redirect("/admin", RedirectType.replace);
        } else if (session.user.role === "ROLE_USER") {
            // Redirect to home if session exists
            redirect("/", RedirectType.replace);
        }
    }

    return (
        <main className="container mx-auto !bg-[#0A0A0A] !w-[100vw] flex flex-col min-h-screen">
            <AuthProvider session={session}>{children}</AuthProvider>
            <Toaster />
        </main>
    );
}
