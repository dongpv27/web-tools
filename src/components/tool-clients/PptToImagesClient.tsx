'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function PptToImagesClient() {
  const [converting, setConverting] = useState(false);
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImages([]);

    try {
      const zip = await JSZip.loadAsync(file);
      const slidesFolder = zip.folder('ppt/slides');

      if (slidesFolder) {
        const files = Object.keys(slidesFolder.files);
        const slideCount = files.filter(f => f.endsWith('.xml') && !f.includes('_rels')).length;
        setSlideCount(slideCount);
      }
    } catch {
      alert('Error reading PowerPoint file');
    }
  };

  const convert = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) return;

    setConverting(true);

    try {
      const file = fileInput.files[0];
      const zip = await JSZip.loadAsync(file);

      // Extract all images from ppt/media folder
      const mediaFolder = zip.folder('ppt/media');
      const extractedImages: { name: string; url: string }[] = [];

      if (mediaFolder) {
        const files = Object.keys(mediaFolder.files);

        for (const filePath of files) {
          const file = mediaFolder.files[filePath];
          if (!file.dir) {
            const blob = await file.async('blob');
            const url = URL.createObjectURL(blob);
            const name = filePath.split('/').pop() || filePath;

            extractedImages.push({ name, url });
          }
        }
      }

      setImages(extractedImages);
    } catch {
      alert('Error extracting images. Note: This extracts embedded images from the PPT.');
    } finally {
      setConverting(false);
    }
  };

  const downloadImage = (image: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    link.click();
  };

  const downloadAll = async () => {
    // Create a zip file with all images
    const zip = new JSZip();

    for (const image of images) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(image.name, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}_images.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    setFileName('');
    setSlideCount(0);
  };

  return (
    <div className="space-y-6">
      {!images.length ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pptx"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={converting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload PowerPoint File
            </button>
            <p className="text-sm text-gray-500 mt-2">Extract images from .pptx files</p>
          </div>

          {fileName && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{fileName}</span> - {slideCount} slides
              </p>

              <button
                onClick={convert}
                disabled={converting}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {converting ? 'Extracting...' : 'Extract Images'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found <span className="font-medium">{images.length}</span> images in <span className="font-medium">{fileName}</span>
          </p>

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
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download All (ZIP)
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
