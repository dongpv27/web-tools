'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// ==================== DEVELOPER TOOLS ====================
export const JsonFormatterClient = dynamic(() => import('@/components/tool-clients/JsonFormatterClient'), { ssr: false });
export const JsonValidatorClient = dynamic(() => import('@/components/tool-clients/JsonValidatorClient'), { ssr: false });
export const Base64EncodeClient = dynamic(() => import('@/components/tool-clients/Base64EncodeClient'), { ssr: false });
export const Base64DecodeClient = dynamic(() => import('@/components/tool-clients/Base64DecodeClient'), { ssr: false });
export const UrlEncodeClient = dynamic(() => import('@/components/tool-clients/UrlEncodeClient'), { ssr: false });
export const UrlDecodeClient = dynamic(() => import('@/components/tool-clients/UrlDecodeClient'), { ssr: false });
export const JsonToYamlClient = dynamic(() => import('@/components/tool-clients/JsonToYamlClient'), { ssr: false });
export const YamlToJsonClient = dynamic(() => import('@/components/tool-clients/YamlToJsonClient'), { ssr: false });
export const UuidGeneratorClient = dynamic(() => import('@/components/tool-clients/UuidGeneratorClient'), { ssr: false });
export const TimestampConverterClient = dynamic(() => import('@/components/tool-clients/TimestampConverterClient'), { ssr: false });
export const RandomPasswordGeneratorClient = dynamic(() => import('@/components/tool-clients/RandomPasswordGeneratorClient'), { ssr: false });
export const RegexTesterClient = dynamic(() => import('@/components/tool-clients/RegexTesterClient'), { ssr: false });
export const JwtDecoderClient = dynamic(() => import('@/components/tool-clients/JwtDecoderClient'), { ssr: false });
export const Md5HashGeneratorClient = dynamic(() => import('@/components/tool-clients/Md5HashGeneratorClient'), { ssr: false });
export const Sha256HashGeneratorClient = dynamic(() => import('@/components/tool-clients/Sha256HashGeneratorClient'), { ssr: false });
export const HtmlFormatterClient = dynamic(() => import('@/components/tool-clients/HtmlFormatterClient'), { ssr: false });
export const CssFormatterClient = dynamic(() => import('@/components/tool-clients/CssFormatterClient'), { ssr: false });
export const SqlFormatterClient = dynamic(() => import('@/components/tool-clients/SqlFormatterClient'), { ssr: false });
export const IpAddressValidatorClient = dynamic(() => import('@/components/tool-clients/IpAddressValidatorClient'), { ssr: false });
export const CronExpressionParserClient = dynamic(() => import('@/components/tool-clients/CronExpressionParserClient'), { ssr: false });

export const devToolComponents: Record<string, ComponentType> = {
  'json-formatter': JsonFormatterClient,
  'json-validator': JsonValidatorClient,
  'json-to-yaml': JsonToYamlClient,
  'yaml-to-json': YamlToJsonClient,
  'base64-encode': Base64EncodeClient,
  'base64-decode': Base64DecodeClient,
  'url-encode': UrlEncodeClient,
  'url-decode': UrlDecodeClient,
  'uuid-generator': UuidGeneratorClient,
  'timestamp-converter': TimestampConverterClient,
  'random-password-generator': RandomPasswordGeneratorClient,
  'regex-tester': RegexTesterClient,
  'jwt-decoder': JwtDecoderClient,
  'md5-hash-generator': Md5HashGeneratorClient,
  'sha256-hash-generator': Sha256HashGeneratorClient,
  'html-formatter': HtmlFormatterClient,
  'css-formatter': CssFormatterClient,
  'sql-formatter': SqlFormatterClient,
  'ip-address-validator': IpAddressValidatorClient,
  'cron-expression-parser': CronExpressionParserClient,
};

// ==================== TEXT TOOLS ====================
export const WordCounterClient = dynamic(() => import('@/components/tool-clients/WordCounterClient'), { ssr: false });
export const CharacterCounterClient = dynamic(() => import('@/components/tool-clients/CharacterCounterClient'), { ssr: false });
export const TextCaseConverterClient = dynamic(() => import('@/components/tool-clients/TextCaseConverterClient'), { ssr: false });
export const SlugGeneratorClient = dynamic(() => import('@/components/tool-clients/SlugGeneratorClient'), { ssr: false });
export const RemoveDuplicateLinesClient = dynamic(() => import('@/components/tool-clients/RemoveDuplicateLinesClient'), { ssr: false });
export const SortLinesAlphabeticallyClient = dynamic(() => import('@/components/tool-clients/SortLinesAlphabeticallyClient'), { ssr: false });
export const ReverseTextClient = dynamic(() => import('@/components/tool-clients/ReverseTextClient'), { ssr: false });
export const RemoveLineBreaksClient = dynamic(() => import('@/components/tool-clients/RemoveLineBreaksClient'), { ssr: false });
export const LoremIpsumClient = dynamic(() => import('@/components/tool-clients/LoremIpsumClient'), { ssr: false });
export const RandomTextGeneratorClient = dynamic(() => import('@/components/tool-clients/RandomTextGeneratorClient'), { ssr: false });
export const TextDifferenceCheckerClient = dynamic(() => import('@/components/tool-clients/TextDifferenceCheckerClient'), { ssr: false });
export const RemoveHtmlTagsClient = dynamic(() => import('@/components/tool-clients/RemoveHtmlTagsClient'), { ssr: false });
export const FindAndReplaceClient = dynamic(() => import('@/components/tool-clients/FindAndReplaceClient'), { ssr: false });
export const TextToListClient = dynamic(() => import('@/components/tool-clients/TextToListClient'), { ssr: false });
export const ListToTextClient = dynamic(() => import('@/components/tool-clients/ListToTextClient'), { ssr: false });
export const RandomNameGeneratorClient = dynamic(() => import('@/components/tool-clients/RandomNameGeneratorClient'), { ssr: false });
export const RemoveExtraSpacesClient = dynamic(() => import('@/components/tool-clients/RemoveExtraSpacesClient'), { ssr: false });
export const CapitalizeSentencesClient = dynamic(() => import('@/components/tool-clients/CapitalizeSentencesClient'), { ssr: false });
export const TextCleanerClient = dynamic(() => import('@/components/tool-clients/TextCleanerClient'), { ssr: false });

export const textToolComponents: Record<string, ComponentType> = {
  'word-counter': WordCounterClient,
  'character-counter': CharacterCounterClient,
  'text-case-converter': TextCaseConverterClient,
  'slug-generator': SlugGeneratorClient,
  'remove-duplicate-lines': RemoveDuplicateLinesClient,
  'sort-lines-alphabetically': SortLinesAlphabeticallyClient,
  'reverse-text': ReverseTextClient,
  'remove-line-breaks': RemoveLineBreaksClient,
  'lorem-ipsum': LoremIpsumClient,
  'random-text-generator': RandomTextGeneratorClient,
  'text-difference-checker': TextDifferenceCheckerClient,
  'remove-html-tags': RemoveHtmlTagsClient,
  'find-and-replace': FindAndReplaceClient,
  'text-to-list': TextToListClient,
  'list-to-text': ListToTextClient,
  'random-name-generator': RandomNameGeneratorClient,
  'remove-extra-spaces': RemoveExtraSpacesClient,
  'capitalize-sentences': CapitalizeSentencesClient,
  'text-cleaner': TextCleanerClient,
};

// ==================== IMAGE TOOLS ====================
export const ImageResizeClient = dynamic(() => import('@/components/tool-clients/ImageResizeClient'), { ssr: false });
export const ImageToBase64Client = dynamic(() => import('@/components/tool-clients/ImageToBase64Client'), { ssr: false });
export const Base64ToImageClient = dynamic(() => import('@/components/tool-clients/Base64ToImageClient'), { ssr: false });
export const ImageRotateClient = dynamic(() => import('@/components/tool-clients/ImageRotateClient'), { ssr: false });
export const ImageGrayscaleClient = dynamic(() => import('@/components/tool-clients/ImageGrayscaleClient'), { ssr: false });
export const ImageBlurClient = dynamic(() => import('@/components/tool-clients/ImageBlurClient'), { ssr: false });
export const ImageFlipClient = dynamic(() => import('@/components/tool-clients/ImageFlipClient'), { ssr: false });
export const ImagePixelateClient = dynamic(() => import('@/components/tool-clients/ImagePixelateClient'), { ssr: false });
export const ImageBrightnessClient = dynamic(() => import('@/components/tool-clients/ImageBrightnessClient'), { ssr: false });
export const ImageColorPickerClient = dynamic(() => import('@/components/tool-clients/ImageColorPickerClient'), { ssr: false });
export const ImageBorderClient = dynamic(() => import('@/components/tool-clients/ImageBorderClient'), { ssr: false });

export const imageToolComponents: Record<string, ComponentType> = {
  'image-resize': ImageResizeClient,
  'image-to-base64': ImageToBase64Client,
  'base64-to-image': Base64ToImageClient,
  'rotate-image': ImageRotateClient,
  'grayscale-image': ImageGrayscaleClient,
  'blur-image': ImageBlurClient,
  'flip-image-horizontal': ImageFlipClient,
  'flip-image-vertical': ImageFlipClient,
  'pixelate-image': ImagePixelateClient,
  'adjust-brightness': ImageBrightnessClient,
  'image-color-picker': ImageColorPickerClient,
  'image-border': ImageBorderClient,
};

// ==================== YOUTUBE TOOLS ====================
export const YoutubeThumbnailClient = dynamic(() => import('@/components/tool-clients/YoutubeThumbnailClient'), { ssr: false });
export const YoutubeVideoIdExtractorClient = dynamic(() => import('@/components/tool-clients/YoutubeVideoIdExtractorClient'), { ssr: false });
export const YoutubeEmbedGeneratorClient = dynamic(() => import('@/components/tool-clients/YoutubeEmbedGeneratorClient'), { ssr: false });
export const YoutubeTimestampClient = dynamic(() => import('@/components/tool-clients/YoutubeTimestampClient'), { ssr: false });
export const YoutubeTagExtractorClient = dynamic(() => import('@/components/tool-clients/YoutubeTagExtractorClient'), { ssr: false });
export const YoutubeTitleGeneratorClient = dynamic(() => import('@/components/tool-clients/YoutubeTitleGeneratorClient'), { ssr: false });
export const YoutubeDescriptionGeneratorClient = dynamic(() => import('@/components/tool-clients/YoutubeDescriptionGeneratorClient'), { ssr: false });
export const YoutubeHashtagGeneratorClient = dynamic(() => import('@/components/tool-clients/YoutubeHashtagGeneratorClient'), { ssr: false });
export const YoutubeChannelIdFinderClient = dynamic(() => import('@/components/tool-clients/YoutubeChannelIdFinderClient'), { ssr: false });
export const YoutubePlaylistIdExtractorClient = dynamic(() => import('@/components/tool-clients/YoutubePlaylistIdExtractorClient'), { ssr: false });

export const youtubeToolComponents: Record<string, ComponentType> = {
  'youtube-thumbnail': YoutubeThumbnailClient,
  'youtube-video-id-extractor': YoutubeVideoIdExtractorClient,
  'youtube-embed-generator': YoutubeEmbedGeneratorClient,
  'youtube-timestamp-generator': YoutubeTimestampClient,
  'youtube-tag-extractor': YoutubeTagExtractorClient,
  'youtube-title-generator': YoutubeTitleGeneratorClient,
  'youtube-description-generator': YoutubeDescriptionGeneratorClient,
  'youtube-hashtag-generator': YoutubeHashtagGeneratorClient,
  'youtube-channel-id-finder': YoutubeChannelIdFinderClient,
  'youtube-playlist-id-extractor': YoutubePlaylistIdExtractorClient,
};

// ==================== COLOR TOOLS ====================
export const ColorPickerClient = dynamic(() => import('@/components/tool-clients/ColorPickerClient'), { ssr: false });
export const HexToRgbClient = dynamic(() => import('@/components/tool-clients/HexToRgbClient'), { ssr: false });
export const RgbToHexClient = dynamic(() => import('@/components/tool-clients/RgbToHexClient'), { ssr: false });
export const ColorPaletteGeneratorClient = dynamic(() => import('@/components/tool-clients/ColorPaletteGeneratorClient'), { ssr: false });
export const GradientGeneratorClient = dynamic(() => import('@/components/tool-clients/GradientGeneratorClient'), { ssr: false });
export const RandomColorGeneratorClient = dynamic(() => import('@/components/tool-clients/RandomColorGeneratorClient'), { ssr: false });
export const ColorContrastCheckerClient = dynamic(() => import('@/components/tool-clients/ColorContrastCheckerClient'), { ssr: false });
export const CssGradientGeneratorClient = dynamic(() => import('@/components/tool-clients/CssGradientGeneratorClient'), { ssr: false });
export const TailwindColorConverterClient = dynamic(() => import('@/components/tool-clients/TailwindColorConverterClient'), { ssr: false });
export const ColorConverterClient = dynamic(() => import('@/components/tool-clients/ColorConverterClient'), { ssr: false });

export const colorToolComponents: Record<string, ComponentType> = {
  'color-picker': ColorPickerClient,
  'hex-to-rgb': HexToRgbClient,
  'rgb-to-hex': RgbToHexClient,
  'color-palette-generator': ColorPaletteGeneratorClient,
  'gradient-generator': GradientGeneratorClient,
  'random-color-generator': RandomColorGeneratorClient,
  'color-contrast-checker': ColorContrastCheckerClient,
  'css-gradient-generator': CssGradientGeneratorClient,
  'tailwind-color-converter': TailwindColorConverterClient,
  'color-converter': ColorConverterClient,
};

// ==================== CONVERTER TOOLS ====================
export const CsvToJsonClient = dynamic(() => import('@/components/tool-clients/CsvToJsonClient'), { ssr: false });
export const QrCodeGeneratorClient = dynamic(() => import('@/components/tool-clients/QrCodeGeneratorClient'), { ssr: false });
export const JsonToCsvClient = dynamic(() => import('@/components/tool-clients/JsonToCsvClient'), { ssr: false });
export const MarkdownToHtmlClient = dynamic(() => import('@/components/tool-clients/MarkdownToHtmlClient'), { ssr: false });
export const HtmlToMarkdownClient = dynamic(() => import('@/components/tool-clients/HtmlToMarkdownClient'), { ssr: false });
export const TextToBase64Client = dynamic(() => import('@/components/tool-clients/TextToBase64Client'), { ssr: false });
export const Base64ToTextClient = dynamic(() => import('@/components/tool-clients/Base64ToTextClient'), { ssr: false });
export const UnixTimeToDateClient = dynamic(() => import('@/components/tool-clients/UnixTimeToDateClient'), { ssr: false });
export const DateToUnixTimeClient = dynamic(() => import('@/components/tool-clients/DateToUnixTimeClient'), { ssr: false });

export const converterToolComponents: Record<string, ComponentType> = {
  'csv-to-json': CsvToJsonClient,
  'qr-code-generator': QrCodeGeneratorClient,
  'json-to-csv': JsonToCsvClient,
  'markdown-to-html': MarkdownToHtmlClient,
  'html-to-markdown': HtmlToMarkdownClient,
  'text-to-base64': TextToBase64Client,
  'base64-to-text': Base64ToTextClient,
  'unix-time-to-date': UnixTimeToDateClient,
  'date-to-unix-time': DateToUnixTimeClient,
};

// ==================== MISC TOOLS ====================
export const RandomNumberGeneratorClient = dynamic(() => import('@/components/tool-clients/RandomNumberGeneratorClient'), { ssr: false });
export const DiceRollSimulatorClient = dynamic(() => import('@/components/tool-clients/DiceRollSimulatorClient'), { ssr: false });
export const CoinFlipClient = dynamic(() => import('@/components/tool-clients/CoinFlipClient'), { ssr: false });
export const PasswordStrengthCheckerClient = dynamic(() => import('@/components/tool-clients/PasswordStrengthCheckerClient'), { ssr: false });
export const AgeCalculatorClient = dynamic(() => import('@/components/tool-clients/AgeCalculatorClient'), { ssr: false });
export const BmiCalculatorClient = dynamic(() => import('@/components/tool-clients/BmiCalculatorClient'), { ssr: false });
export const CountdownTimerClient = dynamic(() => import('@/components/tool-clients/CountdownTimerClient'), { ssr: false });
export const PercentageCalculatorClient = dynamic(() => import('@/components/tool-clients/PercentageCalculatorClient'), { ssr: false });
export const UnitConverterClient = dynamic(() => import('@/components/tool-clients/UnitConverterClient'), { ssr: false });
export const BarcodeGeneratorClient = dynamic(() => import('@/components/tool-clients/BarcodeGeneratorClient'), { ssr: false });

export const miscToolComponents: Record<string, ComponentType> = {
  'random-number-generator': RandomNumberGeneratorClient,
  'dice-roll-simulator': DiceRollSimulatorClient,
  'coin-flip': CoinFlipClient,
  'password-strength-checker': PasswordStrengthCheckerClient,
  'age-calculator': AgeCalculatorClient,
  'bmi-calculator': BmiCalculatorClient,
  'countdown-timer': CountdownTimerClient,
  'percentage-calculator': PercentageCalculatorClient,
  'unit-converter': UnitConverterClient,
  'barcode-generator': BarcodeGeneratorClient,
};

// ==================== COMBINED MAP ====================
export const toolComponentMap: Record<string, ComponentType> = {
  ...devToolComponents,
  ...textToolComponents,
  ...imageToolComponents,
  ...youtubeToolComponents,
  ...colorToolComponents,
  ...converterToolComponents,
  ...miscToolComponents,
};

export function getToolComponent(slug: string): ComponentType | undefined {
  return toolComponentMap[slug];
}
