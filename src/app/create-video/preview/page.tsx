'use client'

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
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


// Component hiển thị phụ đề với animation
const CaptionDisplay = ({ text, position, fontSize, color, background }: {
    text: string;
    // style: string;
    position: string;
    fontSize: string;
    color: string;
    background: boolean;
}) => {
    const frame = useCurrentFrame();
    // const { fps } = useVideoConfig();

    // Animation cho phụ đề xuất hiện từ từ
    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const getFontSize = () => {
        switch (fontSize) {
            case 'small': return '0.8rem';
            case 'large': return '1.2rem';
            default: return '1rem';
        }
    };

    const getPosition = () => {
        switch (position) {
            case 'top': return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom': return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            default: return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                ...getPosition(),
                color: color,
                fontSize: getFontSize(),
                fontWeight: 'bold',
                textAlign: 'center',
                opacity,
                backgroundColor: background ? 'rgba(0,0,0,0.7)' : 'transparent',
                borderRadius: background ? '10px' : '0',
                padding: background ? '8px 12px' : '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.4',
                maxWidth: '90%',
            }}
        >
            {text}
        </div>
    );
};

// Component chính của video
const VideoComposition = ({ videoData }: { videoData: VideoData }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    if (!videoData?.videoImageData || !videoData?.videoScriptData) {
        return (
            <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading video data...</div>
            </AbsoluteFill>
        );
    }

    const images = videoData.videoImageData.generatedImages;
    const selectedImageIds = videoData.videoImageData.selectedImages;
    const selectedImages = selectedImageIds.map(id =>
        images.find(img => img.id === id)
    ).filter(Boolean);

    const script = videoData.videoScriptData.script;
    const captionData = videoData.videoCaptionData;
    const audioUrl = videoData.videoAudioData?.selectedAudioFiles?.[0]?.url;

    // Chia script thành các đoạn nhỏ để hiển thị theo từng hình ảnh
    const sentences = script.split('.').filter(s => s.trim().length > 0);
    const framesPerImage = Math.floor(durationInFrames / selectedImages.length);

    // Xác định hình ảnh hiện tại
    const currentImageIndex = Math.floor(frame / framesPerImage);
    const currentImage = selectedImages[Math.min(currentImageIndex, selectedImages.length - 1)];

    // Xác định câu hiện tại
    const currentSentenceIndex = Math.floor((frame / durationInFrames) * sentences.length);
    const currentSentence = sentences[Math.min(currentSentenceIndex, sentences.length - 1)];

    // Animation cho hình ảnh
    const imageOpacity = interpolate(
        frame % framesPerImage,
        [0, 30, framesPerImage - 30, framesPerImage],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = interpolate(
        frame % framesPerImage,
        [0, framesPerImage],
        [1, 1.1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {/* Audio */}
            {audioUrl && (
                <Audio src={audioUrl} />
            )}

            {/* Hình ảnh với hiệu ứng */}
            {currentImage && (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: imageOpacity,
                        transform: `scale(${scale})`,
                        transition: 'all 0.5s ease-in-out',
                    }}
                >
                    <Img
                        src={currentImage.url}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Overlay gradient */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                        }}
                    />
                </div>
            )}

            {/* Phụ đề */}
            {currentSentence && captionData && (
                <CaptionDisplay
                    text={currentSentence.trim() + '.'}
                    // style={captionData.style}
                    position={captionData.position}
                    fontSize={captionData.fontSize}
                    color={captionData.color}
                    background={captionData.background}
                />
            )}

            {/* Hashtag */}
            {videoData.videoScriptData.tag && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '5%',
                        right: '5%',
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        opacity: 0.8,
                    }}
                >
                    {videoData.videoScriptData.tag}
                </div>
            )}
        </AbsoluteFill>
    );
};

const VideoPreviewCreator = () => {
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

export default VideoPreviewCreator;