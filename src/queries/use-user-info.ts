import { Session } from "next-auth";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { User } from "@/types/user.types";
import { getProfile } from "@/apiRequests/client/user.client";

export const useUserInfo = (session: Session | null): UseQueryResult<User, Error> => {
    return useQuery({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await getProfile(session?.user?.id || "");
            if (res?.data) {
                res.data.id = session?.user?.id || "";
                return res.data;
            }
            throw new Error("No data returned");
        },
        enabled: !!session?.accessToken,
    });
};
