import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Tag validation functions
export const validateTags = (tagString: string) => {
    if (!tagString.trim()) return { isValid: true, error: '' };

    const tags = tagString.split(',').map(tag => tag.trim());
    const invalidTags = [];

    for (const tag of tags) {
        if (!tag.startsWith('#') || tag.length < 2) {
            invalidTags.push(tag);
        }
    }

    if (invalidTags.length > 0) {
        return {
            isValid: false,
            error: `Tags must start with # and contain at least one character.`
        };
    }

    return { isValid: true, error: '' };
};

export const formatTags = (tagString: string) => {
    if (!tagString.trim()) return '';

    return tagString
        .split(',')
        .map(tag => {
            const trimmed = tag.trim();
            return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
        })
        .join(', ');
};

// Tag Input Component with validation
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const TagInput = ({ value, onChange, placeholder = "Ex. #anime, #cooking, #tutorial" }) => {
    const [error, setError] = useState('');

    const handleChange = (e: { target: { value: never; }; }) => {
        const newValue = e.target.value;
        const validation = validateTags(newValue);

        setError(validation.error);
        onChange(newValue);
    };

    const handleBlur = () => {
        if (value) {
            const validation = validateTags(value);
            if (validation.isValid) {
                const formatted = formatTags(value);
                onChange(formatted);
            }
        }
    };

    return (
        <div>
            <Label className="text-sm font-medium mb-2">Tag</Label>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 ${error ? 'border-red-500' : ''}`}
            />
            {error && (
                <div className="mt-2 text-red-500 text-xs">{error}</div>
            )}
            <p className="text-xs text-gray-500 mt-1">
                Enter tags separated by commas and must start with #
            </p>
        </div>
    );
};