'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, validateVideoFile, formatFileSize } from '@/lib/ffmpeg';

export default function AddWatermarkToVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('bottom-right');
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (watermarkUrl) {
        URL.revokeObjectURL(watermarkUrl);
      }
    };
  }, [videoUrl, watermarkUrl]);

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

  const handleWatermarkSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setWatermarkFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setWatermarkUrl(url);
  }, []);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const getOverlayPosition = (): string => {
    const margin = 10;
    switch (position) {
      case 'top-left': return `${margin}:${margin}`;
      case 'top-right': return `main_w-overlay_w-${margin}:${margin}`;
      case 'bottom-left': return `${margin}:main_h-overlay_h-${margin}`;
      case 'bottom-right': return `main_w-overlay_w-${margin}:main_h-overlay_h-${margin}`;
      case 'center': return '(main_w-overlay_w)/2:(main_h-overlay_h)/2';
      default: return `main_w-overlay_w-${margin}:main_h-overlay_h-${margin}`;
    }
  };

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file || !watermarkFile) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const watermarkName = 'watermark.' + watermarkFile.name.split('.').pop();
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);
      await loadVideoFile(ffmpeg, watermarkFile, watermarkName);

      const filterComplex = `[1:v]scale=iw*${scale}:-1,format=rgba,colorchannelmixer=aa=${opacity}[overlay];[0:v][overlay]overlay=${getOverlayPosition()}`;

      await ffmpeg.exec([
        '-i', inputName,
        '-i', watermarkName,
        '-filter_complex', filterComplex,
        '-c:a', 'copy',
        '-c:v', 'libx264',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error adding watermark:', error);
      throw error;
    }
  }, [file, watermarkFile, position, opacity, scale]);

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
                Watermark Image
              </label>
              {!watermarkFile ? (
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleWatermarkSelect}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-600">Click to upload watermark image (PNG recommended)</span>
                </label>
              ) : (
                <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                  {watermarkUrl && (
                    <img src={watermarkUrl} alt="Watermark" className="w-16 h-16 object-contain" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{watermarkFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(watermarkFile.size)}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (watermarkUrl) URL.revokeObjectURL(watermarkUrl);
                      setWatermarkFile(null);
                      setWatermarkUrl(null);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      position === pos
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scale: {(scale * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity: {(opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="watermarked.mp4"
            buttonLabel="Add Watermark"
            disabled={!watermarkFile}
          />
        </>
      )}
    </div>
  );
}
