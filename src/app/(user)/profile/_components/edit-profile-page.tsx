"use client";

import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { userSchema, User as UserType } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useUpdateAvatarMutation, useUpdateProfileMutation } from "@/queries/use-user-info";
import toast from "react-hot-toast";
import { Camera, Upload } from "lucide-react";

interface EditProfilePageProps {
    userProfile: UserType | undefined;
    onCancel: () => void;
    onSuccess: () => void;
    user?: UserType; // Optional user prop for user ID
}

export default function EditProfilePage({
    userProfile,
    onCancel,
    onSuccess,
    user, // Optional user prop for user ID
}: EditProfilePageProps) {
    const updateProfileMutation = useUpdateProfileMutation();
    const updateAvatarMutation = useUpdateAvatarMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<UserType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: userProfile?.firstName || "",
            lastName: userProfile?.lastName || "",
            username: userProfile?.username || "",
            bio: userProfile?.bio || "",
            instagram: userProfile?.instagram || "",
            twitter: userProfile?.twitter || "",
            youtube: userProfile?.youtube || "",
            email: userProfile?.email || "",
        },
    });

    // Handle avatar upload
    const handleAvatarChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            updateAvatarMutation.mutate(file, {
                onSuccess: () => {
                    toast.success("Avatar updated successfully");
                },
                onError: (error) => {
                    console.error("Avatar upload failed:", error);
                    toast.error("Failed to update avatar");
                },
            });

            // Reset input
            e.target.value = "";
        },
        [updateAvatarMutation]
    );

    const handleAvatarClick = useCallback(() => {
        if (updateAvatarMutation.isPending) return;
        fileInputRef.current?.click();
    }, [updateAvatarMutation.isPending]);

    const onSubmit = async (data: UserType) => {
        console.log("Form submitted with data:", data);

        updateProfileMutation.mutate(
            {
                userId: user?.id || "",
                dataUpdate: data,
            },
            {
                onSuccess: () => {
                    onSuccess();
                },
            }
        );
    };

    return (
        <div className="min-h-screen text-white mb-10">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

                <div className="bg-zinc-900 rounded-lg p-6">
                    {/* Profile Picture with Upload */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="relative group">
                            <Avatar className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105">
                                <AvatarImage
                                    src={userProfile?.avatar || undefined}
                                    alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    {userProfile?.firstName?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Upload overlay */}
                            <div
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center cursor-pointer"
                                onClick={handleAvatarClick}
                            >
                                {updateAvatarMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    <Camera size={20} className="text-white" />
                                )}
                            </div>

                            {/* Upload progress indicator */}
                            {updateAvatarMutation.isPending && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                    Uploading...
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={updateAvatarMutation.isPending}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                                {updateAvatarMutation.isPending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} className="mr-2" />
                                        Change Avatar
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                            disabled={updateAvatarMutation.isPending}
                        />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Basic Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            First Name
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="First Name"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            disabled={
                                                                updateProfileMutation.isPending
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Last Name"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            disabled={
                                                                updateProfileMutation.isPending
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Username
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Username"
                                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                        disabled={updateProfileMutation.isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        placeholder="Bio"
                                                        rows={3}
                                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                                                        disabled={updateProfileMutation.isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Social network link</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Instagram
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="instagram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            placeholder="Instagram"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            disabled={
                                                                updateProfileMutation.isPending
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Twitter
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="twitter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            placeholder="Twitter"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            disabled={
                                                                updateProfileMutation.isPending
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            YouTube
                                        </label>
                                        <FormField
                                            control={form.control}
                                            name="youtube"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            placeholder="YouTube"
                                                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                                            disabled={
                                                                updateProfileMutation.isPending
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={updateProfileMutation.isPending}
                                    className="px-6 py-2 border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white disabled:opacity-50"
                                >
                                    {updateProfileMutation.isPending
                                        ? "Updating..."
                                        : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
