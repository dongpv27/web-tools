'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

interface ExtractedImage {
  name: string;
  url: string;
  blob: Blob;
}

export default function ExtractImagesWordClient() {
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImages([]);
    setExtracting(true);

    try {
      const zip = await JSZip.loadAsync(file);
      const extractedImages: ExtractedImage[] = [];

      // Look for images in word/media folder
      const mediaFolder = zip.folder('word/media');

      if (mediaFolder) {
        const files = Object.keys(mediaFolder.files);

        for (const fileName of files) {
          const file = mediaFolder.files[fileName];
          if (!file.dir) {
            const blob = await file.async('blob');
            const url = URL.createObjectURL(blob);
            const name = fileName.split('/').pop() || fileName;

            extractedImages.push({
              name,
              url,
              blob,
            });
          }
        }
      }

      setImages(extractedImages);
    } catch {
      alert('Error extracting images. Please make sure it\'s a valid .docx file.');
    } finally {
      setExtracting(false);
    }
  };

  const downloadImage = (image: ExtractedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
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
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={extracting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {extracting ? 'Extracting...' : 'Upload Word Document'}
          </button>
          <p className="text-sm text-gray-500 mt-2">Supports .docx files (Word 2007+)</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats */}
          <p className="text-sm text-gray-600">
            Found <span className="font-medium">{images.length}</span> image{images.length !== 1 ? 's' : ''} in <span className="font-medium">{fileName}</span>
          </p>

          {/* Images Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 truncate">{image.name}</p>
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
