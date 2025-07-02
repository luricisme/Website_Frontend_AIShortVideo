//preview/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {ArrowLeft, ArrowRight, BookOpenCheck, FileText, Images, Pencil} from 'lucide-react';
import StepNavigation from "@/app/create-video/_components/StepNavigation";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {
    loadVideoImageData,
    loadVideoAudioData,
    loadVideoScriptData,
    loadVideoCaptionData,
    saveVideoCaptionData
} from '../_utils/videoStorage';
import { VideoData } from '../_types/video';
import VideoComposition from "@/app/create-video/_components/VideoComposition";

export default function VideoPreviewCreator () {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Load dữ liệu từ localStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load all data from localStorage
                const scriptData = loadVideoScriptData();
                const imageData = loadVideoImageData();
                const audioData = loadVideoAudioData();
                const captionData = loadVideoCaptionData();

                // Check if essential data exists
                if (!scriptData || !imageData) {
                    throw new Error('Required video data not found in localStorage');
                }

                // Combine all data
                const combinedData = {
                    videoScriptData: scriptData,
                    videoImageData: imageData,
                    videoAudioData: audioData || { selectedAudioFiles: [] },
                    videoCaptionData: captionData || {
                        style: "classic",
                        position: "center",
                        fontSize: "large",
                        color: "#cdab8f",
                        background: false
                    }
                };

                setVideoData(combinedData);
            } catch (err) {
                console.error('Error loading video data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleContinue = () => {
        if (videoData?.videoCaptionData) {
            saveVideoCaptionData(videoData.videoCaptionData);
        }
        router.push('/create-video/export');
    };

    const handleBack = () => {
        if (videoData?.videoCaptionData) {
            saveVideoCaptionData(videoData.videoCaptionData);
        }
        router.push('/create-video/caption');
    };

    const handleEdit = () => {
        router.push('/create-video/edit');
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black py-20 px-4 flex items-center justify-center">
                <div className="text-white text-xl">Loading video data...</div>
            </div>
        );
    }

    if (error || !videoData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black py-20 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">
                        {error || 'Failed to load video data'}
                    </div>
                    <Button onClick={() => router.push('/create-video')}>
                        Go Back to Create Video
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <StepNavigation />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Video Info */}
                    <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <BookOpenCheck className={"me-2 text-sky-500"}/>
                                    Thông tin Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-neutral-300 space-y-3">
                                <div>
                                    <strong>Thể loại:</strong> {videoData.videoScriptData?.category || 'N/A'}
                                </div>
                                <div>
                                    <strong>Hashtag:</strong> {videoData.videoScriptData?.tag || 'N/A'}
                                </div>
                                <div>
                                    <strong>Số hình ảnh:</strong> {videoData.videoImageData?.selectedImages?.length || 0}
                                </div>
                                <div>
                                    <strong>Giọng đọc:</strong> {videoData.videoAudioData?.selectedAudioFiles?.[0]?.voiceType || 'N/A'}
                                </div>
                                <div>
                                    <strong>Tốc độ:</strong> {videoData.videoAudioData?.selectedAudioFiles?.[0]?.speed || '1'}x
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hình ảnh đã chọn */}
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Images className={"me-2 text-pink-300"} />
                                    Hình ảnh
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-evenly gap-4">
                                    {videoData.videoImageData?.selectedImages?.map((imageId, index) => {
                                        const image = videoData.videoImageData.generatedImages.find(img => img.id === imageId);
                                        return image ? (
                                            <div key={imageId} className="relative">
                                                <Image
                                                    width={180}
                                                    height={200}
                                                    src={image.url}
                                                    alt={`Image ${imageId}`}
                                                    className="object-cover rounded"
                                                />
                                                <div className="absolute top-2 left-2 bg-neutral-800 text-white text-xs py-1 px-2 rounded-full">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Script preview */}
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <FileText className={"me-2 text-emerald-500"} />
                                    Script
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-neutral-300 text-sm overflow-y-auto max-h-48">
                                    {videoData.videoScriptData?.script || 'No script available'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Video Player */}
                    <div>
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    🎥 Video Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 h-120 w-full">
                                    <Player
                                        component={VideoComposition}
                                        inputProps={{ videoData }}
                                        durationInFrames={1800} // 30 giây @ 60fps
                                        compositionWidth={540}
                                        compositionHeight={960}
                                        fps={60}
                                        style={{ width: '100%', height: '100%' }}
                                        controls
                                        loop
                                    />
                                </div>
                                <Button
                                    className={"bg-rose-900 text-white hover:bg-rose-800"}
                                    onClick={handleEdit}
                                >
                                    <Pencil />
                                    Edit Video
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handleContinue}>
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};