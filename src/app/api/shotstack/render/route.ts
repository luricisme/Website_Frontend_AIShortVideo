import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { videoData } = await req.json();

    try {
        // Parse videoData fields if they're strings
        const audioData = typeof videoData.videoAudioData === 'string'
            ? JSON.parse(videoData.videoAudioData)
            : videoData.videoAudioData;

        const captionData = typeof videoData.videoCaptionData === 'string'
            ? JSON.parse(videoData.videoCaptionData)
            : videoData.videoCaptionData;

        const imageData = typeof videoData.videoImageData === 'string'
            ? JSON.parse(videoData.videoImageData)
            : videoData.videoImageData;

        const scriptData = typeof videoData.videoScriptData === 'string'
            ? JSON.parse(videoData.videoScriptData)
            : videoData.videoScriptData;

        // Get selected images in order
        const selectedImages = imageData.selectedImages.map((id: number) =>
            imageData.generatedImages.find((img: { id: number; }) => img.id === id)
        ).filter(Boolean);

        const script = scriptData.script;
        const selectedAudioFiles = audioData?.selectedAudioFiles || [];
        const language = scriptData.language;

        // Sử dụng totalDuration từ videoAudioData
        const totalDuration = audioData?.totalDuration || 0;

        // Chia script theo thời gian: 3.8 giây cho 10 từ
        const words = script.split(/\s+/).filter((ww: { trim: () => { (): never; new(): never; length: number; }; }) => ww.trim().length > 0);
        const wordsPerSegment = 10;
        let timePerSegment = 3.8;

        if (language === 'Vietnamese') {
            timePerSegment = 2.5;
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

        // Tính thời lượng cho mỗi hình ảnh
        const timePerImage = totalDuration / selectedImages.length;

        // Create image clips with smooth transitions
        const imageClips = selectedImages.map((image: { url: string; }, index: number) => {
            const startTime = index * timePerImage;
            const length = timePerImage;

            return {
                asset: {
                    type: 'image',
                    src: image.url
                },
                start: startTime,
                length: length,
                fit: 'cover',
                scale: 1.0,
                transition: {
                    in: 'fade',
                    out: 'fade'
                },
                effect: 'zoomIn' // Ken Burns effect
            };
        });

        // Helper function to get font family based on style
        const getFontFamily = (style: string) => {
            switch (style) {
                case 'modern':
                    return 'Roboto';
                case 'classic':
                    return 'Montserrat SemiBold';
                case 'minimal':
                    return 'OpenSans Bold';
                case 'elegant':
                    return 'Didact Gothic';
                default:
                    return 'Roboto';
            }
        };

        // Helper function to get font weight
        const getFontWeight = (style: string) => {
            switch (style) {
                case 'modern':
                    return 600;
                case 'classic':
                    return 700; // SemiBold
                case 'minimal':
                    return 800; // Bold
                case 'elegant':
                    return 500;
                default:
                    return 800;
            }
        };

        // Helper function to get font size in pixels
        const getFontSize = (fontSize: string) => {
            switch (fontSize) {
                case 'small': return 42;
                case 'medium': return 50;
                case 'large': return 58;
                case 'extra-large': return 66;
                default: return 50;
            }
        };

        // Create subtitle clips using text asset format
        const subtitleClips = scriptSegments.map((segment) => {
            const fontSize = getFontSize(captionData.fontSize);
            const color = captionData.color || '#000000';
            const fontFamily = getFontFamily(captionData.style);
            const fontWeight = getFontWeight(captionData.style);

            return {
                asset: {
                    type: 'text',
                    text: segment.text,
                    alignment: {
                        horizontal: 'center',
                        vertical: 'bottom'
                    },
                    font: {
                        family: fontFamily,
                        size: fontSize,
                        color: color,
                        weight: fontWeight,
                        lineHeight: 1.4
                    },
                    width: 1000,
                    height: 200
                },
                start: segment.startTime,
                length: segment.duration,
                transition: {
                    in: 'fade',
                    out: 'fade'
                }
            };
        });

        // Create tracks
        const tracks = [
            // Subtitle track
            {
                clips: subtitleClips
            },
            // Image track
            {
                clips: imageClips
            }
        ];

        // Add audio tracks - phát lần lượt audio[1], audio[2]
        if (selectedAudioFiles && selectedAudioFiles.length > 0) {
            let audioStartTime = 0;

            selectedAudioFiles.forEach((audioFile: { duration: number; url: string; }) => {
                const audioDuration = audioFile.duration || 0;

                if (audioStartTime < totalDuration) {
                    tracks.push({
                        clips: [{
                            asset: {
                                type: 'audio',
                                src: audioFile.url,
                                volume: 1.0
                            },
                            start: audioStartTime,
                            length: Math.min(audioDuration, totalDuration - audioStartTime)
                        }]
                    });

                    audioStartTime += audioDuration;
                }
            });
        }

        // Create Shotstack payload
        const payload = {
            timeline: {
                background: '#000000',
                tracks: tracks
            },
            output: {
                format: 'mp4',
                // aspectRatio: '16:9',
                size: {
                    width: 1080,
                    height: 1920
                },
                fps: 60,
                scaleTo: 'preview' // For faster processing, use 'render' for final
            }
        };

        console.log("Sending Shotstack payload:", JSON.stringify(payload, null, 2));

        // Send request to Shotstack
        const response = await fetch('https://api.shotstack.io/stage/render', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.SHOTSTACK_API_KEY!
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Shotstack API error:', responseData);
            return NextResponse.json({
                success: false,
                error: responseData,
                payload: payload // Include payload for debugging
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            data: responseData,
            timeline: {
                totalDuration,
                scriptSegmentCount: scriptSegments.length,
                imageCount: selectedImages.length,
                audioFileCount: selectedAudioFiles.length
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({
            success: false,
            error: error,
        }, { status: 500 });
    }
}