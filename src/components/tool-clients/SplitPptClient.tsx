'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';

export default function SplitPptClient() {
  const [fileName, setFileName] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(0);
  const [slides, setSlides] = useState<{ index: number; name: string }[]>([]);
  const [selectedSlides, setSelectedSlides] = useState<number[]>([]);
  const [splitResult, setSplitResult] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [originalZip, setOriginalZip] = useState<JSZip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSplitResult([]);

    try {
      const zip = await JSZip.loadAsync(file);
      setOriginalZip(zip);

      const slidesFolder = zip.folder('ppt/slides');
      if (slidesFolder) {
        const slideFiles = Object.keys(slidesFolder.files)
          .filter(f => f.endsWith('.xml') && !f.includes('_rels'))
          .sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
            return numA - numB;
          });

        setSlideCount(slideFiles.length);
        setSlides(slideFiles.map((f, i) => ({
          index: i + 1,
          name: f,
        })));
        setSelectedSlides([]);
      }
    } catch {
      alert('Error reading PowerPoint file');
    }
  };

  const toggleSlide = (slideIndex: number) => {
    setSelectedSlides((prev) =>
      prev.includes(slideIndex)
        ? prev.filter((s) => s !== slideIndex)
        : [...prev, slideIndex].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedSlides(slides.map((s) => s.index));
  };

  const deselectAll = () => {
    setSelectedSlides([]);
  };

  const split = async () => {
    if (!originalZip || selectedSlides.length === 0) return;

    setLoading(true);

    try {
      const results: { name: string; url: string }[] = [];

      // Create a new PPTX with selected slides
      const newZip = new JSZip();

      // Copy the selected slides
      const slidesFolder = originalZip.folder('ppt/slides');
      const relsFolder = originalZip.folder('ppt/slides/_rels');

      selectedSlides.forEach((slideIndex, i) => {
        const slidePath = `ppt/slides/slide${slideIndex}.xml`;
        const slideFile = originalZip.file(slidePath);
        if (slideFile) {
          newZip.file(`ppt/slides/slide${i + 1}.xml`, slideFile.async('blob'));
        }

        const relsPath = `ppt/slides/_rels/slide${slideIndex}.xml.rels`;
        const relsFile = originalZip.file(relsPath);
        if (relsFile) {
          newZip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, relsFile.async('blob'));
        }
      });

      // Add minimal required files
      newZip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${selectedSlides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('\n  ')}
</Types>`);

      newZip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

      const blob = await newZip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);

      results.push({
        name: `${fileName.replace(/\.[^/.]+$/, '')}_split.pptx`,
        url,
      });

      setSplitResult(results);
    } catch {
      alert('Error splitting PowerPoint');
    } finally {
      setLoading(false);
    }
  };

  const download = (result: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    link.click();
  };

  const clear = () => {
    setFileName('');
    setSlideCount(0);
    setSlides([]);
    setSelectedSlides([]);
    setSplitResult([]);
    setOriginalZip(null);
  };

  return (
    <div className="space-y-6">
      {!splitResult.length ? (
        <div className="space-y-4">
          {/* Upload */}
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Upload PowerPoint File
            </button>
          </div>

          {/* Slide Selection */}
          {slideCount > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{fileName}</span> - {slideCount} slides
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Select Slides ({selectedSlides.length} selected)
                </label>
                <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                  {slides.map((slide) => (
                    <button
                      key={slide.index}
                      onClick={() => toggleSlide(slide.index)}
                      className={`w-10 h-10 text-sm rounded-md transition-colors ${
                        selectedSlides.includes(slide.index)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {slide.index}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={split}
                disabled={loading || selectedSlides.length === 0}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Splitting...' : `Extract ${selectedSlides.length} Slides`}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Extracted {selectedSlides.length} slides from <span className="font-medium">{fileName}</span>
          </p>

          <div className="space-y-2">
            {splitResult.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{result.name}</span>
                <button
                  onClick={() => download(result)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={clear}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
