// Multi-script font loader for browser-side PDF generation.
// Mirrors src/app/api/convert/_lib/fonts.ts but runs in the browser.
//
// We download font TTFs from Google Fonts' jsdelivr mirror on first use and
// cache the bytes in module scope for the rest of the SPA session. pdf-lib's
// `subset: true` keeps the output PDF small even when embedding a 10MB CJK
// font.
//
// Coverage:
//   • bevp   — Latin + Vietnamese (Be Vietnam Pro, ~200KB per weight)
//   • cjk-sc — Simplified Chinese + Han ideographs
//   • cjk-tc — Traditional Chinese
//   • cjk-jp — Japanese (includes hiragana/katakana)
//   • cjk-kr — Korean (includes hangul)
//
// Note: CJK Noto families don't ship italic variants. Italic/boldItalic fall
// back to Regular/Bold rather than rendering "?" for every Asian character.

import type { PDFDocument, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export type FontFamily = 'bevp' | 'cjk-sc' | 'cjk-tc' | 'cjk-jp' | 'cjk-kr';

interface FamilyUrls {
  regular: string;
  bold: string;
  italic?: string;
  boldItalic?: string;
}

interface FamilySet {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
}

// CJK: notofonts/noto-cjk static OTFs, embedded WITHOUT subset.
//   - Variable TTFs from google/fonts: fontkit subsetter drops random glyphs
//     even when present in the font (observed "Test có" → "Te có"). The
//     variable axis confuses subsetting.
//   - OTF + subset:true: fontkit CFF subsetter throws RangeError.
//   - OTF + subset:false: embeds the full ~16MB CJK font. Output PDF is
//     large but every glyph renders. Cached in module scope so we only pay
//     the download once per session.
// bevp stays subsetted — small font, no issues.
const FONT_URLS: Record<FontFamily, FamilyUrls> = {
  bevp: {
    regular: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro/BeVietnamPro-Regular.ttf',
    bold: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro/BeVietnamPro-Bold.ttf',
    italic: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro/BeVietnamPro-Italic.ttf',
    boldItalic: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/bevietnampro/BeVietnamPro-BoldItalic.ttf',
  },
  'cjk-sc': {
    regular: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf',
    bold: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Bold.otf',
  },
  'cjk-tc': {
    regular: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/TraditionalChinese/NotoSansCJKtc-Regular.otf',
    bold: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/TraditionalChinese/NotoSansCJKtc-Bold.otf',
  },
  'cjk-jp': {
    regular: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf',
    bold: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf',
  },
  'cjk-kr': {
    regular: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/Korean/NotoSansCJKkr-Regular.otf',
    bold: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/Korean/NotoSansCJKkr-Bold.otf',
  },
};

const isCjk = (family: FontFamily): boolean => family !== 'bevp';

const bytesCache = new Map<string, ArrayBuffer>();

async function fetchFontBytes(url: string): Promise<ArrayBuffer> {
  const cached = bytesCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font (${res.status})`);
  const buf = await res.arrayBuffer();
  bytesCache.set(url, buf);
  return buf;
}

const RE_HANGUL = /[가-힯ᄀ-ᇿ㄰-㆏]/;
const RE_KANA = /[぀-ヿㇰ-ㇿ]/;
const RE_BOPOMOFO = /[㄀-ㄯㆠ-ㆿ]/;
const RE_HAN = /[㐀-鿿豈-﫿]/;

export function pickDocFamily(textChunks: string[]): FontFamily {
  let kr = 0, jp = 0, tc = 0, sc = 0;
  for (const t of textChunks) {
    if (RE_HANGUL.test(t)) kr++;
    if (RE_KANA.test(t)) jp++;
    if (RE_BOPOMOFO.test(t)) tc++;
    if (RE_HAN.test(t)) sc++;
  }
  if (kr > 0) return 'cjk-kr';
  if (jp > 0) return 'cjk-jp';
  if (tc > 0) return 'cjk-tc';
  if (sc > 0) return 'cjk-sc';
  return 'bevp';
}

export async function embedFamily(
  pdfDoc: PDFDocument,
  family: FontFamily,
): Promise<FamilySet> {
  pdfDoc.registerFontkit(fontkit);
  const urls = FONT_URLS[family];
  // CJK OTFs use CFF — fontkit subsetter fails. Embed full font for CJK.
  const subset = !isCjk(family);

  const [regBytes, boldBytes] = await Promise.all([
    fetchFontBytes(urls.regular),
    fetchFontBytes(urls.bold),
  ]);
  const regular = await pdfDoc.embedFont(regBytes, { subset });
  const bold = await pdfDoc.embedFont(boldBytes, { subset });

  let italic = regular;
  let boldItalic = bold;
  if (urls.italic) {
    italic = await pdfDoc.embedFont(await fetchFontBytes(urls.italic), { subset });
  }
  if (urls.boldItalic) {
    boldItalic = await pdfDoc.embedFont(
      await fetchFontBytes(urls.boldItalic),
      { subset },
    );
  }

  return { regular, bold, italic, boldItalic };
}

export function pickWeight(set: FamilySet, bold: boolean, italic: boolean): PDFFont {
  if (bold && italic) return set.boldItalic;
  if (bold) return set.bold;
  if (italic) return set.italic;
  return set.regular;
}
