import React from "react";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container mx-auto !bg-[#0A0A0A] !w-[100vw] flex flex-col min-h-screen">
            {children}
        </main>
    );
}
