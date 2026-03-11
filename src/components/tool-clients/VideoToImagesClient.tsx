'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import { getFFmpeg, loadVideoFile, readOutputFile } from '@/lib/ffmpeg';
import JSZip from 'jszip';

export default function VideoToImagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [fps, setFps] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
    setSuccess(false);
    setError(null);
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const processVideo = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const ffmpeg = await getFFmpeg((ratio) => {
        setProgress(Math.round(ratio * 100));
      });
      const inputName = 'input.' + file.name.split('.').pop();

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-vf', `fps=${fps}`,
        'frame_%04d.png',
      ]);

      // Get list of generated files
      const files = await ffmpeg.listDir('/');
      const frameFiles = files.filter(f => f.name.startsWith('frame_') && f.name.endsWith('.png'));

      // Create ZIP file
      const zip = new JSZip();

      for (const frameFile of frameFiles) {
        const data = await readOutputFile(ffmpeg, frameFile.name);
        zip.file(frameFile.name, data);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'frames.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      console.error('Error extracting frames:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [file, fps]);

  const estimatedFrames = Math.ceil(duration * fps);

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
                Frames per second
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                1 = 1 frame per second, 0.5 = 1 frame every 2 seconds, 2 = 2 frames per second
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Estimated frames: <span className="font-medium">{estimatedFrames} images</span>
            </p>
          </div>

          <button
            onClick={processVideo}
            disabled={isProcessing}
            className={`w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? `Extracting... ${progress}%` : 'Extract Frames'}
          </button>

          {isProcessing && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
              Frames extracted successfully! Check your downloads folder for frames.zip
            </div>
          )}
        </>
      )}
    </div>
  );
}
