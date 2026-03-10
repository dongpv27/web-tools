'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PptToPdfClient() {
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setDownloadUrl(null);

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

      // Extract text from slides
      const slidesFolder = zip.folder('ppt/slides');
      const slideTexts: string[] = [];

      if (slidesFolder) {
        const slideFiles = Object.keys(slidesFolder.files)
          .filter(f => f.endsWith('.xml') && !f.includes('_rels'))
          .sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
            const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
            return numA - numB;
          });

        for (const slideFile of slideFiles) {
          const content = await slidesFolder.files[slideFile].async('text');
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, 'text/xml');

          const textNodes = xmlDoc.getElementsByTagName('a:t');
          let slideText = '';
          for (let i = 0; i < textNodes.length; i++) {
            slideText += (textNodes[i].textContent || '') + ' ';
          }
          slideTexts.push(slideText.trim());
        }
      }

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const slideText of slideTexts) {
        const page = pdfDoc.addPage([612, 792]); // Letter size
        const { width, height } = page.getSize();

        // Add title
        page.drawText('PowerPoint Slide', {
          x: 50,
          y: height - 50,
          size: 18,
          font,
          color: rgb(0, 0, 0),
        });

        // Add text content (wrap text)
        const lines = wrapText(slideText, font, 12, width - 100);
        let y = height - 100;

        for (const line of lines) {
          if (y < 50) break;
          page.drawText(line, {
            x: 50,
            y,
            size: 12,
            font,
            color: rgb(0.2, 0.2, 0.2),
          });
          y -= 18;
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch {
      alert('Error converting PPT to PDF');
    } finally {
      setConverting(false);
    }
  };

  const wrapText = (text: string, font: any, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const download = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    link.click();
  };

  const clear = () => {
    setDownloadUrl(null);
    setFileName('');
    setSlideCount(0);
  };

  return (
    <div className="space-y-6">
      {!downloadUrl ? (
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
            <p className="text-sm text-gray-500 mt-2">Convert PPT to PDF</p>
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
                {converting ? 'Converting...' : 'Convert to PDF'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              Converted <span className="font-medium">{fileName}</span> to PDF
            </p>
            <p className="text-xs text-green-600 mt-1">
              Note: This creates a text-based PDF with extracted content
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={download}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF
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
