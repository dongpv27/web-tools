'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function ResizeVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

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
    setOriginalWidth(0);
    setOriginalHeight(0);
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainRatio && originalWidth > 0) {
      setHeight(Math.round((newWidth / originalWidth) * originalHeight));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainRatio && originalHeight > 0) {
      setWidth(Math.round((newHeight / originalHeight) * originalWidth));
    }
  };

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', `scale=${width}:${height}`,
        '-c:a', 'copy',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error resizing video:', error);
      throw error;
    }
  }, [file, width, height]);

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={maintainRatio}
                onChange={(e) => setMaintainRatio(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Maintain aspect ratio</span>
            </label>

            <p className="text-xs text-gray-500">
              Output resolution: {width} x {height}
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="resized.mp4"
            buttonLabel="Resize Video"
          />
        </>
      )}
    </div>
  );
}
