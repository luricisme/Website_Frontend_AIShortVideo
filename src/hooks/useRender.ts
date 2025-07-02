// hooks/useRender.ts
import { useState } from 'react';
import { VideoData } from '@/app/create-video/_types/video';

interface RenderStatus {
    done: boolean;
    progress: number;
    url?: string;
    errors?: string[];
    fatalErrorEncountered?: boolean;
}

export function useRender() {
    const [isRendering, setIsRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);
    const [renderUrl, setRenderUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [renderId, setRenderId] = useState<string | null>(null);

    const startRender = async (videoData: VideoData) => {
        try {
            setIsRendering(true);
            setError(null);
            setRenderProgress(0);
            setRenderUrl(null);

            const response = await fetch('/api/render', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoData }),
            });

            if (!response.ok) {
                throw new Error('Failed to start render');
            }

            const result = await response.json();
            setRenderId(result.renderId);

            // Bắt đầu polling để check status
            pollRenderStatus(result.renderId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsRendering(false);
        }
    };

    const pollRenderStatus = async (renderIdParam: string) => {
        try {
            const response = await fetch(`/api/render/status/${renderIdParam}`);

            if (!response.ok) {
                throw new Error('Failed to get render status');
            }

            const status: RenderStatus = await response.json();

            setRenderProgress(status.progress * 100);

            if (status.done && status.url) {
                setRenderUrl(status.url);
                setIsRendering(false);
                return;
            }

            if (status.fatalErrorEncountered) {
                setError('Render failed with fatal error');
                setIsRendering(false);
                return;
            }

            if (status.errors && status.errors.length > 0) {
                setError(status.errors.join(', '));
                setIsRendering(false);
                return;
            }

            // Continue polling if not done
            if (!status.done) {
                setTimeout(() => pollRenderStatus(renderIdParam), 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsRendering(false);
        }
    };

    const resetRender = () => {
        setIsRendering(false);
        setRenderProgress(0);
        setRenderUrl(null);
        setError(null);
        setRenderId(null);
    };

    return {
        startRender,
        resetRender,
        isRendering,
        renderProgress,
        renderUrl,
        error,
        renderId
    };
}