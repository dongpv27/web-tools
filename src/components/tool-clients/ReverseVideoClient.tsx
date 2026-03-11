'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function ReverseVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [reverseAudio, setReverseAudio] = useState(true);

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
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);

      if (reverseAudio) {
        await ffmpeg.exec([
          '-i', inputName,
          '-vf', 'reverse',
          '-af', 'areverse',
          '-c:v', 'libx264',
          '-c:a', 'aac',
          outputName,
        ]);
      } else {
        await ffmpeg.exec([
          '-i', inputName,
          '-vf', 'reverse',
          '-an',
          '-c:v', 'libx264',
          outputName,
        ]);
      }

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error reversing video:', error);
      throw error;
    }
  }, [file, reverseAudio]);

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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={reverseAudio}
                onChange={(e) => setReverseAudio(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Also reverse audio</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {reverseAudio
                ? 'Both video and audio will play backwards'
                : 'Only video will be reversed, audio will be removed'}
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="reversed.mp4"
            buttonLabel="Reverse Video"
          />
        </>
      )}
    </div>
  );
}
