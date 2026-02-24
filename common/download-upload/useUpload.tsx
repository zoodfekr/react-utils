import { useState, useEffect } from 'react';

interface UploadStatus {
    uploading: boolean;
    progress: number;
    speed: number;
    error: string | null;
    fileName: string | null;
}

const useUpload = (url: string | null, file: File | null) => {
    const [status, setStatus] = useState<UploadStatus>({
        uploading: false,
        progress: 0,
        speed: 0,
        error: null,
        fileName: null,
    });

    useEffect(() => {
        let startTime: number = 0;
        let totalSize = file ? file.size : 0;
        let uploaded = 0;
        let intervalId: NodeJS.Timeout | null = null;

        const startUpload = async () => {
            if (!url || !file) return;

            setStatus((prevStatus) => ({ ...prevStatus, uploading: true, fileName: file.name }));

            try {
                const formData = new FormData();
                formData.append('file', file);

                // شروع زمان‌سنجی
                startTime = Date.now();

                const request = new XMLHttpRequest();
                request.open('POST', url, true);

                // تنظیم ایونت پیشرفت برای پیگیری آپلود
                request.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / totalSize) * 100;
                        const elapsedTime = (Date.now() - startTime) / 1000;
                        const uploadSpeed = (event.loaded / elapsedTime / 1024).toFixed(2); // سرعت آپلود KB/s

                        // به‌روزرسانی وضعیت
                        setStatus((prevStatus) => ({
                            ...prevStatus,
                            progress: Math.round(percent),
                            speed: parseFloat(uploadSpeed),
                        }));
                    }
                };

                request.onload = () => {
                    if (request.status === 200) {
                        // آپلود موفقیت‌آمیز
                        setStatus((prevStatus) => ({
                            ...prevStatus,
                            uploading: false,
                            progress: 100,
                            speed: 0,
                        }));
                    } else {
                        throw new Error('خطا در آپلود فایل');
                    }
                };

                request.onerror = () => {
                    setStatus((prevStatus) => ({
                        ...prevStatus,
                        uploading: false,
                        error: 'خطا در ارتباط با سرور',
                    }));
                };

                // ارسال داده‌ها به سرور
                request.send(formData);
            } catch (error: any) {
                setStatus((prevStatus) => ({
                    ...prevStatus,
                    uploading: false,
                    error: error.message,
                }));
            }
        };

        if (file && url) {
            startUpload();
        }

        return () => {
            if (intervalId) clearInterval(intervalId); // در صورت نیاز، می‌توانید تایمر را پاک کنید.
        };
    }, [file, url]);

    return status;
};

export default useUpload;







// import React, { useState } from 'react';
// import useUpload from './useUpload';

// const UploadComponent = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const url = 'YOUR_UPLOAD_URL_HERE'; // آدرس آپلود فایل

//   const { uploading, progress, speed, error, fileName } = useUpload(url, file);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={() => file && setFile(file)} disabled={uploading}>
//         {uploading ? 'در حال آپلود...' : 'آپلود فایل'}
//       </button>

//       {uploading && (
//         <div>
//           <p>پیشرفت آپلود: {progress}%</p>
//           <p>سرعت آپلود: {speed} KB/s</p>
//         </div>
//       )}

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {fileName && !uploading && <p>فایل انتخابی: {fileName}</p>}
//     </div>
//   );
// };

// export default UploadComponent;