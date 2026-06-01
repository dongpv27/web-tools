'use client';

import { fetchFile } from '@ffmpeg/util';
import { getFFmpeg, readOutputFile } from '@/lib/ffmpeg';

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a' | 'flac' | 'aac' | 'opus';

export interface AudioRunOptions {
  inputName?: string;     // virtual FS path for the input. Default 'input.<ext>'
  outputName?: string;    // virtual FS path for the output. Default 'output.<ext>'
  onProgress?: (ratio: number) => void; // 0..1
}

// Map an output format to a sensible default codec/container for FFmpeg.
// MP3 / WAV / OGG / FLAC all share extension==codec, the rest need overrides.
export function codecArgsFor(format: AudioFormat): string[] {
  switch (format) {
    case 'mp3': return ['-codec:a', 'libmp3lame'];
    case 'wav': return ['-codec:a', 'pcm_s16le'];
    case 'ogg': return ['-codec:a', 'libvorbis'];
    case 'm4a': return ['-codec:a', 'aac', '-f', 'mp4'];
    case 'flac': return ['-codec:a', 'flac'];
    case 'aac': return ['-codec:a', 'aac', '-f', 'adts'];
    case 'opus': return ['-codec:a', 'libopus'];
  }
}

export const MIME_FOR_FORMAT: Record<AudioFormat, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  flac: 'audio/flac',
  aac: 'audio/aac',
  opus: 'audio/opus',
};

export const MAX_AUDIO_SIZE = 200 * 1024 * 1024; // 200 MB ceiling for WASM

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_AUDIO_SIZE) {
    return { valid: false, error: `File exceeds 200 MB (got ${(file.size / 1024 / 1024).toFixed(1)} MB).` };
  }
  if (!/\.(mp3|wav|ogg|m4a|flac|aac|opus|wma|webm|mp4|m4b|mka)$/i.test(file.name) &&
      !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
    return { valid: false, error: 'Please upload an audio file (MP3, WAV, OGG, M4A, FLAC, AAC, ...).' };
  }
  return { valid: true };
}

function extOf(name: string): string {
  const m = name.match(/\.([^.]+)$/);
  return (m ? m[1] : 'bin').toLowerCase();
}

/**
 * Run an FFmpeg command on a single audio input. Caller supplies the args
 * between input and output (filters, codec, bitrate, etc). Returns a Blob
 * ready for download.
 */
export async function runFFmpegAudio(
  input: File,
  outputFormat: AudioFormat,
  filterAndCodecArgs: string[],
  opts: AudioRunOptions = {},
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(opts.onProgress);
  const inName = opts.inputName ?? `input.${extOf(input.name)}`;
  const outName = opts.outputName ?? `output.${outputFormat}`;
  await ffmpeg.writeFile(inName, await fetchFile(input));

  const codecArgs = filterAndCodecArgs.some((a) => a === '-codec:a' || a === '-c:a')
    ? []
    : codecArgsFor(outputFormat);

  await ffmpeg.exec(['-i', inName, ...filterAndCodecArgs, ...codecArgs, '-y', outName]);

  const bytes = await readOutputFile(ffmpeg, outName);
  try { await ffmpeg.deleteFile(inName); } catch {}
  try { await ffmpeg.deleteFile(outName); } catch {}
  return new Blob([bytes], { type: MIME_FOR_FORMAT[outputFormat] });
}

/**
 * Concatenate multiple audio files into one. Uses FFmpeg's `concat` demuxer
 * which is lossless when the sources share codec/sample-rate, otherwise the
 * tool transparently transcodes to the chosen output format.
 */
export async function concatFFmpegAudio(
  files: File[],
  outputFormat: AudioFormat,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  if (files.length === 0) throw new Error('No input files');
  const ffmpeg = await getFFmpeg(onProgress);
  const inputs: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const n = `in${i}.${extOf(f.name)}`;
    await ffmpeg.writeFile(n, await fetchFile(f));
    inputs.push(n);
  }

  // Build args: -i in0 -i in1 ... -filter_complex "[0:a][1:a]concat=...:a=1[a]" -map [a]
  const args: string[] = [];
  inputs.forEach((n) => args.push('-i', n));
  const streams = inputs.map((_, i) => `[${i}:a]`).join('');
  args.push('-filter_complex', `${streams}concat=n=${inputs.length}:v=0:a=1[a]`, '-map', '[a]');
  args.push(...codecArgsFor(outputFormat));
  const outName = `output.${outputFormat}`;
  args.push('-y', outName);
  await ffmpeg.exec(args);

  const bytes = await readOutputFile(ffmpeg, outName);
  for (const n of inputs) { try { await ffmpeg.deleteFile(n); } catch {} }
  try { await ffmpeg.deleteFile(outName); } catch {}
  return new Blob([bytes], { type: MIME_FOR_FORMAT[outputFormat] });
}

// Build an `atempo=` filter chain. FFmpeg's atempo only accepts 0.5..2.0, so
// values outside that range need to be split into multiple stages.
export function atempoChain(speed: number): string {
  if (speed <= 0) throw new Error('Speed must be > 0');
  const parts: number[] = [];
  let s = speed;
  while (s > 2.0) { parts.push(2.0); s /= 2.0; }
  while (s < 0.5) { parts.push(0.5); s /= 0.5; }
  parts.push(s);
  return parts.map((p) => `atempo=${p.toFixed(4)}`).join(',');
}
