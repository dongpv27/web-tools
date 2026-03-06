export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  slug: string;
  icon: string;
  keywords: string[];
  faq?: {
    question: string;
    answer: string;
  }[];
  relatedTools?: string[];
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify your JSON data with syntax highlighting. This online JSON formatter makes your JSON data easy to read and debug.',
    shortDescription: 'Format and beautify JSON data online',
    category: 'dev',
    slug: 'json-formatter',
    icon: 'Braces',
    keywords: ['json', 'formatter', 'beautify', 'format json', 'json parser', 'json validator'],
    faq: [
      {
        question: 'What is JSON Formatter?',
        answer: 'JSON Formatter is an online tool that helps you format and beautify JSON data. It takes compressed or minified JSON and adds proper indentation and line breaks to make it human-readable.',
      },
      {
        question: 'Is my JSON data secure?',
        answer: 'Yes, all processing happens in your browser. Your JSON data is never sent to any server, ensuring complete privacy and security.',
      },
      {
        question: 'Can I format invalid JSON?',
        answer: 'The formatter will show an error message if your JSON is invalid. You can use our JSON Validator tool to find and fix errors in your JSON.',
      },
    ],
    relatedTools: ['json-validator', 'json-to-yaml', 'base64-encode'],
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate your JSON data and find errors quickly. Get detailed error messages to help fix invalid JSON.',
    shortDescription: 'Validate JSON and find errors',
    category: 'dev',
    slug: 'json-validator',
    icon: 'CheckCircle',
    keywords: ['json', 'validator', 'validate json', 'json checker', 'json lint'],
    relatedTools: ['json-formatter', 'json-to-yaml'],
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    description: 'Convert JSON data to YAML format instantly. Easy to use with copy to clipboard functionality.',
    shortDescription: 'Convert JSON to YAML format',
    category: 'dev',
    slug: 'json-to-yaml',
    icon: 'FileCode',
    keywords: ['json', 'yaml', 'converter', 'json to yaml', 'convert json'],
    relatedTools: ['json-formatter', 'yaml-to-json'],
  },
  {
    id: 'base64-encode',
    name: 'Base64 Encoder',
    description: 'Encode text or data to Base64 format instantly. Simple and fast online Base64 encoding tool.',
    shortDescription: 'Encode text to Base64 format',
    category: 'dev',
    slug: 'base64-encode',
    icon: 'Lock',
    keywords: ['base64', 'encode', 'encoder', 'base64 encode', 'text encoder'],
    relatedTools: ['base64-decode', 'url-encode'],
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decoder',
    description: 'Decode Base64 encoded text back to its original format. Fast and easy online Base64 decoding.',
    shortDescription: 'Decode Base64 to text',
    category: 'dev',
    slug: 'base64-decode',
    icon: 'Unlock',
    keywords: ['base64', 'decode', 'decoder', 'base64 decode', 'text decoder'],
    relatedTools: ['base64-encode', 'url-decode'],
  },
  {
    id: 'url-encode',
    name: 'URL Encoder',
    description: 'Encode URLs and text for safe transmission. Convert special characters to URL-safe format.',
    shortDescription: 'Encode URLs and text',
    category: 'dev',
    slug: 'url-encode',
    icon: 'Link',
    keywords: ['url', 'encode', 'encoder', 'url encode', 'percent encoding'],
    relatedTools: ['url-decode', 'base64-encode'],
  },
  {
    id: 'url-decode',
    name: 'URL Decoder',
    description: 'Decode URL-encoded text back to its original format. Handle percent-encoded strings easily.',
    shortDescription: 'Decode URL-encoded text',
    category: 'dev',
    slug: 'url-decode',
    icon: 'Unlink',
    keywords: ['url', 'decode', 'decoder', 'url decode', 'percent decoding'],
    relatedTools: ['url-encode', 'base64-decode'],
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text. Perfect for writers and students.',
    shortDescription: 'Count words and characters',
    category: 'text',
    slug: 'word-counter',
    icon: 'Hash',
    keywords: ['word counter', 'character count', 'word count', 'text counter'],
    relatedTools: ['character-counter', 'text-case-converter'],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs and layouts. Choose paragraphs, words, or sentences.',
    shortDescription: 'Generate placeholder text',
    category: 'text',
    slug: 'lorem-ipsum',
    icon: 'AlignLeft',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lipsum'],
    relatedTools: ['word-counter', 'random-text'],
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get HEX, RGB, HSL values. Easy to use color picker with multiple format outputs.',
    shortDescription: 'Pick colors and get color codes',
    category: 'color',
    slug: 'color-picker',
    icon: 'Pipette',
    keywords: ['color picker', 'hex color', 'rgb color', 'color code'],
    relatedTools: ['hex-to-rgb', 'color-converter'],
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download YouTube video thumbnails in HD, SD, and Max resolution. Just paste the video URL.',
    shortDescription: 'Download YouTube thumbnails',
    category: 'youtube',
    slug: 'youtube-thumbnail',
    icon: 'Image',
    keywords: ['youtube', 'thumbnail', 'downloader', 'youtube thumbnail', 'video thumbnail'],
    relatedTools: ['youtube-video-id'],
  },
  {
    id: 'image-resize',
    name: 'Image Resizer',
    description: 'Resize images online without losing quality. Support for PNG, JPG, and WebP formats.',
    shortDescription: 'Resize images online',
    category: 'image',
    slug: 'image-resize',
    icon: 'Scaling',
    keywords: ['image resize', 'resize photo', 'picture resizer', 'image size'],
    relatedTools: ['image-compress', 'image-converter'],
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category);
}

export function getRelatedTools(toolId: string): Tool[] {
  const tool = getToolById(toolId);
  if (!tool?.relatedTools) return [];

  return tool.relatedTools
    .map(id => getToolById(id))
    .filter((t): t is Tool => t !== undefined);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.shortDescription.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}
