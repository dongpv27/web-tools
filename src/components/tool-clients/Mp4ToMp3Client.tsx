'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function Mp4ToMp3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [quality, setQuality] = useState(2);

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
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.mp3';

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-vn',
        '-acodec', 'libmp3lame',
        '-q:a', String(quality),
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Error converting to MP3:', error);
      throw error;
    }
  }, [file, quality]);

  const getQualityLabel = (q: number): string => {
    if (q <= 2) return 'High (245 kbps)';
    if (q <= 4) return 'Standard (165 kbps)';
    return 'Low (100 kbps)';
  };

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
              Audio Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>High (245 kbps)</option>
              <option value={4}>Standard (165 kbps)</option>
              <option value={6}>Low (100 kbps)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {getQualityLabel(quality)}
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="converted.mp3"
            buttonLabel="Convert to MP3"
            mimeType="audio/mpeg"
          />
        </>
      )}
    </div>
  );
}
