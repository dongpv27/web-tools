'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, validateAudioFile, type AudioStage } from '@/lib/audio-ffmpeg';

export default function AudioCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<string>('128k');
  const [sampleRate, setSampleRate] = useState<string>('44100');
  const [channels, setChannels] = useState<string>('2');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<AudioStage | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [outSize, setOutSize] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    const v = validateAudioFile(f);
    if (!v.valid) { setError(v.error!); return; }
    setError(''); setFile(f); setDownloadUrl(''); setOutSize(0);
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError('');
    setStage('loading-engine');
    try {
      const args = ['-b:a', bitrate, '-ar', sampleRate, '-ac', channels];
      const blob = await runFFmpegAudio(file, 'mp3', args, {
        onProgress: (r) => setProgress(Math.round(r * 100)),
        onStage: (s) => setStage(s),
      });
      setOutSize(blob.size);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Compression failed: ${(e as Error).message}`);
    } finally { setProcessing(false);
      setStage(null); }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + '-compressed.mp3';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        <button onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Upload Audio File
        </button>
        {file && <p className="text-sm text-gray-600 mt-2">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bitrate</label>
          <select value={bitrate} onChange={(e) => setBitrate(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            {['64k','96k','128k','160k','192k','256k','320k'].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sample rate</label>
          <select value={sampleRate} onChange={(e) => setSampleRate(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            {['22050','32000','44100','48000'].map((r) => <option key={r} value={r}>{r} Hz</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
          <select value={channels} onChange={(e) => setChannels(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            <option value="1">Mono</option>
            <option value="2">Stereo</option>
          </select>
        </div>
      </div>

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stage === 'loading-engine' ? 'Loading FFmpeg engine (first run downloads ~30 MB)…' : stage === 'reading-input' ? 'Reading file into engine…' : stage === 'reading-output' ? 'Finalising output…' : 'Compressing…'}</span>
            {stage === 'processing' && <span>{progress}%</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full ${stage === 'processing' ? 'bg-blue-600' : 'bg-blue-400 animate-pulse'}`} style={{ width: stage === 'processing' ? `${progress}%` : '100%' }} />
          </div>
          {stage === 'loading-engine' && (
            <p className="text-xs text-amber-700 mt-2">⏳ First-time setup: FFmpeg WASM (~30 MB) is downloading. Only happens once — subsequent runs start instantly.</p>
          )}
        </div>
      )}

      {outSize > 0 && file && (
        <p className="text-sm text-green-700 p-3 bg-green-50 rounded-lg">
          Compressed: <span className="font-medium">{(outSize / 1024 / 1024).toFixed(2)} MB</span> ·
          Source: <span className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span> ·
          Saved <span className="font-medium">{(100 - (outSize / file.size) * 100).toFixed(0)}%</span>
        </p>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Compressing…' : 'Compress (→ MP3)'}
        </button>
        {downloadUrl && (
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Download
          </button>
        )}
      </div>
    </div>
  );
}
