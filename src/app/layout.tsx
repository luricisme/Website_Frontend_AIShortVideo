import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { envServer } from "@/constants/env.server";

const fontSans = FontSans({
    variable: "--font-inter",
    subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
    metadataBase: new URL(envServer.NEXTAUTH_URL || "http://localhost:3000"),
    title: {
        template: "%s | AI Short Video Creator",
        default: "AI Short Video Creator",
    },
    description: "Create stunning short videos with AI",
    openGraph: {
        siteName: "AI Short Video Creator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@yoursite",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontSans.className} antialiased dark`}>{children}</body>
        </html>
    );
}
