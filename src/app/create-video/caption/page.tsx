'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import StepNavigation from '../_components/StepNavigation';
import { useVideoCreation } from '../_context/VideoCreationContext';

export default function CaptionPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();

    // Initialize captionData with default values if not present
    const captionData = state.captionData || {
        style: '',
        position: 'bottom',
        fontSize: 'medium',
        color: '#ffffff',
        background: false
    };

    const updateCaptionData = (updates: Partial<typeof captionData>) => {
        dispatch({
            type: 'SET_CAPTION_DATA',
            payload: updates
        });
    };

    const handleContinue = () => {
        router.push('/create-video/preview');
    };

    const handleBack = () => {
        router.push('/create-video/audio');
    };

    const getPreviewStyles = () => {
        let sizeClass = '';
        switch (captionData.fontSize) {
            case 'small':
                sizeClass = 'text-sm';
                break;
            case 'medium':
                sizeClass = 'text-lg';
                break;
            case 'large':
                sizeClass = 'text-2xl';
                break;
            case 'extra-large':
                sizeClass = 'text-4xl';
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

        return { sizeClass, positionClass };
    };

    const { sizeClass, positionClass } = getPreviewStyles();

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />
                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Add subtitles</CardTitle>
                        <CardDescription>
                            Customize the style and position of subtitles
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Subtitle type</Label>
                                <Select
                                    value={captionData.style}
                                    onValueChange={(value) => updateCaptionData({ style: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subtitle type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="modern">Modern</SelectItem>
                                        <SelectItem value="classic">Classic</SelectItem>
                                        <SelectItem value="minimal">Minimal</SelectItem>
                                        <SelectItem value="elegant">Elegant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Position</Label>
                                <Select
                                    value={captionData.position}
                                    onValueChange={(value) => updateCaptionData({ position: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bottom">Bottom</SelectItem>
                                        <SelectItem value="top">Top</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Size</Label>
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
                                <Label className="text-sm font-medium mb-2 block">Color</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={captionData.color}
                                        onChange={(e) => updateCaptionData({ color: e.target.value })}
                                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-600">Selected color:</span>
                                        <span className="text-sm font-mono uppercase">{captionData.color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="background"
                                checked={captionData.background}
                                onCheckedChange={(checked: never) => updateCaptionData({ background: !!checked })}
                            />
                            <Label htmlFor="background" className="text-sm font-medium">
                                Add background to subtitles
                            </Label>
                        </div>

                        {/* Preview Section */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold block">Preview</Label>
                            <div className={`relative bg-gray-900 rounded-lg aspect-video flex ${positionClass} justify-center text-center overflow-hidden`}>
                                {/* Mock video background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50" />

                                <p
                                    className={`relative z-10 transition-all duration-300 ${sizeClass} font-semibold max-w-4xl px-4 ${
                                        captionData.background
                                            ? 'bg-black px-5 py-1 rounded-md'
                                            : 'drop-shadow-lg'
                                    }`}
                                    style={{
                                        color: captionData.color,
                                        textShadow: captionData.background ? 'none' : '2px 2px 4px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    Here is a sample subtitle for you to preview.
                                </p>
                            </div>

                            {/* Style indicators */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {captionData.style ? `${
                                        captionData.style === 'modern' ? 'Modern' :
                                            captionData.style === 'classic' ? 'Classic' :
                                                captionData.style === 'minimal' ? 'Minimal' :
                                                    captionData.style === 'elegant' ? 'Elegant' : captionData.style
                                    }` : 'No style selected'}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    {
                                    captionData.position === 'bottom' ? 'Bottom' :
                                        captionData.position === 'top' ? 'Top' :
                                            captionData.position === 'center' ? 'Center' : "Bottom"
                                }
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    {
                                    captionData.fontSize === 'small' ? 'Small' :
                                        captionData.fontSize === 'medium' ? 'Medium' :
                                            captionData.fontSize === 'large' ? 'Large' :
                                                captionData.fontSize === 'extra-large' ? 'Extra large' : 'Medium'
                                }
                                </span>
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