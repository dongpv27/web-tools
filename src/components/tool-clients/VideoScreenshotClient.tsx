'use client';

import { useState, useRef } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';

export default function VideoScreenshotClient() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setScreenshot(null);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    setScreenshot(dataUrl);
  };

  const downloadScreenshot = () => {
    if (!screenshot) return;

    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `screenshot-${Math.round(currentTime)}s.png`;
    link.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="video/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <div className="text-gray-600 mb-2">Click to select a video</div>
            <div className="text-sm text-gray-400">Supports MP4, WebM, MOV (max 100MB)</div>
          </div>
        </button>
      </div>

      {/* Video Preview */}
      {videoSrc && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full max-h-[400px]"
              controls
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Timeline Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline: {formatTime(currentTime)} / {formatTime(duration)}
            </label>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => seekTo(0)}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Start
            </button>
            <button
              onClick={() => seekTo(duration * 0.25)}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              25%
            </button>
            <button
              onClick={() => seekTo(duration * 0.5)}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              50%
            </button>
            <button
              onClick={() => seekTo(duration * 0.75)}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              75%
            </button>
            <button
              onClick={() => seekTo(duration)}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              End
            </button>
          </div>

          {/* Capture Button */}
          <button
            onClick={captureFrame}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Capture Screenshot
          </button>
        </div>
      )}

      {/* Screenshot Result */}
      {screenshot && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Screenshot</label>
            <span className="text-sm text-gray-500">at {formatTime(currentTime)}</span>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <img src={screenshot} alt="Screenshot" className="max-w-full mx-auto rounded" />
          </div>
          <button
            onClick={downloadScreenshot}
            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Screenshot
          </button>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Navigate to the desired frame using the video player or timeline slider, then click "Capture Screenshot" to save the current frame as a PNG image.</p>
      </div>
    </div>
  );
}
