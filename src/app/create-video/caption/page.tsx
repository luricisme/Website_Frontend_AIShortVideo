'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import StepNavigation from '../_components/StepNavigation';
import { useVideoCreation } from '../_context/VideoCreationContext';
import { saveVideoCaptionData, loadVideoCaptionData } from '../_utils/videoStorage';
import {Checkbox} from "@/components/ui/checkbox";

export default function CaptionPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();

    // Font mapping cho từng subtitle type
    const fontMapping = {
        modern: 'font-sans', // Sans-serif modern
        classic: 'font-serif', // Serif classic
        minimal: 'font-mono', // Monospace minimal
        elegant: 'font-serif' // Serif elegant với style khác
    };

    // Font family CSS cho export
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

    // Initialize captionData with default values if not present
    const captionData = state.captionData || {
        style: '',
        position: 'bottom',
        fontSize: 'medium',
        color: '#000000',
        background: false,
        fontFamily: '' // Thêm fontFamily vào state
    };

    // Load saved caption data on component mount
    useEffect(() => {
        const savedCaptionData = loadVideoCaptionData();
        if (savedCaptionData) {
            dispatch({
                type: 'SET_CAPTION_DATA',
                payload: savedCaptionData
            });
        }
    }, [dispatch]);

    const updateCaptionData = (updates: { style?: string; position?: string; fontSize?: string; color?: string; background?: boolean; }) => {
        const newCaptionData = { ...captionData, ...updates };

        // Nếu style thay đổi, cập nhật fontFamily
        if (updates.style) {
            newCaptionData.fontFamily = getFontFamily(updates.style);
        }

        // Update context state
        dispatch({
            type: 'SET_CAPTION_DATA',
            payload: newCaptionData
        });

        // Save to localStorage
        saveVideoCaptionData(newCaptionData);
    };

    const handleContinue = () => {
        // Ensure data is saved before navigation
        const dataToSave = {
            ...captionData,
            fontFamily: getFontFamily(captionData.style)
        };
        saveVideoCaptionData(dataToSave);
        router.push('/create-video/preview');
    };

    const handleBack = () => {
        // Save current state before going back
        const dataToSave = {
            ...captionData,
            fontFamily: getFontFamily(captionData.style)
        };
        saveVideoCaptionData(dataToSave);
        router.push('/create-video/audio');
    };

    // Rest of your component remains the same...
    const getPreviewStyles = () => {
        let sizeClass = '';
        switch (captionData.fontSize) {
            case 'small':
                sizeClass = 'text-xs';
                break;
            case 'medium':
                sizeClass = '';
                break;
            case 'extra-large':
                sizeClass = 'text-xl';
                break;
            default:
                sizeClass = 'text-lg';
        }

        let positionClass = '';
        switch (captionData.position) {
            case 'top':
                positionClass = 'items-start pt-8';
                break;
            case 'center':
                positionClass = 'items-center';
                break;
            case 'bottom':
                positionClass = 'items-end pb-8';
                break;
            default:
                positionClass = 'items-end pb-8';
        }

        // Thêm font class
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const fontClass = captionData.style ? fontMapping[captionData.style] : 'font-sans';

        return { sizeClass, positionClass, fontClass };
    };

    const { sizeClass, positionClass, fontClass } = getPreviewStyles();

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Add subtitles</CardTitle>
                        <CardDescription>
                            Customize the style and position of subtitles
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 ">
                        <div className="grid-cols-2 grid">
                            <div className={"space-y-4"}>
                                <div>
                                    <Label className=" font-medium mb-2 block">Subtitle type</Label>
                                    <Select
                                        value={captionData.style}
                                        onValueChange={(value) => updateCaptionData({ style: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subtitle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="modern">Modern (Sans-serif)</SelectItem>
                                            <SelectItem value="classic">Classic (Serif)</SelectItem>
                                            <SelectItem value="minimal">Minimal (Monospace)</SelectItem>
                                            <SelectItem value="elegant">Elegant (Serif)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className=" font-medium mb-2 block">Size</Label>
                                    <Select
                                        value={captionData.fontSize}
                                        onValueChange={(value) => updateCaptionData({ fontSize: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
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
                                    <Label className=" font-medium mb-2 block">Color</Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={captionData.color}
                                            onChange={(e) => updateCaptionData({ color: e.target.value })}
                                            className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                                        />
                                        <div className="flex flex-col">
                                            <span className=" text-gray-600">Selected color:</span>
                                            <span className=" font-mono uppercase">{captionData.color}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="background"
                                        checked={captionData.background}
                                        onCheckedChange={(checked) => updateCaptionData({ background: !!checked })}
                                    />
                                    <Label htmlFor="background" className=" font-medium">
                                        Add background to subtitles
                                    </Label>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="space-y-2">
                                <Label className="text-lg font-semibold block">Preview</Label>
                                <div className={`relative bg-gray-900 rounded-lg aspect-video flex ${positionClass} justify-center text-center overflow-hidden w-65 h-100 `}>
                                    {/* Mock video background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50" />

                                    <p
                                        className={`relative z-10 transition-all duration-300 ${sizeClass} ${fontClass} font-semibold max-w-4xl px-4 ${
                                            captionData.background
                                                ? 'bg-black px-5 py-1 rounded-md'
                                                : 'drop-shadow-lg'
                                        }`}
                                        style={{
                                            color: captionData.color,
                                            // textShadow: captionData.background ? 'none' : '2px 2px 4px rgba(0,0,0,0.8)',
                                            fontFamily: captionData.style ? getFontFamily(captionData.style) : 'inherit'
                                        }}
                                    >
                                        Here is a sample subtitle for you to preview.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={!captionData.style}
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