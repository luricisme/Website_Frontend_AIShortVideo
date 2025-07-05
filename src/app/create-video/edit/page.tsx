// "use client"
//
// import React, { useState, useEffect } from 'react';
// import { Player } from '@remotion/player';
// import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
// import {
//     loadVideoAudioData,
//     loadVideoCaptionData,
//     loadVideoImageData,
//     loadVideoScriptData
// } from "@/app/create-video/_utils/videoStorage";
// import { VideoData } from '@/app/create-video/_types/video';
// import {Button} from "@/components/ui/button";
// import {useRouter} from "next/navigation";
// import Image from "next/image";
// import VideoComposition from "@/app/create-video/_components/VideoComposition";

export default function VideoEditor() {
    // const [videoData, setVideoData] = useState<VideoData | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    // const [selectedAssetType, setSelectedAssetType] = useState<'images' | 'audio' | 'captions'>('images');
    // const router = useRouter();
    // // Tính toán durationInFrames từ totalDuration
    // const fps = 60;
    // const totalDuration = videoData?.videoAudioData?.totalDuration || 30; // Default 30 giây
    // const durationInFrames = Math.ceil(totalDuration * fps);
    //
    // // Load dữ liệu từ localStorage
    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             setIsLoading(true);
    //
    //             const scriptData = loadVideoScriptData();
    //             const imageData = loadVideoImageData();
    //             const audioData = loadVideoAudioData();
    //             const captionData = loadVideoCaptionData();
    //
    //             if (!scriptData || !imageData) {
    //                 throw new Error('Required video data not found');
    //             }
    //
    //             const combinedData = {
    //                 videoScriptData: scriptData,
    //                 videoImageData: imageData,
    //                 videoAudioData: audioData || { selectedAudioFiles: [] },
    //                 videoCaptionData: captionData || {
    //                     style: "classic",
    //                     position: "center",
    //                     fontSize: "large",
    //                     color: "#cdab8f",
    //                     background: false,
    //                     fontFamily: ''
    //                 }
    //             };
    //
    //             setVideoData(combinedData);
    //         } catch (err) {
    //             console.error('Error loading video data:', err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //
    //     loadData();
    // }, []);
    //
    // const handleImageReorder = (dragIndex: number, dropIndex: number) => {
    //     if (!videoData) return;
    //
    //     const newSelectedImages = [...videoData.videoImageData.selectedImages];
    //     const draggedImage = newSelectedImages[dragIndex];
    //     newSelectedImages.splice(dragIndex, 1);
    //     newSelectedImages.splice(dropIndex, 0, draggedImage);
    //
    //     setVideoData(prev => ({
    //         ...prev!,
    //         videoImageData: {
    //             ...prev!.videoImageData,
    //             selectedImages: newSelectedImages
    //         }
    //     }));
    // };
    //
    // const handleRemoveImage = (imageId: string) => {
    //     if (!videoData) return;
    //
    //     const newSelectedImages = videoData.videoImageData.selectedImages.filter(id => id !== imageId);
    //
    //     setVideoData(prev => ({
    //         ...prev!,
    //         videoImageData: {
    //             ...prev!.videoImageData,
    //             selectedImages: newSelectedImages
    //         }
    //     }));
    // };
    //
    // const handleAddImage = (imageId: string) => {
    //     if (!videoData) return;
    //
    //     if (!videoData.videoImageData.selectedImages.includes(imageId)) {
    //         setVideoData(prev => ({
    //             ...prev!,
    //             videoImageData: {
    //                 ...prev!.videoImageData,
    //                 selectedImages: [...prev!.videoImageData.selectedImages, imageId]
    //             }
    //         }));
    //     }
    // };
    //
    // const handleCaptionChange = (field: string, value: any) => {
    //     if (!videoData) return;
    //
    //     setVideoData(prev => ({
    //         ...prev!,
    //         videoCaptionData: {
    //             ...prev!.videoCaptionData,
    //             [field]: value
    //         }
    //     }));
    // };
    //
    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center">
    //             <div className="text-white text-xl">Loading video editor...</div>
    //         </div>
    //     );
    // }
    //
    // if (!videoData) {
    //     return (
    //         <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex items-center justify-center">
    //             <div className="text-red-400 text-xl">Failed to load video data</div>
    //         </div>
    //     );
    // }
    //
    // const selectedImages = videoData.videoImageData.selectedImages.map(id =>
    //     videoData.videoImageData.generatedImages.find(img => img.id === id)
    // ).filter(Boolean);
    //
    // const unselectedImages = videoData.videoImageData.generatedImages.filter(img =>
    //     !videoData.videoImageData.selectedImages.includes(img.id)
    // );
    //
    // const handleContinue = () => {
    //     router.push('/create-video/export');
    // };
    //
    // const handleBack = () => {
    //     router.push('/create-video/preview');
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-6">
            {/*<div className="max-w-7xl mx-auto">*/}
            {/*    /!* Header *!/*/}
            {/*    <div className="flex items-center justify-between mb-6">*/}
            {/*        <div className="flex items-center gap-4">*/}
            {/*            <Button*/}
            {/*                variant={"outline"}*/}
            {/*                onClick={handleBack}*/}
            {/*            >*/}
            {/*                <ArrowLeft size={24} />*/}
            {/*                Preview*/}
            {/*            </Button>*/}
            {/*            <h1 className="text-2xl font-bold text-white"></h1>*/}
            {/*        </div>*/}
            {/*        <div className="flex items-center gap-3">*/}
            {/*            <Button*/}
            {/*                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"*/}
            {/*                onClick={handleContinue}*/}
            {/*            >*/}
            {/*                Export*/}
            {/*                <ArrowRight size={16} />*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">*/}
            {/*        /!* Video Preview *!/*/}
            {/*        <div className="lg:col-span-3">*/}
            {/*            <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                <div className="aspect-video bg-black rounded-lg h-200 w-full overflow-hidden">*/}
            {/*                    <Player*/}
            {/*                        component={VideoComposition}*/}
            {/*                        inputProps={{ videoData }}*/}
            {/*                        durationInFrames={durationInFrames}*/}
            {/*                        compositionWidth={540}*/}
            {/*                        compositionHeight={960}*/}
            {/*                        fps={60}*/}
            {/*                        style={{ width: '100%', height: '100%' }}*/}
            {/*                        controls*/}
            {/*                        loop*/}
            {/*                    />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="space-y-4 lg:col-span-2">*/}
            {/*            <div className={"space-y-6"}>*/}
            {/*                /!* Asset Type Selector *!/*/}
            {/*                <div className="flex gap-2 mb-4">*/}
            {/*                    {(['images', 'audio', 'captions'] as const).map((type) => (*/}
            {/*                        <Button*/}
            {/*                            key={type}*/}
            {/*                            onClick={() => setSelectedAssetType(type)}*/}
            {/*                            className={`px-4 py-2 rounded-lg transition-colors capitalize ${*/}
            {/*                                selectedAssetType === type*/}
            {/*                                    ? 'bg-blue-600 text-white'*/}
            {/*                                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'*/}
            {/*                            }`}*/}
            {/*                        >*/}
            {/*                            {type}*/}
            {/*                        </Button>*/}
            {/*                    ))}*/}
            {/*                </div>*/}

            {/*                /!* Selected Images Timeline *!/*/}
            {/*                {selectedAssetType === 'images' && (*/}
            {/*                    <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                        <h3 className="text-white font-medium mb-3">Selected Images ({selectedImages.length})</h3>*/}
            {/*                        <div className="grid grid-cols-3 gap-4 overflow-x-auto pb-2">*/}
            {/*                            {selectedImages.map((image, index) => (*/}
            {/*                                <div*/}
            {/*                                    key={image.id}*/}
            {/*                                    className="relative flex-shrink-0 group"*/}
            {/*                                    draggable*/}
            {/*                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}*/}
            {/*                                    onDragOver={(e) => e.preventDefault()}*/}
            {/*                                    onDrop={(e) => {*/}
            {/*                                        e.preventDefault();*/}
            {/*                                        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));*/}
            {/*                                        handleImageReorder(dragIndex, index);*/}
            {/*                                    }}*/}
            {/*                                >*/}
            {/*                                    <Image*/}
            {/*                                        width={150}*/}
            {/*                                        height={200}*/}
            {/*                                        src={image.url}*/}
            {/*                                        alt={`Image ${index + 1}`}*/}
            {/*                                        className="object-cover rounded cursor-move"*/}
            {/*                                    />*/}
            {/*                                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">*/}
            {/*                                        {index + 1}*/}
            {/*                                    </div>*/}
            {/*                                    <Button*/}
            {/*                                        onClick={() => handleRemoveImage(image.id)}*/}
            {/*                                        className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"*/}
            {/*                                    >*/}
            {/*                                        <Trash2 size={12} />*/}
            {/*                                    </Button>*/}
            {/*                                </div>*/}
            {/*                            ))}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            </div>*/}

            {/*            /!* Asset Panel *!/*/}
            {/*            <div className="space-y-4">*/}
            {/*                {selectedAssetType === 'images' && (*/}
            {/*                    <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                        <h3 className="text-white font-medium mb-3">Available Images ({unselectedImages.length})</h3>*/}
            {/*                        <div className="grid grid-cols-3 gap-4 overflow-y-auto">*/}
            {/*                            {unselectedImages.map((image) => (*/}
            {/*                                <div*/}
            {/*                                    key={image.id}*/}
            {/*                                    className="flex justify-center group cursor-pointer"*/}
            {/*                                    onClick={() => handleAddImage(image.id)}*/}
            {/*                                >*/}
            {/*                                    <Image*/}
            {/*                                        width={150}*/}
            {/*                                        height={200}*/}
            {/*                                        src={image.url}*/}
            {/*                                        alt={image.prompt}*/}
            {/*                                        className="object-cover rounded hover:opacity-75 transition-opacity"*/}
            {/*                                    />*/}
            {/*                                </div>*/}
            {/*                            ))}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                )}*/}

            {/*                {selectedAssetType === 'audio' && (*/}
            {/*                    <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                        <h3 className="text-white font-medium mb-3">Audio Settings</h3>*/}
            {/*                        <div className="space-y-3">*/}
            {/*                            <div>*/}
            {/*                                <label className="text-neutral-300 text-sm">Voice Type</label>*/}
            {/*                                <div className="text-white">*/}
            {/*                                    {videoData.videoAudioData?.selectedAudioFiles?.[0]?.voiceType || 'Default'}*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <label className="text-neutral-300 text-sm">Speed</label>*/}
            {/*                                <div className="text-white">*/}
            {/*                                    {videoData.videoAudioData?.selectedAudioFiles?.[0]?.speed || '1.0'}x*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                )}*/}

            {/*                {selectedAssetType === 'captions' && (*/}
            {/*                    <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                        <h3 className="text-white font-medium mb-3">Caption Settings</h3>*/}
            {/*                        <div className="space-y-4">*/}
            {/*                            <div>*/}
            {/*                                <label className="text-neutral-300 text-sm block mb-2">Position</label>*/}
            {/*                                <select*/}
            {/*                                    value={videoData.videoCaptionData?.position || 'center'}*/}
            {/*                                    onChange={(e) => handleCaptionChange('position', e.target.value)}*/}
            {/*                                    className="w-full bg-neutral-700 text-white p-2 rounded"*/}
            {/*                                >*/}
            {/*                                    <option value="top">Top</option>*/}
            {/*                                    <option value="center">Center</option>*/}
            {/*                                    <option value="bottom">Bottom</option>*/}
            {/*                                </select>*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <label className="text-neutral-300 text-sm block mb-2">Font Size</label>*/}
            {/*                                <select*/}
            {/*                                    value={videoData.videoCaptionData?.fontSize || 'medium'}*/}
            {/*                                    onChange={(e) => handleCaptionChange('fontSize', e.target.value)}*/}
            {/*                                    className="w-full bg-neutral-700 text-white p-2 rounded"*/}
            {/*                                >*/}
            {/*                                    <option value="small">Small</option>*/}
            {/*                                    <option value="medium">Medium</option>*/}
            {/*                                    <option value="large">Large</option>*/}
            {/*                                </select>*/}
            {/*                            </div>*/}
            {/*                            <div>*/}
            {/*                                <label className="text-neutral-300 text-sm block mb-2">Color</label>*/}
            {/*                                <input*/}
            {/*                                    type="color"*/}
            {/*                                    value={videoData.videoCaptionData?.color || '#cdab8f'}*/}
            {/*                                    onChange={(e) => handleCaptionChange('color', e.target.value)}*/}
            {/*                                    className="w-full bg-neutral-700 rounded h-10"*/}
            {/*                                />*/}
            {/*                            </div>*/}
            {/*                            <div className="flex items-center gap-2">*/}
            {/*                                <input*/}
            {/*                                    type="checkbox"*/}
            {/*                                    checked={videoData.videoCaptionData?.background || false}*/}
            {/*                                    onChange={(e) => handleCaptionChange('background', e.target.checked)}*/}
            {/*                                    className="rounded"*/}
            {/*                                />*/}
            {/*                                <label className="text-neutral-300 text-sm">Background</label>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*            </div>*/}

            {/*            /!* Script Preview *!/*/}
            {/*            <div className="bg-neutral-900 rounded-lg p-4">*/}
            {/*                <h3 className="text-white font-medium mb-3">Script</h3>*/}
            {/*                <div className="text-neutral-300 text-sm max-h-32 overflow-y-auto">*/}
            {/*                    {videoData.videoScriptData?.script || 'No script available'}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};