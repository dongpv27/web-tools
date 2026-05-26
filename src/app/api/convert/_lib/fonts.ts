// Multi-script font loader for server-side PDF generation.
//
// Approach: detect dominant script per paragraph, load only the font family
// needed. Fonts are cached in module scope so a warm function only pays the
// network cost once per family. pdf-lib's `subset: true` ensures output PDF
// stays small even when embedding a 10MB CJK font.
//
// Coverage:
//   • bevp   — Latin + Vietnamese (Be Vietnam Pro, ~200KB per weight)
//   • cjk-sc — Simplified Chinese + Han ideographs (Noto Sans SC, ~10MB)
//   • cjk-tc — Traditional Chinese (Noto Sans TC)
//   • cjk-jp — Japanese (Noto Sans JP, includes hiragana/katakana)
//   • cjk-kr — Korean (Noto Sans KR, includes hangul)
//
// Italics: CJK Noto families don't ship italic variants. For italic CJK runs
// we reuse Regular/Bold (visually unmarked italic) — better than rendering
// "?" for every Asian character.

import type { PDFDocument, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export type FontFamily = 'bevp' | 'cjk-sc' | 'cjk-tc' | 'cjk-jp' | 'cjk-kr';

interface FamilySet {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
}

interface FamilyUrls {
  regular: string;
  bold: string;
  italic?: string;
  boldItalic?: string;
}

// CJK: notofonts/noto-cjk static OTFs, embedded WITHOUT subset.
//   - Variable TTFs from google/fonts: fontkit subsetter drops random glyphs
//     (observed: "Test có" → "Te có" — chars present in font but not in
//     emitted subset). Variable axis confuses the subsetter.
//   - OTF + subset:true: fontkit's CFF subsetter throws RangeError on Noto
//     CJK's large CFF tables.
//   - OTF + subset:false (this approach): embed the full ~16MB font. PDF
//     output gets bloated, but every glyph renders correctly. CJK docs are
//     a minority case so the size hit is acceptable.
// Latin/Vietnamese (bevp) is small and subsets fine — keep it subsetted.
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

// Module-scoped cache: same warm function instance reuses already-downloaded
// bytes. ArrayBuffer because that's what pdf-lib's embedFont expects.
const fontBytesCache = new Map<string, ArrayBuffer>();

async function fetchFontBytes(url: string): Promise<ArrayBuffer> {
  const cached = fontBytesCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font (${res.status}): ${url}`);
  const buf = await res.arrayBuffer();
  fontBytesCache.set(url, buf);
  return buf;
}

// Detect which CJK script dominates a string, so we pick the most appropriate
// regional variant. The CJK Han ranges overlap across SC/TC/JP/KR, but each
// region has its own preferred glyph style — using the wrong variant looks
// foreign to native readers even though letters are technically legible.
//
// Hangul → KR. Hiragana/Katakana → JP. Bopomofo/CJK Compat → TC.
// Plain Han → SC (largest user base by far).
const RE_HANGUL = /[가-힯ᄀ-ᇿ㄰-㆏]/;
const RE_KANA = /[぀-ヿㇰ-ㇿ]/; // Hiragana + Katakana + extensions
const RE_BOPOMOFO = /[㄀-ㄯㆠ-ㆿ]/;
const RE_HAN = /[㐀-鿿豈-﫿]/;
const RE_VIETNAMESE = /[Ḁ-ỿ]/;

export function pickFamily(text: string): FontFamily {
  if (RE_HANGUL.test(text)) return 'cjk-kr';
  if (RE_KANA.test(text)) return 'cjk-jp';
  if (RE_BOPOMOFO.test(text)) return 'cjk-tc';
  if (RE_HAN.test(text)) return 'cjk-sc';
  // Plain Latin/Vietnamese (or any other script bevp can't render — falls back
  // gracefully because the Latin glyphs at least won't crash).
  return 'bevp';
}

/**
 * Pre-scan text and pick the *single* family that should be used document-wide.
 * Picking per-paragraph would mix fonts within a doc which looks ugly; instead
 * we choose one family that best covers the dominant script.
 *
 * Tie-breaker order: hangul > kana > bopomofo > han > vietnamese > latin.
 */
export function pickDocFamily(textChunks: string[]): FontFamily {
  let kr = 0, jp = 0, tc = 0, sc = 0, viet = 0;
  for (const t of textChunks) {
    if (RE_HANGUL.test(t)) kr++;
    if (RE_KANA.test(t)) jp++;
    if (RE_BOPOMOFO.test(t)) tc++;
    if (RE_HAN.test(t)) sc++;
    if (RE_VIETNAMESE.test(t)) viet++;
  }
  if (kr > 0) return 'cjk-kr';
  if (jp > 0) return 'cjk-jp';
  if (tc > 0) return 'cjk-tc';
  if (sc > 0) return 'cjk-sc';
  return 'bevp';
}

/**
 * Embed a family into the document. Returns a 4-tuple of weight/style variants.
 * For CJK families that lack italic TTFs, italic = regular and boldItalic =
 * bold — readable, just not visually italicised.
 */
export async function embedFamily(
  pdfDoc: PDFDocument,
  family: FontFamily,
): Promise<FamilySet> {
  pdfDoc.registerFontkit(fontkit);
  const urls = FONT_URLS[family];
  // CJK OTFs use CFF outlines; fontkit's CFF subsetter throws RangeError.
  // Embed full font for CJK; subset Latin/Vietnamese (small + works fine).
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
