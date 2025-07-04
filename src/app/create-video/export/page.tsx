'use client';
import React, { useState } from 'react';
import {ArrowLeft, Home, Upload, Youtube} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {useRouter} from "next/navigation";

export default function ExportPage() {
    const [progress] = useState(20);
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const router = useRouter();

    const handleExport = async (platform: string) => {
        setIsExporting(true);
        setExportProgress(0);

        // Simulate export progress
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExporting(false);
                    alert(`Video đã được xuất thành công cho ${platform}!`);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const exportOptions = [
        {
            name: 'OneDrive',
            icon: () => (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 13.5c0-1.4-1.1-2.5-2.5-2.5-.2 0-.4 0-.6.1C18.7 9.6 17.1 8.5 15.2 8.5c-1.5 0-2.8.8-3.5 2-.3-.1-.6-.1-.9-.1-1.9 0-3.5 1.6-3.5 3.5 0 .2 0 .4.1.6C5.6 14.8 4.5 16.1 4.5 17.7c0 1.9 1.6 3.5 3.5 3.5h12c1.9 0 3.5-1.6 3.5-3.5 0-1.4-.8-2.6-2-3.2z"/>
                </svg>
            ),
            color: 'bg-blue-600',
            connected: true,
            description: 'Save to OneDrive'
        },
        {
            name: 'Google Drive',
            icon: () => (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.01 2L22 20H2L12.01 2zm-1.44 6.5L8.81 10.5l1.94 3.36H6.5L12.01 4.5L17.5 13.86h-4.25L11.31 10.5L9.57 8.5z"/>
                </svg>
            ),
            color: 'bg-yellow-500',
            connected: false,
            description: 'Save to Google Drive'
        },
        {
            name: 'YouTube',
            icon: Youtube,
            color: 'bg-red-600',
            connected: false,
            description: 'Upload to YouTube'
        },
        {
            name: 'TikTok',
            icon: () => (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
            ),
            color: 'bg-neutral-900',
            connected: false,
            description: 'Send to TikTok'
        }
    ];

    const handleBack = () => {
        // Save current state before going back
        // saveVideoCaptionData(captionData);
        router.push('/create-video/preview');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black px-4">
            {/* Header */}
            <div className="flex py-3 border-b border-neutral-700">
                <div className="flex items-center me-7 cursor-pointer" onClick={handleBack}>
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-700">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className=" text-neutral-400">Keep editing</span>
                </div>

                <div className="flex items-center cursor-pointer">
                    <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-neutral-700">
                        <Home className="h-4 w-4" />
                    </Button>
                    <span className=" text-neutral-400">Home</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto max-w-8xl py-10">
                <div className="grid lg:grid-cols-3 gap-25">
                    {/* Left side - Title and Export Options */}
                    <div className="space-y-6 col-span-2">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-white">Video title</h1>
                            <div className="flex items-center gap-2">
                                <Progress value={progress} className="flex-1 bg-neutral-700" />
                                <span className="text-sm text-neutral-400">{progress}% — 30 seconds remaining</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-white">Save or share your video</h2>

                            <div className="space-y-5">
                                {exportOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <Card key={option.name} className="bg-neutral-800 border-neutral-700 hover:bg-neutral-750 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded ${option.color} text-white`}>
                                                            <IconComponent className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-neutral-200 font-medium">{option.name}</span>
                                                            {option.connected && (
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!option.connected && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                                                                onClick={() => handleExport(option.name)}
                                                            >
                                                                {option.name === 'OneDrive' ? 'Connect to OneDrive' : 'Connect'}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Video Preview */}
                    <div className="space-y-4">
                        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                            <div className="bg-neutral-900 rounded-lg p-4 font-mono text-sm w-full h-180">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Progress Modal */}
            {isExporting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="bg-neutral-800 border-neutral-700 w-96">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-blue-400" />
                                    <span className="font-medium text-white">Đang xuất video...</span>
                                </div>
                                <Progress value={exportProgress} className="bg-neutral-700" />
                                <p className="text-sm text-neutral-400">{exportProgress}% hoàn thành</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}