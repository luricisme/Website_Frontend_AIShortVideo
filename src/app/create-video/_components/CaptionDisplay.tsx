'use client'

import {interpolate, useCurrentFrame} from "remotion";
import React from "react";

export default function CaptionDisplay ({ text, position, fontSize, color, background, style }: {
    text: string;
    position: string;
    fontSize: string;
    color: string;
    background: boolean;
    style?: string;
}) {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const getFontSize = () => {
        switch (fontSize) {
            case 'small': return '0.8rem';
            case 'medium': return '1rem';
            case 'large': return '1.2rem';
            case 'extra-large': return '1.5rem';
            default: return '1rem';
        }
    };

    const getPosition = () => {
        switch (position) {
            case 'top': return { top: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom': return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
            case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
            default: return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
        }
    };

    // Font family mapping based on style
    const getFontFamily = () => {
        switch (style) {
            case 'modern':
                return 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
            case 'classic':
                return 'Georgia, "Times New Roman", Times, serif';
            case 'minimal':
                return '"JetBrains Mono", "Fira Code", "Monaco", "Cascadia Code", "Consolas", "Courier New", monospace';
            case 'elegant':
                return '"Playfair Display", Georgia, "Times New Roman", serif';
            default:
                return 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        }
    };

    // Additional styling based on subtitle type
    const getAdditionalStyles = () => {
        switch (style) {
            case 'modern':
                return {
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                };
            case 'classic':
                return {
                    fontWeight: '500',
                    letterSpacing: '0.01em',
                };
            case 'minimal':
                return {
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                };
            case 'elegant':
                return {
                    fontWeight: '400',
                    letterSpacing: '0.03em',
                    fontStyle: 'italic',
                };
            default:
                return {
                    fontWeight: 'bold',
                    letterSpacing: '0.02em',
                };
        }
    };

    const additionalStyles = getAdditionalStyles();

    return (
        <div
            style={{
                position: 'absolute',
                ...getPosition(),
                color: color,
                fontSize: getFontSize(),
                fontFamily: getFontFamily(),
                textAlign: 'center',
                opacity,
                backgroundColor: background ? '#000000B3' : 'transparent',
                borderRadius: background ? '10px' : '0',
                padding: background ? '6px 8px' : '0',
                textShadow: background ? 'none' : '2px 2px 4px rgba(0,0,0,0.8)',
                lineHeight: '1.4',
                maxWidth: '90%',
                ...additionalStyles,
            }}
        >
            {text}
        </div>
    );
};