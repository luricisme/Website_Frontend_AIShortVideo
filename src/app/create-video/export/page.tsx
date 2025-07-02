'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ExportPage({ videoData }: { videoData: any }) {
    const [renderId, setRenderId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [progressMsg, setProgressMsg] = useState<string>('Đang khởi tạo render...');

    const startRender = async () => {
        setProgressMsg('Gửi yêu cầu render...');
        const res = await fetch('/api/render-remote', {
            method: 'POST',
            body: JSON.stringify({ videoData }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setRenderId(data.renderId);
        setProgressMsg(`Render ID: ${data.renderId} - Đang render...`);
    };

    useEffect(() => {
        if (renderId) {
            const interval = setInterval(async () => {
                const res = await fetch('/api/render-status', {
                    method: 'POST',
                    body: JSON.stringify({ renderId }),
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (data.done) {
                    setVideoUrl(data.url);
                    setProgressMsg('Render xong!');
                    clearInterval(interval);
                } else {
                    setProgressMsg(`Tiến độ: ${JSON.stringify(data.progress)}`);
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [renderId]);

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl mb-4">Export Video</h1>
            {!renderId && (
                <Button onClick={startRender}>Bắt đầu render</Button>
            )}
            <div className="mt-4">
                {progressMsg}
            </div>
            {videoUrl && (
                <div className="mt-4">
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="underline text-sky-400">Xem video</a>
                </div>
            )}
        </div>
    );
}
