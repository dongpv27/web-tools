'use client';

import { useState, useRef, useCallback } from 'react';

type DragMode = 'none' | 'draw' | 'move' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function normalizeCrop(c: CropArea): CropArea {
  return {
    x: Math.min(c.x, c.x + c.width),
    y: Math.min(c.y, c.y + c.height),
    width: Math.abs(c.width),
    height: Math.abs(c.height),
  };
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function CropImageClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ mode: DragMode; startX: number; startY: number; startCrop: CropArea }>({
    mode: 'none', startX: 0, startY: 0, startCrop: { x: 0, y: 0, width: 0, height: 0 },
  });

  const toImageCoords = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1) * imageDimensions.width;
    const y = clamp((clientY - rect.top) / rect.height, 0, 1) * imageDimensions.height;
    return { x, y };
  }, [imageDimensions]);

  const constrainCrop = useCallback((c: CropArea): CropArea => {
    let { x, y, width, height } = c;
    if (aspectRatio) {
      const ratio = parseFloat(aspectRatio);
      height = width / ratio;
    }
    x = clamp(x, 0, imageDimensions.width);
    y = clamp(y, 0, imageDimensions.height);
    width = clamp(width, 0, imageDimensions.width - x);
    height = clamp(height, 0, imageDimensions.height - y);
    if (aspectRatio) {
      height = width / parseFloat(aspectRatio);
      if (y + height > imageDimensions.height) {
        height = imageDimensions.height - y;
        width = height * parseFloat(aspectRatio);
      }
    }
    return { x, y, width, height };
  }, [aspectRatio, imageDimensions]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setAspectRatio(null);
          setCropArea({ x: img.width * 0.1, y: img.height * 0.1, width: img.width * 0.8, height: img.height * 0.8 });
        };
        setImageSrc(event.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAspectChange = (value: string | null) => {
    setAspectRatio(value);
    if (value) {
      const ratio = parseFloat(value);
      setCropArea(prev => {
        const c = normalizeCrop(prev);
        let newWidth = c.width;
        let newHeight = newWidth / ratio;
        if (newHeight > imageDimensions.height - c.y) {
          newHeight = imageDimensions.height - c.y;
          newWidth = newHeight * ratio;
        }
        newWidth = Math.min(newWidth, imageDimensions.width - c.x);
        newHeight = newWidth / ratio;
        return { x: c.x, y: c.y, width: newWidth, height: newHeight };
      });
    }
  };

  const hitTest = useCallback((imgX: number, imgY: number): DragMode => {
    const c = normalizeCrop(cropArea);
    if (c.width < 1 || c.height < 1) return 'draw';
    const handleSize = imageDimensions.width * 0.03;
    const corners = [
      { mode: 'resize-tl' as DragMode, cx: c.x, cy: c.y },
      { mode: 'resize-tr' as DragMode, cx: c.x + c.width, cy: c.y },
      { mode: 'resize-bl' as DragMode, cx: c.x, cy: c.y + c.height },
      { mode: 'resize-br' as DragMode, cx: c.x + c.width, cy: c.y + c.height },
    ];
    for (const { mode, cx, cy } of corners) {
      if (Math.abs(imgX - cx) < handleSize && Math.abs(imgY - cy) < handleSize) return mode;
    }
    if (imgX >= c.x && imgX <= c.x + c.width && imgY >= c.y && imgY <= c.y + c.height) return 'move';
    return 'draw';
  }, [cropArea, imageDimensions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageSrc || e.button !== 0) return;
    e.preventDefault();
    const { x, y } = toImageCoords(e.clientX, e.clientY);
    const mode = hitTest(x, y);
    dragRef.current = { mode, startX: x, startY: y, startCrop: { ...normalizeCrop(cropArea) } };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current.mode === 'none') return;
    const { x, y } = toImageCoords(e.clientX, e.clientY);
    const { mode, startX, startY, startCrop } = dragRef.current;
    const dx = x - startX;
    const dy = y - startY;

    setCropArea(() => {
      const sc = startCrop;
      if (mode === 'move') {
        return constrainCrop({
          ...sc,
          x: clamp(sc.x + dx, 0, imageDimensions.width - sc.width),
          y: clamp(sc.y + dy, 0, imageDimensions.height - sc.height),
        });
      }
      if (mode === 'draw') {
        const raw: CropArea = {
          x: Math.min(startX, x), y: Math.min(startY, y),
          width: Math.abs(x - startX), height: Math.abs(y - startY),
        };
        if (aspectRatio) {
          raw.height = raw.width / parseFloat(aspectRatio);
        }
        return constrainCrop(raw);
      }
      // resize
      let nx = sc.x, ny = sc.y, nw = sc.width, nh = sc.height;
      if (mode === 'resize-br') { nw = sc.width + dx; nh = sc.height + dy; }
      else if (mode === 'resize-bl') { nx = sc.x + dx; nw = sc.width - dx; nh = sc.height + dy; }
      else if (mode === 'resize-tr') { ny = sc.y + dy; nw = sc.width + dx; nh = sc.height - dy; }
      else if (mode === 'resize-tl') { nx = sc.x + dx; ny = sc.y + dy; nw = sc.width - dx; nh = sc.height - dy; }

      if (aspectRatio) {
        const ratio = parseFloat(aspectRatio);
        nh = nw / ratio;
        if (mode === 'resize-tl' || mode === 'resize-tr') {
          ny = sc.y + sc.height - nh;
        }
        if (mode === 'resize-tl' || mode === 'resize-bl') {
          nx = sc.x + sc.width - nw;
        }
      }
      if (nw < 10) return sc;
      if (nh < 10) return sc;
      return constrainCrop({ x: nx, y: ny, width: nw, height: nh });
    });
  }, [aspectRatio, constrainCrop, imageDimensions, toImageCoords]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.mode = 'none';
  }, []);

  const cropImage = () => {
    if (!imageSrc || !canvasRef.current) return;
    const c = normalizeCrop(cropArea);
    if (c.width < 1 || c.height < 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = c.width;
      canvas.height = c.height;
      ctx?.drawImage(img, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height);
      const link = document.createElement('a');
      link.download = 'cropped-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const clear = () => {
    setImageSrc(null);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setAspectRatio(null);
    setFileName('');
  };

  const aspectRatios = [
    { label: 'Free', value: null },
    { label: '1:1', value: '1' },
    { label: '4:3', value: '1.333' },
    { label: '16:9', value: '1.778' },
    { label: '2:3', value: '0.667' },
  ];

  const c = normalizeCrop(cropArea);
  const hasCrop = c.width > 0 && c.height > 0;

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                  setImageDimensions({ width: img.width, height: img.height });
                  setAspectRatio(null);
                  setCropArea({ x: img.width * 0.1, y: img.height * 0.1, width: img.width * 0.8, height: img.height * 0.8 });
                };
                setImageSrc(event.target?.result as string);
                setFileName(file.name);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        >
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
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
          {/* File Name */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">File:</span>
            <span className="truncate max-w-xs">{fileName}</span>
          </div>

          {/* Aspect Ratio Selection */}
          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => handleAspectChange(ratio.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  aspectRatio === ratio.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Image Preview with Crop Selection */}
          <div
            ref={containerRef}
            className="relative border border-gray-300 rounded-lg overflow-hidden select-none"
            style={{ maxHeight: '500px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full h-auto block"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
              draggable={false}
            />
            {/* Dark overlay outside crop */}
            {hasCrop && (
              <>
                <div className="absolute inset-0 bg-black/50 pointer-events-none"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 0% 100%,
                      ${(c.x / imageDimensions.width) * 100}% 100%,
                      ${(c.x / imageDimensions.width) * 100}% ${(c.y / imageDimensions.height) * 100}%,
                      ${((c.x + c.width) / imageDimensions.width) * 100}% ${(c.y / imageDimensions.height) * 100}%,
                      ${((c.x + c.width) / imageDimensions.width) * 100}% ${((c.y + c.height) / imageDimensions.height) * 100}%,
                      ${(c.x / imageDimensions.width) * 100}% ${((c.y + c.height) / imageDimensions.height) * 100}%,
                      ${(c.x / imageDimensions.width) * 100}% 100%,
                      0% 100%
                    )`,
                  }}
                />
                {/* Top overlay */}
                <div className="absolute left-0 right-0 top-0 bg-black/50 pointer-events-none"
                  style={{ height: `${(c.y / imageDimensions.height) * 100}%` }} />
                {/* Bottom overlay */}
                <div className="absolute left-0 right-0 bottom-0 bg-black/50 pointer-events-none"
                  style={{ height: `${((imageDimensions.height - c.y - c.height) / imageDimensions.height) * 100}%` }} />
                {/* Left overlay */}
                <div className="absolute left-0 bg-black/50 pointer-events-none"
                  style={{
                    top: `${(c.y / imageDimensions.height) * 100}%`,
                    width: `${(c.x / imageDimensions.width) * 100}%`,
                    height: `${(c.height / imageDimensions.height) * 100}%`,
                  }} />
                {/* Right overlay */}
                <div className="absolute right-0 bg-black/50 pointer-events-none"
                  style={{
                    top: `${(c.y / imageDimensions.height) * 100}%`,
                    width: `${((imageDimensions.width - c.x - c.width) / imageDimensions.width) * 100}%`,
                    height: `${(c.height / imageDimensions.height) * 100}%`,
                  }} />
                {/* Crop border */}
                <div
                  className="absolute border-2 border-white pointer-events-none"
                  style={{
                    left: `${(c.x / imageDimensions.width) * 100}%`,
                    top: `${(c.y / imageDimensions.height) * 100}%`,
                    width: `${(c.width / imageDimensions.width) * 100}%`,
                    height: `${(c.height / imageDimensions.height) * 100}%`,
                  }}
                >
                  {/* Grid lines (rule of thirds) */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                </div>
                {/* Corner handles */}
                {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => {
                  const positions: Record<string, React.CSSProperties> = {
                    tl: { left: '-6px', top: '-6px', cursor: 'nw-resize' },
                    tr: { right: '-6px', top: '-6px', cursor: 'ne-resize' },
                    bl: { left: '-6px', bottom: '-6px', cursor: 'sw-resize' },
                    br: { right: '-6px', bottom: '-6px', cursor: 'se-resize' },
                  };
                  return (
                    <div
                      key={corner}
                      className="absolute w-3 h-3 bg-white border border-gray-400 rounded-sm shadow-sm"
                      style={{
                        ...positions[corner],
                        left: corner === 'tl' || corner === 'bl'
                          ? `${(c.x / imageDimensions.width) * 100}%`
                          : `${((c.x + c.width) / imageDimensions.width) * 100}%`,
                        top: corner === 'tl' || corner === 'tr'
                          ? `${(c.y / imageDimensions.height) * 100}%`
                          : `${((c.y + c.height) / imageDimensions.height) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: positions[corner].cursor,
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>

          {/* Crop size info */}
          {hasCrop && (
            <div className="text-xs text-gray-500">
              Crop: {Math.round(c.width)} × {Math.round(c.height)} px
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={cropImage}
              disabled={!hasCrop}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasCrop
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              Crop & Download
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
