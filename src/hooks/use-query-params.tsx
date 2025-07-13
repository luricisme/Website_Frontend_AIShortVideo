"use client";

import { useSearchParams } from "next/navigation";

const useQueryParams = () => {
    const queryParams = useSearchParams();

    const params = Object.fromEntries(queryParams.entries());

    return params;
};

export default useQueryParams;
