"use client";

import { SessionProvider } from "next-auth/react";

const WrapperSessionProvider = ({ children }: { children: React.ReactNode }) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default WrapperSessionProvider;
