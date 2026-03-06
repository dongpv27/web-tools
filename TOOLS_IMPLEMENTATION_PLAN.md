# WEBTOOLS - KẾ HOẠCH TRIỂN KHAI 100 TOOLS

## HƯỚNG DẪN CHO CLAUDE

Khi đọc file này, hãy implement các tools theo đúng cấu trúc đã có sẵn:
- **Server Component**: `src/app/tools/{category}/{slug}/page.tsx` - Xử lý SEO, metadata, schema
- **Client Component**: `src/app/tools/{category}/{slug}/{ToolName}Client.tsx` - Xử lý logic tool

### Template đã có sẵn
Xem tool mẫu tại: `src/app/tools/dev/json-formatter/`

### Cấu trúc mỗi tool cần:
1. Thêm tool vào `src/lib/tools.ts`
2. Tạo Client Component với logic xử lý
3. Tạo Page Component với SEO content

---

## CATEGORY 1: DEVELOPER TOOLS (20 tools)

### 1.1 json-formatter ✅ (Đã hoàn thành)

### 1.2 json-validator
- **Slug**: `json-validator`
- **Function**: Validate JSON, hiển thị lỗi chi tiết với line number
- **Input**: Textarea paste JSON
- **Output**: Valid/Invalid message + error details
- **Keywords**: json validator, validate json, json checker, json lint
- **FAQ**:
  - Q: What is JSON Validator? A: Tool to check if JSON is valid
  - Q: How to validate JSON? A: Paste JSON, click validate
  - Q: What errors can it detect? A: Syntax errors, missing brackets, invalid types
- **Related**: json-formatter, json-to-yaml

### 1.3 json-to-yaml
- **Slug**: `json-to-yaml`
- **Function**: Convert JSON to YAML format
- **Input**: Textarea paste JSON
- **Output**: YAML formatted text
- **Keywords**: json to yaml, convert json, yaml converter
- **FAQ**:
  - Q: What is YAML? A: YAML is a human-readable data format
  - Q: Why convert JSON to YAML? A: YAML is easier to read and edit
  - Q: Is conversion accurate? A: Yes, preserves all data structure
- **Related**: json-formatter, yaml-to-json

### 1.4 yaml-to-json
- **Slug**: `yaml-to-json`
- **Function**: Convert YAML to JSON format
- **Input**: Textarea paste YAML
- **Output**: JSON formatted text
- **Keywords**: yaml to json, convert yaml, yaml parser
- **Related**: json-to-yaml, json-formatter

### 1.5 base64-encode
- **Slug**: `base64-encode`
- **Function**: Encode text to Base64
- **Input**: Textarea paste text
- **Output**: Base64 encoded string
- **Keywords**: base64 encode, base64 converter, text encoder
- **Related**: base64-decode, url-encode

### 1.6 base64-decode
- **Slug**: `base64-decode`
- **Function**: Decode Base64 to text
- **Input**: Textarea paste Base64
- **Output**: Decoded text
- **Keywords**: base64 decode, base64 converter, text decoder
- **Related**: base64-encode, url-decode

### 1.7 url-encode
- **Slug**: `url-encode`
- **Function**: URL encode text
- **Input**: Textarea paste text/URL
- **Output**: URL encoded string
- **Keywords**: url encode, percent encoding, url encoder
- **Related**: url-decode, base64-encode

### 1.8 url-decode
- **Slug**: `url-decode`
- **Function**: URL decode text
- **Input**: Textarea paste encoded URL
- **Output**: Decoded text
- **Keywords**: url decode, percent decoding, url decoder
- **Related**: url-encode, base64-decode

### 1.9 jwt-decoder
- **Slug**: `jwt-decoder`
- **Function**: Decode JWT token, hiển thị header, payload, signature
- **Input**: Textarea paste JWT token
- **Output**: JSON hiển thị header và payload
- **Keywords**: jwt decoder, jwt token, decode jwt, jwt viewer
- **Related**: base64-decode, json-formatter

### 1.10 timestamp-converter
- **Slug**: `timestamp-converter`
- **Function**: Convert Unix timestamp to date và ngược lại
- **Input**: Input timestamp hoặc date picker
- **Output**: Multiple date formats
- **Keywords**: unix timestamp, timestamp converter, epoch converter
- **Related**: uuid-generator, date-converter

### 1.11 uuid-generator
- **Slug**: `uuid-generator`
- **Function**: Generate UUID v4
- **Input**: Button generate + số lượng
- **Output**: List of UUIDs
- **Keywords**: uuid generator, guid generator, unique id
- **Related**: timestamp-converter, random-password

### 1.12 md5-hash-generator
- **Slug**: `md5-hash-generator`
- **Function**: Generate MD5 hash từ text
- **Input**: Textarea paste text
- **Output**: MD5 hash string
- **Keywords**: md5 hash, md5 generator, hash generator
- **Related**: sha256-hash, base64-encode

### 1.13 sha256-hash-generator
- **Slug**: `sha256-hash-generator`
- **Function**: Generate SHA256 hash từ text
- **Input**: Textarea paste text
- **Output**: SHA256 hash string
- **Keywords**: sha256 hash, sha256 generator, secure hash
- **Related**: md5-hash, base64-encode

### 1.14 regex-tester
- **Slug**: `regex-tester`
- **Function**: Test regex pattern với sample text, highlight matches
- **Input**: Regex pattern + test string
- **Output**: Matches highlighted
- **Keywords**: regex tester, regular expression, regex online
- **Related**: json-validator, text-tools

### 1.15 html-formatter
- **Slug**: `html-formatter`
- **Function**: Format/beautify HTML code
- **Input**: Textarea paste HTML
- **Output**: Formatted HTML
- **Keywords**: html formatter, html beautify, format html
- **Related**: css-formatter, json-formatter

### 1.16 css-formatter
- **Slug**: `css-formatter`
- **Function**: Format/beautify CSS code
- **Input**: Textarea paste CSS
- **Output**: Formatted CSS
- **Keywords**: css formatter, css beautify, format css
- **Related**: html-formatter, json-formatter

### 1.17 sql-formatter
- **Slug**: `sql-formatter`
- **Function**: Format/beautify SQL queries
- **Input**: Textarea paste SQL
- **Output**: Formatted SQL
- **Keywords**: sql formatter, sql beautify, format sql
- **Related**: json-formatter, html-formatter

### 1.18 ip-address-validator
- **Slug**: `ip-address-validator`
- **Function**: Validate IPv4 và IPv6 addresses
- **Input**: Text input IP address
- **Output**: Valid/Invalid + IP details
- **Keywords**: ip validator, ip address checker, ipv4 ipv6
- **Related**: url-validator, regex-tester

### 1.19 cron-expression-parser
- **Slug**: `cron-expression-parser`
- **Function**: Parse cron expression, hiển thị schedule
- **Input**: Text input cron expression
- **Output**: Human readable schedule + next run times
- **Keywords**: cron parser, cron expression, crontab
- **Related**: timestamp-converter, regex-tester

### 1.20 random-password-generator
- **Slug**: `random-password-generator`
- **Function**: Generate random password với options
- **Input**: Length slider, checkboxes (uppercase, lowercase, numbers, symbols)
- **Output**: Generated password + strength indicator
- **Keywords**: random password, password generator, secure password
- **Related**: uuid-generator, password-strength-checker

---

## CATEGORY 2: TEXT TOOLS (20 tools)

### 2.1 word-counter
- **Slug**: `word-counter`
- **Function**: Count words, characters, sentences, paragraphs
- **Input**: Textarea
- **Output**: Stats display
- **Keywords**: word counter, word count, character count
- **Related**: character-counter, text-case-converter

### 2.2 character-counter
- **Slug**: `character-counter`
- **Function**: Count characters with/without spaces
- **Input**: Textarea
- **Output**: Character stats
- **Keywords**: character counter, char count, letter counter
- **Related**: word-counter, text-tools

### 2.3 text-case-converter
- **Slug**: `text-case-converter`
- **Function**: Convert text case (UPPER, lower, Title, Sentence)
- **Input**: Textarea + case buttons
- **Output**: Converted text
- **Keywords**: text case converter, uppercase lowercase, capitalize
- **Related**: word-counter, text-formatter

### 2.4 remove-duplicate-lines
- **Slug**: `remove-duplicate-lines`
- **Function**: Remove duplicate lines from text
- **Input**: Textarea
- **Output**: Unique lines
- **Keywords**: remove duplicates, duplicate lines, unique lines
- **Related**: sort-lines, text-cleaner

### 2.5 sort-lines-alphabetically
- **Slug**: `sort-lines-alphabetically`
- **Function**: Sort lines A-Z or Z-A
- **Input**: Textarea + sort direction
- **Output**: Sorted lines
- **Keywords**: sort lines, alphabetical sort, line sorter
- **Related**: remove-duplicate-lines, text-tools

### 2.6 reverse-text
- **Slug**: `reverse-text`
- **Function**: Reverse text string
- **Input**: Textarea
- **Output**: Reversed text
- **Keywords**: reverse text, text reverser, flip text
- **Related**: text-case-converter, text-tools

### 2.7 remove-line-breaks
- **Slug**: `remove-line-breaks`
- **Function**: Remove all line breaks
- **Input**: Textarea
- **Output**: Single line text
- **Keywords**: remove line breaks, remove newlines, single line
- **Related**: text-cleaner, text-formatter

### 2.8 slug-generator
- **Slug**: `slug-generator`
- **Function**: Generate URL slug from text
- **Input**: Text input
- **Output**: URL-friendly slug
- **Keywords**: slug generator, url slug, seo slug
- **Related**: url-encode, text-case-converter

### 2.9 random-text-generator
- **Slug**: `random-text-generator`
- **Function**: Generate random text/words
- **Input**: Length/count options
- **Output**: Random text
- **Keywords**: random text, text generator, random words
- **Related**: lorem-ipsum, random-name-generator

### 2.10 lorem-ipsum-generator
- **Slug**: `lorem-ipsum-generator`
- **Function**: Generate Lorem Ipsum placeholder text
- **Input**: Paragraphs/words/sentences count
- **Output**: Lorem Ipsum text
- **Keywords**: lorem ipsum, placeholder text, dummy text
- **Related**: random-text-generator, word-counter

### 2.11 text-difference-checker
- **Slug**: `text-difference-checker`
- **Function**: Compare two texts, highlight differences
- **Input**: Two textareas
- **Output**: Diff view
- **Keywords**: text diff, compare text, difference checker
- **Related**: text-tools, json-validator

### 2.12 remove-html-tags
- **Slug**: `remove-html-tags`
- **Function**: Strip HTML tags from text
- **Input**: Textarea with HTML
- **Output**: Plain text
- **Keywords**: remove html tags, strip html, html to text
- **Related**: html-formatter, text-cleaner

### 2.13 find-and-replace
- **Slug**: `find-and-replace`
- **Function**: Find and replace text
- **Input**: Textarea + find/replace inputs
- **Output**: Modified text
- **Keywords**: find replace, text replace, search replace
- **Related**: text-tools, regex-tester

### 2.14 text-to-list
- **Slug**: `text-to-list`
- **Function**: Convert text to list format
- **Input**: Textarea + delimiter option
- **Output**: List format
- **Keywords**: text to list, convert to list, list maker
- **Related**: list-to-text, text-tools

### 2.15 list-to-text
- **Slug**: `list-to-text`
- **Function**: Convert list to paragraph text
- **Input**: Textarea with list
- **Output**: Paragraph text
- **Keywords**: list to text, list converter, merge lines
- **Related**: text-to-list, remove-line-breaks

### 2.16 random-name-generator
- **Slug**: `random-name-generator`
- **Function**: Generate random names
- **Input**: Count + gender option
- **Output**: List of names
- **Keywords**: random name, name generator, fake name
- **Related**: random-text-generator, lorem-ipsum

### 2.17 remove-extra-spaces
- **Slug**: `remove-extra-spaces`
- **Function**: Remove extra whitespace
- **Input**: Textarea
- **Output**: Cleaned text
- **Keywords**: remove spaces, extra spaces, whitespace remover
- **Related**: text-cleaner, remove-line-breaks

### 2.18 capitalize-sentences
- **Slug**: `capitalize-sentences`
- **Function**: Capitalize first letter of sentences
- **Input**: Textarea
- **Output**: Capitalized text
- **Keywords**: capitalize sentences, sentence case, capital letters
- **Related**: text-case-converter, text-formatter

### 2.19 text-cleaner
- **Slug**: `text-cleaner`
- **Function**: Clean text (trim, remove extra spaces, etc.)
- **Input**: Textarea + options
- **Output**: Cleaned text
- **Keywords**: text cleaner, clean text, text trim
- **Related**: remove-extra-spaces, remove-html-tags

### 2.20 text-formatter
- **Slug**: `text-formatter`
- **Function**: Format text with various options
- **Input**: Textarea + format options
- **Output**: Formatted text
- **Keywords**: text formatter, format text, text styling
- **Related**: text-case-converter, text-cleaner

---

## CATEGORY 3: IMAGE TOOLS (20 tools)

### 3.1 webp-to-png
- **Slug**: `webp-to-png`
- **Function**: Convert WebP to PNG
- **Input**: File upload
- **Output**: PNG download
- **Keywords**: webp to png, convert webp, webp converter
- **Related**: png-to-webp, image-converter

### 3.2 png-to-webp
- **Slug**: `png-to-webp`
- **Function**: Convert PNG to WebP
- **Input**: File upload
- **Output**: WebP download
- **Keywords**: png to webp, convert png, webp converter
- **Related**: webp-to-png, image-compress

### 3.3 jpg-to-png
- **Slug**: `jpg-to-png`
- **Function**: Convert JPG to PNG
- **Input**: File upload
- **Output**: PNG download
- **Keywords**: jpg to png, jpeg to png, convert jpg
- **Related**: png-to-jpg, image-converter

### 3.4 png-to-jpg
- **Slug**: `png-to-jpg`
- **Function**: Convert PNG to JPG
- **Input**: File upload + quality slider
- **Output**: JPG download
- **Keywords**: png to jpg, convert png, jpg converter
- **Related**: jpg-to-png, image-compress

### 3.5 image-to-base64
- **Slug**: `image-to-base64`
- **Function**: Convert image to Base64 string
- **Input**: File upload
- **Output**: Base64 string
- **Keywords**: image to base64, base64 image, encode image
- **Related**: base64-to-image, base64-encode

### 3.6 base64-to-image
- **Slug**: `base64-to-image`
- **Function**: Convert Base64 to image
- **Input**: Textarea Base64
- **Output**: Image preview + download
- **Keywords**: base64 to image, decode image, base64 decoder
- **Related**: image-to-base64, base64-decode

### 3.7 resize-image-percentage
- **Slug**: `resize-image-percentage`
- **Function**: Resize image by percentage
- **Input**: File upload + percentage slider
- **Output**: Resized image download
- **Keywords**: resize image, image resizer, scale image
- **Related**: resize-image-dimensions, image-compress

### 3.8 resize-image-dimensions
- **Slug**: `resize-image-dimensions`
- **Function**: Resize image by exact dimensions
- **Input**: File upload + width/height inputs
- **Output**: Resized image download
- **Keywords**: resize image, image dimensions, image size
- **Related**: resize-image-percentage, crop-image

### 3.9 rotate-image
- **Slug**: `rotate-image`
- **Function**: Rotate image by degrees
- **Input**: File upload + degree input/slider
- **Output**: Rotated image download
- **Keywords**: rotate image, image rotation, rotate photo
- **Related**: flip-image, image-tools

### 3.10 flip-image-horizontal
- **Slug**: `flip-image-horizontal`
- **Function**: Flip image horizontally
- **Input**: File upload
- **Output**: Flipped image download
- **Keywords**: flip image, mirror image, flip horizontal
- **Related**: flip-image-vertical, rotate-image

### 3.11 flip-image-vertical
- **Slug**: `flip-image-vertical`
- **Function**: Flip image vertically
- **Input**: File upload
- **Output**: Flipped image download
- **Keywords**: flip image, mirror image, flip vertical
- **Related**: flip-image-horizontal, rotate-image

### 3.12 blur-image
- **Slug**: `blur-image`
- **Function**: Apply blur effect to image
- **Input**: File upload + blur intensity slider
- **Output**: Blurred image download
- **Keywords**: blur image, image blur, blur photo
- **Related**: pixelate-image, image-effects

### 3.13 pixelate-image
- **Slug**: `pixelate-image`
- **Function**: Pixelate image
- **Input**: File upload + pixel size slider
- **Output**: Pixelated image download
- **Keywords**: pixelate image, pixelate, mosaic effect
- **Related**: blur-image, image-effects

### 3.14 image-color-picker
- **Slug**: `image-color-picker`
- **Function**: Pick color from image
- **Input**: File upload + click on image
- **Output**: Color code (HEX, RGB)
- **Keywords**: image color picker, pick color from image, color eyedropper
- **Related**: color-picker, extract-colors

### 3.15 extract-colors
- **Slug**: `extract-colors`
- **Function**: Extract color palette from image
- **Input**: File upload
- **Output**: Color palette display
- **Keywords**: extract colors, color palette, image colors
- **Related**: image-color-picker, color-palette-generator

### 3.16 image-border
- **Slug**: `image-border`
- **Function**: Add border to image
- **Input**: File upload + border width/color
- **Output**: Image with border download
- **Keywords**: image border, add border, photo border
- **Related**: image-effects, image-tools

### 3.17 image-to-ico
- **Slug**: `image-to-ico`
- **Function**: Convert image to ICO format
- **Input**: File upload
- **Output**: ICO download
- **Keywords**: image to ico, ico converter, favicon ico
- **Related**: favicon-generator, image-converter

### 3.18 favicon-generator
- **Slug**: `favicon-generator`
- **Function**: Generate favicon from image
- **Input**: File upload
- **Output**: Favicon files download
- **Keywords**: favicon generator, create favicon, website icon
- **Related**: image-to-ico, image-tools

### 3.19 grayscale-image
- **Slug**: `grayscale-image`
- **Function**: Convert image to grayscale
- **Input**: File upload
- **Output**: Grayscale image download
- **Keywords**: grayscale image, black white, convert grayscale
- **Related**: image-effects, image-tools

### 3.20 adjust-brightness
- **Slug**: `adjust-brightness`
- **Function**: Adjust image brightness
- **Input**: File upload + brightness slider
- **Output**: Adjusted image download
- **Keywords**: adjust brightness, image brightness, brighten image
- **Related**: image-effects, contrast-adjust

---

## CATEGORY 4: YOUTUBE TOOLS (10 tools)

### 4.1 youtube-thumbnail-downloader
- **Slug**: `youtube-thumbnail-downloader`
- **Function**: Download YouTube video thumbnails
- **Input**: YouTube URL input
- **Output**: Thumbnail preview + download buttons (HD, SD, Max)
- **Keywords**: youtube thumbnail, download thumbnail, youtube image
- **Related**: youtube-video-id, youtube-embed-generator

### 4.2 youtube-tag-extractor
- **Slug**: `youtube-tag-extractor`
- **Function**: Extract tags from YouTube video
- **Input**: YouTube URL input
- **Output**: List of tags
- **Keywords**: youtube tags, extract tags, video tags
- **Related**: youtube-title-generator, youtube-tools

### 4.3 youtube-title-generator
- **Slug**: `youtube-title-generator`
- **Function**: Generate SEO titles for YouTube
- **Input**: Topic/keyword input
- **Output**: Generated title suggestions
- **Keywords**: youtube title, video title, seo title
- **Related**: youtube-description-generator, youtube-tools

### 4.4 youtube-description-generator
- **Slug**: `youtube-description-generator`
- **Function**: Generate YouTube description
- **Input**: Topic/keywords input
- **Output**: Generated description
- **Keywords**: youtube description, video description, description template
- **Related**: youtube-title-generator, youtube-tools

### 4.5 youtube-hashtag-generator
- **Slug**: `youtube-hashtag-generator`
- **Function**: Generate hashtags for YouTube
- **Input**: Topic/keywords input
- **Output**: List of hashtags
- **Keywords**: youtube hashtags, video hashtags, youtube tags
- **Related**: youtube-tag-extractor, youtube-tools

### 4.6 youtube-timestamp-generator
- **Slug**: `youtube-timestamp-generator`
- **Function**: Generate timestamp links for YouTube
- **Input**: Time + label inputs
- **Output**: Formatted timestamp links
- **Keywords**: youtube timestamp, video timestamp, time links
- **Related**: youtube-tools, youtube-description-generator

### 4.7 youtube-embed-generator
- **Slug**: `youtube-embed-generator`
- **Function**: Generate embed code for YouTube
- **Input**: YouTube URL + options
- **Output**: HTML embed code
- **Keywords**: youtube embed, embed code, video embed
- **Related**: youtube-thumbnail-downloader, youtube-tools

### 4.8 youtube-channel-id-finder
- **Slug**: `youtube-channel-id-finder`
- **Function**: Find YouTube channel ID from URL
- **Input**: Channel URL input
- **Output**: Channel ID + info
- **Keywords**: youtube channel id, channel id finder, youtube channel
- **Related**: youtube-video-id, youtube-tools

### 4.9 youtube-video-id-extractor
- **Slug**: `youtube-video-id-extractor`
- **Function**: Extract video ID from YouTube URL
- **Input**: YouTube URL input
- **Output**: Video ID
- **Keywords**: youtube video id, video id extractor, youtube id
- **Related**: youtube-thumbnail-downloader, youtube-channel-id

### 4.10 youtube-playlist-id-extractor
- **Slug**: `youtube-playlist-id-extractor`
- **Function**: Extract playlist ID from YouTube URL
- **Input**: YouTube playlist URL input
- **Output**: Playlist ID
- **Keywords**: youtube playlist id, playlist id, youtube playlist
- **Related**: youtube-video-id, youtube-tools

---

## CATEGORY 5: COLOR TOOLS (10 tools)

### 5.1 color-picker
- **Slug**: `color-picker`
- **Function**: Color picker with multiple formats
- **Input**: Color input/picker
- **Output**: HEX, RGB, HSL values
- **Keywords**: color picker, hex color, rgb color, pick color
- **Related**: hex-to-rgb, color-converter

### 5.2 hex-to-rgb
- **Slug**: `hex-to-rgb`
- **Function**: Convert HEX to RGB
- **Input**: HEX input
- **Output**: RGB values
- **Keywords**: hex to rgb, hex converter, color converter
- **Related**: rgb-to-hex, color-picker

### 5.3 rgb-to-hex
- **Slug**: `rgb-to-hex`
- **Function**: Convert RGB to HEX
- **Input**: RGB inputs
- **Output**: HEX value
- **Keywords**: rgb to hex, rgb converter, color converter
- **Related**: hex-to-rgb, color-picker

### 5.4 color-palette-generator
- **Slug**: `color-palette-generator`
- **Function**: Generate color palette
- **Input**: Base color or random
- **Output**: Color palette display
- **Keywords**: color palette, palette generator, color scheme
- **Related**: color-picker, gradient-generator

### 5.5 gradient-generator
- **Slug**: `gradient-generator`
- **Function**: Generate CSS gradient
- **Input**: Color stops + direction
- **Output**: CSS gradient code + preview
- **Keywords**: gradient generator, css gradient, color gradient
- **Related**: css-gradient-generator, color-tools

### 5.6 color-contrast-checker
- **Slug**: `color-contrast-checker`
- **Function**: Check color contrast ratio (WCAG)
- **Input**: Two color inputs
- **Output**: Contrast ratio + WCAG score
- **Keywords**: color contrast, contrast checker, wcag contrast
- **Related**: color-picker, accessibility-tools

### 5.7 css-gradient-generator
- **Slug**: `css-gradient-generator`
- **Function**: Generate CSS gradient code
- **Input**: Colors + type + direction
- **Output**: CSS code + preview
- **Keywords**: css gradient, gradient css, linear gradient
- **Related**: gradient-generator, color-tools

### 5.8 random-color-generator
- **Slug**: `random-color-generator`
- **Function**: Generate random colors
- **Input**: Count + format options
- **Output**: Random color values
- **Keywords**: random color, color generator, random hex
- **Related**: color-palette-generator, color-picker

### 5.9 image-color-extractor
- **Slug**: `image-color-extractor`
- **Function**: Extract dominant colors from image
- **Input**: File upload
- **Output**: Dominant color palette
- **Keywords**: extract colors, image colors, dominant colors
- **Related**: color-palette-generator, image-color-picker

### 5.10 tailwind-color-converter
- **Slug**: `tailwind-color-converter`
- **Function**: Convert color to Tailwind classes
- **Input**: Color input
- **Output**: Closest Tailwind color class
- **Keywords**: tailwind color, tailwind converter, tailwind css
- **Related**: color-picker, color-tools

---

## CATEGORY 6: CONVERTER TOOLS (10 tools)

### 6.1 markdown-to-html
- **Slug**: `markdown-to-html`
- **Function**: Convert Markdown to HTML
- **Input**: Textarea Markdown
- **Output**: HTML code
- **Keywords**: markdown to html, md to html, markdown converter
- **Related**: html-to-markdown, html-formatter

### 6.2 html-to-markdown
- **Slug**: `html-to-markdown`
- **Function**: Convert HTML to Markdown
- **Input**: Textarea HTML
- **Output**: Markdown text
- **Keywords**: html to markdown, html converter, markdown
- **Related**: markdown-to-html, remove-html-tags

### 6.3 csv-to-json
- **Slug**: `csv-to-json`
- **Function**: Convert CSV to JSON
- **Input**: Textarea/file CSV
- **Output**: JSON data
- **Keywords**: csv to json, csv converter, convert csv
- **Related**: json-to-csv, json-formatter

### 6.4 json-to-csv
- **Slug**: `json-to-csv`
- **Function**: Convert JSON to CSV
- **Input**: Textarea JSON
- **Output**: CSV data
- **Keywords**: json to csv, json converter, convert json
- **Related**: csv-to-json, json-formatter

### 6.5 text-to-base64
- **Slug**: `text-to-base64`
- **Function**: Convert text to Base64
- **Input**: Textarea text
- **Output**: Base64 string
- **Keywords**: text to base64, base64 encode, encode text
- **Related**: base64-to-text, base64-encode

### 6.6 base64-to-text
- **Slug**: `base64-to-text`
- **Function**: Convert Base64 to text
- **Input**: Textarea Base64
- **Output**: Plain text
- **Keywords**: base64 to text, base64 decode, decode base64
- **Related**: text-to-base64, base64-decode

### 6.7 url-to-qr-code
- **Slug**: `url-to-qr-code`
- **Function**: Generate QR code from URL
- **Input**: URL input
- **Output**: QR code image
- **Keywords**: qr code, url to qr, qr generator
- **Related**: qr-code-generator, text-to-qr

### 6.8 qr-code-generator
- **Slug**: `qr-code-generator`
- **Function**: Generate QR code from text
- **Input**: Text input + options
- **Output**: QR code image
- **Keywords**: qr code generator, qr generator, create qr code
- **Related**: url-to-qr-code, barcode-generator

### 6.9 unix-time-to-date
- **Slug**: `unix-time-to-date`
- **Function**: Convert Unix timestamp to date
- **Input**: Timestamp input
- **Output**: Date string
- **Keywords**: unix timestamp, timestamp to date, epoch converter
- **Related**: date-to-unix-time, timestamp-converter

### 6.10 date-to-unix-time
- **Slug**: `date-to-unix-time`
- **Function**: Convert date to Unix timestamp
- **Input**: Date picker
- **Output**: Unix timestamp
- **Keywords**: date to timestamp, unix time, epoch time
- **Related**: unix-time-to-date, timestamp-converter

---

## CATEGORY 7: MISC TOOLS (10 tools)

### 7.1 random-number-generator
- **Slug**: `random-number-generator`
- **Function**: Generate random numbers
- **Input**: Min/max range + count
- **Output**: Random numbers
- **Keywords**: random number, number generator, random generator
- **Related**: random-password-generator, dice-roll

### 7.2 dice-roll-simulator
- **Slug**: `dice-roll-simulator`
- **Function**: Simulate dice roll
- **Input**: Number of dice
- **Output**: Dice result + total
- **Keywords**: dice roll, dice simulator, roll dice
- **Related**: random-number-generator, coin-flip

### 7.3 coin-flip
- **Slug**: `coin-flip`
- **Function**: Flip a coin
- **Input**: Button flip
- **Output**: Heads/Tails result
- **Keywords**: coin flip, flip coin, heads or tails
- **Related**: dice-roll-simulator, random-generator

### 7.4 countdown-timer
- **Slug**: `countdown-timer`
- **Function**: Create countdown timer
- **Input**: Time input
- **Output**: Countdown display + share link
- **Keywords**: countdown timer, timer, countdown
- **Related**: stopwatch, time-tools

### 7.5 barcode-generator
- **Slug**: `barcode-generator`
- **Function**: Generate barcode
- **Input**: Text input + format select
- **Output**: Barcode image
- **Keywords**: barcode generator, create barcode, barcode maker
- **Related**: qr-code-generator, label-generator

### 7.6 password-strength-checker
- **Slug**: `password-strength-checker`
- **Function**: Check password strength
- **Input**: Password input
- **Output**: Strength score + suggestions
- **Keywords**: password strength, check password, strong password
- **Related**: random-password-generator, security-tools

### 7.7 unit-converter
- **Slug**: `unit-converter`
- **Function**: Convert units (length, weight, etc.)
- **Input**: Value + from/to units
- **Output**: Converted value
- **Keywords**: unit converter, convert units, measurement converter
- **Related**: number-tools, converter-tools

### 7.8 age-calculator
- **Slug**: `age-calculator`
- **Function**: Calculate age from birthday
- **Input**: Date of birth
- **Output**: Age in years, months, days
- **Keywords**: age calculator, calculate age, birthday calculator
- **Related**: date-tools, countdown-timer

### 7.9 bmi-calculator
- **Slug**: `bmi-calculator`
- **Function**: Calculate BMI
- **Input**: Height + weight
- **Output**: BMI value + category
- **Keywords**: bmi calculator, body mass index, bmi
- **Related**: age-calculator, health-tools

### 7.10 percentage-calculator
- **Slug**: `percentage-calculator`
- **Function**: Calculate percentages
- **Input**: Various percentage calculations
- **Output**: Results
- **Keywords**: percentage calculator, percent calculator, calculate percentage
- **Related**: unit-converter, number-tools

---

## THỨ TỰ IMPLEMENT (PRIORITY)

### Phase 1: High SEO Value (20 tools)
1. json-formatter ✅
2. youtube-thumbnail-downloader
3. image-color-extractor
4. remove-duplicate-lines
5. text-case-converter
6. slug-generator
7. image-to-base64
8. uuid-generator
9. timestamp-converter
10. qr-code-generator
11. password-strength-checker
12. regex-tester
13. markdown-to-html
14. csv-to-json
15. hex-to-rgb
16. random-password-generator
17. random-name-generator
18. lorem-ipsum-generator
19. youtube-tag-extractor
20. image-to-ico

### Phase 2: Complete Categories (30 tools)
All remaining Developer Tools, Text Tools

### Phase 3: Full Coverage (50 tools)
All Image Tools, YouTube Tools, Color Tools, Converters, Misc

---

## SEO TEMPLATE CHO MỖI TOOL

### Metadata
```typescript
title: `${toolName} - Free Online Tool | WebTools`
description: toolDescription (120-160 chars)
keywords: toolKeywords
```

### Page Structure
```
Breadcrumb
H1: Tool Name
Description: Short description

TOOL CARD
- Input area
- Action buttons
- Result area
- Copy/Download buttons

H2: What is {Tool Name}
H2: Why use {Tool Name}
H2: How to use {Tool Name}
  - Step 1
  - Step 2
  - Step 3

FAQ Section (3-5 questions)

Related Tools (3-4 tools)
```

### FAQ Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

### SoftwareApplication Schema
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Tool Name",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0"
  }
}
```

---

## LƯU Ý KHI IMPLEMENT

1. **Client-side processing**: Tất cả xử lý trong browser
2. **No external API calls**: Không gọi API bên ngoài
3. **Responsive**: Mobile-first design
4. **Fast loading**: Minimal JS, optimize bundle
5. **Accessibility**: WCAG compliance
6. **Copy button**: Luôn có copy button cho output
7. **Clear button**: Có nút clear input
8. **Error handling**: Hiển thị lỗi rõ ràng
9. **Loading states**: Show loading khi xử lý lâu
10. **File size limits**: Giới hạn file upload (nếu applicable)
