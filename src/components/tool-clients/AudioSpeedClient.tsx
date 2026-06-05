'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, atempoChain, validateAudioFile, type AudioFormat, type AudioStage } from '@/lib/audio-ffmpeg';

export default function AudioSpeedClient() {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState<number>(1.5);
  const [preservePitch, setPreservePitch] = useState(true);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<AudioStage | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File) => {
    const v = validateAudioFile(f);
    if (!v.valid) { setError(v.error!); return; }
    setError(''); setFile(f); setDownloadUrl('');
    const ext = f.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
    if (ext && ['mp3','wav','ogg','m4a','flac','aac','opus'].includes(ext)) setOutputFormat(ext as AudioFormat);
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError('');
    setStage('loading-engine');
    try {
      // atempo preserves pitch; asetrate changes pitch chipmunk-style.
      const filter = preservePitch
        ? atempoChain(speed)
        : `asetrate=44100*${speed},aresample=44100`;
      const args = ['-af', filter];
      const blob = await runFFmpegAudio(file, outputFormat, args, {
        onProgress: (r) => setProgress(Math.round(r * 100)),
        onStage: (s) => setStage(s),
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Failed: ${(e as Error).message}`);
    } finally { setProcessing(false);
      setStage(null); }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + `-${speed}x.` + outputFormat;
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
        {file && <p className="text-sm text-gray-600 mt-2">{file.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Speed: <span className="font-mono">{speed.toFixed(2)}×</span></label>
        <input type="range" min="0.25" max="4" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0.25×</span><span>1×</span><span>2×</span><span>4×</span></div>
        <div className="flex gap-2 mt-2">
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 text-xs rounded ${Math.abs(speed - s) < 0.001 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              {s}×
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={preservePitch} onChange={(e) => setPreservePitch(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
        <span className="text-sm text-gray-700">Preserve pitch (no chipmunk effect)</span>
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
          {(['mp3','wav','ogg','m4a','flac','aac','opus'] as AudioFormat[]).map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
        </select>
      </div>

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stage === 'loading-engine' ? 'Loading FFmpeg engine (first run downloads ~30 MB)…' : stage === 'reading-input' ? 'Reading file into engine…' : stage === 'reading-output' ? 'Finalising output…' : 'Processing…'}</span>
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

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Processing…' : `Apply ${speed.toFixed(2)}×`}
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
