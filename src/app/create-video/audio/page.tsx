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
import { saveVideoAudioData, loadVideoAudioData } from '../_utils/videoStorage';

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
import API_URL from "@/config";

// Voice types with descriptions organized by language
const VOICE_TYPES = {
    Vietnamese: [
        { value: 'vi-VN-HoaiMyNeural', label: 'Hoài My (Nữ)', description: 'Giọng Bắc, tự nhiên, phù hợp đọc tin tức' },
        { value: 'vi-VN-NamMinhNeural', label: 'Nam Minh (Nam)', description: 'Giọng Bắc, trầm ấm' },
    ],
    English: [
        { value: 'en-US-JennyNeural', label: 'Jenny (Nữ)', description: 'Giọng Mỹ phổ thông, đa dụng' },
        { value: 'en-US-DavisNeural', label: 'Davis (Nam)', description: 'Giọng trầm, chuyên nghiệp' },
    ],
    Chinese: [
        { value: 'zh-CN-XiaoxiaoNeural', label: 'Xiaoxiao (Nữ)', description: 'Giọng nữ trẻ trung, có thể đa cảm xúc' },
        { value: 'zh-CN-YunyangNeural', label: 'Yunyang (Nam)', description: 'Giọng phát thanh viên' }
    ]
};

// Speed options
const SPEED_OPTIONS = [
    { value: '0.75', label: 'Chậm (0.75x)' },
    { value: '1.0', label: 'Bình thường (1.0x)' },
    { value: '1.25', label: 'Nhanh (1.25x)' },
    { value: '1.5', label: 'Rất nhanh (1.5x)' },
    { value: '2.0', label: 'Cực nhanh (2.0x)' }
];

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

    // Get script and language from localStorage
    const [script, setScript] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

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

    const handleContinue = () => {
        const selectedFiles = getSelectedAudioFiles();
        if (selectedFiles.length === 0) {
            alert("Vui lòng chọn ít nhất một file audio trước khi tiếp tục");
            return;
        }

        // Save audio data to localStorage
        saveVideoAudioData({
            audioFiles,
            selectedAudioFiles: selectedFiles,
            voiceType: audioData.voiceType,
            speed: audioData.speed,
            customText: audioData.customText
        });

        // Update audio data with selected files
        updateAudioData({
            recordedAudio: selectedFiles[0].url, // Use first selected for backward compatibility
        });

        router.push('/create-video/caption');
    };

    const handleBack = () => {
        router.push('/create-video/image');
    };

    const handleRecording = () => {
        if (audioData.isRecording) {
            // Stop recording and add to files list
            updateAudioData({
                isRecording: false,
                recordedAudio: null
            });
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }

            // Add recorded audio to files list
            addAudioFile({
                name: `Ghi âm ${formatTime(recordingTime)}`,
                url: 'mock-recorded-audio.mp3', // In real app, this would be the actual recording
                type: 'recorded'
            });

            setRecordingTime(0);
        } else {
            // Start recording
            updateAudioData({ isRecording: true });
            setRecordingTime(0);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
    };

    const handleGenerateAudio = async () => {
        if (!audioData.voiceType) {
            alert('Vui lòng chọn giọng đọc');
            return;
        }

        const textToConvert = audioData.customText || script;
        if (!textToConvert.trim()) {
            alert('Vui lòng nhập nội dung cần chuyển đổi');
            return;
        }

        updateAudioData({ isGenerating: true });

        try {
            const response = await fetch(`${API_URL.NEXT_PUBLIC_API_URL}/create-video/generate-audio`, {
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

            if (result.status === 200) {
                // Add generated audio to files list
                const availableVoices = getAvailableVoiceTypes();
                const selectedVoice = availableVoices.find(v => v.value === audioData.voiceType);
                addAudioFile({
                    name: `${selectedVoice?.label || 'Generated'} - ${audioData.speed}x`,
                    url: result.data.audio,
                    type: 'generated',
                    voiceType: audioData.voiceType,
                    speed: audioData.speed
                });

                updateAudioData({
                    isGenerating: false,
                    recordedAudio: null
                });
            } else {
                throw new Error(result.message || 'Lỗi khi tạo audio');
            }
        } catch (error) {
            console.error('Error generating audio:', error);
            alert('Có lỗi xảy ra khi tạo audio. Vui lòng thử lại.');
            updateAudioData({ isGenerating: false });
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Vui lòng chọn file audio hợp lệ (MP3, WAV, M4A)');
                return;
            }

            // Validate file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                alert('File không được vượt quá 50MB');
                return;
            }

            updateAudioData({
                audioFile: file,
                recordedAudio: null
            });

            // Add uploaded file to files list
            addAudioFile({
                name: file.name,
                url: URL.createObjectURL(file),
                type: 'uploaded'
            });
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
            setAudioDurations(prev => ({ ...prev, [audioId]: audioElement.duration }));
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

    useEffect(() => {
        if (audioFiles.length > 0) {
            saveVideoAudioData({
                audioFiles,
                selectedAudioFiles: getSelectedAudioFiles(),
                voiceType: audioData.voiceType,
                speed: audioData.speed,
                customText: audioData.customText
            });
        }
    }, [audioData.voiceType, audioData.speed, audioData.customText]);

    // Get current language display name
    const getLanguageDisplayName = () => {
        const languageMap = {
            'Vietnamese': 'Tiếng Việt',
            'English': 'English',
            'Chinese': '中文'
        };
        return languageMap[selectedLanguage as keyof typeof languageMap] || selectedLanguage;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Tạo và chọn âm thanh</CardTitle>
                        <CardDescription>
                            Tạo giọng đọc từ script ({getLanguageDisplayName()}) hoặc tải lên file audio của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="generate" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="generate">Tạo audio</TabsTrigger>
                                <TabsTrigger value="upload">Tải lên file</TabsTrigger>
                                <TabsTrigger value="record">Ghi âm</TabsTrigger>
                            </TabsList>

                            <TabsContent value="generate" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">
                                            Giọng đọc ({getLanguageDisplayName()})
                                        </Label>
                                        <Select
                                            value={audioData.voiceType}
                                            onValueChange={(value) => updateAudioData({ voiceType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn giọng đọc" />
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
                                        <Label className="text-sm font-medium mb-2 block">Tốc độ</Label>
                                        <Select
                                            value={audioData.speed}
                                            onValueChange={(value) => updateAudioData({ speed: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn tốc độ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SPEED_OPTIONS.map((speed) => (
                                                    <SelectItem key={speed.value} value={speed.value}>
                                                        {speed.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Nội dung</Label>
                                    <Textarea
                                        value={audioData.customText || script}
                                        onChange={(e) => updateAudioData({ customText: e.target.value })}
                                        placeholder="Nhập nội dung cần chuyển đổi thành giọng nói hoặc sử dụng script đã tạo"
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
                                            Đang tạo...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            Tạo audio
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
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                        const files = e.dataTransfer.files;
                                        if (files.length > 0) {
                                            const event = { target: { files } } as never;
                                            handleFileUpload(event);
                                        }
                                    }}
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg font-medium text-gray-600 mb-2">
                                        Kéo thả file audio vào đây
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">Hoặc nhấp để chọn file</p>
                                    <Button variant="outline" type="button">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Chọn file
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Hỗ trợ: MP3, WAV, M4A (tối đa 50MB)
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                {audioData.audioFile && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                        <Check className={"text-emerald-500 me-2"}/>
                                        <p className="text-green-600">
                                            Đã tải lên: {audioData.audioFile.name}
                                        </p>
                                    </div>
                                )}
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
                                                🔴 Đang ghi âm...
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
                                                    Dừng ghi âm
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-4 h-4 mr-2" />
                                                    Bắt đầu ghi âm
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
                                    <Label className="text-lg font-semibold">Danh sách Audio ({audioFiles.length})</Label>
                                    <div className="flex gap-2">
                                        {audioFiles.length > 1 && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={selectAllAudio}
                                                >
                                                    Chọn tất cả
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={deselectAllAudio}
                                                >
                                                    Bỏ chọn tất cả
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
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-4">
                                                            <h4 className="font-medium">{audioFile.name}</h4>
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                audioFile.type === 'generated' ? 'bg-purple-100 text-purple-700' :
                                                                    audioFile.type === 'uploaded' ? 'bg-green-100 text-green-700' :
                                                                        'bg-orange-100 text-orange-700'
                                                            }`}>
                                                                {audioFile.type === 'generated' ? 'Đã tạo' :
                                                                    audioFile.type === 'uploaded' ? 'Đã tải lên' : 'Đã ghi âm'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeAudioFile(audioFile.id)}
                                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
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
                                    <div className="mt-4 p-3 border border-blue-200 rounded-lg flex items-center">
                                        <Check className={"text-emerald-500"}/>
                                        <p className="ms-2">
                                            Đã chọn {getSelectedAudioFiles().length} file audio
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={getSelectedAudioFiles().length === 0}
                            >
                                Tiếp tục
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}