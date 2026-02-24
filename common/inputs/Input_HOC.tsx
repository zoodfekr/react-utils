'use client'

import { useEffect, useState, useRef } from 'react'
import { Input, Textarea } from "@heroui/react";
import { IconButton } from '@mui/material';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import Image from 'next/image';

interface Input_HOC_Props {
    label: string;
    type: 'password' | 'text' | 'textarea' | 'date' | 'number';
    className?: string,
    size?: 'sm' | 'md' | 'lg',
    onchange: (val: string | number) => void,   // فقط مقدار
    value: string | number | null,
    error: boolean,
    isDisabled?: boolean,
    minRows?: number,
    maxRows?: number,
    min?: number,
    max?: number,
    showCloseIcon?: boolean,
    KeyDownHandler?: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

const Input_HOC = ({
    label, type, className, size = 'md',
    onchange, value, error, isDisabled = false, minRows, maxRows, min, max, showCloseIcon = true, KeyDownHandler
}: Input_HOC_Props) => {

    const [internalVal, setInternalVal] = useState(String(value ?? ''));

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update internal state when value prop changes
    useEffect(() => {
        setInternalVal(String(value ?? ''));
    }, [value]);


    const handleDebounce = (val: string) => {

        setInternalVal(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            // Convert to number if the input type is number
            if (type === 'number') {
                const numVal = Number(val);
                onchange(numVal);
            } else {
                onchange(val);
            }
        }, 400);
    };




    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        return KeyDownHandler ? KeyDownHandler(e) : null
    }


    if (type === 'textarea') {
        return (
            <div className="relative w-full">
                <Textarea
                    autoComplete="off"
                    size={size}
                    label={label}
                    variant="flat"
                    className={`border ${error ? 'border-red-300' : 'border-stone-300'} 
                        rounded-2xl overflow-hidden my-2 ${className} beauty_hover`}
                    value={internalVal}
                    onValueChange={handleDebounce}
                    isDisabled={isDisabled}
                    minRows={minRows || 4}
                    maxRows={maxRows || 6}
                    onKeyDown={handleKeyDown}
                />
            </div>
        );
    }

    return (
        <div className='relative w-full'>
            <Input
                autoComplete="off"
                size={size}
                label={label}
                type={type === 'password' ? 'password' : type === 'number' ? 'number' : type}
                variant='flat'
                className={`border ${error ? 'border-red-300' : 'border-stone-300'}
                    rounded-2xl overflow-hidden my-2 ${className} beauty_hover `}
                value={internalVal}
                onValueChange={handleDebounce}
                isDisabled={isDisabled}
                min={min}
                max={max}
                onKeyDown={handleKeyDown}
            />

            {
                internalVal && showCloseIcon &&
                <div className='left-0 absolute ' style={{ top: '50%', transform: 'translateY(-45%)' }}>
                    <IconButton onClick={() => onchange('')}>
                        {/* <HighlightOffIcon className='text-stone-800/50' /> */}
                        <Image src='/close.svg' alt='X' width={25} height={25} />
                    </IconButton>
                </div>
            }

        </div>
    );
}

export default Input_HOC;
