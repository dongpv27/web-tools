'use client';

import { useState, useRef } from 'react';

// CSS `filter` string for both the live preview and the canvas export, so the
// downloaded PNG matches what the user sees. Canvas ctx.filter understands the
// same syntax as CSS in all modern browsers.
function buildFilter(f: {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
}): string {
  return [
    `blur(${f.blur}px)`,
    `brightness(${f.brightness}%)`,
    `contrast(${f.contrast}%)`,
    `saturate(${f.saturate}%)`,
    `grayscale(${f.grayscale}%)`,
  ].join(' ');
}

const DEFAULTS = { blur: 0, brightness: 100, contrast: 100, saturate: 100, grayscale: 0 };

export default function ImageBlurClient() {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULTS);
  const [fileName, setFileName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const download = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = buildFilter(filters);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  };

  const reset = () => setFilters(DEFAULTS);
  const clear = () => {
    setImage(null);
    setFilters(DEFAULTS);
    setFileName('');
  };

  const css = buildFilter(filters);

  return (
    <div className="space-y-6">
      {!image ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Image
          </button>
          <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">File:</span>
            <span className="truncate max-w-xs">{fileName}</span>
          </div>

          {/* Preview reflects every filter live. */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <img
              src={image}
              alt="Edited image preview"
              className="max-h-64 mx-auto"
              style={{ filter: css }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <FilterSlider label="Blur" suffix="px" min={0} max={20} step={0.5} value={filters.blur} onChange={(v) => setFilters({ ...filters, blur: v })} />
            <FilterSlider label="Brightness" suffix="%" min={0} max={200} step={1} value={filters.brightness} onChange={(v) => setFilters({ ...filters, brightness: v })} />
            <FilterSlider label="Contrast" suffix="%" min={0} max={200} step={1} value={filters.contrast} onChange={(v) => setFilters({ ...filters, contrast: v })} />
            <FilterSlider label="Saturation" suffix="%" min={0} max={200} step={1} value={filters.saturate} onChange={(v) => setFilters({ ...filters, saturate: v })} />
            <FilterSlider label="Grayscale" suffix="%" min={0} max={100} step={1} value={filters.grayscale} onChange={(v) => setFilters({ ...filters, grayscale: v })} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}

function FilterSlider({
  label,
  suffix,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono text-gray-600">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
