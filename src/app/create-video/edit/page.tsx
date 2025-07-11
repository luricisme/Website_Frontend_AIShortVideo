"use client"

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import {ArrowLeft, ArrowRight, GripVertical, Pause, Play, Trash2} from 'lucide-react';
import {
    loadVideoAudioData,
    loadVideoCaptionData,
    loadVideoImageData,
    loadVideoScriptData,
    saveVideoScriptData,
    saveVideoImageData,
    saveVideoAudioData,
    saveVideoCaptionData
} from "@/app/create-video/_utils/videoStorage";
import { VideoData } from '@/app/create-video/_types/video';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Image from "next/image";
import VideoComposition from "@/app/create-video/_components/VideoComposition";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export default function VideoEditor() {
    const [videoData, setVideoData] = useState<VideoData>();
    const [isLoading, setIsLoading] = useState(true);
    const [draggedAudio, setDraggedAudio] = useState();
    const [playingAudio, setPlayingAudio] = useState();
    const [currentAudio, setCurrentAudio] = useState();
    // const [audioToDelete, setAudioToDelete] = useState(null);
    const router = useRouter();
    // Tính toán durationInFrames từ totalDuration
    const fps = 120;
    const totalDuration = videoData?.videoAudioData?.totalDuration || 30; // Default 30 giây
    const durationInFrames = Math.ceil(totalDuration * fps);

    // Load dữ liệu từ localStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                const scriptData = loadVideoScriptData();
                const imageData = loadVideoImageData();
                const audioData = loadVideoAudioData();
                const captionData = loadVideoCaptionData();

                if (!scriptData || !imageData) {
                    throw new Error('Required video data not found');
                }

                const combinedData = {
                    videoScriptData: scriptData,
                    videoImageData: imageData,
                    videoAudioData: audioData || { selectedAudioFiles: [] },
                    videoCaptionData: captionData || {
                        style: "classic",
                        position: "center",
                        fontSize: "large",
                        color: "#000000",
                        background: false,
                        fontFamily: ''
                    }
                };

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setVideoData(combinedData);
            } catch (err) {
                console.error('Error loading video data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleImageReorder = (dragIndex: number, dropIndex: number) => {
        if (!videoData) return;

        const newSelectedImages = [...videoData.videoImageData.selectedImages];
        const draggedImage = newSelectedImages[dragIndex];
        newSelectedImages.splice(dragIndex, 1);
        newSelectedImages.splice(dropIndex, 0, draggedImage);

        const newImageData = {
            ...videoData.videoImageData,
            selectedImages: newSelectedImages
        };

        // Cập nhật state
        setVideoData(prev => ({
            ...prev!,
            videoImageData: newImageData
        }));

        // Lưu vào localStorage
        saveVideoImageData(newImageData);
    };

    // Cập nhật function handleRemoveImage
    const handleRemoveImage = (imageId: number) => {
        if (!videoData) return;

        const newSelectedImages = videoData.videoImageData.selectedImages.filter(id => id !== imageId);

        const newImageData = {
            ...videoData.videoImageData,
            selectedImages: newSelectedImages
        };

        // Cập nhật state
        setVideoData(prev => ({
            ...prev!,
            videoImageData: newImageData
        }));

        // Lưu vào localStorage
        saveVideoImageData(newImageData);
    };

// Cập nhật function handleAddImage
    const handleAddImage = (imageId: number) => {
        if (!videoData) return;

        if (!videoData.videoImageData.selectedImages.includes(imageId)) {
            const newSelectedImages = [...videoData.videoImageData.selectedImages, imageId];

            const newImageData = {
                ...videoData.videoImageData,
                selectedImages: newSelectedImages
            };

            // Cập nhật state
            setVideoData(prev => ({
                ...prev!,
                videoImageData: newImageData
            }));

            // Lưu vào localStorage
            saveVideoImageData(newImageData);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center">
                <div className="text-white text-xl">Loading video editor...</div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center">
                <div className="text-red-400 text-xl">Failed to load video data</div>
            </div>
        );
    }

    const selectedImages = videoData.videoImageData.selectedImages.map(id =>
        videoData.videoImageData.generatedImages.find(img => img.id === id)
    ).filter(Boolean);

    const unselectedImages = videoData.videoImageData.generatedImages.filter(img =>
        !videoData.videoImageData.selectedImages.includes(img.id)
    );

    const handleScriptChange = (value: string) => {
        if (!videoData) return;

        const newScriptData = {
            ...videoData.videoScriptData,
            script: value
        };

        // Cập nhật state
        setVideoData(prev => ({
            ...prev!,
            videoScriptData: newScriptData
        }));

        // Lưu vào localStorage
        saveVideoScriptData(newScriptData);
    };

    const handleCaptionChange = (field: string, value: never) => {
        if (!videoData) return;

        const newCaptionData = {
            ...videoData.videoCaptionData,
            [field]: value
        };

        // Nếu thay đổi style thì cập nhật fontFamily tương ứng
        if (field === 'style') {
            const getFontFamily = (style: string) => {
                switch (style) {
                    case 'modern':
                        return 'Roboto, system-ui, sans-serif';
                    case 'classic':
                        return 'Montserrat SemiBold, sans-serif';
                    case 'minimal':
                        return 'OpenSans Bold, sans-serif';
                    case 'elegant':
                        return 'Didact Gothic, serif';
                    default:
                        return 'Roboto, system-ui, sans-serif';
                }
            };

            newCaptionData.fontFamily = getFontFamily(value);
        }

        // Cập nhật state
        setVideoData(prev => ({
            ...prev!,
            videoCaptionData: newCaptionData
        }));

        // Lưu vào localStorage
        saveVideoCaptionData(newCaptionData);
    };

    // Cập nhật audioData và lưu vào localStorage
    const updateAudioData = (newAudioData: {
        selectedAudioFiles: {
            id?: string;
            name: string;
            url: string;
            type: "generated" | "uploaded" | "recorded";
            voiceType?: string;
            speed?: string;
            duration: number;
            isSelected?: boolean
        }[];
        audioFiles: Array<{
            id: string;
            name: string;
            url: string;
            type: "generated" | "uploaded" | "recorded";
            voiceType?: string;
            speed?: string;
            duration: number;
            isSelected: boolean
        }>;
        totalDuration?: number;
        voiceType?: string;
        speed?: string;
        customText?: string
    }) => {
        const updatedVideoData = {
            ...videoData,
            videoAudioData: newAudioData
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setVideoData(updatedVideoData);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        saveVideoAudioData(newAudioData);
    };

    // Toggle select/deselect audio
    const handleToggleSelect = (audioId: string) => {
        const audioData = videoData.videoAudioData;
        const targetAudio = audioData.audioFiles.find(audio => audio.id === audioId);

        if (!targetAudio) return;

        let newSelectedAudioFiles = [...audioData.selectedAudioFiles];
        const isCurrentlySelected = newSelectedAudioFiles.some(audio => audio.id === audioId);

        if (isCurrentlySelected) {
            // Deselect
            newSelectedAudioFiles = newSelectedAudioFiles.filter(audio => audio.id !== audioId);
        } else {
            // Select
            newSelectedAudioFiles.push(targetAudio);
        }

        // Tính lại totalDuration
        const newTotalDuration = newSelectedAudioFiles.reduce((sum, audio) => sum + audio.duration, 0);

        const newAudioData = {
            ...audioData,
            selectedAudioFiles: newSelectedAudioFiles,
            totalDuration: newTotalDuration
        };

        updateAudioData(newAudioData);
    };

    // Xóa audio
    const handleRemoveAudio = (audioId: string | undefined) => {
        const audioData = videoData.videoAudioData;

        const newAudioFiles = audioData.audioFiles.filter(audio => audio.id !== audioId);
        const newSelectedAudioFiles = audioData.selectedAudioFiles.filter(audio => audio.id !== audioId);

        // Tính lại totalDuration
        const newTotalDuration = newSelectedAudioFiles.reduce((sum, audio) => sum + audio.duration, 0);

        const newAudioData = {
            ...audioData,
            audioFiles: newAudioFiles,
            selectedAudioFiles: newSelectedAudioFiles,
            totalDuration: newTotalDuration
        };

        updateAudioData(newAudioData);
        // setAudioToDelete(null);
    };

    // Play/Pause audio
    const handlePlayAudio = (audio: { id: number; name?: string; url: string; type?: "generated" | "uploaded" | "recorded"; voiceType?: string | undefined; speed?: string | undefined; duration?: number | undefined; isSelected?: boolean | undefined; }) => {
        if (playingAudio === audio.id) {
            // Pause
            if (currentAudio) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                currentAudio.pause();
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPlayingAudio(null);
        } else {
            // Play
            if (currentAudio) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                currentAudio.pause();
            }

            const audioElement = new Audio(audio.url);
            audioElement.play();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setCurrentAudio(audioElement);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPlayingAudio(audio.id);

            audioElement.onended = () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setPlayingAudio(null);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setCurrentAudio(null);
            };
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, audio: React.SetStateAction<undefined>) => {
        setDraggedAudio(audio);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetAudio: { id: number; name?: string; url?: string; type?: "generated" | "uploaded" | "recorded"; voiceType?: string | undefined; speed?: string | undefined; duration?: number; isSelected?: boolean | undefined; }) => {
        e.preventDefault();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (!draggedAudio || draggedAudio.id === targetAudio.id) return;

        const audioData = videoData.videoAudioData;
        const newSelectedAudioFiles = [...audioData.selectedAudioFiles];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const draggedIndex = newSelectedAudioFiles.findIndex(audio => audio.id === draggedAudio.id);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const targetIndex = newSelectedAudioFiles.findIndex(audio => audio.id === targetAudio.id);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Swap positions
            [newSelectedAudioFiles[draggedIndex], newSelectedAudioFiles[targetIndex]] =
                [newSelectedAudioFiles[targetIndex], newSelectedAudioFiles[draggedIndex]];

            const newAudioData = {
                ...audioData,
                selectedAudioFiles: newSelectedAudioFiles
            };

            updateAudioData(newAudioData);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setDraggedAudio(null);
    };

    const handleContinue = () => {
        router.push('/create-video/export');
    };

    const handleBack = () => {
        router.push('/create-video/preview');
    };

    const audioData = videoData.videoAudioData;
    const selectedAudioIds = audioData.selectedAudioFiles.map(audio => audio.id);
    const availableAudioFiles = audioData.audioFiles.filter(audio => !selectedAudioIds.includes(audio.id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant={"outline"}
                            onClick={handleBack}
                        >
                            <ArrowLeft size={24} />
                            Preview
                        </Button>
                        <h1 className="text-2xl font-bold text-white"></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            onClick={handleContinue}
                        >
                            Export
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Video Preview */}
                    <div className="lg:col-span-3">
                        <div className="bg-neutral-900 rounded-lg p-4">
                            <div className="aspect-video bg-black rounded-lg h-200 w-full overflow-hidden">
                                <Player
                                    component={VideoComposition}
                                    inputProps={{ videoData }}
                                    durationInFrames={durationInFrames}
                                    compositionWidth={540}
                                    compositionHeight={960}
                                    fps={fps}
                                    style={{ width: '100%', height: '100%' }}
                                    controls
                                    loop
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <div className={"space-y-6"}>
                            <Tabs defaultValue="images" className="w-full">
                                <TabsList className="bg-neutral-900 grid w-full grid-cols-4">
                                    <TabsTrigger value="images">Images</TabsTrigger>
                                    <TabsTrigger value={"scripts"}>Scripts</TabsTrigger>
                                    <TabsTrigger value="audio">Audio</TabsTrigger>
                                    <TabsTrigger value="captions">Caption</TabsTrigger>
                                </TabsList>

                                <TabsContent value="images">
                                    <div className="bg-neutral-900 rounded-lg p-4">
                                        <h3 className="text-white font-medium mb-3">Selected Images ({selectedImages.length})</h3>
                                        <div className="grid grid-cols-3 gap-4 overflow-x-auto pb-2">
                                            {selectedImages.map((image, index) => (
                                                <div
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-expect-error
                                                    key={image.id}
                                                    className="relative flex-shrink-0 group"
                                                    draggable
                                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                                        handleImageReorder(dragIndex, index);
                                                    }}
                                                >
                                                    <Image
                                                        width={150}
                                                        height={200}
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        src={image.url}
                                                        alt={`Image ${index + 1}`}
                                                        className="object-cover rounded cursor-move"
                                                    />
                                                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                        {index + 1}
                                                    </div>
                                                    <Button
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        onClick={() => handleRemoveImage(image.id)}
                                                        className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-neutral-900 rounded-lg mt-4">
                                            <h3 className="text-white font-medium mb-3">Available Images ({unselectedImages.length})</h3>
                                            <div className="grid grid-cols-3 gap-4 overflow-y-auto">
                                                {unselectedImages.map((image) => (
                                                    <div
                                                        key={image.id}
                                                        className="flex justify-center group cursor-pointer"
                                                        onClick={() => handleAddImage(image.id)}
                                                    >
                                                        <Image
                                                            width={150}
                                                            height={200}
                                                            src={image.url}
                                                            alt={image.prompt}
                                                            className="object-cover rounded hover:opacity-75 transition-opacity"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="audio">
                                    <div className="space-y-4">
                                        {/* Selected Audio Section */}
                                        <div className="bg-neutral-900 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-white font-medium text-lg">Selected Audio ({audioData.selectedAudioFiles.length})</h3>
                                                <div className="text-sm text-neutral-400">
                                                    Total Duration: {Math.floor(audioData.totalDuration / 60)}:{Math.floor(audioData.totalDuration % 60).toString().padStart(2, '0')}
                                                </div>
                                            </div>

                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {audioData.selectedAudioFiles.length === 0 ? (
                                                    <div className="text-center py-8 text-neutral-500">
                                                        No audio selected. Select from available audio files.
                                                    </div>
                                                ) : (
                                                    audioData.selectedAudioFiles.map((audio, index) => (
                                                        <div
                                                            key={audio.id}
                                                            draggable
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-expect-error
                                                            onDragStart={(e) => handleDragStart(e, audio)}
                                                            onDragOver={handleDragOver}
                                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                            // @ts-expect-error
                                                            onDrop={(e) => handleDrop(e, audio)}
                                                            className="border border-blue-500 bg-blue-900/20 rounded-lg p-4 cursor-move hover:bg-blue-900/30 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <GripVertical className="w-4 h-4 text-neutral-400" />
                                                                    <div className="flex items-center space-x-2">
                                                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                                {index + 1}
                                                            </span>
                                                                        <div>
                                                                            <h4 className="font-medium text-white">{audio.name}</h4>
                                                                            <div className="text-sm text-neutral-400">
                                                                                {Math.floor(audio.duration / 60)}:{Math.floor(audio.duration % 60).toString().padStart(2, '0')} | {audio.voiceType} | {audio.speed}x
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                        // @ts-expect-error
                                                                        onClick={() => handlePlayAudio(audio)}
                                                                        className="text-neutral-300 hover:text-white"
                                                                    >
                                                                        {playingAudio === audio.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                        // @ts-expect-error
                                                                        onClick={() => handleToggleSelect(audio.id)}
                                                                        className="text-red-400 hover:text-red-300"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Available Audio Section */}
                                        <div className="bg-neutral-900 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-white font-medium text-lg">Available Audio ({availableAudioFiles.length})</h3>
                                            </div>

                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {availableAudioFiles.length === 0 ? (
                                                    <div className="text-center py-8 text-neutral-500">
                                                        {audioData.audioFiles.length === 0
                                                            ? "No audio files available. Generate or upload audio files first."
                                                            : "All audio files are already selected."
                                                        }
                                                    </div>
                                                ) : (
                                                    availableAudioFiles.map((audio) => (
                                                        <div
                                                            key={audio.id}
                                                            className="border border-neutral-700 bg-neutral-800 hover:bg-neutral-750 rounded-lg p-4 transition-all duration-200"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-white">{audio.name}</h4>
                                                                    <div className="text-sm text-neutral-400 mt-1">
                                                                        {Math.floor(audio.duration / 60)}:{Math.floor(audio.duration % 60).toString().padStart(2, '0')} | {audio.voiceType} | {audio.speed}x
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                        // @ts-expect-error
                                                                        onClick={() => handlePlayAudio(audio)}
                                                                        className="text-neutral-300 hover:text-white"
                                                                    >
                                                                        {playingAudio === audio.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => handleToggleSelect(audio.id)}
                                                                        className="text-neutral-400 hover:text-white"
                                                                    >
                                                                        Select
                                                                    </Button>

                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                // onClick={() => setAudioToDelete(audio)}
                                                                                className="text-red-400 hover:text-red-300"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Audio File</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are you sure you want to delete &#39;{audio.name}&#39;? This action cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleRemoveAudio(audio.id)}
                                                                                    className="bg-red-600 hover:bg-red-700"
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value={"captions"}>
                                    <div className="bg-neutral-900 rounded-lg p-4">
                                        <h3 className="text-white font-medium mb-3">Caption Settings</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={"w-3/4"}>
                                                <Label className="text-neutral-300 text-sm block mb-2">Style</Label>
                                                <Select
                                                    value={videoData.videoCaptionData?.style || 'modern'}
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-expect-error
                                                    onValueChange={(value) => handleCaptionChange('style', value)}
                                                >
                                                    <SelectTrigger className="w-full bg-neutral-700 text-white border-neutral-600">
                                                        <SelectValue placeholder="Select style" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="modern">Modern (Sans-serif)</SelectItem>
                                                        <SelectItem value="classic">Classic (Serif)</SelectItem>
                                                        <SelectItem value="minimal">Minimal (Monospace)</SelectItem>
                                                        <SelectItem value="elegant">Elegant (Serif)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className={"w-3/4"}>
                                                <Label className="text-neutral-300 text-sm block mb-2">Position</Label>
                                                <Select
                                                    value={videoData.videoCaptionData?.position || 'center'}
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-expect-error
                                                    onValueChange={(value) => handleCaptionChange('position', value)}
                                                >
                                                    <SelectTrigger className="w-full bg-neutral-700 text-white border-neutral-600">
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="top">Top</SelectItem>
                                                        <SelectItem value="center">Center</SelectItem>
                                                        <SelectItem value="bottom">Bottom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className={"w-3/4"}>
                                                <Label className="text-neutral-300 text-sm block mb-2">Font Size</Label>
                                                <Select
                                                    value={videoData.videoCaptionData?.fontSize || 'medium'}
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-expect-error
                                                    onValueChange={(value) => handleCaptionChange('fontSize', value)}
                                                >
                                                    <SelectTrigger className="w-full bg-neutral-700 text-white border-neutral-600">
                                                        <SelectValue placeholder="Select font size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="small">Small</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="large">Large</SelectItem>
                                                        <SelectItem value="extra-large">Extra large</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label className="text-neutral-300 text-sm block mb-2">Color</Label>
                                                <input
                                                    type="color"
                                                    value={videoData.videoCaptionData?.color || '#000000'}
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-expect-error
                                                    onChange={(e) => handleCaptionChange('color', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 border-neutral-300 cursor-pointer hover:border-neutral-400 transition-colors"
                                                />
                                            </div>
                                            {/*<div className="flex items-center gap-2">*/}
                                            {/*    <input*/}
                                            {/*        type="checkbox"*/}
                                            {/*        checked={videoData.videoCaptionData?.background || false}*/}
                                            {/*        onChange={(e) => handleCaptionChange('background', e.target.checked)}*/}
                                            {/*        className="rounded"*/}
                                            {/*    />*/}
                                            {/*    <Label className="text-neutral-300 text-sm">Background</Label>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value={"scripts"}>
                                    <div className="bg-neutral-900 rounded-lg p-4">
                                        <Label className="text-white font-medium mb-3">Script</Label>
                                        <Textarea
                                            className={"min-h-50"}
                                            value={videoData.videoScriptData?.script}
                                            onChange={(e) => handleScriptChange(e.target.value)}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};