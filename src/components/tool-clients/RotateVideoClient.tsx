'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function RotateVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [rotation, setRotation] = useState(90);

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

  const getTransposeValue = (degrees: number): number => {
    switch (degrees) {
      case 90: return 1;
      case 180: return 0; // Will use hflip,vflip
      case 270: return 2;
      default: return 1;
    }
  };

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);

      if (rotation === 180) {
        await ffmpeg.exec([
          '-i', inputName,
          '-vf', 'hflip,vflip',
          '-c:a', 'copy',
          outputName,
        ]);
      } else {
        await ffmpeg.exec([
          '-i', inputName,
          '-vf', `transpose=${getTransposeValue(rotation)}`,
          '-c:a', 'copy',
          outputName,
        ]);
      }

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error rotating video:', error);
      throw error;
    }
  }, [file, rotation]);

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation Angle
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setRotation(angle)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rotation === angle
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: Rotate {rotation}° clockwise
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="rotated.mp4"
            buttonLabel="Rotate Video"
          />
        </>
      )}
    </div>
  );
}
