'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

type OutputFormat = 'mp4' | 'webm' | 'avi' | 'mov';

export default function ConvertVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp4');

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

  const getMimeType = (format: OutputFormat): string => {
    switch (format) {
      case 'mp4': return 'video/mp4';
      case 'webm': return 'video/webm';
      case 'avi': return 'video/x-msvideo';
      case 'mov': return 'video/quicktime';
      default: return 'video/mp4';
    }
  };

  const getCodecArgs = (format: OutputFormat): string[] => {
    switch (format) {
      case 'mp4':
        return ['-c:v', 'libx264', '-c:a', 'aac'];
      case 'webm':
        return ['-c:v', 'libvpx-vp9', '-c:a', 'libopus'];
      case 'avi':
        return ['-c:v', 'mpeg4', '-c:a', 'mp3'];
      case 'mov':
        return ['-c:v', 'libx264', '-c:a', 'aac'];
      default:
        return ['-c:v', 'libx264', '-c:a', 'aac'];
    }
  };

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = `output.${outputFormat}`;

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        ...getCodecArgs(outputFormat),
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: getMimeType(outputFormat) });
    } catch (error) {
      console.error('Error converting video:', error);
      throw error;
    }
  }, [file, outputFormat]);

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
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['mp4', 'webm', 'avi', 'mov'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setOutputFormat(format)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium uppercase transition-colors ${
                    outputFormat === format
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {outputFormat === 'mp4' && 'MP4 - Most compatible, works everywhere'}
              {outputFormat === 'webm' && 'WebM - Best for web, smaller file size'}
              {outputFormat === 'avi' && 'AVI - Older format, larger file size'}
              {outputFormat === 'mov' && 'MOV - Apple format, good for editing'}
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName={`converted.${outputFormat}`}
            buttonLabel="Convert Video"
            mimeType={getMimeType(outputFormat)}
          />
        </>
      )}
    </div>
  );
}
