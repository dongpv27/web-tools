'use client';

import { useState, useRef } from 'react';
import { runFFmpegAudio, validateAudioFile, type AudioFormat } from '@/lib/audio-ffmpeg';

export default function AudioReverseClient() {
  const [file, setFile] = useState<File | null>(null);
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
      const blob = await runFFmpegAudio(file, outputFormat, ['-af', 'areverse'], {
        onProgress: (r) => setProgress(Math.round(r * 100)),
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Reverse failed: ${(e as Error).message}`);
    } finally { setProcessing(false); }
  };

  const download = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name.replace(/\.[^.]+$/, '') + '-reversed.' + outputFormat;
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Output format</label>
        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as AudioFormat)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
          {(['mp3','wav','ogg','m4a','flac','aac','opus'] as AudioFormat[]).map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
        </select>
      </div>

      {processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Reversing…</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={!file || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Reversing…' : 'Reverse Audio'}
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
