'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, validateAudioFile, type AudioFormat } from '@/lib/audio-ffmpeg';

type Mode = 'gain' | 'normalize';

export default function AudioVolumeClient() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>('gain');
  const [gainDb, setGainDb] = useState<number>(6);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
    try {
      const filter = mode === 'gain'
        ? `volume=${gainDb}dB`
        : 'loudnorm=I=-16:LRA=11:TP=-1.5'; // EBU R128 broadcast loudness target
      const args = ['-af', filter];
      const blob = await runFFmpegAudio(file, outputFormat, args, {
        onProgress: (r) => setProgress(Math.round(r * 100)),
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Failed: ${(e as Error).message}`);
    } finally { setProcessing(false); }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + (mode === 'gain' ? '-volume' : '-normalized') + '.' + outputFormat;
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

      <div className="flex gap-2">
        <button onClick={() => setMode('gain')}
          className={`px-4 py-2 text-sm rounded-lg ${mode === 'gain' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Manual gain
        </button>
        <button onClick={() => setMode('normalize')}
          className={`px-4 py-2 text-sm rounded-lg ${mode === 'normalize' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Auto-normalize (EBU R128)
        </button>
      </div>

      {mode === 'gain' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gain (dB): <span className="font-mono">{gainDb > 0 ? '+' : ''}{gainDb}</span></label>
          <input type="range" min="-30" max="30" step="0.5" value={gainDb} onChange={(e) => setGainDb(parseFloat(e.target.value))} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">+6 dB ≈ 2× perceived loudness · −6 dB ≈ ½ · range −30 to +30.</p>
        </div>
      )}

      {mode === 'normalize' && (
        <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
          Auto-normalizes to the EBU R128 broadcast loudness target (−16 LUFS) — same standard used by Spotify, podcast platforms, and YouTube. Two-pass not needed for typical material.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
          {(['mp3','wav','ogg','m4a','flac','aac','opus'] as AudioFormat[]).map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
        </select>
      </div>

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Processing…</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Processing…' : mode === 'gain' ? 'Apply Gain' : 'Normalize'}
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
