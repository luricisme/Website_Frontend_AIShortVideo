"use client";

import React from "react";

import WrapperSessionProvider from "@/app/(user)/_components/wrapper-session-provider";

export default function ProfileMeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WrapperSessionProvider>{children}</WrapperSessionProvider>
        </>
    );
}
