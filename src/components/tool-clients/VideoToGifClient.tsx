'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function VideoToGifClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(320);
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
      const outputName = 'output.gif';

      await loadVideoFile(ffmpeg, file, inputName);

      const scaleFilter = `scale=${width}:-1:flags=lanczos`;
      const fpsFilter = `fps=${fps}`;
      const trimFilter = startTime > 0 || endTime < duration
        ? `,trim=${startTime}:${endTime}`
        : '';
      const paletteFilter = `split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;

      const filterComplex = `${scaleFilter},${fpsFilter}${trimFilter},${paletteFilter}`;

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', filterComplex,
        '-loop', '0',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'image/gif' });
    } catch (error) {
      console.error('Error converting video to GIF:', error);
      throw error;
    }
  }, [file, fps, width, startTime, endTime, duration]);

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frame Rate (FPS)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="100"
                max="800"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                max={duration}
                step="0.1"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                max={duration}
                step="0.1"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="converted.gif"
            buttonLabel="Convert to GIF"
            mimeType="image/gif"
          />
        </>
      )}
    </div>
  );
}
