import React from "react";
import { Toaster } from "react-hot-toast";

import { SidebarProvider } from "@/components/ui/sidebar";
import SearchBar from "@/app/(user)/_components/search-bar";
import { AppSidebar } from "@/app/(user)/_components/app-sidebar";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import WrapperSessionProvider from "@/app/(user)/_components/wrapper-session-provider";
import ProgressBarProvider from "@/providers/progress-bar-provider";
import { VideosSearchStoreProvider } from "@/providers/videos-search-store-provider";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <UserStoreProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <ProgressBarProvider>
                        <main className="container mx-auto flex flex-col min-h-screen sm:px-4 px-2">
                            <VideosSearchStoreProvider>
                                <ReactQueryProvider>
                                    <WrapperSessionProvider>
                                        <SearchBar />
                                    </WrapperSessionProvider>
                                    {children}
                                    <Toaster />
                                </ReactQueryProvider>
                            </VideosSearchStoreProvider>
                        </main>
                    </ProgressBarProvider>
                </SidebarProvider>
            </UserStoreProvider>
        </>
    );
}
