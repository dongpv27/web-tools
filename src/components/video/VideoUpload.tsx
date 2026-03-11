'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, X, Film } from 'lucide-react';
import { validateVideoFile, formatFileSize, MAX_FILE_SIZE } from '@/lib/ffmpeg';

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  file?: File | null;
  videoUrl?: string | null;
  duration?: number;
  showPreview?: boolean;
}

export default function VideoUpload({
  onFileSelect,
  onClear,
  file,
  videoUrl,
  duration,
  showPreview = true,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        const validation = validateVideoFile(droppedFile);
        if (validation.valid) {
          onFileSelect(droppedFile);
        } else {
          setError(validation.error || 'Invalid file');
        }
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const validation = validateVideoFile(selectedFile);
        if (validation.valid) {
          onFileSelect(selectedFile);
        } else {
          setError(validation.error || 'Invalid file');
        }
      }
    },
    [onFileSelect]
  );

  const handleClear = useCallback(() => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear?.();
  }, [onClear]);

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Film className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Video
          </button>
          <p className="text-sm text-gray-500 mt-2">
            or drag and drop your video file
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max file size: 100MB (MP4, WebM, MOV, AVI, etc.)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {showPreview && videoUrl && (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-64 mx-auto"
              />
            </div>
          )}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                  {duration !== undefined && ` • ${formatDuration(duration)}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
