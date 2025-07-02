'use client'

import {interpolate, useCurrentFrame} from "remotion";
import React from "react";

export default function CaptionDisplay ({ text, position, fontSize, color, background }: {
    text: string;
    position: string;
    fontSize: string;
    color: string;
    background: boolean;
}) {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const getFontSize = () => {
        switch (fontSize) {
            case 'small': return '0.8rem';
            case 'large': return '1.2rem';
            default: return '1rem';
        }
    };

    const getPosition = () => {
        switch (position) {
            case 'top': return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom': return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            default: return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }
    };

    return (
        <div
            style={{
                position: 'absolute',
                ...getPosition(),
                color: color,
                fontSize: getFontSize(),
                fontWeight: 'bold',
                textAlign: 'center',
                opacity,
                backgroundColor: background ? 'rgba(0,0,0,0.7)' : 'transparent',
                borderRadius: background ? '10px' : '0',
                padding: background ? '6px 8px' : '0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.4',
                maxWidth: '90%',
            }}
        >
            {text}
        </div>
    );
};
