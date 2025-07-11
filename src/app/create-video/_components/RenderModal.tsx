// components/RenderModal.tsx
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, AlertCircle, CheckCircle } from 'lucide-react';

interface RenderModalProps {
    isOpen: boolean;
    onClose: () => void;
    isRendering: boolean;
    progress: number;
    renderUrl: string | null;
    error: string | null;
    onStartRender: () => void;
}

export default function RenderModal({
                                        isOpen,
                                        onClose,
                                        isRendering,
                                        progress,
                                        renderUrl,
                                        error,
                                        onStartRender
                                    }: RenderModalProps) {
    if (!isOpen) return null;

    const handleDownload = () => {
        if (renderUrl) {
            window.open(renderUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-neutral-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Render Video</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:bg-neutral-800"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isRendering && !renderUrl && !error && (
                        <div className="text-center">
                            <p className="text-neutral-300 mb-4">
                                Bạn có muốn render video này không?
                            </p>
                            <Button onClick={onStartRender} className="w-full">
                                Bắt đầu Render
                            </Button>
                        </div>
                    )}

                    {isRendering && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang render video...</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>

                            <p className="text-center text-sm text-neutral-400">
                                {Math.round(progress)}% hoàn thành
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                <span>Lỗi render</span>
                            </div>
                            <p className="text-sm text-red-300">{error}</p>
                            <Button onClick={onStartRender} variant="outline" className="w-full">
                                Thử lại
                            </Button>
                        </div>
                    )}

                    {renderUrl && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>Render hoàn thành!</span>
                            </div>
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Tải xuống Video
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}