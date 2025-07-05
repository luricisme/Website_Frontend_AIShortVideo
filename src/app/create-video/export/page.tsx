'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Download,
    Youtube,
    Play,
    Loader2,
    CheckCircle,
    AlertCircle,
    Share2,
    Copy, ArrowLeft, Home
} from 'lucide-react';
import {
    loadVideoAudioData,
    loadVideoImageData,
    loadVideoScriptData,
    loadVideoCaptionData, clearAllVideoData
} from '@/app/create-video/_utils/videoStorage';
import { VideoData } from '@/app/create-video/_types/video';
import StepNavigation from "@/app/create-video/_components/StepNavigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface RenderStatus {
    id: string;
    status: 'queued' | 'fetching' | 'rendering' | 'saving' | 'done' | 'failed';
    url?: string;
    error?: string;
    progress?: number;
}

export default function VideoExportPage() {
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [renderStatus, setRenderStatus] = useState<RenderStatus | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // YouTube upload form data
    const [youtubeData, setYoutubeData] = useState({
        title: '',
        description: '',
        tags: '',
        privacy: 'private' as 'private' | 'public' | 'unlisted'
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

                // Pre-fill YouTube form with script data
                if (video.videoScriptData) {
                    const scriptData = typeof video.videoScriptData === 'string'
                        ? JSON.parse(video.videoScriptData)
                        : video.videoScriptData;

                    setYoutubeData(prev => ({
                        ...prev,
                        title: `AI Generated Video - ${scriptData.category || 'Education'}`,
                        description: scriptData.script || '',
                        tags: scriptData.tag ? scriptData.tag.replace('#', '') : 'AI,Video,Education'
                    }));
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
                        'x-api-key': process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY || 'aZdNfmHr7uXO8xnoMPnG9k8vbASkHLHIwMjM6fjH'
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

                    if (status.status === 'done' || status.status === 'failed') {
                        setIsRendering(false);
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                console.error('Error polling render status:', error);
                setIsRendering(false);
                clearInterval(pollInterval);
            }
        }, 3000); // Poll every 3 seconds
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

    const handleExport = async () => {
        if (!videoData) return;
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

    const uploadToYouTube = async () => {
        if (!renderStatus?.url) return;

        setIsUploading(true);
        try {
            const response = await fetch('/api/youtube/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoUrl: renderStatus.url,
                    ...youtubeData
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(`Video uploaded successfully! Video ID: ${result.videoId}`);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('YouTube upload error:', error);
            alert('Failed to upload to YouTube: ' + error);
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
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            size="lg"
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Start Rendering
                                        </Button>
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
                                                    <Label htmlFor="title" className={"mb-2"}>Video Title</Label>
                                                    <Input
                                                        id="title"
                                                        value={youtubeData.title}
                                                        onChange={(e) => setYoutubeData(prev => ({...prev, title: e.target.value}))}
                                                        className="bg-neutral-700 border-neutral-600"
                                                        placeholder="Enter video title"
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="tags" className={"mb-2"}>Tags (comma separated)</Label>
                                                    <Input
                                                        id="tags"
                                                        value={youtubeData.tags}
                                                        onChange={(e) => setYoutubeData(prev => ({...prev, tags: e.target.value}))}
                                                        className="bg-neutral-700 border-neutral-600"
                                                        placeholder="AI, Video, Education"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="description" className={"mb-2"}>Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={youtubeData.description}
                                                    onChange={(e) => setYoutubeData(prev => ({...prev, description: e.target.value}))}
                                                    className="bg-neutral-700 border-neutral-600 min-h-24"
                                                    placeholder="Video description..."
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="privacy" className={"mb-2"}>Privacy</Label>
                                                <select
                                                    id="privacy"
                                                    value={youtubeData.privacy}
                                                    onChange={(e) => setYoutubeData(prev => ({...prev, privacy: e.target.value as never}))}
                                                    className="w-full bg-neutral-700 border border-neutral-600 rounded-md px-3 py-2 text-white"
                                                >
                                                    <option value="private">Private</option>
                                                    <option value="unlisted">Unlisted</option>
                                                    <option value="public">Public</option>
                                                </select>
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
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        )}
                        {/* Back Button */}
                        <div className={"flex justify-between mb-2"}>
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