'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function ChangeVideoSpeedClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState(1);

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
    setSpeed(1);
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

      const videoFilter = `setpts=${1/speed}*PTS`;
      const audioFilter = `atempo=${speed}`;

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', videoFilter,
        '-af', audioFilter,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error changing video speed:', error);
      throw error;
    }
  }, [file, speed]);

  const getSpeedLabel = (s: number): string => {
    if (s < 1) return 'Slow Motion';
    if (s > 1) return 'Fast Forward';
    return 'Normal';
  };

  const presetSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presetSpeeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      speed === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Speed
              </label>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Effect: {getSpeedLabel(speed)}</span>
              <span className="font-medium text-gray-700">{speed}x speed</span>
            </div>

            <p className="text-xs text-gray-500">
              New duration: {(duration / speed).toFixed(1)} seconds
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="speed-changed.mp4"
            buttonLabel="Change Speed"
          />
        </>
      )}
    </div>
  );
}
