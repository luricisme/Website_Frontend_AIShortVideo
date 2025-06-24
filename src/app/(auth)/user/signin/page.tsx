import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, LockKeyhole, LogIn, Mail } from "lucide-react";
import Image from "next/image";

import { icons } from "@/constants/icons";

export default function LoginPage() {
    return (
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
                        Tạo video ngắn AI trong vài phút
                    </h1>

                    <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
                        Công cụ tạo video ngắn thông minh giúp bạn dễ dàng tạo nội dung hấp dẫn cho
                        mạng xã hội mà không cần kinh nghiệm chỉnh sửa.
                    </p>

                    {/* Features */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-sm sm:text-base">
                                Biến văn bản thành video chỉ trong vài phút
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-sm sm:text-base">
                                Hàng nghìn mẫu và hiệu ứng chuyên nghiệp
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-sm sm:text-base">
                                Tối ưu hóa cho TikTok, Instagram và YouTube Shorts
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
                        <div className="space-y-3 sm:space-y-4">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail color="#808080" className="w-4 h-4 sm:w-5 sm:h-5" />
                                </span>
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 pl-9 sm:pl-10 text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <LockKeyhole
                                        color="#808080"
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                    />
                                </span>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 pl-9 sm:pl-10 text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <Button className="w-full h-10 sm:h-12 bg-[#D9D9D9] text-black hover:bg-gray-200 font-semibold text-sm sm:text-base">
                            Sign In
                            <LogIn strokeWidth={2.5} className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
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

                        <Button
                            variant="outline"
                            className="w-full h-10 sm:h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800 text-sm sm:text-base"
                        >
                            <Image
                                src={icons.google.svg}
                                alt="Google Logo"
                                width={20}
                                height={20}
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                            />
                            Continue with Google
                        </Button>

                        <div className="text-center text-xs sm:text-sm">
                            <span className="text-[#786E6E]">Dont have an account? </span>
                            <button className="text-white hover:underline font-medium">
                                Register
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
