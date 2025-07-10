"use client";

import { z } from "zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { getSession, signIn, useSession } from "next-auth/react";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoogleLoginButton, LeftSideContent } from "@/app/(auth)/user/_components";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import GoogleOAuthHandler from "@/app/(auth)/user/_components/google-oauth-handler";

// 1. Login Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginType = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { data: sessionData, status } = useSession();

    const searchParams = useSearchParams();
    const googleCode = searchParams.get("google_code");

    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("password");
        if (email && password) {
            form.setValue("email", email);
            form.setValue("password", password);
        }

        return () => {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Chỉ redirect khi authenticated VÀ KHÔNG có googleCode
        // Nếu có googleCode, để GoogleOAuthHandler xử lý redirect
        if (status === "authenticated" && sessionData && !googleCode) {
            console.log(">>> Auto-redirecting from LoginPage (no Google code)");
            router.replace("/");
        }
    }, [status, sessionData, router, googleCode]);

    const onSubmit = async (data: LoginType) => {
        console.log(data);
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false, // Prevent automatic redirect
            });

            if (result?.ok) {
                const session = await getSession();
                console.log(">>> Fresh session data:", session);

                if (session?.user) {
                    // Lưu thông tin user vào localStorage
                    localStorage.setItem("user", JSON.stringify(session.user));
                    router.replace("/");
                }
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

    // Nếu có googleCode và chưa có session, hiển thị GoogleOAuthHandler
    if (googleCode && googleCode.length > 0 && status !== "authenticated") {
        console.log(">>> Rendering GoogleOAuthHandler");
        return <GoogleOAuthHandler />;
    }

    // Nếu có googleCode và đã có session, vẫn hiển thị GoogleOAuthHandler
    // để nó xử lý countdown và redirect
    if (googleCode && googleCode.length > 0) {
        console.log(">>> Rendering GoogleOAuthHandler (with session)");
        return <GoogleOAuthHandler />;
    }

    return (
        <>
            <div className="min-h-screen w-full text-white grid grid-cols-1 lg:grid-cols-2">
                {/* Left side - Content */}
                <LeftSideContent />

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

                            <Suspense
                                fallback={
                                    <LoaderCircle className="animate-spin h-5 w-5 text-gray-800 mx-auto" />
                                }
                            >
                                <GoogleLoginButton isDisabled={isLoading} />
                            </Suspense>

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
        </>
    );
}
