// videoStorage.ts
type VideoScriptData = {
    script: string;
    category: string;
    tag: string;
    language: string;
};

type VideoImageData = {
    generatedImages: Array<{
        id: number;
        url: string;
        prompt: string;
    }>;
    selectedImages: number[];
};

type VideoAudioData = {
    audioFiles: Array<{
        id: string;
        name: string;
        url: string;
        type: 'generated' | 'uploaded' | 'recorded';
        duration?: number;
        voiceType?: string;
        speed?: string;
        isSelected: boolean;
    }>;
    selectedAudioFiles: Array<{
        id: string;
        name: string;
        url: string;
        type: 'generated' | 'uploaded' | 'recorded';
        duration?: number;
        voiceType?: string;
        speed?: string;
    }>;
    voiceType?: string;
    speed?: string;
    customText?: string;
};

type VideoCaptionData = {
    style: string;
    position: string;
    fontSize: string;
    color: string;
    background: boolean;
};

const STORAGE_SCRIPT = 'videoScriptData';
const STORAGE_IMAGES = 'videoImageData';
const STORAGE_AUDIO = 'videoAudioData';
const STORAGE_CAPTIONS = 'videoCaptionData';

// Script storage functions
export const saveVideoScriptData = (data: VideoScriptData) => {
    try {
        localStorage.setItem(STORAGE_SCRIPT, JSON.stringify(data));
    } catch (err) {
        console.error("Failed to save video script data:", err);
    }
};

export const loadVideoScriptData = (): VideoScriptData | null => {
    try {
        const raw = localStorage.getItem(STORAGE_SCRIPT);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load video script data:", err);
        return null;
    }
};

export const clearVideoScriptData = () => {
    try {
        localStorage.removeItem(STORAGE_SCRIPT);
    } catch (err) {
        console.error("Failed to clear video script data:", err);
    }
};

// Image storage functions
export const saveVideoImageData = (data: VideoImageData) => {
    try {
        localStorage.setItem(STORAGE_IMAGES, JSON.stringify(data));
    } catch (err) {
        console.error("Failed to save video image data:", err);
    }
};

export const loadVideoImageData = (): VideoImageData | null => {
    try {
        const raw = localStorage.getItem(STORAGE_IMAGES);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load video image data:", err);
        return null;
    }
};

export const clearVideoImageData = () => {
    try {
        localStorage.removeItem(STORAGE_IMAGES);
    } catch (err) {
        console.error("Failed to clear video image data:", err);
    }
};

// Audio storage functions
export const saveVideoAudioData = (data: VideoAudioData) => {
    try {
        localStorage.setItem(STORAGE_AUDIO, JSON.stringify(data));
    } catch (err) {
        console.error("Failed to save video audio data:", err);
    }
};

export const loadVideoAudioData = (): VideoAudioData | null => {
    try {
        const raw = localStorage.getItem(STORAGE_AUDIO);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load video audio data:", err);
        return null;
    }
};

export const clearVideoAudioData = () => {
    try {
        localStorage.removeItem(STORAGE_AUDIO);
    } catch (err) {
        console.error("Failed to clear video audio data:", err);
    }
};

export const saveVideoCaptionData = (data: VideoCaptionData) => {
    try {
        localStorage.setItem(STORAGE_CAPTIONS, JSON.stringify(data));
    } catch (err) {
        console.error("Failed to save video caption data:", err);
    }
};

export const loadVideoCaptionData = (): VideoCaptionData | null => {
    try {
        const raw = localStorage.getItem(STORAGE_CAPTIONS);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.error("Failed to load video caption data:", err);
        return null;
    }
};

export const clearVideoCaptionData = () => {
    try {
        localStorage.removeItem(STORAGE_CAPTIONS);
    } catch (err) {
        console.error("Failed to clear video caption data:", err);
    }
};

// Clear all video data
export const clearAllVideoData = () => {
    clearVideoScriptData();
    clearVideoImageData();
    clearVideoAudioData();
    clearVideoCaptionData();
};