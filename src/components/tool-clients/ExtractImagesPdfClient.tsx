'use client';

import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

interface ExtractedImage {
  pageIndex: number;
  index: number;
  url: string;
  width: number;
  height: number;
}

export default function ExtractImagesPdfClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileName(file.name);
    setImages([]);
    setExtracted(false);
    setProgress(0);
  };

  const extractImages = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setImages([]);
    setExtracted(false);
    setProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const extractedImages: ExtractedImage[] = [];

      for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
        const page = await pdf.getPage(pageIndex);
        const ops = await page.getOperatorList();

        for (let i = 0; i < ops.fnArray.length; i++) {
          if (ops.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
            const imgName = ops.argsArray[i][0];

            try {
              const img = await page.objs.get(imgName);
              if (img && img.data) {
                const canvas = document.createElement('canvas');
                canvas.width = img.data.width;
                canvas.height = img.data.height;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                  const imageData = new ImageData(
                    new Uint8ClampedArray(img.data.data),
                    img.data.width,
                    img.data.height,
                  );
                  ctx.putImageData(imageData, 0, 0);

                  extractedImages.push({
                    pageIndex,
                    index:
                      extractedImages.filter((im) => im.pageIndex === pageIndex).length + 1,
                    url: canvas.toDataURL('image/png'),
                    width: img.data.width,
                    height: img.data.height,
                  });
                }
              }
            } catch {
              // skip this image if extraction fails
            }
          }
        }

        setProgress(Math.round((pageIndex / pdf.numPages) * 100));
      }

      setImages(extractedImages);
      setExtracted(true);
    } catch (err) {
      console.error(err);
      alert(
        'Error extracting images from PDF: ' +
          (err instanceof Error ? err.message : 'Unknown error') +
          '\nNote: Some PDFs use embedded images that cannot be extracted.',
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: ExtractedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}_page${image.pageIndex}_img${image.index}.png`;
    link.click();
  };

  const downloadAll = async () => {
    for (const image of images) {
      downloadImage(image);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const clear = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setFileName('');
    setSelectedFile(null);
    setExtracted(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Imported File */}
      {fileName && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-gray-700 truncate" title={fileName}>
            <span className="text-gray-500">Imported:</span>{' '}
            <span className="font-medium">{fileName}</span>
          </span>
        </div>
      )}

      {/* Upload */}
      {!selectedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload PDF File
          </button>
          <p className="text-sm text-gray-500 mt-2">Extract images from PDF</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Extracting images... {progress}%</p>
        </div>
      ) : !extracted ? (
        <div className="flex gap-2">
          <button
            onClick={extractImages}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Extract Images
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <p className="text-sm text-gray-600">
            Found <span className="font-medium">{images.length}</span> image{images.length !== 1 ? 's' : ''} in <span className="font-medium">{fileName}</span>
          </p>

          {images.length === 0 && (
            <p className="text-sm text-amber-600">
              No extractable images found. The PDF may use embedded raster scans or formats this tool cannot decode.
            </p>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
                  <img
                    src={image.url}
                    alt={`Page ${image.pageIndex} Image ${image.index}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Page {image.pageIndex}, Image {image.index}</p>
                  <p className="text-xs text-gray-400">{image.width}×{image.height}</p>
                  <button
                    onClick={() => downloadImage(image)}
                    className="mt-1 text-xs text-blue-600 hover:underline"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download All
            </button>
            <button
              onClick={clear}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
