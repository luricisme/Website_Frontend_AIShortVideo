import { Session } from "next-auth";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

import { User } from "@/types/user.types";
import { getProfile, updateAvatar, updateProfile } from "@/apiRequests/client/user.client";
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

export const useUpdateAvatarMutation = () => {
    const queryClient = useQueryClient();
    const { setUser, user } = useUserStore((state) => state);

    return useMutation({
        mutationFn: async (avatarFile: File) => {
            return await updateAvatar(avatarFile);
        },

        onMutate: async (avatarFile) => {
            // Cancel outgoing queries
            await queryClient.cancelQueries({ queryKey: ["user-info"] });

            // Get previous user data
            const previousUser = queryClient.getQueryData(["user-info"]) as User;

            // Create preview URL for optimistic update
            const previewUrl = URL.createObjectURL(avatarFile);

            // Optimistically update avatar in cache
            queryClient.setQueryData(["user-info"], (old: User) => {
                // if (!old?.data) return old;
                if (!old) return old;

                return {
                    ...old,
                    avatar: previewUrl,
                };
            });

            // Also update user store
            const currentUser = user;
            if (currentUser) {
                setUser({ ...currentUser, avatar: previewUrl });
            }

            return { previousUser, previewUrl };
        },

        onError: (error, variables, context) => {
            // Rollback optimistic update
            if (context?.previousUser) {
                queryClient.setQueryData(["user-info"], context.previousUser);
            }

            // Cleanup preview URL
            if (context?.previewUrl) {
                URL.revokeObjectURL(context.previewUrl);
            }

            console.error("Avatar update failed:", error);
        },

        onSuccess: (response, variables, context) => {
            // Cleanup preview URL
            if (context?.previewUrl) {
                URL.revokeObjectURL(context.previewUrl);
            }

            // Update with real avatar URL from server
            if (response.data) {
                queryClient.setQueryData(["user-info"], (old: User) => {
                    if (!old) return old;

                    return {
                        ...old,
                        avatar: response.data, // Use real URL from server
                    };
                });

                // Update user store with real URL
                const currentUser = user;
                if (currentUser) {
                    setUser({ ...currentUser, avatar: response.data });
                }
            }
        },

        onSettled: () => {
            // Invalidate and refetch user info
            queryClient.invalidateQueries({ queryKey: ["user-info"] });
        },
    });
};
