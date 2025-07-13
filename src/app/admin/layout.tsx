// app/admin/layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import React from "react"; // relative path tùy bạn
import Header from "@/app/admin/components/header";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import ProgressBarProvider from "@/providers/progress-bar-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen min-w-screen">
                {/* Sidebar bên trái */}
                <aside>
                    <AppSidebar />
                </aside>

                {/* Main content bên phải */}
                <ProgressBarProvider>
                    <main className="flex-1">
                        <div className="py-8 px-10 max-w-full">
                            {/* Header */}
                            <ReactQueryProvider>
                                <Header />
                                {/* Main Content */}
                                {children}
                                {/* 👈 Đây sẽ là route con như /admin/users, /admin/videos,... */}
                            </ReactQueryProvider>
                        </div>
                    </main>
                </ProgressBarProvider>
            </div>
        </SidebarProvider>
    );
}
