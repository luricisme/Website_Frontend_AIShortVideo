"use client";

import { z } from "zod";
import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";

import http from "@/utils/api/client";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { type RegisterResponse } from "@/schemas/auth/responses";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeftSideContent from "@/app/(auth)/admin/_components/left-side-content";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { createUniqueUsername } from "@/utils/common";

// 1. Register Schema
const registerSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type RegisterType = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<RegisterType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterType) => {
        console.log(data);
        setIsLoading(true);
        try {
            const body = {
                email: data.email,
                password: data.password,
                username: createUniqueUsername(data.email, "admin"),
                firstName: "Admin",
                lastName: "Admin",
                role: "ADMIN",
            };

            const response = await http.post<typeof body, RegisterResponse>("/admin/register", {
                body,
                requireAuth: false,
            });

            const responseData = await response;

            // console.log("Registration response:", responseData);

            if (responseData.status < 200 || responseData.status >= 300) {
                const message = responseData.message || "Registration failed";
                toast.error(message);
                return;
            }

            toast.success("Registration successful! Redirecting to sign in...");
            setTimeout(() => {
                localStorage.setItem("email", data.email);
                localStorage.setItem("password", data.password);
                router.push("/admin/signin");
            }, 2000);
        } catch (error) {
            console.error("Error during registration:", { error });

            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full text-white grid grid-cols-1 lg:grid-cols-2">
            {/* Left side - Content */}
            <LeftSideContent />

            {/* Right side - Login Form */}
            <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8">
                <Card className="w-full max-w-md lg:max-w-full bg-[#1E1E1E] border-gray-800 shadow-[0_4px_40px_0_rgba(255,255,255,0.05)]">
                    <CardHeader className="pb-6 sm:pb-8 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white">
                            Create an Admin Account
                        </h2>
                    </CardHeader>

                    <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey &&
                                        !isLoading &&
                                        !form.formState.isSubmitting &&
                                        form.formState.isValid
                                    ) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)();
                                    }
                                }}
                                className="space-y-3 sm:space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    type="email"
                                                    placeholder="Email address"
                                                    autoComplete="email"
                                                    icon={
                                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    type="password"
                                                    placeholder="Password"
                                                    autoComplete="new-password"
                                                    icon={
                                                        <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    autoComplete="new-password"
                                                    icon={
                                                        <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || isLoading}
                                    className="w-full h-10 sm:h-12 bg-[#D9D9D9] text-black hover:bg-gray-200 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle
                                                className="animate-spin h-5 w-5 text-gray-800 mr-2"
                                                size={20}
                                                aria-label="Loading"
                                            />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <LogIn
                                                strokeWidth={2.5}
                                                className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                                            />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="text-center text-xs sm:text-sm">
                            <span className="text-[#786E6E]">Already have an account? </span>
                            <Link
                                href="/admin/signin"
                                className={`text-white hover:underline font-medium ${
                                    form.formState.isSubmitting || isLoading
                                        ? "pointer-events-none opacity-60"
                                        : ""
                                }`}
                                tabIndex={form.formState.isSubmitting || isLoading ? -1 : 0}
                                aria-disabled={form.formState.isSubmitting || isLoading}
                            >
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
