"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Image,
    Mic,
    Upload,
    Play,
    Pause,
    Volume2,
    Download,
    RefreshCw,
    Check,
    ArrowRight,
    ArrowLeft,
    Sparkles, Settings
} from 'lucide-react';

const VideoCreationApp = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [scriptData, setScriptData] = useState({
        topic: '',
        dataSource: '',
        language: '',
        style: '',
        audience: ''
    });
    const [generatedScript, setGeneratedScript] = useState('');
    // const [selectedImages, setSelectedImages] = useState([]);
    // const [generatedImages, setGeneratedImages] = useState([]);
    const [audioData, setAudioData] = useState({
        voiceType: '',
        customText: '',
        audioFile: null,
        isRecording: false,
        recordedAudio: null
    });
    const [captionData, setCaptionData] = useState({
        style: '',
        position: '',
        fontSize: '',
        color: '',
        background: false
    });
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock data for generated images
    const mockImages = [
        { id: 1, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', prompt: 'Khoa học tự nhiên' },
        { id: 2, url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', prompt: 'Thí nghiệm hóa học' },
        { id: 3, url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', prompt: 'Công nghệ hiện đại' },
        { id: 4, url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop', prompt: 'Học tập và nghiên cứu' }
    ];

    const handleScriptGeneration = async () => {
        setIsGenerating(true);
        // Simulated API call
        setTimeout(() => {
            setGeneratedScript(`Chào mừng các bạn đến với chủ đề "${scriptData.topic}". 

Trong video hôm nay, chúng ta sẽ cùng nhau khám phá những điều thú vị về ${scriptData.topic}. Dựa trên những thông tin được thu thập từ ${scriptData.dataSource}, chúng tôi sẽ mang đến cho bạn những kiến thức bổ ích và dễ hiểu.

${scriptData.style === 'funny' ? 'Hãy chuẩn bị tinh thần để cười thật nhiều nhé!' : 'Chúng ta sẽ cùng nhau trải qua một hành trình đầy cảm xúc.'}

Nội dung này được thiết kế đặc biệt dành cho ${scriptData.audience === 'children' ? 'các bạn nhỏ' : 'người lớn'}, với ngôn ngữ ${scriptData.language} dễ hiểu và thú vị.

Hãy cùng bắt đầu cuộc hành trình khám phá nhé!`);
            setIsGenerating(false);
        }, 2000);
    };

    // const handleImageGeneration = () => {
    //     setIsGenerating(true);
    //     setTimeout(() => {
    //         setGeneratedImages(mockImages);
    //         setIsGenerating(false);
    //     }, 1500);
    // };

    // const toggleImageSelection = (imageId: never) => {
    //     setSelectedImages(prev =>
    //         prev.includes(imageId)
    //             ? prev.filter(id => id !== imageId)
    //             : [...prev, imageId]
    //     );
    // };

    const handleRecording = () => {
        if (audioData.isRecording) {
            // Stop recording
            setAudioData(prev => ({ ...prev, isRecording: false }));
        } else {
            // Start recording
            setAudioData(prev => ({ ...prev, isRecording: true }));
        }
    };

    const steps = [
        { id: 1, title: 'Tạo kịch bản', icon: FileText },
        { id: 2, title: 'Chọn hình ảnh', icon: Image },
        { id: 3, title: 'Tạo audio', icon: Mic },
        { id: 4, title: 'Thêm caption', icon: Settings },
        { id: 5, title: 'Preview video', icon: Play },
        { id: 6, title: 'Chỉnh sửa', icon: RefreshCw }
    ];

    const StepNavigation = () => (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        currentStep === step.id
                            ? 'bg-blue-500 border-blue-500'
                            : currentStep > step.id
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 text-gray-500'
                    }`}>
                        {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`ml-3 font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-500'}`}>
            {step.title}
          </span>
                    {index < steps.length - 1 && (
                        <ArrowRight className="w-5 h-5 mx-6 text-gray-300" />
                    )}
                </div>
            ))}
        </div>
    );

    const ScriptCreationStep = () => (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold mx-4">Create scripts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
                    <div className="space-y-4 ">
                        <div>
                            <Label className="text-xl font-bold mb-2">Topic</Label>
                            <Input
                                id="topic"
                                placeholder="Ví dụ: Biến đổi khí hậu, AI trong giáo dục..."
                                value={scriptData.topic}
                                onChange={(e) => setScriptData(prev => ({ ...prev, topic: e.target.value }))}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label className="text-xl font-bold mb-2">Source</Label>
                            <Select value={scriptData.dataSource} onValueChange={(value) => setScriptData(prev => ({ ...prev, dataSource: value }))}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Chọn nguồn thu thập dữ liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wikipedia">Wikipedia</SelectItem>
                                    <SelectItem value="nature">Nature Journal</SelectItem>
                                    <SelectItem value="pubmed">PubMed</SelectItem>
                                    <SelectItem value="google-scholar">Google Scholar</SelectItem>
                                    <SelectItem value="custom-api">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-xl font-bold mb-2">Language</Label>
                            <Select value={scriptData.language} onValueChange={(value) => setScriptData(prev => ({ ...prev, language: value }))}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Chọn ngôn ngữ kịch bản" />
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
                            <Label className="text-xl font-bold mb-3 block">Writing style</Label>
                            <RadioGroup value={scriptData.style} onValueChange={(value) => setScriptData(prev => ({ ...prev, style: value }))}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="funny" id="funny" />
                                    <Label htmlFor="funny">Funny</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="emotional" id="emotional" />
                                    <Label htmlFor="emotional">Romantic</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="educational" id="educational" />
                                    <Label htmlFor="educational">Education</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="professional" id="professional" />
                                    <Label htmlFor="professional">Professional</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label className="text-xl font-bold mb-3 block">Audience</Label>
                            <RadioGroup value={scriptData.audience} onValueChange={(value) => setScriptData(prev => ({ ...prev, audience: value }))}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="children" id="children" />
                                    <Label htmlFor="children">Child (6-12 ages)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="teenagers" id="teenagers" />
                                    <Label htmlFor="teenagers">Teenager (13-18 ages)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="adults" id="adults" />
                                    <Label htmlFor="adults">Adults (18+ ages)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-8">
                    <Button
                        onClick={handleScriptGeneration}
                        disabled={!scriptData.topic || !scriptData.dataSource || isGenerating}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo kịch bản...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate scripts
                            </>
                        )}
                    </Button>
                </div>

                {generatedScript && (
                    <div className="mt-8 p-6 rounded-lg border">
                        <Label className="text-xl font-bold mb-4 block">Scripts created:</Label>
                        <Textarea
                            value={generatedScript}
                            onChange={(e) => setGeneratedScript(e.target.value)}
                            className="min-h-48"
                            placeholder="Kịch bản sẽ xuất hiện ở đây..."
                        />
                        <div className="flex justify-end mt-4 space-x-3">
                            <Button variant="outline" onClick={handleScriptGeneration}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recreate
                            </Button>
                            <Button onClick={() => setCurrentStep(2)}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const ImageSelectionStep = () => (
        <Card className="max-w-6xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create and select images</CardTitle>
                <CardDescription>Generate images from script content and select appropriate images</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-6">
                    <Button
                        // onClick={handleImageGeneration}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Đang tạo hình ảnh...
                            </>
                        ) : (
                            <>
                                <Image className="w-4 h-4 mr-2" />
                                Generate images
                            </>
                        )}
                    </Button>
                </div>

                {mockImages.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Label className="text-lg font-medium">Generated images (1 selected)</Label>
                            <Badge variant="outline" className="text-sm px-4 py-3">
                                Click to select/deselect
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {mockImages.map((image) => (
                                <div
                                    key={image.id}
                                    // onClick={() => toggleImageSelection(image.id)}
                                    className={"relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300"}
                                        // selectedImages.includes(image.id)
                                        //     ? 'ring-4 ring-blue-500 ring-opacity-75 transform scale-105'
                                        //     : 'hover:scale-102 hover:shadow-lg'"}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.prompt}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-xl font-bold text-center px-2">
                                      {image.prompt}
                                    </span>
                                    </div>
                                    {/*{selectedImages.includes(image.id) && (*/}
                                    {/*    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">*/}
                                    {/*        <Check className="w-4 h-4" />*/}
                                    {/*    </div>*/}
                                    {/*)}*/}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(3)}
                                // disabled={selectedImages.length === 0}
                                className="px-6"
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const AudioCreationStep = () => (
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create and select audio</CardTitle>
                <CardDescription>Create voiceover from script or upload your own audio file</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="generate" className={"cursor-pointer"}>Generate audio</TabsTrigger>
                        <TabsTrigger value="upload" className={"cursor-pointer"}>Upload file</TabsTrigger>
                        <TabsTrigger value="record" className={"cursor-pointer"}>Recording</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-xl font-bold mb-2 block">Voice type</Label>
                                <Select value={audioData.voiceType} onValueChange={(value) => setAudioData(prev => ({ ...prev, voiceType: value }))}>
                                    <SelectTrigger className={"cursor-pointer"}>
                                        <SelectValue placeholder="Select type" />
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
                                <Label className="text-xl font-bold mb-2 block">Speed</Label>
                                <Select>
                                    <SelectTrigger className={"cursor-pointer"}>
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
                            <Label className="text-xl font-bold mb-2 block">Content</Label>
                            <Textarea
                                value={audioData.customText || generatedScript}
                                // onChange={(e: { target: { value: any; }; }) => setAudioData(prev => ({ ...prev, customText: e.target.value }))}
                                placeholder="Enter the text you want to convert to speech or use a created script"
                                className="min-h-32"
                            />
                        </div>

                        <Button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Generate audio
                        </Button>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-6 mt-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium text-gray-600 mb-2">Drag and drop audio files here</p>
                            <p className="text-sm text-gray-500 mb-4">Or click to select file</p>
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Select file
                            </Button>
                            <p className="text-xs text-gray-400 mt-2">Support: MP3, WAV, M4A (maximum 50MB)</p>
                        </div>
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

                            <div>
                                <Button
                                    onClick={handleRecording}
                                    size="lg"
                                    variant={audioData.isRecording ? "destructive" : "default"}
                                    className="px-8 py-3"
                                >
                                    {audioData.isRecording ? (
                                        <>
                                            <Pause className="w-4 h-4 mr-2" />
                                            Stop record
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-4 h-4 mr-2" />
                                            Start record
                                        </>
                                    )}
                                </Button>
                            </div>

                            {audioData.isRecording && (
                                <div className="text-red-500 font-medium animate-pulse">
                                    🔴 Recording..
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Audio Preview Section */}
                {(audioData.recordedAudio || audioData.customText) && (
                    <div className="mt-8 p-6 rounded-lg border">
                        <Label className="text-xl font-bold mb-4 block">Preview Audio</Label>
                        <div className="flex items-center space-x-4 p-4 rounded-lg border">
                            <Button size="sm" variant="outline">
                                <Play className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 h-2  rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <span className="text-sm text-gray-500">0:15 / 0:45</span>
                            <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={() => setCurrentStep(4)}>
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
    const CaptionStep = () => (
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Add caption</CardTitle>
                <CardDescription>Customize the style and position of subtitles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">Caption style</Label>
                        <Select value={captionData.style} onValueChange={(value) => setCaptionData(prev => ({ ...prev, style: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Caption style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="modern">Modern</SelectItem>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="minimal">Minimalism</SelectItem>
                                <SelectItem value="elegant">Elegant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2 block">Position</Label>
                        <Select value={captionData.position} onValueChange={(value) => setCaptionData(prev => ({ ...prev, position: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vị trí" />
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
                        <Select value={captionData.fontSize} onValueChange={(value) => setCaptionData(prev => ({ ...prev, fontSize: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="extra-large">Very large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-2 block">Color</Label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={captionData.color}
                                onChange={(e) => setCaptionData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-600">Selected color:</span>
                                <span className="text-sm font-mono">{captionData.color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="background"
                        checked={captionData.background}
                        onChange={(e) => setCaptionData(prev => ({ ...prev, background: e.target.checked }))}
                        className="rounded"
                    />
                    <Label htmlFor="background">Add background for caption</Label>
                </div>

                <div className="p-6 bg-gray-900 rounded-lg text-center">
                    <p className={`transition-all ${captionData.fontSize === 'large' ? 'text-2xl' : 'text-lg'} ${captionData.color === 'white' ? 'text-white' : captionData.color === 'yellow' ? 'text-yellow-400' : 'text-white'} ${captionData.background ? 'bg-black bg-opacity-50 px-4 py-2 rounded' : ''}`}>
                        Preview caption
                    </p>
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={() => setCurrentStep(5)}>
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const VideoPreviewStep = () => (
        <Card className="max-w-5xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Preview Video</CardTitle>
                <CardDescription>Preview your video before exporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                        <p className="text-lg">Click to view preview</p>
                        <p className="text-sm opacity-70">Duration: ~2:30</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <Image className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm font-medium">2 images</p>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <Mic className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="text-sm font-medium">Audio</p>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-lg">
                        <Settings className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <p className="text-sm font-medium">Caption</p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(6)}
                        className="px-6 py-3"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export video
                    </Button>
                </div>

                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(4)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button onClick={() => setCurrentStep(6)}>
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

            </CardContent>
        </Card>
    );

    const EditingStep = () => (
        <Card className="max-w-6xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Final edit</CardTitle>
                <CardDescription>Edit each section before exporting the video</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="images">Image</TabsTrigger>
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="audio">Audio</TabsTrigger>
                    </TabsList>

                    <TabsContent value="images" className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mockImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                    <img src={image.url} alt="" className="w-full h-32 object-cover rounded-lg" />
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}
                                    </div>
                                    <Button size="sm" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        ×
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full">
                            <Image className="w-4 h-4 mr-2" />
                            Add new image
                        </Button>
                    </TabsContent>

                    <TabsContent value="script" className="space-y-4 mt-6">
                        <Textarea
                            value={generatedScript}
                            onChange={(e) => setGeneratedScript(e.target.value)}
                            className="min-h-48"
                            placeholder="Edit script..."
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recreate video
                            </Button>
                            <Button>
                                <Check className="w-4 h-4 mr-2" />
                                Save change
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="audio" className="space-y-4 mt-6">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <Button size="sm">
                                <Play className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full w-1/3"></div>
                            </div>
                            <span className="text-sm">2:30</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline">
                                <Mic className="w-4 h-4 mr-2" />
                                Record again
                            </Button>
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                New file
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setCurrentStep(5)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back Preview
                    </Button>
                    <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Download className="w-4 h-4 mr-2" />
                        Export video
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Create videos</h1>
                </div>

                <StepNavigation />

                <div className="transition-all duration-500 ease-in-out pt-4">
                    {currentStep === 1 && <ScriptCreationStep />}
                    {currentStep === 2 && <ImageSelectionStep />}
                    {currentStep === 3 && <AudioCreationStep />}
                    {currentStep === 4 && <CaptionStep />}
                    {currentStep === 5 && <VideoPreviewStep />}
                    {currentStep === 6 && <EditingStep />}
                </div>
            </div>
        </div>
    );
};

export default VideoCreationApp;