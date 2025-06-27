import { AuthProvider } from "@/app/(auth)/user/_components/auth-provider";
import { getServerSession } from "next-auth";
import React from "react";

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();

    return (
        <main className="container mx-auto !bg-[#0A0A0A] !w-[100vw] flex flex-col min-h-screen">
            <AuthProvider session={session}>{children}</AuthProvider>
        </main>
    );
}
