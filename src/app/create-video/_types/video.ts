// video.ts

export interface ScriptData {
    topic: string;
    dataSource: string;
    language: string;
    style: string;
    target: string;
    category: string;
    tag: string;
    audience: string;
}

export interface GeneratedImage {
    id: number;
    url: string;
    prompt: string;
}

export interface AudioData {
    voiceType: string;
    speed?: string;
    customText: string;
    audioFile: File | null;
    duration?: number;
    isRecording: boolean;
    recordedAudio: string | null;
    isGenerating?: boolean;
}

export interface CaptionData {
    style: string;
    position: string;
    fontSize: string;
    color: string;
    background: boolean;
    fontFamily: string;
}

export interface FetchedData {
    lang: string;
    source: string;
    text: string;
}

export interface VideoCreationState {
    scriptData: ScriptData;
    generatedScript: string;
    selectedImages: number[];
    generatedImages: GeneratedImage[];
    audioData: AudioData;
    captionData: CaptionData;
    isGenerating: boolean;
    fetchedData: FetchedData | null;
    isFetchingData: boolean;
}

export interface VideoScriptData {
    script: string;
    category: string;
    tag: string;
    language: string;
    target: string;
    style: string;
}

export interface VideoImageData {
    generatedImages: GeneratedImage[];
    selectedImages: number[];
}

export interface VideoAudioData {
    selectedAudioFiles: Array<{
        id?: string;
        name: string;
        url: string;
        type: 'generated' | 'uploaded' | 'recorded';
        voiceType?: string;
        speed?: string;
        duration: number;
        isSelected?: boolean;
    }>;
    audioFiles: Array<{
        id: string;
        name: string;
        url: string;
        type: 'generated' | 'uploaded' | 'recorded';
        voiceType?: string;
        speed?: string;
        duration: number;
        isSelected: boolean;
    }>;
    totalDuration: number;
    voiceType?: string;
    speed?: string;
    customText?: string;
}

export interface VideoData {
    videoScriptData: VideoScriptData;
    videoImageData: VideoImageData;
    videoAudioData: VideoAudioData;
    videoCaptionData: CaptionData;
}

export interface StepProps {
    currentStep: number;
    totalSteps: number;
}

export const STEPS = [
    { id: 1, title: 'Script', path: '/create-video/script' },
    { id: 2, title: 'Image', path: '/create-video/image' },
    { id: 3, title: 'Audio', path: '/create-video/audio' },
    { id: 4, title: 'Caption', path: '/create-video/caption' },
    { id: 5, title: 'Preview', path: '/create-video/preview' },
    { id: 6, title: 'Export', path: '/create-video/export' }
] as const;