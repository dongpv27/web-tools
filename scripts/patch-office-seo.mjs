// One-shot patch: inject exampleOutput + seoContent into 26 office tools that
// already have howToUse. Idempotent — skips any tool that already has seoContent.

import fs from 'node:fs';

const FILE = 'src/lib/tools.ts';
let src = fs.readFileSync(FILE, 'utf8');

const DATA = {
  'csv-to-excel': {
    exampleOutput: {
      input: 'orders.csv (12,400 rows, comma-delimited with quoted addresses)',
      output: 'orders.xlsx — typed columns, header row, opens directly in Excel',
      description: 'Real .xlsx workbook with inferred number/date/boolean column types, generated locally in your browser.',
    },
    seo: {
      intro: 'Convert CSV files to real Microsoft Excel workbooks (.xlsx) right in your browser — no upload, no account, no row limits beyond what fits in memory. The converter follows RFC 4180 quoting rules, auto-detects delimiters, and infers numeric/date/boolean column types so Excel opens the result as a properly typed spreadsheet instead of a wall of text.',
      examples: [
        { title: 'Sales export from a SaaS dashboard', body: 'A 50k-row CSV with mixed numeric, date, and currency columns becomes a typed .xlsx — pivot tables and SUM() work without retyping any column.' },
        { title: 'Quoted multi-line fields', body: 'Customer addresses wrapped in double quotes containing commas and newlines are parsed correctly per RFC 4180 — one cell per address, no row drift.' },
        { title: 'Bulk product catalogue', body: 'A pipe-delimited inventory file is converted by selecting the pipe delimiter; output keeps leading zeros on SKU codes by forcing the column to text.' },
      ],
      useCases: [
        'Importing analytics exports (Stripe, Google Analytics, Shopify) into Excel for reporting',
        'Sharing data with non-technical teammates who only have Excel',
        'Preparing CSV downloads for upload into accounting software that requires .xlsx',
        'Quickly inspecting large CSVs in Excel without breaking column types',
        'Converting database dumps for offline analysis',
      ],
      troubleshooting: [
        { problem: 'Leading zeros disappear from ID columns (e.g. 00123 → 123)', solution: 'Force the column to text in the column-type override before converting. CSV is untyped, but Excel auto-coerces numbers — text mode keeps every character literal.' },
        { problem: 'Rows look misaligned after conversion', solution: 'The delimiter was probably wrong — pick the correct one (comma/semicolon/tab/pipe). Also check that quoted fields use straight " and not curly " " quotes.' },
        { problem: 'Date column shows as a number', solution: 'Excel stored it as a serial number — format the column as Date in Excel, or pre-format the CSV dates as ISO 8601 (YYYY-MM-DD) so the converter recognises them.' },
      ],
    },
  },
  'excel-to-json': {
    exampleOutput: {
      input: 'employees.xlsx (Sheet1, 1,800 rows × 9 columns)',
      output: 'employees.json — array of 1,800 objects keyed by the first-row headers',
      description: 'Pretty-printed JSON array. Each cell becomes a property typed as string/number/boolean/null based on the underlying Excel cell type.',
    },
    seo: {
      intro: 'Convert Excel spreadsheets (.xlsx, .xls) into clean JSON arrays without uploading the file anywhere. The converter reads the chosen sheet, treats row 1 as the keys, and preserves Excel cell types (numbers stay numbers, dates become ISO strings, blanks become null) so the output drops straight into APIs, databases, or front-end apps.',
      examples: [
        { title: 'API seed data', body: 'A product catalogue maintained in Excel becomes a JSON array your seed script can post to /products in one curl loop.' },
        { title: 'Multi-sheet workbook', body: 'Pick which sheet to convert; the others are ignored. Useful when finance keeps `Inputs` and `Outputs` in the same file.' },
        { title: 'Nested keys via dot notation', body: 'Headers like `address.city` and `address.zip` are turned into nested objects automatically — no manual restructuring needed.' },
      ],
      useCases: [
        'Loading Excel-maintained data into a JavaScript or Python app',
        'Feeding spreadsheet content to a REST/GraphQL API',
        'Seeding a database from a non-technical owner\'s workbook',
        'Generating fixtures for unit and integration tests',
        'Powering charts and dashboards in front-end apps',
      ],
      troubleshooting: [
        { problem: 'Dates appear as numbers like 45200', solution: 'Excel stores dates as serial numbers. Toggle the "convert dates to ISO 8601" option so 45200 becomes "2023-09-26".' },
        { problem: 'Some rows are missing from the JSON', solution: 'Hidden rows or filtered rows are skipped if "include hidden rows" is off. Re-run with that option enabled.' },
        { problem: 'Duplicate keys in the output', solution: 'Your header row has duplicate column names. Rename them in Excel — JSON object keys must be unique.' },
      ],
    },
  },
  'json-to-excel': {
    exampleOutput: {
      input: 'API response array (250 user objects, 12 fields each)',
      output: 'users.xlsx — header row + 250 rows, columns auto-sized',
      description: 'Real .xlsx workbook. Nested objects are flattened with dot-notation column headers; arrays are JSON-stringified into a single cell.',
    },
    seo: {
      intro: 'Convert any JSON array of objects into a downloadable Excel workbook (.xlsx) instantly. The tool flattens one level of nesting using dot-notation headers (`user.email` → column `user.email`), preserves numeric and boolean types, and lets you reorder or rename columns before exporting.',
      examples: [
        { title: 'REST API response → finance team', body: 'A 5,000-element JSON array from your `/orders` endpoint is converted with one click for the finance lead who only opens Excel.' },
        { title: 'Nested objects', body: '`{ user: { name, email } }` flattens to columns `user.name` and `user.email` — no manual reshaping.' },
        { title: 'Mixed types', body: 'Numbers stay numeric, booleans become TRUE/FALSE, ISO dates can be auto-converted to Excel date cells via a toggle.' },
      ],
      useCases: [
        'Sharing API output with non-developers',
        'Generating downloadable reports from a SaaS dashboard',
        'Backing up JSON data into a tangible spreadsheet',
        'Importing API data into accounting / CRM systems that only accept Excel',
        'Auditing a JSON payload visually before pushing to production',
      ],
      troubleshooting: [
        { problem: 'Array fields show as `[object Object]` or raw JSON', solution: 'Excel cells hold one value — nested arrays are JSON-stringified by design. Pre-flatten the array in JSON before converting, or use the "expand arrays as rows" option.' },
        { problem: 'Column order is unpredictable', solution: 'JSON objects don\'t guarantee key order across rows. Use the column reorder dialog to pin the columns you want, then re-export.' },
        { problem: 'Numbers stored as strings stay as text', solution: 'JSON `"42"` is a string. Wrap numeric values without quotes (`42`) in your source, or enable the "coerce numeric-looking strings" toggle.' },
      ],
    },
  },
  'excel-to-xml': {
    exampleOutput: {
      input: 'products.xlsx (Sheet1, 320 SKUs × 6 columns)',
      output: 'products.xml — <rows><row><sku>…</sku>…</row></rows>',
      description: 'Well-formed XML 1.0 document. Header row becomes element tag names; cell types are preserved as XML Schema datatypes when the option is on.',
    },
    seo: {
      intro: 'Convert Excel sheets into well-formed XML in seconds — useful for legacy systems that only accept XML imports (SAP, Oracle EBS, older e-invoicing endpoints). Choose your root and row element names, opt into XSD datatype hints, and the converter handles XML escaping (&, <, >, quotes) automatically.',
      examples: [
        { title: 'SAP master-data load', body: 'Material master records from an Excel template are converted to the XML envelope SAP expects, with custom `<material>` / `<materials>` tag names.' },
        { title: 'E-invoice payload', body: 'A 1-row invoice template becomes the XML body for an electronic-invoicing API — special characters in addresses are escaped safely.' },
        { title: 'CDATA for HTML descriptions', body: 'Product descriptions containing HTML are wrapped in CDATA sections via a toggle, avoiding escape clutter.' },
      ],
      useCases: [
        'Feeding spreadsheet data to legacy ERP/CRM systems',
        'Generating XML payloads for B2B EDI exchanges',
        'Producing XML config files from a maintained spreadsheet',
        'Converting test fixtures for XML-based APIs',
        'Migrating data into XML-based document stores',
      ],
      troubleshooting: [
        { problem: 'Output XML fails XSD validation', solution: 'Header names are used as element tags — they must be valid XML names (no spaces, no leading digits). Rename headers like `Order Date` → `order_date`.' },
        { problem: 'Special characters appear garbled', solution: 'Save the source workbook as UTF-8 .xlsx (the modern default). Legacy .xls in Windows-1252 may mis-encode accented characters.' },
        { problem: 'Importer rejects the file as "not a document"', solution: 'Toggle "include XML declaration" so the file starts with `<?xml version="1.0" encoding="UTF-8"?>` — some strict parsers require it.' },
      ],
    },
  },
  'excel-to-sql': {
    exampleOutput: {
      input: 'customers.xlsx (5,400 rows × 8 columns)',
      output: 'customers.sql — CREATE TABLE + 5,400 INSERT statements',
      description: 'Ready-to-run SQL script. Column types are inferred (INTEGER, DECIMAL, VARCHAR, DATE) and values are properly escaped for the chosen dialect.',
    },
    seo: {
      intro: 'Convert Excel data into SQL INSERT statements (or a full CREATE TABLE + INSERT script) for MySQL, PostgreSQL, SQLite, or SQL Server. The converter infers column types, escapes quotes and special characters, and lets you choose batch INSERT size — handy for seeding databases or quickly importing client data.',
      examples: [
        { title: 'Seed a dev database', body: 'A 2,000-row reference workbook becomes a `seed.sql` script the team can run with `psql -f seed.sql` to populate a fresh DB.' },
        { title: 'PostgreSQL-specific output', body: 'Pick PostgreSQL and dates emit as `DATE \'2024-03-15\'`; booleans as TRUE/FALSE — no manual fixup before running.' },
        { title: 'Batched INSERTs for speed', body: 'Group 500 rows per INSERT statement for 10× faster import compared to one INSERT per row.' },
      ],
      useCases: [
        'Migrating Excel-maintained data into a production database',
        'Seeding dev / test / staging databases from a spreadsheet',
        'Generating SQL fixtures for automated tests',
        'Importing client data delivered as Excel files',
        'Bootstrapping reference / lookup tables',
      ],
      troubleshooting: [
        { problem: 'Apostrophes in text cells break the SQL', solution: 'The tool escapes single quotes as `\'\'` by default. If you see syntax errors, your source has unbalanced quotes — also check the dialect setting, since SQL Server uses different escaping.' },
        { problem: 'Numeric IDs imported as text', solution: 'In Excel, change the column format to Number before exporting. Or override the column type to INTEGER in the type panel.' },
        { problem: 'NULL vs empty string confusion', solution: 'Choose how blanks are emitted — `NULL` (default) or `\'\'`. NULL is correct for missing values; empty string for "deliberately empty".' },
      ],
    },
  },
  'merge-excel': {
    exampleOutput: {
      input: '12 monthly sales workbooks (Jan-Dec 2025), each with a Sales sheet',
      output: 'consolidated.xlsx — one workbook, sheets renamed Jan-Dec, OR a single combined Sales sheet',
      description: 'Merge mode is your choice: keep each input as a separate sheet, or stack all rows into one consolidated sheet with a "source file" column.',
    },
    seo: {
      intro: 'Combine multiple Excel workbooks into a single .xlsx file — choose between "append as new sheets" (each source becomes a tab) or "stack rows" (all sheets concatenated into one master sheet). Everything runs locally; no uploads, no row limits beyond browser memory.',
      examples: [
        { title: 'Monthly → yearly consolidation', body: 'Twelve monthly sales workbooks merge into one annual file with 12 sheets, ready for pivot-table analysis.' },
        { title: 'Multi-region rollup', body: 'Five regional workbooks (each with identical column layout) stack into one 50,000-row master sheet with a region column added automatically.' },
        { title: 'Header alignment', body: 'When sheets have slightly different column orders, enable "align by header name" so columns line up correctly even if positions differ.' },
      ],
      useCases: [
        'Monthly/quarterly financial consolidation',
        'Merging departmental survey responses into one workbook',
        'Combining client deliverables before reporting',
        'Stacking exported reports from multiple tools (Stripe, HubSpot, etc.)',
        'Building a single-source-of-truth file from many small ones',
      ],
      troubleshooting: [
        { problem: 'Sheet names get suffixed (Sales, Sales (2), Sales (3))', solution: 'Two source files had a sheet with the same name. The merger appends `(n)` to avoid overwriting. Rename source sheets first if you want clean names.' },
        { problem: 'Columns misalign in stacked mode', solution: 'Enable "align by header name" — by default, stacking goes by column position. Header alignment matches `Email` to `Email` regardless of column order.' },
        { problem: 'Formulas disappear after merge', solution: 'Cell values are merged, but formulas referencing other sheets break. Convert formulas to values (Paste Special → Values) in each source before merging.' },
      ],
    },
  },
  'word-to-txt': {
    exampleOutput: {
      input: 'meeting-notes.docx (8 pages, headings + bullet lists + 1 table)',
      output: 'meeting-notes.txt — plain UTF-8, paragraphs separated by blank lines, lists kept as `- item`',
      description: 'Headings stay on their own line, bullet/numbered lists are flattened to `- item` / `1. item`, tables become TSV rows. All formatting is stripped.',
    },
    seo: {
      intro: 'Extract every word from a .docx into a clean UTF-8 plain-text file — useful for grep-friendly archives, feeding LLMs, version control, or pasting into systems that reject formatted text. Lists, headings, and tables are preserved structurally even though all visual formatting is gone.',
      examples: [
        { title: 'LLM context dump', body: 'A 40-page contract is reduced to a token-efficient plain-text file you can paste into ChatGPT or Claude without burning tokens on formatting noise.' },
        { title: 'Searchable archive', body: 'Convert hundreds of .docx files to .txt for fast `grep`/`ripgrep` searches across the entire archive.' },
        { title: 'Version-controlled writing', body: 'Storing drafts as .txt in git produces meaningful diffs — .docx is a zip of XML, so git diffs are useless.' },
      ],
      useCases: [
        'Preparing documents for LLM ingestion',
        'Building a searchable plain-text corpus',
        'Tracking writing drafts in version control',
        'Stripping tracked changes and comments before sharing',
        'Feeding text into command-line pipelines (awk, sed, grep)',
      ],
      troubleshooting: [
        { problem: 'Vietnamese / CJK characters look broken', solution: 'Open the .txt in UTF-8 mode. Notepad on older Windows defaults to ANSI — switch to Notepad++ or VS Code, both auto-detect UTF-8.' },
        { problem: 'Tables flattened into one long line', solution: 'Toggle "tables as TSV" so each row becomes a tab-separated line. Default mode collapses cells with spaces; TSV is better for re-importing into Excel.' },
        { problem: 'Embedded images are gone', solution: 'That\'s expected — plain text holds no images. Use the Extract Images from Word tool if you need them separately.' },
      ],
    },
  },
  'merge-word': {
    exampleOutput: {
      input: '6 chapter .docx files (chapters 1-6 of a manuscript)',
      output: 'manuscript.docx — single document, chapters separated by page breaks',
      description: 'Real .docx output. Inserts a page break between sources by default and preserves each source\'s styles (Heading 1, Normal, etc.) intact.',
    },
    seo: {
      intro: 'Combine multiple Word documents into one .docx without losing formatting, styles, or images. The merger inserts a page break between sources by default, keeps each document\'s heading hierarchy, and produces a real Microsoft Word file you can keep editing afterwards.',
      examples: [
        { title: 'Book manuscript', body: 'Six chapter files (one per .docx) merge into a single manuscript ready for an editor — page breaks separate chapters, heading levels stay consistent.' },
        { title: 'Proposal assembly', body: 'Cover letter + intro + 3 case studies + pricing → one polished proposal document, in order.' },
        { title: 'Class notes', body: 'A semester\'s worth of weekly note files becomes one searchable, scrollable document for revision.' },
      ],
      useCases: [
        'Assembling book chapters into a manuscript',
        'Combining proposal/SOW sections written by different authors',
        'Consolidating weekly meeting notes into a quarter recap',
        'Merging legal contract clauses into a single agreement',
        'Assembling student assignments into one submission',
      ],
      troubleshooting: [
        { problem: 'Headings look inconsistent after merge', solution: 'Each source defined Heading 1 differently. In the output, redefine Heading 1 once (Home → Styles) and Word will normalise all sources.' },
        { problem: 'Images shifted or got cropped', solution: 'Switch image anchoring from "in line with text" to "wrap text" in the source files before merging — floating images survive merges better.' },
        { problem: 'Page breaks too aggressive', solution: 'Toggle the page-break-between-sources option off and the merger will only insert a section break, which respects the next paragraph\'s before-break setting.' },
      ],
    },
  },
  'split-word': {
    exampleOutput: {
      input: 'annual-report.docx (84 pages, 6 chapter headings)',
      output: '6 .docx files — one per chapter, named after the heading text',
      description: 'Splits at Heading 1 by default (configurable). Each output .docx preserves the original styles and inherits the heading text as its filename.',
    },
    seo: {
      intro: 'Split a long Word document into multiple smaller .docx files by heading level, page count, or fixed page range. The original styles and images survive; each output is a real .docx you can hand off to a different reviewer or upload to a CMS individually.',
      examples: [
        { title: 'Annual report by chapter', body: 'An 80-page report splits on Heading 1 into 6 chapter files, each named after the heading text — easy to route to different stakeholders.' },
        { title: 'Manual into modules', body: 'A 200-page training manual splits every 20 pages so each module fits inside a learning-management system\'s upload limit.' },
        { title: 'Single-page extracts', body: 'Need only pages 12-15 of a 100-page document? Use page-range mode and download a 4-page .docx.' },
      ],
      useCases: [
        'Distributing chapters of a report to different reviewers',
        'Breaking up a long manual into LMS-uploadable modules',
        'Extracting specific page ranges from a contract',
        'Splitting compiled drafts back into per-author sections',
        'Reducing file size for email-attachment limits',
      ],
      troubleshooting: [
        { problem: 'Wrong split points — splits inside a paragraph', solution: 'Page-mode splits at page boundaries, which can land mid-paragraph if a long paragraph straddles a page. Use heading mode instead for clean breaks.' },
        { problem: 'Output files have weird filenames', solution: 'Heading text becomes the filename; if a heading contains slashes, colons, or other forbidden filename characters, the tool replaces them with `_`. Rename headings for cleaner output.' },
        { problem: 'Page count differs after split', solution: 'Each output .docx renders with default margins/font, which may flow slightly differently. Open in Word and the page counts re-flow — the content is intact.' },
      ],
    },
  },
  'word-word-counter': {
    exampleOutput: {
      input: 'thesis-draft.docx (32 pages)',
      output: 'Words: 9,847 • Characters (no spaces): 51,302 • Sentences: 612 • Paragraphs: 248 • Reading time: ~39 min',
      description: 'Live statistics for a .docx: words, characters, sentences, paragraphs, average words per sentence, estimated reading time, and Flesch reading-ease score.',
    },
    seo: {
      intro: 'Get accurate word, character, sentence, paragraph, and reading-time counts for any .docx — without opening Microsoft Word. Includes Flesch reading-ease score for readability checks, and lets you exclude headers, footers, footnotes, or comments from the count if you only care about the body text.',
      examples: [
        { title: 'Thesis word-limit check', body: 'Compare the body-only count against your university\'s strict 10,000-word limit, with footnotes excluded.' },
        { title: 'Freelance billing', body: 'Charge per-word translation work; the counter gives you the exact billable word count from the client\'s .docx.' },
        { title: 'Readability audit', body: 'Aim for Flesch 60-70 (plain English). The tool flags passages above grade-12 reading level so you can simplify them.' },
      ],
      useCases: [
        'Academic word-limit verification (thesis, dissertation, journal article)',
        'Translation and freelance writing billing',
        'SEO content length validation',
        'Readability tuning for marketing copy',
        'NaNoWriMo / novel-draft progress tracking',
      ],
      troubleshooting: [
        { problem: 'Count differs from Microsoft Word', solution: 'Word counts hyphenated words as one; some tools count them as two. Check the "hyphen handling" setting. Also confirm footnote/header inclusion matches between the two tools.' },
        { problem: 'Reading-ease score seems wrong for non-English text', solution: 'Flesch is English-only. For Vietnamese, French, etc., word/character counts are accurate but the readability score is not meaningful.' },
        { problem: 'Tracked changes inflate the count', solution: 'Accept or reject all tracked changes in Word first, or toggle "ignore tracked-change deletions" so the counter ignores struck-through text.' },
      ],
    },
  },
  'extract-images-word': {
    exampleOutput: {
      input: 'product-catalog.docx (24 pages, 47 product photos embedded)',
      output: 'images.zip — 47 files at original resolution (image1.jpg, image2.png…)',
      description: 'All embedded images are extracted at their original resolution and format — no re-encoding, no quality loss. Delivered as a ZIP for one-click download.',
    },
    seo: {
      intro: 'Extract every image embedded in a Word document at its original resolution and format. Each image is recovered byte-for-byte from the .docx archive (which is really a ZIP of XML and media), so there is zero quality loss — exactly the file the author dropped in.',
      examples: [
        { title: 'Recover catalog photos', body: 'A 24-page product catalog gives back all 47 product photos at full resolution for re-use on a website.' },
        { title: 'Slide reuse', body: 'Diagrams pasted into a Word doc by a co-worker can be pulled out and reused in your own presentation without re-screenshotting.' },
        { title: 'Cropped vs. original', body: 'Word displays a cropped view of the original. The extractor returns the uncropped source — useful when you need the full image back.' },
      ],
      useCases: [
        'Recovering original artwork from a finalised document',
        'Reusing diagrams across slide decks',
        'Migrating Word content to a CMS that needs separate image files',
        'Auditing what images a third party embedded in a doc',
        'Building an image library from a long manual',
      ],
      troubleshooting: [
        { problem: 'Some images look low-resolution', solution: 'The author inserted a screenshot/compressed version, not a high-res original. Word doesn\'t magically upscale — what you extract is what was embedded.' },
        { problem: 'Image filenames are generic (image1, image2…)', solution: 'Word doesn\'t store original filenames inside .docx. The tool numbers them in document order. Rename them after download.' },
        { problem: 'A photo appears multiple times in the ZIP', solution: 'The same image was embedded multiple times in the doc (e.g. as a header on each page). Use the "deduplicate identical files" option to keep only one copy.' },
      ],
    },
  },
  'pdf-page-counter': {
    exampleOutput: {
      input: 'contract.pdf',
      output: 'Pages: 42 • File size: 3.1 MB • Encrypted: No • PDF version: 1.7',
      description: 'Instant page count plus useful metadata (file size, PDF version, encryption status, average pages per MB).',
    },
    seo: {
      intro: 'Get an accurate page count for any PDF — including encrypted, scanned, or hybrid PDFs — without opening it in Adobe Reader. The counter also reports file size, PDF version, encryption flag, and average pages per MB, so you can quickly judge whether a file fits an email attachment limit or a print-shop quote.',
      examples: [
        { title: 'Print-shop quoting', body: 'Drop 10 PDFs in at once and get a list of page counts to feed into the print quote without opening each file.' },
        { title: 'Encrypted contracts', body: 'Even password-protected PDFs return their page count (you don\'t need to unlock to read metadata).' },
        { title: 'Email-limit check', body: 'See file size and page count side-by-side to decide if the PDF needs splitting before sending.' },
      ],
      useCases: [
        'Print-shop estimating',
        'Bulk-checking page counts before merging or splitting',
        'Validating page counts in legal/regulatory submissions',
        'Auditing whether a PDF meets a "max N pages" rule',
        'Programmatic file triage for downstream pipelines',
      ],
      troubleshooting: [
        { problem: 'Count seems off for a scanned PDF', solution: 'The counter reports the actual page count in the PDF. If a single scan was split into multiple PDFs and re-merged, the count is still accurate — open the file to verify.' },
        { problem: 'Encrypted PDF returns "0 pages"', solution: 'A few PDFs encrypt even their metadata. Unlock with a password (PDF Unlock tool) first, then recount.' },
        { problem: 'Two PDFs with the same content show different counts', solution: 'Different rendering — one may have blank trailing pages from a print-to-PDF driver. Strip blank pages with the Split PDF tool.' },
      ],
    },
  },
  'extract-text-pdf': {
    exampleOutput: {
      input: 'whitepaper.pdf (28 pages, mixed text + figures)',
      output: 'whitepaper.txt — full UTF-8 text, paragraphs preserved, page numbers as `--- Page N ---`',
      description: 'Extracted text in reading order with optional page markers. Works for text-based PDFs; scanned PDFs need OCR first.',
    },
    seo: {
      intro: 'Extract all text from a PDF into a clean .txt or .md file — paragraphs in reading order, optional page-break markers, and UTF-8 throughout so non-Latin scripts (Vietnamese, CJK, Arabic) come out intact. Ideal for feeding LLMs, building a searchable archive, or copying content out of a locked PDF.',
      examples: [
        { title: 'LLM context preparation', body: 'A 200-page report becomes a token-efficient .txt you can paste into Claude/GPT for summarisation.' },
        { title: 'Searchable research archive', body: 'Extract text from hundreds of academic PDFs to make the whole library `grep`-able.' },
        { title: 'Bypassing copy restrictions', body: 'Some PDFs disable copy-paste; extraction reads the underlying text stream regardless (you still own the file or have rights).' },
      ],
      useCases: [
        'Feeding PDFs to LLMs for summarisation/QA',
        'Building searchable text corpora from PDFs',
        'Migrating PDF content into a CMS',
        'Cross-referencing facts across multiple documents',
        'Translating large PDFs (paste text into a translator)',
      ],
      troubleshooting: [
        { problem: 'Output is empty or gibberish', solution: 'The PDF is scanned images, not text. Use an OCR tool first (Tesseract or an OCR-capable PDF tool), then re-extract.' },
        { problem: 'Two-column layouts mix lines together', solution: 'Enable "respect columns" mode — the default linear extraction can interleave columns. Column mode walks each column top-to-bottom first.' },
        { problem: 'Vietnamese / CJK characters are mojibake', solution: 'The PDF embeds the font but uses custom encoding. Toggle "use Unicode mapping" (cmap-aware) — most modern PDFs ship a `/ToUnicode` table.' },
      ],
    },
  },
  'extract-images-pdf': {
    exampleOutput: {
      input: 'catalogue.pdf (48 pages, ~120 product photos)',
      output: 'images.zip — 120 files at embedded resolution (page-N-img-M.jpg/png)',
      description: 'All raster images are extracted at their original resolution and format. Vector graphics and text are skipped — use a PDF-to-image tool if you want page screenshots.',
    },
    seo: {
      intro: 'Pull every embedded raster image out of a PDF at its original resolution. The extractor reads the PDF\'s raw image streams — no re-rendering, no quality loss. Use this when you need the source photos back from a finalised PDF, or when migrating a catalog into a website.',
      examples: [
        { title: 'Catalog image recovery', body: 'A 48-page product catalog yields ~120 full-resolution product photos — exactly the JPGs the designer dropped in.' },
        { title: 'Auditing a third-party document', body: 'See every image in a long PDF at a glance to spot copyright violations or branding issues.' },
        { title: 'CMS migration', body: 'Move PDF content to a web CMS by extracting images separately and re-pairing them with the text.' },
      ],
      useCases: [
        'Recovering original images from a finalised PDF',
        'Migrating PDF brochures to a website / CMS',
        'Building a slide deck from PDF assets',
        'Auditing visual content in long documents',
        'Reusing diagrams without re-screenshotting pages',
      ],
      troubleshooting: [
        { problem: 'Images look smaller than they did in the PDF', solution: 'PDFs scale images to page coordinates; the extracted file is the original embedded resolution, which may be smaller. Use the PDF-to-image tool if you want page-sized renders.' },
        { problem: 'Same image extracted many times', solution: 'A logo or background that repeats on every page is embedded once but referenced many times. Enable "deduplicate by hash" to keep only one copy.' },
        { problem: 'Vector logos missing from the ZIP', solution: 'Vectors aren\'t raster images. Use a PDF-to-SVG tool or extract them via Illustrator — this tool only handles raster.' },
      ],
    },
  },
  'pdf-to-excel': {
    exampleOutput: {
      input: 'bank-statement.pdf (12 pages of tabular transactions)',
      output: 'bank-statement.xlsx — one sheet per page, columns auto-detected (Date, Description, Amount, Balance)',
      description: 'Tables are detected by column geometry and reconstructed in Excel with proper number/date types. Non-tabular text is skipped or placed on a separate sheet.',
    },
    seo: {
      intro: 'Convert tables inside a PDF into editable Excel sheets. The converter uses column-geometry detection (not raw text extraction) so even tables without visible borders come out aligned. Numbers, dates, and currencies are preserved as proper Excel types — not text — so SUM() and filters work immediately.',
      examples: [
        { title: 'Bank-statement reconciliation', body: 'A 12-page PDF statement becomes an Excel workbook ready for reconciliation against your accounting system.' },
        { title: 'Multi-table report', body: 'A research PDF with 8 separate tables outputs one Excel sheet per table, named by detected caption.' },
        { title: 'Currency-aware cells', body: 'Cells like `$1,234.56` and `€987,65` are parsed into numeric cells with the appropriate currency format applied.' },
      ],
      useCases: [
        'Reconciling bank/credit-card statements',
        'Extracting financial reports from quarterly PDFs',
        'Migrating data trapped in PDF reports into Excel',
        'Pulling lab/test results out of PDF deliverables',
        'Quickly editing tables that arrived as PDFs',
      ],
      troubleshooting: [
        { problem: 'Columns are merged or misaligned', solution: 'The PDF\'s columns are too close together for geometry detection. Try the "force grid" mode and set the column count manually.' },
        { problem: 'Numbers come out as text', solution: 'The PDF used commas as thousands separators that the parser couldn\'t auto-detect. Set the locale (US / EU) in advanced options before converting.' },
        { problem: 'Scanned PDF produces empty cells', solution: 'OCR the PDF first — this tool reads the text layer, which scans don\'t have. Run an OCR pass, then re-convert.' },
      ],
    },
  },
  'pdf-to-csv': {
    exampleOutput: {
      input: 'invoice-batch.pdf (50 invoices, one table per page)',
      output: 'invoices.csv — 50 rows merged from each page\'s table, header row preserved once',
      description: 'Each detected table on each page is appended to one CSV. The first header row is kept; subsequent identical headers are skipped automatically.',
    },
    seo: {
      intro: 'Pull tables out of any PDF and download them as a CSV — comma, semicolon, tab, or pipe delimited. Useful for piping PDF tables into command-line tools, databases, or any system that prefers CSV over Excel. Column geometry detection means borderless tables still come out aligned.',
      examples: [
        { title: 'Batch invoice processing', body: '50-page invoice PDF becomes one CSV the bookkeeping software can ingest in a single import.' },
        { title: 'Data-science pipeline', body: 'Drop the resulting CSV into pandas (`pd.read_csv`) for instant analysis — no manual data entry.' },
        { title: 'Quoted multi-line cells', body: 'Cell content that spans multiple PDF lines is joined with spaces and properly quoted in CSV per RFC 4180.' },
      ],
      useCases: [
        'Feeding PDF tables into data-analysis pipelines (pandas, R, Power BI)',
        'Bulk-importing PDF reports into a database',
        'Preparing PDF data for command-line tools (`csvkit`, `xsv`)',
        'Sharing PDF tables with collaborators using non-Office tools',
        'Backing up PDF reports as text-based archives',
      ],
      troubleshooting: [
        { problem: 'Wrong delimiter splits cells', solution: 'Pick a delimiter that does NOT appear inside your cells. If addresses contain commas, use tab or pipe instead.' },
        { problem: 'Some rows have fewer columns than expected', solution: 'The PDF\'s table had merged cells or trailing blanks. Enable "pad short rows" so every row has the same column count as the header.' },
        { problem: 'Special characters look wrong in CSV', solution: 'Open the CSV as UTF-8. Excel\'s default CSV import on Windows uses Windows-1252; use Data → From Text/CSV and pick UTF-8.' },
      ],
    },
  },
  'pdf-to-ppt': {
    exampleOutput: {
      input: 'report.pdf (24 pages)',
      output: 'report.pptx — 24 slides (one per page) at 16:9, page rendered as a high-res background image',
      description: 'Each PDF page becomes one slide. Page contents are rendered as a background image (faithful to the PDF) with editable text boxes overlaid where text is detected.',
    },
    seo: {
      intro: 'Convert a PDF into a PowerPoint deck — one slide per page. Each page is rendered as a high-resolution image (so the layout looks identical to the original) with detected text overlaid as editable text boxes. Great for reusing a PDF in a presentation or annotating someone else\'s document on screen.',
      examples: [
        { title: 'Annotate a research paper live', body: 'Open a paper as PowerPoint and add arrows, callouts, and notes during a journal-club meeting without altering the original PDF.' },
        { title: 'Repurpose a report for a webinar', body: 'A 20-page client report becomes a 20-slide deck — present directly instead of screen-sharing a PDF reader.' },
        { title: 'Editable text overlay', body: 'Text boxes mirror PDF text positions, so you can correct a typo by editing the slide before showing it.' },
      ],
      useCases: [
        'Repurposing PDFs as presentation decks',
        'Live-annotating documents during meetings',
        'Building slide bases from existing PDF reports',
        'Migrating archived presentations stuck in PDF form',
        'Layering speaker notes onto a third-party PDF',
      ],
      troubleshooting: [
        { problem: 'Slides look blurry on a 4K display', solution: 'Increase render DPI (default 150) to 300 in advanced options. The trade-off is a larger .pptx file size.' },
        { problem: 'Editable text overlay misaligned', solution: 'The PDF embeds a font PowerPoint doesn\'t have, so text reflows on the slide. Toggle "lock text positions" or convert to non-editable raster only.' },
        { problem: 'Aspect ratio looks wrong', solution: 'PDF pages are usually A4 / Letter (portrait); slides are 16:9 (landscape). Choose "match PDF" to use the same aspect, or "fit to slide" to add side bands.' },
      ],
    },
  },
  'merge-pdf': {
    exampleOutput: {
      input: '8 PDFs (resumes, certificates, work samples — total 35 pages)',
      output: 'application.pdf — 35 pages in chosen order, all bookmarks and metadata preserved',
      description: 'Real merged PDF (not a ZIP). Drag-and-drop reordering, optional bookmark generation per source file, and metadata from the first PDF by default.',
    },
    seo: {
      intro: 'Combine multiple PDF files into a single document with drag-and-drop ordering, no file-count limit, and zero quality loss. Each source contributes its real pages — no re-rendering, no compression — so a merged PDF is byte-for-byte equivalent to the originals stitched together. Optional bookmarks make navigation easy.',
      examples: [
        { title: 'Job application bundle', body: 'Resume + cover letter + 3 work samples + 2 reference letters merge into one `application.pdf` for a single upload.' },
        { title: 'Legal exhibit binder', body: 'Twenty-five exhibits combine into one PDF with bookmarks named after each source — judge can navigate to any exhibit instantly.' },
        { title: 'Scanned-paper archive', body: 'Daily scans throughout a month merge into one monthly archive PDF for clean filing.' },
      ],
      useCases: [
        'Submitting multi-document applications (jobs, grants, admissions)',
        'Building legal exhibit binders',
        'Archiving daily/weekly scans as a single file',
        'Combining chapters or reports from multiple authors',
        'Producing single-PDF deliverables for clients',
      ],
      troubleshooting: [
        { problem: 'Output file is huge', solution: 'Sources were already large. Run the merged file through a PDF compressor afterwards. The merger doesn\'t re-encode (by design) so it can\'t shrink the source pages.' },
        { problem: 'Bookmarks missing', solution: 'Source PDFs without internal bookmarks contribute nothing. Toggle "create one bookmark per source file" so each file gets a top-level bookmark labelled with its filename.' },
        { problem: 'Form fields stop working after merge', solution: 'Two sources used the same field names — the merge flattens duplicates. Rename fields uniquely in each source PDF, or flatten the fields before merging.' },
      ],
    },
  },
  'split-pdf': {
    exampleOutput: {
      input: 'annual-report.pdf (84 pages)',
      output: 'Multiple files: pages 1-12, 13-32, 33-58, 59-84 (or 84 single-page PDFs)',
      description: 'Split modes: by page range, every N pages, at bookmarks, or one file per page. Each output is a real PDF with the original page content intact.',
    },
    seo: {
      intro: 'Split a PDF into smaller files by page range, at every Nth page, at bookmarks, or one PDF per page. The original page content is preserved exactly — no rasterising, no quality loss. Useful when only a few pages of a big PDF are needed, or for breaking a long document into emailable chunks.',
      examples: [
        { title: 'Extract one chapter', body: 'Pages 33-58 of an 84-page report download as a 26-page PDF — the rest is discarded.' },
        { title: 'One file per page', body: 'A multi-page invoice batch splits into 50 single-page invoice PDFs ready for individual customer dispatch.' },
        { title: 'Split at bookmarks', body: 'A PDF with chapter bookmarks splits into one file per chapter automatically — the bookmark name becomes the filename.' },
      ],
      useCases: [
        'Extracting specific pages from a large PDF',
        'Distributing invoices/payslips individually',
        'Breaking long PDFs into emailable chunks',
        'Splitting reports by chapter for parallel review',
        'Isolating sensitive pages before sharing the rest',
      ],
      troubleshooting: [
        { problem: 'Page numbers in the output don\'t match the source', solution: 'Page numbering shown is positional (1, 2, 3…), not the PDF\'s "displayed" page numbers (which may include roman-numeral front matter). Count from page 1 of the file, not the printed cover.' },
        { problem: 'Bookmark split produced one huge file and several tiny ones', solution: 'Only top-level bookmarks split by default. Enable "split at heading level 2" if your PDF\'s structure is deeper.' },
        { problem: 'Form fields don\'t work after splitting', solution: 'Form data references are kept, but if a form spans pages and you split mid-form, fields on the other side are gone. Keep all form pages together with custom ranges.' },
      ],
    },
  },
  'ppt-slide-counter': {
    exampleOutput: {
      input: 'pitch-deck.pptx',
      output: 'Slides: 42 • Slide size: 13.33×7.5 in (16:9) • Hidden slides: 3 • Images: 78 • Speaker-note pages: 36',
      description: 'Counts visible vs. hidden slides, image count, speaker-note pages, embedded media, and slide-master count.',
    },
    seo: {
      intro: 'Get a fast inventory of any .pptx — total slides, hidden slides, image count, speaker-note coverage, embedded videos/audio, and slide-master count — without opening PowerPoint. Useful for QA-ing decks before sending, estimating presentation length, or auditing what assets a deck includes.',
      examples: [
        { title: 'QA before client send', body: 'Spot 3 hidden slides that shouldn\'t ship and 4 slides without speaker notes that need them.' },
        { title: 'Time estimation', body: 'At ~2 min/slide, a 42-slide deck = ~85 min — handy for fitting a webinar into a 90-minute slot.' },
        { title: 'Media audit', body: 'Confirm a deck contains the 6 expected embedded videos before the offsite venue (no Wi-Fi available).' },
      ],
      useCases: [
        'QA-ing decks before delivery (hidden slides, missing notes)',
        'Estimating presentation duration',
        'Auditing media assets in a deck',
        'Bulk-checking slide counts across a folder of decks',
        'Verifying compliance with "max N slides" submission rules',
      ],
      troubleshooting: [
        { problem: 'Slide count differs from PowerPoint', solution: 'PowerPoint counts hidden slides in the total; the counter reports visible/hidden separately. Add the two to match.' },
        { problem: 'Speaker-note count seems low', solution: 'Empty notes (with the placeholder text only) aren\'t counted as real notes. The counter looks at note length > 0 characters.' },
        { problem: 'Image count includes background art', solution: 'Slide-master backgrounds count as images. Toggle "exclude master images" to count only content images.' },
      ],
    },
  },
  'extract-text-ppt': {
    exampleOutput: {
      input: 'training.pptx (38 slides)',
      output: 'training.txt — title + body + notes per slide, separated by `--- Slide N: <title> ---`',
      description: 'Slide title, all text-box content, and speaker notes are extracted in slide order. Optionally exclude masters/hidden slides/notes.',
    },
    seo: {
      intro: 'Pull all text out of a PowerPoint file — slide titles, body text, speaker notes, and (optionally) hidden slides or master text — into a clean .txt or .md file. Each slide is delimited by a header line so you can easily diff, search, or feed the content to an LLM for summarisation.',
      examples: [
        { title: 'Generate a written summary', body: 'A 50-slide training deck becomes a 4-page text outline that a trainee can read in 10 minutes.' },
        { title: 'Searchable speaker notes', body: 'Extract notes only to grep for promises made in last year\'s sales decks.' },
        { title: 'Translation prep', body: 'Pull all text into one file, translate it, then re-import to the deck — no clicking through 50 slides.' },
      ],
      useCases: [
        'Feeding decks to LLMs for summarisation',
        'Building searchable archives of presentation content',
        'Extracting speaker notes for transcript-style sharing',
        'Preparing slide text for translation',
        'Auditing whether decks contain specific keywords',
      ],
      troubleshooting: [
        { problem: 'Some slides missing from the output', solution: 'Hidden slides are excluded by default. Toggle "include hidden slides" if you need them.' },
        { problem: 'Text inside images / WordArt missing', solution: 'The extractor reads text frames, not pixels. Run OCR on slide screenshots if you need text trapped inside images.' },
        { problem: 'Tables collapsed into a single paragraph', solution: 'Toggle "tables as TSV" so each cell becomes tab-separated. Default mode joins cells with spaces.' },
      ],
    },
  },
  'extract-images-ppt': {
    exampleOutput: {
      input: 'product-launch.pptx (28 slides, 65 embedded images)',
      output: 'images.zip — 65 files at original resolution (slide-3-img-1.png, slide-3-img-2.jpg…)',
      description: 'All embedded media is extracted at original resolution and format. Filenames include the slide number where each asset appears.',
    },
    seo: {
      intro: 'Recover every image embedded in a PowerPoint deck at its original resolution. The .pptx format is a ZIP of XML and media, so extraction is lossless — exactly the JPG/PNG/SVG the designer dropped in. Filenames include the slide number so it\'s easy to see where each asset was used.',
      examples: [
        { title: 'Reclaim original artwork', body: 'A product-launch deck gives back all 65 product photos at full resolution for re-use across web and print.' },
        { title: 'Re-screenshot avoidance', body: 'Diagrams pasted into a slide can be pulled out and reused without re-screenshotting.' },
        { title: 'Track asset usage', body: 'Filenames like `slide-12-img-2.png` show exactly which slide each image came from.' },
      ],
      useCases: [
        'Recovering original artwork from a finalised deck',
        'Building an asset library from a deck',
        'Reusing diagrams across other documents',
        'Auditing what images a third party embedded',
        'Migrating slide content to a CMS that needs separate images',
      ],
      troubleshooting: [
        { problem: 'Images look smaller than on the slide', solution: 'PowerPoint scales images to slide dimensions; the extracted file is the original embedded size. The slide rendered it larger via stretching.' },
        { problem: 'Background images on every slide appear many times', solution: 'Same image referenced on multiple slides creates multiple references but usually one stored copy. Enable "deduplicate by hash" to keep one copy.' },
        { problem: 'Embedded video files are in the ZIP too', solution: 'Default behaviour. Filter to images only via the file-type checkbox if you don\'t want video/audio.' },
      ],
    },
  },
  'ppt-to-images': {
    exampleOutput: {
      input: 'webinar-slides.pptx (35 slides, 16:9)',
      output: 'slides.zip — 35 PNG/JPG files at 1920×1080, named slide-01.png…slide-35.png',
      description: 'Each slide is rendered to a high-resolution image. Choose format (PNG/JPG/WebP), resolution, and whether to include hidden slides.',
    },
    seo: {
      intro: 'Convert every slide of a PowerPoint deck into a high-resolution image — PNG, JPG, or WebP — at whatever resolution you specify (up to 4K). Useful for embedding slides into web pages or blog posts, sharing decks with people who don\'t have PowerPoint, or feeding slides into a video editor.',
      examples: [
        { title: 'Blog-post embeds', body: 'Each slide becomes a 1920×1080 PNG you can drop into a CMS for a "screenshot tour" of the deck.' },
        { title: 'Slide-as-video', body: 'Drop the PNG sequence into a video editor with 5-second per slide to produce a self-running version.' },
        { title: 'No-PowerPoint sharing', body: 'Mail a recipient a PDF or image folder so they can view slides without needing Office.' },
      ],
      useCases: [
        'Embedding individual slides into blog/web pages',
        'Building "slide tours" for newsletters',
        'Producing video-ready slide sequences',
        'Sharing slides with non-PowerPoint users',
        'Archiving slides as flat images alongside the source .pptx',
      ],
      troubleshooting: [
        { problem: 'Text in some slides is blurry', solution: 'Increase render DPI / resolution. Default is 1920×1080 — bump to 4K for crisp text on large displays.' },
        { problem: 'Fonts replaced with similar-looking ones', solution: 'A custom font in the deck isn\'t available on the renderer. Embed fonts in the .pptx (File → Options → Save → Embed fonts) and re-export.' },
        { problem: 'Animations missing', solution: 'Images are static snapshots — they can\'t capture animations. Use the PowerPoint-to-video export instead if you need animated output.' },
      ],
    },
  },
  'ppt-to-pdf': {
    exampleOutput: {
      input: 'quarterly-review.pptx (52 slides, 16:9, embedded fonts)',
      output: 'quarterly-review.pdf — 52 pages, fonts preserved, hyperlinks clickable',
      description: 'Real PDF (not a ZIP of images). Text stays selectable, hyperlinks work, slide notes optionally included on each page.',
    },
    seo: {
      intro: 'Convert PowerPoint decks (.pptx, .ppt) into PDF — text stays selectable, hyperlinks remain clickable, embedded fonts survive, and you can optionally include speaker notes below each slide. The whole conversion runs locally without uploading the file anywhere.',
      examples: [
        { title: 'Client-ready deliverable', body: 'A 52-slide quarterly review becomes a polished PDF the recipient can read on any device without PowerPoint.' },
        { title: 'Speaker-note handout', body: 'Toggle "include notes below slides" to produce a printable handout for in-person attendees.' },
        { title: 'Locked deck distribution', body: 'PDF makes editing harder than a .pptx — useful when sending to external reviewers who shouldn\'t alter the source.' },
      ],
      useCases: [
        'Distributing decks to non-PowerPoint users',
        'Creating printable handouts with speaker notes',
        'Producing client-ready PDF deliverables',
        'Archiving decks in a portable, version-stable format',
        'Submitting slides for conferences that require PDF',
      ],
      troubleshooting: [
        { problem: 'Fonts replaced after conversion', solution: 'The source .pptx didn\'t embed its custom fonts. In PowerPoint: File → Options → Save → "Embed fonts in the file" → re-save → reconvert.' },
        { problem: 'Animations and transitions lost', solution: 'PDF is static — transitions can\'t survive. Export as video (or use the PPT-to-Images tool then stitch) if motion matters.' },
        { problem: 'Aspect ratio looks wrong', solution: 'Mismatched page size. Pick "match slide size" so the PDF page matches the slide (16:9 → A4 landscape, etc.) instead of forcing Letter portrait.' },
      ],
    },
  },
  'merge-ppt': {
    exampleOutput: {
      input: '4 .pptx files (intro, product, demo, Q&A — total 38 slides)',
      output: 'combined.pptx — 38 slides in order, each source\'s theme preserved per section',
      description: 'Real .pptx output. Slides keep their original masters/themes; you can optionally normalise to the first deck\'s theme for visual consistency.',
    },
    seo: {
      intro: 'Combine multiple PowerPoint decks into one .pptx with drag-and-drop ordering. Each source\'s slides preserve their layouts, animations, and embedded media — or normalise everything to the first deck\'s theme for a single cohesive look. The combined file is a real .pptx you can keep editing.',
      examples: [
        { title: 'Conference talk assembly', body: 'Intro deck + 3 co-presenter decks merge into one master deck for a panel session — speakers can still control their own sections.' },
        { title: 'Sales playbook compilation', body: 'Five product decks merge into a single 80-slide playbook for new-hire training.' },
        { title: 'Theme normalisation', body: 'Toggle "apply first deck\'s theme to all" so heterogeneous source decks share one consistent visual style.' },
      ],
      useCases: [
        'Assembling panel/joint presentations',
        'Compiling sales playbooks from product decks',
        'Combining course-module decks into a full-course deck',
        'Building investor decks from team contributions',
        'Reusing slide libraries by appending into a master',
      ],
      troubleshooting: [
        { problem: 'Slides look mismatched after merge', solution: 'Each source brought its own master. Toggle "apply first deck\'s theme" to normalise, or fix the master in PowerPoint after merging.' },
        { problem: 'Embedded videos broken', solution: 'Videos must be embedded (not linked) in each source. Re-embed in the originals if they were linked, then re-merge.' },
        { problem: 'Slide numbers reset oddly', solution: 'Toggle "renumber slides sequentially across sources" — by default each section keeps its source numbering.' },
      ],
    },
  },
  'split-ppt': {
    exampleOutput: {
      input: 'training-course.pptx (96 slides, 6 sections marked)',
      output: '6 .pptx files — one per section, named after the section title',
      description: 'Split modes: at sections, every N slides, by slide range, or one file per slide. Each output is a real .pptx with theme and animations intact.',
    },
    seo: {
      intro: 'Split a long PowerPoint into smaller decks by section, every N slides, by slide range, or one .pptx per slide. Themes, animations, embedded media, and speaker notes are preserved in each output file — no quality loss, no re-rendering.',
      examples: [
        { title: 'Course-module distribution', body: 'A 96-slide training course splits into 6 module decks for parallel delivery by different trainers.' },
        { title: 'Pitch-deck variants', body: 'A 40-slide master pitch splits into a 10-slide "exec summary" and a 30-slide "deep dive" via custom slide ranges.' },
        { title: 'Per-slide files for review', body: 'Splitting one slide per .pptx gives reviewers tiny files they can mark up individually.' },
      ],
      useCases: [
        'Distributing course modules to different trainers',
        'Creating multiple-length variants of a master deck',
        'Sending individual slides for parallel review',
        'Reducing file size to email limits',
        'Isolating sensitive slides before broader sharing',
      ],
      troubleshooting: [
        { problem: 'Section split missed obvious section breaks', solution: 'PowerPoint sections must be explicit (Home → Section → Add Section). Headings inside slides aren\'t recognised — use the slide-range mode instead.' },
        { problem: 'Theme broken in some outputs', solution: 'A custom master used only on some slides. Re-export with "include all masters" toggled on so each output gets the masters its slides need.' },
        { problem: 'Animations lost', solution: 'They shouldn\'t be — animations are slide-local. If lost, the source had cross-slide animations (rare); rebuild them in each output.' },
      ],
    },
  },
};

let updated = 0;
let skipped = 0;

for (const [id, data] of Object.entries(DATA)) {
  // Locate the tool block by id, then find its `howToUse: [` opener and
  // matching `],` closer within that block, then insert new fields right after.
  const idRegex = new RegExp(`id: '${id}',`);
  const idMatch = src.match(idRegex);
  if (!idMatch) { console.warn('NOT FOUND:', id); skipped++; continue; }

  // Find the bounds of the tool object that contains this id line.
  const idIdx = idMatch.index;
  // Walk backwards to find the opening `  {` of this object.
  let openIdx = src.lastIndexOf('  {\r\n', idIdx);
  if (openIdx < 0) openIdx = src.lastIndexOf('  {\n', idIdx);
  if (openIdx < 0) { console.warn('NO OPEN:', id); skipped++; continue; }
  // Walk forwards to find the matching `  },` closer.
  let depth = 0, closeIdx = -1;
  for (let i = openIdx + 1; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { closeIdx = i; break; }
    }
  }
  if (closeIdx < 0) { console.warn('NO CLOSE:', id); skipped++; continue; }

  const block = src.slice(openIdx, closeIdx + 1);
  if (/seoContent\s*:/.test(block)) { skipped++; continue; }

  // Find the last `],` inside the block — that's the howToUse closer.
  const howToMatch = block.match(/howToUse:\s*\[[\s\S]*?\],\r?\n/);
  if (!howToMatch) { console.warn('NO howToUse:', id); skipped++; continue; }
  const howEndInBlock = howToMatch.index + howToMatch[0].length;
  const insertAt = openIdx + howEndInBlock;

  const ex = data.exampleOutput;
  const seo = data.seo;
  const exampleStr =
`    exampleOutput: {
      input: ${JSON.stringify(ex.input)},
      output: ${JSON.stringify(ex.output)},
      description: ${JSON.stringify(ex.description)},
    },
    seoContent: {
      intro: ${JSON.stringify(seo.intro)},
      examples: [
${seo.examples.map(e => `        { title: ${JSON.stringify(e.title)}, body: ${JSON.stringify(e.body)} },`).join('\r\n')}
      ],
      useCases: [
${seo.useCases.map(u => `        ${JSON.stringify(u)},`).join('\r\n')}
      ],
      troubleshooting: [
${seo.troubleshooting.map(t => `        { problem: ${JSON.stringify(t.problem)}, solution: ${JSON.stringify(t.solution)} },`).join('\r\n')}
      ],
    },
`;
  const crlfStr = exampleStr.replace(/\r?\n/g, '\r\n');
  src = src.slice(0, insertAt) + crlfStr + src.slice(insertAt);
  updated++;
}

fs.writeFileSync(FILE, src);
console.log(`Updated: ${updated}, Skipped: ${skipped}`);
