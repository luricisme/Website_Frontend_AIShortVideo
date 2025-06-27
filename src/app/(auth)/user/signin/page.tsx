"use client";

import { z } from "zod";
import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoogleLoginButton from "@/app/(auth)/user/_components/google-button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// 1. Login Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginType = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginType) => {
        console.log(data);
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false, // Prevent automatic redirect
            });

            // console.log(">>> Login result:", result);

            if (result?.ok) {
                router.replace("/");
            } else {
                // Thử parse thông tin lỗi từ result.error
                try {
                    if (result?.error && result.error.startsWith("{")) {
                        const errorData = JSON.parse(result.error);
                        toast.error(errorData.message || "Login failed. Please try again.");
                    } else {
                        // Fallback nếu không parse được
                        if (result?.error === "CredentialsSignin") {
                            toast.error("Email or password is incorrect.");
                        } else {
                            toast.error(result?.error || "Login failed. Please try again.");
                        }
                    }
                } catch (error) {
                    // Nếu không parse được, hiển thị lỗi mặc định
                    console.error("Error parsing login error:", error);
                    toast.error(result?.error || "Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen w-full text-white grid grid-cols-1 lg:grid-cols-2">
                {/* Left side - Content */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-0">
                    {/* Logo */}
                    <div className="mb-8 sm:mb-12 lg:mb-16 w-full max-w-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                <span className="text-black font-bold text-xl">M</span>
                            </div>
                            <span className="text-lg sm:text-xl font-semibold">
                                AI Short Video Creator
                            </span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-lg w-full">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                            Create AI short videos in minutes
                        </h1>

                        <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
                            An intelligent short video creation tool that helps you easily create
                            engaging content for social media without editing experience.
                        </p>

                        {/* Features */}
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-gray-300 text-sm sm:text-base">
                                    Turn text into video in just a few minutes
                                </span>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-gray-300 text-sm sm:text-base">
                                    Thousands of professional templates and effects
                                </span>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-gray-300 text-sm sm:text-base">
                                    Optimized for TikTok, Instagram, and YouTube Shorts
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8">
                    <Card className="w-full max-w-md lg:max-w-full bg-[#1E1E1E] border-gray-800 shadow-[0_4px_40px_0_rgba(255,255,255,0.05)]">
                        <CardHeader className="pb-6 sm:pb-8 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-center text-white">
                                Sign In
                            </h2>
                        </CardHeader>

                        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
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
                                                        autoComplete="current-password"
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
                                </form>
                            </Form>

                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={form.formState.isSubmitting || isLoading}
                                className="w-full h-10 sm:h-12 bg-[#D9D9D9] text-black hover:bg-gray-200 font-semibold text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle
                                            className="animate-spin h-5 w-5 text-gray-800 mr-2"
                                            size={20}
                                            aria-label="Loading"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <LogIn
                                            strokeWidth={2.5}
                                            className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                                        />
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-2 text-gray-400 bg-[#1E1E1E] font-medium">
                                        or
                                    </span>
                                </div>
                            </div>

                            <GoogleLoginButton isDisabled={isLoading} />

                            <div className="text-center text-xs sm:text-sm">
                                <span className="text-[#786E6E]">Don&apos;t have an account? </span>
                                <Link
                                    href={"/user/register"}
                                    className={`text-white hover:underline font-medium ${
                                        form.formState.isSubmitting || isLoading
                                            ? "pointer-events-none opacity-60"
                                            : ""
                                    }`}
                                    tabIndex={form.formState.isSubmitting || isLoading ? -1 : 0}
                                    aria-disabled={form.formState.isSubmitting || isLoading}
                                >
                                    Register
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster />
        </>
    );
}
