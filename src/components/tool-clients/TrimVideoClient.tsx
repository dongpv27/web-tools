'use client';

import { useState, useCallback, useEffect } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoPreview from '@/components/video/VideoPreview';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, formatTime } from '@/lib/ffmpeg';
import { secondsToHMS, hmsToSeconds } from '@/lib/timecode';

export default function TrimVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  // Draft strings let the user type a partial timecode without the value
  // being clamped/reformatted on every keystroke. Committed on blur/Enter.
  const [startDraft, setStartDraft] = useState('00:00:00');
  const [endDraft, setEndDraft] = useState('00:00:00');

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
    setStartTime(0);
    setEndTime(0);
    setStartDraft('00:00:00');
    setEndDraft('00:00:00');
  }, [videoUrl]);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
    setEndTime(dur);
    setEndDraft(secondsToHMS(dur));
  }, []);

  // Commit a draft timecode: parse, clamp to [0, duration] and the other
  // bound, then re-sync both the numeric value and the formatted draft.
  const commitStart = useCallback(() => {
    const parsed = hmsToSeconds(startDraft);
    if (parsed === null) {
      setStartDraft(secondsToHMS(startTime));
      return;
    }
    let val = Math.min(Math.max(0, parsed), duration);
    let nextEnd = endTime;
    if (val >= endTime) {
      nextEnd = Math.min(val + 1, duration);
      if (val >= nextEnd) val = Math.max(nextEnd - 1, 0);
      setEndTime(nextEnd);
      setEndDraft(secondsToHMS(nextEnd));
    }
    setStartTime(val);
    setStartDraft(secondsToHMS(val));
  }, [startDraft, startTime, endTime, duration]);

  const commitEnd = useCallback(() => {
    const parsed = hmsToSeconds(endDraft);
    if (parsed === null) {
      setEndDraft(secondsToHMS(endTime));
      return;
    }
    let val = Math.min(Math.max(0, parsed), duration);
    let nextStart = startTime;
    if (val <= startTime) {
      nextStart = Math.max(val - 1, 0);
      if (val <= nextStart) val = Math.min(nextStart + 1, duration);
      setStartTime(nextStart);
      setStartDraft(secondsToHMS(nextStart));
    }
    setEndTime(val);
    setEndDraft(secondsToHMS(val));
  }, [endDraft, startTime, endTime, duration]);

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (!file) return null;

    try {
      const ffmpeg = await getFFmpeg(onProgress);
      const inputName = 'input.' + file.name.split('.').pop();
      const outputName = 'output.' + file.name.split('.').pop();

      await loadVideoFile(ffmpeg, file, inputName);

      await ffmpeg.exec([
        '-i', inputName,
        '-ss', formatTime(startTime),
        '-t', formatTime(endTime - startTime),
        '-c', 'copy',
        outputName,
      ]);

      const data = await readOutputFile(ffmpeg, outputName);
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const mimeType = ext === 'webm' ? 'video/webm' : 'video/mp4';
      return new Blob([data], { type: mimeType });
    } catch (error) {
      console.error('Error trimming video:', error);
      throw error;
    }
  }, [file, startTime, endTime]);

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
            startTime={startTime}
            endTime={endTime}
          />

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="hh:mm:ss"
                  value={startDraft}
                  onChange={(e) => setStartDraft(e.target.value)}
                  onBlur={commitStart}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  className="w-full px-3 py-2 font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">format hh:mm:ss</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="hh:mm:ss"
                  value={endDraft}
                  onChange={(e) => setEndDraft(e.target.value)}
                  onBlur={commitEnd}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  className="w-full px-3 py-2 font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">format hh:mm:ss</p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Duration: <span className="font-medium">{formatTime(endTime - startTime)}</span></p>
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="trimmed.mp4"
            buttonLabel="Trim Video"
          />
        </>
      )}
    </div>
  );
}
