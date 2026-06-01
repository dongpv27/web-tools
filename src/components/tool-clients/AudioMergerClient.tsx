'use client';

import { useState, useRef } from 'react';
import { concatFFmpegAudio, validateAudioFile, type AudioFormat } from '@/lib/audio-ffmpeg';

export default function AudioMergerClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<AudioFormat>('mp3');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setError('');
    const next: File[] = [...files];
    for (const f of Array.from(incoming)) {
      const v = validateAudioFile(f);
      if (!v.valid) { setError(v.error!); continue; }
      next.push(f);
    }
    setFiles(next);
    setDownloadUrl('');
  };

  const removeAt = (i: number) => setFiles(files.filter((_, idx) => idx !== i));
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...files];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setFiles(next);
  };
  const moveDown = (i: number) => {
    if (i === files.length - 1) return;
    const next = [...files];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    setFiles(next);
  };

  const run = async () => {
    if (files.length < 2) { setError('Add at least 2 files to merge.'); return; }
    setProcessing(true);
    setProgress(0);
    setError('');
    try {
      const blob = await concatFFmpegAudio(files, outputFormat, (r) => setProgress(Math.round(r * 100)));
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(`Merge failed: ${(e as Error).message}`);
    } finally { setProcessing(false); }
  };

  const download = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `merged.${outputFormat}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden"
          onChange={(e) => addFiles(e.target.files)} />
        <button onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Add Audio Files
        </button>
        <p className="text-xs text-gray-500 mt-2">Add 2 or more — drag/drop or click. Reorder before merging.</p>
      </div>

      {files.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium">{files.length} file(s) — order matters</div>
          <ul>
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{i + 1}. {f.name} <span className="text-gray-400">· {(f.size / 1024 / 1024).toFixed(1)} MB</span></span>
                <div className="flex gap-1">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="px-2 py-0.5 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30">↑</button>
                  <button onClick={() => moveDown(i)} disabled={i === files.length - 1} className="px-2 py-0.5 text-xs bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30">↓</button>
                  <button onClick={() => removeAt(i)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">×</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Merging…</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="flex gap-2">
        <button onClick={run} disabled={files.length < 2 || processing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {processing ? 'Merging…' : 'Merge Audio'}
        </button>
        {downloadUrl && (
          <button onClick={download} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
            Download merged.{outputFormat}
          </button>
        )}
        {files.length > 0 && (
          <button onClick={() => { setFiles([]); setDownloadUrl(''); }} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
