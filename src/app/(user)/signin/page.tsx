import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Left side - Content */}
            <div className="flex-1 flex flex-col justify-center px-12 lg:px-24">
                {/* Logo */}
                <div className="mb-16">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-black font-bold text-xl">M</span>
                        </div>
                        <span className="text-xl font-semibold">AI Short Video Creator</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Tạo video ngắn AI trong vài phút
                    </h1>

                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                        Công cụ tạo video ngắn thông minh giúp bạn dễ dàng tạo nội dung hấp dẫn cho mạng xã hội mà
                        không cần kinh nghiệm chỉnh sửa.
                    </p>

                    {/* Features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300">Biến văn bản thành video chỉ trong vài phút</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300">Hàng nghìn mẫu và hiệu ứng chuyên nghiệp</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300">Tối ưu hóa cho TikTok, Instagram và YouTube Shorts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-shrink-0 w-full max-w-md flex items-center justify-center p-8">
                <Card className="w-full bg-gray-900 border-gray-800">
                    <CardHeader className="pb-8">
                        <h2 className="text-2xl font-semibold text-center text-white">Sign In</h2>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                                />
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12"
                                />
                            </div>
                        </div>

                        <Button className="w-full h-12 bg-white text-black hover:bg-gray-100 font-medium">
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="text-center">
                            <span className="text-gray-400">Dont have an account? </span>
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