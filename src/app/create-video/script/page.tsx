'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RefreshCw, Sparkles, ArrowRight, Database, CheckCircle } from 'lucide-react';
import { useVideoCreation } from '../_context/VideoCreationContext';
import StepNavigation from '../_components/StepNavigation';

export default function ScriptsPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const { scriptData, generatedScript, isGenerating, fetchedData, isFetchingData } = state;

    // Auto fetch data when topic, language, and dataSource are selected
    useEffect(() => {
        if (scriptData.topic && scriptData.language && scriptData.dataSource && !fetchedData && !isFetchingData) {
            handleDataFetch();
        }
    }, [scriptData.topic, scriptData.language, scriptData.dataSource]);

    const handleDataFetch = async () => {
        dispatch({ type: 'SET_FETCHING_DATA', payload: true });

        // Simulated API call to fetch data
        setTimeout(() => {
            const mockData = generateMockData();
            dispatch({ type: 'SET_FETCHED_DATA', payload: mockData });
            dispatch({ type: 'SET_FETCHING_DATA', payload: false });
        }, 1500);
    };


    const generateMockData = () => {
        return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`;
    };

    const handleScriptGeneration = async () => {
        dispatch({ type: 'SET_GENERATING', payload: true });

        // Simulated API call
        setTimeout(() => {
            let newScript;
            if (scriptData.language === 'vietnamese') {
                newScript = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`;
            } else {
                newScript = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.`;
            }

            dispatch({ type: 'SET_GENERATED_SCRIPT', payload: newScript });
            dispatch({ type: 'SET_GENERATING', payload: false });
        }, 2000);
    };

    const handleContinue = () => {
        router.push('/create-video/image');
    };

    const isBasicFormValid = scriptData.topic && scriptData.dataSource && scriptData.language;
    const isFullFormValid = isBasicFormValid && scriptData.style && scriptData.audience;

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <StepNavigation />

                <Card className="max-w-4xl mx-auto px-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Generate video script</CardTitle>
                        <CardDescription>Enter information to automatically generate a script for your video</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1: Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
                            <div className={"md:col-span-5"}>
                                <Label htmlFor="topic" className="text-sm font-medium mb-2">Video Topics</Label>
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
                            <div className={"md:col-span-2"}>
                                <Label className="text-sm font-medium mb-2">Language</Label>
                                <Select
                                    value={scriptData.language}
                                    onValueChange={(value) => dispatch({
                                        type: 'SET_SCRIPT_DATA',
                                        payload: { language: value }
                                    })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vietnamese">Tiếng Việt</SelectItem>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="chinese">中文</SelectItem>
                                        <SelectItem value="japanese">日本語</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={"md:col-span-2"}>
                                <Label className="text-sm font-medium mb-2">Data Source</Label>
                                <Select
                                    value={scriptData.dataSource}
                                    onValueChange={(value) => dispatch({
                                        type: 'SET_SCRIPT_DATA',
                                        payload: { dataSource: value }
                                    })}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select data source" />
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
                        </div>

                        {/* Data Preview Section */}
                        {isBasicFormValid && (
                            <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-gray-300">
                                <div className="flex items-center mb-3">
                                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                                    <Label className="text-sm font-medium">Data Preview</Label>
                                    {fetchedData && (
                                        <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                                    )}
                                </div>

                                {isFetchingData ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="w-6 h-6 mr-2 animate-spin text-blue-600" />
                                        <span className="text-gray-600">Fetching data from {scriptData.dataSource}...</span>
                                    </div>
                                ) : fetchedData ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700">{fetchedData}</pre>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={handleDataFetch}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-1" />
                                            Refresh Data
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Step 2: Style and Audience (only show after data is fetched) */}
                        {fetchedData && (
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 pt-6 border-t">
                                <div className={"flex flex-col gap-6 col-span-3"}>
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Category</Label>
                                        <Input
                                            id="category"
                                            placeholder="Ex. Climate, Education,..."
                                            value={scriptData.category}
                                            onChange={(e) => dispatch({
                                                type: 'SET_SCRIPT_DATA',
                                                payload: { category: e.target.value }
                                            })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Tag</Label>
                                        <Input
                                            id="tag"
                                            placeholder="Ex. #anime, #cooking,..."
                                            value={scriptData.tag}
                                            onChange={(e) => dispatch({
                                                type: 'SET_SCRIPT_DATA',
                                                payload: { tag: e.target.value }
                                            })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div className={"col-span-2 md:ms-5"}>
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

                                <div className={"col-span-2"}>
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
                        )}

                        {/* Generate Script Button */}
                        {fetchedData && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    onClick={handleScriptGeneration}
                                    disabled={!isFullFormValid || isGenerating}
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
                        )}

                        {/* Generated Script */}
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
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        Regenerate script
                                    </Button>
                                    <Button onClick={handleContinue}>
                                        Next
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