'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Developer Tools
export const JsonFormatterClient = dynamic(
  () => import('@/components/tool-clients/JsonFormatterClient'),
  { ssr: false }
);
export const JsonValidatorClient = dynamic(
  () => import('@/components/tool-clients/JsonValidatorClient'),
  { ssr: false }
);
export const Base64EncodeClient = dynamic(
  () => import('@/components/tool-clients/Base64EncodeClient'),
  { ssr: false }
);
export const Base64DecodeClient = dynamic(
  () => import('@/components/tool-clients/Base64DecodeClient'),
  { ssr: false }
);
export const UrlEncodeClient = dynamic(
  () => import('@/components/tool-clients/UrlEncodeClient'),
  { ssr: false }
);
export const UrlDecodeClient = dynamic(
  () => import('@/components/tool-clients/UrlDecodeClient'),
  { ssr: false }
);
export const JsonToYamlClient = dynamic(
  () => import('@/components/tool-clients/JsonToYamlClient'),
  { ssr: false }
);
export const YamlToJsonClient = dynamic(
  () => import('@/components/tool-clients/YamlToJsonClient'),
  { ssr: false }
);
export const UuidGeneratorClient = dynamic(
  () => import('@/components/tool-clients/UuidGeneratorClient'),
  { ssr: false }
);
export const TimestampConverterClient = dynamic(
  () => import('@/components/tool-clients/TimestampConverterClient'),
  { ssr: false }
);
export const RandomPasswordGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomPasswordGeneratorClient'),
  { ssr: false }
);
export const RegexTesterClient = dynamic(
  () => import('@/components/tool-clients/RegexTesterClient'),
  { ssr: false }
);
export const JwtDecoderClient = dynamic(
  () => import('@/components/tool-clients/JwtDecoderClient'),
  { ssr: false }
);
export const Md5HashGeneratorClient = dynamic(
  () => import('@/components/tool-clients/Md5HashGeneratorClient'),
  { ssr: false }
);
export const Sha256HashGeneratorClient = dynamic(
  () => import('@/components/tool-clients/Sha256HashGeneratorClient'),
  { ssr: false }
);
export const HtmlFormatterClient = dynamic(
  () => import('@/components/tool-clients/HtmlFormatterClient'),
  { ssr: false }
);
export const CssFormatterClient = dynamic(
  () => import('@/components/tool-clients/CssFormatterClient'),
  { ssr: false }
);
export const SqlFormatterClient = dynamic(
  () => import('@/components/tool-clients/SqlFormatterClient'),
  { ssr: false }
);
export const IpAddressValidatorClient = dynamic(
  () => import('@/components/tool-clients/IpAddressValidatorClient'),
  { ssr: false }
);
export const CronExpressionParserClient = dynamic(
  () => import('@/components/tool-clients/CronExpressionParserClient'),
  { ssr: false }
);

// Text Tools
export const WordCounterClient = dynamic(
  () => import('@/components/tool-clients/WordCounterClient'),
  { ssr: false }
);
export const CharacterCounterClient = dynamic(
  () => import('@/components/tool-clients/CharacterCounterClient'),
  { ssr: false }
);
export const TextCaseConverterClient = dynamic(
  () => import('@/components/tool-clients/TextCaseConverterClient'),
  { ssr: false }
);
export const SlugGeneratorClient = dynamic(
  () => import('@/components/tool-clients/SlugGeneratorClient'),
  { ssr: false }
);
export const RemoveDuplicateLinesClient = dynamic(
  () => import('@/components/tool-clients/RemoveDuplicateLinesClient'),
  { ssr: false }
);
export const SortLinesAlphabeticallyClient = dynamic(
  () => import('@/components/tool-clients/SortLinesAlphabeticallyClient'),
  { ssr: false }
);
export const ReverseTextClient = dynamic(
  () => import('@/components/tool-clients/ReverseTextClient'),
  { ssr: false }
);
export const RemoveLineBreaksClient = dynamic(
  () => import('@/components/tool-clients/RemoveLineBreaksClient'),
  { ssr: false }
);
export const LoremIpsumClient = dynamic(
  () => import('@/components/tool-clients/LoremIpsumClient'),
  { ssr: false }
);
export const RandomTextGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomTextGeneratorClient'),
  { ssr: false }
);
export const TextDifferenceCheckerClient = dynamic(
  () => import('@/components/tool-clients/TextDifferenceCheckerClient'),
  { ssr: false }
);
export const RemoveHtmlTagsClient = dynamic(
  () => import('@/components/tool-clients/RemoveHtmlTagsClient'),
  { ssr: false }
);
export const FindAndReplaceClient = dynamic(
  () => import('@/components/tool-clients/FindAndReplaceClient'),
  { ssr: false }
);
export const TextToListClient = dynamic(
  () => import('@/components/tool-clients/TextToListClient'),
  { ssr: false }
);
export const ListToTextClient = dynamic(
  () => import('@/components/tool-clients/ListToTextClient'),
  { ssr: false }
);
export const RandomNameGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomNameGeneratorClient'),
  { ssr: false }
);
export const RemoveExtraSpacesClient = dynamic(
  () => import('@/components/tool-clients/RemoveExtraSpacesClient'),
  { ssr: false }
);
export const CapitalizeSentencesClient = dynamic(
  () => import('@/components/tool-clients/CapitalizeSentencesClient'),
  { ssr: false }
);
export const TextCleanerClient = dynamic(
  () => import('@/components/tool-clients/TextCleanerClient'),
  { ssr: false }
);
export const TextFormatterClient = dynamic(
  () => import('@/components/tool-clients/TextFormatterClient'),
  { ssr: false }
);

// Image Tools
export const ImageResizeClient = dynamic(
  () => import('@/components/tool-clients/ImageResizeClient'),
  { ssr: false }
);
export const ImageToBase64Client = dynamic(
  () => import('@/components/tool-clients/ImageToBase64Client'),
  { ssr: false }
);
export const Base64ToImageClient = dynamic(
  () => import('@/components/tool-clients/Base64ToImageClient'),
  { ssr: false }
);
export const ImageRotateClient = dynamic(
  () => import('@/components/tool-clients/ImageRotateClient'),
  { ssr: false }
);
export const ImageGrayscaleClient = dynamic(
  () => import('@/components/tool-clients/ImageGrayscaleClient'),
  { ssr: false }
);
export const ImageBlurClient = dynamic(
  () => import('@/components/tool-clients/ImageBlurClient'),
  { ssr: false }
);
export const ImageFlipClient = dynamic(
  () => import('@/components/tool-clients/ImageFlipClient'),
  { ssr: false }
);
export const ImagePixelateClient = dynamic(
  () => import('@/components/tool-clients/ImagePixelateClient'),
  { ssr: false }
);
export const ImageBrightnessClient = dynamic(
  () => import('@/components/tool-clients/ImageBrightnessClient'),
  { ssr: false }
);
export const ImageColorPickerClient = dynamic(
  () => import('@/components/tool-clients/ImageColorPickerClient'),
  { ssr: false }
);
export const ImageBorderClient = dynamic(
  () => import('@/components/tool-clients/ImageBorderClient'),
  { ssr: false }
);
export const PngToJpgClient = dynamic(
  () => import('@/components/tool-clients/PngToJpgClient'),
  { ssr: false }
);
export const JpgToPngClient = dynamic(
  () => import('@/components/tool-clients/JpgToPngClient'),
  { ssr: false }
);
export const WebpToPngClient = dynamic(
  () => import('@/components/tool-clients/WebpToPngClient'),
  { ssr: false }
);
export const PngToWebpClient = dynamic(
  () => import('@/components/tool-clients/PngToWebpClient'),
  { ssr: false }
);
export const ResizeImagePercentageClient = dynamic(
  () => import('@/components/tool-clients/ResizeImagePercentageClient'),
  { ssr: false }
);
export const ExtractColorsClient = dynamic(
  () => import('@/components/tool-clients/ExtractColorsClient'),
  { ssr: false }
);
export const ImageToIcoClient = dynamic(
  () => import('@/components/tool-clients/ImageToIcoClient'),
  { ssr: false }
);
export const FaviconGeneratorClient = dynamic(
  () => import('@/components/tool-clients/FaviconGeneratorClient'),
  { ssr: false }
);

// YouTube Tools
export const YoutubeThumbnailClient = dynamic(
  () => import('@/components/tool-clients/YoutubeThumbnailClient'),
  { ssr: false }
);
export const YoutubeVideoIdExtractorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeVideoIdExtractorClient'),
  { ssr: false }
);
export const YoutubeEmbedGeneratorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeEmbedGeneratorClient'),
  { ssr: false }
);
export const YoutubeTimestampClient = dynamic(
  () => import('@/components/tool-clients/YoutubeTimestampClient'),
  { ssr: false }
);
export const YoutubeTagExtractorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeTagExtractorClient'),
  { ssr: false }
);
export const YoutubeTitleGeneratorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeTitleGeneratorClient'),
  { ssr: false }
);
export const YoutubeDescriptionGeneratorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeDescriptionGeneratorClient'),
  { ssr: false }
);
export const YoutubeHashtagGeneratorClient = dynamic(
  () => import('@/components/tool-clients/YoutubeHashtagGeneratorClient'),
  { ssr: false }
);
export const YoutubeChannelIdFinderClient = dynamic(
  () => import('@/components/tool-clients/YoutubeChannelIdFinderClient'),
  { ssr: false }
);
export const YoutubePlaylistIdExtractorClient = dynamic(
  () => import('@/components/tool-clients/YoutubePlaylistIdExtractorClient'),
  { ssr: false }
);

// Color Tools
export const ColorPickerClient = dynamic(
  () => import('@/components/tool-clients/ColorPickerClient'),
  { ssr: false }
);
export const HexToRgbClient = dynamic(
  () => import('@/components/tool-clients/HexToRgbClient'),
  { ssr: false }
);
export const RgbToHexClient = dynamic(
  () => import('@/components/tool-clients/RgbToHexClient'),
  { ssr: false }
);
export const ColorPaletteGeneratorClient = dynamic(
  () => import('@/components/tool-clients/ColorPaletteGeneratorClient'),
  { ssr: false }
);
export const GradientGeneratorClient = dynamic(
  () => import('@/components/tool-clients/GradientGeneratorClient'),
  { ssr: false }
);
export const RandomColorGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomColorGeneratorClient'),
  { ssr: false }
);
export const ColorContrastCheckerClient = dynamic(
  () => import('@/components/tool-clients/ColorContrastCheckerClient'),
  { ssr: false }
);
export const CssGradientGeneratorClient = dynamic(
  () => import('@/components/tool-clients/CssGradientGeneratorClient'),
  { ssr: false }
);
export const TailwindColorConverterClient = dynamic(
  () => import('@/components/tool-clients/TailwindColorConverterClient'),
  { ssr: false }
);
export const ColorConverterClient = dynamic(
  () => import('@/components/tool-clients/ColorConverterClient'),
  { ssr: false }
);

// Converter Tools
export const CsvToJsonClient = dynamic(
  () => import('@/components/tool-clients/CsvToJsonClient'),
  { ssr: false }
);
export const QrCodeGeneratorClient = dynamic(
  () => import('@/components/tool-clients/QrCodeGeneratorClient'),
  { ssr: false }
);
export const JsonToCsvClient = dynamic(
  () => import('@/components/tool-clients/JsonToCsvClient'),
  { ssr: false }
);
export const MarkdownToHtmlClient = dynamic(
  () => import('@/components/tool-clients/MarkdownToHtmlClient'),
  { ssr: false }
);
export const HtmlToMarkdownClient = dynamic(
  () => import('@/components/tool-clients/HtmlToMarkdownClient'),
  { ssr: false }
);
export const TextToBase64Client = dynamic(
  () => import('@/components/tool-clients/TextToBase64Client'),
  { ssr: false }
);
export const Base64ToTextClient = dynamic(
  () => import('@/components/tool-clients/Base64ToTextClient'),
  { ssr: false }
);
export const UnixTimeToDateClient = dynamic(
  () => import('@/components/tool-clients/UnixTimeToDateClient'),
  { ssr: false }
);
export const DateToUnixTimeClient = dynamic(
  () => import('@/components/tool-clients/DateToUnixTimeClient'),
  { ssr: false }
);

// Misc Tools
export const RandomNumberGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomNumberGeneratorClient'),
  { ssr: false }
);
export const DiceRollSimulatorClient = dynamic(
  () => import('@/components/tool-clients/DiceRollSimulatorClient'),
  { ssr: false }
);
export const CoinFlipClient = dynamic(
  () => import('@/components/tool-clients/CoinFlipClient'),
  { ssr: false }
);
export const PasswordStrengthCheckerClient = dynamic(
  () => import('@/components/tool-clients/PasswordStrengthCheckerClient'),
  { ssr: false }
);
export const AgeCalculatorClient = dynamic(
  () => import('@/components/tool-clients/AgeCalculatorClient'),
  { ssr: false }
);
export const BmiCalculatorClient = dynamic(
  () => import('@/components/tool-clients/BmiCalculatorClient'),
  { ssr: false }
);
export const CountdownTimerClient = dynamic(
  () => import('@/components/tool-clients/CountdownTimerClient'),
  { ssr: false }
);
export const PercentageCalculatorClient = dynamic(
  () => import('@/components/tool-clients/PercentageCalculatorClient'),
  { ssr: false }
);
export const UnitConverterClient = dynamic(
  () => import('@/components/tool-clients/UnitConverterClient'),
  { ssr: false }
);
export const BarcodeGeneratorClient = dynamic(
  () => import('@/components/tool-clients/BarcodeGeneratorClient'),
  { ssr: false }
);

// Office Tools
export const ExcelToCsvClient = dynamic(
  () => import('@/components/tool-clients/ExcelToCsvClient'),
  { ssr: false }
);
export const CsvToExcelClient = dynamic(
  () => import('@/components/tool-clients/CsvToExcelClient'),
  { ssr: false }
);
export const ExcelToJsonClient = dynamic(
  () => import('@/components/tool-clients/ExcelToJsonClient'),
  { ssr: false }
);
export const JsonToExcelClient = dynamic(
  () => import('@/components/tool-clients/JsonToExcelClient'),
  { ssr: false }
);
export const ExcelToXmlClient = dynamic(
  () => import('@/components/tool-clients/ExcelToXmlClient'),
  { ssr: false }
);
export const ExcelToSqlClient = dynamic(
  () => import('@/components/tool-clients/ExcelToSqlClient'),
  { ssr: false }
);
export const MergeExcelClient = dynamic(
  () => import('@/components/tool-clients/MergeExcelClient'),
  { ssr: false }
);
export const WordToPdfClient = dynamic(
  () => import('@/components/tool-clients/WordToPdfClient'),
  { ssr: false }
);
export const PdfToWordClient = dynamic(
  () => import('@/components/tool-clients/PdfToWordClient'),
  { ssr: false }
);
export const WordToTxtClient = dynamic(
  () => import('@/components/tool-clients/WordToTxtClient'),
  { ssr: false }
);
export const MergeWordClient = dynamic(
  () => import('@/components/tool-clients/MergeWordClient'),
  { ssr: false }
);
export const SplitWordClient = dynamic(
  () => import('@/components/tool-clients/SplitWordClient'),
  { ssr: false }
);
export const WordWordCounterClient = dynamic(
  () => import('@/components/tool-clients/WordWordCounterClient'),
  { ssr: false }
);
export const ExtractImagesWordClient = dynamic(
  () => import('@/components/tool-clients/ExtractImagesWordClient'),
  { ssr: false }
);
export const PdfPageCounterClient = dynamic(
  () => import('@/components/tool-clients/PdfPageCounterClient'),
  { ssr: false }
);
export const ExtractTextPdfClient = dynamic(
  () => import('@/components/tool-clients/ExtractTextPdfClient'),
  { ssr: false }
);
export const ExtractImagesPdfClient = dynamic(
  () => import('@/components/tool-clients/ExtractImagesPdfClient'),
  { ssr: false }
);
export const PdfToExcelClient = dynamic(
  () => import('@/components/tool-clients/PdfToExcelClient'),
  { ssr: false }
);
export const PdfToCsvClient = dynamic(
  () => import('@/components/tool-clients/PdfToCsvClient'),
  { ssr: false }
);
export const PdfToPptClient = dynamic(
  () => import('@/components/tool-clients/PdfToPptClient'),
  { ssr: false }
);
export const MergePdfClient = dynamic(
  () => import('@/components/tool-clients/MergePdfClient'),
  { ssr: false }
);
export const SplitPdfClient = dynamic(
  () => import('@/components/tool-clients/SplitPdfClient'),
  { ssr: false }
);
export const PptSlideCounterClient = dynamic(
  () => import('@/components/tool-clients/PptSlideCounterClient'),
  { ssr: false }
);
export const ExtractTextPptClient = dynamic(
  () => import('@/components/tool-clients/ExtractTextPptClient'),
  { ssr: false }
);
export const ExtractImagesPptClient = dynamic(
  () => import('@/components/tool-clients/ExtractImagesPptClient'),
  { ssr: false }
);
export const PptToImagesClient = dynamic(
  () => import('@/components/tool-clients/PptToImagesClient'),
  { ssr: false }
);
export const PptToPdfClient = dynamic(
  () => import('@/components/tool-clients/PptToPdfClient'),
  { ssr: false }
);
export const MergePptClient = dynamic(
  () => import('@/components/tool-clients/MergePptClient'),
  { ssr: false }
);
export const SplitPptClient = dynamic(
  () => import('@/components/tool-clients/SplitPptClient'),
  { ssr: false }
);

// Tool Component Map
export const toolComponentMap: Record<string, ComponentType> = {
  // Developer Tools
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
  // Text Tools
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
  // Image Tools
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
  'png-to-jpg': PngToJpgClient,
  'jpg-to-png': JpgToPngClient,
  'webp-to-png': WebpToPngClient,
  'png-to-webp': PngToWebpClient,
  'resize-image-percentage': ResizeImagePercentageClient,
  'resize-image-dimensions': ImageResizeClient,
  'extract-colors': ExtractColorsClient,
  'image-to-ico': ImageToIcoClient,
  'favicon-generator': FaviconGeneratorClient,
  // YouTube Tools
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
  // Color Tools
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
  // Converter Tools
  'csv-to-json': CsvToJsonClient,
  'qr-code-generator': QrCodeGeneratorClient,
  'json-to-csv': JsonToCsvClient,
  'markdown-to-html': MarkdownToHtmlClient,
  'html-to-markdown': HtmlToMarkdownClient,
  'text-to-base64': TextToBase64Client,
  'base64-to-text': Base64ToTextClient,
  'unix-time-to-date': UnixTimeToDateClient,
  'date-to-unix-time': DateToUnixTimeClient,
  // Misc Tools
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
  // Office Tools - Excel
  'excel-to-csv': ExcelToCsvClient,
  'csv-to-excel': CsvToExcelClient,
  'excel-to-json': ExcelToJsonClient,
  'json-to-excel': JsonToExcelClient,
  'excel-to-xml': ExcelToXmlClient,
  'excel-to-sql': ExcelToSqlClient,
  'merge-excel': MergeExcelClient,
  // Office Tools - Word
  'word-to-pdf': WordToPdfClient,
  'pdf-to-word': PdfToWordClient,
  'word-to-txt': WordToTxtClient,
  'merge-word': MergeWordClient,
  'split-word': SplitWordClient,
  'word-word-counter': WordWordCounterClient,
  'extract-images-word': ExtractImagesWordClient,
  // Office Tools - PDF
  'pdf-page-counter': PdfPageCounterClient,
  'extract-text-pdf': ExtractTextPdfClient,
  'extract-images-pdf': ExtractImagesPdfClient,
  'pdf-to-excel': PdfToExcelClient,
  'pdf-to-csv': PdfToCsvClient,
  'pdf-to-ppt': PdfToPptClient,
  'merge-pdf': MergePdfClient,
  'split-pdf': SplitPdfClient,
  // Office Tools - PowerPoint
  'ppt-slide-counter': PptSlideCounterClient,
  'extract-text-ppt': ExtractTextPptClient,
  'extract-images-ppt': ExtractImagesPptClient,
  'ppt-to-images': PptToImagesClient,
  'ppt-to-pdf': PptToPdfClient,
  'merge-ppt': MergePptClient,
  'split-ppt': SplitPptClient,
};
