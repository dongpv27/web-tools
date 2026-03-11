'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';

export default function ExtractAudioClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [format, setFormat] = useState<'mp3' | 'aac' | 'wav'>('mp3');

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

  const getMimeType = (fmt: string): string => {
    switch (fmt) {
      case 'mp3': return 'audio/mpeg';
      case 'aac': return 'audio/aac';
      case 'wav': return 'audio/wav';
      default: return 'audio/mpeg';
    }
  };

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = `output.${format}`;

      await loadVideoFile(ffmpeg, file, inputName);

      const codecArgs = format === 'mp3'
        ? ['-acodec', 'libmp3lame', '-q:a', '2']
        : format === 'aac'
        ? ['-acodec', 'aac', '-b:a', '192k']
        : ['-acodec', 'pcm_s16le'];

      await ffmpeg.exec([
        '-i', inputName,
        '-vn',
        ...codecArgs,
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: getMimeType(format) });
    } catch (error) {
      console.error('Error extracting audio:', error);
      throw error;
    }
  }, [file, format]);

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
            <div className="grid grid-cols-3 gap-2">
              {(['mp3', 'aac', 'wav'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium uppercase transition-colors ${
                    format === fmt
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {format === 'mp3' && 'MP3 - Best for music, smaller file size'}
              {format === 'aac' && 'AAC - Good quality, modern format'}
              {format === 'wav' && 'WAV - Uncompressed, highest quality, large file'}
            </p>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName={`extracted.${format}`}
            buttonLabel="Extract Audio"
            mimeType={getMimeType(format)}
          />
        </>
      )}
    </div>
  );
}
