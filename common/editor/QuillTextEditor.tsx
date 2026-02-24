// 'use client'

// import React, { useRef, useEffect, useState } from 'react'
// import Quill from 'quill'
// import 'quill/dist/quill.snow.css'

// interface QuillTextEditorProps {
//     value?: string;
//     onChange?: (value: string) => void;
//     placeholder?: string;
//     defaultDirection?: 'rtl' | 'ltr';
//     defaultAlign?: 'left' | 'center' | 'right' | 'justify';
// }

// const QuillTextEditor = ({
//     value = "",
//     onChange,
//     placeholder = "متن خود را اینجا بنویسید...",
//     defaultDirection = 'rtl',
//     defaultAlign = 'right'
// }: QuillTextEditorProps) => {

//     console.log('text value in editor :', value);

//     const quillRef = useRef<Quill | null>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const isInitialized = useRef(false);
//     const isInternalChange = useRef(false);
//     const lastValueRef = useRef<string>('');
//     const [direction, setDirection] = useState<'rtl' | 'ltr'>(defaultDirection);

//     // Handle direction change
//     const handleDirectionChange = (newDirection: 'rtl' | 'ltr') => {
//         setDirection(newDirection);
//         if (quillRef.current) {
//             quillRef.current.format('direction', newDirection);
//             quillRef.current.root.setAttribute('dir', newDirection);
//         }
//     }; 


//     useEffect(() => {
//         if (containerRef.current && !quillRef.current) {
//             // Initialize Quill editor
//             quillRef.current = new Quill(containerRef.current, {
//                 theme: 'snow',
//                 placeholder: placeholder,
//                 modules: {
//                     toolbar: [
//                         [{ 'header': [1, 2, 3, false] }],
//                         ['bold', 'italic', 'underline', 'strike'],
//                         [{ 'color': [] }, { 'background': [] }],
//                         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                         [{ 'align': [] }],
//                         ['clean']
//                     ]
//                 }
//             });

//             // Set initial direction and alignment
//             quillRef.current.format('direction', direction);
//             quillRef.current.root.setAttribute('dir', direction);
//             quillRef.current.format('align', defaultAlign); // Set default alignment

//             // Set initial content using Quill's API
//             if (value) {
//                 isInternalChange.current = true;
//                 quillRef.current.clipboard.dangerouslyPasteHTML(value);
//                 lastValueRef.current = value;
//                 setTimeout(() => {
//                     isInternalChange.current = false;
//                 }, 0);
//             }

//             // Handle text changes
//             quillRef.current.on('text-change', () => {
//                 if (!isInternalChange.current) {
//                     const content = quillRef.current?.root.innerHTML || '';
//                     lastValueRef.current = content;
//                     if (onChange) {
//                         onChange(content);
//                     }
//                 }
//             });

//             // Handle direction changes from toolbar
//             quillRef.current.on('selection-change', (range) => {
//                 if (range && quillRef.current) {
//                     const formats = quillRef.current.getFormat(range);
//                     if (formats.direction && (formats.direction === 'rtl' || formats.direction === 'ltr') && formats.direction !== direction) {
//                         setDirection(formats.direction);
//                         quillRef.current.root.setAttribute('dir', formats.direction);
//                     }
//                 }
//             });

//             isInitialized.current = true;
//         }

//         return () => {
//             if (quillRef.current) {
//                 quillRef.current.off('text-change');
//                 quillRef.current.off('selection-change');
//                 quillRef.current = null;
//                 isInitialized.current = false;
//             }
//         };
//     }, []); // Remove placeholder from dependencies to prevent re-initialization

//     // Update content when value prop changes
//     useEffect(() => {
//         if (quillRef.current && isInitialized.current && value !== undefined) {
//             const currentContent = quillRef.current.root.innerHTML;

//             // Check if the current content is different from the new value
//             // Use lastValueRef to avoid unnecessary updates
//             if (value !== lastValueRef.current) {
//                 // Only update if the editor is not focused to avoid interrupting user input
//                 // But allow updates if the value is coming from backend (different from last tracked value)
//                 if (!quillRef.current.hasFocus() || value !== currentContent) {
//                     isInternalChange.current = true;
//                     quillRef.current.clipboard.dangerouslyPasteHTML(value);
//                     lastValueRef.current = value;
//                     setTimeout(() => {
//                         isInternalChange.current = false;
//                     }, 0);
//                 }
//             }
//         }
//     }, [value]);

//     return (
//         <div dir={direction} className="p-0  border-red-400">
//             <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
//                 <div ref={containerRef} style={{ minHeight: '200px' }} className=" border-red-500" />
//             </div>
//         </div>
//     );
// }

// export default QuillTextEditor;


'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface QuillTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    defaultDirection?: 'rtl' | 'ltr';
    defaultAlign?: 'left' | 'center' | 'right' | 'justify';
}

const QuillTextEditor = ({
    value = "",
    onChange,
    placeholder = "",
    defaultDirection = 'rtl',
    defaultAlign = 'right'
}: QuillTextEditorProps) => {

    // console.log('text value in editor:', value);

    const quillRef = useRef<Quill | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const isInternalChange = useRef(false);
    const lastValueRef = useRef<string>('');
    const [direction, setDirection] = useState<'rtl' | 'ltr'>(defaultDirection);

    // Handle direction change
    const handleDirectionChange = useCallback((newDirection: 'rtl' | 'ltr') => {
        setDirection(newDirection);
        if (quillRef.current) {
            quillRef.current.format('direction', newDirection);
            quillRef.current.root.setAttribute('dir', newDirection);
        }
    }, []);

    useEffect(() => {
        if (containerRef.current && !quillRef.current) {
            // Initialize Quill editor
            quillRef.current = new Quill(containerRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['clean']
                    ]
                }
            });

            // Set initial direction and alignment
            quillRef.current.format('direction', direction);
            quillRef.current.root.setAttribute('dir', direction);
            quillRef.current.format('align', defaultAlign); // Set default alignment

            // Set initial content using Quill's API
            if (value) {
                isInternalChange.current = true;
                quillRef.current.clipboard.dangerouslyPasteHTML(value);
                lastValueRef.current = value;
                setTimeout(() => {
                    isInternalChange.current = false;
                }, 0);
            }

            // Handle text changes
            quillRef.current.on('text-change', () => {
                if (!isInternalChange.current) {
                    const content = quillRef.current?.root.innerHTML || '';
                    lastValueRef.current = content;
                    if (onChange) {
                        onChange(content);
                    }
                }
            });

            // Handle direction changes from toolbar
            quillRef.current.on('selection-change', (range) => {
                if (range && quillRef.current) {
                    const formats = quillRef.current.getFormat(range);
                    if (formats.direction && (formats.direction === 'rtl' || formats.direction === 'ltr') && formats.direction !== direction) {
                        setDirection(formats.direction);
                        quillRef.current.root.setAttribute('dir', formats.direction);
                    }
                }
            });

            isInitialized.current = true;
        }

        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change');
                quillRef.current.off('selection-change');
                quillRef.current = null;
                isInitialized.current = false;
            }
        };
    }, []); // Only initialize once

    // Update content when value prop changes
    useEffect(() => {
        if (quillRef.current && isInitialized.current && value !== undefined) {
            const currentContent = quillRef.current.root.innerHTML;

            // Check if the current content is different from the new value
            // Use lastValueRef to avoid unnecessary updates
            if (value !== lastValueRef.current && value !== currentContent) {
                // Only update if the editor is not focused to avoid interrupting user input
                if (!quillRef.current.hasFocus()) {
                    isInternalChange.current = true;
                    quillRef.current.clipboard.dangerouslyPasteHTML(value);
                    lastValueRef.current = value;
                    setTimeout(() => {
                        isInternalChange.current = false;
                    }, 0);
                }
            }
        }
    }, [value]); // Only trigger when value changes

    return (
        <div dir={direction} className="p-0 border-red-400">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden" >
                <div ref={containerRef} style={{ minHeight: '200px' }} className="border-red-500"  />
            </div>
        </div>
    );
}

export default QuillTextEditor;
