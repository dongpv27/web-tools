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
export const JwtDecoderTab = dynamic(
  () => import('@/components/tool-clients/JwtDecoderTab'),
  { ssr: false }
);
export const JwtEncoderTab = dynamic(
  () => import('@/components/tool-clients/JwtEncoderTab'),
  { ssr: false }
);
export const JwtToolClient = dynamic(
  () => import('@/components/tool-clients/JwtToolClient'),
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
export const JsonMinifyClient = dynamic(
  () => import('@/components/tool-clients/JsonMinifyClient'),
  { ssr: false }
);
export const JsonDiffClient = dynamic(
  () => import('@/components/tool-clients/JsonDiffClient'),
  { ssr: false }
);
export const HtmlEncodeDecodeClient = dynamic(
  () => import('@/components/tool-clients/HtmlEncodeDecodeClient'),
  { ssr: false }
);
export const QueryStringParserClient = dynamic(
  () => import('@/components/tool-clients/QueryStringParserClient'),
  { ssr: false }
);
export const UrlParserClient = dynamic(
  () => import('@/components/tool-clients/UrlParserClient'),
  { ssr: false }
);
export const HttpStatusCodesClient = dynamic(
  () => import('@/components/tool-clients/HttpStatusCodesClient'),
  { ssr: false }
);
export const UserAgentParserClient = dynamic(
  () => import('@/components/tool-clients/UserAgentParserClient'),
  { ssr: false }
);
export const BinaryConverterClient = dynamic(
  () => import('@/components/tool-clients/BinaryConverterClient'),
  { ssr: false }
);
export const HexConverterClient = dynamic(
  () => import('@/components/tool-clients/HexConverterClient'),
  { ssr: false }
);
export const BcryptHashGeneratorClient = dynamic(
  () => import('@/components/tool-clients/BcryptHashGeneratorClient'),
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

// Video Tools
export const VideoToGifClient = dynamic(
  () => import('@/components/tool-clients/VideoToGifClient'),
  { ssr: false }
);
export const CompressVideoClient = dynamic(
  () => import('@/components/tool-clients/CompressVideoClient'),
  { ssr: false }
);
export const Mp4ToMp3Client = dynamic(
  () => import('@/components/tool-clients/Mp4ToMp3Client'),
  { ssr: false }
);
export const TrimVideoClient = dynamic(
  () => import('@/components/tool-clients/TrimVideoClient'),
  { ssr: false }
);
export const CropVideoClient = dynamic(
  () => import('@/components/tool-clients/CropVideoClient'),
  { ssr: false }
);
export const ResizeVideoClient = dynamic(
  () => import('@/components/tool-clients/ResizeVideoClient'),
  { ssr: false }
);
export const MergeVideosClient = dynamic(
  () => import('@/components/tool-clients/MergeVideosClient'),
  { ssr: false }
);
export const RotateVideoClient = dynamic(
  () => import('@/components/tool-clients/RotateVideoClient'),
  { ssr: false }
);
export const ChangeVideoSpeedClient = dynamic(
  () => import('@/components/tool-clients/ChangeVideoSpeedClient'),
  { ssr: false }
);
export const ExtractAudioClient = dynamic(
  () => import('@/components/tool-clients/ExtractAudioClient'),
  { ssr: false }
);
export const MuteVideoClient = dynamic(
  () => import('@/components/tool-clients/MuteVideoClient'),
  { ssr: false }
);
export const VideoToImagesClient = dynamic(
  () => import('@/components/tool-clients/VideoToImagesClient'),
  { ssr: false }
);
export const ReverseVideoClient = dynamic(
  () => import('@/components/tool-clients/ReverseVideoClient'),
  { ssr: false }
);
export const LoopVideoClient = dynamic(
  () => import('@/components/tool-clients/LoopVideoClient'),
  { ssr: false }
);
export const VideoThumbnailClient = dynamic(
  () => import('@/components/tool-clients/VideoThumbnailClient'),
  { ssr: false }
);
export const SplitVideoClient = dynamic(
  () => import('@/components/tool-clients/SplitVideoClient'),
  { ssr: false }
);
export const AddTextToVideoClient = dynamic(
  () => import('@/components/tool-clients/AddTextToVideoClient'),
  { ssr: false }
);
export const AddWatermarkToVideoClient = dynamic(
  () => import('@/components/tool-clients/AddWatermarkToVideoClient'),
  { ssr: false }
);
export const ConvertVideoClient = dynamic(
  () => import('@/components/tool-clients/ConvertVideoClient'),
  { ssr: false }
);
export const VideoFrameExtractorClient = dynamic(
  () => import('@/components/tool-clients/VideoFrameExtractorClient'),
  { ssr: false }
);

// New Developer Tools
export const RandomStringGeneratorClient = dynamic(
  () => import('@/components/tool-clients/RandomStringGeneratorClient'),
  { ssr: false }
);
export const GuidGeneratorClient = dynamic(
  () => import('@/components/tool-clients/GuidGeneratorClient'),
  { ssr: false }
);
export const UuidBulkGeneratorClient = dynamic(
  () => import('@/components/tool-clients/UuidBulkGeneratorClient'),
  { ssr: false }
);
export const CurlToFetchClient = dynamic(
  () => import('@/components/tool-clients/CurlToFetchClient'),
  { ssr: false }
);

// New Text Tools
export const Rot13EncoderClient = dynamic(
  () => import('@/components/tool-clients/Rot13EncoderClient'),
  { ssr: false }
);
export const Rot13DecoderClient = dynamic(
  () => import('@/components/tool-clients/Rot13DecoderClient'),
  { ssr: false }
);
export const MorseCodeTranslatorClient = dynamic(
  () => import('@/components/tool-clients/MorseCodeTranslatorClient'),
  { ssr: false }
);
export const AsciiConverterClient = dynamic(
  () => import('@/components/tool-clients/AsciiConverterClient'),
  { ssr: false }
);

// New Image Tools
export const ImageCompressorClient = dynamic(
  () => import('@/components/tool-clients/ImageCompressorClient'),
  { ssr: false }
);
export const CropImageClient = dynamic(
  () => import('@/components/tool-clients/CropImageClient'),
  { ssr: false }
);
export const GifMakerClient = dynamic(
  () => import('@/components/tool-clients/GifMakerClient'),
  { ssr: false }
);
export const PngCompressorClient = dynamic(
  () => import('@/components/tool-clients/PngCompressorClient'),
  { ssr: false }
);
export const JpegCompressorClient = dynamic(
  () => import('@/components/tool-clients/JpegCompressorClient'),
  { ssr: false }
);
export const GifCompressorClient = dynamic(
  () => import('@/components/tool-clients/GifCompressorClient'),
  { ssr: false }
);
export const SvgToPngClient = dynamic(
  () => import('@/components/tool-clients/SvgToPngClient'),
  { ssr: false }
);

// New Video Tools
export const VideoScreenshotClient = dynamic(
  () => import('@/components/tool-clients/VideoScreenshotClient'),
  { ssr: false }
);

// New Color Tools
export const RgbColorPickerClient = dynamic(
  () => import('@/components/tool-clients/RgbColorPickerClient'),
  { ssr: false }
);
export const HexColorPickerClient = dynamic(
  () => import('@/components/tool-clients/HexColorPickerClient'),
  { ssr: false }
);
export const RgbaToHexClient = dynamic(
  () => import('@/components/tool-clients/RgbaToHexClient'),
  { ssr: false }
);

// New Converter Tools
export const TimeConverterClient = dynamic(
  () => import('@/components/tool-clients/TimeConverterClient'),
  { ssr: false }
);
export const TemperatureConverterClient = dynamic(
  () => import('@/components/tool-clients/TemperatureConverterClient'),
  { ssr: false }
);
export const WeightConverterClient = dynamic(
  () => import('@/components/tool-clients/WeightConverterClient'),
  { ssr: false }
);
export const LengthConverterClient = dynamic(
  () => import('@/components/tool-clients/LengthConverterClient'),
  { ssr: false }
);
export const MarkdownToPdfClient = dynamic(
  () => import('@/components/tool-clients/MarkdownToPdfClient'),
  { ssr: false }
);
export const JsonToXmlClient = dynamic(
  () => import('@/components/tool-clients/JsonToXmlClient'),
  { ssr: false }
);
export const XmlToJsonClient = dynamic(
  () => import('@/components/tool-clients/XmlToJsonClient'),
  { ssr: false }
);

// New Misc Tools
export const SecureTokenGeneratorClient = dynamic(
  () => import('@/components/tool-clients/SecureTokenGeneratorClient'),
  { ssr: false }
);
export const NanoIdGeneratorClient = dynamic(
  () => import('@/components/tool-clients/NanoIdGeneratorClient'),
  { ssr: false }
);
export const SlugGeneratorAdvancedClient = dynamic(
  () => import('@/components/tool-clients/SlugGeneratorAdvancedClient'),
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
  'jwt-decoder': JwtDecoderTab,
  'md5-hash-generator': Md5HashGeneratorClient,
  'sha256-hash-generator': Sha256HashGeneratorClient,
  'html-formatter': HtmlFormatterClient,
  'css-formatter': CssFormatterClient,
  'sql-formatter': SqlFormatterClient,
  'ip-address-validator': IpAddressValidatorClient,
  'cron-expression-parser': CronExpressionParserClient,
  'json-minify': JsonMinifyClient,
  'json-diff': JsonDiffClient,
  'html-encode-decode': HtmlEncodeDecodeClient,
  'query-string-parser': QueryStringParserClient,
  'url-parser': UrlParserClient,
  'http-status-codes': HttpStatusCodesClient,
  'user-agent-parser': UserAgentParserClient,
  'binary-converter': BinaryConverterClient,
  'hex-converter': HexConverterClient,
  'bcrypt-hash-generator': BcryptHashGeneratorClient,
  'random-string-generator': RandomStringGeneratorClient,
  'guid-generator': GuidGeneratorClient,
  'uuid-bulk-generator': UuidBulkGeneratorClient,
  'jwt-encoder': JwtEncoderTab,
  'curl-to-fetch': CurlToFetchClient,
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
  'rot13-encoder': Rot13EncoderClient,
  'rot13-decoder': Rot13DecoderClient,
  'morse-code-translator': MorseCodeTranslatorClient,
  'ascii-converter': AsciiConverterClient,
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
  'image-compressor': ImageCompressorClient,
  'crop-image': CropImageClient,
  'gif-maker': GifMakerClient,
  'png-compressor': PngCompressorClient,
  'jpeg-compressor': JpegCompressorClient,
  'gif-compressor': GifCompressorClient,
  'svg-to-png': SvgToPngClient,
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
  'rgb-color-picker': RgbColorPickerClient,
  'hex-color-picker': HexColorPickerClient,
  'rgba-to-hex': RgbaToHexClient,
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
  'time-converter': TimeConverterClient,
  'temperature-converter': TemperatureConverterClient,
  'weight-converter': WeightConverterClient,
  'length-converter': LengthConverterClient,
  'markdown-to-pdf': MarkdownToPdfClient,
  'json-to-xml': JsonToXmlClient,
  'xml-to-json': XmlToJsonClient,
  // Misc Tools
  'random-number-generator': RandomNumberGeneratorClient,
  'dice-roll-simulator': DiceRollSimulatorClient,
  'coin-flip': CoinFlipClient,
  'password-strength-checker': PasswordStrengthCheckerClient,
  'secure-token-generator': SecureTokenGeneratorClient,
  'nano-id-generator': NanoIdGeneratorClient,
  'slug-generator-advanced': SlugGeneratorAdvancedClient,
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
  // Video Tools
  'video-to-gif': VideoToGifClient,
  'compress-video': CompressVideoClient,
  'mp4-to-mp3': Mp4ToMp3Client,
  'trim-video': TrimVideoClient,
  'crop-video': CropVideoClient,
  'resize-video': ResizeVideoClient,
  'merge-videos': MergeVideosClient,
  'rotate-video': RotateVideoClient,
  'change-video-speed': ChangeVideoSpeedClient,
  'extract-audio': ExtractAudioClient,
  'mute-video': MuteVideoClient,
  'video-to-images': VideoToImagesClient,
  'reverse-video': ReverseVideoClient,
  'loop-video': LoopVideoClient,
  'video-thumbnail': VideoThumbnailClient,
  'split-video': SplitVideoClient,
  'add-text-to-video': AddTextToVideoClient,
  'add-watermark-to-video': AddWatermarkToVideoClient,
  'convert-video': ConvertVideoClient,
  'video-frame-extractor': VideoFrameExtractorClient,
  'video-screenshot': VideoScreenshotClient,
};
