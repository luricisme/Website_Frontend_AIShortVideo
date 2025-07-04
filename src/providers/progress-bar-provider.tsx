"use client";

import { ProgressProvider } from "@bprogress/next/app";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProgressProvider
            height="4px"
            color="white"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </ProgressProvider>
    );
};

export default ProgressBarProvider;
