import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(user)/_components/app-sidebar";
import SearchBar from "@/app/(user)/_components/search-bar";

const fontSans = FontSans({
    variable: "--font-inter",
    subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
    title: "AI Short Video Creator",
    description: "Create stunning short videos with AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.className} antialiased dark`}>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="container mx-auto flex flex-col gap-[32px] min-h-screen sm:px-4 px-2">
                        <SearchBar />
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
