import { useState, useEffect } from 'react';

// تعریف نوع وضعیت هوک
interface DownloadStatus {
    downloading: boolean;
    progress: number;
    speed: number;
    error: string | null;
    fileUrl: string | null;
    fileName: string | null;
}

// هوک useDownload با TypeScript
const useDownload = (url: string | null) => {


    const [status, setStatus] = useState<DownloadStatus>({
        downloading: false,
        progress: 0,
        speed: 0,
        error: null,
        fileUrl: null,
        fileName: null,
    });

    useEffect(() => {

        let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
        let startTime: number = 0;
        let totalSize = 0;
        let loaded = 0;
        let blobParts: Uint8Array[] = [];
        let downloadSpeedInterval: NodeJS.Timeout | null = null;

        const startDownload = async () => {
            if (!url) return;

            setStatus((prevStatus) => ({ ...prevStatus, downloading: true }));

            try {
                const response = await fetch(url);

                if (!response.ok) throw new Error('خطا در دانلود فایل')

                totalSize = parseInt(response.headers.get('Content-Length') || '0', 10); // دریافت حجم کل فایل
                startTime = Date.now(); // زمان شروع دانلود
                const contentType = response.headers.get('Content-Type') || '';
                reader = response.body?.getReader() || null;

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        blobParts.push(value);
                        loaded += value.length;

                        // محاسبه پیشرفت دانلود
                        const percent = Math.round((loaded / totalSize) * 100);
                        const elapsedTime = (Date.now() - startTime) / 1000;
                        const downloadSpeed = (loaded / elapsedTime / 1024).toFixed(2); // سرعت دانلود KB/s

                        // به‌روزرسانی وضعیت
                        setStatus((prevStatus) => ({ ...prevStatus, progress: percent, speed: parseFloat(downloadSpeed) }));
                    }

                    const blob = new Blob(blobParts, { type: contentType });

                    // ساخت URL برای دانلود فایل
                    const fileUrl = window.URL.createObjectURL(blob);
                    const fileName = url.split('/').pop() || 'file.zip'; // نام فایل از URL استخراج می‌شود

                    // به‌روزرسانی وضعیت با URL فایل و نام فایل
                    setStatus((prevStatus) => ({
                        ...prevStatus,
                        downloading: false,
                        progress: 100,
                        speed: 0,
                        fileUrl,
                        fileName,
                    }));
                }
            } catch (error: any) {
                setStatus((prevStatus) => ({
                    ...prevStatus,
                    downloading: false,
                    error: error.message,
                }));
            }
        };

        if (url) {
            startDownload();
        }

        return () => {
            if (reader) {
                reader.cancel(); // اگر کامپوننت حذف شد، عملیات دانلود لغو می‌شود
            }
        };
    }, [url]);

    const downloadFile = () => {
        if (status.fileUrl) {
            const a = document.createElement('a');
            a.href = status.fileUrl;
            a.download = status.fileName || 'file.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(status.fileUrl); // آزاد کردن منابع
        }
    };

    return { ...status, downloadFile };
};

export default useDownload;




// import React from 'react';
// import useDownload from './useDownload';

// const DownloadComponent = () => {
//   const { downloading, progress, speed, error, fileUrl, downloadFile } = useDownload('YOUR_FILE_URL_HERE');

//   return (
//     <div>
//       <button onClick={downloadFile} disabled={downloading}>
//         {downloading ? 'در حال دانلود...' : 'دانلود فایل'}
//       </button>

//       {downloading && (
//         <div>
//           <p>پیشرفت دانلود: {progress}%</p>
//           <p>سرعت دانلود: {speed} KB/s</p>
//         </div>
//       )}

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default DownloadComponent;