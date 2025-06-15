'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, Mic, Pause, Play, Upload, Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AudioData } from '../_types/video';
import StepNavigation from '../_components/StepNavigation';
import { useVideoCreation } from '../_context/VideoCreationContext';

// Mock script data - in real app, this would come from previous step or API
const generatedScript = `Chào mừng các bạn đến với chủ đề "AI trong giáo dục". 
Trong video hôm nay, chúng ta sẽ cùng nhau khám phá những điều thú vị về AI trong giáo dục. Dựa trên những thông tin được thu thập từ Wikipedia, chúng tôi sẽ mang đến cho bạn những kiến thức bổ ích và dễ hiểu.
Chúng ta sẽ cùng nhau trải qua một hành trình đầy cảm xúc và học hỏi.
Hãy cùng bắt đầu cuộc hành trình khám phá nhé!`;

export default function AudioPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(30);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize audioData with default values if not present
    const audioData = state.audioData || {
        voiceType: '',
        speed: 'normal',
        customText: '',
        audioFile: null,
        isRecording: false,
        recordedAudio: null,
        isGenerating: false
    };

    const updateAudioData = (updates: Partial<AudioData>) => {
        dispatch({
            type: 'SET_AUDIO_DATA',
            payload: updates
        });
    };

    const handleContinue = () => {
        router.push('/create-video/caption');
    };

    const handleBack = () => {
        router.push('/create-video/image');
    };

    const handleRecording = () => {
        if (audioData.isRecording) {
            // Stop recording
            updateAudioData({
                isRecording: false,
                recordedAudio: 'mock-recorded-audio.mp3'
            });
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }
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

    const handleGenerateAudio = () => {
        updateAudioData({ isGenerating: true });

        // Simulate API call
        setTimeout(() => {
            updateAudioData({
                isGenerating: false,
                recordedAudio: 'generated-audio.mp3'
            });
        }, 3000);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid audio file (MP3, WAV, M4A)');
                return;
            }

            // Validate file size (50MB max)
            if (file.size > 50 * 1024 * 1024) {
                alert('File must not exceed 50MB');
                return;
            }

            updateAudioData({
                audioFile: file,
                recordedAudio: URL.createObjectURL(file)
            });
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Generate and select sounds</CardTitle>
                        <CardDescription>
                            Generate voiceover from script or upload your own audio files
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="generate" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="generate">Generate audio</TabsTrigger>
                                <TabsTrigger value="upload">Upload file</TabsTrigger>
                                <TabsTrigger value="record">Record</TabsTrigger>
                            </TabsList>

                            <TabsContent value="generate" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Voice type</Label>
                                        <Select
                                            value={audioData.voiceType}
                                            onValueChange={(value) => updateAudioData({ voiceType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select voice type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="female-young">Female - Young</SelectItem>
                                                <SelectItem value="female-mature">Female - Mature</SelectItem>
                                                <SelectItem value="male-young">Male - Young</SelectItem>
                                                <SelectItem value="male-mature">Male - Mature</SelectItem>
                                                <SelectItem value="child">Child</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Speed</Label>
                                        <Select
                                            value={audioData.speed || 'normal'}
                                            onValueChange={(value) => updateAudioData({ speed: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select speed" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="slow">Slow</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="fast">Fast</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Content</Label>
                                    <Textarea
                                        value={audioData.customText || generatedScript}
                                        onChange={(e) => updateAudioData({ customText: e.target.value })}
                                        placeholder="Enter the text you want to convert to speech or use a created script"
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
                                            Generate audio
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
                                            const event = { target: { files } } as any;
                                            handleFileUpload(event);
                                        }
                                    }}
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg font-medium text-gray-600 mb-2">
                                        Drag and drop audio files here
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">Or click to select file</p>
                                    <Button variant="outline" type="button">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Select file
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Support: MP3, WAV, M4A (maximum 50MB)
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
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-600">
                                            ✅ Uploaded: {audioData.audioFile.name}
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
                                                    Stop recording
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="w-4 h-4 mr-2" />
                                                    Start recording
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Audio Preview Section */}
                        {audioData.recordedAudio && (
                            <div className="mt-8 p-6 rounded-lg border bg-gray-50">
                                <Label className="text-lg font-semibold mb-4 block">Audio Preview</Label>
                                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handlePlayPause}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-4 h-4" />
                                        ) : (
                                            <Play className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                            style={{ width: `${audioProgress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 min-w-[60px]">0:15 / 0:45</span>
                                    <Button size="sm" variant="outline">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!audioData.recordedAudio && !audioData.customText}
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