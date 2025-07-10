'use client';

import { envPublic } from "@/constants/env.public";

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
import { saveVideoScriptData, clearVideoImageData } from "../_utils/videoStorage";
import {TagInput, validateTags} from "@/app/create-video/_components/TagValidation";

export default function ScriptsPage() {
    const router = useRouter();
    const { state, dispatch } = useVideoCreation();
    const { scriptData, generatedScript, isGenerating, fetchedData, isFetchingData } = state;
    const API_URL = envPublic.NEXT_PUBLIC_API_URL;

    // Only auto fetch data when topic, language, and dataSource are selected AND we don't have data yet
    useEffect(() => {
        const shouldAutoFetch = (
            scriptData.topic &&
            scriptData.language &&
            scriptData.dataSource &&
            !fetchedData &&
            !isFetchingData
        );

        if (shouldAutoFetch) {
            handleDataFetch();
        }
    }, [scriptData.topic, scriptData.language, scriptData.dataSource]);

    // Step 1: Collect data using /create-video/collect-data
    const handleDataFetch = async () => {
        dispatch({ type: 'SET_FETCHING_DATA', payload: true });

        try {
            // API call to collect data
            const response = await fetch(`${API_URL}/create-video/collect-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: scriptData.topic,
                    source: scriptData.dataSource,
                    lang: scriptData.language
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            if (result.status === 200) {
                dispatch({ type: 'SET_FETCHED_DATA', payload: result.data });
            } else {
                console.error("Data fetch error:", result.message);
                alert(`Không thể fetch data: ${result.message}`);
            }
        } catch (error) {
            console.error("Data fetch failed:", error);
            alert("Không thể fetch data. Vui lòng thử lại.");
        } finally {
            dispatch({ type: 'SET_FETCHING_DATA', payload: false });
        }
    };

    // Manual refresh data - always fetch regardless of current state
    const handleManualRefresh = async () => {
        if (!scriptData.topic || !scriptData.language || !scriptData.dataSource) {
            alert("Vui lòng điền đầy đủ topic, language và data source trước khi refresh data");
            return;
        }
        await handleDataFetch();
    };

    // Step 2: Generate script using /create-video/generate-script with collected data
    const handleScriptGeneration = async () => {
        if (!fetchedData || !scriptData.style || !scriptData.target || !scriptData.language) {
            alert("Vui lòng điền đầy đủ thông tin trước khi tạo script");
            return;
        }

        console.log(fetchedData);
        dispatch({ type: 'SET_GENERATING', payload: true });

        try {
            const response = await fetch(`${API_URL}/create-video/generate-script`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: fetchedData.text,
                    style: scriptData.style,
                    audience: scriptData.target,
                    lang: scriptData.language
                }),
            });

            console.log("response:", response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 200) {
                // Thành công - lưu script
                dispatch({ type: 'SET_GENERATED_SCRIPT', payload: result.data.script || result.data });
            } else {
                // API trả về lỗi
                console.error("API Error:", result.message);
            }
        } catch (err) {
            console.error("Request failed:", err);
            alert("Không thể tạo script. Vui lòng thử lại sau.");
        } finally {
            dispatch({ type: 'SET_GENERATING', payload: false });
        }
    };

// Update your handleContinue function to use validation:
    const handleContinue = () => {
        if (!generatedScript) {
            alert("Vui lòng tạo script trước khi tiếp tục");
            return;
        }

        // Validate tags before saving
        const tagValidation = validateTags(scriptData.tag || '');
        if (!tagValidation.isValid) {
            alert(`Tag không hợp lệ: ${tagValidation.error}`);
            return;
        }

        saveVideoScriptData({
            script: generatedScript,
            category: scriptData.category || '',
            tag: scriptData.tag || '',
            language: scriptData.language || '',
            target: scriptData.target || '',
            style: scriptData.style || '',
        });

        clearVideoImageData();
        router.push('/create-video/image');
    };

    // Form validation helpers
    const isBasicFormValid = scriptData.topic && scriptData.dataSource && scriptData.language;
    const isFullFormValid = isBasicFormValid && scriptData.style && scriptData.target;
    const hasDataToGenerateScript = fetchedData && isFullFormValid;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 py-20 px-4">
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
                                        <SelectItem value="Vietnamese">Tiếng Việt</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Chinese">中文</SelectItem>
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
                                        <SelectItem value="Wikipedia">Wikipedia</SelectItem>
                                        <SelectItem value="Wikidata">Wikidata</SelectItem>
                                        <SelectItem value="AI">AI</SelectItem>
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
                                        <span className="text-gray-600">Collecting data from {scriptData.dataSource}...</span>
                                    </div>
                                ) : fetchedData ? (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-500">
                                                <strong>Source:</strong> {fetchedData.source} | <strong>Language:</strong> {fetchedData.lang}
                                            </div>
                                            {fetchedData.text ? (
                                                <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                                                    {fetchedData.text}
                                                </pre>
                                            ) : (
                                                <div className="text-sm text-gray-500 italic">No content received from {fetchedData.source}</div>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={handleManualRefresh}
                                            disabled={isFetchingData}
                                        >
                                            <RefreshCw className={`w-4 h-4 mr-1 ${isFetchingData ? 'animate-spin' : ''}`} />
                                            Refresh Data
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleManualRefresh}
                                            disabled={isFetchingData}
                                        >
                                            <Database className="w-4 h-4 mr-1" />
                                            Fetch Data
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Style and Audience (only show after data is fetched) */}
                        {fetchedData && (
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 pt-6 border-t">
                                <div className={"flex flex-col gap-6 col-span-3"}>
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Category</Label>
                                        <Select
                                            value={scriptData.category}
                                            onValueChange={(value) => dispatch({
                                                type: 'SET_SCRIPT_DATA',
                                                payload: { category: value }
                                            })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value=" ">Select a category</SelectItem>
                                                <SelectItem value="Education">Education</SelectItem>
                                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Travel">Travel</SelectItem>
                                                <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                                                <SelectItem value="Beauty & Fashion">Beauty & Fashion</SelectItem>
                                                <SelectItem value="Gaming">Gaming</SelectItem>
                                                <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                                                <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                                                <SelectItem value="Environment">Environment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <TagInput
                                            value={scriptData.tag || ''}
                                            onChange={(value: never) => dispatch({
                                                type: 'SET_SCRIPT_DATA',
                                                payload: { tag: value }
                                            })}
                                            placeholder="Ex. #anime, #cooking, #tutorial"
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
                                        value={scriptData.target}
                                        onValueChange={(value) => dispatch({
                                            type: 'SET_SCRIPT_DATA',
                                            payload: { target: value }
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
                        {hasDataToGenerateScript && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    onClick={handleScriptGeneration}
                                    disabled={isGenerating}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            {generatedScript ? 'Regenerate script' : 'Generate script'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Generated Script */}
                        {(generatedScript !== null || fetchedData) && (
                            <div className="mt-8 p-6 rounded-lg border">
                                <Label className="text-sm font-medium mb-2 block">Generated script</Label>
                                <Textarea
                                    value={generatedScript}
                                    onChange={(e) => dispatch({
                                        type: 'SET_GENERATED_SCRIPT',
                                        payload: e.target.value
                                    })}
                                    className="min-h-48"
                                    placeholder="Script will appear here..."
                                />
                                <div className="flex justify-end mt-4 space-x-3">
                                    <Button variant="outline" onClick={handleScriptGeneration} disabled={isGenerating}>
                                        <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
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