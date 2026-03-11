'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import { getFFmpeg, loadVideoFile, readOutputFile, formatTime } from '@/lib/ffmpeg';
import JSZip from 'jszip';

interface SplitPoint {
  id: string;
  time: number;
}

export default function SplitVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [splitPoints, setSplitPoints] = useState<SplitPoint[]>([]);
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
    setSplitPoints([]);
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
    setSplitPoints([]);
    setSuccess(false);
    setError(null);
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const addSplitPoint = useCallback(() => {
    const newPoint: SplitPoint = {
      id: `${Date.now()}-${Math.random()}`,
      time: duration / 2,
    };
    setSplitPoints(prev => [...prev, newPoint].sort((a, b) => a.time - b.time));
  }, [duration]);

  const removeSplitPoint = useCallback((id: string) => {
    setSplitPoints(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateSplitPoint = useCallback((id: string, time: number) => {
    setSplitPoints(prev =>
      prev.map(p => p.id === id ? { ...p, time } : p)
        .sort((a, b) => a.time - b.time)
    );
  }, []);

  const processVideo = useCallback(async () => {
    if (!file || splitPoints.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const ffmpeg = await getFFmpeg((ratio) => {
        setProgress(Math.round(ratio * 100));
      });
      const inputName = 'input.' + file.name.split('.').pop();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';

      await loadVideoFile(ffmpeg, file, inputName);

      const points = [0, ...splitPoints.map(p => p.time), duration];
      const zip = new JSZip();

      for (let i = 0; i < points.length - 1; i++) {
        const startTime = points[i];
        const endTime = points[i + 1];
        const outputName = `part_${i + 1}.${ext}`;

        await ffmpeg.exec([
          '-i', inputName,
          '-ss', formatTime(startTime),
          '-t', formatTime(endTime - startTime),
          '-c', 'copy',
          outputName,
        ]);

        const data = await readOutputFile(ffmpeg, outputName);
        zip.file(outputName, data);

        setProgress(Math.round(((i + 1) / (points.length - 1)) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'split_videos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      console.error('Error splitting video:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [file, splitPoints, duration]);

  const segments = [0, ...splitPoints.map(p => p.time), duration].sort((a, b) => a - b);

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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Split Points</span>
              <button
                onClick={addSplitPoint}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Add Split Point
              </button>
            </div>

            {splitPoints.length === 0 ? (
              <p className="text-sm text-gray-500">
                Click "Add Split Point" to define where to split the video.
              </p>
            ) : (
              <div className="space-y-2">
                {splitPoints.map((point) => (
                  <div key={point.id} className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={duration}
                      step="0.1"
                      value={point.time}
                      onChange={(e) => updateSplitPoint(point.id, Number(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">{formatTime(point.time)}</span>
                    <button
                      onClick={() => removeSplitPoint(point.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-sm text-gray-600">
              <p>Will create {segments.length - 1} segments:</p>
              <ul className="mt-1 space-y-1">
                {Array.from({ length: segments.length - 1 }).map((_, i) => (
                  <li key={i} className="text-xs text-gray-500">
                    Part {i + 1}: {formatTime(segments[i])} - {formatTime(segments[i + 1])}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={processVideo}
            disabled={isProcessing || splitPoints.length === 0}
            className={`w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessing || splitPoints.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? `Splitting... ${progress}%` : 'Split Video'}
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
              Video split successfully! Check your downloads folder for split_videos.zip
            </div>
          )}
        </>
      )}
    </div>
  );
}
