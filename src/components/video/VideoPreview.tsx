'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl: string;
  onDurationChange?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  startTime?: number;
  endTime?: number;
  showTimeline?: boolean;
  className?: string;
}

export default function VideoPreview({
  videoUrl,
  onDurationChange,
  onTimeUpdate,
  startTime = 0,
  endTime,
  showTimeline = true,
  className = '',
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onDurationChange?.(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onDurationChange, onTimeUpdate]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const effectiveEndTime = endTime ?? duration;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-64 mx-auto"
          onClick={togglePlay}
        />
      </div>

      {showTimeline && (
        <div className="bg-gray-100 rounded-lg p-3 space-y-2">
          {/* Timeline Slider */}
          <input
            type="range"
            min={startTime}
            max={effectiveEndTime}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-700" />
                ) : (
                  <Play className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-700" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(effectiveEndTime)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
