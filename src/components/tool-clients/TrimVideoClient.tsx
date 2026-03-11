'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, formatTime } from '@/lib/ffmpeg';

export default function TrimVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
    setEndTime(dur);
  }, []);

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.' + file.name.split('.').pop();

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-ss', formatTime(startTime),
        '-t', formatTime(endTime - startTime),
        '-c', 'copy',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const mimeType = ext === 'webm' ? 'video/webm' : 'video/mp4';
      return new Blob([data], { type: mimeType });
    } catch (error) {
      console.error('Error trimming video:', error);
      throw error;
    }
  }, [file, startTime, endTime]);

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
            startTime={startTime}
            endTime={endTime}
          />

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="number"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setStartTime(val);
                    if (val >= endTime) {
                      setEndTime(Math.min(val + 1, duration));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formatTime(startTime)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="number"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEndTime(val);
                    if (val <= startTime) {
                      setStartTime(Math.max(val - 1, 0));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formatTime(endTime)}</p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Duration: <span className="font-medium">{formatTime(endTime - startTime)}</span></p>
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="trimmed.mp4"
            buttonLabel="Trim Video"
          />
        </>
      )}
    </div>
  );
}
