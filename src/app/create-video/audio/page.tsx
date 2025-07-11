'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {ArrowLeft, ArrowRight, Download, Mic, Pause, Play, Upload, Volume2, Square, Trash, Check} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AudioData } from '../_types/video';
import { saveVideoAudioData, loadVideoAudioData, clearVideoCaptionData } from '../_utils/videoStorage';

// Interface for individual audio files
interface AudioFile {
    id: string;
    name: string;
    url: string;
    type: 'generated' | 'uploaded' | 'recorded';
    duration?: number;
    voiceType?: string;
    speed?: string;
    isSelected: boolean;
}
import StepNavigation from '../_components/StepNavigation';
import { useVideoCreation } from '../_context/VideoCreationContext';
import {envPublic} from "@/constants/env.public";

// Voice types with descriptions organized by language
const VOICE_TYPES = {
    Vietnamese: [
        { value: 'vi-VN-HoaiMyNeural', label: 'Hoai My (Female)', description: 'Northern accent, natural, suitable for news reading' },
        { value: 'vi-VN-NamMinhNeural', label: 'Nam Minh (Male)', description: 'Northern accent, warm and deep' },
    ],
    English: [
        { value: 'en-US-JennyNeural', label: 'Jenny (Female)', description: 'Standard American accent, versatile' },
        { value: 'en-US-DavisNeural', label: 'Davis (Male)', description: 'Deep voice, professional' },
    ],
    Chinese: [
        { value: 'zh-CN-XiaoxiaoNeural', label: 'Xiaoxiao (Female)', description: 'Young female voice, emotionally expressive' },
        { value: 'zh-CN-YunyangNeural', label: 'Yunyang (Male)', description: 'Broadcaster voice' }
    ]
};

export default function AudioPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [currentPlayingAudio, setCurrentPlayingAudio] = useState<string | null>(null);
    const [audioProgress, setAudioProgress] = useState<{ [key: string]: number }>({});
    const [audioDurations, setAudioDurations] = useState<{ [key: string]: number }>({});
    const [currentTimes, setCurrentTimes] = useState<{ [key: string]: number }>({});
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const API_URL = envPublic.NEXT_PUBLIC_API_URL;

    // Get script and language from localStorage
    const [script, setScript] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem('videoScriptData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setScript(parsedData.script || '');
                setSelectedLanguage(parsedData.language || 'English');
            } catch (error) {
                console.error('Error parsing stored script:', error);
            }
        }
    }, []);

    // Get available voice types for selected language
    const getAvailableVoiceTypes = () => {
        return VOICE_TYPES[selectedLanguage as keyof typeof VOICE_TYPES] || VOICE_TYPES.English;
    };

    // Initialize audioData with default values if not present
    const audioData = state.audioData || {
        voiceType: getAvailableVoiceTypes()[0]?.value || 'en-US-JennyNeural',
        speed: '1.0',
        customText: '',
        audioFile: null,
        isRecording: false,
        recordedAudio: null,
        isGenerating: false
    };

    const updateAudioData = (updates: Partial<AudioData>) => {
        dispatch({
            type: 'SET_AUDIO_DATA',
            payload: { ...audioData, ...updates }
        });
    };

    // Reset voice type when language changes
    useEffect(() => {
        const availableVoices = getAvailableVoiceTypes();
        if (availableVoices.length > 0 &&
            !availableVoices.some(voice => voice.value === audioData.voiceType)) {
            updateAudioData({ voiceType: availableVoices[0].value });
        }
    }, [selectedLanguage]);

    // Add new audio file to the list
    const addAudioFile = (audioFile: Omit<AudioFile, 'id' | 'isSelected'>) => {
        const newFile: AudioFile = {
            ...audioFile,
            id: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            isSelected: false
        };
        const updatedFiles = [...audioFiles, newFile];
        setAudioFiles(updatedFiles);

        // Auto-save to localStorage
        saveVideoAudioData({
            totalDuration: 0,
            audioFiles: updatedFiles,
            selectedAudioFiles: getSelectedAudioFiles(),
            voiceType: audioData.voiceType,
            speed: audioData.speed,
            customText: audioData.customText
        });

        return newFile.id;
    };

    // Remove audio file
    const removeAudioFile = (id: string) => {
        const updatedFiles = audioFiles.filter(file => file.id !== id);
        setAudioFiles(updatedFiles);

        // Auto-save to localStorage
        saveVideoAudioData({
            totalDuration: 0,
            audioFiles: updatedFiles,
            selectedAudioFiles: updatedFiles.filter(file => file.isSelected),
            voiceType: audioData.voiceType,
            speed: audioData.speed,
            customText: audioData.customText
        });

        // Stop playing if this file is currently playing
        if (currentPlayingAudio === id) {
            setCurrentPlayingAudio(null);
            setIsPlaying(null);
        }
        // Clean up refs
        if (audioRefs.current[id]) {
            delete audioRefs.current[id];
        }
    };

    // Toggle audio file selection
    const toggleAudioSelection = (id: string) => {
        const updatedFiles = audioFiles.map(file =>
            file.id === id
                ? { ...file, isSelected: !file.isSelected }
                : file
        );
        setAudioFiles(updatedFiles);

        // Auto-save to localStorage
        saveVideoAudioData({
            totalDuration: 0,
            audioFiles: updatedFiles,
            selectedAudioFiles: updatedFiles.filter(file => file.isSelected),
            voiceType: audioData.voiceType,
            speed: audioData.speed,
            customText: audioData.customText
        });
    };

    // Select all audio files
    const selectAllAudio = () => {
        setAudioFiles(prev => prev.map(file => ({ ...file, isSelected: true })));
    };

    // Deselect all audio files
    const deselectAllAudio = () => {
        setAudioFiles(prev => prev.map(file => ({ ...file, isSelected: false })));
    };

    // Get selected audio files
    const getSelectedAudioFiles = () => {
        return audioFiles.filter(file => file.isSelected);
    };

    // Load data from localStorage
    useEffect(() => {
        const savedAudioData = loadVideoAudioData();
        if (savedAudioData) {
            setAudioFiles(savedAudioData.audioFiles);
            if (savedAudioData.voiceType) {
                updateAudioData({
                    voiceType: savedAudioData.voiceType,
                    speed: savedAudioData.speed,
                    customText: savedAudioData.customText
                });
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup recording interval
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }

            // Stop media recorder if still recording
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        };
    }, [mediaRecorder]);

    useEffect(() => {
        if (audioFiles.length > 0) {
            saveVideoAudioData({
                speed: "", totalDuration: 0, voiceType: "",
                customText: "",
                audioFiles,
                selectedAudioFiles: getSelectedAudioFiles()
            });
        }
    }, [audioFiles, audioData.voiceType, audioData.speed, audioData.customText, recordedChunks]);

    const handleContinue = () => {
        const selectedFiles = getSelectedAudioFiles();
        if (selectedFiles.length === 0) {
            alert("Vui lòng chọn ít nhất một file audio trước khi tiếp tục");
            return;
        }

        const totalDuration = getTotalDuration();

        // Save audio data to localStorage
        saveVideoAudioData({
            audioFiles,
            selectedAudioFiles: selectedFiles,
            voiceType: audioData.voiceType,
            speed: audioData.speed,
            customText: audioData.customText,
            totalDuration: totalDuration // Save total duration
        });

        // Update audio data with selected files and total duration
        updateAudioData({
            recordedAudio: selectedFiles[0].url, // Use first selected for backward compatibility
        });
        clearVideoCaptionData();
        router.push('/create-video/caption');
    };

    const handleBack = () => {
        router.push('/create-video/image');
    };

    const handleRecording = async () => {
        if (audioData.isRecording) {
            // Stop recording
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }

            updateAudioData({ isRecording: false });

            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }

            setRecordingTime(0);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);

                // Reset recorded chunks
                setRecordedChunks([]);

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setRecordedChunks(prev => [...prev, event.data]);
                    }
                };

                recorder.onstop = async () => {
                    // Stop all tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());

                    // Process recorded audio
                    await processRecordedAudio();
                };

                recorder.start();
                setMediaRecorder(recorder);

                updateAudioData({ isRecording: true });
                setRecordingTime(0);

                recordingIntervalRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);

            } catch (error) {
                console.error('Error accessing microphone:', error);
                alert('Cannot access microphone. Please check permissions.');
            }
        }
    };

    const processRecordedAudio = async () => {
        if (recordedChunks.length === 0) return;

        try {
            // Create blob from recorded chunks
            const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });

            // Create file from blob
            const audioFile = new File([audioBlob], `recording_${Date.now()}.wav`, {
                type: 'audio/wav'
            });

            // Create temporary audio file entry
            const tempFileId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const tempAudioFile: AudioFile = {
                id: tempFileId,
                name: `Recording ${formatTime(recordingTime)}`,
                url: URL.createObjectURL(audioBlob), // Temporary URL for preview
                type: 'recorded',
                isSelected: false
            };

            // Add to list with uploading status
            setAudioFiles(prev => [...prev, tempAudioFile]);
            setUploadingFiles(prev => new Set(prev).add(tempFileId));

            // Upload to server
            const uploadedUrl = await uploadAudioFile(audioFile);

            // Update with real URL after successful upload
            setAudioFiles(prev =>
                prev.map(audioFileItem =>
                    audioFileItem.id === tempFileId
                        ? { ...audioFileItem, url: uploadedUrl }
                        : audioFileItem
                )
            );

            // Clear recorded chunks
            setRecordedChunks([]);

            alert('Recording saved successfully!');

        } catch (error) {
            console.error('Error processing recorded audio:', error);
            alert('Failed to save recording. Please try again.');

            // Remove from list if processing failed
            const tempFileId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setAudioFiles(prev => prev.filter(audioFile => audioFile.id !== tempFileId));
        } finally {
            // Remove from uploading state
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                const tempFileId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                newSet.delete(tempFileId);
                return newSet;
            });
        }
    };


    const handleGenerateAudio = async () => {
        if (!audioData.voiceType) {
            alert('Please select a voice type');
            return;
        }

        const textToConvert = audioData.customText || script;
        if (!textToConvert.trim()) {
            alert('Please enter content to convert');
            return;
        }

        updateAudioData({ isGenerating: true });

        try {
            const response = await fetch(`${API_URL}/create-video/generate-audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    script: textToConvert,
                    lang: selectedLanguage,
                    voiceType: audioData.voiceType,
                    speed: audioData.speed || '1.0'
                })
            });

            const result = await response.json();
            console.log(result);

            if (result.status === 200) {
                // Add generated audio to files list with duration if available
                const availableVoices = getAvailableVoiceTypes();
                const selectedVoice = availableVoices.find(v => v.value === audioData.voiceType);
                addAudioFile({
                    name: `${selectedVoice?.label || 'Generated'} - ${audioData.speed}x`,
                    url: result.data.audio,
                    type: 'generated',
                    voiceType: audioData.voiceType,
                    speed: audioData.speed,
                    duration: result.data.duration || undefined // Save duration if API returns it
                });

                updateAudioData({
                    isGenerating: false,
                    recordedAudio: null
                });
            } else {
                throw new Error(result.message || 'Error generating audio');
            }
        } catch (error) {
            console.error('Error generating audio:', error);
            alert('An error occurred while generating audio. Please try again.');
            updateAudioData({ isGenerating: false });
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid audio file (MP3, WAV, M4A)');
            return;
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            alert('File size must not exceed 50MB');
            return;
        }

        // Create temporary file ID to track upload
        const tempFileId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Add file to list with uploading status
        const tempAudioFile: AudioFile = {
            id: tempFileId,
            name: file.name,
            url: URL.createObjectURL(file), // Temporary URL for preview
            type: 'uploaded',
            isSelected: false
        };

        setAudioFiles(prev => [...prev, tempAudioFile]);
        setUploadingFiles(prev => new Set(prev).add(tempFileId));

        try {
            // Upload file to server
            const uploadedUrl = await uploadAudioFile(file);

            // Update with real URL after successful upload
            setAudioFiles(prev =>
                prev.map(audioFile =>
                    audioFile.id === tempFileId
                        ? { ...audioFile, url: uploadedUrl }
                        : audioFile
                )
            );

            // Update audioData if needed
            updateAudioData({
                audioFile: file,
                recordedAudio: null
            });

            // Show success message
            alert('Audio file uploaded successfully!');

        } catch (error) {
            console.error('Upload failed:', error);
            alert('File upload failed. Please try again.');

            // Remove file from list if upload failed
            setAudioFiles(prev => prev.filter(audioFile => audioFile.id !== tempFileId));
        } finally {
            // Remove from uploading state
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(tempFileId);
                return newSet;
            });

            // Reset file input
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const handlePlayPause = (audioId: string) => {
        const audioElement = audioRefs.current[audioId];
        if (!audioElement) return;

        if (currentPlayingAudio === audioId && isPlaying === audioId) {
            // Pause current audio
            audioElement.pause();
            setIsPlaying(null);
        } else {
            // Stop any currently playing audio
            if (currentPlayingAudio && audioRefs.current[currentPlayingAudio]) {
                audioRefs.current[currentPlayingAudio].pause();
            }

            // Play new audio
            audioElement.play();
            setIsPlaying(audioId);
            setCurrentPlayingAudio(audioId);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');

        const files = Array.from(e.dataTransfer.files);
        const audioFile = files.find(file => file.type.startsWith('audio/'));

        if (audioFile) {
            // Create event object like file input
            const mockEvent = {
                target: {files: [audioFile]}
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            await handleFileUpload(mockEvent);
        } else {
            alert('Please select a valid audio file');
        }
    };

    const handleTimeUpdate = (audioId: string) => {
        const audioElement = audioRefs.current[audioId];
        if (audioElement) {
            const current = audioElement.currentTime;
            const duration = audioElement.duration;
            setCurrentTimes(prev => ({ ...prev, [audioId]: current }));
            setAudioProgress(prev => ({ ...prev, [audioId]: (current / duration) * 100 }));
        }
    };

    const handleLoadedMetadata = (audioId: string) => {
        const audioElement = audioRefs.current[audioId];
        if (audioElement) {
            const duration = audioElement.duration;
            setAudioDurations(prev => ({ ...prev, [audioId]: duration }));

            // Update duration in audioFiles array
            setAudioFiles(prev => prev.map(file =>
                file.id === audioId
                    ? { ...file, duration: duration }
                    : file
            ));
        }
    };

    const getTotalDuration = () => {
        const selectedFiles = getSelectedAudioFiles();
        if (selectedFiles.length === 0) return 0;

        return selectedFiles.reduce((total, file) => {
            return total + (file.duration || audioDurations[file.id] || 0);
        }, 0);
    };

    const formatDuration = (seconds: number) => {
        if (isNaN(seconds) || seconds === 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const uploadAudioFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'audio');

        try {
            const response = await fetch(`${API_URL}/create-video/save-file`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 200) {
                return result.data.fileURL;
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleAudioEnded = (audioId: string) => {
        setIsPlaying(null);
        setCurrentPlayingAudio(null);
        setAudioProgress(prev => ({ ...prev, [audioId]: 0 }));
        setCurrentTimes(prev => ({ ...prev, [audioId]: 0 }));
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, audioId: string) => {
        const audioElement = audioRefs.current[audioId];
        if (audioElement) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const newTime = (clickX / width) * audioDurations[audioId];
            audioElement.currentTime = newTime;
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadAudio = (audioFile: AudioFile) => {
        const link = document.createElement('a');
        link.href = audioFile.url;
        link.download = audioFile.name + '.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Get current language display name
    const getLanguageDisplayName = () => {
        const languageMap = {
            'Vietnamese': 'Vietnamese',
            'English': 'English',
            'Chinese': 'Chinese'
        };
        return languageMap[selectedLanguage as keyof typeof languageMap] || selectedLanguage;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Create and Select Audio</CardTitle>
                        <CardDescription>
                            Generate voice from script ({getLanguageDisplayName()}) or upload your own audio files
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="generate" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="generate">Generate Audio</TabsTrigger>
                                <TabsTrigger value="upload">Upload File</TabsTrigger>
                                <TabsTrigger value="record">Record Audio</TabsTrigger>
                            </TabsList>

                            <TabsContent value="generate" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className={"col-span-2"}>
                                        <Label className="text-sm font-medium mb-2 block">
                                            Voice Type ({getLanguageDisplayName()})
                                        </Label>
                                        <Select
                                            value={audioData.voiceType}
                                            onValueChange={(value) => updateAudioData({ voiceType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select voice type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableVoiceTypes().map((voice) => (
                                                    <SelectItem key={voice.value} value={voice.value}>
                                                        <div className="flex items-center">
                                                            <span className="font-medium me-2">{voice.label}</span>
                                                            <span className="text-xs text-gray-500">{voice.description}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Speed</Label>
                                        <Select
                                            value={audioData.speed}
                                            onValueChange={(value) => updateAudioData({ speed: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select speed" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0.75">Slow (0.75x)</SelectItem>
                                                <SelectItem value="1.0">Normal (1.0x)</SelectItem>
                                                <SelectItem value="1.25">Fast (1.25x)</SelectItem>
                                                <SelectItem value="1.5">Very Fast (1.5x)</SelectItem>
                                                <SelectItem value="2.0">Ultra Fast (2.0x)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Content</Label>
                                    <Textarea
                                        value={audioData.customText || script}
                                        onChange={(e) => updateAudioData({ customText: e.target.value })}
                                        placeholder="Enter content to convert to speech or use the generated script"
                                        className="min-h-32"
                                    />
                                </div>

                                <Button
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                                    onClick={handleGenerateAudio}
                                    disabled={audioData.isGenerating || !audioData.voiceType}
                                >
                                    {audioData.isGenerating ? (
                                        <>
                                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            Generate Audio
                                        </>
                                    )}
                                </Button>
                            </TabsContent>

                            <TabsContent value="upload" className="space-y-6 mt-6">
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                    onClick={triggerFileUpload}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                    }}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg font-medium text-gray-600 mb-2">
                                        Drag and drop audio files here
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">Or click to select files</p>
                                    <Button variant="outline" type="button">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Select Files
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Supported: MP3, WAV, M4A (max 50MB)
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </TabsContent>

                            <TabsContent value="record" className="space-y-6 mt-6">
                                <div className="text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                                            audioData.isRecording
                                                ? 'border-red-500 bg-red-50 animate-pulse'
                                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                        }`}>
                                            <Mic className={`w-12 h-12 ${audioData.isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                                        </div>
                                    </div>

                                    {audioData.isRecording && (
                                        <div className="text-center">
                                            <div className="text-red-500 font-medium text-lg mb-2">
                                                🔴 Recording...
                                            </div>
                                            <div className="text-gray-600">
                                                {formatTime(recordingTime)}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Button
                                            onClick={handleRecording}
                                            size="lg"
                                            variant={audioData.isRecording ? "destructive" : "default"}
                                            className="px-8 py-3"
                                        >
                                            {audioData.isRecording ? (
                                                <>
                                                    <Square className="w-4 h-4 mr-2" />
                                                    Stop Recording
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-4 h-4 mr-2" />
                                                    Start Recording
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Audio Files List */}
                        {audioFiles.length > 0 && (
                            <div className="mt-8 p-6 rounded-lg border">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-semibold">Audio list ({audioFiles.length})</Label>
                                    <div className="flex gap-2">
                                        {audioFiles.length > 1 && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={selectAllAudio}
                                                >
                                                    Select all
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={deselectAllAudio}
                                                >
                                                    Unselect all
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {audioFiles.map((audioFile) => (
                                        <div key={audioFile.id} className={`p-4 rounded-lg border transition-all ${
                                            audioFile.isSelected ? 'border-blue-500 bg-neutral-800' : 'border-neutral-200'
                                        }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={audioFile.isSelected}
                                                        onChange={() => toggleAudioSelection(audioFile.id)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        disabled={uploadingFiles.has(audioFile.id)}
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-4">
                                                            <h4 className="font-medium">{audioFile.name}</h4>
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                uploadingFiles.has(audioFile.id) ? 'bg-yellow-100 text-yellow-700' :
                                                                    audioFile.type === 'generated' ? 'bg-purple-100 text-purple-700' :
                                                                        audioFile.type === 'uploaded' ? 'bg-green-100 text-green-700' :
                                                                            'bg-orange-100 text-orange-700'
                                                            }`}>
                                                                {uploadingFiles.has(audioFile.id) ? 'Đang upload...' :
                                                                    audioFile.type === 'generated' ? 'Đã tạo' :
                                                                        audioFile.type === 'uploaded' ? 'Đã tải lên' : 'Đã ghi âm'}
                                                            </span>
                                                            {uploadingFiles.has(audioFile.id) && (
                                                                <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeAudioFile(audioFile.id)}
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    disabled={uploadingFiles.has(audioFile.id)}
                                                >
                                                    <Trash />
                                                </Button>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePlayPause(audioFile.id)}
                                                >
                                                    {isPlaying === audioFile.id ? (
                                                        <Pause className="w-4 h-4" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <div
                                                    className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                                                    onClick={(e) => handleProgressClick(e, audioFile.id)}
                                                >
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                        style={{ width: `${audioProgress[audioFile.id] || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500 min-w-[100px]">
                                                    {formatTime(currentTimes[audioFile.id] || 0)} / {formatTime(audioDurations[audioFile.id] || 0)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDownloadAudio(audioFile)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <audio
                                                ref={(el) => {
                                                    if (el) {
                                                        audioRefs.current[audioFile.id] = el;
                                                    }
                                                }}
                                                src={audioFile.url}
                                                onTimeUpdate={() => handleTimeUpdate(audioFile.id)}
                                                onLoadedMetadata={() => handleLoadedMetadata(audioFile.id)}
                                                onEnded={() => handleAudioEnded(audioFile.id)}
                                                className="hidden"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {audioFiles.some(f => f.isSelected) && (
                                    <div className="mt-4 p-3 border border-blue-200 rounded-lg">
                                        <div className="flex items-center mb-2">
                                            <Check className="text-emerald-500 mr-2"/>
                                            <p>
                                                Selected {getSelectedAudioFiles().length} audio file(s)
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Total duration: {formatDuration(getTotalDuration())}</p>
                                        </div>

                                    </div>
                                )}
                            </div>

                        )}

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={getSelectedAudioFiles().length === 0}
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}