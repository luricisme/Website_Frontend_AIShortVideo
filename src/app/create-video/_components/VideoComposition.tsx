'use client'

import {VideoData} from "@/app/create-video/_types/video";
import {AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import CaptionDisplay from "@/app/create-video/_components/CaptionDisplay";
import React from "react";

export default function VideoComposition({ videoData }: { videoData: VideoData }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

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
    const language = videoData.videoScriptData.language;
    const captionData = videoData.videoCaptionData;
    const selectedAudioFiles = videoData.videoAudioData?.selectedAudioFiles || [];
    const audioSpeed = Number(videoData.videoAudioData?.speed) || 1.0;

    // Sử dụng totalDuration từ videoAudioData
    const totalDuration = videoData.videoAudioData?.totalDuration || 0;

    // Chia script theo thời gian: 3 giây cho 20 từ
    const words = script.split(/\s+/).filter(w => w.trim().length > 0);
    const wordsPerSegment = 10;
    let timePerSegment = 3.8;

    if (language === 'Vietnamese') {
        timePerSegment = 2.8;
    } else if (language === 'English') {
        timePerSegment = 3.8;
    } else if (language === 'Chinese') {
        timePerSegment = 3.0;
    }


    // Tạo các đoạn script
    const scriptSegments = [];
    for (let i = 0; i < words.length; i += wordsPerSegment) {
        const segmentWords = words.slice(i, i + wordsPerSegment);
        const segmentIndex = Math.floor(i / wordsPerSegment);
        const startTime = segmentIndex * timePerSegment;
        const endTime = startTime + timePerSegment;

        scriptSegments.push({
            text: segmentWords.join(' '),
            startTime,
            endTime,
            duration: timePerSegment
        });
    }

    const currentTimeInSeconds = frame / fps;

    // Tìm đoạn script hiện tại
    const currentScriptSegment = scriptSegments.find(
        segment => currentTimeInSeconds >= segment.startTime && currentTimeInSeconds < segment.endTime
    );

    // Tính toán hình ảnh hiện tại - chia đều theo totalDuration
    const timePerImage = totalDuration / selectedImages.length;
    const currentImageIndex = Math.min(
        Math.floor(currentTimeInSeconds / timePerImage),
        selectedImages.length - 1
    );
    const currentImage = selectedImages[currentImageIndex];

    // Animation cho hình ảnh (smooth transition)
    const imageStartTime = currentImageIndex * timePerImage;
    const imageProgress = (currentTimeInSeconds - imageStartTime) / timePerImage;

    const imageOpacity = interpolate(
        imageProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = interpolate(
        imageProgress,
        [0, 1],
        [1, 1.05],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Animation cho caption
    const captionOpacity = currentScriptSegment ? interpolate(
        currentTimeInSeconds,
        [currentScriptSegment.startTime, currentScriptSegment.startTime + 0.3],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ) : 0;

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            {(() => {
                let accumulated = 0;
                for (let i = 0; i < selectedAudioFiles.length; i++) {
                    const file = selectedAudioFiles[i];
                    const fileDuration = file.duration || 0;
                    const fileStart = accumulated;
                    const fileEnd = fileStart + fileDuration;

                    if (currentTimeInSeconds >= fileStart && currentTimeInSeconds < fileEnd) {
                        const offset = (currentTimeInSeconds - fileStart) * audioSpeed;
                        return (
                            <Audio
                                key={file.id || i}
                                src={file.url}
                                startFrom={offset}
                            />
                        );
                    }

                    accumulated += fileDuration;
                }
                return null;
            })()}


            {/* Hình ảnh với hiệu ứng */}
            {currentImage && (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: imageOpacity,
                        transform: `scale(${scale})`,
                        transition: 'opacity 0.3s ease-in-out',
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
                    {/*<div*/}
                    {/*    style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        top: 0,*/}
                    {/*        left: 0,*/}
                    {/*        width: '100%',*/}
                    {/*        height: '100%',*/}
                    {/*        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))',*/}
                    {/*    }}*/}
                    {/*/>*/}
                </div>
            )}

            {/* Phụ đề đồng bộ với script timing */}
            {currentScriptSegment && captionData && (
                <div style={{ opacity: captionOpacity }}>
                    <CaptionDisplay
                        text={currentScriptSegment.text}
                        position={captionData.position}
                        fontSize={captionData.fontSize}
                        color={captionData.color}
                        background={captionData.background}
                        style={captionData.style}
                    />
                </div>
            )}
        </AbsoluteFill>
    );
};