'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, formatFileSize } from '@/lib/ffmpeg';

export default function CompressVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [crf, setCrf] = useState(28);
  const [originalSize, setOriginalSize] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
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
    setOriginalSize(0);
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-c:v', 'libx264',
        '-crf', String(crf),
        '-preset', 'medium',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error compressing video:', error);
      throw error;
    }
  }, [file, crf]);

  const getQualityLabel = (crfValue: number): string => {
    if (crfValue <= 18) return 'High Quality';
    if (crfValue <= 23) return 'Good Quality';
    if (crfValue <= 28) return 'Balanced';
    return 'Small Size';
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

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compression Quality
              </label>
              <input
                type="range"
                min="18"
                max="35"
                value={crf}
                onChange={(e) => setCrf(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>High Quality</span>
                <span className="font-medium text-gray-700">{getQualityLabel(crf)} (CRF: {crf})</span>
                <span>Small Size</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Original size: <span className="font-medium">{formatFileSize(originalSize)}</span></p>
              <p className="text-xs text-gray-500 mt-1">Lower CRF = better quality, larger file. Higher CRF = smaller file, lower quality.</p>
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="compressed.mp4"
            buttonLabel="Compress Video"
          />
        </>
      )}
    </div>
  );
}
