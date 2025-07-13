// app/admin/layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import React from "react";
import Header from "@/app/admin/components/header";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import ProgressBarProvider from "@/providers/progress-bar-provider";
import WrapperSessionProvider from "@/app/(user)/_components/wrapper-session-provider";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/option";
import RedirectModal from "@/app/admin/components/redirect-to-signin-model";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return (
            <RedirectModal
                message="You need to sign in to access the admin dashboard."
                errorType="auth"
            />
        );
    }

    if (session.user?.role !== "ADMIN") {
        return (
            <RedirectModal
                message="You do not have permission to access the admin dashboard."
                errorType="permission"
            />
        );
    }

    return (
        <SidebarProvider>
            {/* Main content bên phải */}
            <AppSidebar />
            <ProgressBarProvider>
                <main className="py-8 w-full flex flex-col min-h-screen sm:px-4 px-2 overflow-x-auto">
                    {/* Sidebar bên trái */}

                    {/* Header */}
                    <UserStoreProvider>
                        <ReactQueryProvider>
                            <WrapperSessionProvider>
                                <Header />
                            </WrapperSessionProvider>
                            {/* Main Content */}
                            {children}
                            <Toaster />
                            {/* 👈 Đây sẽ là route con như /admin/users, /admin/videos,... */}
                        </ReactQueryProvider>
                    </UserStoreProvider>
                </main>
            </ProgressBarProvider>
        </SidebarProvider>
    );
}
