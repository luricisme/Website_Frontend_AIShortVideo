import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(user)/_components/app-sidebar";
import SearchBar from "@/app/(user)/_components/search-bar";
import React from "react";
import WrapperSessionProvider from "@/app/(user)/_components/wrapper-session-provider";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="container mx-auto flex flex-col min-h-screen sm:px-4 px-2">
                <WrapperSessionProvider>
                    <SearchBar />
                </WrapperSessionProvider>
                {children}
            </main>
        </SidebarProvider>
    );
}
