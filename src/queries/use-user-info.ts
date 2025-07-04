import { Session } from "next-auth";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

import { User } from "@/types/user.types";
import { getProfile, updateProfile } from "@/apiRequests/client/user.client";
import { useUserStore } from "@/providers/user-store-provider";
import toast from "react-hot-toast";

export const useUserInfo = (
    session: Session | null,
    { enabled = true }
): UseQueryResult<User, Error> => {
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
        enabled: enabled,
    });
};

export const useUserProfileQuery = (userId: number | string) => {
    return useQuery({
        queryKey: ["user-profile", userId],
        queryFn: async () => {
            if (!userId) {
                throw new Error("User ID is required");
            }

            return getProfile(userId);
        },
    });
};

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();
    const { setUser } = useUserStore((state) => state);

    return useMutation({
        mutationFn: ({ userId, dataUpdate }: { userId: string | number; dataUpdate: User }) =>
            updateProfile({
                userId,
                dataUpdate,
            }),

        onSuccess: (response) => {
            if (response && response.status === 200) {
                console.log("Profile updated successfully:", response.data);
                toast.success("Profile updated successfully!");

                // Update user store
                setUser(response.data);

                // Update React Query cache
                queryClient.setQueryData(["user"], response.data);

                // Optionally invalidate queries
                queryClient.invalidateQueries({ queryKey: ["user"] });
            }
        },

        onError: (error) => {
            console.error("Error updating profile:", error);
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update profile");
            } else {
                toast.error("Failed to update profile");
            }
        },
    });
};
