// One-shot: add stage tracking to the remaining 7 audio clients that
// already use runFFmpegAudio / concatFFmpegAudio.

import fs from 'node:fs';

const FILES = [
  'src/components/tool-clients/AudioTrimmerClient.tsx',
  'src/components/tool-clients/AudioCompressorClient.tsx',
  'src/components/tool-clients/AudioVolumeClient.tsx',
  'src/components/tool-clients/AudioSpeedClient.tsx',
  'src/components/tool-clients/AudioReverseClient.tsx',
  'src/components/tool-clients/NoiseReducerClient.tsx',
];

for (const f of FILES) {
  let src = fs.readFileSync(f, 'utf8');

  // 1. Add AudioStage to imports
  src = src.replace(
    /import\s*\{\s*runFFmpegAudio,\s*([^}]+)\}\s*from\s*'@\/lib\/audio-ffmpeg'/,
    (m, rest) => {
      if (rest.includes('AudioStage')) return m;
      return `import { runFFmpegAudio, ${rest.trim()}, type AudioStage } from '@/lib/audio-ffmpeg'`;
    }
  );

  // 2. Add stage state declaration after progress state
  src = src.replace(
    /(\s+const \[progress, setProgress\] = useState\(0\);)/,
    `$1\r\n  const [stage, setStage] = useState<AudioStage | null>(null);`
  );

  // 3. Add stage onProgress + onStage in the runFFmpegAudio call
  src = src.replace(
    /onProgress: \(r\) => setProgress\(Math\.round\(r \* 100\)\),\r?\n\s*\}\)/g,
    'onProgress: (r) => setProgress(Math.round(r * 100)),\r\n        onStage: (s) => setStage(s),\r\n      })'
  );

  // 4. Add setStage('loading-engine') at start of run/convert function
  // Find pattern: setProcessing(true); setProgress(0); setError('');
  src = src.replace(
    /(set(?:Processing|Converting)\(true\);\s*setProgress\(0\);\s*setError\(''\);)/,
    `$1\r\n    setStage('loading-engine');`
  );

  // 5. Add setStage(null) in the finally block
  src = src.replace(
    /(\}\s*finally\s*\{\s*set(?:Processing|Converting)\(false\);)/,
    `$1\r\n      setStage(null);`
  );

  // 6. Add stageLabel function and inject loading-engine banner. We do this
  //    via a marker: replace the existing progress JSX block with an
  //    enhanced version that shows stage text + first-run banner.
  src = src.replace(
    /\{(processing|converting) && \(\s*<div>\s*<div className="flex justify-between text-sm text-gray-600 mb-1"><span>([^<]+)<\/span><span>\{progress\}%<\/span><\/div>\s*<div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style=\{\{ width: `\$\{progress\}%` \}\} \/><\/div>\s*<\/div>\s*\)\}/,
    (m, gate, label) => `{${gate} && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stage === 'loading-engine' ? 'Loading FFmpeg engine (first run downloads ~30 MB)…' : stage === 'reading-input' ? 'Reading file into engine…' : stage === 'reading-output' ? 'Finalising output…' : '${label.trim()}'}</span>
            {stage === 'processing' && <span>{progress}%</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={\`h-2 rounded-full \${stage === 'processing' ? 'bg-blue-600' : 'bg-blue-400 animate-pulse'}\`} style={{ width: stage === 'processing' ? \`\${progress}%\` : '100%' }} />
          </div>
          {stage === 'loading-engine' && (
            <p className="text-xs text-amber-700 mt-2">⏳ First-time setup: FFmpeg WASM (~30 MB) is downloading. Only happens once — subsequent runs start instantly.</p>
          )}
        </div>
      )}`
  );

  fs.writeFileSync(f, src);
  console.log('Updated:', f);
}

// AudioMergerClient is special: it uses concatFFmpegAudio with positional
// args (no opts object), so handle separately.
{
  const f = 'src/components/tool-clients/AudioMergerClient.tsx';
  let src = fs.readFileSync(f, 'utf8');

  src = src.replace(
    /import\s*\{\s*concatFFmpegAudio,\s*([^}]+)\}\s*from\s*'@\/lib\/audio-ffmpeg'/,
    (m, rest) => rest.includes('AudioStage') ? m : `import { concatFFmpegAudio, ${rest.trim()}, type AudioStage } from '@/lib/audio-ffmpeg'`
  );

  src = src.replace(
    /(\s+const \[progress, setProgress\] = useState\(0\);)/,
    `$1\r\n  const [stage, setStage] = useState<AudioStage | null>(null);`
  );

  // concatFFmpegAudio(files, outputFormat, (r) => setProgress(...))
  // → ...(files, outputFormat, (r) => setProgress, (s) => setStage)
  src = src.replace(
    /concatFFmpegAudio\(files, outputFormat, \(r\) => setProgress\(Math\.round\(r \* 100\)\)\)/,
    `concatFFmpegAudio(files, outputFormat, (r) => setProgress(Math.round(r * 100)), (s) => setStage(s))`
  );

  src = src.replace(
    /(setProcessing\(true\);\s*setProgress\(0\);\s*setError\(''\);)/,
    `$1\r\n    setStage('loading-engine');`
  );
  src = src.replace(
    /(\}\s*finally\s*\{\s*setProcessing\(false\);)/,
    `$1\r\n      setStage(null);`
  );

  src = src.replace(
    /\{processing && \(\s*<div>\s*<div className="flex justify-between text-sm text-gray-600 mb-1"><span>([^<]+)<\/span><span>\{progress\}%<\/span><\/div>\s*<div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style=\{\{ width: `\$\{progress\}%` \}\} \/><\/div>\s*<\/div>\s*\)\}/,
    (m, label) => `{processing && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{stage === 'loading-engine' ? 'Loading FFmpeg engine (first run downloads ~30 MB)…' : stage === 'reading-input' ? 'Reading files into engine…' : stage === 'reading-output' ? 'Finalising output…' : '${label.trim()}'}</span>
            {stage === 'processing' && <span>{progress}%</span>}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={\`h-2 rounded-full \${stage === 'processing' ? 'bg-blue-600' : 'bg-blue-400 animate-pulse'}\`} style={{ width: stage === 'processing' ? \`\${progress}%\` : '100%' }} />
          </div>
          {stage === 'loading-engine' && (
            <p className="text-xs text-amber-700 mt-2">⏳ First-time setup: FFmpeg WASM (~30 MB) is downloading. Only happens once — subsequent runs start instantly.</p>
          )}
        </div>
      )}`
  );

  fs.writeFileSync(f, src);
  console.log('Updated:', f);
}
console.log('Done.');
