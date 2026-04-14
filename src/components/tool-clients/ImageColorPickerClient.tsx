'use client';

import { useState, useRef, useEffect } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function ImageColorPickerClient() {
  const [image, setImage] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: { r: number; g: number; b: number } } | null>(null);
  const [colors, setColors] = useState<{ hex: string; rgb: { r: number; g: number; b: number } }[]>([]);
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
      setPickedColor(null);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Draw image to hidden canvas when image loads
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
    };
    img.src = image;
  }, [image]);

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgEl = e.currentTarget;
    const rect = imgEl.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * canvas.width);
    const y = Math.floor((e.clientY - rect.top) / rect.height * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = {
      hex: rgbToHex(pixel[0], pixel[1], pixel[2]),
      rgb: { r: pixel[0], g: pixel[1], b: pixel[2] },
    };

    setPickedColor(color);
  };

  const addToPalette = () => {
    if (pickedColor && !colors.find(c => c.hex === pickedColor.hex)) {
      setColors([...colors, pickedColor]);
    }
  };

  const clearPalette = () => {
    setColors([]);
  };

  const clear = () => {
    setImage(null);
    setPickedColor(null);
    setColors([]);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {!image ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Upload Image</button>
          <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Name */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">File:</span>
            <span className="truncate max-w-xs">{fileName}</span>
          </div>

          {/* Preview - use img tag for reliable display */}
          <div className="border border-gray-200 rounded-lg p-2">
            <img
              src={image}
              alt="Pick a color"
              onClick={handleImageClick}
              className="max-w-full max-h-64 mx-auto cursor-crosshair"
            />
          </div>

          {pickedColor && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg border border-gray-300" style={{ backgroundColor: pickedColor.hex }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">HEX:</span>
                    <code className="text-sm font-mono">{pickedColor.hex}</code>
                    <CopyButton text={pickedColor.hex} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">RGB:</span>
                    <code className="text-sm font-mono">rgb({pickedColor.rgb.r}, {pickedColor.rgb.g}, {pickedColor.rgb.b})</code>
                    <CopyButton text={`rgb(${pickedColor.rgb.r}, ${pickedColor.rgb.g}, ${pickedColor.rgb.b})`} />
                  </div>
                </div>
                <button onClick={addToPalette} className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">Add to Palette</button>
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Color Palette</span>
                <button onClick={clearPalette} className="text-sm text-red-600 hover:text-red-700">Clear</button>
              </div>
              <div className="space-y-2">
                {colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded border border-gray-300 shrink-0" style={{ backgroundColor: color.hex }} />
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">HEX:</span>
                      <span className="text-sm font-mono">{color.hex}</span>
                      <CopyButton text={color.hex} />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">RGB:</span>
                      <span className="text-sm font-mono">rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</span>
                      <CopyButton text={`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>

          {/* Hidden canvas for color picking */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
