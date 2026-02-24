import { useState, useEffect } from 'react';

// تعریف نوع وضعیت برای آپلود چند فایل
interface UploadStatus {
    uploading: boolean;
    progress: number;
    speed: number;
    error: string | null;
    fileName: string | null;
    fileUrl: string | null;
}

// هوک useUpload برای چند فایل
const useUpload = (url: string | null, files: File[] | null) => {
    const [status, setStatus] = useState<UploadStatus[]>([]);

    useEffect(() => {
        let totalFiles = files?.length || 0;
        let completedFiles = 0;

        const startUpload = async (file: File, index: number) => {
            if (!url) return;

            setStatus((prevStatus) => [
                ...prevStatus,
                {
                    uploading: true,
                    progress: 0,
                    speed: 0,
                    error: null,
                    fileName: file.name,
                    fileUrl: null,
                },
            ]);

            const formData = new FormData();
            formData.append('file', file);

            let startTime: number = 0;
            let totalSize = file.size;
            let uploaded = 0;

            try {
                const request = new XMLHttpRequest();
                request.open('POST', url, true);

                request.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / totalSize) * 100;
                        const elapsedTime = (Date.now() - startTime) / 1000;
                        const uploadSpeed = (event.loaded / elapsedTime / 1024).toFixed(2); // سرعت آپلود KB/s

                        setStatus((prevStatus) => {
                            const updatedStatus = [...prevStatus];
                            updatedStatus[index] = {
                                ...updatedStatus[index],
                                progress: Math.round(percent),
                                speed: parseFloat(uploadSpeed),
                            };
                            return updatedStatus;
                        });
                    }
                };

                request.onload = () => {
                    if (request.status === 200) {
                        completedFiles++;
                        if (completedFiles === totalFiles) {
                            setStatus((prevStatus) => {
                                return prevStatus.map((status) => ({
                                    ...status,
                                    uploading: false,
                                    progress: 100,
                                    speed: 0,
                                }));
                            });
                        }
                    } else {
                        setStatus((prevStatus) => {
                            const updatedStatus = [...prevStatus];
                            updatedStatus[index] = {
                                ...updatedStatus[index],
                                uploading: false,
                                error: 'خطا در آپلود فایل',
                            };
                            return updatedStatus;
                        });
                    }
                };

                request.onerror = () => {
                    setStatus((prevStatus) => {
                        const updatedStatus = [...prevStatus];
                        updatedStatus[index] = {
                            ...updatedStatus[index],
                            uploading: false,
                            error: 'خطا در ارتباط با سرور',
                        };
                        return updatedStatus;
                    });
                };

                // شروع زمان‌سنجی
                startTime = Date.now();

                request.send(formData);
            } catch (error: any) {
                setStatus((prevStatus) => {
                    const updatedStatus = [...prevStatus];
                    updatedStatus[index] = {
                        ...updatedStatus[index],
                        uploading: false,
                        error: error.message,
                    };
                    return updatedStatus;
                });
            }
        };

        if (files) {
            files.forEach((file, index) => {
                startUpload(file, index);
            });
        }
    }, [files, url]);

    return status;
};

export default useUpload;





// import React, { useState } from 'react';
// import useUpload from './useUpload';

// const UploadComponent = () => {
//     const [files, setFiles] = useState<File[] | null>(null);
//     const url = 'YOUR_UPLOAD_URL_HERE'; // آدرس سرور برای آپلود فایل‌ها

//     const statuses = useUpload(url, files);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setFiles(Array.from(event.target.files));
//         }
//     };

//     return (
//         <div>
//             <input type="file" multiple onChange={handleFileChange} />
//             {files && files.length > 0 && (
//                 <div>
//                     <p>تعداد فایل‌ها: {files.length}</p>
//                     <ul>
//                         {files.map((file, index) => (
//                             <li key={index}>
//                                 <p>{file.name}</p>
//                                 {statuses[index] && statuses[index].uploading && (
//                                     <div>
//                                         <p>پیشرفت آپلود: {statuses[index].progress}%</p>
//                                         <p>سرعت آپلود: {statuses[index].speed} KB/s</p>
//                                     </div>
//                                 )}
//                                 {statuses[index] && statuses[index].error && (
//                                     <p style={{ color: 'red' }}>{statuses[index].error}</p>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UploadComponent;