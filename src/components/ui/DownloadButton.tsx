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
      className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
        downloaded
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      title={downloaded ? 'Downloaded!' : 'Download file'}
    >
      {downloaded ? (
        <Check className="w-4 h-4" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </button>
  );
}
