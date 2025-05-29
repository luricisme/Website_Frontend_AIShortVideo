import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(user)/_components/app-sidebar";
import SearchBar from "@/app/(user)/_components/search-bar";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="container mx-auto flex flex-col gap-[32px] min-h-screen sm:px-4 px-2">
                <SearchBar />
                {children}
            </main>
        </SidebarProvider>
    );
}
