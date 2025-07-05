"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ImagePlus, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useVideoCreation } from "../_context/VideoCreationContext";
import StepNavigation from "../_components/StepNavigation";
import { GeneratedImage } from "../_types/video";
import Image from "next/image";
import {
    saveVideoImageData,
    loadVideoImageData,
    clearVideoAudioData,
} from "../_utils/videoStorage";
import { envPublic } from "@/constants/env.public";

export default function ImagesPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const { generatedImages, selectedImages, isGenerating, generatedScript } = state;

    // Load data từ localStorage khi component mount
    useEffect(() => {
        dispatch({ type: "SET_GENERATED_IMAGES", payload: [] });
        const savedImageData = loadVideoImageData();

        if (savedImageData) {
            // Nếu có dữ liệu trong localStorage, load và hiển thị
            dispatch({ type: "SET_GENERATED_IMAGES", payload: savedImageData.generatedImages });
            // Set selected images nếu có
            savedImageData.selectedImages.forEach((imageId) => {
                dispatch({ type: "TOGGLE_IMAGE_SELECTION", payload: imageId });
            });
        }
        // Nếu không có dữ liệu trong localStorage, không làm gì cả (không auto-generate)
    }, [dispatch]);

    const handleImageGeneration = async () => {
        if (!generatedScript) {
            alert("Vui lòng tạo script trước khi generate images");
            return;
        }

        dispatch({ type: "SET_GENERATING", payload: true });

        try {
            const response = await fetch(
                `${envPublic.NEXT_PUBLIC_API_URL}/create-video/generate-image`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        script: generatedScript,
                    }),
                }
            );

            console.log(response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 200 || result.status === 0) {
                // Transform API response to GeneratedImage format
                const images: GeneratedImage[] = result.data.images.map(
                    (imageUrl: string, index: number) => ({
                        id: index + 1,
                        url: imageUrl,
                        prompt: `Generated image ${index + 1}`, // API doesn't return prompts, so we use generic text
                    })
                );

                dispatch({ type: "SET_GENERATED_IMAGES", payload: images });
                console.log(
                    `Generated ${images.length} images using model: ${result.data.modelUsed}`
                );
            } else {
                console.error("API Error:", result.message);
                alert(`Không thể tạo images: ${result.message}`);
            }
        } catch (error) {
            console.error("Image generation failed:", error);
            alert("Không thể tạo images. Vui lòng thử lại sau.");
        } finally {
            dispatch({ type: "SET_GENERATING", payload: false });
        }
    };

    const toggleImageSelection = (imageId: number) => {
        dispatch({ type: "TOGGLE_IMAGE_SELECTION", payload: imageId });
    };

    const handleContinue = () => {
        if (selectedImages.length === 0) {
            alert("Vui lòng chọn ít nhất một ảnh trước khi tiếp tục");
            return;
        }

        // Lưu image data vào localStorage
        saveVideoImageData({
            generatedImages,
            selectedImages,
        });
        clearVideoAudioData();
        router.push("/create-video/audio");
    };

    const handleBack = () => {
        router.push("/create-video/script");
    };

    // Check if we have a script to generate images
    const canGenerateImages = generatedScript && generatedScript.trim().length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />

                <Card className="max-w-6xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Generate and select images
                        </CardTitle>
                        <CardDescription>
                            Generate images from script content and select appropriate images
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Show script preview */}
                        {generatedScript && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <Label className="text-sm font-medium mb-2 block text-gray-900">
                                    Script Preview
                                </Label>
                                <div className="text-sm text-gray-700 overflow-y-auto">
                                    {generatedScript}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center mb-6">
                            <Button
                                onClick={handleImageGeneration}
                                disabled={isGenerating || !canGenerateImages}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Generating images...
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                        {generatedImages.length > 0
                                            ? "Regenerate images"
                                            : "Generate images from script"}
                                    </>
                                )}
                            </Button>
                        </div>

                        {!canGenerateImages && (
                            <div className="text-center text-gray-500 mb-6">
                                <p>
                                    Please return to the script page to create the script before
                                    generating images.
                                </p>
                                <Button className={"mt-4"} onClick={handleBack}>
                                    Back to Script
                                </Button>
                            </div>
                        )}

                        {generatedImages.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-medium">
                                        Generated images ({generatedImages.length} total,{" "}
                                        {selectedImages.length} selected)
                                    </Label>
                                    <Badge variant="outline" className="text-sm">
                                        Click to select/deselect
                                    </Badge>
                                </div>

                                <div className="flex justify-center items-center gap-4 md:gap-20 mb-6 py-4">
                                    {generatedImages.map((image) => (
                                        <div
                                            key={image.id}
                                            onClick={() => toggleImageSelection(image.id)}
                                            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                                                selectedImages.includes(image.id)
                                                    ? "ring-4 ring-blue-500 ring-opacity-75 transform scale-105"
                                                    : "hover:scale-102 hover:shadow-lg"
                                            }`}
                                        >
                                            <div className="aspect-square relative">
                                                <Image
                                                    width={275}
                                                    height={464}
                                                    src={image.url}
                                                    alt={image.prompt}
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        // Handle image load error
                                                        e.currentTarget.src =
                                                            "/placeholder-image.jpg";
                                                    }}
                                                />
                                            </div>
                                            {selectedImages.includes(image.id) && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={handleBack}>
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleContinue}
                                        disabled={selectedImages.length === 0}
                                        className="px-6"
                                    >
                                        Next ({selectedImages.length} images selected)
                                        <ArrowRight className="w-4 h-4 ml-1" />
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
