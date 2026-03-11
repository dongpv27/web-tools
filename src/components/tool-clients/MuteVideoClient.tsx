'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function MuteVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);

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
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const outputName = `output.${ext}`;

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-an',
        '-c:v', 'copy',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      const mimeType = ext === 'webm' ? 'video/webm' : 'video/mp4';
      return new Blob([data], { type: mimeType });
    } catch (error) {
      console.error('Error muting video:', error);
      throw error;
    }
  }, [file]);

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
            <p className="text-sm text-gray-600">
              This will remove the audio track from your video while keeping the video quality intact.
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="muted.mp4"
            buttonLabel="Mute Video"
          />
        </>
      )}
    </div>
  );
}
