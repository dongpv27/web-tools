'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, validateVideoFile, formatFileSize } from '@/lib/ffmpeg';

interface VideoFile {
  file: File;
  id: string;
  url: string;
}

export default function MergeVideosClient() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      videos.forEach(v => URL.revokeObjectURL(v.url));
    };
  }, [videos]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const validFiles: VideoFile[] = [];

    for (const file of files) {
      const validation = validateVideoFile(file);
      if (validation.valid) {
        validFiles.push({
          file,
          id: `${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
        });
      } else {
        setError(validation.error || 'Invalid file');
      }
    }

    setVideos(prev => [...prev, ...validFiles]);
    if (e.target) e.target.value = '';
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideos(prev => {
      const video = prev.find(v => v.id === id);
      if (video) URL.revokeObjectURL(video.url);
      return prev.filter(v => v.id !== id);
    });
  }, []);

  const moveVideo = useCallback((fromIndex: number, toIndex: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      const [removed] = newVideos.splice(fromIndex, 1);
      newVideos.splice(toIndex, 0, removed);
      return newVideos;
    });
  }, []);

  const processVideo = useCallback(async (onProgress: (progress: number) => void) => {
    if (videos.length < 2) {
      setError('Please add at least 2 videos to merge');
      return null;
    }

    try {
      const ffmpeg = await getFFmpeg(onProgress);

      // Load all videos
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const inputName = `input${i}.${video.file.name.split('.').pop()}`;
        await loadVideoFile(ffmpeg, video.file, inputName);
      }

      // Create concat file
      const concatContent = videos
        .map((v, i) => `file 'input${i}.${v.file.name.split('.').pop()}'`)
        .join('\n');
      await ffmpeg.writeFile('concat.txt', concatContent);

      // Merge videos
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c', 'copy',
        'output.mp4',
      ]);

      const data = await readOutputFile(ffmpeg, 'output.mp4');
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error merging videos:', error);
      throw error;
    }
  }, [videos]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="cursor-pointer"
        >
          <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click to add videos</p>
          <p className="text-xs text-gray-400 mt-1">Add at least 2 videos to merge</p>
        </label>
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Videos to merge (in order):</p>
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
            >
              <span className="text-gray-400 cursor-grab">
                <GripVertical className="w-5 h-5" />
              </span>
              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded text-sm font-medium">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {video.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(video.file.size)}
                </p>
              </div>
              <div className="flex gap-1">
                {index > 0 && (
                  <button
                    onClick={() => moveVideo(index, index - 1)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < videos.length - 1 && (
                  <button
                    onClick={() => moveVideo(index, index + 1)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => removeVideo(video.id)}
                  className="p-1 hover:bg-gray-200 rounded text-red-500"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {videos.length >= 2 && (
        <VideoProcessor
          processVideo={processVideo}
          outputFileName="merged.mp4"
          buttonLabel="Merge Videos"
        />
      )}
    </div>
  );
}
