// context/VideoCreationContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { VideoCreationState, ScriptData, AudioData, CaptionData, GeneratedImage } from "../_types/video";

type VideoAction =
    | { type: 'SET_SCRIPT_DATA'; payload: Partial<ScriptData> }
    | { type: 'SET_GENERATED_SCRIPT'; payload: string }
    | { type: 'SET_SELECTED_IMAGES'; payload: number[] }
    | { type: 'SET_GENERATED_IMAGES'; payload: GeneratedImage[] }
    | { type: 'SET_AUDIO_DATA'; payload: Partial<AudioData> }
    | { type: 'SET_CAPTION_DATA'; payload: Partial<CaptionData> }
    | { type: 'SET_GENERATING'; payload: boolean }
    | { type: 'TOGGLE_IMAGE_SELECTION'; payload: number }
    | { type: 'SET_FETCHED_DATA'; payload: string | null }
    | { type: 'SET_FETCHING_DATA'; payload: boolean };

const initialState: VideoCreationState = {
    scriptData: {
        topic: '',
        dataSource: '',
        language: '',
        style: '',
        audience: '',
        category: '',
        tag: ''
    },
    generatedScript: '',
    selectedImages: [],
    generatedImages: [],
    audioData: {
        voiceType: '',
        speed: 'normal',
        customText: '',
        audioFile: null,
        isRecording: false,
        recordedAudio: null,
        isGenerating: false,
    },
    captionData: {
        style: '',
        position: '',
        fontSize: '',
        color: '',
        background: false
    },
    isGenerating: false,
    fetchedData: null,
    isFetchingData: false
};

function videoReducer(state: VideoCreationState, action: VideoAction): VideoCreationState {
    switch (action.type) {
        case 'SET_SCRIPT_DATA':
            // Reset fetched data when script data changes (except style and audience)
            const newScriptData = { ...state.scriptData, ...action.payload };
            const shouldResetData = (
                action.payload.topic !== undefined ||
                action.payload.dataSource !== undefined ||
                action.payload.language !== undefined
            );

            return {
                ...state,
                scriptData: newScriptData,
                fetchedData: shouldResetData ? null : state.fetchedData
            };
        case 'SET_GENERATED_SCRIPT':
            return {
                ...state,
                generatedScript: action.payload
            };
        case 'SET_SELECTED_IMAGES':
            return {
                ...state,
                selectedImages: action.payload
            };
        case 'SET_GENERATED_IMAGES':
            return {
                ...state,
                generatedImages: action.payload
            };
        case 'SET_AUDIO_DATA':
            return {
                ...state,
                audioData: { ...state.audioData, ...action.payload }
            };
        case 'SET_CAPTION_DATA':
            return {
                ...state,
                captionData: { ...state.captionData, ...action.payload }
            };
        case 'SET_GENERATING':
            return {
                ...state,
                isGenerating: action.payload
            };
        case 'TOGGLE_IMAGE_SELECTION':
            const imageId = action.payload;
            const newSelectedImages = state.selectedImages.includes(imageId)
                ? state.selectedImages.filter(id => id !== imageId)
                : [...state.selectedImages, imageId];
            return {
                ...state,
                selectedImages: newSelectedImages
            };
        case 'SET_FETCHED_DATA':
            return {
                ...state,
                fetchedData: action.payload
            };
        case 'SET_FETCHING_DATA':
            return {
                ...state,
                isFetchingData: action.payload
            };
        default:
            return state;
    }
}

interface VideoCreationContextType {
    state: VideoCreationState;
    dispatch: React.Dispatch<VideoAction>;
}

const VideoCreationContext = createContext<VideoCreationContextType | undefined>(undefined);

export function VideoCreationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(videoReducer, initialState);

    return (
        <VideoCreationContext.Provider value={{ state, dispatch }}>
            {children}
        </VideoCreationContext.Provider>
    );
}

export function useVideoCreation() {
    const context = useContext(VideoCreationContext);
    if (context === undefined) {
        throw new Error('useVideoCreation must be used within a VideoCreationProvider');
    }
    return context;
}