'use client';

import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  className?: string;
}

export default function DownloadButton({
  content,
  filename,
  mimeType = 'text/plain',
  className = '',
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadFile(content, filename, mimeType);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        downloaded
          ? 'bg-green-100 text-green-700 hover:bg-green-100'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      title={downloaded ? 'Downloaded!' : 'Download file'}
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download</span>
        </>
      )}
    </button>
  );
}
