'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import { getFFmpeg, loadVideoFile, readOutputFile, formatTime } from '@/lib/ffmpeg';

export default function VideoThumbnailClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [timestamp, setTimestamp] = useState(1);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [videoUrl, thumbnail]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
    setThumbnail(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    if (thumbnail) {
      URL.revokeObjectURL(thumbnail);
    }
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
    setThumbnail(null);
    setError(null);
  }, [videoUrl, thumbnail]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
    setTimestamp(Math.min(1, dur / 2));
  }, []);

  const extractThumbnail = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setThumbnail(null);

    try {
      const ffmpeg = await getFFmpeg();
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'thumbnail.png';

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-ss', formatTime(timestamp),
        '-vframes', '1',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      const blob = new Blob([data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setThumbnail(url);
    } catch (err) {
      console.error('Error extracting thumbnail:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [file, timestamp]);

  const downloadThumbnail = useCallback(() => {
    if (!thumbnail) return;

    const link = document.createElement('a');
    link.href = thumbnail;
    link.download = 'thumbnail.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [thumbnail]);

  return (
    <div className="space-y-6">
      <VideoUpload
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        file={file}
        videoUrl={videoUrl}
        duration={duration}
        showPreview={false}
      />

      {videoUrl && (
        <>
          <VideoPreview
            videoUrl={videoUrl}
            onDurationChange={handleDurationChange}
          />

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timestamp (seconds)
            </label>
            <input
              type="number"
              min="0"
              max={duration}
              step="0.1"
              value={timestamp}
              onChange={(e) => setTimestamp(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current: {formatTime(timestamp)}
            </p>
          </div>

          <button
            onClick={extractThumbnail}
            disabled={isProcessing}
            className={`w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Extracting...' : 'Extract Thumbnail'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {thumbnail && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <img src={thumbnail} alt="Thumbnail" className="max-w-full mx-auto rounded" />
              </div>
              <button
                onClick={downloadThumbnail}
                className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Thumbnail
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
