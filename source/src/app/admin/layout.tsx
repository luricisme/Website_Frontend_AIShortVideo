// app/admin/layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import React from "react"; // relative path tùy bạn

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen min-w-screen">
                {/* Sidebar bên trái */}
                <aside>
                    <AppSidebar />
                </aside>

                {/* Main content bên phải */}
                <main className="flex-1">
                    {children} {/* 👈 Đây sẽ là route con như /admin/users, /admin/videos,... */}
                </main>
            </div>
        </SidebarProvider>
    );
}
