'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import { getFFmpeg, loadVideoFile, readOutputFile, formatTime } from '@/lib/ffmpeg';
import JSZip from 'jszip';

export default function VideoFrameExtractorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [frameInput, setFrameInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      extractedFrames.forEach(url => URL.revokeObjectURL(url));
    };
  }, [videoUrl, extractedFrames]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
    setSuccess(false);
    setError(null);
    setExtractedFrames([]);
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    extractedFrames.forEach(url => URL.revokeObjectURL(url));
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
    setSuccess(false);
    setError(null);
    setExtractedFrames([]);
  }, [videoUrl, extractedFrames]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  const parseFrames = (): number[] => {
    const frames: number[] = [];
    const parts = frameInput.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            frames.push(i);
          }
        }
      } else {
        const frame = parseInt(part);
        if (!isNaN(frame)) {
          frames.push(frame);
        }
      }
    }

    return [...new Set(frames)].sort((a, b) => a - b);
  };

  const processVideo = useCallback(async () => {
    if (!file) return;

    const frameNumbers = parseFrames();
    if (frameNumbers.length === 0) {
      setError('Please enter valid frame numbers');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    // Clear previous frames
    extractedFrames.forEach(url => URL.revokeObjectURL(url));
    setExtractedFrames([]);

    try {
      const ffmpeg = await getFFmpeg();
      const inputName = 'input.' + file.name.split('.').pop();

      await loadVideoFile(ffmpeg, file, inputName);

      const newFrameUrls: string[] = [];
      const zip = new JSZip();

      for (let i = 0; i < frameNumbers.length; i++) {
        const frameNum = frameNumbers[i];
        const outputName = `frame_${frameNum}.png`;

        await ffmpeg.exec([
          '-i', inputName,
          '-vf', `select=eq(n\\,${frameNum})`,
          '-vframes', '1',
          outputName,
        ]);

        const data = await readOutputFile(ffmpeg, outputName);
        const blob = new Blob([data], { type: 'image/png' });
        newFrameUrls.push(URL.createObjectURL(blob));
        zip.file(outputName, data);

        setProgress(Math.round(((i + 1) / frameNumbers.length) * 100));
      }

      setExtractedFrames(newFrameUrls);

      // Download as ZIP if multiple frames
      if (frameNumbers.length > 1) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'frames.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error extracting frames:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [file, frameInput, extractedFrames]);

  const downloadSingleFrame = useCallback((url: string, frameNum: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `frame_${frameNum}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const frameNumbers = parseFrames();

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
                Frame Numbers
              </label>
              <input
                type="text"
                value={frameInput}
                onChange={(e) => setFrameInput(e.target.value)}
                placeholder="e.g., 1, 10, 25 or 1-10, 20, 30-35"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter frame numbers separated by commas, or ranges like 1-10
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>Frames to extract: <span className="font-medium">{frameNumbers.length}</span></p>
              {frameNumbers.length > 0 && frameNumbers.length <= 10 && (
                <p className="text-xs text-gray-500 mt-1">
                  Frame numbers: {frameNumbers.join(', ')}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={processVideo}
            disabled={isProcessing || frameNumbers.length === 0}
            className={`w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors ${
              isProcessing || frameNumbers.length === 0
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
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {extractedFrames.length > 1
                  ? 'Frames extracted! Check your downloads for frames.zip'
                  : 'Frame extracted successfully!'}
              </div>

              {extractedFrames.length === 1 && (
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <img src={extractedFrames[0]} alt="Extracted frame" className="max-w-full mx-auto rounded" />
                  </div>
                  <button
                    onClick={() => downloadSingleFrame(extractedFrames[0], frameNumbers[0])}
                    className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download Frame
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
