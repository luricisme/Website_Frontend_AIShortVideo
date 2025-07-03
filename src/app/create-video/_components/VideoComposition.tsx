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
    const captionData = videoData.videoCaptionData;
    const audioUrl = videoData.videoAudioData?.selectedAudioFiles?.[0]?.url;
    const audioSpeed = Number(videoData.videoAudioData?.speed) || 1.0;

    // Chia script thành các câu
    const sentences = script.split('.').filter(s => s.trim().length > 0);

    // Tính toán thời gian dựa trên tốc độ audio
    // Công thức: ~3 giây cho 10 từ ở tốc độ 1.0
    const calculateReadingTime = (text: string, speed: number): number => {
        const wordCount = text.trim().split(/\s+/).length;
        const baseTimePerWord = 0.3; // 3s cho 10 từ = 0.3s/từ
        const adjustedTime = (baseTimePerWord * wordCount) / speed;
        return Math.max(adjustedTime, 1); // Tối thiểu 1 giây
    };

    // Tạo timeline cho từng câu
    const sentenceTimeline = sentences.map((sentence, index) => {
        const readingTime = calculateReadingTime(sentence, audioSpeed);
        const startTime = sentences.slice(0, index).reduce((acc, prevSentence) => {
            return acc + calculateReadingTime(prevSentence, audioSpeed);
        }, 0);

        return {
            text: sentence.trim() + '.',
            startTime,
            endTime: startTime + readingTime,
            duration: readingTime
        };
    });

    // Tính tổng thời gian audio
    const totalAudioDuration = sentenceTimeline[sentenceTimeline.length - 1]?.endTime || 0;
    const currentTimeInSeconds = frame / fps;

    // Tìm câu hiện tại dựa trên thời gian
    const currentSentenceData = sentenceTimeline.find(
        item => currentTimeInSeconds >= item.startTime && currentTimeInSeconds < item.endTime
    );

    // Tính toán hình ảnh hiện tại
    // Chia đều hình ảnh theo thời gian video
    const timePerImage = totalAudioDuration / selectedImages.length;
    const currentImageIndex = Math.min(
        Math.floor(currentTimeInSeconds / timePerImage),
        selectedImages.length - 1
    );
    const currentImage = selectedImages[currentImageIndex];

    // Animation cho hình ảnh (smooth transition)
    // const imageTransitionDuration = 1; // 1 giây cho transition
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
    const captionOpacity = currentSentenceData ? interpolate(
        currentTimeInSeconds,
        [currentSentenceData.startTime, currentSentenceData.startTime + 0.3],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ) : 0;

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

            {/* Phụ đề đồng bộ với audio */}
            {currentSentenceData && captionData && (
                <div style={{ opacity: captionOpacity }}>
                    <CaptionDisplay
                        text={currentSentenceData.text}
                        position={captionData.position}
                        fontSize={captionData.fontSize}
                        color={captionData.color}
                        background={captionData.background}
                    />
                </div>
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

            {/*/!* Debug info (có thể xóa trong production) *!/*/}
            {/*{process.env.NODE_ENV === 'development' && (*/}
            {/*    <div*/}
            {/*        style={{*/}
            {/*            position: 'absolute',*/}
            {/*            top: '5%',*/}
            {/*            left: '5%',*/}
            {/*            color: '#fff',*/}
            {/*            fontSize: '0.8rem',*/}
            {/*            backgroundColor: 'rgba(0,0,0,0.7)',*/}
            {/*            padding: '5px',*/}
            {/*            borderRadius: '5px',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div>Time: {currentTimeInSeconds.toFixed(1)}s</div>*/}
            {/*        <div>Speed: {audioSpeed}x</div>*/}
            {/*        <div>Image: {currentImageIndex + 1}/{selectedImages.length}</div>*/}
            {/*        <div>Sentence: {currentSentenceData ? sentences.indexOf(currentSentenceData.text.replace('.', '')) + 1 : 0}/{sentences.length}</div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </AbsoluteFill>
    );
};