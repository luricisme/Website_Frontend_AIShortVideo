'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { useVideoCreation } from '../_context/VideoCreationContext';
import StepNavigation from '../_components/StepNavigation';

export default function ScriptsPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const { scriptData, generatedScript, isGenerating } = state;

    const handleScriptGeneration = async () => {
        dispatch({ type: 'SET_GENERATING', payload: true });

        // Simulated API call
        setTimeout(() => {
            const newScript = `Chào mừng các bạn đến với chủ đề "${scriptData.topic}". 

Trong video hôm nay, chúng ta sẽ cùng nhau khám phá những điều thú vị về ${scriptData.topic}. Dựa trên những thông tin được thu thập từ ${scriptData.dataSource}, chúng tôi sẽ mang đến cho bạn những kiến thức bổ ích và dễ hiểu.

${scriptData.style === 'funny' ? 'Hãy chuẩn bị tinh thần để cười thật nhiều nhé!' : 'Chúng ta sẽ cùng nhau trải qua một hành trình đầy cảm xúc.'}

Nội dung này được thiết kế đặc biệt dành cho ${scriptData.audience === 'children' ? 'các bạn nhỏ' : 'người lớn'}, với ngôn ngữ ${scriptData.language} dễ hiểu và thú vị.

Hãy cùng bắt đầu cuộc hành trình khám phá nhé!`;

            dispatch({ type: 'SET_GENERATED_SCRIPT', payload: newScript });
            dispatch({ type: 'SET_GENERATING', payload: false });
        }, 2000);
    };

    const handleContinue = () => {
        router.push('/create-video/image');
    };

    const isFormValid = scriptData.topic && scriptData.dataSource;

    return (
        <div className="min-h-screen  py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />

                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Generate video script</CardTitle>
                        <CardDescription>Enter information to automatically generate a script for your video</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="topic" className="text-sm font-medium">Video Topics</Label>
                                    <Input
                                        id="topic"
                                        placeholder="For example: Climate change, AI in education..."
                                        value={scriptData.topic}
                                        onChange={(e) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { topic: e.target.value }
                                        })}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Data Source</Label>
                                    <Select
                                        value={scriptData.dataSource}
                                        onValueChange={(value) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { dataSource: value }
                                        })}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select data collection source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="wikipedia">Wikipedia</SelectItem>
                                            <SelectItem value="nature">Nature Journal</SelectItem>
                                            <SelectItem value="pubmed">PubMed</SelectItem>
                                            <SelectItem value="google-scholar">Google Scholar</SelectItem>
                                            <SelectItem value="custom-api">Custom API</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Language</Label>
                                    <Select
                                        value={scriptData.language}
                                        onValueChange={(value) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { language: value }
                                        })}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select scripting language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="chinese">中文</SelectItem>
                                            <SelectItem value="japanese">日本語</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium mb-3 block">Script style</Label>
                                    <RadioGroup
                                        value={scriptData.style}
                                        onValueChange={(value) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { style: value }
                                        })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="funny" id="funny" />
                                            <Label htmlFor="funny">Funny</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="emotional" id="emotional" />
                                            <Label htmlFor="emotional">Emotional</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="educational" id="educational" />
                                            <Label htmlFor="educational">Educational</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="professional" id="professional" />
                                            <Label htmlFor="professional">Professional</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-3 block">Audience</Label>
                                    <RadioGroup
                                        value={scriptData.audience}
                                        onValueChange={(value) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { audience: value }
                                        })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="children" id="children" />
                                            <Label htmlFor="children">Children (6-12 years old)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="teenagers" id="teenagers" />
                                            <Label htmlFor="teenagers">Teenagers (13-18 years old)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="adults" id="adults" />
                                            <Label htmlFor="adults">Adults (18+ years old)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                onClick={handleScriptGeneration}
                                disabled={!isFormValid || isGenerating}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate script
                                    </>
                                )}
                            </Button>
                        </div>

                        {generatedScript && (
                            <div className="mt-8 p-6 rounded-lg border">
                                <Label className="text-sm font-medium mb-2 block">Generated script</Label>
                                <Textarea
                                    value={generatedScript}
                                    onChange={(e) => dispatch({
                                        type: 'SET_GENERATED_SCRIPT',
                                        payload: e.target.value
                                    })}
                                    className="min-h-48"
                                    placeholder="Kịch bản sẽ xuất hiện ở đây..."
                                />
                                <div className="flex justify-end mt-4 space-x-3">
                                    <Button variant="outline" onClick={handleScriptGeneration}>
                                        <RefreshCw className="w-4 h-4" />
                                        Regenerate script
                                    </Button>
                                    <Button onClick={handleContinue}>
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