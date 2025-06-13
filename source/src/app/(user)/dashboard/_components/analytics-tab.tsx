import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export const AnalyticsTab: React.FC = () => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Device & Browser Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Thiết bị</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Loại thiết bị người xem sử dụng
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-400 text-sm">Desktop</span>
                                    <span className="text-sm">45%</span>
                                </div>
                                <Progress
                                    value={45}
                                    className="h-2 bg-zinc-800"
                                    indicatorClassName="bg-blue-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-400 text-sm">Mobile</span>
                                    <span className="text-sm">35%</span>
                                </div>
                                <Progress
                                    value={35}
                                    className="h-2 bg-zinc-800"
                                    indicatorClassName="bg-green-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-zinc-400 text-sm">Tablet</span>
                                    <span className="text-sm">20%</span>
                                </div>
                                <Progress
                                    value={20}
                                    className="h-2 bg-zinc-800"
                                    indicatorClassName="bg-purple-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Thời gian xem</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Phân tích thời gian xem video
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Thời gian xem trung bình</span>
                                <span className="font-semibold">2 phút 34 giây</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Tỷ lệ xem hết video</span>
                                <span className="font-semibold">68%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Điểm rời khỏi video</span>
                                <span className="font-semibold">1 phút 45 giây</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Tỷ lệ click-through</span>
                                <span className="font-semibold">12.3%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Over Time */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Tương tác theo thời gian
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Phân tích tương tác trong 30 ngày qua
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { date: "01/06", likes: 450, comments: 32, shares: 18 },
                                    { date: "02/06", likes: 520, comments: 41, shares: 25 },
                                    { date: "03/06", likes: 380, comments: 28, shares: 15 },
                                    { date: "04/06", likes: 680, comments: 55, shares: 32 },
                                    { date: "05/06", likes: 720, comments: 63, shares: 41 },
                                    { date: "06/06", likes: 590, comments: 47, shares: 28 },
                                    { date: "07/06", likes: 820, comments: 71, shares: 45 },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        border: "1px solid #374151",
                                        borderRadius: "8px",
                                        color: "#F3F4F6",
                                    }}
                                />
                                <Bar dataKey="likes" fill="#8B5CF6" name="Lượt thích" />
                                <Bar dataKey="comments" fill="#10B981" name="Bình luận" />
                                <Bar dataKey="shares" fill="#F59E0B" name="Chia sẻ" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
