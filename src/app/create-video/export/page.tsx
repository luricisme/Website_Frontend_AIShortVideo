'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Download,
    Youtube,
    Play,
    Loader2,
    CheckCircle,
    AlertCircle,
    Share2,
    Copy,
    ArrowLeft,
    Home,
    XCircle,
    ExternalLink,
    Save
} from 'lucide-react';
import {
    loadVideoAudioData,
    loadVideoImageData,
    loadVideoScriptData,
    loadVideoCaptionData,
    clearAllVideoData
} from '@/app/create-video/_utils/videoStorage';
import { VideoData } from '@/app/create-video/_types/video';
import StepNavigation from "@/app/create-video/_components/StepNavigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {envPublic} from "@/constants/env.public";
import { useUserStore } from "@/providers/user-store-provider";
import {useSession} from "next-auth/react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface RenderStatus {
    id: string;
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed';
    url?: string;
    error?: string;
    progress?: number;
}

interface UploadResult {
    success: boolean;
    message: string;
    videoId?: string;
    data?: string;
}

interface SaveVideoResult {
    success: boolean;
    message: string;
    videoId?: string;
}

export default function VideoExportPage() {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [renderStatus, setRenderStatus] = useState<RenderStatus | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult>();
    const [saveResult, setSaveResult] = useState<SaveVideoResult>();
    const [videoTitle, setVideoTitle] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);
    const API_URL = envPublic.NEXT_PUBLIC_API_URL;
    const { user } = useUserStore((state) => state);
    console.log("user", user);

    const { data: session, status } = useSession();
    console.log("session", session);
    console.log("status", status);

    // YouTube upload form data
    const [youtubeData, setYoutubeData] = useState({
        title: '',
        description: '',
        tags: '',
        privacyStatus: 'private' as 'private' | 'public' | 'unlisted'
    });

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const video: VideoData = {
                    videoAudioData: loadVideoAudioData()!,
                    videoImageData: loadVideoImageData()!,
                    videoScriptData: loadVideoScriptData()!,
                    videoCaptionData: loadVideoCaptionData()!
                };
                setVideoData(video);

                // Parse script data and set initial title
                if (video.videoScriptData) {
                    const scriptData = typeof video.videoScriptData === 'string'
                        ? JSON.parse(video.videoScriptData)
                        : video.videoScriptData;

                    const initialTitle = `AI Generated Video - ${scriptData.category || 'Education'}`;
                    setVideoTitle(initialTitle);

                    setYoutubeData(prev => ({
                        ...prev,
                        title: initialTitle,
                        description: scriptData.script || '',
                        tags: scriptData.tag ? scriptData.tag.replace('#', '') : 'AI,Video,Education'
                    }));
                }

                // Calculate total duration from audio data
                if (video.videoAudioData) {
                    const audioData = typeof video.videoAudioData === 'string'
                        ? JSON.parse(video.videoAudioData)
                        : video.videoAudioData;

                    if (audioData.totalDuration) {
                        setTotalDuration(audioData.totalDuration);
                    }
                }
            } catch (err) {
                console.error("Failed to load video data:", err);
            }
        }
    }, []);

    const pollRenderStatus = async (id: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`https://api.shotstack.io/stage/render/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY || 'w76ZEcDIsfbFvVAKRTGFE87F0KHiJj6rawLWIVpo'
                    }
                });

                const data = await res.json();

                if (data.response) {
                    const status: RenderStatus = {
                        id: data.response.id,
                        status: data.response.status,
                        url: data.response.url,
                        error: data.response.error,
                        progress: getProgressFromStatus(data.response.status)
                    };

                    setRenderStatus(status);

                    if (status.status === 'done') {
                        setIsRendering(false);
                        clearInterval(pollInterval);
                        await saveVideoData(status.url!);
                    } else if (status.status === 'failed') {
                        setIsRendering(false);
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                console.error('Error polling render status:', error);
                setIsRendering(false);
                clearInterval(pollInterval);
            }
        }, 3000);
    };

    const getProgressFromStatus = (status: string): number => {
        switch (status) {
            case 'queued': return 10;
            case 'fetching': return 30;
            case 'rendering': return 70;
            case 'saving': return 90;
            case 'done': return 100;
            case 'failed': return 0;
            default: return 0;
        }
    };

    const saveVideoData = async (videoUrl: string) => {
        console.log(videoData)
        console.log(videoTitle)
        console.log(session?.user?.id);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!videoData || !session.user?.id || !videoTitle.trim()) {
            setSaveResult({
                success: false,
                message: 'Missing required data for saving video'
            });
            return;
        }

        setIsSaving(true);
        setSaveResult(undefined);

        try {
            // Parse video data
            const scriptData = typeof videoData.videoScriptData === 'string'
                ? JSON.parse(videoData.videoScriptData)
                : videoData.videoScriptData;

            const imageData = typeof videoData.videoImageData === 'string'
                ? JSON.parse(videoData.videoImageData)
                : videoData.videoImageData;

            // Prepare tags array
            const tagsArray = scriptData.tag
                ? scriptData.tag.split(',').map((tag: string) => tag.trim().replace('#', ''))
                : [];

            // Prepare image URLs array
            const imageUrls = imageData.generatedImages
                ? imageData.generatedImages.map((img: { url: string; }) => img.url)
                : [];

            const saveData = {
                title: videoTitle,
                category: scriptData.category || 'Education',
                style: scriptData.style || 'default',
                target: scriptData.target || 'general',
                script: scriptData.script || '',
                videoUrl: videoUrl,
                length: totalDuration,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                userId: session.user?.id,
                tags: tagsArray,
                imageUrls: imageUrls
            };

            const response = await fetch(`${API_URL}/video/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            const result = await response.json();

            if (response.ok) {
                setSaveResult({
                    success: true,
                    message: 'Video saved successfully!',
                    videoId: result.id
                });
            } else {
                setSaveResult({
                    success: false,
                    message: result.error || 'Failed to save video'
                });
            }
        } catch (error) {
            console.error('Save video error:', error);
            setSaveResult({
                success: false,
                message: 'Network error. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        if (!videoData) return;
        if (!videoTitle.trim()) {
            alert('Please enter a video title before rendering');
            return;
        }

        setIsRendering(true);
        setRenderStatus(null);

        try {
            const res = await fetch('/api/shotstack/render', {
                method: 'POST',
                body: JSON.stringify({ videoData }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            if (data?.data?.response?.id) {
                pollRenderStatus(data.data.response.id);
            } else {
                throw new Error('Failed to get render ID');
            }
        } catch (error) {
            console.error('Export error:', error);
            setIsRendering(false);
            setRenderStatus({
                id: '',
                status: 'failed',
                error: 'Failed to start render'
            });
        }
    };

    const handleBackHome = () => {
        clearAllVideoData();
        router.push('/');
    }

    const downloadVideo = async () => {
        if (!renderStatus?.url) return;

        try {
            const response = await fetch(renderStatus.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-video-${renderStatus.id}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download video');
        }
    };

    // Updated uploadToYouTube function to use localhost:9090 endpoint with FormData
    const uploadToYouTube = async () => {
        if (!renderStatus?.url) return;
        if (!youtubeData.title.trim()) {
            setUploadResult({
                success: false,
                message: 'Please enter a video title'
            });
            return;
        }

        setIsUploading(true);
        console.log(session?.user.id)

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('videoUrl', renderStatus.url);
            formData.append('title', youtubeData.title);
            formData.append('description', youtubeData.description);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            formData.append('userId', session?.user.id);
            formData.append('privacyStatus', youtubeData.privacyStatus);

            console.log(formData);

            const response = await fetch(`${API_URL}/publish/youtube/upload_url`, {
                method: 'POST',
                body: formData
            });

            console.log("response", response);

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setUploadResult({
                    success: true,
                    message: 'Video uploaded successfully to YouTube!',
                    data: data.data
                });
                // Reset form after successful upload
                setYoutubeData(prev => ({
                    ...prev,
                    title: '',
                    description: ''
                }));
            } else {
                setUploadResult({
                    success: false,
                    message: data.message || 'Failed to upload video to YouTube'
                });
            }
        } catch (error) {
            console.error('YouTube upload error:', error);
            setUploadResult({
                success: false,
                message: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const copyVideoUrl = () => {
        if (renderStatus?.url) {
            navigator.clipboard.writeText(renderStatus.url);
            alert('Video URL copied to clipboard!');
        }
    };

    if (!videoData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4" />
                    <p>Loading video data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white">
            <div className="max-w-6xl mx-auto space-y-6">
                <StepNavigation />
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Video Title Input */}
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Save className="h-5 w-5" />
                                    Video Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="video-title" className="mb-2 block">
                                        Video Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="video-title"
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
                                        className="bg-neutral-700 border-neutral-600"
                                        placeholder="Enter your video title"
                                    />
                                </div>

                                {/* Save Status */}
                                {saveResult && (
                                    <Alert className={`${saveResult.success ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                        <AlertDescription className={`gap-2 ${saveResult.success ? 'text-green-300' : 'text-red-300'}`}>
                                            <div className="flex items-center gap-2">
                                                {saveResult.success ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                {saveResult.message}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Render Status Card */}
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {isRendering ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : renderStatus?.status === 'done' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : renderStatus?.status === 'failed' ? (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    ) : null}
                                    Render Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!renderStatus && !isRendering && (
                                    <div className="text-center space-y-4">
                                        <p className="text-neutral-400">Ready to render your video</p>
                                        <Button
                                            onClick={handleExport}
                                            disabled={!videoTitle.trim()}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                                            size="lg"
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Start Rendering
                                        </Button>
                                        {!videoTitle.trim() && (
                                            <p className="text-sm text-yellow-500">Please enter a video title first</p>
                                        )}
                                    </div>
                                )}

                                {renderStatus && (
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Progress</span>
                                                <span>{renderStatus.progress || 0}%</span>
                                            </div>
                                            <Progress value={renderStatus.progress || 0} className="h-2" />
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span>Status:</span>
                                            <span className={`capitalize font-medium ${
                                                renderStatus.status === 'done' ? 'text-green-500' :
                                                    renderStatus.status === 'failed' ? 'text-red-500' :
                                                        'text-yellow-500'
                                            }`}>
                                                {renderStatus.status}
                                            </span>
                                        </div>

                                        {renderStatus.error && (
                                            <div className="text-red-400 text-sm">
                                                Error: {renderStatus.error}
                                            </div>
                                        )}

                                        {/* Show saving status */}
                                        {isSaving && (
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Loader2 className="animate-spin h-4 w-4" />
                                                <span>Saving video data...</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* YouTube Upload Form */}
                        {renderStatus?.status === 'done' && renderStatus.url && (
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="youtube-upload" className="bg-neutral-900 border-neutral-700 rounded-lg">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <Youtube className="h-5 w-5 text-red-500" />
                                            <span className="font-semibold">Upload to YouTube</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="title" className="mb-3">Video Title</Label>
                                                    <Input
                                                        id="title"
                                                        value={youtubeData.title}
                                                        onChange={(e) => setYoutubeData(prev => ({...prev, title: e.target.value}))}
                                                        className="bg-neutral-700 border-neutral-600"
                                                        placeholder="Enter video title"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="privacyStatus" className="mb-3">Privacy</Label>
                                                    <Select
                                                        value={youtubeData.privacyStatus}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select privacy" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="private">Private</SelectItem>
                                                            <SelectItem value="public">Public</SelectItem>
                                                            <SelectItem value="unlisted">Unlisted</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                            </div>

                                            <div>
                                                <Label htmlFor="description" className="mb-3">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={youtubeData.description}
                                                    onChange={(e) => setYoutubeData(prev => ({...prev, description: e.target.value}))}
                                                    className="bg-neutral-700 border-neutral-600 min-h-24"
                                                    placeholder="Video description..."
                                                />
                                            </div>

                                            <Button
                                                onClick={uploadToYouTube}
                                                disabled={isUploading || !youtubeData.title.trim()}
                                                className="bg-red-700 hover:bg-red-800 text-white mt-2 w-full"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Youtube className="mr-2 h-4 w-4" />
                                                        Upload to YouTube
                                                    </>
                                                )}
                                            </Button>

                                            {/* Upload Result */}
                                            {uploadResult && (
                                                <Alert className={`mt-2 ${uploadResult.success ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                                    <AlertDescription className={`gap-2 ${uploadResult.success ? 'text-green-300' : 'text-red-300'}`}>
                                                        <div className={"flex items-center gap-2"}>
                                                            {uploadResult.success ? (
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                            {uploadResult.message}
                                                        </div>
                                                        {uploadResult.success && uploadResult.data && (
                                                            <div className={"flex items-center gap-2"}>
                                                                Watch here:
                                                                <a
                                                                    href={uploadResult.data}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block text-sm opacity-80 text-emerald-100 font-semibold"
                                                                >
                                                                    {uploadResult.data}
                                                                </a>
                                                                <ExternalLink className={"w-4 h-4 text-emerald-200"} />
                                                            </div>
                                                        )}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}

                        {/* Back Button */}
                        <div className="flex justify-between mb-2">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="border-neutral-600 hover:bg-neutral-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handleBackHome}>
                                <Home className="w-4 h-4" />
                                Home
                            </Button>
                        </div>
                    </div>

                    {/* Video Preview & Actions */}
                    {renderStatus?.status === 'done' && renderStatus.url && (
                        <Card className="bg-neutral-900">
                            <CardHeader>
                                <CardTitle>Your Video is Ready!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Video Preview */}
                                <div className="aspect-video bg-black rounded-lg w-full h-150 overflow-hidden">
                                    <video
                                        src={renderStatus.url}
                                        controls
                                        className="w-full h-150"
                                        preload="metadata"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={downloadVideo}
                                        className="bg-sky-600 hover:bg-sky-700"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>

                                    <Button
                                        onClick={copyVideoUrl}
                                        variant="outline"
                                        className="border-neutral-600 hover:bg-neutral-700"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Copy URL
                                    </Button>

                                    <Button
                                        onClick={() => window.open(renderStatus.url, '_blank')}
                                        variant="outline"
                                        className="border-neutral-600 hover:bg-neutral-700"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Open in New Tab
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}