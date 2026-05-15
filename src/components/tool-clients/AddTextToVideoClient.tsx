'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import VideoUpload from '@/components/video/VideoUpload';
import VideoProcessor from '@/components/video/VideoProcessor';
import { getFFmpeg, loadVideoFile, readOutputFile, ensureFont, escapeDrawtext } from '@/lib/ffmpeg';

// Position is the CENTER of the text, expressed as a percentage of the
// video's display dimensions. 50/50 = dead center.
interface Position {
  x: number;
  y: number;
}

// Curated font list. Each entry pairs:
//   - `family`: CSS font-family used in the live preview (Google Fonts CSS
//     is injected once on mount so these resolve).
//   - `ttf`: TTF URL fetched and written into FFmpeg's virtual FS at render
//     time so drawtext renders the same glyphs as the preview.
// All TTFs come from the official google/fonts repo via jsDelivr (CORS-OK).
type FontCategory = 'Sans-serif' | 'Display' | 'Serif' | 'Monospace' | 'Handwriting';

interface FontOption {
  id: string;
  label: string;
  family: string;
  google: string; // family= value for Google Fonts CSS request
  ttf: string;
  category: FontCategory;
}

const GH = 'https://cdn.jsdelivr.net/gh/google/fonts@main';

const FONTS: FontOption[] = [
  // --- Sans-serif (clean UI / modern) ---
  { id: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif", google: 'Roboto',
    ttf: `${GH}/apache/roboto/static/Roboto-Regular.ttf`, category: 'Sans-serif' },
  { id: 'open-sans', label: 'Open Sans', family: "'Open Sans', sans-serif", google: 'Open+Sans',
    ttf: `${GH}/ofl/opensans/OpenSans%5Bwdth%2Cwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'lato', label: 'Lato', family: "'Lato', sans-serif", google: 'Lato',
    ttf: `${GH}/ofl/lato/Lato-Regular.ttf`, category: 'Sans-serif' },
  { id: 'montserrat', label: 'Montserrat', family: "'Montserrat', sans-serif", google: 'Montserrat',
    ttf: `${GH}/ofl/montserrat/Montserrat%5Bwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif", google: 'Poppins',
    ttf: `${GH}/ofl/poppins/Poppins-Regular.ttf`, category: 'Sans-serif' },
  { id: 'inter', label: 'Inter', family: "'Inter', sans-serif", google: 'Inter',
    ttf: `${GH}/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'noto-sans', label: 'Noto Sans', family: "'Noto Sans', sans-serif", google: 'Noto+Sans',
    ttf: `${GH}/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'nunito', label: 'Nunito', family: "'Nunito', sans-serif", google: 'Nunito',
    ttf: `${GH}/ofl/nunito/Nunito%5Bwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'raleway', label: 'Raleway', family: "'Raleway', sans-serif", google: 'Raleway',
    ttf: `${GH}/ofl/raleway/Raleway%5Bwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'work-sans', label: 'Work Sans', family: "'Work Sans', sans-serif", google: 'Work+Sans',
    ttf: `${GH}/ofl/worksans/WorkSans%5Bwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif", google: 'DM+Sans',
    ttf: `${GH}/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'quicksand', label: 'Quicksand', family: "'Quicksand', sans-serif", google: 'Quicksand',
    ttf: `${GH}/ofl/quicksand/Quicksand%5Bwght%5D.ttf`, category: 'Sans-serif' },
  { id: 'ubuntu', label: 'Ubuntu', family: "'Ubuntu', sans-serif", google: 'Ubuntu',
    ttf: `${GH}/ufl/ubuntu/Ubuntu-Regular.ttf`, category: 'Sans-serif' },
  { id: 'lato-thin', label: 'Lato Thin', family: "'Lato', sans-serif", google: 'Lato:wght@100',
    ttf: `${GH}/ofl/lato/Lato-Thin.ttf`, category: 'Sans-serif' },

  // --- Display (heavy, attention-grabbing, great for video titles) ---
  { id: 'bebas-neue', label: 'Bebas Neue', family: "'Bebas Neue', sans-serif", google: 'Bebas+Neue',
    ttf: `${GH}/ofl/bebasneue/BebasNeue-Regular.ttf`, category: 'Display' },
  { id: 'anton', label: 'Anton', family: "'Anton', sans-serif", google: 'Anton',
    ttf: `${GH}/ofl/anton/Anton-Regular.ttf`, category: 'Display' },
  { id: 'oswald', label: 'Oswald', family: "'Oswald', sans-serif", google: 'Oswald',
    ttf: `${GH}/ofl/oswald/Oswald%5Bwght%5D.ttf`, category: 'Display' },
  { id: 'fjalla-one', label: 'Fjalla One', family: "'Fjalla One', sans-serif", google: 'Fjalla+One',
    ttf: `${GH}/ofl/fjallaone/FjallaOne-Regular.ttf`, category: 'Display' },
  { id: 'archivo-black', label: 'Archivo Black', family: "'Archivo Black', sans-serif", google: 'Archivo+Black',
    ttf: `${GH}/ofl/archivoblack/ArchivoBlack-Regular.ttf`, category: 'Display' },
  { id: 'bangers', label: 'Bangers', family: "'Bangers', cursive", google: 'Bangers',
    ttf: `${GH}/ofl/bangers/Bangers-Regular.ttf`, category: 'Display' },
  { id: 'russo-one', label: 'Russo One', family: "'Russo One', sans-serif", google: 'Russo+One',
    ttf: `${GH}/ofl/russoone/RussoOne-Regular.ttf`, category: 'Display' },
  { id: 'titan-one', label: 'Titan One', family: "'Titan One', cursive", google: 'Titan+One',
    ttf: `${GH}/ofl/titanone/TitanOne-Regular.ttf`, category: 'Display' },

  // --- Serif (elegant, editorial) ---
  { id: 'playfair-display', label: 'Playfair Display', family: "'Playfair Display', serif", google: 'Playfair+Display',
    ttf: `${GH}/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf`, category: 'Serif' },
  { id: 'merriweather', label: 'Merriweather', family: "'Merriweather', serif", google: 'Merriweather',
    ttf: `${GH}/ofl/merriweather/Merriweather-Regular.ttf`, category: 'Serif' },
  { id: 'lora', label: 'Lora', family: "'Lora', serif", google: 'Lora',
    ttf: `${GH}/ofl/lora/Lora%5Bwght%5D.ttf`, category: 'Serif' },
  { id: 'pt-serif', label: 'PT Serif', family: "'PT Serif', serif", google: 'PT+Serif',
    ttf: `${GH}/ofl/ptserif/PTSerif-Regular.ttf`, category: 'Serif' },
  { id: 'cormorant', label: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", google: 'Cormorant+Garamond',
    ttf: `${GH}/ofl/cormorantgaramond/CormorantGaramond-Regular.ttf`, category: 'Serif' },

  // --- Monospace (code, terminal-style) ---
  { id: 'roboto-mono', label: 'Roboto Mono', family: "'Roboto Mono', monospace", google: 'Roboto+Mono',
    ttf: `${GH}/apache/robotomono/static/RobotoMono-Regular.ttf`, category: 'Monospace' },
  { id: 'jetbrains-mono', label: 'JetBrains Mono', family: "'JetBrains Mono', monospace", google: 'JetBrains+Mono',
    ttf: `${GH}/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf`, category: 'Monospace' },
  { id: 'source-code-pro', label: 'Source Code Pro', family: "'Source Code Pro', monospace", google: 'Source+Code+Pro',
    ttf: `${GH}/ofl/sourcecodepro/SourceCodePro%5Bwght%5D.ttf`, category: 'Monospace' },

  // --- Handwriting / Script ---
  { id: 'pacifico', label: 'Pacifico', family: "'Pacifico', cursive", google: 'Pacifico',
    ttf: `${GH}/ofl/pacifico/Pacifico-Regular.ttf`, category: 'Handwriting' },
  { id: 'dancing-script', label: 'Dancing Script', family: "'Dancing Script', cursive", google: 'Dancing+Script',
    ttf: `${GH}/ofl/dancingscript/DancingScript%5Bwght%5D.ttf`, category: 'Handwriting' },
  { id: 'caveat', label: 'Caveat', family: "'Caveat', cursive", google: 'Caveat',
    ttf: `${GH}/ofl/caveat/Caveat%5Bwght%5D.ttf`, category: 'Handwriting' },
  { id: 'great-vibes', label: 'Great Vibes', family: "'Great Vibes', cursive", google: 'Great+Vibes',
    ttf: `${GH}/ofl/greatvibes/GreatVibes-Regular.ttf`, category: 'Handwriting' },
  { id: 'permanent-marker', label: 'Permanent Marker', family: "'Permanent Marker', cursive", google: 'Permanent+Marker',
    ttf: `${GH}/ofl/permanentmarker/PermanentMarker-Regular.ttf`, category: 'Handwriting' },
  { id: 'indie-flower', label: 'Indie Flower', family: "'Indie Flower', cursive", google: 'Indie+Flower',
    ttf: `${GH}/ofl/indieflower/IndieFlower-Regular.ttf`, category: 'Handwriting' },
  { id: 'satisfy', label: 'Satisfy', family: "'Satisfy', cursive", google: 'Satisfy',
    ttf: `${GH}/ofl/satisfy/Satisfy-Regular.ttf`, category: 'Handwriting' },
];

const FONT_CATEGORIES: FontCategory[] = ['Sans-serif', 'Display', 'Serif', 'Monospace', 'Handwriting'];

const FONTS_BY_ID: Record<string, FontOption> = Object.fromEntries(
  FONTS.map((f) => [f.id, f]),
);

// Inject a single <link> with all chosen families so the preview shows the
// real typeface immediately. Lives at module scope so it runs once per tab.
let googleFontsInjected = false;
function ensureGoogleFontsCss() {
  if (googleFontsInjected || typeof document === 'undefined') return;
  const families = FONTS.map((f) => `family=${f.google}`).join('&');
  const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  googleFontsInjected = true;
}

const PRESETS: Record<string, Position> = {
  'top-left': { x: 10, y: 10 },
  top: { x: 50, y: 10 },
  'top-right': { x: 90, y: 10 },
  left: { x: 10, y: 50 },
  center: { x: 50, y: 50 },
  right: { x: 90, y: 50 },
  'bottom-left': { x: 10, y: 90 },
  bottom: { x: 50, y: 90 },
  'bottom-right': { x: 90, y: 90 },
};

export default function AddTextToVideoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontId, setFontId] = useState<string>('roboto');
  const [pos, setPos] = useState<Position>({ x: 50, y: 90 });

  const font = FONTS_BY_ID[fontId] ?? FONTS[0];

  useEffect(() => {
    ensureGoogleFontsCss();
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setVideoUrl(URL.createObjectURL(selectedFile));
  }, []);

  const handleClear = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setDuration(0);
  }, [videoUrl]);

  // --- drag-to-position handlers ---

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const box = previewRef.current?.getBoundingClientRect();
    if (!box) return;
    const offset = dragOffsetRef.current || { dx: 0, dy: 0 };
    const localX = clientX - box.left - offset.dx;
    const localY = clientY - box.top - offset.dy;
    setPos({
      x: clamp((localX / box.width) * 100),
      y: clamp((localY / box.height) * 100),
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Calculate offset between pointer and label center so the label
      // doesn't snap its center to the pointer on first move.
      const labelBox = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      dragOffsetRef.current = {
        dx: e.clientX - (labelBox.left + labelBox.width / 2),
        dy: e.clientY - (labelBox.top + labelBox.height / 2),
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragOffsetRef.current = null;
    },
    [],
  );

  // Click anywhere on the video to drop the text there.
  const handleVideoClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Ignore clicks that originate on the draggable label itself.
      if ((e.target as HTMLElement).closest('[data-text-overlay]')) return;
      dragOffsetRef.current = { dx: 0, dy: 0 };
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  // --- video metadata ---

  const handleLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setDuration(e.currentTarget.duration);
    },
    [],
  );

  // --- ffmpeg ---

  const processVideo = useCallback(
    async (onProgress: (progress: number) => void) => {
      if (!file || !text) return null;

      try {
        const ffmpeg = await getFFmpeg(onProgress);
        const inputName = 'input.' + file.name.split('.').pop();
        const outputName = 'output.mp4';

        await loadVideoFile(ffmpeg, file, inputName);
        const fontPath = await ensureFont(ffmpeg, font.ttf);

        const escapedText = escapeDrawtext(text);
        // pos.x / pos.y are the center of the text as % of video dimensions.
        // FFmpeg expressions for the top-left corner of the text:
        //   x = w * (pos.x/100) - text_w/2
        //   y = h * (pos.y/100) - text_h/2
        const px = (pos.x / 100).toFixed(4);
        const py = (pos.y / 100).toFixed(4);
        const drawTextFilter =
          `drawtext=fontfile=${fontPath}` +
          `:text='${escapedText}'` +
          `:fontsize=${fontSize}` +
          `:fontcolor=${fontColor}` +
          `:x=w*${px}-text_w/2` +
          `:y=h*${py}-text_h/2`;

        await ffmpeg.exec([
          '-i', inputName,
          '-vf', drawTextFilter,
          '-c:a', 'copy',
          '-c:v', 'libx264',
          outputName,
        ]);

        const data = await readOutputFile(ffmpeg, outputName);
        if (data.byteLength === 0) {
          throw new Error(
            'Output is empty — FFmpeg drawtext likely failed. Check the browser console for the FFmpeg log line(s).',
          );
        }
        return new Blob([data], { type: 'video/mp4' });
      } catch (error) {
        console.error('Error adding text to video:', error);
        throw error;
      }
    },
    [file, text, fontSize, fontColor, pos, font.ttf],
  );

  // Approximate preview font size: drawtext renders at native video pixels,
  // the preview is scaled by `clientWidth / videoWidth`. We don't know the
  // native width before metadata; once known we can scale. As a simple
  // approximation, the preview just uses `fontSize` directly, which roughly
  // matches when the preview is shown ~half native size. Good enough for
  // positioning UX.
  const previewText = text || 'Your text here';

  return (
    <div className="space-y-6">
      <VideoUpload
        onFileSelect={handleFileSelect}
        onClear={handleClear}
        file={file}
        videoUrl={videoUrl}
        duration={duration}
        showPreview={false}
      />

      {videoUrl && (
        <>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Drag the text or click anywhere on the video to place it.
            </p>
            <div
              ref={previewRef}
              className="relative rounded-lg overflow-hidden bg-black select-none"
              onClick={handleVideoClick}
            >
              <video
                src={videoUrl}
                className="w-full max-h-80 mx-auto block"
                onLoadedMetadata={handleLoadedMetadata}
                controls
                playsInline
              />
              {/* Draggable text overlay */}
              <div
                data-text-overlay
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={(e) => e.stopPropagation()}
                className="absolute touch-none cursor-move px-2 py-0.5 ring-2 ring-blue-400/70 ring-offset-1 ring-offset-transparent whitespace-nowrap font-semibold pointer-events-auto"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  color: fontColor,
                  fontSize: `${fontSize}px`,
                  fontFamily: font.family,
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                }}
              >
                {previewText}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to overlay"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font
              </label>
              <select
                value={fontId}
                onChange={(e) => setFontId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                style={{ fontFamily: font.family }}
              >
                {FONT_CATEGORIES.map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {FONTS.filter((f) => f.category === cat).map((f) => (
                      <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                        {f.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size
                </label>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-10 h-10 border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <span className="text-xs text-gray-500">
                  {pos.x.toFixed(0)}%, {pos.y.toFixed(0)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-w-xs">
                {Object.entries(PRESETS).map(([name, value]) => {
                  const active = Math.abs(pos.x - value.x) < 0.5 && Math.abs(pos.y - value.y) < 0.5;
                  return (
                    <button
                      key={name}
                      onClick={() => setPos(value)}
                      className={`px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={`Move text to ${name.replace('-', ' ')}`}
                    >
                      {name.replace('-', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <VideoProcessor
            processVideo={processVideo}
            outputFileName="text-added.mp4"
            buttonLabel="Add Text to Video"
            disabled={!text.trim()}
          />
        </>
      )}
    </div>
  );
}
