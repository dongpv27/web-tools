'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, validateAudioFile, type AudioFormat, type AudioStage } from '@/lib/audio-ffmpeg';

// Accept hh:mm:ss(.ms), mm:ss, or seconds. Returns seconds as a string for FFmpeg.
function parseTime(t: string): string {
  const trimmed = t.trim();
  if (!trimmed) return '0';
  if (/^[\d.]+$/.test(trimmed)) return trimmed;
  const parts = trimmed.split(':').map((p) => parseFloat(p));
  if (parts.some(isNaN)) throw new Error(`Invalid time: ${t}`);
  let secs = 0;
  for (const p of parts) secs = secs * 60 + p;
  return String(secs);
}

export default function AudioTrimmerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState('00:00:00');
  const [end, setEnd] = useState('');
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
    setError('');
    setFile(f);
    setDownloadUrl('');
    // Default detected output ext = source ext.
    const ext = f.name.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
    if (ext && ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus'].includes(ext)) {
      setOutputFormat(ext as AudioFormat);
    }
  };

  const run = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);
    setError('');
    setStage('loading-engine');
    try {
      const ss = parseTime(start);
      const args = ['-ss', ss];
      if (end.trim()) args.push('-to', parseTime(end));
      const blob = await runFFmpegAudio(file, outputFormat, args, {
        onProgress: (r) => setProgress(Math.round(r * 100)),
        onStage: (s) => setStage(s),
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Trim failed: ${(e as Error).message}`);
    } finally { setProcessing(false);
      setStage(null); }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + '-trimmed.' + outputFormat;
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

      {file && (
        <audio controls src={URL.createObjectURL(file)} className="w-full" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start (hh:mm:ss)</label>
          <input type="text" value={start} onChange={(e) => setStart(e.target.value)} placeholder="00:00:00"
            className="w-full px-3 py-1.5 text-sm font-mono border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End (hh:mm:ss)</label>
          <input type="text" value={end} onChange={(e) => setEnd(e.target.value)} placeholder="leave blank = to end"
            className="w-full px-3 py-1.5 text-sm font-mono border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            {(['mp3','wav','ogg','m4a','flac','aac','opus'] as AudioFormat[]).map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stage === 'loading-engine' ? 'Loading FFmpeg engine (first run downloads ~30 MB)…' : stage === 'reading-input' ? 'Reading file into engine…' : stage === 'reading-output' ? 'Finalising output…' : 'Trimming…'}</span>
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
          {processing ? 'Trimming…' : 'Trim Audio'}
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
