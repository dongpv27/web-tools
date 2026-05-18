import { Code, FileText, Image, Palette, ArrowLeftRight, Wrench, FileSpreadsheet, Video } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  description: string;
  // Long-form intro (200+ words) rendered on the category landing page.
  // Used for SEO topical depth and to give visitors a clear sense of what
  // the category covers and when each tool is useful.
  longDescription: string;
  icon: string;
  slug: string;
  toolCount: number;
}

export const categories: Category[] = [
  {
    id: 'dev',
    name: 'Developer Tools',
    description:
      'Free online developer utilities for JSON, Base64, JWT, hashing, regex, encoding, and more — fast, private, and entirely client-side.',
    longDescription:
      "Developer tools are the small daily utilities that quietly shape how productive you feel: a quick JSON formatter to make an API payload readable, a Base64 encoder for a webhook header, a UUID generator for a test fixture, a JWT decoder to inspect a token claim, a regex tester to validate a pattern before shipping it to production. Instead of bouncing between half-trusted websites that may log your data, this collection gives you 30+ developer utilities that all run entirely in your browser — your code, tokens, and payloads never leave your device.\n\nThe tools here cover the work most engineers do every day: formatting and validating JSON, YAML, XML and SQL; encoding and decoding Base64, URL, and HTML entities; hashing with MD5, SHA-256, and bcrypt; generating UUIDs, GUIDs, nano IDs and secure tokens; parsing user agents, URLs, query strings and cron expressions; and converting between binary, hex, decimal and timestamps. Each tool loads in under a second, has no usage cap, and never asks you to sign up. Bookmark the ones you reach for most — they're built so you can chain them together (format JSON, decode a JWT inside it, then hash the result) without leaving the page.",
    icon: 'Code',
    slug: 'developer-tools',
    toolCount: 35,
  },
  {
    id: 'text',
    name: 'Text Tools',
    description:
      'Free online text utilities to count, clean, transform, compare, and reformat text — all in your browser, no signup required.',
    longDescription:
      "Text tools take the tedious cleanup out of working with copied text. Anyone who has ever pasted content from a PDF, a chat thread, an email, or a spreadsheet knows the pain: smart quotes turn into squares, line breaks land in awkward places, lists arrive as inconsistent bullets, and you spend more time fixing whitespace than reading. This category brings together 24+ utilities that fix those problems in one click — and like every tool on the site, they run entirely in your browser, so the text you paste never leaves your device.\n\nThe collection covers the full spectrum of text manipulation: counting characters, words, sentences and reading time; converting between camelCase, snake_case, kebab-case, Title Case, UPPERCASE and lowercase; removing duplicate lines, empty lines, line breaks, HTML tags, extra spaces and ASCII artefacts; sorting lines alphabetically or numerically; reversing text; comparing two blocks to find differences; generating Lorem Ipsum, random names, random text and slugs; translating to Morse code, ROT13, ASCII; and bulk find-and-replace. Whether you're cleaning data before importing it, prepping copy for a website, or just running a quick word count, the right tool is one click away — no installs, no logins, no waiting for an API to respond.",
    icon: 'FileText',
    slug: 'text',
    toolCount: 24,
  },
  {
    id: 'image',
    name: 'Image Tools',
    description:
      'Free online image utilities to resize, convert, compress, crop, rotate and edit images — all in your browser with no upload.',
    longDescription:
      "Image tools handle the everyday tasks that would otherwise mean opening Photoshop, paying for a subscription, or uploading sensitive screenshots to a stranger's server. This category collects 28+ in-browser utilities that resize, convert, compress, crop, rotate, flip, blur, pixelate, adjust brightness, extract colours, and apply borders to images — all without ever sending your file to a backend. Drop an image in, tweak the settings, and download the result; nothing is logged, stored, or transmitted anywhere.\n\nThe tools cover most realistic image workflows: converting between PNG, JPG, WebP, GIF, SVG and ICO; compressing PNG / JPEG / GIF for the web; resizing to specific dimensions or by percentage; cropping to a fixed aspect ratio; generating favicons in every standard size; making ICO multi-size icons; turning a series of frames into a GIF; converting images to and from Base64; picking colours straight from an image; and extracting a clean palette from a photograph. Because everything runs locally with the browser's Canvas and image APIs, the tools work offline once the page is loaded, never count against an API quota, and are safe to use on private screenshots, draft assets, or anything you'd rather not upload. They're built for designers, developers, content creators, and anyone who just needs to clean up an image in a hurry.",
    icon: 'Image',
    slug: 'image',
    toolCount: 28,
  },
  {
    id: 'video',
    name: 'Video Tools',
    description:
      'Free online video tools to convert, compress, trim, change speed, add text or watermarks — all run in your browser via FFmpeg WASM.',
    longDescription:
      "Video tools are usually the place online utilities get scary: upload a private clip to a random site, wait for a queue, hope it processes, and trust the file gets deleted afterwards. This category does the opposite. All 21+ video tools run entirely in your browser through FFmpeg compiled to WebAssembly, which means your footage is decoded, edited, and re-encoded locally on your own machine. The file never touches a server and no upload bar exists.\n\nThe collection covers the conversions and edits most people actually need: converting between MP4, WebM, AVI, MOV; compressing video for upload to social platforms; trimming a clip to a specific start / end point; changing playback speed from 0.25x up to 8x; extracting audio as MP3, WAV or AAC; converting a video into a looping GIF; rotating, flipping, cropping and resizing; adding text overlays with adjustable font, size, colour and position; adding a watermark image that can be dragged anywhere on the frame; merging multiple clips; and grabbing thumbnails or screenshots from any timestamp. The first conversion is slower because FFmpeg WASM has to download (~30 MB) and warm up, but subsequent operations are fast and don't depend on your internet speed or any backend processing.",
    icon: 'Video',
    slug: 'video-tools',
    toolCount: 21,
  },
  {
    id: 'color',
    name: 'Color Tools',
    description:
      'Free online color utilities — pickers, converters between HEX / RGB / HSL, palette generators, contrast checkers and gradient builders.',
    longDescription:
      "Color tools are for the moments when you need to translate a brand colour into HEX, build a palette around a single accent, check if your text passes WCAG contrast on a button, or sketch a gradient for a hero section. This category gathers 13+ utilities focused entirely on colour work, all running client-side so you can iterate as quickly as you can change a value.\n\nThe collection includes a full-featured colour picker; bi-directional converters between HEX, RGB, RGBA, HSL, and Tailwind classes; a palette generator that builds harmonious schemes (complementary, analogous, triadic, monochromatic); a random colour generator with seed support; a WCAG AA / AAA contrast checker that tells you exactly which text sizes pass on a given background; a CSS gradient builder with multi-stop linear, radial and conic gradients; and a general-purpose colour converter that normalises any input format. Designers can prototype palettes before opening Figma, front-end developers can paste a Tailwind class and get the underlying HEX, accessibility auditors can quickly check a mock-up, and anyone refreshing a personal site can find a colour scheme they like in minutes. Every tool runs locally — no telemetry, no signups, no waiting on a slow palette API.",
    icon: 'Palette',
    slug: 'color',
    toolCount: 13,
  },
  {
    id: 'converter',
    name: 'Converters',
    description:
      'Free online converters for data formats, units, dates and timestamps — CSV, JSON, XML, YAML, Markdown, temperature, length, weight and more.',
    longDescription:
      "Converters are the connectors that link different parts of your workflow together. Anyone who has had to feed a CSV export into a JSON API, paste tabular data into Markdown, drop a Unix timestamp into a human-readable date, or move a recipe from Fahrenheit to Celsius knows the friction of opening a new tab, finding a half-working tool, and praying it doesn't mangle the data. This category brings together 17+ converters that all run in your browser, never upload your data, and handle the common edge cases (UTF-8 BOM, quoted CSV fields, escaped Markdown characters, leap-year dates) correctly.\n\nThe collection covers data format conversions (CSV ↔ JSON, JSON ↔ XML, JSON ↔ YAML, Markdown ↔ HTML, Markdown to PDF, Excel to JSON), text encoding (text ↔ Base64), generators (QR code from text or URL, barcode), date and time conversions (Unix timestamp ↔ readable date in any timezone, time zone math, duration converter), and physical-unit converters (temperature, length, weight, generic unit converter that handles dozens of categories). Each tool focuses on a single conversion task, so the interface stays simple: paste in, click convert, copy or download out. Bookmark the ones that fit your workflow and you'll stop reaching for half-trusted converters scattered across search results.",
    icon: 'ArrowLeftRight',
    slug: 'converter',
    toolCount: 17,
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    description:
      'Free online utilities that don\'t fit a single category — calculators, generators, simulators, age and BMI checkers, and more.',
    longDescription:
      "Miscellaneous is the catch-all for the small but useful utilities that don't quite fit a single category — and yet are the ones you reach for more often than you'd expect. Need to roll a six-sided die for a board game over video chat? Generate a random number in a specific range for a giveaway? Check the strength of a password before saving it to a manager? Work out somebody's age from their date of birth, calculate a BMI, set a countdown timer, or settle a disagreement with a coin flip? Those are exactly the things this category was built for.\n\nThe collection includes 13+ tools: a configurable random number generator with min / max / unique constraints; a dice roll simulator that supports any-sided dice and multiple rolls; a coin flip with weighted probability; a password strength checker that scores entropy and gives feedback; secure token, nano ID, slug and GUID / UUID bulk generators (handy for testing); a percentage and unit calculator; a BMI calculator with WHO classification; an age calculator that handles leap years and time zones; a countdown timer with desktop notifications; and a barcode generator for retail or asset labelling. Everything runs in your browser — no signups, no usage caps, and nothing logged. Bookmark the page so the next time you need 'a random number from 1 to 100' you don't end up scrolling past three ad-laden sites to get one.",
    icon: 'Wrench',
    slug: 'misc',
    toolCount: 13,
  },
  {
    id: 'office',
    name: 'Office Tools',
    description:
      'Free online office tools for Word, Excel, PowerPoint and PDF — convert, merge, split, count, extract text and images, all in your browser.',
    longDescription:
      "Office tools handle the everyday document conversions and edits that usually mean firing up Microsoft Office, paying for a desktop converter, or — worse — uploading a confidential file to an unknown SaaS. This category collects 27+ utilities for Word, Excel, PowerPoint and PDF that all run entirely in your browser. Nothing is uploaded, nothing is stored, and you don't need an account to use any of them.\n\nThe collection covers the conversions most people actually need: Excel ↔ CSV / JSON / XML / SQL, Word ↔ PDF / TXT, PDF ↔ Excel / CSV / Word / PowerPoint, and PowerPoint ↔ PDF / images. There are merge and split tools for every major office format (combine multiple Word documents, split a PDF by page range, merge several Excel sheets into one workbook, divide a PowerPoint deck), and extractor tools that pull text, images, or page counts out of any office file. CSV imports auto-detect encoding (UTF-8, Shift_JIS, GB18030, EUC-KR, Big5, Vietnamese) so files exported from Asian-language Excel installations don't turn into mojibake. PDF tools use pdf.js under the hood, Excel tools use SheetJS, Word and PowerPoint tools parse and rebuild the underlying OOXML zip. Everything stays on your machine — open the tool, drop the file, get the result.",
    icon: 'FileSpreadsheet',
    slug: 'office',
    toolCount: 27,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Image,
  Palette,
  ArrowLeftRight,
  Wrench,
  FileSpreadsheet,
  Video,
};
