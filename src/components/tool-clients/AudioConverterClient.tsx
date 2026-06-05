'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, validateAudioFile, type AudioFormat, type AudioStage } from '@/lib/audio-ffmpeg';

const FORMATS: AudioFormat[] = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus'];

export default function AudioConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [bitrate, setBitrate] = useState<string>('192k');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<AudioStage | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLossless = outputFormat === 'wav' || outputFormat === 'flac';

  const onFile = (f: File) => {
    const v = validateAudioFile(f);
    if (!v.valid) { setError(v.error!); return; }
    setError('');
    setFile(f);
    setDownloadUrl('');
  };

  const convert = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);
    setError('');
    setStage('loading-engine');
    try {
      const args = isLossless ? [] : ['-b:a', bitrate];
      const blob = await runFFmpegAudio(file, outputFormat, args, {
        onProgress: (r) => setProgress(Math.round(r * 100)),
        onStage: (s) => setStage(s),
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (e) {
      setError(`Conversion failed: ${(e as Error).message}`);
    } finally {
      setConverting(false);
      setStage(null);
    }
  };

  const stageLabel = (): string => {
    switch (stage) {
      case 'loading-engine': return 'Loading FFmpeg engine (first run downloads ~30 MB, please wait)…';
      case 'reading-input': return 'Reading file into engine…';
      case 'processing': return `Converting… ${progress}%`;
      case 'reading-output': return 'Finalising output…';
      default: return '';
    }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + '.' + outputFormat;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input ref={fileInputRef} type="file" accept="audio/*,video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        <button onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Upload Audio File
        </button>
        {file && <p className="text-sm text-gray-600 mt-2">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
        <p className="text-xs text-gray-500 mt-2">MP3, WAV, OGG, M4A, FLAC, AAC, Opus, WMA — runs locally.</p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            {FORMATS.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </div>
        {!isLossless && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitrate</label>
            <select value={bitrate} onChange={(e) => setBitrate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              {['96k', '128k', '192k', '256k', '320k'].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        )}
        {isLossless && <p className="text-xs text-gray-500 mb-1">Lossless — no bitrate setting.</p>}
      </div>

      {converting && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stageLabel()}</span>
            {stage === 'processing' && <span>{progress}%</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${stage === 'processing' ? 'bg-blue-600' : 'bg-blue-400 animate-pulse'}`}
              style={{ width: stage === 'processing' ? `${progress}%` : '100%' }}
            />
          </div>
          {stage === 'loading-engine' && (
            <p className="text-xs text-amber-700 mt-2">
              ⏳ First-time setup: FFmpeg WASM (~30 MB) is downloading from CDN. This only happens once — subsequent conversions start instantly.
            </p>
          )}
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={convert} disabled={!file || converting}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {converting ? 'Converting…' : 'Convert'}
        </button>
        {downloadUrl && (
          <button onClick={download}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Download .{outputFormat}
          </button>
        )}
      </div>
    </div>
  );
}
