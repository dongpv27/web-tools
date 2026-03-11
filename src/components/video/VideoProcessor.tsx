'use client';

import { useState, useCallback } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface VideoProcessorProps {
  processVideo: (onProgress: (progress: number) => void) => Promise<Blob | null>;
  outputFileName: string;
  disabled?: boolean;
  buttonLabel?: string;
  mimeType?: string;
}

export default function VideoProcessor({
  processVideo,
  outputFileName,
  disabled = false,
  buttonLabel = 'Process Video',
  mimeType = 'video/mp4',
}: VideoProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleProcess = useCallback(async () => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);
    setResult(null);

    try {
      const blob = await processVideo((p) => {
        setProgress(Math.round(p * 100));
      });

      if (blob) {
        setResult(blob);
        setSuccess(true);
      } else {
        setError('Processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  }, [processVideo]);

  const handleDownload = useCallback(() => {
    if (!result) return;

    const url = URL.createObjectURL(result);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result, outputFileName]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={disabled || isProcessing}
        className={`w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
          disabled || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing... {progress}%
          </>
        ) : (
          buttonLabel
        )}
      </button>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Success Message */}
      {success && result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Processing complete!
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">
              Size: {formatFileSize(result.size)}
            </span>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
