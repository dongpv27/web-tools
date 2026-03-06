'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// ==================== DEVELOPER TOOLS ====================
export const JsonFormatterClient = dynamic(() => import('@/app/tools/dev/[slug]/JsonFormatterClient'), { ssr: false });
export const JsonValidatorClient = dynamic(() => import('@/app/tools/dev/[slug]/JsonValidatorClient'), { ssr: false });
export const Base64EncodeClient = dynamic(() => import('@/app/tools/dev/[slug]/Base64EncodeClient'), { ssr: false });
export const Base64DecodeClient = dynamic(() => import('@/app/tools/dev/[slug]/Base64DecodeClient'), { ssr: false });
export const UrlEncodeClient = dynamic(() => import('@/app/tools/dev/[slug]/UrlEncodeClient'), { ssr: false });
export const UrlDecodeClient = dynamic(() => import('@/app/tools/dev/[slug]/UrlDecodeClient'), { ssr: false });
export const JsonToYamlClient = dynamic(() => import('@/app/tools/dev/[slug]/JsonToYamlClient'), { ssr: false });
export const YamlToJsonClient = dynamic(() => import('@/app/tools/dev/[slug]/YamlToJsonClient'), { ssr: false });
export const UuidGeneratorClient = dynamic(() => import('@/app/tools/dev/[slug]/UuidGeneratorClient'), { ssr: false });
export const TimestampConverterClient = dynamic(() => import('@/app/tools/dev/[slug]/TimestampConverterClient'), { ssr: false });
export const RandomPasswordGeneratorClient = dynamic(() => import('@/app/tools/dev/[slug]/RandomPasswordGeneratorClient'), { ssr: false });
export const RegexTesterClient = dynamic(() => import('@/app/tools/dev/[slug]/RegexTesterClient'), { ssr: false });
export const JwtDecoderClient = dynamic(() => import('@/app/tools/dev/[slug]/JwtDecoderClient'), { ssr: false });
export const Md5HashGeneratorClient = dynamic(() => import('@/app/tools/dev/[slug]/Md5HashGeneratorClient'), { ssr: false });
export const Sha256HashGeneratorClient = dynamic(() => import('@/app/tools/dev/[slug]/Sha256HashGeneratorClient'), { ssr: false });
export const HtmlFormatterClient = dynamic(() => import('@/app/tools/dev/[slug]/HtmlFormatterClient'), { ssr: false });
export const CssFormatterClient = dynamic(() => import('@/app/tools/dev/[slug]/CssFormatterClient'), { ssr: false });
export const SqlFormatterClient = dynamic(() => import('@/app/tools/dev/[slug]/SqlFormatterClient'), { ssr: false });
export const IpAddressValidatorClient = dynamic(() => import('@/app/tools/dev/[slug]/IpAddressValidatorClient'), { ssr: false });
export const CronExpressionParserClient = dynamic(() => import('@/app/tools/dev/[slug]/CronExpressionParserClient'), { ssr: false });

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
export const WordCounterClient = dynamic(() => import('@/app/tools/text/[slug]/WordCounterClient'), { ssr: false });
export const CharacterCounterClient = dynamic(() => import('@/app/tools/text/[slug]/CharacterCounterClient'), { ssr: false });
export const TextCaseConverterClient = dynamic(() => import('@/app/tools/text/[slug]/TextCaseConverterClient'), { ssr: false });
export const SlugGeneratorClient = dynamic(() => import('@/app/tools/text/[slug]/SlugGeneratorClient'), { ssr: false });
export const RemoveDuplicateLinesClient = dynamic(() => import('@/app/tools/text/[slug]/RemoveDuplicateLinesClient'), { ssr: false });
export const SortLinesAlphabeticallyClient = dynamic(() => import('@/app/tools/text/[slug]/SortLinesAlphabeticallyClient'), { ssr: false });
export const ReverseTextClient = dynamic(() => import('@/app/tools/text/[slug]/ReverseTextClient'), { ssr: false });
export const RemoveLineBreaksClient = dynamic(() => import('@/app/tools/text/[slug]/RemoveLineBreaksClient'), { ssr: false });
export const LoremIpsumClient = dynamic(() => import('@/app/tools/text/[slug]/LoremIpsumClient'), { ssr: false });
export const RandomTextGeneratorClient = dynamic(() => import('@/app/tools/text/[slug]/RandomTextGeneratorClient'), { ssr: false });
export const TextDifferenceCheckerClient = dynamic(() => import('@/app/tools/text/[slug]/TextDifferenceCheckerClient'), { ssr: false });
export const RemoveHtmlTagsClient = dynamic(() => import('@/app/tools/text/[slug]/RemoveHtmlTagsClient'), { ssr: false });
export const FindAndReplaceClient = dynamic(() => import('@/app/tools/text/[slug]/FindAndReplaceClient'), { ssr: false });
export const TextToListClient = dynamic(() => import('@/app/tools/text/[slug]/TextToListClient'), { ssr: false });
export const ListToTextClient = dynamic(() => import('@/app/tools/text/[slug]/ListToTextClient'), { ssr: false });
export const RandomNameGeneratorClient = dynamic(() => import('@/app/tools/text/[slug]/RandomNameGeneratorClient'), { ssr: false });
export const RemoveExtraSpacesClient = dynamic(() => import('@/app/tools/text/[slug]/RemoveExtraSpacesClient'), { ssr: false });
export const CapitalizeSentencesClient = dynamic(() => import('@/app/tools/text/[slug]/CapitalizeSentencesClient'), { ssr: false });
export const TextCleanerClient = dynamic(() => import('@/app/tools/text/[slug]/TextCleanerClient'), { ssr: false });
export const TextFormatterClient = dynamic(() => import('@/app/tools/text/[slug]/TextFormatterClient'), { ssr: false });

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
  'text-formatter': TextFormatterClient,
};

// ==================== IMAGE TOOLS ====================
export const ImageResizeClient = dynamic(() => import('@/app/tools/image/[slug]/ImageResizeClient'), { ssr: false });
export const ImageToBase64Client = dynamic(() => import('@/app/tools/image/[slug]/ImageToBase64Client'), { ssr: false });
export const Base64ToImageClient = dynamic(() => import('@/app/tools/image/[slug]/Base64ToImageClient'), { ssr: false });
export const ImageRotateClient = dynamic(() => import('@/app/tools/image/[slug]/ImageRotateClient'), { ssr: false });
export const ImageGrayscaleClient = dynamic(() => import('@/app/tools/image/[slug]/ImageGrayscaleClient'), { ssr: false });
export const ImageBlurClient = dynamic(() => import('@/app/tools/image/[slug]/ImageBlurClient'), { ssr: false });
export const ImageFlipClient = dynamic(() => import('@/app/tools/image/[slug]/ImageFlipClient'), { ssr: false });
export const ImagePixelateClient = dynamic(() => import('@/app/tools/image/[slug]/ImagePixelateClient'), { ssr: false });
export const ImageBrightnessClient = dynamic(() => import('@/app/tools/image/[slug]/ImageBrightnessClient'), { ssr: false });
export const ImageColorPickerClient = dynamic(() => import('@/app/tools/image/[slug]/ImageColorPickerClient'), { ssr: false });
export const ImageBorderClient = dynamic(() => import('@/app/tools/image/[slug]/ImageBorderClient'), { ssr: false });

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
export const YoutubeThumbnailClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeThumbnailClient'), { ssr: false });
export const YoutubeVideoIdExtractorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeVideoIdExtractorClient'), { ssr: false });
export const YoutubeEmbedGeneratorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeEmbedGeneratorClient'), { ssr: false });
export const YoutubeTimestampClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeTimestampClient'), { ssr: false });
export const YoutubeTagExtractorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeTagExtractorClient'), { ssr: false });
export const YoutubeTitleGeneratorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeTitleGeneratorClient'), { ssr: false });
export const YoutubeDescriptionGeneratorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeDescriptionGeneratorClient'), { ssr: false });
export const YoutubeHashtagGeneratorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeHashtagGeneratorClient'), { ssr: false });
export const YoutubeChannelIdFinderClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubeChannelIdFinderClient'), { ssr: false });
export const YoutubePlaylistIdExtractorClient = dynamic(() => import('@/app/tools/youtube/[slug]/YoutubePlaylistIdExtractorClient'), { ssr: false });

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
export const ColorPickerClient = dynamic(() => import('@/app/tools/color/[slug]/ColorPickerClient'), { ssr: false });
export const HexToRgbClient = dynamic(() => import('@/app/tools/color/[slug]/HexToRgbClient'), { ssr: false });
export const RgbToHexClient = dynamic(() => import('@/app/tools/color/[slug]/RgbToHexClient'), { ssr: false });
export const ColorPaletteGeneratorClient = dynamic(() => import('@/app/tools/color/[slug]/ColorPaletteGeneratorClient'), { ssr: false });
export const GradientGeneratorClient = dynamic(() => import('@/app/tools/color/[slug]/GradientGeneratorClient'), { ssr: false });
export const RandomColorGeneratorClient = dynamic(() => import('@/app/tools/color/[slug]/RandomColorGeneratorClient'), { ssr: false });
export const ColorContrastCheckerClient = dynamic(() => import('@/app/tools/color/[slug]/ColorContrastCheckerClient'), { ssr: false });
export const CssGradientGeneratorClient = dynamic(() => import('@/app/tools/color/[slug]/CssGradientGeneratorClient'), { ssr: false });
export const TailwindColorConverterClient = dynamic(() => import('@/app/tools/color/[slug]/TailwindColorConverterClient'), { ssr: false });
export const ColorConverterClient = dynamic(() => import('@/app/tools/color/[slug]/ColorConverterClient'), { ssr: false });

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
export const CsvToJsonClient = dynamic(() => import('@/app/tools/converter/[slug]/CsvToJsonClient'), { ssr: false });
export const QrCodeGeneratorClient = dynamic(() => import('@/app/tools/converter/[slug]/QrCodeGeneratorClient'), { ssr: false });
export const JsonToCsvClient = dynamic(() => import('@/app/tools/converter/[slug]/JsonToCsvClient'), { ssr: false });
export const MarkdownToHtmlClient = dynamic(() => import('@/app/tools/converter/[slug]/MarkdownToHtmlClient'), { ssr: false });
export const HtmlToMarkdownClient = dynamic(() => import('@/app/tools/converter/[slug]/HtmlToMarkdownClient'), { ssr: false });
export const TextToBase64Client = dynamic(() => import('@/app/tools/converter/[slug]/TextToBase64Client'), { ssr: false });
export const Base64ToTextClient = dynamic(() => import('@/app/tools/converter/[slug]/Base64ToTextClient'), { ssr: false });
export const UnixTimeToDateClient = dynamic(() => import('@/app/tools/converter/[slug]/UnixTimeToDateClient'), { ssr: false });
export const DateToUnixTimeClient = dynamic(() => import('@/app/tools/converter/[slug]/DateToUnixTimeClient'), { ssr: false });

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
export const RandomNumberGeneratorClient = dynamic(() => import('@/app/tools/misc/[slug]/RandomNumberGeneratorClient'), { ssr: false });
export const DiceRollSimulatorClient = dynamic(() => import('@/app/tools/misc/[slug]/DiceRollSimulatorClient'), { ssr: false });
export const CoinFlipClient = dynamic(() => import('@/app/tools/misc/[slug]/CoinFlipClient'), { ssr: false });
export const PasswordStrengthCheckerClient = dynamic(() => import('@/app/tools/misc/[slug]/PasswordStrengthCheckerClient'), { ssr: false });
export const AgeCalculatorClient = dynamic(() => import('@/app/tools/misc/[slug]/AgeCalculatorClient'), { ssr: false });
export const BmiCalculatorClient = dynamic(() => import('@/app/tools/misc/[slug]/BmiCalculatorClient'), { ssr: false });
export const CountdownTimerClient = dynamic(() => import('@/app/tools/misc/[slug]/CountdownTimerClient'), { ssr: false });
export const PercentageCalculatorClient = dynamic(() => import('@/app/tools/misc/[slug]/PercentageCalculatorClient'), { ssr: false });
export const UnitConverterClient = dynamic(() => import('@/app/tools/misc/[slug]/UnitConverterClient'), { ssr: false });
export const BarcodeGeneratorClient = dynamic(() => import('@/app/tools/misc/[slug]/BarcodeGeneratorClient'), { ssr: false });

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
