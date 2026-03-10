'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function YoutubeEmbedGeneratorClient() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [options, setOptions] = useState({
    autoplay: false,
    controls: true,
    loop: false,
    muted: false,
    modestbranding: true,
    responsive: true,
  });
  const [embedCode, setEmbedCode] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generate = () => {
    setError('');
    setEmbedCode('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url.trim());
    if (!id) {
      setError('Invalid YouTube URL');
      return;
    }

    setVideoId(id);

    const params: string[] = [];
    if (options.autoplay) params.push('autoplay=1');
    if (!options.controls) params.push('controls=0');
    if (options.loop) params.push(`loop=1&playlist=${id}`);
    if (options.muted) params.push('mute=1');
    if (options.modestbranding) params.push('modestbranding=1');

    const paramsStr = params.length > 0 ? `?${params.join('&')}` : '';

    const embedUrl = `https://www.youtube.com/embed/${id}${paramsStr}`;

    if (options.responsive) {
      setEmbedCode(`<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="${embedUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>`);
    } else {
      setEmbedCode(`<iframe
  width="560"
  height="315"
  src="${embedUrl}"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>`);
    }
  };

  const clear = () => {
    setUrl('');
    setVideoId('');
    setEmbedCode('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'autoplay', label: 'Autoplay' },
            { key: 'controls', label: 'Show Controls' },
            { key: 'loop', label: 'Loop' },
            { key: 'muted', label: 'Muted' },
            { key: 'modestbranding', label: 'Modest Branding' },
            { key: 'responsive', label: 'Responsive' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate Embed Code</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {embedCode && (
        <div className="space-y-4">
          {videoId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gray-200 rounded">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Embed Code</label>
              <CopyButton text={embedCode} />
            </div>
            <pre className="p-4 bg-gray-900 rounded-lg text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
              {embedCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
