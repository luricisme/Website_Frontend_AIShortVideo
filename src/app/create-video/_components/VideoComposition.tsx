'use client'

import {VideoData} from "@/app/create-video/_types/video";
import {AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import CaptionDisplay from "@/app/create-video/_components/CaptionDisplay";
import React from "react";

export default function VideoComposition({ videoData }: { videoData: VideoData }) {
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