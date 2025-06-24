'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, ArrowRight, Play, Pause, Download,
    Mic, Settings, FileText, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StepNavigation from '../_components/StepNavigation';
import { useVideoCreation } from '../_context/VideoCreationContext';

export default function PreviewPage() {
    const router = useRouter();
    const { state } = useVideoCreation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime] = useState(0);
    const [isExporting] = useState(false);
    const [exportProgress] = useState(0);

    const totalDuration = 150; // 2:30 in seconds
    const progress = (currentTime / totalDuration) * 100;

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // In real app, this would control actual video playback
    };

    // const handleExport = () => {
    //     setIsExporting(true);
    //     setExportProgress(0);
    //
    //     // Simulate export progress
    //     const interval = setInterval(() => {
    //         setExportProgress(prev => {
    //             if (prev >= 100) {
    //                 clearInterval(interval);
    //                 setIsExporting(false);
    //                 // Show success message or download
    //                 alert('Video đã được xuất thành công!');
    //                 return 100;
    //             }
    //             return prev + 10;
    //         });
    //     }, 500);
    // };

    const handleEdit = () => {
        router.push('/create-video/edit');
    };

    const handleBack = () => {
        router.push('/create-video/caption');
    };

    const handleNext = () => {
        router.push('/create-video/export');
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-5xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Preview Video</CardTitle>
                        <CardDescription>
                            Preview your video before exporting
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Video Preview */}
                        <div className="relative bg-black rounded-lg aspect-video overflow-hidden group">
                            {/* Mock video background with gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />

                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div
                                        className="w-20 h-20 mx-auto mb-4 text-black bg-white bg-opacity-20 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm"
                                        onClick={handlePlayPause}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-8 h-8" />
                                        ) : (
                                            <Play className="w-8 h-8 ml-1" />
                                        )}
                                    </div>
                                    <p className="text-lg font-medium">
                                        {isPlaying ? 'Playing...' : 'Click to preview'}
                                    </p>
                                    <p className="text-sm opacity-70">
                                        Duration: {formatTime(totalDuration)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar (only show when playing) */}
                            {isPlaying && (
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-black bg-opacity-50 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="flex items-center space-x-3 text-white text-sm">
                                            <span>{formatTime(currentTime)}</span>
                                            <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span>{formatTime(totalDuration)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Details */}
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Video Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Topic:</span>
                                        <Badge variant="secondary">{state.scriptData?.topic || 'Not yet'}</Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mic className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Voice:</span>
                                        <Badge variant="secondary">
                                            {state.audioData?.voiceType === 'female-young' ? 'Female - Young' :
                                                state.audioData?.voiceType === 'female-mature' ? 'Female - Mature' :
                                                    state.audioData?.voiceType === 'male-young' ? 'Male - Young' :
                                                        state.audioData?.voiceType === 'male-mature' ? 'Male - Mature' :
                                                            state.audioData?.voiceType || 'Child'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Palette className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Caption style:</span>
                                        <Badge variant="secondary">
                                            {state.captionData?.style === 'modern' ? 'Modern' :
                                                state.captionData?.style === 'classic' ? 'Classic' :
                                                    state.captionData?.style === 'minimal' ? 'Minimal' :
                                                        state.captionData?.style === 'elegant' ? 'Elegant' :
                                                            state.captionData?.style || 'Not yet'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Settings className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Resolution:</span>
                                        <Badge variant="secondary">1920x1080 (Full HD)</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Progress */}
                        {isExporting && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                                    <span className="font-medium text-blue-900">Exporting video...</span>
                                </div>
                                <Progress value={exportProgress} className="w-full" />
                                <p className="text-sm text-blue-600 mt-2">{exportProgress}% completed</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="px-6 py-3"
                                disabled={isExporting}
                            >
                                <Palette className="w-4 h-4" />
                                Edit video
                            </Button>
                            <Button
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                                onClick={handleNext}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Export video
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={handleBack} disabled={isExporting}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={isExporting}>
                                <Download className="w-4 h-4" />
                                Export
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}