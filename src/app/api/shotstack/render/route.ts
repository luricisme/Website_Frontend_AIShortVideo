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
        const selectedImages = imageData.selectedImages.map(id =>
            imageData.generatedImages.find(img => img.id === id)
        ).filter(Boolean);

        // Calculate timing based on script and audio speed
        const script = scriptData.script;
        const audioSpeed = Number(audioData?.speed) || 1.0;
        const sentences = script.split('.').filter(s => s.trim().length > 0);

        // Calculate reading time for each sentence
        const calculateReadingTime = (text, speed) => {
            const wordCount = text.trim().split(/\s+/).length;
            const baseTimePerWord = 0.3; // 0.3s per word at 1.0x speed
            const adjustedTime = (baseTimePerWord * wordCount) / speed;
            return Math.max(adjustedTime, 1); // Minimum 1 second
        };

        // Create sentence timeline
        const sentenceTimeline = [];
        let currentTime = 0;

        sentences.forEach((sentence, index) => {
            const readingTime = calculateReadingTime(sentence, audioSpeed);
            sentenceTimeline.push({
                text: sentence.trim() + '.',
                startTime: currentTime,
                endTime: currentTime + readingTime,
                duration: readingTime
            });
            currentTime += readingTime;
        });

        const totalDuration = currentTime;
        const timePerImage = totalDuration / selectedImages.length;

        // Create image clips with smooth transitions
        const imageClips = selectedImages.map((image, index) => {
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

        // Create subtitle clips synchronized with sentences
        const subtitleClips = sentenceTimeline.map((sentence, index) => ({
            asset: {
                type: 'title',
                text: sentence.text,
                style: 'minimal',
                color: captionData.color || '#ffffff',
                size: captionData.fontSize === 'large' ? 'x-large' :
                    captionData.fontSize === 'medium' ? 'large' : 'medium',
                // background: captionData.background || '#80000000',
                position: captionData.position || 'bottom'
            },
            start: sentence.startTime,
            length: sentence.duration,
            transition: {
                in: 'fade',
                out: 'fade'
            }
        }));

        // Create tracks
        const tracks = [
            // Background track (black)
            {
                clips: [{
                    asset: {
                        type: 'html',
                        html: '<div style="width:100%;height:100%;background-color:#000000;"></div>'
                    },
                    start: 0,
                    length: totalDuration
                }]
            },
            // Image track
            {
                clips: imageClips
            },
            // Subtitle track
            {
                clips: subtitleClips
            },
            // Hashtag track
            // ...(hashtagClip.length > 0 ? [{ clips: hashtagClip }] : [])
        ];

        // Add audio track if available
        const audio = audioData?.selectedAudioFiles?.[0];
        if (audio && audio.url) {
            tracks.push({
                clips: [{
                    asset: {
                        type: 'audio',
                        src: audio.url,
                        volume: 1.0
                    },
                    start: 0,
                    length: totalDuration
                }]
            });
        }

        // Create Shotstack payload
        const payload = {
            timeline: {
                background: '#000000',
                tracks: tracks,
                fonts: [
                    {
                        src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2'
                    }
                ]
            },
            output: {
                format: 'mp4',
                aspectRatio: '16:9',
                size: {
                    width: 1080,
                    height: 1920
                },
                fps: 30,
                scaleTo: 'preview' // For faster processing, use 'render' for final
            },
            merge: [
                {
                    find: 'audio',
                    replace: audio?.url || ''
                }
            ]
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
                sentenceCount: sentences.length,
                imageCount: selectedImages.length
            }
        });

    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}