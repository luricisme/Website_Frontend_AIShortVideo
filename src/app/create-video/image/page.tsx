// app/create-video/images/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ImagePlus, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useVideoCreation } from '../_context/VideoCreationContext';
import StepNavigation from '../_components/StepNavigation';
import { GeneratedImage } from '../_types/video';
import Image from "next/image";

const mockImages: GeneratedImage[] = [
    { id: 1, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', prompt: 'Image 1' },
    { id: 2, url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', prompt: 'Image 2' },
    { id: 3, url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', prompt: 'Image 3' },
    { id: 4, url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop', prompt: 'Image 4' }
];

export default function ImagesPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const { generatedImages, selectedImages, isGenerating } = state;

    const handleImageGeneration = () => {
        dispatch({ type: 'SET_GENERATING', payload: true });
        setTimeout(() => {
            dispatch({ type: 'SET_GENERATED_IMAGES', payload: mockImages });
            dispatch({ type: 'SET_GENERATING', payload: false });
        }, 1500);
    };

    const toggleImageSelection = (imageId: number) => {
        dispatch({ type: 'TOGGLE_IMAGE_SELECTION', payload: imageId });
    };

    const handleContinue = () => {
        router.push('/create-video/audio');
    };

    const handleBack = () => {
        router.push('/create-video/script');
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />

                <Card className="max-w-6xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Generate and select images</CardTitle>
                        <CardDescription>Generate images from script content and select appropriate images</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <Button
                                onClick={handleImageGeneration}
                                disabled={isGenerating}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                        Generate images from script
                                    </>
                                )}
                            </Button>
                        </div>

                        {generatedImages.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-medium">Generated images ({selectedImages.length} selected)</Label>
                                    <Badge variant="outline" className="text-sm">
                                        Press to select/deselect
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    {generatedImages.map((image) => (
                                        <div
                                            key={image.id}
                                            onClick={() => toggleImageSelection(image.id)}
                                            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                                                selectedImages.includes(image.id)
                                                    ? 'ring-4 ring-blue-500 ring-opacity-75 transform scale-105'
                                                    : 'hover:scale-102 hover:shadow-lg'
                                            }`}
                                        >
                                            <Image
                                                width={800}
                                                height={800}
                                                src={image.url}
                                                alt={image.prompt}
                                            />
                                            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium text-center px-2">
                          {image.prompt}
                        </span>
                                            </div>
                                            {selectedImages.includes(image.id) && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 " />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleContinue}
                                        disabled={selectedImages.length === 0}
                                        className="px-6"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}