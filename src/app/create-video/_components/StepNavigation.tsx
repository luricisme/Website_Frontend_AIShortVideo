// components/StepNavigation.tsx
'use client';

import React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import { Check, FileText, Mic, TypeOutline, Play, Download , ArrowRight, ImagePlus } from 'lucide-react';
import { STEPS } from '../_types/video';
import Image from "next/image";

export default function StepNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const getCurrentStep = () => {
        const currentPath = pathname;
        const step = STEPS.find(s => s.path === currentPath);
        return step ? step.id : 1;
    };

    const currentStep = getCurrentStep();

    const getIcon = (stepId: number) => {
        switch (stepId) {
            case 1: return FileText;
            case 2: return ImagePlus;
            case 3: return Mic;
            case 4: return TypeOutline;
            case 5: return Play;
            case 6: return Download;
            default: return FileText;
        }
    };

    const handleBackHome = () => {
        router.push('/');
    };

    const handleStepClick = (stepPath: string) => {
        router.push(stepPath);
    };

    return (
        <div className="mb-15 flex flex-col justify-center items-center">
            <Image className={"md:absolute top-10 left-20 cursor-pointer"} src={"/logo.png"}
                   alt="Logo" width={40} height={40} onClick={handleBackHome} />
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-3">Automatic Video Creation</h1>
                <p className="text-xl">Create professional videos in just a few simple steps</p>
            </div>
            <div className="flex items-center space-x-4 min-w-max">
                {STEPS.map((step, index) => {
                    const Icon = getIcon(step.id);
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                                    isActive
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : isCompleted
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400'
                                }`}
                                onClick={() => handleStepClick(step.path)}
                            >
                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span
                                className={`ml-3 font-medium hidden sm:block cursor-pointer hover:underline ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                                onClick={() => handleStepClick(step.path)}
                            >
                                {step.title}
                            </span>
                            {index < STEPS.length - 1 && (
                                <ArrowRight className="w-5 h-5 mx-6 text-gray-300 hidden sm:block" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}