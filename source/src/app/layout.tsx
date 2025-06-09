import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";

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
    modal: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.className} antialiased dark`}>{children}</body>
        </html>
    );
}
