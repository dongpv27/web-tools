'use client';

import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Be Vietnam Pro is purpose-built for Vietnamese — guaranteed full coverage
// of Latin Extended Additional (U+1E00–U+1EFF) including all uppercase
// Vietnamese letters. Static (non-variable) TTF avoids fontkit subset bugs.
const FONT_URLS = [
  'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro/BeVietnamPro-Regular.ttf',
  'https://cdn.jsdelivr.net/gh/google/fonts@main/apache/roboto/static/Roboto-Regular.ttf',
];

let cachedFontBytes: ArrayBuffer | null = null;

async function loadFontBytes(): Promise<ArrayBuffer> {
  if (cachedFontBytes) return cachedFontBytes;
  for (const url of FONT_URLS) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        cachedFontBytes = buf;
        return buf;
      }
    } catch {
      // try next
    }
  }
  throw new Error('Failed to load font for PDF embedding');
}

// Walk descendants of a paragraph node, collecting text from all OOXML
// text-bearing elements: w:t (text), w:tab → "\t", w:br → "\n",
// w:noBreakHyphen → "-", w:softHyphen → "" (visual only), w:sym → mapped char.
// textContent alone would miss tabs/breaks and include w:instrText (field
// codes) we don't want.
function paragraphText(p: Element): string {
  const TEXT_TAGS = new Set(['t', 'delText']);
  let out = '';
  const walk = (n: Node) => {
    if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as Element;
      const local = el.localName;
      // skip field-code instructions and deleted content
      if (local === 'instrText' || el.tagName === 'w:instrText') return;
      if (local === 'tab') {
        out += '\t';
        return;
      }
      if (local === 'br') {
        out += '\n';
        return;
      }
      if (local === 'noBreakHyphen') {
        out += '-';
        return;
      }
      if (local === 'softHyphen') return;
      if (local === 'sym') {
        const codeAttr = el.getAttribute('w:char') || el.getAttribute('char');
        if (codeAttr) {
          const cp = parseInt(codeAttr, 16);
          if (!Number.isNaN(cp)) out += String.fromCodePoint(cp);
        }
        return;
      }
      if (TEXT_TAGS.has(local)) {
        out += el.textContent || '';
        return;
      }
    }
    for (const child of Array.from(n.childNodes)) walk(child);
  };
  walk(p);
  return out;
}

function extractParagraphs(xml: string): string[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const paragraphs: string[] = [];
  const ps = doc.getElementsByTagName('w:p');
  for (let i = 0; i < ps.length; i++) {
    const raw = paragraphText(ps[i]);
    // NFC-normalize: Word may store Vietnamese as decomposed sequences
    // (base + combining marks). pdf-lib has no OT mark positioning, so
    // decomposed text shows floating diacritics. NFC collapses to
    // precomposed codepoints (U+1EA0–U+1EF9 etc.) the font has as glyphs.
    paragraphs.push(raw.normalize('NFC'));
  }
  return paragraphs;
}

export default function WordToPdfClient() {
  const [converting, setConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPdfUrl(null);
    setError('');
  };

  const convert = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) return;

    setConverting(true);
    setError('');

    try {
      const file = fileInput.files[0];
      const zip = await JSZip.loadAsync(file);
      const documentXml = zip.file('word/document.xml');
      if (!documentXml) throw new Error('Invalid Word document (missing word/document.xml)');

      const xml = await documentXml.async('text');
      const paragraphs = extractParagraphs(xml);

      const fontBytes = await loadFontBytes();
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const font = await pdfDoc.embedFont(fontBytes, { subset: true });

      const fontSize = 11;
      const lineHeight = fontSize * 1.45;
      const marginX = 56;
      const marginY = 72;
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const maxWidth = pageWidth - marginX * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let cursorY = pageHeight - marginY;

      const newPage = () => {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        cursorY = pageHeight - marginY;
      };

      const wrapLine = (text: string): string[] => {
        if (!text) return [''];
        const words = text.split(/(\s+)/); // keep spaces
        const lines: string[] = [];
        let current = '';
        for (const w of words) {
          const candidate = current + w;
          const width = font.widthOfTextAtSize(candidate, fontSize);
          if (width <= maxWidth) {
            current = candidate;
          } else {
            if (current) lines.push(current.trimEnd());
            // word itself longer than line: hard-break by char
            if (font.widthOfTextAtSize(w, fontSize) > maxWidth) {
              let chunk = '';
              for (const ch of w) {
                if (font.widthOfTextAtSize(chunk + ch, fontSize) > maxWidth) {
                  if (chunk) lines.push(chunk);
                  chunk = ch;
                } else {
                  chunk += ch;
                }
              }
              current = chunk;
            } else {
              current = w.trimStart();
            }
          }
        }
        if (current) lines.push(current.trimEnd());
        return lines;
      };

      for (const para of paragraphs) {
        // Expand tabs and explicit line breaks before wrapping.
        const segments = para.replace(/\t/g, '    ').split('\n');
        for (const seg of segments) {
          const wrapped = wrapLine(seg);
          for (const line of wrapped) {
            if (cursorY < marginY) newPage();
            page.drawText(line, {
              x: marginX,
              y: cursorY,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
            cursorY -= lineHeight;
          }
        }
        // paragraph spacing
        cursorY -= lineHeight * 0.4;
      }

      const pdfBytes = await pdfDoc.save();
      // pdf-lib returns Uint8Array; wrap a fresh copy in Blob to avoid SharedArrayBuffer typing issues
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error converting file');
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    link.click();
  };

  const clear = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {!pdfUrl ? (
        <div className="space-y-4">
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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Word Document
            </button>
            <p className="text-sm text-gray-500 mt-2">Supports .docx files</p>
          </div>

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

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={convert}
            disabled={!fileName || converting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {converting ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              PDF generated successfully. Click below to download.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Note: Conversion extracts text and renders to A4 pages. Complex formatting (tables, images, advanced layout) is not preserved.
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
