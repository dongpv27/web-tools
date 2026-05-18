'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, formatFileSize } from '@/lib/ffmpeg';

interface Position {
  x: number;
  y: number;
}

const PRESETS: Record<string, Position> = {
  'top-left': { x: 10, y: 10 },
  top: { x: 50, y: 10 },
  'top-right': { x: 90, y: 10 },
  left: { x: 10, y: 50 },
  center: { x: 50, y: 50 },
  right: { x: 90, y: 50 },
  'bottom-left': { x: 10, y: 90 },
  bottom: { x: 50, y: 90 },
  'bottom-right': { x: 90, y: 90 },
};

export default function AddWatermarkToVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkUrl, setWatermarkUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.2);
  const [pos, setPos] = useState<Position>({ x: 90, y: 90 });

  const previewRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (watermarkUrl) URL.revokeObjectURL(watermarkUrl);
    };
  }, [videoUrl, watermarkUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setVideoUrl(URL.createObjectURL(selectedFile));
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
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
    setWatermarkUrl(URL.createObjectURL(selectedFile));
  }, []);

  const handleLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setDuration(e.currentTarget.duration);
    },
    [],
  );

  // --- drag-to-position handlers (watermark center follows the pointer) ---

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const box = previewRef.current?.getBoundingClientRect();
    if (!box) return;
    const offset = dragOffsetRef.current || { dx: 0, dy: 0 };
    const localX = clientX - box.left - offset.dx;
    const localY = clientY - box.top - offset.dy;
    setPos({
      x: clamp((localX / box.width) * 100),
      y: clamp((localY / box.height) * 100),
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    dragOffsetRef.current = {
      dx: e.clientX - (box.left + box.width / 2),
      dy: e.clientY - (box.top + box.height / 2),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragOffsetRef.current = null;
  }, []);

  const handleVideoClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!watermarkUrl) return;
      if ((e.target as HTMLElement).closest('[data-watermark-overlay]')) return;
      dragOffsetRef.current = { dx: 0, dy: 0 };
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer, watermarkUrl],
  );

  // --- ffmpeg ---

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file || !watermarkFile) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const watermarkName = 'watermark.' + watermarkFile.name.split('.').pop();
      const outputName = 'output.mp4';

      await loadVideoFile(ffmpeg, file, inputName);
      await loadVideoFile(ffmpeg, watermarkFile, watermarkName);

      // pos.x / pos.y are the center of the watermark as % of main video.
      // FFmpeg overlay expects top-left of the overlay relative to main.
      const px = (pos.x / 100).toFixed(4);
      const py = (pos.y / 100).toFixed(4);
      const overlayX = `main_w*${px}-overlay_w/2`;
      const overlayY = `main_h*${py}-overlay_h/2`;

      const filterComplex =
        `[1:v]scale=iw*${scale}:-1,format=rgba,colorchannelmixer=aa=${opacity}[wm];` +
        `[0:v][wm]overlay=${overlayX}:${overlayY}`;

      await ffmpeg.exec([
        '-i', inputName,
        '-i', watermarkName,
        '-filter_complex', filterComplex,
        '-c:a', 'copy',
        '-c:v', 'libx264',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      if (data.byteLength === 0) {
        throw new Error(
          'Output is empty — FFmpeg overlay likely failed. Check the browser console for the FFmpeg log line(s).',
        );
      }
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error adding watermark:', error);
      throw error;
    }
  }, [file, watermarkFile, pos, opacity, scale]);

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
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              {watermarkUrl
                ? 'Drag the watermark or click anywhere on the video to place it.'
                : 'Upload a watermark below; once uploaded you can drag it on the preview.'}
            </p>
            <div
              ref={previewRef}
              className="relative rounded-lg overflow-hidden bg-black select-none"
              onClick={handleVideoClick}
            >
              <video
                src={videoUrl}
                className="w-full max-h-80 mx-auto block"
                onLoadedMetadata={handleLoadedMetadata}
                controls
                playsInline
              />
              {watermarkUrl && (
                <div
                  data-watermark-overlay
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute touch-none cursor-move ring-2 ring-blue-400/70 pointer-events-auto"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${scale * 100}%`,
                    opacity,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watermarkUrl}
                    alt="Watermark preview"
                    draggable={false}
                    className="w-full h-auto block pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

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
                  <span className="text-sm text-gray-600">
                    Click to upload watermark image (PNG recommended)
                  </span>
                </label>
              ) : (
                <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                  {watermarkUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={watermarkUrl} alt="Watermark image to overlay on video" className="w-16 h-16 object-contain" />
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <span className="text-xs text-gray-500">
                  {pos.x.toFixed(0)}%, {pos.y.toFixed(0)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-w-xs">
                {Object.entries(PRESETS).map(([name, value]) => {
                  const active = Math.abs(pos.x - value.x) < 0.5 && Math.abs(pos.y - value.y) < 0.5;
                  return (
                    <button
                      key={name}
                      onClick={() => setPos(value)}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={`Move watermark to ${name.replace('-', ' ')}`}
                    >
                      {name.replace('-', ' ')}
                    </button>
                  );
                })}
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
