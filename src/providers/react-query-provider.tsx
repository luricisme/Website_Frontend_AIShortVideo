"use client";

import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/react-query";

export const ReactQueryProvider = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient || getQueryClient()}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
