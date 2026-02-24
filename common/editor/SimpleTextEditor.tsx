'use client'

import React, { useRef, useEffect, useState } from 'react'

interface SimpleTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

const SimpleTextEditor = ({ 
    value = "", 
    onChange, 
    placeholder = "متن خود را اینجا بنویسید..." 
}: SimpleTextEditorProps) => {
    const [content, setContent] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update content when value prop changes
    useEffect(() => {
        setContent(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        if (onChange) {
            onChange(newContent);
        }
    };

    return (
        <div dir="rtl" className="p-0">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full p-4 min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: '1.5'
                    }}
                />
            </div>
        </div>
    )
}

export default SimpleTextEditor;