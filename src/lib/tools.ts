export interface Tool {
  id: string;
  name: string;
  seoTitle?: string; // SEO-optimized title like "UUID Generator – Generate UUID v4 Online (Free)"
  description: string;
  shortDescription: string;
  category: string;
  slug: string;
  icon: string;
  keywords: string[];
  /** Lightweight topical tags used to compute related tools and for internal linking.
   *  When absent, related logic falls back to keywords + category. */
  tags?: string[];
  faq?: {
    question: string;
    answer: string;
  }[];
  relatedTools?: string[];
  howToUse?: string[];
  exampleOutput?: {
    input?: string;
    output: string;
    description?: string;
  };
  /** Rich, per-tool SEO sections. When omitted, the tool page falls back to
   *  the generic SeoContent components. Populating these for top tools is
   *  the easiest way to reduce duplicate content across the site. */
  seoContent?: {
    /** Custom intro paragraph replacing the auto-generated one. */
    intro?: string;
    /** Worked examples: short scenarios the user might paste in. */
    examples?: { title: string; body: string }[];
    /** Real-world developer/designer use cases. */
    useCases?: string[];
    /** Common errors and how to fix them. */
    troubleshooting?: { problem: string; solution: string }[];
  };
}

export const tools: Tool[] = [
  // ==================== DEVELOPER TOOLS ====================
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    seoTitle: 'JSON Formatter – Format & Beautify JSON Online (Free Tool)',
    description: 'Free online JSON Formatter tool to format, beautify, and prettify your JSON data instantly. Add proper indentation, syntax highlighting, and line breaks to make JSON data easy to read and debug. Perfect for developers working with APIs, configuration files, and JSON responses. All formatting happens locally in your browser ensuring complete privacy. No data is ever sent to external servers.',
    shortDescription: 'Format and beautify JSON data online',
    category: 'dev',
    slug: 'json-formatter',
    icon: 'Braces',
    keywords: ['json', 'formatter', 'beautify', 'format json', 'json parser', 'json validator'],
    tags: ['json', 'formatter', 'beautify', 'developer', 'parser'],
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
        question: 'What indentation options are available?',
        answer: 'Our JSON Formatter supports multiple indentation options: 2 spaces, 4 spaces, or tabs. Choose the style that matches your project conventions.',
      },
      {
        question: 'Can I format large JSON files?',
        answer: 'Yes! Our tool handles JSON files of various sizes. For very large files (multiple MB), processing may take a few seconds but will complete successfully.',
      },
      {
        question: 'Does the formatter validate JSON?',
        answer: 'Yes, while formatting, the tool also validates your JSON. If there are syntax errors, you will see an error message indicating what is wrong.',
      },
    ],
    relatedTools: ['json-validator', 'json-minify', 'json-to-yaml', 'json-diff'],
    howToUse: [
      'Paste your JSON data into the input field above',
      'Click the "Format" button to beautify your JSON or "Minify" to compress it',
      'The result will appear in the output area',
      'Use the copy button to copy the result to your clipboard',
    ],
    seoContent: {
      intro:
        'JSON Formatter takes minified, hand-written, or API-response JSON and produces a clean, indented version that is easy to scan and diff. Use it to inspect a payload from your network tab, normalize input before committing to git, or quickly check whether two responses differ in structure or just whitespace. The whole transformation happens in your browser — your data never leaves the page.',
      examples: [
        {
          title: 'Beautify a one-line API response',
          body: 'Input:  {"user":{"id":1,"roles":["admin","editor"]}}\nOutput is rewritten with 2-space indentation, one key per line, so it can be diffed line-by-line in a code review.',
        },
        {
          title: 'Normalize before committing',
          body: 'Paste a config blob copied from a chat thread, format with tabs, and the result matches your team\'s editorconfig without any local tooling.',
        },
        {
          title: 'Toggle between formatted and minified',
          body: 'Use Format to expand for reading, then Minify to compress for embedding in an HTML data-* attribute or a URL fragment.',
        },
      ],
      useCases: [
        'Inspecting REST/GraphQL API responses while debugging',
        'Diffing two JSON payloads in a code review or pull request',
        'Cleaning up JSON copied out of a log line or chat message',
        'Preparing fixtures and seed data for tests',
        'Embedding compact JSON in an HTML attribute after minifying',
      ],
      troubleshooting: [
        {
          problem: 'Unexpected token error on a valid-looking payload.',
          solution:
            'Most often a trailing comma, unquoted key, or single-quoted string. JSON only accepts double quotes and no trailing commas — fix those and reformat.',
        },
        {
          problem: 'Numbers look truncated (e.g. trailing zeros disappear).',
          solution:
            'Large integers above 2^53 lose precision when parsed as JavaScript Number. Wrap the value in quotes before parsing so it stays a string.',
        },
        {
          problem: 'Output looks identical to input.',
          solution:
            'The input is already canonical at the indentation you chose. Try a different indent setting or use Minify to verify the round-trip.',
        },
      ],
    },
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    seoTitle: 'JSON Validator – Validate JSON Online (Free Tool)',
    description: 'Free online JSON Validator tool to validate your JSON data and find errors quickly. Get detailed error messages with line numbers and position indicators to help fix invalid JSON syntax instantly. Checks for common JSON errors like missing brackets, trailing commas, unquoted keys, and malformed strings. All validation happens locally in your browser ensuring your data remains private and secure.',
    shortDescription: 'Validate JSON and find errors',
    category: 'dev',
    slug: 'json-validator',
    icon: 'CheckCircle',
    keywords: ['json', 'validator', 'validate json', 'json checker', 'json lint'],
    tags: ['json', 'validator', 'lint', 'developer', 'syntax'],
    faq: [
      {
        question: 'What is JSON validation?',
        answer: 'JSON validation checks if your JSON data follows the correct syntax rules. It verifies proper bracket matching, correct use of quotes, valid data types, and proper structure.',
      },
      {
        question: 'What common errors does the validator detect?',
        answer: 'Our validator detects missing or extra commas, unquoted keys, single quotes instead of double quotes, missing brackets, trailing commas, and malformed values.',
      },
      {
        question: 'Is my JSON data sent to a server?',
        answer: 'No, all validation happens locally in your browser. Your data never leaves your device, ensuring complete privacy and security.',
      },
      {
        question: 'Can I validate JSON with comments?',
        answer: 'Standard JSON does not support comments. If your JSON has comments, it will be flagged as invalid. Consider using JSONC (JSON with Comments) format for configuration files.',
      },
      {
        question: 'What is the maximum JSON size I can validate?',
        answer: 'There is no strict limit. The tool can handle JSON files of several megabytes. Very large files may take longer to process but will validate successfully.',
      },
    ],
    relatedTools: ['json-formatter', 'json-minify', 'json-to-yaml'],
    seoContent: {
      intro: "JSON Validator parses your input against the strict JSON grammar (RFC 8259) and tells you exactly where the first syntax error is. Use it to confirm an API response is shaped the way you expect before parsing, or to debug hand-written config files that the runtime rejects with a vague message. Validation happens in the browser, so private payloads stay on your machine.",
      examples: [
        {
          title: "Catch a missing comma",
          body: "Input: {\"a\":1 \"b\":2}\nThe validator points to \"b\" and reports an unexpected string token where a comma was expected.",
        },
        {
          title: "Detect a trailing comma",
          body: "Input: {\"items\":[1, 2, 3,]}\nThe validator flags the trailing comma — valid in JavaScript object literals but illegal in JSON.",
        },
        {
          title: "Verify before parsing",
          body: "Paste an API response, validate, then copy with confidence into JSON.parse() in your code without runtime surprises.",
        },
      ],
      useCases: [
        "Debugging \"Unexpected token\" errors thrown by JSON.parse",
        "Validating config files (package.json, tsconfig.json) before commit",
        "Sanity-checking webhook payloads in production logs",
        "Pre-flight checking JSON fixtures used by automated tests",
        "Teaching JSON syntax — the error pointer makes the rule concrete",
      ],
      troubleshooting: [
        {
          problem: "Validator says \"Unexpected token '\" near a string.",
          solution: "JSON requires double quotes around keys and string values. Replace single quotes with double quotes throughout the document.",
        },
        {
          problem: "Says comments are not allowed.",
          solution: "JSON does not support // or /* */ comments. Strip them or switch to JSON5/JSONC if your tooling supports it.",
        },
        {
          problem: "Numbers like 1.0e500 marked invalid.",
          solution: "JSON allows exponents but values must fit in IEEE 754 double precision (max ~1.8e308). Reduce magnitude or store as a string.",
        },
      ],
    },
    howToUse: [
      'Paste your JSON data into the input field',
      'Click "Validate" to check if your JSON is valid',
      'View validation results and error details if any',
    ],
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    seoTitle: 'JSON to YAML Converter – Convert JSON Online (Free Tool)',
    description: 'Convert JSON to YAML format instantly with this free online converter. Transform your JSON data into clean, readable YAML syntax with proper indentation. Perfect for developers converting API responses, configuration files, and data structures between formats. All conversion happens locally in your browser ensuring complete privacy.',
    shortDescription: 'Convert JSON to YAML format',
    category: 'dev',
    slug: 'json-to-yaml',
    icon: 'FileCode',
    keywords: ['json', 'yaml', 'converter', 'json to yaml', 'convert json'],
    tags: ['json', 'yaml', 'converter', 'developer'],
    faq: [
      {
        question: 'Why convert JSON to YAML?',
        answer: 'YAML is more human-readable than JSON and supports comments. It is commonly used for configuration files (Kubernetes, Ansible, CI/CD) where readability matters.',
      },
      {
        question: 'Is data preserved during conversion?',
        answer: 'Yes, all data types including strings, numbers, booleans, arrays, and nested objects are preserved during the conversion process.',
      },
      {
        question: 'What YAML indentation does this use?',
        answer: 'Our converter uses 2-space indentation, which is the most common convention for YAML files and recommended by most style guides.',
      },
      {
        question: 'Can I convert nested JSON objects?',
        answer: 'Yes! Our converter handles deeply nested JSON structures and converts them to properly indented YAML with correct hierarchy.',
      },
      {
        question: 'What happens to JSON null values?',
        answer: 'JSON null values are converted to YAML null or simply omitted depending on context, maintaining the semantic meaning of your data.',
      },
    ],
    relatedTools: ['yaml-to-json', 'json-formatter', 'json-validator'],
    seoContent: {
      intro: "JSON to YAML converts a JSON document into the cleaner, more indent-driven YAML 1.2 syntax. YAML is the lingua franca of CI/CD pipelines (GitHub Actions, GitLab CI, Kubernetes manifests, Ansible playbooks), so converting JSON config into YAML is a common chore. The tool runs entirely client-side and preserves data types — strings, numbers, booleans, nulls, arrays, and nested objects all round-trip cleanly.",
      examples: [
        {
          title: "Convert a package.json snippet",
          body: "Input JSON with name, scripts, and dependencies becomes a flat YAML document with each key on its own line — easier to read in a diff.",
        },
        {
          title: "Build a Kubernetes manifest from API output",
          body: "Many cluster CLIs emit JSON. Convert to YAML to match the style used in the rest of your manifests folder.",
        },
        {
          title: "Migrate config across formats",
          body: "A tool that ships JSON config can be re-distributed as YAML for users who prefer it — no manual rewriting required.",
        },
      ],
      useCases: [
        "Authoring Kubernetes manifests, Helm values, or Ansible playbooks",
        "Translating GitHub Actions workflow JSON into the YAML schema",
        "Generating docker-compose files from JSON service definitions",
        "Storing application config in YAML for human editability while keeping JSON for runtime",
        "Converting tsconfig.json into a YAML representation for sharing in docs",
      ],
      troubleshooting: [
        {
          problem: "Multi-line strings come out with weird escapes.",
          solution: "YAML has several string styles. The converter picks safe defaults; for prose blocks, use the literal block scalar (|) and re-format after pasting.",
        },
        {
          problem: "Boolean strings like \"yes\" or \"no\" got coerced.",
          solution: "YAML 1.1 treats those as booleans. Quote them explicitly in the output if you need them to stay strings: \"yes\".",
        },
        {
          problem: "Long numeric strings lost precision.",
          solution: "Very large integers should be wrapped in quotes in the source JSON to stay as strings through both formats.",
        },
      ],
    },
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    seoTitle: 'YAML to JSON Converter – Convert YAML Online (Free Tool)',
    description: 'Convert YAML to JSON format instantly with this free online converter. Transform your YAML configuration files and data into valid JSON syntax with proper formatting. Ideal for developers working with configuration files, Kubernetes configs, and CI/CD pipelines. All processing happens locally in your browser.',
    shortDescription: 'Convert YAML to JSON format',
    category: 'dev',
    slug: 'yaml-to-json',
    icon: 'FileCode',
    keywords: ['yaml', 'json', 'converter', 'yaml to json', 'convert yaml'],
    tags: ['yaml', 'json', 'converter', 'developer'],
    faq: [
      {
        question: 'Why convert YAML to JSON?',
        answer: 'JSON is widely supported by APIs, databases, and programming languages. Converting YAML config files to JSON makes them easier to consume in applications that expect JSON.',
      },
      {
        question: 'Does it support YAML anchors and aliases?',
        answer: 'Yes, our converter handles YAML anchors (&) and aliases (*) by expanding them into full JSON structures.',
      },
      {
        question: 'What happens to YAML comments?',
        answer: 'Since JSON does not support comments, all YAML comments are removed during conversion. The data structure is fully preserved.',
      },
      {
        question: 'Can I convert multi-document YAML?',
        answer: 'Yes, YAML files with multiple documents (separated by ---) are converted to a JSON array containing each document.',
      },
      {
        question: 'Is the conversion order preserved?',
        answer: 'Yes, the order of keys and items is preserved during conversion. YAML sequences become JSON arrays, and mappings become JSON objects.',
      },
    ],
    relatedTools: ['json-to-yaml', 'json-formatter', 'json-validator'],
    seoContent: {
      intro: "YAML to JSON converts a YAML 1.2 document into compact JSON. Most runtimes, browser APIs, and HTTP clients consume JSON natively, so converting a human-authored YAML file into JSON is the last step before shipping config into an app. The parser handles flow style, block style, anchors, and references — the conversion runs entirely in the browser, so secrets in your YAML never leave the page.",
      examples: [
        {
          title: "Compile a GitHub Actions matrix",
          body: "A YAML matrix becomes a JSON array of objects you can paste straight into a custom CI tool that accepts JSON config.",
        },
        {
          title: "Convert a Helm values file",
          body: "Output JSON values can be fed into systems that don't understand YAML, like a JSON-schema validator or a JS templating engine.",
        },
        {
          title: "Inspect anchor expansion",
          body: "YAML anchors and aliases are inlined in the JSON output, making it easy to see what the final merged document actually looks like.",
        },
      ],
      useCases: [
        "Feeding YAML config into JavaScript code that expects JSON",
        "Validating YAML against a JSON Schema",
        "Diffing two YAML files by converting both to canonical JSON",
        "Migrating from YAML to JSON for performance (no YAML parser at runtime)",
        "Pre-processing CI config before sending to a webhook or API",
      ],
      troubleshooting: [
        {
          problem: "Conversion fails with \"mapping values not allowed here\".",
          solution: "Most often indentation is mixed (tabs and spaces). YAML strictly forbids tabs for indentation — replace with consistent spaces.",
        },
        {
          problem: "Strings like \"on\" or \"off\" became true/false.",
          solution: "YAML 1.1 booleans include many synonyms. Quote string values that look like booleans: 'off' becomes the string \"off\" in JSON.",
        },
        {
          problem: "Dates came out as ISO strings instead of objects.",
          solution: "JSON has no native date type. The converter serialises dates to ISO 8601 strings — parse with new Date(...) on the consuming side.",
        },
      ],
    },
  },
  {
    id: 'base64-encode',
    name: 'Base64 Encoder',
    seoTitle: 'Base64 Encoder – Encode Base64 Online (Free Tool)',
    description: 'Free online Base64 Encoder tool to encode text, strings, and data to Base64 format instantly. Convert binary data and text to ASCII-safe Base64 encoding for safe transmission over text-based protocols. Perfect for encoding images, credentials, and binary data. All encoding happens locally in your browser ensuring complete privacy.',
    shortDescription: 'Encode text to Base64 format',
    category: 'dev',
    slug: 'base64-encode',
    icon: 'Lock',
    keywords: ['base64', 'encode', 'encoder', 'base64 encode', 'text encoder'],
    tags: ['base64', 'encoder', 'encoding', 'developer'],
    faq: [
      {
        question: 'What is Base64 encoding?',
        answer: 'Base64 is a binary-to-text encoding scheme that converts binary data into an ASCII string format. It is commonly used to encode data for safe transmission over media designed to handle text.',
      },
      {
        question: 'Why use Base64 encoding?',
        answer: 'Base64 ensures binary data can be safely transmitted over text-based protocols like email or HTTP. It prevents corruption of special characters and preserves data integrity.',
      },
      {
        question: 'Does Base64 increase data size?',
        answer: 'Yes, Base64 encoding increases data size by approximately 33%. Every 3 bytes of input become 4 bytes of Base64 output.',
      },
      {
        question: 'Is Base64 encryption?',
        answer: 'No, Base64 is encoding, not encryption. Anyone can decode Base64 data. It provides no security—only a different representation of the same data.',
      },
      {
        question: 'Can I encode images to Base64?',
        answer: 'Yes! Images can be converted to Base64 strings and embedded directly in HTML, CSS, or JSON. This is useful for small images to reduce HTTP requests.',
      },
    ],
    relatedTools: ['base64-decode', 'url-encode', 'text-to-base64'],
    seoContent: {
      intro:
        'Base64 Encoder turns arbitrary bytes — text, images, or binary blobs — into an ASCII-safe string that survives transport channels that only accept printable characters. It is the same encoding used by HTTP Basic Auth headers, JWT payloads, and inline data: URLs. The conversion runs entirely in your browser, so secrets you paste never reach a server.',
      examples: [
        {
          title: 'Encode credentials for Basic Auth',
          body: 'Encode "user:p@ss" to "dXNlcjpwQHNz". The resulting string is what goes after "Authorization: Basic " in an HTTP request.',
        },
        {
          title: 'Inline an SVG icon',
          body: 'Encode the SVG markup to Base64 and use it as `url("data:image/svg+xml;base64,...")` in CSS to remove an HTTP request.',
        },
        {
          title: 'Round-trip a binary buffer',
          body: 'Encode raw bytes here, ship the string in JSON, decode on the other side with the Base64 Decoder tool to get the original buffer back.',
        },
      ],
      useCases: [
        'Embedding small images and fonts in CSS / HTML to cut requests',
        'Building HTTP Basic Auth headers by hand',
        'Encoding API keys before sending them in JSON',
        'Preparing payloads for JWT or webhook signatures',
        'Storing binary blobs in databases that only accept text',
      ],
      troubleshooting: [
        {
          problem: 'Decoded result has mojibake / question marks.',
          solution:
            'The input was treated as a different encoding. UTF-8 text encodes safely; if you started from a Latin-1 source, convert to UTF-8 first.',
        },
        {
          problem: 'Output is ~33% larger than input.',
          solution:
            'That overhead is intrinsic to Base64 — 3 bytes in, 4 characters out. If size matters, consider Base85 or gzip + Base64 instead.',
        },
        {
          problem: 'I get padding-error when decoding elsewhere.',
          solution:
            'Some libraries reject inputs whose length is not a multiple of 4. Re-add trailing "=" padding characters or switch to a URL-safe variant.',
        },
      ],
    },
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decoder',
    seoTitle: 'Base64 Decoder – Decode Base64 Online (Free Tool)',
    description: 'Free online Base64 Decoder tool to decode Base64 encoded text back to its original format. Convert Base64 strings to readable text, images, or binary data instantly. Handles URL-safe Base64 variants and standard encoding. All decoding happens locally in your browser ensuring complete privacy and security.',
    shortDescription: 'Decode Base64 to text',
    category: 'dev',
    slug: 'base64-decode',
    icon: 'Unlock',
    keywords: ['base64', 'decode', 'decoder', 'base64 decode', 'text decoder'],
    tags: ['base64', 'decoder', 'encoding', 'developer'],
    faq: [
      {
        question: 'What is Base64 decoding?',
        answer: 'Base64 decoding converts Base64-encoded strings back to their original binary or text format. It reverses the encoding process to retrieve the original data.',
      },
      {
        question: 'Can I decode Base64 images?',
        answer: 'Yes! If your Base64 string represents an image, our tool can decode it and display or download the image in its original format.',
      },
      {
        question: 'What if my Base64 has errors?',
        answer: 'Our decoder validates the input and shows an error message if the Base64 string is malformed or contains invalid characters.',
      },
      {
        question: 'Does it support URL-safe Base64?',
        answer: 'Yes, our decoder handles both standard Base64 and URL-safe variants (using - and _ instead of + and /).',
      },
      {
        question: 'Is decoding Base64 secure?',
        answer: 'All decoding happens locally in your browser. Your data is never sent to external servers, ensuring complete privacy.',
      },
    ],
    relatedTools: ['base64-encode', 'url-decode', 'base64-to-text'],
    seoContent: {
      intro: "Base64 Decode converts a Base64-encoded string back to its original text or binary. Use it to inspect data inside JWTs, decode email headers, read MIME-encoded attachments, or recover text from a copy-pasted token. Decoding happens locally in your browser — sensitive payloads (auth tokens, API responses) are never transmitted to a server.",
      examples: [
        {
          title: "Decode a JWT payload",
          body: "Copy the middle segment of a JWT (between the two dots) and decode it to reveal the JSON claims — useful when debugging an auth bug.",
        },
        {
          title: "Read a Data URL",
          body: "Strip the \"data:image/png;base64,\" prefix and decode the rest to inspect or save the raw bytes of an embedded image.",
        },
        {
          title: "Reverse an HTTP Basic auth header",
          body: "Decode the Base64 string after \"Basic \" to recover the username:password sent in an Authorization header (in your own dev env, of course).",
        },
      ],
      useCases: [
        "Inspecting JWT payloads while debugging authentication",
        "Recovering plain text from email \"MIME-Word\" encoded subjects",
        "Reading binary payloads pasted into a chat or log",
        "Verifying a Base64 string matches expected content during integration testing",
        "Reverse-engineering tokens embedded in URLs or HTML attributes",
      ],
      troubleshooting: [
        {
          problem: "Decoded output looks like gibberish.",
          solution: "The input is probably binary (image, PDF, compressed data). Plain-text decode is meaningless — save to a file with the right extension instead.",
        },
        {
          problem: "Error: \"Invalid character in Base64 string\".",
          solution: "The string may use Base64URL (- and _ instead of + and /). Toggle the URL-safe option, or manually replace - with + and _ with /.",
        },
        {
          problem: "Decoded text shows  or weird characters for accents.",
          solution: "The original was UTF-8 but is being read as Latin-1. Use a tool that decodes the bytes as UTF-8, or paste the result into a UTF-8-aware viewer.",
        },
      ],
    },
  },
  {
    id: 'url-encode',
    name: 'URL Encoder',
    seoTitle: 'URL Encoder – Encode URL Online (Free Tool)',
    description: 'Free online URL Encoder tool to encode URLs and text for safe transmission. Convert special characters, spaces, and reserved characters to percent-encoded format for use in URLs and query strings. Essential for web developers building URLs with dynamic parameters. All encoding happens locally in your browser.',
    shortDescription: 'Encode URLs and text',
    category: 'dev',
    slug: 'url-encode',
    icon: 'Link',
    keywords: ['url', 'encode', 'encoder', 'url encode', 'percent encoding'],
    tags: ['url', 'encoder', 'encoding', 'web', 'developer'],
    faq: [
      {
        question: 'What is URL encoding?',
        answer: 'URL encoding (percent encoding) converts characters into a format that can be transmitted over the Internet. Special characters are replaced with % followed by two hexadecimal digits.',
      },
      {
        question: 'Which characters need to be encoded?',
        answer: 'Reserved characters like ?, &, =, /, #, and spaces need encoding when used as data. Non-ASCII characters and unsafe characters should also be encoded.',
      },
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI encodes for a full URL, keeping scheme and domain characters. encodeURIComponent encodes for query parameters, encoding all special characters including / and ?.',
      },
      {
        question: 'How are spaces encoded?',
        answer: 'Spaces can be encoded as %20 or + (plus sign). In URL paths, %20 is preferred. In query strings, + is commonly used.',
      },
      {
        question: 'When should I use URL encoding?',
        answer: 'Use URL encoding when including user input, special characters, or non-ASCII text in URLs or query parameters to ensure proper transmission.',
      },
    ],
    relatedTools: ['url-decode', 'base64-encode', 'query-string-parser'],
    seoContent: {
      intro: "URL Encode converts text into percent-encoded form so it can be safely placed in a query string, path segment, or form body. The tool uses RFC 3986 reserved-character rules and encodes Unicode as UTF-8 then percent-encodes each byte — exactly what browsers, fetch(), and curl do. Encoding runs locally; no input is logged.",
      examples: [
        {
          title: "Encode a search query",
          body: "Input: \"hello world & friends\"\nOutput: \"hello%20world%20%26%20friends\" — safe to drop into ?q= without breaking the URL parser.",
        },
        {
          title: "Build a redirect parameter",
          body: "Encode a full URL (including its own query string) before embedding it as a value of ?redirect_uri= so the consumer can decode it cleanly.",
        },
        {
          title: "Encode non-ASCII text",
          body: "Input: \"café\"\nOutput: \"caf%C3%A9\" — UTF-8 bytes 0xC3 0xA9 percent-encoded.",
        },
      ],
      useCases: [
        "Building API request URLs from user input safely",
        "Constructing OAuth redirect_uri parameters without manual escaping",
        "Encoding form data to send as application/x-www-form-urlencoded",
        "Quoting filenames inside Content-Disposition headers",
        "Producing valid mailto:, sms:, and other URI scheme links",
      ],
      troubleshooting: [
        {
          problem: "My + signs disappeared after decoding on the server.",
          solution: "In form encoding, + means space. Use the \"encode all\" mode to percent-encode + as %2B if it must survive form parsing.",
        },
        {
          problem: "Slashes got encoded but I wanted to keep the path intact.",
          solution: "Use encodeURI semantics (encode only unsafe chars) instead of encodeURIComponent. The tool offers both modes — pick \"encode component\" for full encoding.",
        },
        {
          problem: "Encoded text decodes to garbage on the other side.",
          solution: "The receiver is probably decoding as Latin-1 or assuming a different charset. URLs should be UTF-8 — fix the receiver to use UTF-8 decoding.",
        },
      ],
    },
  },
  {
    id: 'url-decode',
    name: 'URL Decoder',
    seoTitle: 'URL Decoder – Decode URL Online (Free Tool)',
    description: 'Free online URL Decoder tool to decode URL-encoded text back to its original format. Convert percent-encoded strings to readable text instantly. Handle URL parameters, query strings, and encoded special characters. All decoding happens locally in your browser ensuring complete privacy.',
    shortDescription: 'Decode URL-encoded text',
    category: 'dev',
    slug: 'url-decode',
    icon: 'Unlink',
    keywords: ['url', 'decode', 'decoder', 'url decode', 'percent decoding'],
    tags: ['url', 'decoder', 'encoding', 'web', 'developer'],
    faq: [
      {
        question: 'What is URL decoding?',
        answer: 'URL decoding converts percent-encoded characters back to their original form. It reverses the encoding applied to make text URL-safe.',
      },
      {
        question: 'Can I decode full URLs?',
        answer: 'Yes! Paste any URL with encoded characters and our tool will decode all percent-encoded sequences to show the original text.',
      },
      {
        question: 'What if decoding shows strange characters?',
        answer: 'This usually means the original encoding used a different character set. The tool defaults to UTF-8, which handles most modern web content.',
      },
      {
        question: 'Can I decode multiple times?',
        answer: 'Yes, if text was encoded multiple times, you can decode repeatedly until you get readable text. Our tool shows results instantly.',
      },
      {
        question: 'Is my decoded data private?',
        answer: 'Absolutely! All decoding happens locally in your browser. Your data is never sent to any external server.',
      },
    ],
    relatedTools: ['url-encode', 'base64-decode', 'url-parser'],
    seoContent: {
      intro: "URL Decode reverses percent-encoding to recover the original text or URL. It is what you reach for when a query string looks like %20%E2%80%99 and you need to know what it actually means. Decoding happens entirely in the browser; the encoded value (which may contain sensitive tokens) never leaves your machine.",
      examples: [
        {
          title: "Read an encoded query string",
          body: "Input: \"?q=react%20hooks%20%26%20context\"\nOutput shows the literal query: q=react hooks & context.",
        },
        {
          title: "Recover a redirect_uri",
          body: "OAuth callbacks often embed a fully-encoded URL as a parameter; decoding it reveals where the user was originally headed.",
        },
        {
          title: "Decode a UTF-8 sequence",
          body: "Input: \"%E4%BD%A0%E5%A5%BD\"\nOutput: 你好 — the bytes were valid UTF-8 for \"Hello\" in Chinese.",
        },
      ],
      useCases: [
        "Reading parameters out of a log line that captured a full URL",
        "Debugging OAuth flows where state and redirect_uri are encoded",
        "Decoding emails that arrived via a URL-based unsubscribe link",
        "Inspecting analytics URLs with UTM tags that include spaces and pipes",
        "Reverse-engineering a deep-link to a mobile app",
      ],
      troubleshooting: [
        {
          problem: "Spaces showed up as + signs in the output.",
          solution: "Form-encoded data uses + for space. Toggle \"decode + as space\" so the result reads naturally.",
        },
        {
          problem: "Error: \"URI malformed\".",
          solution: "A lone % must be followed by two hex digits. Check for stray % characters in the input — they need to be %25 if they're literal.",
        },
        {
          problem: "Decoded result still looks encoded.",
          solution: "The input was double-encoded. Run decode twice (or until output stabilises) to fully recover the original.",
        },
      ],
    },
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    seoTitle: 'UUID Generator – Generate UUID Online (Free Tool)',
    description: 'Free online UUID Generator tool to generate UUID v4 (Universally Unique Identifiers) instantly. Create unique identifiers for database primary keys, session IDs, and distributed systems. Generate multiple UUIDs at once with one click. All generation happens locally using crypto API.',
    shortDescription: 'Generate unique UUIDs online',
    category: 'dev',
    slug: 'uuid-generator',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'generator', 'unique id', 'uuid v4'],
    tags: ['uuid', 'guid', 'generator', 'identifier', 'developer'],
    faq: [
      {
        question: 'What is a UUID?',
        answer: 'UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. UUID v4 is randomly generated and has an extremely low probability of duplication.',
      },
      {
        question: 'How do I use generated UUIDs?',
        answer: 'Generated UUIDs can be used as database primary keys, session identifiers, transaction IDs, or any scenario requiring unique identification without central coordination.',
      },
      {
        question: 'Are UUIDs guaranteed to be unique?',
        answer: 'While UUIDs are not mathematically guaranteed to be unique, the probability of generating a duplicate UUID v4 is astronomically low—about 1 in 2^122. In practice, you can consider them unique for all reasonable purposes.',
      },
      {
        question: 'Can I generate UUIDs in JavaScript?',
        answer: 'Yes! Modern browsers support the Web Crypto API. You can use `crypto.randomUUID()` to generate UUIDs, or use libraries like uuid.js. Our tool uses this same API for generation.',
      },
      {
        question: 'What is UUID v4?',
        answer: 'UUID v4 is a randomly generated UUID variant. It uses random numbers for most of its bits, making it the most common choice when you need unique identifiers without a central authority.',
      },
      {
        question: 'Are generated UUIDs secure?',
        answer: 'UUIDs generated using cryptographic random sources (like our tool uses) are suitable for most purposes. However, they are not designed to be secret or tamper-proof—use proper encryption for sensitive data.',
      },
    ],
    exampleOutput: {
      output: '550e8400-e29b-41d4-a716-446655440000\n6fa459ea-ee8a-3ca4-894e-db77e160355e\n3c4e5a6b-7c8d-4e9f-0a1b-2c3d4e5f6a7b',
      description: 'Example of 3 generated UUID v4 identifiers',
    },
    relatedTools: ['guid-generator', 'uuid-bulk-generator', 'nano-id-generator', 'secure-token-generator'],
    seoContent: {
      intro: "UUID Generator creates universally unique identifiers using the v4 algorithm (random) or v1 (time-based). UUIDs are 128 bits long with a 1-in-2^122 collision chance — safe to use as database primary keys, request IDs, idempotency tokens, or anything else that needs a globally unique handle. Generation uses the browser's crypto.getRandomValues so the output is cryptographically random.",
      examples: [
        {
          title: "Generate a database primary key",
          body: "Click Generate to get something like 7f3a8b2e-1c4d-4e9f-bb0a-9d8e7c6b5a4e — drop it into a CREATE statement or use as the value for a UUID column in PostgreSQL/MySQL.",
        },
        {
          title: "Make a request ID for tracing",
          body: "Generate a UUID, set it on the X-Request-Id header, and search for it in your logs to follow a single request through a distributed system.",
        },
        {
          title: "Bulk-generate test fixtures",
          body: "Generate dozens at once to seed users, orders, or any entity that needs unique IDs in a test database.",
        },
      ],
      useCases: [
        "Database primary keys (especially for distributed inserts)",
        "Idempotency keys for payment APIs (Stripe, PayPal)",
        "Correlation IDs for tracing requests across microservices",
        "Random session IDs and short-lived auth artefacts",
        "Filenames for uploaded files to avoid collisions",
      ],
      troubleshooting: [
        {
          problem: "Two UUIDs in a row look similar.",
          solution: "Coincidence — v4 UUIDs are random. Inspect them character by character; the structure (8-4-4-4-12 with version digit) is fixed but the rest is random.",
        },
        {
          problem: "Need a shorter ID.",
          solution: "UUIDs are 36 chars. For shorter unique IDs, look at NanoID or short-uuid — same uniqueness with a URL-friendly alphabet.",
        },
        {
          problem: "My database stores UUIDs as bytes and queries fail.",
          solution: "PostgreSQL has a uuid type; MySQL uses BINARY(16). Make sure the column type matches and conversion is consistent in your ORM.",
        },
      ],
    },
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    seoTitle: 'Timestamp Converter – Convert Timestamp Online (Free Tool)',
    description: 'Free online Timestamp Converter tool to convert Unix timestamps to human-readable dates and vice versa. Convert epoch time to datetime format, calculate time differences, and work with timestamps across timezones. Perfect for developers debugging logs and working with APIs.',
    shortDescription: 'Convert Unix timestamps to dates',
    category: 'dev',
    slug: 'timestamp-converter',
    icon: 'Clock',
    keywords: ['timestamp', 'unix', 'converter', 'epoch', 'date converter'],
    tags: ['timestamp', 'unix', 'epoch', 'date', 'converter', 'developer'],
    faq: [
      {
        question: 'What is a Unix timestamp?',
        answer: 'A Unix timestamp (also called epoch time) is the number of seconds that have elapsed since January 1, 1970 (UTC). It is a standard way to represent time in computing.',
      },
      {
        question: 'Why use Unix timestamps?',
        answer: 'Unix timestamps are timezone-independent, easy to calculate differences, and universally understood by programming languages and databases.',
      },
      {
        question: 'What is the Unix timestamp for now?',
        answer: 'The current Unix timestamp is displayed in real-time on our converter. It updates every second and shows both seconds and milliseconds formats.',
      },
      {
        question: 'How do I convert a date to timestamp?',
        answer: 'Simply enter your date in the input field (supports various formats like YYYY-MM-DD or MM/DD/YYYY) and the tool will instantly convert it to a Unix timestamp.',
      },
      {
        question: 'Does it support milliseconds?',
        answer: 'Yes! Our converter handles both second-based and millisecond-based timestamps, which are common in JavaScript and other programming environments.',
      },
    ],
    relatedTools: ['unix-time-to-date', 'date-to-unix-time', 'time-converter'],
    seoContent: {
      intro: "Timestamp Converter switches a Unix epoch timestamp into a human-readable date and back. It supports seconds and milliseconds, local time and UTC, and the standard ISO 8601 format. Useful for debugging logs, building APIs that expose timestamps as numbers, or just converting a \"1700000000\" you saw in a database row into a real date.",
      examples: [
        {
          title: "Decode a log line",
          body: "Paste 1700000000 to learn it is 2023-11-14T22:13:20Z — instantly readable for incident review.",
        },
        {
          title: "Convert a JavaScript milliseconds timestamp",
          body: "Date.now() returns milliseconds. Paste 1700000000000 and the tool detects the millisecond scale and converts to the matching date.",
        },
        {
          title: "Build a future date",
          body: "Pick a future date in the picker and get back the Unix timestamp to use as expires_at, valid_until, or a TTL value.",
        },
      ],
      useCases: [
        "Inspecting created_at / updated_at columns stored as integers",
        "Decoding JWT exp / iat / nbf claims",
        "Setting expires-at values for cache entries or signed URLs",
        "Working with Linux cron logs or system journals",
        "Building API responses that need both numeric and ISO representations",
      ],
      troubleshooting: [
        {
          problem: "Date came out 50+ years off.",
          solution: "You probably mixed up seconds and milliseconds. Timestamps after year 2001 are about 1e9 in seconds and 1e12 in milliseconds — the tool auto-detects, but you can switch manually.",
        },
        {
          problem: "Timezone seems wrong.",
          solution: "The tool shows both UTC and your local zone. Pick the right one for the system you're debugging — servers usually log UTC, clients local.",
        },
        {
          problem: "Negative timestamps confused.",
          solution: "Negative epoch means before 1970-01-01. Most databases reject them; for historical dates, store as ISO strings instead.",
        },
      ],
    },
  },
  {
    id: 'random-password-generator',
    name: 'Random Password Generator',
    seoTitle: 'Random Password Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random Password Generator tool to create secure, strong passwords instantly. Generate passwords with customizable length including uppercase, lowercase, numbers, and symbols. Cryptographically secure random generation ensures strong passwords. Perfect for account security.',
    shortDescription: 'Generate secure random passwords',
    category: 'dev',
    slug: 'random-password-generator',
    icon: 'Key',
    keywords: ['password', 'generator', 'random', 'secure password', 'password maker'],
    tags: ['password', 'generator', 'random', 'security'],
    faq: [
      {
        question: 'What makes a password secure?',
        answer: 'A secure password should be at least 12 characters long, include a mix of uppercase and lowercase letters, numbers, and special symbols. Avoid common words, patterns, or personal information.',
      },
      {
        question: 'Are generated passwords truly random?',
        answer: 'Yes, this tool uses the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random number generation, making passwords suitable for security purposes.',
      },
      {
        question: 'Can I customize password length?',
        answer: 'Yes! You can set any password length from 4 to 128 characters. For maximum security, we recommend at least 16 characters.',
      },
      {
        question: 'Should I exclude certain characters?',
        answer: 'Some websites do not accept special characters. You can uncheck the symbols option to generate alphanumeric-only passwords if needed.',
      },
      {
        question: 'Is my generated password stored?',
        answer: 'No, passwords are generated locally in your browser and are never sent to any server. Your passwords remain completely private.',
      },
    ],
    exampleOutput: {
      output: 'Kx9#mP2$vL7@nQ4!',
      description: 'Example of a 16-character secure password with mixed case, numbers, and symbols',
    },
    relatedTools: ['password-strength-checker', 'secure-token-generator', 'random-string-generator'],
    seoContent: {
      intro: "Random Password Generator builds cryptographically strong passwords using the browser's crypto.getRandomValues. Pick length, character classes (lowercase, uppercase, digits, symbols), and exclude ambiguous characters (O/0, l/1) — the generated password is unique to your session and never leaves the page. Strong, memorable, and ready to paste into your password manager.",
      examples: [
        {
          title: "Generate a 16-character mixed password",
          body: "With length 16 and all character classes enabled, you get something like Ks7#fQ2!nLp$8vXz — high entropy, hard to crack.",
        },
        {
          title: "Build a pronounceable passphrase",
          body: "Switch to passphrase mode and get 4-6 random dictionary words separated by hyphens — easier to type, still strong (~50 bits per 4 words).",
        },
        {
          title: "Skip ambiguous characters",
          body: "Toggle \"exclude similar\" and the generator avoids 0/O, 1/l/I, |/I — useful for passwords you may have to dictate or read off a screen.",
        },
      ],
      useCases: [
        "Creating unique passwords for every account in a password manager",
        "Generating service account / API credentials in CI scripts",
        "Producing one-time recovery codes for users",
        "Building default admin passwords for self-hosted installations",
        "Generating short PINs or tokens for verification flows",
      ],
      troubleshooting: [
        {
          problem: "Site rejected my password as too long.",
          solution: "Some legacy sites cap at 16-20 characters. Reduce length and ensure all required character classes are included.",
        },
        {
          problem: "Symbols disallowed by the target system.",
          solution: "Disable the symbols class and increase length to keep entropy high. A 24-char alphanumeric is stronger than a 12-char mixed-symbol password.",
        },
        {
          problem: "How do I remember this?",
          solution: "You don't — use a password manager (1Password, Bitwarden, KeePass). Memorise one strong master password and let the manager handle the rest.",
        },
      ],
    },
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    seoTitle: 'Regex Tester – Test Regex Online (Free Tool)',
    description: 'Free online Regex Tester tool to test and debug regular expressions with real-time matching. Highlight matches, view capture groups, and validate regex patterns instantly. Supports JavaScript regex syntax with flags for global, case-insensitive, and multiline matching. Perfect for developers and data extraction.',
    shortDescription: 'Test regular expressions online',
    category: 'dev',
    slug: 'regex-tester',
    icon: 'Regex',
    keywords: ['regex', 'regexp', 'regular expression', 'tester', 'pattern matcher'],
    tags: ['regex', 'pattern', 'tester', 'developer'],
    faq: [
      {
        question: 'What is a regular expression?',
        answer: 'A regular expression (regex) is a sequence of characters that defines a search pattern. It is used for pattern matching, validation, and text manipulation in programming.',
      },
      {
        question: 'Which regex flags are supported?',
        answer: 'Our tester supports common JavaScript flags: g (global), i (case-insensitive), m (multiline), s (dotAll), and u (unicode).',
      },
      {
        question: 'How do I test my regex?',
        answer: 'Enter your regex pattern in the pattern field, optionally add flags, then enter test text. Matches are highlighted in real-time as you type.',
      },
      {
        question: 'Can I see capture groups?',
        answer: 'Yes! When your regex contains capture groups (parentheses), the tool displays all captured groups with their indices and matched content.',
      },
      {
        question: 'What regex syntax does this use?',
        answer: 'This tool uses JavaScript regex syntax. While similar to PCRE, there may be slight differences. Check your target environment for compatibility.',
      },
    ],
    relatedTools: ['text-case-converter', 'find-and-replace', 'json-validator'],
    seoContent: {
      intro: "Regex Tester evaluates a regular expression against sample text and shows every match with its capture groups, position, and length. Use it to author and debug regexes for validation, parsing, or search-and-replace before pasting them into your code. Matching uses the browser's RegExp engine so the behaviour exactly matches what your JavaScript runtime will see.",
      examples: [
        {
          title: "Validate an email address",
          body: "Pattern: ^[\\w.-]+@[\\w-]+\\.[\\w.-]+$\nTest against multiple email samples and see which match — useful for tuning the regex before shipping it.",
        },
        {
          title: "Extract URLs from a paragraph",
          body: "Pattern: https?:\\/\\/[\\w./?#=&%-]+\nThe tester highlights each match and its index — copy any single match with a click.",
        },
        {
          title: "Replace with capture groups",
          body: "Pattern: (\\w+)\\s(\\w+) → replacement $2, $1\nFlips first/last name pairs across the entire input — a quick way to verify a complex substitution.",
        },
      ],
      useCases: [
        "Authoring form validation patterns for email, phone, zip",
        "Building log-parsing regexes that extract timestamps and message bodies",
        "Designing search-and-replace patterns for code-editor refactors",
        "Verifying captured groups in API URL routing rules",
        "Teaching regex syntax — instant feedback makes anchors and quantifiers click",
      ],
      troubleshooting: [
        {
          problem: "My regex matches in the tester but not in my code.",
          solution: "Check the flags. The tester supports g, i, m, s, u — make sure your code uses the same flags. Also verify your code escapes backslashes correctly (\\\\d in a string literal).",
        },
        {
          problem: "Pattern is \"too greedy\" and matches more than expected.",
          solution: "Use a non-greedy quantifier (.*? instead of .*), or constrain with character classes ([^\"]* between quotes instead of .*).",
        },
        {
          problem: "Catastrophic backtracking — tester hangs.",
          solution: "Patterns with nested quantifiers like (a+)+ can blow up on certain inputs. Refactor to avoid nested quantifiers or use possessive matching where available.",
        },
      ],
    },
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    seoTitle: 'JWT Decoder – Decode JWT Online (Free Tool)',
    description: 'Free online JWT Decoder tool to decode and inspect JSON Web Tokens (JWT) instantly. View header, payload, and signature details without needing the secret key. Decode and analyze JWT structure for debugging authentication flows. All decoding happens locally in your browser.',
    shortDescription: 'Decode JWT tokens online',
    category: 'dev',
    slug: 'jwt-decoder',
    icon: 'Shield',
    keywords: ['jwt', 'json web token', 'decoder', 'token', 'authentication'],
    tags: ['jwt', 'token', 'decoder', 'auth', 'security', 'developer'],
    faq: [
      {
        question: 'What is a JWT?',
        answer: 'JWT (JSON Web Token) is a compact, URL-safe token format for securely transmitting information between parties. It consists of header, payload, and signature separated by dots.',
      },
      {
        question: 'Can I decode any JWT?',
        answer: 'Yes, you can decode the header and payload of any JWT without the secret key. However, verifying the signature requires the secret key used to sign it.',
      },
      {
        question: 'Is decoding a JWT secure?',
        answer: 'Decoding only reveals the base64-encoded payload. It does not verify authenticity. Never put sensitive secrets in JWT payloads as they can be decoded by anyone.',
      },
      {
        question: 'What algorithms are supported?',
        answer: 'Our decoder supports common JWT algorithms including HS256, HS384, HS512, RS256, RS384, RS512, and ES256. The header shows which algorithm was used.',
      },
      {
        question: 'Why decode JWTs?',
        answer: 'Developers decode JWTs to debug authentication issues, inspect token expiration, check user claims, and verify correct token structure during development.',
      },
    ],
    relatedTools: ['jwt-encoder', 'base64-decode', 'json-formatter'],
    seoContent: {
      intro:
        'JWT Decoder splits a JSON Web Token into its three parts — header, payload, signature — and base64url-decodes the first two so you can read the claims. It is the same view you get from jwt.io, but the token is decoded locally; nothing is uploaded. Use it when you need to confirm the algorithm, inspect the `exp` claim, or just see what your auth provider actually puts in the payload.',
      examples: [
        {
          title: 'Inspect an expiring token',
          body: 'Paste a token and read the `exp` claim. Compare its value (Unix seconds) to the current time to see how long the session has left.',
        },
        {
          title: 'Confirm the signing algorithm',
          body: 'The header shows `alg`. If you expect RS256 but see HS256, your library may be misconfigured — this is a classic JWT vulnerability vector.',
        },
        {
          title: 'Debug claim shape',
          body: 'Login fails because the backend expects `sub` but the IdP issues `user_id`. Decoding the token surfaces the mismatch instantly.',
        },
      ],
      useCases: [
        'Debugging "401 Unauthorized" errors in API calls',
        'Verifying that an access token contains the expected scopes/roles',
        'Inspecting token expiry before retrying a failed request',
        'Comparing tokens issued by different identity providers',
        'Training and onboarding when explaining how JWTs work',
      ],
      troubleshooting: [
        {
          problem: '"Invalid token" error.',
          solution:
            'Make sure you pasted exactly three base64url segments separated by dots. Stray quotation marks, leading "Bearer ", or whitespace break the parse.',
        },
        {
          problem: 'Payload claims look garbled.',
          solution:
            'The token uses base64url (not standard base64). Our decoder handles that, but if you decoded by hand elsewhere, substitute "-" with "+" and "_" with "/" and add padding.',
        },
        {
          problem: 'I can see the payload — is my token compromised?',
          solution:
            'Any holder of the token can read its payload; that is by design. Confidentiality comes from how you store and transmit the token, not from JWT itself.',
        },
      ],
    },
  },
  {
    id: 'md5-hash-generator',
    name: 'MD5 Hash Generator',
    seoTitle: 'MD5 Hash Generator – Generate MD5 Online (Free Tool)',
    description: 'Free online MD5 Hash Generator tool to generate MD5 hash from text or strings. Create 128-bit MD5 checksums for file verification and data integrity. Note: MD5 is not recommended for security purposes due to collision vulnerabilities. All generation happens locally.',
    shortDescription: 'Generate MD5 hash online',
    category: 'dev',
    slug: 'md5-hash-generator',
    icon: 'Hash',
    keywords: ['md5', 'hash', 'generator', 'checksum', 'md5 hash'],
    tags: ['md5', 'hash', 'checksum', 'security', 'developer'],
    faq: [
      {
        question: 'What is MD5 hash used for?',
        answer: 'MD5 hashes are commonly used for verifying file integrity, checksum validation, and creating unique identifiers. Note: MD5 is not recommended for security purposes due to known vulnerabilities.',
      },
      {
        question: 'Is MD5 secure for passwords?',
        answer: 'No, MD5 is not secure for password hashing. It is vulnerable to collision attacks and can be cracked quickly. Use bcrypt or SHA-256 for password hashing instead.',
      },
      {
        question: 'How long is an MD5 hash?',
        answer: 'MD5 always produces a 128-bit (16-byte) hash value, typically represented as a 32-character hexadecimal string.',
      },
      {
        question: 'Can MD5 be reversed?',
        answer: 'No, MD5 is a one-way hash function and cannot be mathematically reversed. However, rainbow tables can be used to look up common inputs for known MD5 hashes.',
      },
      {
        question: 'What is an MD5 collision?',
        answer: 'A collision occurs when two different inputs produce the same MD5 hash. MD5 is vulnerable to collision attacks, which is why it should not be used for security purposes.',
      },
    ],
    exampleOutput: {
      input: 'Hello World',
      output: 'b10a8db164e0754105b7a99be72e3fe5',
      description: 'MD5 hash always produces a 32-character hexadecimal string',
    },
    relatedTools: ['sha256-hash-generator', 'bcrypt-hash-generator', 'base64-encode'],
    seoContent: {
      intro: "MD5 Hash Generator produces a 128-bit MD5 digest of your input as a 32-character hex string. MD5 is no longer suitable for security purposes (it has known collisions) but remains useful for checksums, cache keys, and detecting non-malicious content changes. Hashing runs in the browser using a pure-JS implementation; your input never leaves the page.",
      examples: [
        {
          title: "Generate a cache key",
          body: "Hash a request URL plus its body to get a deterministic cache key for memoising idempotent API calls.",
        },
        {
          title: "Verify a download",
          body: "Compute the MD5 of a downloaded file and compare with the publisher's checksum to confirm the bytes match.",
        },
        {
          title: "De-duplicate user uploads",
          body: "Hash each uploaded image and store the digest; new uploads with the same hash can reuse the existing file.",
        },
      ],
      useCases: [
        "File integrity checks (not for security — use SHA-256 for that)",
        "Generating deterministic cache keys from variable inputs",
        "Quick de-duplication of records by content hash",
        "ETag values for HTTP caching of static assets",
        "Hashing email addresses for Gravatar-style avatar URLs",
      ],
      troubleshooting: [
        {
          problem: "Different MD5s for what should be the same input.",
          solution: "Whitespace, line endings, or BOM differ. Normalise the input (trim, strip BOM, use \\n only) before hashing.",
        },
        {
          problem: "Should I use MD5 for passwords?",
          solution: "No. MD5 is fast and broken for cryptographic use. Use bcrypt, argon2, or scrypt for password hashing — they are intentionally slow and salted.",
        },
        {
          problem: "Hash differs from my server-side MD5.",
          solution: "Check the encoding. The browser hashes UTF-8 bytes; some server libraries default to Latin-1 or UCS-2. Make both sides agree on UTF-8.",
        },
      ],
    },
  },
  {
    id: 'sha256-hash-generator',
    name: 'SHA256 Hash Generator',
    seoTitle: 'SHA256 Hash Generator – Generate SHA256 Online (Free Tool)',
    description: 'Free online SHA256 Hash Generator tool to generate SHA256 hash from text or strings. Create secure 256-bit cryptographic hashes for data integrity and verification. SHA-256 is recommended for security-sensitive applications. All generation happens locally in your browser.',
    shortDescription: 'Generate SHA256 hash online',
    category: 'dev',
    slug: 'sha256-hash-generator',
    icon: 'Hash',
    keywords: ['sha256', 'hash', 'generator', 'checksum', 'secure hash'],
    tags: ['sha256', 'hash', 'checksum', 'security', 'developer'],
    faq: [
      {
        question: 'Why use SHA-256 over MD5?',
        answer: 'SHA-256 is cryptographically secure and produces a 256-bit hash, making it much more resistant to collision attacks than MD5. It is recommended for security-sensitive applications.',
      },
      {
        question: 'What is SHA-256 used for?',
        answer: 'SHA-256 is used for password hashing (with salt), digital signatures, file integrity verification, cryptocurrency transactions, and SSL/TLS certificates.',
      },
      {
        question: 'How long is a SHA-256 hash?',
        answer: 'SHA-256 always produces a 256-bit (32-byte) hash value, represented as a 64-character hexadecimal string.',
      },
      {
        question: 'Can SHA-256 be decrypted?',
        answer: 'No, SHA-256 is a one-way hash function. It cannot be reversed or decrypted. The only way to find the original input is through brute-force or rainbow table attacks.',
      },
      {
        question: 'Is SHA-256 secure?',
        answer: 'Yes, SHA-256 is currently considered secure for most cryptographic purposes. It is used in Bitcoin, SSL/TLS certificates, and many security protocols.',
      },
    ],
    exampleOutput: {
      input: 'Hello World',
      output: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      description: 'SHA-256 always produces a 64-character hexadecimal string',
    },
    relatedTools: ['md5-hash-generator', 'bcrypt-hash-generator', 'base64-encode'],
    seoContent: {
      intro: "SHA-256 Hash Generator produces a 256-bit SHA-2 digest as a 64-character hex string. SHA-256 is the modern standard for content addressing, digital signatures, and integrity verification — it powers Bitcoin, Git, TLS certificates, and most file-checksum workflows. Hashing happens locally in the browser via the Web Crypto API; nothing is uploaded.",
      examples: [
        {
          title: "Verify a release artifact",
          body: "Hash a downloaded .tar.gz and match against the SHA-256 sum on the project's release page — confirms the file wasn't tampered with in transit.",
        },
        {
          title: "Generate a content-addressed filename",
          body: "Use the hash of a file's contents as part of its stored name — identical files dedupe automatically.",
        },
        {
          title: "Build a signed-URL nonce",
          body: "Hash a secret plus a request timestamp to produce a verification value the receiver can independently recompute.",
        },
      ],
      useCases: [
        "Verifying integrity of file downloads (SHA-256 checksums)",
        "Content-addressed storage (CAS) systems like Git's object DB",
        "Generating HMAC verification values for webhooks (Stripe, GitHub)",
        "Building auth tokens that can be validated without a database lookup",
        "Storing password hashes (combined with bcrypt/argon2 for stretching)",
      ],
      troubleshooting: [
        {
          problem: "Different SHA-256 for identical-looking inputs.",
          solution: "Line endings or trailing whitespace differ. Use a hex viewer or a \"show invisibles\" toggle in your editor to spot the difference.",
        },
        {
          problem: "My HMAC verification is failing on the server.",
          solution: "HMAC needs the same key and same input bytes on both sides. Verify both are UTF-8 encoded and the key isn't accidentally trimmed/padded.",
        },
        {
          problem: "How does this compare to SHA-1?",
          solution: "SHA-1 is deprecated (collisions found in 2017). Use SHA-256 for anything new. They produce different-length outputs (40 vs 64 hex chars).",
        },
      ],
    },
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    seoTitle: 'HTML Formatter – Format & Beautify HTML Online (Free Tool)',
    description: 'Free online HTML Formatter tool to format and beautify HTML code with proper indentation instantly. Clean up messy HTML markup, fix indentation issues, and make code easy to read. Perfect for web developers working with HTML templates and documents. All formatting happens locally.',
    shortDescription: 'Format and beautify HTML code',
    category: 'dev',
    slug: 'html-formatter',
    icon: 'Code',
    keywords: ['html', 'formatter', 'beautify', 'format html', 'html prettifier'],
    tags: ['html', 'formatter', 'beautify', 'web', 'developer'],
    faq: [
      {
        question: 'What is HTML formatting?',
        answer: 'HTML formatting adds proper indentation, line breaks, and structure to HTML code, making it easier to read and maintain.',
      },
      {
        question: 'Does formatting change how the page looks?',
        answer: 'No, formatting only changes the code structure. The rendered webpage looks exactly the same—only the source code becomes more readable.',
      },
      {
        question: 'What indentation style is used?',
        answer: 'Our formatter uses 2-space indentation by default, which is the most common convention for HTML. Nested elements are properly indented.',
      },
      {
        question: 'Can it handle inline JavaScript and CSS?',
        answer: 'Yes, the formatter preserves inline JavaScript and CSS while properly indenting the surrounding HTML structure.',
      },
      {
        question: 'Is my HTML code secure?',
        answer: 'Absolutely! All formatting happens locally in your browser. Your code is never sent to any external server.',
      },
    ],
    relatedTools: ['css-formatter', 'json-formatter', 'html-encode-decode'],
    seoContent: {
      intro: "HTML Formatter prettifies minified or messy HTML with consistent indentation, attribute wrapping, and tag closure. Use it on copy-pasted output from a build pipeline, on legacy templates with mixed indentation, or on machine-generated HTML you need to review in a pull request. Formatting runs in the browser — your markup never touches a server.",
      examples: [
        {
          title: "Beautify minified HTML",
          body: "Paste a one-line minified document and get a properly indented version with each tag on its own line — easy to scan and diff.",
        },
        {
          title: "Normalise mixed indentation",
          body: "A template with 2-space, 4-space, and tab indentation becomes uniform with your chosen indent — removes diff noise across team members.",
        },
        {
          title: "Auto-close unbalanced tags",
          body: "Paste HTML missing a few closing tags and the formatter highlights or fixes them, depending on settings.",
        },
      ],
      useCases: [
        "Reviewing HTML output from a static-site generator",
        "Reformatting templates before committing to git",
        "Cleaning up email HTML before sending to a marketing platform",
        "Inspecting third-party widget HTML embedded on your site",
        "Teaching HTML structure — indentation makes nesting obvious",
      ],
      troubleshooting: [
        {
          problem: "Inline tags split across lines and broke spacing.",
          solution: "Inline elements (a, span, strong) preserve whitespace. Switch to \"inline tags on one line\" in the options or wrap text in a block element to control spacing.",
        },
        {
          problem: "Self-closing tags came out as <br></br>.",
          solution: "XHTML and HTML5 self-closing rules differ. Switch the dialect to HTML5 to render void elements as <br>, or XHTML for <br />.",
        },
        {
          problem: "Pre / code blocks lost their formatting.",
          solution: "The formatter should preserve content inside <pre> and <code>. If it doesn't, escape the content with HTML entities or wrap in <!-- prettier-ignore -->.",
        },
      ],
    },
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    seoTitle: 'CSS Formatter – Format & Beautify CSS Online (Free Tool)',
    description: 'Free online CSS Formatter tool to format and beautify CSS stylesheets with proper indentation. Clean up minified or messy CSS code and make it easy to read and debug. Perfect for web developers working with stylesheets and CSS frameworks. All formatting happens locally in your browser.',
    shortDescription: 'Format and beautify CSS code',
    category: 'dev',
    slug: 'css-formatter',
    icon: 'Palette',
    keywords: ['css', 'formatter', 'beautify', 'format css', 'css prettifier'],
    tags: ['css', 'formatter', 'beautify', 'web', 'developer'],
    faq: [
      {
        question: 'Why format CSS code?',
        answer: 'Formatted CSS is easier to read, debug, and maintain. It helps identify errors, understand the cascade, and collaborate with other developers.',
      },
      {
        question: 'What formatting style is applied?',
        answer: 'Each selector and property is placed on its own line with proper indentation. Opening braces stay on the selector line, and closing braces align with the selector.',
      },
      {
        question: 'Can it format CSS preprocessors?',
        answer: 'This tool formats standard CSS. While it can process SCSS/SASS syntax, some preprocessor-specific features may not format perfectly.',
      },
      {
        question: 'Does formatting affect performance?',
        answer: 'For production, use minified CSS. But during development, formatted CSS helps debugging. Our tool can format minified CSS back to readable form.',
      },
      {
        question: 'Is my CSS data private?',
        answer: 'Yes! All formatting happens locally in your browser. Your stylesheets are never sent to external servers.',
      },
    ],
    relatedTools: ['html-formatter', 'json-formatter', 'css-gradient-generator'],
    seoContent: {
      intro: "CSS Formatter beautifies CSS, SCSS-style nested rules, and PostCSS output with one declaration per line, consistent spacing, and lowercase hex colours. Useful for cleaning up minified stylesheets, normalising team-authored CSS, or comparing two stylesheets line-by-line in a diff. Runs entirely in the browser.",
      examples: [
        {
          title: "Unminify production CSS",
          body: "A one-line minified bundle becomes a readable stylesheet with rules grouped and properties aligned — easy to inspect specific selectors.",
        },
        {
          title: "Standardise spacing",
          body: "Mixed styles (margin:0 vs margin: 0) collapse to a consistent format defined by your options.",
        },
        {
          title: "Sort declarations",
          body: "Toggle \"sort declarations\" to alphabetise properties within each rule — helps diff stylesheets across versions.",
        },
      ],
      useCases: [
        "Inspecting third-party / vendor CSS from a CDN",
        "Cleaning up CSS that came out of a design-to-code tool",
        "Normalising team-authored CSS before committing",
        "Building consistent input for a linting / static-analysis tool",
        "Producing readable CSS for inclusion in blog posts and docs",
      ],
      troubleshooting: [
        {
          problem: "Vendor prefixes got stripped.",
          solution: "They shouldn't be — formatting preserves all properties. If they're missing, run a separate autoprefixer step instead.",
        },
        {
          problem: "CSS variables (--foo) got dropped.",
          solution: "Custom properties are valid CSS and should survive formatting. If they vanish, check the input for typos: the property name must start with double dashes.",
        },
        {
          problem: "Comments moved to weird positions.",
          solution: "Block comments inside a rule end up before the next declaration. Move them outside the rule or use /*! ... */ to mark them as preserved.",
        },
      ],
    },
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    seoTitle: 'SQL Formatter – Format & Beautify SQL Online (Free Tool)',
    description: 'Free online SQL Formatter tool to format and beautify SQL queries with proper indentation instantly. Clean up messy SQL code, improve readability, and debug complex queries. Supports standard SQL syntax for MySQL, PostgreSQL, SQL Server, and more. All formatting happens locally.',
    shortDescription: 'Format and beautify SQL queries',
    category: 'dev',
    slug: 'sql-formatter',
    icon: 'Database',
    keywords: ['sql', 'formatter', 'beautify', 'format sql', 'sql prettifier'],
    tags: ['developer', 'sql', 'formatter', 'beautify', 'format', 'prettifier'],
    faq: [
      {
        question: 'Why format SQL queries?',
        answer: 'Formatted SQL is easier to read, debug, and maintain. Complex JOINs and subqueries become much more understandable with proper formatting.',
      },
      {
        question: 'Which SQL dialects are supported?',
        answer: 'Our formatter supports standard SQL syntax used in MySQL, PostgreSQL, SQL Server, Oracle, and SQLite. Most queries will format correctly.',
      },
      {
        question: 'How are keywords formatted?',
        answer: 'SQL keywords (SELECT, FROM, WHERE, etc.) are capitalized and placed on new lines for better readability. Each clause is clearly separated.',
      },
      {
        question: 'Can it handle complex queries?',
        answer: 'Yes! The formatter handles subqueries, CTEs (WITH clauses), JOINs, UNIONs, and nested expressions with proper indentation.',
      },
      {
        question: 'Is my SQL data sent anywhere?',
        answer: 'No, all formatting happens locally in your browser. Your SQL queries remain completely private and never leave your device.',
      },
    ],
    relatedTools: ['json-formatter', 'excel-to-sql', 'csv-to-json'],
    seoContent: {
      intro: "SQL Formatter rewrites SQL queries with consistent indentation, keyword casing, and line breaks. Whether your input is a generated query from an ORM, a long ad-hoc analytics query, or a stored procedure pulled from version control, formatting makes the logic much easier to follow. Supports common dialects (PostgreSQL, MySQL, SQL Server, SQLite).",
      examples: [
        {
          title: "Format an ORM-generated query",
          body: "A 200-character single-line SELECT from Sequelize or SQLAlchemy becomes a multi-line, indented query you can read and tune.",
        },
        {
          title: "Compare two queries",
          body: "Format both queries to identical conventions and diff them line-by-line — the only differences are the real ones.",
        },
        {
          title: "Uppercase keywords",
          body: "Toggle \"uppercase keywords\" to enforce SELECT/FROM/WHERE in caps — common style in many SQL style guides.",
        },
      ],
      useCases: [
        "Reviewing ORM-generated queries during query optimisation",
        "Cleaning up ad-hoc analyst queries before committing to a repo",
        "Producing readable SQL for inclusion in documentation",
        "Pre-processing for a SQL static-analysis tool that prefers canonical input",
        "Teaching SQL — the visual structure makes joins and subqueries clearer",
      ],
      troubleshooting: [
        {
          problem: "Dialect-specific syntax got rejected.",
          solution: "Switch the SQL dialect in the options. Postgres ARRAY[] or MySQL LIMIT 10, 5 may be invalid in a different dialect.",
        },
        {
          problem: "Strings got reformatted unexpectedly.",
          solution: "The formatter should not touch string literal contents. If it does, escape any embedded single quotes or use dollar-quoted strings ($...$ in Postgres).",
        },
        {
          problem: "CTE / window function indentation looks odd.",
          solution: "Complex SQL has many valid indentation styles. Try different \"indent CTE\" or \"align args\" toggles to match your team's preference.",
        },
      ],
    },
  },
  {
    id: 'ip-address-validator',
    name: 'IP Address Validator',
    seoTitle: 'IP Address Validator – Validate IP Online (Free Tool)',
    description: 'Free online IP Address Validator tool to validate IPv4 and IPv6 addresses instantly. Check if an IP address is valid and get detailed information about the address type. Supports both public and private IP ranges. All validation happens locally in your browser.',
    shortDescription: 'Validate IP addresses online',
    category: 'dev',
    slug: 'ip-address-validator',
    icon: 'Globe',
    keywords: ['ip', 'ip address', 'validator', 'ipv4', 'ipv6'],
    tags: ['developer', 'validator', 'ipv4', 'ipv6', 'address'],
    faq: [
      {
        question: 'What is an IP address?',
        answer: 'An IP address is a unique numerical identifier assigned to devices on a network. IPv4 uses 32 bits (e.g., 192.168.1.1), while IPv6 uses 128 bits.',
      },
      {
        question: 'How do I know if an IP is valid?',
        answer: 'Enter any IP address and our tool instantly validates it, showing whether it is a valid IPv4 or IPv6 address and providing details about its type.',
      },
      {
        question: 'What is the difference between IPv4 and IPv6?',
        answer: 'IPv4 uses dot-decimal notation (192.168.1.1) with 4.3 billion possible addresses. IPv6 uses hexadecimal notation with virtually unlimited addresses.',
      },
      {
        question: 'What are private IP addresses?',
        answer: 'Private IPs (like 192.168.x.x or 10.x.x.x) are used within local networks and are not routable on the internet. They are reserved for internal use.',
      },
      {
        question: 'Is my IP address private?',
        answer: 'The tool identifies whether an IP is public (internet-routable) or private (local network only), helping you understand network configurations.',
      },
    ],
    relatedTools: ['url-parser', 'http-status-codes', 'user-agent-parser'],
  },
  {
    id: 'cron-expression-parser',
    name: 'Cron Expression Parser',
    seoTitle: 'Cron Expression Parser – Parse Cron Online (Free Tool)',
    description: 'Free online Cron Expression Parser tool to parse and explain cron expressions instantly. Understand when your cron jobs will run with human-readable descriptions. Debug cron schedules and validate cron syntax for job automation. Perfect for DevOps and system administrators.',
    shortDescription: 'Parse cron expressions online',
    category: 'dev',
    slug: 'cron-expression-parser',
    icon: 'Timer',
    keywords: ['cron', 'expression', 'parser', 'schedule', 'cron job'],
    tags: ['developer', 'cron', 'expression', 'parser', 'schedule', 'job'],
    faq: [
      {
        question: 'What is a cron expression?',
        answer: 'A cron expression is a string of 5 or 6 fields separated by spaces that represents a schedule. It defines when a cron job should run.',
      },
      {
        question: 'What do the cron fields mean?',
        answer: 'The 5 fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-7). Some systems add a 6th field for seconds.',
      },
      {
        question: 'How do I read a cron expression?',
        answer: 'Enter your cron expression and our tool instantly shows a human-readable description and the next scheduled run times.',
      },
      {
        question: 'What are common cron examples?',
        answer: '`0 * * * *` runs hourly, `0 0 * * *` runs daily at midnight, `0 0 * * 0` runs weekly on Sunday, and `0 0 1 * *` runs monthly on the first.',
      },
      {
        question: 'Does it support special characters?',
        answer: 'Yes, our parser supports *, /, -, and L (last) special characters used in cron expressions for flexible scheduling.',
      },
    ],
    relatedTools: ['countdown-timer', 'time-converter', 'timestamp-converter'],
  },
  {
    id: 'json-minify',
    name: 'JSON Minify',
    seoTitle: 'JSON Minify – Free Online Tool',
    description: 'Free online JSON Minify tool to compress and minify JSON data by removing whitespace and formatting. Reduce JSON file size for production use and faster data transfer. All minification happens locally in your browser ensuring complete privacy.',
    shortDescription: 'Minify JSON data online',
    category: 'dev',
    slug: 'json-minify',
    icon: 'Minimize2',
    keywords: ['json', 'minify', 'compress json', 'reduce json size', 'json minifier'],
    tags: ['json', 'minifier', 'compress', 'developer'],
    faq: [
      {
        question: 'What is JSON minification?',
        answer: 'JSON minification removes unnecessary whitespace, line breaks, and indentation from JSON data, reducing file size for faster transmission over networks.',
      },
      {
        question: 'Why minify JSON?',
        answer: 'Minified JSON files are smaller, which means faster downloads, reduced bandwidth costs, and improved API response times in production.',
      },
      {
        question: 'How much does minification reduce size?',
        answer: 'Typical size reduction is 20-50% depending on the original formatting. Heavily indented JSON with lots of whitespace sees the most benefit.',
      },
      {
        question: 'Does minification affect functionality?',
        answer: 'No, minified JSON is functionally identical to formatted JSON. All data is preserved—only unnecessary whitespace is removed.',
      },
      {
        question: 'Can I un-minify JSON later?',
        answer: 'Yes! Use our JSON Formatter tool to beautify minified JSON back to a readable format with proper indentation.',
      },
    ],
    relatedTools: ['json-formatter', 'json-validator', 'json-diff'],
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    seoTitle: 'JSON Diff – Free Online Tool',
    description: 'Free online JSON Diff tool to compare two JSON objects and find differences instantly. Highlight added, removed, and changed properties between JSON structures. Perfect for debugging API responses and comparing configuration files. All comparison happens locally.',
    shortDescription: 'Compare JSON and find differences',
    category: 'dev',
    slug: 'json-diff',
    icon: 'GitCompare',
    keywords: ['json', 'diff', 'compare json', 'json compare', 'json difference'],
    tags: ['developer', 'json', 'diff', 'compare', 'difference'],
    faq: [
      {
        question: 'How does JSON diff work?',
        answer: 'The tool parses both JSON inputs and recursively compares their structure, highlighting any differences in values, added or removed keys, and type changes.',
      },
      {
        question: 'What types of differences are detected?',
        answer: 'The tool detects added keys, removed keys, changed values, type changes (e.g., string to number), and nested object/array differences.',
      },
      {
        question: 'Does order matter in JSON diff?',
        answer: 'For objects, key order does not affect comparison—{a:1, b:2} equals {b:2, a:1}. For arrays, element order matters.',
      },
      {
        question: 'Can I compare arrays?',
        answer: 'Yes! The diff tool handles both JSON objects and arrays, comparing element by element and highlighting position-specific changes.',
      },
      {
        question: 'Is my JSON data private?',
        answer: 'Absolutely! All comparison happens locally in your browser. Your JSON data is never sent to external servers.',
      },
    ],
    relatedTools: ['json-formatter', 'json-validator', 'json-minify'],
  },
  {
    id: 'html-encode-decode',
    name: 'HTML Encode/Decode',
    seoTitle: 'HTML Encode/Decode – Free Online Tool',
    description: 'Free online HTML Encode/Decode tool to encode text to HTML entities or decode HTML entities back to text. Handle special characters like angle brackets, ampersands, and quotes for safe HTML display. All encoding and decoding happens locally in your browser.',
    shortDescription: 'Encode/Decode HTML entities',
    category: 'dev',
    slug: 'html-encode-decode',
    icon: 'Code',
    keywords: ['html', 'encode', 'decode', 'html entities', 'html special characters'],
    tags: ['developer', 'html', 'encode', 'decode', 'entities', 'special', 'characters'],
    faq: [
      {
        question: 'What are HTML entities?',
        answer: 'HTML entities are special codes that represent characters that have special meaning in HTML, such as <, >, &, and ". Encoding them ensures they display correctly in browsers.',
      },
      {
        question: 'Why encode HTML entities?',
        answer: 'Encoding prevents browsers from interpreting special characters as HTML markup. This is essential when displaying code snippets or user-generated content.',
      },
      {
        question: 'What characters are encoded?',
        answer: "Common encoded characters include < (lt), > (gt), & (amp), \" (quot), and ' (apos). Non-ASCII characters may also be encoded as numeric entities.",
      },
      {
        question: 'When should I decode HTML entities?',
        answer: 'Decode when you need the original characters back, such as when processing form data, parsing RSS feeds, or cleaning imported content.',
      },
      {
        question: 'Is my data secure during encoding?',
        answer: 'Yes! All encoding and decoding happens locally in your browser. Your text is never sent to any external server.',
      },
    ],
    relatedTools: ['url-encode', 'base64-encode', 'rot13-encoder'],
  },
  {
    id: 'query-string-parser',
    name: 'Query String Parser',
    seoTitle: 'Query String Parser – Parse Query Online (Free Tool)',
    description: 'Free online Query String Parser tool to parse and analyze URL query strings instantly. Extract key-value pairs from URL parameters and view them in an organized format. Perfect for debugging URLs and API calls. All parsing happens locally in your browser.',
    shortDescription: 'Parse URL query strings',
    category: 'dev',
    slug: 'query-string-parser',
    icon: 'Link',
    keywords: ['query string', 'url params', 'parse url', 'query params', 'url parser'],
    tags: ['developer', 'query', 'string', 'url', 'params', 'parse', 'parser'],
    faq: [
      {
        question: 'What is a query string?',
        answer: 'A query string is the part of a URL after the ? character, containing key-value pairs separated by &. It is commonly used to pass data between web pages.',
      },
      {
        question: 'How are parameters separated?',
        answer: 'Query parameters are separated by & symbols. Each parameter consists of a key and value connected by = (e.g., key1=value1&key2=value2).',
      },
      {
        question: 'Does it handle URL-encoded values?',
        answer: 'Yes! The parser automatically decodes URL-encoded values, showing the original text for parameters with special characters.',
      },
      {
        question: 'Can I parse multiple values for the same key?',
        answer: 'Yes, the parser handles array-style query parameters like colors=red&colors=blue and displays all values for each key.',
      },
      {
        question: 'What if my URL is malformed?',
        answer: 'The parser is forgiving and will still extract any valid parameters it can find, even if the URL has minor formatting issues.',
      },
    ],
    relatedTools: ['url-parser', 'url-encode', 'url-decode'],
  },
  {
    id: 'url-parser',
    name: 'URL Parser',
    seoTitle: 'URL Parser – Parse URL Online (Free Tool)',
    description: 'Free online URL Parser tool to parse and analyze URLs instantly. Extract protocol, host, port, path, query parameters, and fragment from any URL. Debug URLs and understand their components. All parsing happens locally in your browser.',
    shortDescription: 'Parse and analyze URLs',
    category: 'dev',
    slug: 'url-parser',
    icon: 'ExternalLink',
    keywords: ['url', 'parser', 'parse url', 'url components', 'url breakdown'],
    tags: ['developer', 'url', 'parser', 'parse', 'components', 'breakdown'],
    faq: [
      {
        question: 'What URL components can be extracted?',
        answer: 'The parser extracts protocol (http/https), hostname, port number, path, query parameters, and fragment (hash) from any valid URL.',
      },
      {
        question: 'What is a URL fragment?',
        answer: 'A fragment (or hash) is the part after # in a URL. It typically points to a specific section within a page and is not sent to the server.',
      },
      {
        question: 'How does the parser handle special characters?',
        answer: 'The parser properly handles URL-encoded characters, punycode domains, and internationalized domain names (IDNs).',
      },
      {
        question: 'Can it parse relative URLs?',
        answer: 'Yes, the parser can handle relative URLs (paths without a domain). It shows all available components for any URL format.',
      },
      {
        question: 'Is my URL data private?',
        answer: 'Absolutely! All parsing happens locally in your browser. Your URLs are never sent to external servers.',
      },
    ],
    relatedTools: ['query-string-parser', 'url-encode', 'url-decode'],
  },
  {
    id: 'http-status-codes',
    name: 'HTTP Status Code Lookup',
    seoTitle: 'HTTP Status Code Lookup – Free Online Tool',
    description: 'Free HTTP Status Codes lookup tool with complete reference guide. Find meanings and descriptions for all HTTP response codes including 1xx informational, 2xx success, 3xx redirection, 4xx client error, and 5xx server error status codes. Perfect for debugging web applications and APIs.',
    shortDescription: 'HTTP status code reference',
    category: 'dev',
    slug: 'http-status-codes',
    icon: 'Server',
    keywords: ['http', 'status code', 'http code', '404', '500', 'http response'],
    tags: ['developer', 'http', '404', '500', 'status', 'code', 'response'],
    faq: [
      {
        question: 'What are HTTP status codes?',
        answer: 'HTTP status codes are standardized codes returned by web servers to indicate the result of a request. They are grouped into classes: 1xx (informational), 2xx (success), 3xx (redirection), 4xx (client error), 5xx (server error).',
      },
      {
        question: 'What does 404 mean?',
        answer: '404 Not Found means the requested resource does not exist on the server. It is one of the most common HTTP error codes.',
      },
      {
        question: 'What is the difference between 401 and 403?',
        answer: '401 Unauthorized means authentication is required. 403 Forbidden means the request is understood but the server refuses to authorize it.',
      },
      {
        question: 'What are 5xx errors?',
        answer: '5xx codes indicate server errors. Common ones include 500 (Internal Server Error), 502 (Bad Gateway), 503 (Service Unavailable), and 504 (Gateway Timeout).',
      },
      {
        question: 'Why do I need to know HTTP codes?',
        answer: 'Understanding HTTP status codes helps debug API issues, implement proper error handling, and build more robust web applications.',
      },
    ],
    relatedTools: ['ip-address-validator', 'user-agent-parser', 'url-parser'],
  },
  {
    id: 'user-agent-parser',
    name: 'User Agent Parser',
    seoTitle: 'User Agent Parser – Parse User Online (Free Tool)',
    description: 'Free online User Agent Parser tool to parse and analyze User Agent strings. Extract browser name, version, operating system, and device information from UA strings. Perfect for web analytics and debugging browser compatibility issues.',
    shortDescription: 'Parse User Agent strings',
    category: 'dev',
    slug: 'user-agent-parser',
    icon: 'Monitor',
    keywords: ['user agent', 'ua parser', 'browser detection', 'device detection', 'user agent parser'],
    tags: ['developer', 'user', 'agent', 'parser', 'detection', 'device'],
    faq: [
      {
        question: 'What is a User Agent string?',
        answer: 'A User Agent string is sent by browsers and applications to identify themselves to web servers. It contains information about the browser name, version, operating system, and sometimes device type.',
      },
      {
        question: 'Why parse User Agent strings?',
        answer: 'Parsing User Agents helps with analytics, browser-specific fixes, device detection for responsive design, and debugging compatibility issues.',
      },
      {
        question: 'Can User Agents be spoofed?',
        answer: 'Yes, User Agent strings can be easily faked. They should not be relied upon for security decisions, only for analytics and best-effort feature detection.',
      },
      {
        question: 'What information can be extracted?',
        answer: 'The parser extracts browser name and version, operating system, OS version, device type (mobile/tablet/desktop), and sometimes CPU architecture.',
      },
      {
        question: 'What is my current User Agent?',
        answer: 'Your browser sends a User Agent with every request. Our tool can detect and parse your current User Agent automatically.',
      },
    ],
    relatedTools: ['http-status-codes', 'ip-address-validator', 'url-parser'],
  },
  {
    id: 'binary-converter',
    name: 'Binary Converter',
    seoTitle: 'Binary Converter – Convert Binary Online (Free Tool)',
    description: 'Free online Binary Converter tool to convert text to binary and binary to text. Translate between human-readable text and binary representation using zeros and ones. Perfect for learning binary encoding and data representation. All conversion happens locally.',
    shortDescription: 'Convert text to/from binary',
    category: 'dev',
    slug: 'binary-converter',
    icon: 'Binary',
    keywords: ['binary', 'converter', 'text to binary', 'binary to text', 'binary code'],
    tags: ['developer', 'binary', 'converter', 'code'],
    faq: [
      {
        question: 'What is binary representation?',
        answer: 'Binary representation uses only 0s and 1s to encode data. Each character is converted to its 8-bit binary equivalent based on its ASCII/Unicode code.',
      },
      {
        question: 'How do I read binary?',
        answer: 'Each 8-bit group represents one character. For example, 01000001 represents A. Reading from right to left, each position doubles: 1, 2, 4, 8, 16, 32, 64, 128.',
      },
      {
        question: 'Why use binary conversion?',
        answer: 'Binary conversion helps understand how computers store text, is useful for learning computer science concepts, and can be used for simple encoding purposes.',
      },
      {
        question: 'Can I convert numbers to binary?',
        answer: 'Yes! Enter a number and it will be converted to its binary representation. For example, 255 becomes 11111111.',
      },
      {
        question: 'What character encoding is used?',
        answer: 'The converter uses UTF-8 encoding by default, supporting ASCII characters (0-127) and extended Unicode characters.',
      },
    ],
    relatedTools: ['hex-converter', 'ascii-converter', 'base64-encode'],
  },
  {
    id: 'hex-converter',
    name: 'Hex Converter',
    seoTitle: 'Hex Converter – Convert Hex Online (Free Tool)',
    description: 'Free online Hex Converter tool to convert text to hexadecimal and hexadecimal to text. Translate between human-readable text and hex representation using 0-9 and A-F characters. Perfect for encoding data and debugging. All conversion happens locally in your browser.',
    shortDescription: 'Convert text to/from hexadecimal',
    category: 'dev',
    slug: 'hex-converter',
    icon: 'Hash',
    keywords: ['hex', 'hexadecimal', 'converter', 'text to hex', 'hex to text'],
    tags: ['developer', 'hex', 'hexadecimal', 'converter'],
    faq: [
      {
        question: 'What is hexadecimal representation?',
        answer: 'Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F. It is commonly used to represent binary data in a more compact, human-readable format.',
      },
      {
        question: 'Why use hexadecimal?',
        answer: 'Hex is widely used in programming for memory addresses, color codes, and representing binary data. It is more compact than binary while being easy to convert.',
      },
      {
        question: 'How do I convert hex to decimal?',
        answer: 'Each hex digit represents 4 bits. Multiply each digit by 16^position and sum. For example, 1A = 1×16 + 10 = 26 in decimal.',
      },
      {
        question: 'What is the format for hex output?',
        answer: 'Each character is converted to two hex digits (00-FF). Spaces separate each byte for readability: 48 65 6C 6C 6F for "Hello".',
      },
      {
        question: 'Can I convert Unicode characters?',
        answer: 'Yes! Unicode characters are converted to their UTF-8 hex representation. For example, the emoji 🎉 becomes F0 9F 8E 89.',
      },
    ],
    relatedTools: ['binary-converter', 'ascii-converter', 'base64-encode'],
  },
  {
    id: 'bcrypt-hash-generator',
    name: 'bcrypt Hash Generator',
    seoTitle: 'bcrypt Hash Generator – Generate bcrypt Online (Free Tool)',
    description: 'Free online bcrypt Hash Generator tool to generate bcrypt password hashes with customizable salt rounds. Create secure password hashes for authentication systems with adjustable work factor. Higher rounds mean more security but slower generation. All processing happens locally.',
    shortDescription: 'Generate bcrypt password hashes',
    category: 'dev',
    slug: 'bcrypt-hash-generator',
    icon: 'Lock',
    keywords: ['bcrypt', 'hash', 'password hash', 'bcrypt generator', 'salt'],
    tags: ['developer', 'bcrypt', 'hash', 'salt', 'password', 'generator'],
    faq: [
      {
        question: 'What is bcrypt?',
        answer: 'bcrypt is a password hashing function designed to be slow and secure against brute-force attacks. It incorporates a salt to protect against rainbow table attacks and can be configured with a cost factor to increase computation time.',
      },
      {
        question: 'What are salt rounds?',
        answer: 'Salt rounds (or cost factor) determine how many iterations are used to generate the hash. Higher rounds = more secure but slower. Common values are 10-12.',
      },
      {
        question: 'Why is bcrypt better than SHA-256 for passwords?',
        answer: 'bcrypt is intentionally slow, making brute-force attacks impractical. SHA-256 is fast, which is good for data but bad for passwords. bcrypt also has built-in salting.',
      },
      {
        question: 'Why does the hash change each time?',
        answer: 'bcrypt generates a random salt each time, so the same password produces different hashes. This is by design and does not affect verification.',
      },
      {
        question: 'How do I verify a bcrypt hash?',
        answer: 'Use the bcrypt.compare() function (in most libraries) with the plaintext password and the stored hash. It will return true if they match.',
      },
    ],
    exampleOutput: {
      input: 'mypassword123',
      output: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
      description: 'bcrypt hash with 10 salt rounds (hash will be different each time due to random salt)',
    },
    relatedTools: ['sha256-hash-generator', 'md5-hash-generator', 'random-password-generator'],
  },
  {
    id: 'random-string-generator',
    name: 'Random String Generator',
    seoTitle: 'Random String Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random String Generator tool to generate random strings with customizable length and character sets. Create unique identifiers, tokens, and random text with letters, numbers, and symbols. Cryptographically secure generation using Web Crypto API.',
    shortDescription: 'Generate random strings online',
    category: 'dev',
    slug: 'random-string-generator',
    icon: 'Text',
    keywords: ['random string', 'string generator', 'random text', 'generate string', 'random characters'],
    tags: ['developer', 'random', 'string', 'generator', 'generate', 'characters'],
    faq: [
      {
        question: 'What is a random string generator?',
        answer: 'A random string generator creates sequences of random characters. You can customize the length and which character types to include (letters, numbers, symbols).',
      },
      {
        question: 'What character sets are available?',
        answer: 'You can include uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and special symbols (!@#$%^&*). Mix and match based on your needs.',
      },
      {
        question: 'How long can the strings be?',
        answer: 'You can generate strings of any length, typically from 1 to 1000 characters. Longer strings are useful for API keys and tokens.',
      },
      {
        question: 'Are the strings cryptographically secure?',
        answer: 'Yes! This tool uses the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure random generation.',
      },
      {
        question: 'What can I use random strings for?',
        answer: 'Random strings are useful for generating API keys, session tokens, test data, unique identifiers, coupon codes, and one-time passwords.',
      },
    ],
    exampleOutput: {
      output: 'a7Xk9mP2qR5nL8j\nB4cF6hJ1dS3vY7w\nE9tN2bG5iK8oP0x',
      description: 'Example of 3 generated random strings with mixed characters',
    },
    relatedTools: ['random-password-generator', 'random-number-generator', 'uuid-generator'],
  },
  {
    id: 'guid-generator',
    name: 'GUID Generator',
    seoTitle: 'GUID Generator – Generate GUID Online (Free Tool)',
    description: 'Free online GUID Generator tool to generate GUIDs for Windows and .NET applications. Create Globally Unique Identifiers in standard format with hyphens or braces. Generate multiple GUIDs at once for database testing. All generation happens locally in your browser.',
    shortDescription: 'Generate GUIDs online',
    category: 'dev',
    slug: 'guid-generator',
    icon: 'Fingerprint',
    keywords: ['guid', 'generator', 'globally unique identifier', 'windows guid', 'uuid'],
    tags: ['developer', 'guid', 'generator', 'uuid', 'globally', 'unique', 'identifier'],
    faq: [
      {
        question: 'What is a GUID?',
        answer: 'GUID (Globally Unique Identifier) is a 128-bit integer used in Windows and .NET for unique identification. It is essentially the same as UUID but often formatted differently with hyphens and braces.',
      },
      {
        question: 'What is the difference between GUID and UUID?',
        answer: 'GUID and UUID refer to the same concept (128-bit unique identifier). GUID is the Microsoft/Windows term, while UUID is the standard term. They are functionally identical.',
      },
      {
        question: 'Why would I use GUID instead of UUID?',
        answer: 'GUID is primarily used in Microsoft ecosystems (.NET, Windows, SQL Server). If you are working with these technologies, using the GUID terminology is more consistent with documentation and conventions.',
      },
      {
        question: 'What GUID formats are available?',
        answer: 'Common GUID formats include: standard format with hyphens, registry format with braces {...}, and plain hex without hyphens. Our tool generates the standard hyphenated format.',
      },
      {
        question: 'Can I use GUIDs across different systems?',
        answer: 'Yes! GUIDs are compatible with UUID systems. A GUID generated on Windows can be used in Linux, macOS, or any system that supports UUIDs—they follow the same 128-bit standard.',
      },
    ],
    exampleOutput: {
      output: '{550e8400-e29b-41d4-a716-446655440000}\n{6fa459ea-ee8a-3ca4-894e-db77e160355e}\n{3c4e5a6b-7c8d-4e9f-0a1b-2c3d4e5f6a7b}',      description: 'Example of 3 GUIDs with braces format',
    },
    relatedTools: ['uuid-generator', 'uuid-bulk-generator', 'nano-id-generator'],
  },
  {
    id: 'uuid-bulk-generator',
    name: 'UUID Bulk Generator',
    seoTitle: 'UUID Bulk Generator – Generate UUID Online (Free Tool)',
    description: 'Free online UUID Bulk Generator tool to generate multiple UUIDs at once in bulk. Create hundreds or thousands of unique identifiers instantly for database seeding, testing, and batch processing. All generation happens locally using Web Crypto API.',
    shortDescription: 'Generate multiple UUIDs in bulk',
    category: 'dev',
    slug: 'uuid-bulk-generator',
    icon: 'List',
    keywords: ['uuid', 'bulk', 'generator', 'multiple uuid', 'batch uuid', 'uuid list'],
    tags: ['developer', 'uuid', 'bulk', 'generator', 'multiple', 'batch', 'list'],
    faq: [
      {
        question: 'Why use bulk UUID generation?',
        answer: 'Bulk generation is useful when you need many unique identifiers at once, such as for database seeding, testing, or batch processing operations.',
      },
      {
        question: 'How many UUIDs can I generate at once?',
        answer: 'You can generate up to 1000 UUIDs at once. Each UUID is generated independently using the Web Crypto API for randomness.',
      },
      {
        question: 'Can I export the generated UUIDs?',
        answer: 'Yes! After generating UUIDs, you can copy them to clipboard or download as a text file. Each UUID is on a separate line for easy import into other applications.',
      },
      {
        question: 'What format are bulk UUIDs in?',
        answer: 'Bulk generated UUIDs use the standard format: 8-4-4-4-12 hexadecimal characters (e.g., `550e8400-e29b-41d4-a716-446655440000`). This is the canonical UUID format.',
      },
      {
        question: 'Is there a limit to bulk generation?',
        answer: 'For performance reasons, we limit bulk generation to 1000 UUIDs at once. This ensures smooth browser performance while still meeting most use case needs.',
      },
    ],
    exampleOutput: {
      output: '0001. 550e8400-e29b-41d4-a716-446655440000\n0002. 6fa459ea-ee8a-3ca4-894e-db77e160355e\n0003. 3c4e5a6b-7c8d-4e9f-0a1b-2c3d4e5f6a7b\n...',
      description: 'Example of bulk generated UUIDs with line numbers',
    },
    relatedTools: ['uuid-generator', 'guid-generator', 'nano-id-generator'],
  },
  {
    id: 'jwt-encoder',
    name: 'JWT Encoder',
    seoTitle: 'JWT Encoder – Encode JWT Online (Free Tool)',
    description: 'Free online JWT Encoder tool to create and encode JSON Web Tokens with custom payload and secret. Generate tokens for authentication and authorization testing. Supports HS256 algorithm with custom secret key. All encoding happens locally in your browser.',
    shortDescription: 'Encode JWT tokens online',
    category: 'dev',
    slug: 'jwt-encoder',
    icon: 'Shield',
    keywords: ['jwt', 'encoder', 'json web token', 'token generator', 'authentication'],
    tags: ['developer', 'jwt', 'encoder', 'authentication', 'json', 'token', 'generator'],
    faq: [
      {
        question: 'What is JWT encoding?',
        answer: 'JWT encoding creates a token consisting of three Base64-encoded parts: header, payload, and signature. It is commonly used for authentication in web applications.',
      },
      {
        question: 'What algorithm is used?',
        answer: 'Our encoder supports HS256 (HMAC with SHA-256), which is the most commonly used JWT algorithm for symmetric key signing.',
      },
      {
        question: 'What should I put in the payload?',
        answer: 'The payload contains claims—standard fields like iss (issuer), exp (expiration), sub (subject) plus any custom data you need to transmit.',
      },
      {
        question: 'How secure are generated JWTs?',
        answer: 'JWTs generated with a strong secret key are secure. Use a long, random secret. Remember: the payload is encoded, not encrypted, so do not put sensitive data in it.',
      },
      {
        question: 'What is the secret key for?',
        answer: 'The secret key is used to create the signature. The same secret is needed to verify the token later. Keep it secure and never share it.',
      },
    ],
    relatedTools: ['jwt-decoder', 'base64-encode', 'json-formatter'],
  },
  {
    id: 'curl-to-fetch',
    name: 'CURL to Fetch Converter',
    seoTitle: 'CURL to Fetch Converter – Convert CURL Online (Free Tool)',
    description: 'Free online CURL to Fetch Converter tool to convert CURL commands to JavaScript fetch API code. Transform your CURL requests into browser-compatible fetch calls instantly. Perfect for web developers working with APIs and migrating backend code to frontend.',
    shortDescription: 'Convert CURL to fetch API',
    category: 'dev',
    slug: 'curl-to-fetch',
    icon: 'Terminal',
    keywords: ['curl', 'fetch', 'converter', 'javascript', 'api', 'http request'],
    tags: ['developer', 'curl', 'fetch', 'converter', 'javascript', 'api', 'http'],
    faq: [
      {
        question: 'Why convert CURL to fetch?',
        answer: 'Converting CURL to fetch allows you to use the same HTTP request in browser-based JavaScript applications. Fetch is the modern standard for making HTTP requests in JavaScript.',
      },
      {
        question: 'What CURL options are supported?',
        answer: 'Our converter handles headers (-H), request body (-d/--data), HTTP methods (-X), authentication (-u), and most common CURL options.',
      },
      {
        question: 'Does it handle authentication?',
        answer: 'Yes! The converter handles Basic Auth (-u) and Bearer tokens, converting them to appropriate fetch headers.',
      },
      {
        question: 'Can it convert POST requests?',
        answer: 'Absolutely! POST requests with JSON or form data are converted to fetch with proper headers and body formatting.',
      },
      {
        question: 'What about async/await?',
        answer: 'The generated fetch code uses async/await syntax, which is the modern and recommended way to work with promises in JavaScript.',
      },
    ],
    relatedTools: ['json-formatter', 'base64-encode', 'jwt-decoder'],
  },

  // ==================== TEXT TOOLS ====================
  {
    id: 'word-counter',
    name: 'Word Counter',
    seoTitle: 'Word Counter – Count Word Online (Free Tool)',
    description: 'Free online Word Counter tool to count words, characters, sentences, and paragraphs in your text instantly. Get detailed text statistics including character count with and without spaces. Perfect for writers, students, and content creators.',
    shortDescription: 'Count words and characters',
    category: 'text',
    slug: 'word-counter',
    icon: 'Hash',
    keywords: ['word counter', 'character count', 'word count', 'text counter'],
    tags: ['text', 'word', 'counter', 'character', 'count'],
    faq: [
      {
        question: 'What does the word counter measure?',
        answer: 'Our word counter measures words, characters (with and without spaces), sentences, paragraphs, and average word length to give you comprehensive text statistics.',
      },
      {
        question: 'How does it count words?',
        answer: 'Words are counted by splitting text on whitespace. Punctuation attached to words is included in character count but not as separate words.',
      },
      {
        question: 'Is there a character limit?',
        answer: 'There is no limit! Count words in documents of any size. Very large documents may take a few seconds to process.',
      },
      {
        question: 'Does it work with all languages?',
        answer: 'Yes, the word counter works with most languages including English, European languages, and languages using non-Latin scripts.',
      },
      {
        question: 'Is my text private?',
        answer: 'Absolutely! All counting happens locally in your browser. Your text is never sent to any server.',
      },
    ],
    relatedTools: ['character-counter', 'text-case-converter', 'remove-duplicate-lines'],
    seoContent: {
      intro: "Word Counter tallies words, characters (with and without spaces), sentences, paragraphs, and reading time for any text. Useful for writers hitting a target length, social media managers staying under platform limits, students checking essay length, and developers estimating token counts for LLM prompts. Counts update live as you type or paste.",
      examples: [
        {
          title: "Check a Twitter / X post length",
          body: "Paste a draft and see character count update live — keep under 280 (or 25,000 for premium accounts).",
        },
        {
          title: "Verify an essay word count",
          body: "Aim for 1500 words? The counter shows running totals so you can stop at exactly the right length.",
        },
        {
          title: "Estimate LLM tokens",
          body: "A rough heuristic: 1 token ≈ 0.75 words for English. Multiply the word count by ~1.33 to get an approximate token count for a prompt.",
        },
      ],
      useCases: [
        "Writers managing word-count targets for articles, essays, books",
        "Social media drafts (Twitter 280, LinkedIn 3000, Instagram 2200)",
        "Students confirming essay length before submission",
        "Estimating LLM token costs for prompt budgeting",
        "Editors checking how much copy fits a layout constraint",
      ],
      troubleshooting: [
        {
          problem: "Word count differs from Microsoft Word.",
          solution: "Different tools count contractions, hyphenated words, and numbers differently. Most tools (including this one) treat each whitespace-separated token as a word.",
        },
        {
          problem: "Reading time seems off.",
          solution: "The estimate uses 225 words per minute (average adult reading pace). Adjust the WPM in advanced options if you have a slower or faster audience in mind.",
        },
        {
          problem: "Counting code blocks inflates the total.",
          solution: "Strip code samples before counting if you only want prose. Or paste prose only, count, then paste the rest.",
        },
      ],
    },
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    seoTitle: 'Character Counter – Count Character Online (Free Tool)',
    description: 'Free online Character Counter tool to count characters, letters, numbers, and symbols in your text. Get detailed text statistics including word count and line count. Perfect for social media, SMS, and limited character requirements.',
    shortDescription: 'Count characters in text',
    category: 'text',
    slug: 'character-counter',
    icon: 'Type',
    keywords: ['character counter', 'char count', 'letter count', 'text statistics'],
    tags: ['text', 'character', 'counter', 'char', 'count', 'letter', 'statistics'],
    faq: [
      {
        question: 'What is the difference between character count with and without spaces?',
        answer: 'Character count with spaces includes all whitespace characters. Without spaces counts only visible characters, useful for platforms with strict limits.',
      },
      {
        question: 'What platforms have character limits?',
        answer: 'Twitter: 280 characters, SMS: 160 characters, Instagram captions: 2,200 characters, LinkedIn posts: 3,000 characters, Facebook posts: 63,206 characters.',
      },
      {
        question: 'Does it count special characters?',
        answer: 'Yes! All characters including emojis, symbols, punctuation, and Unicode characters are counted. Emojis may count as multiple characters depending on encoding.',
      },
      {
        question: 'How accurate is the line count?',
        answer: 'Lines are counted based on line breaks (newline characters). Wrapped text still counts as one line until a hard break is inserted.',
      },
      {
        question: 'Can I use this for academic writing?',
        answer: 'Yes! Many students use this tool to meet essay requirements. It accurately counts words and characters for academic submissions.',
      },
    ],
    relatedTools: ['word-counter', 'word-word-counter', 'text-case-converter'],
  },
  {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    seoTitle: 'Text Case Converter – Convert Text Online (Free Tool)',
    description: 'Free online Text Case Converter tool to convert text to uppercase, lowercase, title case, sentence case, and more. Transform your text instantly with various case options. Perfect for formatting titles, headlines, and proper nouns.',
    shortDescription: 'Convert text case online',
    category: 'text',
    slug: 'text-case-converter',
    icon: 'CaseSensitive',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'text transform'],
    tags: ['text', 'uppercase', 'lowercase', 'case', 'converter', 'title', 'transform'],
    faq: [
      {
        question: 'What case types are available?',
        answer: 'Our converter supports: UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg, and Start Case for various formatting needs.',
      },
      {
        question: 'What is Title Case?',
        answer: 'Title Case capitalizes the first letter of each major word. Small words like "a", "an", "the", "in", "on" typically remain lowercase unless they start the title.',
      },
      {
        question: 'What is Sentence case?',
        answer: 'Sentence case capitalizes only the first letter of sentences, with the rest lowercase. This is normal text formatting used in most paragraphs.',
      },
      {
        question: 'Can I convert large amounts of text?',
        answer: 'Yes! Paste any amount of text and it will be converted instantly. The tool handles documents of any size.',
      },
      {
        question: 'Does it handle non-English characters?',
        answer: 'Yes, the converter properly handles accented characters and non-Latin scripts that have case distinctions.',
      },
    ],
    relatedTools: ['capitalize-sentences', 'text-cleaner', 'word-counter'],
    seoContent: {
      intro: "Text Case Converter switches text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE in one click. Essential for developers renaming variables across naming conventions, writers normalising capitalisation, and anyone cleaning up SHOUTED-COPY pasted from spreadsheets.",
      examples: [
        {
          title: "API field rename",
          body: "Input: \"user_first_name\" → camelCase: \"userFirstName\" / Pascal: \"UserFirstName\" / kebab: \"user-first-name\" — paste straight into the new naming convention.",
        },
        {
          title: "Normalise a headline",
          body: "Input: \"the QUICK brown FOX\" → Title Case: \"The Quick Brown Fox\" — fixes pasted text with random capitalisation.",
        },
        {
          title: "Generate a CSS class from a label",
          body: "Input: \"Primary Action Button\" → kebab-case: \"primary-action-button\" — drop into a className attribute.",
        },
      ],
      useCases: [
        "Renaming variables across naming conventions during refactors",
        "Converting database column names (snake_case) to API field names (camelCase)",
        "Generating slugs from headings (Title Case → kebab-case)",
        "Cleaning up data pasted from spreadsheets with ALL CAPS columns",
        "Producing CONSTANT_CASE keys for environment variables",
      ],
      troubleshooting: [
        {
          problem: "Acronyms came out wrong (e.g. \"iOS\" → \"Ios\").",
          solution: "Title Case capitalises only the first letter of each word. For acronyms, do a manual pass or use a custom dictionary of preserved tokens.",
        },
        {
          problem: "Numbers split across cases unexpectedly.",
          solution: "Boundary detection splits between letters and digits. \"user2name\" might become \"user-2-name\". Strip digits beforehand or join manually if needed.",
        },
        {
          problem: "Non-Latin characters got mangled.",
          solution: "Title Case relies on Latin word boundaries. For other scripts, the input is usually preserved unchanged — open an issue if you see a specific bug.",
        },
      ],
    },
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    seoTitle: 'Slug Generator – Generate Slug Online (Free Tool)',
    description: 'Free online Slug Generator tool to generate URL-friendly slugs from text. Create SEO-friendly URLs for your blog posts and pages with lowercase letters and hyphens. Perfect for content management systems and blogging platforms.',
    shortDescription: 'Generate URL slugs online',
    category: 'text',
    slug: 'slug-generator',
    icon: 'Link',
    keywords: ['slug generator', 'url slug', 'seo slug', 'permalink', 'url friendly'],
    tags: ['text', 'permalink', 'slug', 'generator', 'url', 'seo', 'friendly'],
    faq: [
      {
        question: 'What is a URL slug?',
        answer: 'A URL slug is the part of a URL that identifies a specific page in a human-readable format. For example, in "example.com/my-blog-post", "my-blog-post" is the slug.',
      },
      {
        question: 'Why are slugs important for SEO?',
        answer: 'Slugs help search engines understand page content and improve click-through rates. Good slugs are short, descriptive, and contain relevant keywords.',
      },
      {
        question: 'What characters are allowed in slugs?',
        answer: 'Slugs typically contain lowercase letters, numbers, and hyphens. Spaces and special characters are converted to hyphens or removed.',
      },
      {
        question: 'Should slugs be long or short?',
        answer: 'Shorter is better! Keep slugs concise while still being descriptive. Ideally 3-5 words that clearly describe the content.',
      },
      {
        question: 'Can I customize the slug format?',
        answer: 'Yes, you can choose different separators (hyphens, underscores) and options for handling special characters in our advanced slug generator.',
      },
    ],
    exampleOutput: {
      input: 'My First Blog Post! (2024)',
      output: 'my-first-blog-post-2024',
      description: 'Example of URL-friendly slug in lowercase with hyphens',
    },
    relatedTools: ['slug-generator-advanced', 'text-case-converter', 'url-encode'],
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    seoTitle: 'Remove Duplicate Lines – Free Online Tool',
    description: 'Free online Remove Duplicate Lines tool to remove duplicate lines from text instantly. Keep only unique lines and dedupe your content. Perfect for cleaning up lists and data files. All processing happens locally.',
    shortDescription: 'Remove duplicate lines from text',
    category: 'text',
    slug: 'remove-duplicate-lines',
    icon: 'ListX',
    keywords: ['remove duplicates', 'unique lines', 'dedupe', 'duplicate remover'],
    tags: ['text', 'dedupe', 'remove', 'duplicates', 'unique', 'lines', 'duplicate'],
    faq: [
      {
        question: 'How does duplicate line removal work?',
        answer: 'The tool scans each line and keeps only the first occurrence of each unique line, removing subsequent duplicates.',
      },
      {
        question: 'Is the removal case-sensitive?',
        answer: 'By default, yes. "Apple" and "apple" are treated as different lines. Some tools offer case-insensitive options.',
      },
      {
        question: 'Does it preserve the original order?',
        answer: 'Yes! The first occurrence of each line is kept in its original position. Only duplicates are removed.',
      },
      {
        question: 'Can I remove blank lines too?',
        answer: 'Yes, there is usually an option to remove empty lines along with duplicates for cleaner output.',
      },
      {
        question: 'What file types can I process?',
        answer: 'Paste any text content—CSV lines, log files, email lists, or any text data. The tool works with plain text of any format.',
      },
    ],
    relatedTools: ['sort-lines-alphabetically', 'text-to-list', 'list-to-text'],
  },
  {
    id: 'sort-lines-alphabetically',
    name: 'Sort Lines Alphabetically',
    seoTitle: 'Sort Lines Alphabetically – Free Online Tool',
    description: 'Free online Sort Lines Alphabetically tool to sort lines of text in alphabetical order. Organize your lists quickly with ascending or descending sort options. Perfect for organizing content and data.',
    shortDescription: 'Sort text lines alphabetically',
    category: 'text',
    slug: 'sort-lines-alphabetically',
    icon: 'ListOrdered',
    keywords: ['sort lines', 'alphabetical sort', 'sort text', 'order lines'],
    tags: ['text', 'sort', 'lines', 'alphabetical', 'order'],
    faq: [
      {
        question: 'How does alphabetical sorting work?',
        answer: 'Lines are sorted by comparing characters from left to right using their Unicode values. A comes before B, numbers come before letters.',
      },
      {
        question: 'Can I sort in descending order?',
        answer: 'Yes! You can choose between A-Z (ascending) or Z-A (descending) sorting order.',
      },
      {
        question: 'Is sorting case-sensitive?',
        answer: 'By default, uppercase letters sort before lowercase. You can often enable case-insensitive sorting for more intuitive results.',
      },
      {
        question: 'How are numbers sorted?',
        answer: 'Numbers are sorted character by character, so "10" comes before "2". For numerical sorting, ensure numbers have leading zeros.',
      },
      {
        question: 'Can I sort by specific columns?',
        answer: 'For simple alphabetical sorting, lines are compared entirely. For column-based sorting, you may need specialized CSV tools.',
      },
    ],
    relatedTools: ['remove-duplicate-lines', 'reverse-text', 'text-to-list'],
  },
  {
    id: 'reverse-text',
    name: 'Reverse Text',
    seoTitle: 'Reverse Text – Free Online Tool',
    description: 'Free online Reverse Text tool to reverse text or strings instantly. Flip characters, words, or entire sentences backwards. Perfect for puzzles, encoding, and text transformation. All processing happens locally.',
    shortDescription: 'Reverse text online',
    category: 'text',
    slug: 'reverse-text',
    icon: 'Reverse',
    keywords: ['reverse text', 'flip text', 'backwards text', 'text reverser'],
    tags: ['text', 'reverse', 'flip', 'backwards', 'reverser'],
    faq: [
      {
        question: 'What does reversing text do?',
        answer: 'Reversing text flips the order of characters. "Hello" becomes "olleH". It works character by character from end to start.',
      },
      {
        question: 'Can I reverse word order instead?',
        answer: 'Yes, some tools offer options to reverse the order of words while keeping each word intact, or reverse characters within each word.',
      },
      {
        question: 'Does it work with Unicode?',
        answer: 'Yes! The tool properly handles Unicode characters including emojis and accented letters. Complex grapheme clusters are preserved.',
      },
      {
        question: 'Why would I need to reverse text?',
        answer: 'Text reversal is used for puzzles, creative writing, testing, simple encoding, and educational purposes about string manipulation.',
      },
      {
        question: 'Is there a character limit?',
        answer: 'There is no strict limit. You can reverse text of any length, though very long texts may take a moment to process.',
      },
    ],
    relatedTools: ['sort-lines-alphabetically', 'remove-line-breaks', 'text-case-converter'],
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    seoTitle: 'Remove Line Breaks – Free Online Tool',
    description: 'Free online Remove Line Breaks tool to remove line breaks and newlines from text. Convert multi-line text to single line instantly. Perfect for cleaning up formatted text and data preparation.',
    shortDescription: 'Remove line breaks from text',
    category: 'text',
    slug: 'remove-line-breaks',
    icon: 'Minus',
    keywords: ['remove line breaks', 'join lines', 'single line', 'remove newlines'],
    tags: ['text', 'remove', 'line', 'breaks', 'join', 'lines', 'single'],
    faq: [
      {
        question: 'What are line breaks?',
        answer: 'Line breaks (newline characters) are special characters that separate lines of text. They include LF (\\n), CR (\\r), and CRLF (\\r\\n).',
      },
      {
        question: 'What replaces the line breaks?',
        answer: 'By default, line breaks are replaced with a single space. You can also join lines with no separator or a custom character.',
      },
      {
        question: 'Will this affect paragraph breaks?',
        answer: 'Yes, all line breaks are removed. To preserve paragraphs, you may need to process paragraphs separately or use a more advanced tool.',
      },
      {
        question: 'Why remove line breaks?',
        answer: 'Removing line breaks is useful when copying text from PDFs, emails, or formatted documents where you need continuous text.',
      },
      {
        question: 'Can I undo this operation?',
        answer: 'The original line break positions are lost after removal. Keep a backup of your original text if you need to restore formatting.',
      },
    ],
    relatedTools: ['remove-extra-spaces', 'reverse-text', 'text-cleaner'],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    seoTitle: 'Lorem Ipsum Generator – Generate Lorem Online (Free Tool)',
    description: 'Generate placeholder text for your designs and layouts. Choose paragraphs, words, or sentences.',
    shortDescription: 'Generate placeholder text',
    category: 'text',
    slug: 'lorem-ipsum',
    icon: 'AlignLeft',
    keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lipsum'],
    tags: ['text', 'lipsum', 'lorem', 'ipsum', 'placeholder', 'dummy'],
    faq: [
      {
        question: 'What is Lorem Ipsum?',
        answer: 'Lorem Ipsum is placeholder text used in printing and typesetting since the 1500s. It helps designers focus on layout without being distracted by readable content.',
      },
      {
        question: 'Why use Lorem Ipsum instead of real text?',
        answer: 'Lorem Ipsum has normal letter distribution, making it better for visual balance than repetitive text. It lets viewers focus on design, not content.',
      },
      {
        question: 'How much text can I generate?',
        answer: 'Generate as many paragraphs, words, or sentences as you need. Select the unit and quantity that fits your project.',
      },
      {
        question: 'Is Lorem Ipsum Latin?',
        answer: 'Lorem Ipsum is derived from Latin text by Cicero, but it is scrambled and modified so it does not make coherent sense.',
      },
      {
        question: 'Can I use this commercially?',
        answer: 'Yes! Lorem Ipsum is public domain text. Use the generated placeholder text freely in any project.',
      },
    ],
    relatedTools: ['random-text-generator', 'random-name-generator', 'word-counter'],
    seoContent: {
      intro: "Lorem Ipsum generates classic placeholder text for design mockups, wireframes, and content templates. Pick paragraphs, sentences, or words; choose the classic \"Lorem ipsum dolor sit amet…\" or vary the seed for fresh-looking placeholder. Generation is instant and the output is yours — no attribution required.",
      examples: [
        {
          title: "3 paragraphs for a hero section",
          body: "Generate 3 paragraphs at ~50 words each to fill the body copy on a design mockup. Long enough to test typography, short enough to scan.",
        },
        {
          title: "20 words for a card teaser",
          body: "A 20-word block sized like a real product description — confirms the card layout works with realistic content length.",
        },
        {
          title: "10 short sentences for a list",
          body: "Generate 10 sentences to fill a 10-item bullet list and check spacing, leading, and overflow behaviour.",
        },
      ],
      useCases: [
        "Filling design mockups with realistic-length copy",
        "Populating CMS templates while waiting for real content",
        "Stress-testing line-height, column-width, and overflow handling",
        "Building marketing emails or newsletter layouts before final copy",
        "Demoing a UI to stakeholders without exposing real, unfinished content",
      ],
      troubleshooting: [
        {
          problem: "Generated text is always identical.",
          solution: "Classic Lorem starts with \"Lorem ipsum dolor sit amet…\". Toggle \"randomise start\" or generate with a different seed for varied opening words.",
        },
        {
          problem: "Need realistic English instead of Latin.",
          solution: "Switch the dictionary to \"Hipster Ipsum\", \"Bacon Ipsum\", or \"Corporate Ipsum\" if the tool supports them — same purpose, more recognisable feel.",
        },
        {
          problem: "Output too long / too short for the slot.",
          solution: "Generate by word count rather than paragraph count for precise control. A typical card teaser is 15-25 words; a paragraph for a blog is 50-80.",
        },
      ],
    },
  },
  {
    id: 'random-text-generator',
    name: 'Random Text Generator',
    seoTitle: 'Random Text Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random Text Generator tool to generate random text for testing and mockups. Create realistic-looking content for your projects with customizable length and paragraph count. All generation happens locally.',
    shortDescription: 'Generate random text online',
    category: 'text',
    slug: 'random-text-generator',
    icon: 'Text',
    keywords: ['random text', 'text generator', 'dummy content', 'test text'],
    tags: ['text', 'random', 'generator', 'dummy', 'content', 'test'],
    faq: [
      {
        question: 'What is random text used for?',
        answer: 'Random text is used for placeholder content in designs, testing layouts, populating mockups, and creating sample data for development and testing purposes.',
      },
      {
        question: 'How is this different from Lorem Ipsum?',
        answer: 'While Lorem Ipsum uses standardized Latin text, this generator creates varied, realistic-looking sentences using a template system. This can be more engaging for testing.',
      },
      {
        question: 'Can I control the length?',
        answer: 'Yes! You can specify the number of paragraphs, sentences per paragraph, or total word count to generate exactly what you need.',
      },
      {
        question: 'Is the text unique each time?',
        answer: 'Yes, each generation produces different random text. The combinations are vast, so you get fresh content every time.',
      },
      {
        question: 'Can I use this for mockups?',
        answer: 'Absolutely! This is perfect for filling design mockups with realistic-looking placeholder text before real content is available.',
      },
    ],
    exampleOutput: {
      output: 'The amazing platform delivers an incredible experience. Our outstanding system provides the most elegant solution. This remarkable application optimizes a truly dynamic workflow.',
      description: 'Example of randomly generated text with 3 sentences',
    },
    relatedTools: ['lorem-ipsum', 'random-name-generator', 'word-counter'],
  },
  {
    id: 'text-difference-checker',
    name: 'Text Difference Checker',
    seoTitle: 'Text Difference Checker – Check Text Online (Free Tool)',
    description: 'Free online Text Difference Checker tool to compare two texts and find differences. Highlight added, removed, and changed text with visual diff. Perfect for proofreading, version comparison, and content review.',
    shortDescription: 'Compare texts and find differences',
    category: 'text',
    slug: 'text-difference-checker',
    icon: 'Diff',
    keywords: ['text diff', 'compare text', 'difference checker', 'text compare'],
    tags: ['text', 'diff', 'compare', 'difference', 'checker'],
    faq: [
      {
        question: 'How does text comparison work?',
        answer: 'The tool compares two texts character by character or word by word, highlighting additions, deletions, and modifications between them.',
      },
      {
        question: 'What types of differences are shown?',
        answer: 'Added text is typically highlighted in green, removed text in red, and modified text may be shown with strikethrough or different colors.',
      },
      {
        question: 'Is the comparison case-sensitive?',
        answer: 'By default, yes. "Hello" and "hello" would be marked as different. Some tools offer case-insensitive comparison options.',
      },
      {
        question: 'Can I compare large documents?',
        answer: 'Yes! The tool handles documents of various sizes. Very large documents may take longer to process but will compare successfully.',
      },
      {
        question: 'What is this useful for?',
        answer: 'Text comparison helps with proofreading, checking document revisions, comparing code changes, reviewing translations, and tracking edits.',
      },
    ],
    relatedTools: ['find-and-replace', 'json-diff', 'word-counter'],
  },
  {
    id: 'remove-html-tags',
    name: 'Remove HTML Tags',
    seoTitle: 'Remove HTML Tags – Free Online Tool',
    description: 'Free online Remove HTML Tags tool to strip HTML tags from text instantly. Extract plain text from HTML code and clean up markup. Perfect for content extraction and text processing. All processing happens locally.',
    shortDescription: 'Remove HTML tags from text',
    category: 'text',
    slug: 'remove-html-tags',
    icon: 'CodeX',
    keywords: ['remove html', 'strip tags', 'html remover', 'plain text'],
    tags: ['text', 'remove', 'html', 'strip', 'tags', 'remover', 'plain'],
    faq: [
      {
        question: 'What are HTML tags?',
        answer: 'HTML tags are markup elements like <p>, <div>, <span> that define document structure. They are enclosed in angle brackets and usually come in pairs.',
      },
      {
        question: 'Will this remove all formatting?',
        answer: 'Yes, all HTML formatting including bold, italic, links, and structure is removed. Only the plain text content remains.',
      },
      {
        question: 'What about script and style tags?',
        answer: 'The tool removes all tags including <script> and <style>, so JavaScript and CSS content within those tags is also removed.',
      },
      {
        question: 'Are HTML entities decoded?',
        answer: 'Yes, common HTML entities like &amp; &lt; &gt; are converted to their character equivalents (& < >).',
      },
      {
        question: 'Can I process partial HTML?',
        answer: 'Yes! The tool works with any HTML fragments, not just complete documents. Paste any HTML snippet to extract its text.',
      },
    ],
    relatedTools: ['html-formatter', 'html-encode-decode', 'markdown-to-html'],
  },
  {
    id: 'find-and-replace',
    name: 'Find and Replace',
    seoTitle: 'Find and Replace – Free Online Tool',
    description: 'Free online Find and Replace tool to search and replace text in your content instantly. Replace all occurrences or specific matches with case-sensitive options. Perfect for bulk text editing and content updates.',
    shortDescription: 'Find and replace text online',
    category: 'text',
    slug: 'find-and-replace',
    icon: 'Replace',
    keywords: ['find replace', 'search replace', 'text replace', 'replace all'],
    tags: ['text', 'find', 'replace', 'search', 'all'],
    faq: [
      {
        question: 'How does find and replace work?',
        answer: 'Enter the text to find and the replacement text. The tool searches for all occurrences and replaces them with your new text.',
      },
      {
        question: 'Can I replace all occurrences at once?',
        answer: 'Yes! By default, all matches are replaced. You can also replace one at a time if you want to review each change.',
      },
      {
        question: 'Is the search case-sensitive?',
        answer: 'You can toggle case sensitivity. With it on, "Word" and "word" are different. Off, they are treated the same.',
      },
      {
        question: 'Can I use regular expressions?',
        answer: 'Some find and replace tools support regex for complex pattern matching. This allows powerful searches like finding all email addresses.',
      },
      {
        question: 'What if I make a mistake?',
        answer: 'Keep a backup of your original text! The replacement is immediate. You can also use undo (Ctrl+Z) if working in the browser.',
      },
    ],
    relatedTools: ['text-difference-checker', 'remove-duplicate-lines', 'sort-lines-alphabetically'],
  },
  {
    id: 'text-to-list',
    name: 'Text to List Converter',
    seoTitle: 'Text to List Converter – Convert Text Online (Free Tool)',
    description: 'Free online Text to List Converter tool to convert text to a list format. Transform paragraphs into bulleted or numbered lists instantly. Perfect for organizing content and creating structured data from text.',
    shortDescription: 'Convert text to list format',
    category: 'text',
    slug: 'text-to-list',
    icon: 'List',
    keywords: ['text to list', 'convert to list', 'list maker', 'bullet points'],
    tags: ['text', 'list', 'convert', 'maker', 'bullet', 'points'],
    faq: [
      {
        question: 'How does text to list conversion work?',
        answer: 'The tool splits your text by sentences, lines, or custom delimiters and formats each item as a list entry with bullets or numbers.',
      },
      {
        question: 'What list styles are available?',
        answer: 'You can choose from bullet points (•), numbered lists (1, 2, 3), lettered lists (a, b, c), and other common list formats.',
      },
      {
        question: 'How is text split into items?',
        answer: 'Text can be split by line breaks, sentences (periods), commas, or custom characters. Choose the method that matches your content.',
      },
      {
        question: 'Can I convert back from list to text?',
        answer: 'Yes! Use our List to Text tool to remove list formatting and convert back to paragraphs or continuous text.',
      },
      {
        question: 'What is this useful for?',
        answer: 'Convert paragraphs to bullet points for presentations, create task lists from text, organize notes, or format content for documents.',
      },
    ],
    relatedTools: ['list-to-text', 'remove-duplicate-lines', 'sort-lines-alphabetically'],
  },
  {
    id: 'list-to-text',
    name: 'List to Text Converter',
    seoTitle: 'List to Text Converter – Convert List Online (Free Tool)',
    description: 'Free online List to Text Converter tool to convert lists to paragraphs. Transform bulleted or numbered lists into continuous text instantly. Perfect for content formatting and document processing.',
    shortDescription: 'Convert list to text format',
    category: 'text',
    slug: 'list-to-text',
    icon: 'FileText',
    keywords: ['list to text', 'convert list', 'join list', 'list to paragraph'],
    tags: ['text', 'list', 'convert', 'join', 'paragraph'],
    faq: [
      {
        question: 'What types of lists can I convert?',
        answer: 'You can convert any text-based list including bulleted lists, numbered lists, or plain line-separated items. Simply paste your list and choose how you want the items joined.',
      },
      {
        question: 'How are the list items joined together?',
        answer: 'By default, items are joined with spaces to form a paragraph. You can customize the separator to use commas, semicolons, or any other delimiter based on your needs.',
      },
      {
        question: 'Will formatting like bullets or numbers be removed?',
        answer: 'Yes, when converting to text, bullet points and numbering are typically removed. You can clean the list first if needed or the tool will extract just the content.',
      },
      {
        question: 'Is there a limit to how many items I can convert?',
        answer: 'There is no strict limit on the number of items. The tool processes text locally in your browser, so it can handle large lists efficiently.',
      },
      {
        question: 'Can I convert text back to a list format?',
        answer: 'Yes, use the Text to List tool to convert paragraphs back into list format. It can split text by sentences, commas, or custom delimiters.',
      },
    ],
    relatedTools: ['text-to-list', 'remove-line-breaks', 'text-cleaner'],
  },
  {
    id: 'random-name-generator',
    name: 'Random Name Generator',
    seoTitle: 'Random Name Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random Name Generator tool to generate random names for characters, testing, or inspiration. Choose gender and quantity for realistic name generation. Perfect for writers, developers, and content creators.',
    shortDescription: 'Generate random names online',
    category: 'text',
    slug: 'random-name-generator',
    icon: 'User',
    keywords: ['name generator', 'random names', 'fake names', 'name picker'],
    tags: ['text', 'name', 'generator', 'random', 'names', 'fake', 'picker'],
    faq: [
      {
        question: 'What can I use random names for?',
        answer: 'Random names are useful for creating test data, generating character names for stories, placeholder names in prototypes, and sampling for surveys or demos.',
      },
      {
        question: 'Are these real names?',
        answer: 'The generated names combine real first and last names from common databases. While the combinations are random, the individual names are genuine names used in English-speaking countries.',
      },
      {
        question: 'Can I choose specific gender for the names?',
        answer: 'Yes, you can select male, female, or mixed names depending on your needs. This helps when you need names that match specific demographic requirements.',
      },
      {
        question: 'How many names can I generate at once?',
        answer: 'You can generate as many names as you need, from a single name to hundreds. Simply adjust the quantity setting and regenerate if you need more.',
      },
      {
        question: 'Are the generated names unique?',
        answer: 'Each generation produces random combinations, so duplicates are rare but possible with large quantities. Regenerate or add more names if you need guaranteed unique combinations.',
      },
    ],
    exampleOutput: {
      output: 'James Smith\nJennifer Johnson\nMichael Williams\nSarah Brown\nDavid Jones',
      description: 'Example of 5 randomly generated full names',
    },
    relatedTools: ['random-text-generator', 'lorem-ipsum', 'random-string-generator'],
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    seoTitle: 'Remove Extra Spaces – Free Online Tool',
    description: 'Free online Remove Extra Spaces tool to remove extra spaces and whitespace from text. Clean up multiple spaces, tabs, and line breaks. Perfect for text cleaning and formatting. All processing happens locally.',
    shortDescription: 'Remove extra spaces from text',
    category: 'text',
    slug: 'remove-extra-spaces',
    icon: 'Space',
    keywords: ['remove spaces', 'extra spaces', 'whitespace remover', 'clean spaces'],
    tags: ['text', 'remove', 'spaces', 'extra', 'whitespace', 'remover', 'clean'],
    faq: [
      {
        question: 'What types of whitespace does this tool remove?',
        answer: 'This tool removes multiple consecutive spaces, tabs, and can normalize line breaks. It converts any sequence of whitespace characters into a single space.',
      },
      {
        question: 'Will it remove all spaces from my text?',
        answer: 'No, it preserves single spaces between words. It only removes extra or redundant whitespace while maintaining proper word separation.',
      },
      {
        question: 'Does it handle tabs and special whitespace characters?',
        answer: 'Yes, the tool converts tabs and other whitespace characters to regular spaces, then removes any extra spaces to leave clean, single-spaced text.',
      },
      {
        question: 'Can I remove leading and trailing spaces too?',
        answer: 'Yes, the tool trims leading and trailing whitespace from the entire text as well as cleaning up extra spaces within the content.',
      },
      {
        question: 'Why would I need to remove extra spaces?',
        answer: 'Extra spaces can cause formatting issues in documents, websites, and databases. Clean spacing ensures consistent formatting and professional appearance.',
      },
    ],
    relatedTools: ['remove-line-breaks', 'text-cleaner', 'remove-html-tags'],
  },
  {
    id: 'capitalize-sentences',
    name: 'Capitalize Sentences',
    seoTitle: 'Capitalize Sentences – Free Online Tool',
    description: 'Free online Capitalize Sentences tool to capitalize the first letter of each sentence automatically. Fix capitalization errors and format text properly. Perfect for editing and proofreading content.',
    shortDescription: 'Capitalize sentences online',
    category: 'text',
    slug: 'capitalize-sentences',
    icon: 'CaseUpper',
    keywords: ['capitalize sentences', 'sentence case', 'fix capitalization', 'capitalize first letter'],
    tags: ['text', 'capitalize', 'sentences', 'sentence', 'case', 'fix', 'capitalization'],
    faq: [
      {
        question: 'How does sentence capitalization work?',
        answer: 'The tool identifies sentence boundaries (periods, exclamation marks, question marks) and capitalizes the first letter after each sentence ending punctuation.',
      },
      {
        question: 'Will it affect proper nouns or other capitalized words?',
        answer: 'The tool only changes the first letter of each sentence. Words that are already capitalized within sentences, like proper nouns, remain unchanged.',
      },
      {
        question: 'Does it handle abbreviations correctly?',
        answer: 'The tool recognizes common abbreviation patterns to avoid incorrectly capitalizing after periods in abbreviations like "Dr." or "etc.".',
      },
      {
        question: 'Can I use this for titles and headings?',
        answer: 'For titles, consider using Title Case instead. Sentence capitalization is best for paragraphs and regular body text.',
      },
      {
        question: 'What if my text has inconsistent spacing after periods?',
        answer: 'The tool works best with properly spaced text. Consider using the Remove Extra Spaces tool first to clean up spacing before capitalizing sentences.',
      },
    ],
    relatedTools: ['text-case-converter', 'text-cleaner', 'remove-extra-spaces'],
  },
  {
    id: 'text-cleaner',
    name: 'Text Cleaner',
    seoTitle: 'Text Cleaner – Free Online Tool',
    description: 'Free online Text Cleaner tool to clean and format text by removing extra spaces, line breaks, and special characters. Prepare text for publishing and data processing. All cleaning happens locally.',
    shortDescription: 'Clean and format text online',
    category: 'text',
    slug: 'text-cleaner',
    icon: 'Eraser',
    keywords: ['text cleaner', 'clean text', 'format text', 'text sanitizer'],
    tags: ['text', 'cleaner', 'clean', 'format', 'sanitizer'],
    faq: [
      {
        question: 'What does the Text Cleaner tool do?',
        answer: 'It removes unwanted elements from text including extra spaces, line breaks, tabs, and special characters. It helps prepare text for publishing, databases, or further processing.',
      },
      {
        question: 'Can I choose which elements to remove?',
        answer: 'Yes, you can select specific cleaning options such as removing extra spaces, line breaks, HTML tags, or special characters based on your needs.',
      },
      {
        question: 'Is my text sent to any server?',
        answer: 'No, all text cleaning happens locally in your browser. Your text never leaves your device, ensuring complete privacy and security.',
      },
      {
        question: 'What special characters can be removed?',
        answer: 'You can remove various special characters including punctuation, symbols, non-printable characters, and custom character sets that you specify.',
      },
      {
        question: 'Can I undo the cleaning if needed?',
        answer: 'The tool does not store your original text, so make sure to save a backup before cleaning. You can always paste the original text again if needed.',
      },
    ],
    relatedTools: ['remove-extra-spaces', 'text-case-converter', 'remove-html-tags'],
  },
  {
    id: 'rot13-encoder',
    name: 'ROT13 Encoder',
    seoTitle: 'ROT13 Encoder – Encode ROT13 Online (Free Tool)',
    description: 'Free online ROT13 Encoder tool to encode text using ROT13 cipher. Replace each letter with the letter 13 positions after it in the alphabet. Perfect for simple text obfuscation and puzzles.',
    shortDescription: 'Encode text with ROT13 cipher',
    category: 'text',
    slug: 'rot13-encoder',
    icon: 'Lock',
    keywords: ['rot13', 'encoder', 'cipher', 'encryption', 'caesar cipher'],
    tags: ['text', 'rot13', 'encoder', 'cipher', 'encryption', 'caesar'],
    faq: [
      {
        question: 'What is ROT13?',
        answer: 'ROT13 is a simple letter substitution cipher that replaces each letter with the 13th letter after it in the alphabet. It is its own inverse, meaning applying it twice returns the original text.',
      },
      {
        question: 'Is ROT13 secure for sensitive information?',
        answer: 'No, ROT13 is not secure and should never be used for protecting sensitive information. It is a simple obfuscation method that can be easily decoded by anyone.',
      },
      {
        question: 'What is ROT13 commonly used for?',
        answer: 'ROT13 is often used in online forums to hide spoilers, punchlines, or solutions to puzzles. It provides just enough obfuscation to prevent accidental reading.',
      },
      {
        question: 'Does ROT13 affect numbers and special characters?',
        answer: 'No, ROT13 only transforms letters A-Z (and a-z). Numbers, punctuation, and special characters remain unchanged in the output.',
      },
      {
        question: 'Why is it called ROT13?',
        answer: 'The name comes from "rotate by 13 places." Since the English alphabet has 26 letters, rotating by 13 positions creates a symmetric cipher where encoding and decoding use the same operation.',
      },
    ],
    relatedTools: ['rot13-decoder', 'morse-code-translator', 'base64-encode'],
  },
  {
    id: 'rot13-decoder',
    name: 'ROT13 Decoder',
    seoTitle: 'ROT13 Decoder – Decode ROT13 Online (Free Tool)',
    description: 'Free online ROT13 Decoder tool to decode ROT13 encoded text. Convert ROT13 cipher back to readable text instantly. Since ROT13 is symmetric, encoding and decoding use the same process.',
    shortDescription: 'Decode ROT13 cipher text',
    category: 'text',
    slug: 'rot13-decoder',
    icon: 'Unlock',
    keywords: ['rot13', 'decoder', 'cipher', 'decryption', 'caesar cipher'],
    tags: ['text', 'rot13', 'decoder', 'cipher', 'decryption', 'caesar'],
    faq: [
      {
        question: 'How does ROT13 decoding work?',
        answer: 'Since ROT13 is its own inverse, decoding is the same as encoding. Applying ROT13 to the encoded text returns the original message.',
      },
      {
        question: 'Can I decode any ROT13 text?',
        answer: 'Yes, any text encoded with ROT13 can be decoded. Simply paste the encoded text and the tool will convert it back to readable text.',
      },
      {
        question: 'How do I know if text is ROT13 encoded?',
        answer: 'ROT13 text often looks like readable letters but forms nonsense words. Common indicators include words that look unusual but contain only letters.',
      },
      {
        question: 'What if my text contains non-alphabetic characters?',
        answer: 'Non-alphabetic characters like numbers, spaces, and punctuation are preserved as-is during decoding. Only letters A-Z are transformed.',
      },
      {
        question: 'Can I decode ROT13 manually?',
        answer: 'Yes, you can decode ROT13 by hand by shifting each letter 13 positions in the alphabet. However, using this tool is much faster and eliminates errors.',
      },
    ],
    relatedTools: ['rot13-encoder', 'morse-code-translator', 'base64-decode'],
  },
  {
    id: 'morse-code-translator',
    name: 'Morse Code Translator',
    seoTitle: 'Morse Code Translator – Free Online Tool',
    description: 'Free online Morse Code Translator tool to translate text to Morse code and Morse code to text. Convert messages using dots and dashes. Perfect for learning Morse code and communication.',
    shortDescription: 'Translate text to/from Morse code',
    category: 'text',
    slug: 'morse-code-translator',
    icon: 'Radio',
    keywords: ['morse code', 'translator', 'morse', 'dot dash', 'telegraph'],
    tags: ['text', 'translator', 'morse', 'telegraph', 'code', 'dot', 'dash'],
    faq: [
      {
        question: 'What is Morse code?',
        answer: 'Morse code is a method of encoding text using sequences of dots and dashes (or dits and dahs) to represent letters, numbers, and punctuation. It was developed for telegraph communication.',
      },
      {
        question: 'Can I translate both ways - text to Morse and Morse to text?',
        answer: 'Yes, this tool supports bidirectional translation. Enter text to get Morse code, or enter Morse code (using dots, dashes, and spaces) to get readable text.',
      },
      {
        question: 'How are letters separated in Morse code?',
        answer: 'Letters are separated by a short pause (represented as a space in text). Words are separated by a longer pause (typically represented as a forward slash or multiple spaces).',
      },
      {
        question: 'Does Morse code support all characters?',
        answer: 'Standard Morse code supports letters A-Z, numbers 0-9, and some punctuation. Special characters and non-English letters may have extended Morse code representations.',
      },
      {
        question: 'Is Morse code still used today?',
        answer: 'Yes, Morse code is still used in aviation, amateur radio, emergency signaling, and assistive technology for people with disabilities. It remains a reliable backup communication method.',
      },
    ],
    relatedTools: ['ascii-converter', 'binary-converter', 'rot13-encoder'],
  },
  {
    id: 'ascii-converter',
    name: 'ASCII Converter',
    seoTitle: 'ASCII Converter – Convert ASCII Online (Free Tool)',
    description: 'Free online ASCII Converter tool to convert text to ASCII codes and ASCII codes to text. Translate between characters and their numeric representations. Perfect for encoding and debugging.',
    shortDescription: 'Convert text to/from ASCII codes',
    category: 'text',
    slug: 'ascii-converter',
    icon: 'Binary',
    keywords: ['ascii', 'converter', 'ascii code', 'character code', 'text to ascii'],
    tags: ['text', 'ascii', 'converter', 'code', 'character'],
    faq: [
      {
        question: 'What is ASCII?',
        answer: 'ASCII (American Standard Code for Information Interchange) is a character encoding standard that assigns numeric codes to letters, digits, punctuation, and control characters.',
      },
      {
        question: 'What ASCII code range does this tool support?',
        answer: 'This tool supports standard 7-bit ASCII (0-127) which includes letters, numbers, common punctuation, and control characters. Extended ASCII (128-255) may also be supported.',
      },
      {
        question: 'How do I convert text to ASCII codes?',
        answer: 'Simply enter your text and the tool will display the ASCII numeric code for each character. Each letter, number, and symbol has a unique ASCII value.',
      },
      {
        question: 'Can I convert ASCII codes back to text?',
        answer: 'Yes, enter ASCII codes (typically separated by spaces or commas) and the tool will convert them back to readable text characters.',
      },
      {
        question: 'Why would I need ASCII codes?',
        answer: 'ASCII codes are useful for programming, debugging character encoding issues, understanding how computers store text, and working with systems that require numeric character representation.',
      },
    ],
    relatedTools: ['binary-converter', 'hex-converter', 'morse-code-translator'],
  },

  // ==================== IMAGE TOOLS ====================
  {
    id: 'image-resize',
    name: 'Image Resizer',
    seoTitle: 'Image Resizer – Resize Image Online (Free Tool)',
    description: 'Resize images online without losing quality. Support for PNG, JPG, and WebP formats.',
    shortDescription: 'Resize images online',
    category: 'image',
    slug: 'image-resize',
    icon: 'Scaling',
    keywords: ['image resize', 'resize photo', 'picture resizer', 'image size'],
    tags: ['image', 'resize', 'photo', 'picture', 'resizer', 'size'],
    faq: [
      {
        question: 'How do I resize an image without losing quality?',
        answer: 'Upload your image, enter the desired width and height in pixels, and click Resize. For best results, use the "Maintain aspect ratio" option to prevent stretching. Reducing dimensions preserves quality, while enlarging may cause slight blurriness.',
      },
      {
        question: 'What image formats are supported for resizing?',
        answer: 'Our Image Resizer supports all major formats including PNG, JPEG, WebP, GIF, and BMP. You can upload any common image format and download the resized result as PNG.',
      },
      {
        question: 'Can I resize multiple images at once?',
        answer: 'Currently, you can resize one image at a time. For batch resizing, process each image individually. All processing happens locally in your browser, so your images remain private and secure.',
      },
      {
        question: 'Does resizing reduce image file size?',
        answer: 'Yes, reducing image dimensions typically reduces file size because there are fewer pixels to store. For example, halving both width and height reduces the pixel count by 75%, which can significantly reduce file size.',
      },
      {
        question: 'What is the recommended size for social media?',
        answer: 'Common targets: Instagram square 1080×1080, Instagram Reels / TikTok 1080×1920, Facebook cover 820×312, Twitter post 1600×900, YouTube thumbnail 1280×720. Resize to these exact sizes to avoid platform-side recompression.',
      },
    ],
    relatedTools: ['resize-image-percentage', 'crop-image', 'rotate-image'],
    seoContent: {
      intro: "Image Resize changes the dimensions of any image (PNG, JPG, WebP, GIF) entirely in your browser. Set absolute pixels, scale by percentage, or fit within a target while preserving aspect ratio. Resizing uses the browser's canvas API — your image never uploads anywhere, so private screenshots and confidential drawings stay on your device.",
      examples: [
        {
          title: "Fit an image into a blog hero (1200×630)",
          body: "Set width 1200, height 630, with \"cover\" mode — image fills the slot without distortion, edges cropped to match.",
        },
        {
          title: "Shrink a screenshot to 50%",
          body: "Use percentage mode at 50% — quick way to halve a 4K screenshot before pasting into an issue tracker.",
        },
        {
          title: "Generate Open Graph sizes",
          body: "Resize the same source to 1200×630 (OG), 1080×1080 (Instagram), 1500×500 (Twitter banner) for a multi-platform release.",
        },
      ],
      useCases: [
        "Preparing images for blog posts, landing pages, and email campaigns",
        "Resizing screenshots before posting to issue trackers or chat",
        "Creating thumbnails at consistent sizes for a CMS",
        "Generating profile pictures cropped to a square",
        "Down-sampling huge photos before uploading to a low-bandwidth platform",
      ],
      troubleshooting: [
        {
          problem: "Resized image looks blurry.",
          solution: "You're likely upscaling. Resizing past 100% can't add detail. Start from a higher-resolution source or use an AI upscaler instead.",
        },
        {
          problem: "Aspect ratio changed even though I locked it.",
          solution: "Toggle \"preserve aspect ratio\" before changing either dimension. The other dimension auto-adjusts based on the original ratio.",
        },
        {
          problem: "File size barely changed.",
          solution: "Resize reduces pixels but not necessarily filesize for already-compressed JPEGs at high quality. Combine with the image compressor to reduce bytes further.",
        },
      ],
    },
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    seoTitle: 'Image to Base64 – Free Online Tool',
    description: 'Free online Image to Base64 tool to convert images to Base64 encoded strings. Embed images directly in HTML, CSS, or JSON. Supports JPEG, PNG, GIF, and WebP. All conversion happens locally.',
    shortDescription: 'Convert image to Base64',
    category: 'image',
    slug: 'image-to-base64',
    icon: 'Binary',
    keywords: ['image to base64', 'base64 image', 'encode image', 'image encoder'],
    tags: ['image', 'base64', 'encode', 'encoder'],
    faq: [
      {
        question: 'What is Base64 encoding for images?',
        answer: 'Base64 encoding converts image binary data into a text string using ASCII characters. This allows you to embed images directly in HTML, CSS, or JSON files without needing separate image files.',
      },
      {
        question: 'When should I use Base64 images?',
        answer: 'Base64 images are useful for small icons, email templates, CSS backgrounds, and API responses. Avoid using Base64 for large images as the encoded string is about 33% larger than the original file.',
      },
      {
        question: 'Does Base64 encoding reduce image quality?',
        answer: 'No, Base64 encoding is lossless. The decoded image is identical to the original. The trade-off is increased file size (roughly 33% larger), not quality loss.',
      },
      {
        question: 'How do I use a Base64 image in HTML or CSS?',
        answer: 'In HTML: `<img src="data:image/png;base64,...">`. In CSS: `background-image: url("data:image/png;base64,...")`. The tool gives you the full data URI ready to paste.',
      },
      {
        question: 'Can I convert Base64 back to a regular image file?',
        answer: 'Yes — use our Base64 to Image tool. Paste the Base64 string and it produces a downloadable PNG/JPG/etc. file.',
      },
    ],
    relatedTools: ['base64-to-image', 'base64-encode', 'image-resize'],
  },
  {
    id: 'base64-to-image',
    name: 'Base64 to Image',
    seoTitle: 'Base64 to Image – Free Online Tool',
    description: 'Free online Base64 to Image tool to convert Base64 encoded strings back to images. Preview and download the decoded image instantly. All conversion happens locally in your browser.',
    shortDescription: 'Convert Base64 to image',
    category: 'image',
    slug: 'base64-to-image',
    icon: 'Image',
    keywords: ['base64 to image', 'decode image', 'base64 decoder', 'image decoder'],
    tags: ['image', 'base64', 'decode', 'decoder'],
    faq: [
      {
        question: 'How do I convert a Base64 string to an image?',
        answer: 'Paste your Base64 encoded string (with or without the data URI prefix) into the tool, and it will automatically decode and display the image. You can then download it as a standard image file.',
      },
      {
        question: 'What Base64 formats are supported?',
        answer: 'The tool supports all common Base64 image formats including data URIs with MIME type prefixes (data:image/png;base64,...) and raw Base64 strings for PNG, JPEG, GIF, WebP, and SVG images.',
      },
      {
        question: 'My Base64 string fails to decode — why?',
        answer: 'Common causes: extra whitespace or line breaks (paste it as a single line), missing padding "=" characters, or a "data:" prefix only partially copied. The tool tries to be forgiving but malformed strings cannot be fixed automatically.',
      },
      {
        question: 'How do I know what image format the Base64 represents?',
        answer: 'The first few bytes (after decoding) contain a signature: PNG starts with "iVBORw0KGgo", JPEG with "/9j/", GIF with "R0lGOD". Our tool detects this automatically.',
      },
      {
        question: 'Can I edit the image after decoding?',
        answer: 'Yes — download the decoded file and run it through any other image tool (resize, crop, compress, etc.). The output is a regular image file.',
      },
    ],
    relatedTools: ['image-to-base64', 'base64-decode', 'image-resize'],
  },
  {
    id: 'image-to-ico',
    name: 'Image to ICO Converter',
    seoTitle: 'Image to ICO Converter – Convert Image Online (Free Tool)',
    description: 'Free online Image to ICO Converter tool to convert PNG and JPEG images to ICO format. Create favicons for websites from any image. All conversion happens locally in your browser.',
    shortDescription: 'Convert image to ICO format',
    category: 'image',
    slug: 'image-to-ico',
    icon: 'FileImage',
    keywords: ['image to ico', 'ico converter', 'favicon generator', 'icon maker'],
    tags: ['image', 'ico', 'converter', 'favicon', 'generator', 'icon', 'maker'],
    faq: [
      {
        question: 'What is an ICO file?',
        answer: 'ICO is an image file format used for icons in Microsoft Windows. It can contain multiple sizes of the same icon in one file. ICO files are commonly used as favicons for websites.',
      },
      {
        question: 'What sizes should my favicon be?',
        answer: 'The most common favicon sizes are 16x16 (browser tab), 32x32 (browser tab Retina), 48x48 (Windows taskbar), and 180x180 (Apple Touch Icon). Our tool generates all these sizes from a single image.',
      },
      {
        question: 'Can I convert PNG to ICO?',
        answer: 'Yes, you can convert PNG, JPEG, or WebP images to ICO format. For best results, use a square PNG image with transparency. Upload your image, select the desired sizes, and download the ICO file.',
      },
      {
        question: 'Is ICO still used today?',
        answer: 'Yes — ICO is still the standard format for Windows desktop icons and is widely supported as a fallback favicon format. Modern browsers also accept PNG favicons, but ICO is the safest cross-browser bet.',
      },
      {
        question: 'Why does my ICO favicon look blurry?',
        answer: 'The browser may be downscaling a single large size to 16×16, which looks soft. Include a hand-crafted 16×16 and 32×32 in the ICO so each browser size has a pixel-perfect rendition.',
      },
    ],
    relatedTools: ['favicon-generator', 'image-resize', 'svg-to-png'],
  },
  {
    id: 'webp-to-png',
    name: 'WebP to PNG Converter',
    seoTitle: 'WebP to PNG Converter – Convert WebP Online (Free Tool)',
    description: 'Free online WebP to PNG Converter tool to convert WebP images to PNG format. Maintain transparency and quality during conversion. All processing happens locally in your browser.',
    shortDescription: 'Convert WebP to PNG',
    category: 'image',
    slug: 'webp-to-png',
    icon: 'ImageDown',
    keywords: ['webp to png', 'convert webp', 'webp converter', 'image converter'],
    tags: ['image', 'webp', 'png', 'convert', 'converter'],
    faq: [
      {
        question: 'Why should I convert WebP to PNG?',
        answer: 'PNG offers wider compatibility across all applications and platforms. It also supports lossless compression with transparency, making it ideal for graphics, logos, and screenshots where pixel-perfect quality matters.',
      },
      {
        question: 'Does converting WebP to PNG reduce quality?',
        answer: 'No, converting WebP to PNG is lossless. The PNG output preserves all the visual data from the original WebP image, including transparency (alpha channel).',
      },
      {
        question: 'Will the PNG file be larger than WebP?',
        answer: 'Yes, PNG files are typically larger than WebP files because WebP uses more efficient compression. If file size is a concern, consider keeping the WebP format or using our Image Compressor tool.',
      },
      {
        question: 'Why do some browsers still not display my WebP?',
        answer: 'WebP has 97%+ global support, but some legacy email clients, image viewers, or older Office versions still cannot read it. Converting to PNG guarantees universal compatibility.',
      },
      {
        question: 'Is the conversion fast for large WebP files?',
        answer: 'Conversion is near-instant for typical photos. Very large WebP (multi-MB) may take a couple of seconds in the browser. Output is always lossless PNG.',
      },
    ],
    relatedTools: ['png-to-webp', 'jpg-to-png', 'svg-to-png'],
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP Converter',
    seoTitle: 'PNG to WebP Converter – Convert PNG Online (Free Tool)',
    description: 'Free online PNG to WebP Converter tool to convert PNG images to WebP format for smaller file sizes. Maintain transparency and reduce bandwidth usage. All conversion happens locally.',
    shortDescription: 'Convert PNG to WebP',
    category: 'image',
    slug: 'png-to-webp',
    icon: 'ImageUp',
    keywords: ['png to webp', 'convert png', 'webp converter', 'image optimization'],
    tags: ['image', 'png', 'webp', 'convert', 'converter', 'optimization'],
    faq: [
      {
        question: 'Why convert PNG to WebP?',
        answer: 'WebP files are typically 25-35% smaller than PNG files at equivalent quality. This means faster page loads, reduced bandwidth costs, and better website performance. WebP also supports both lossy and lossless compression with transparency.',
      },
      {
        question: 'Do all browsers support WebP?',
        answer: 'WebP is supported by all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. It has over 97% global browser support as of 2024. Only very old browsers may not support it.',
      },
      {
        question: 'Does WebP support transparency like PNG?',
        answer: 'Yes, WebP supports alpha channel transparency just like PNG. You can convert transparent PNG images to WebP without losing the transparent background.',
      },
      {
        question: 'Should I use lossy or lossless WebP?',
        answer: 'Lossless WebP is 20–30% smaller than PNG with identical visual fidelity — ideal for logos and screenshots. Lossy WebP is 50–80% smaller and visually similar — ideal for photographic content.',
      },
      {
        question: 'Will the WebP work everywhere?',
        answer: 'In all modern browsers, yes (97%+ support). For legacy email clients or very old software, keep a PNG fallback alongside the WebP — most CMS platforms can serve format based on the request headers.',
      },
    ],
    relatedTools: ['webp-to-png', 'png-to-jpg', 'image-compressor'],
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    seoTitle: 'JPG to PNG Converter – Convert JPG Online (Free Tool)',
    description: 'Free online JPG to PNG Converter tool to convert JPEG images to PNG format with transparency support. Change image format while maintaining quality. All processing happens locally.',
    shortDescription: 'Convert JPG to PNG',
    category: 'image',
    slug: 'jpg-to-png',
    icon: 'ImageOff',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg', 'image converter'],
    tags: ['image', 'jpg', 'png', 'jpeg', 'convert', 'converter'],
    faq: [
      {
        question: 'When should I convert JPG to PNG?',
        answer: 'Convert JPG to PNG when you need transparency, lossless quality, or crisp edges (like logos and text). PNG is better for graphics and screenshots, while JPG is better for photographs.',
      },
      {
        question: 'Does JPG to PNG conversion improve quality?',
        answer: 'Converting JPG to PNG preserves the current quality but does not restore data already lost to JPG compression. However, it prevents further quality loss during editing since PNG is lossless.',
      },
      {
        question: 'Why is the PNG bigger than the JPG?',
        answer: 'PNG is lossless and stores every pixel exactly. For photo content, that is always larger than JPG. The trade-off is no future quality loss — important if you plan more edits.',
      },
      {
        question: 'Does PNG output keep transparency?',
        answer: 'JPG has no transparency to keep, so the resulting PNG is fully opaque. If you need to remove a solid background, do that step before converting (or after, in an image editor).',
      },
      {
        question: 'Is the conversion done in my browser?',
        answer: 'Yes. The image is decoded and re-encoded entirely client-side. Nothing is uploaded, and your file never leaves your device.',
      },
    ],
    relatedTools: ['png-to-jpg', 'webp-to-png', 'jpeg-compressor'],
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    seoTitle: 'PNG to JPG Converter – Convert PNG Online (Free Tool)',
    description: 'Free online PNG to JPG Converter tool to convert PNG images to JPEG format. Handle transparency by using white or custom background color. All conversion happens locally in your browser.',
    shortDescription: 'Convert PNG to JPG',
    category: 'image',
    slug: 'png-to-jpg',
    icon: 'ImagePlus',
    keywords: ['png to jpg', 'convert png', 'jpg converter', 'image converter'],
    tags: ['image', 'png', 'jpg', 'convert', 'converter'],
    faq: [
      {
        question: 'Why convert PNG to JPG?',
        answer: 'JPG files are significantly smaller than PNG files for photographs and complex images. Converting PNG to JPG reduces file size, making images faster to upload, share, and load on websites.',
      },
      {
        question: 'What happens to transparency when converting PNG to JPG?',
        answer: 'JPG does not support transparency. When you convert a transparent PNG to JPG, the transparent areas are filled with a background color (white by default). You can choose a custom background color in the tool.',
      },
      {
        question: 'What JPG quality is used?',
        answer: 'Default quality is 90 — high quality with substantial file-size savings vs PNG. If you need even smaller files, run the result through the JPEG Compressor with quality 70–80.',
      },
      {
        question: 'How much smaller will the file be?',
        answer: 'Photographic PNGs typically shrink 70–90% when converted to JPG at quality 90. Screenshots and graphics with sharp edges may shrink less and can show JPG artifacts — keep them as PNG.',
      },
      {
        question: 'When should I NOT convert PNG to JPG?',
        answer: 'Avoid converting logos, line art, screenshots, or any image with transparency or sharp edges — JPG introduces visible artifacts on those. Keep them as PNG or convert to WebP instead.',
      },
    ],
    relatedTools: ['jpg-to-png', 'png-to-webp', 'jpeg-compressor'],
  },
  {
    id: 'resize-image-percentage',
    name: 'Resize Image by Percentage',
    seoTitle: 'Resize Image by Percentage – Free Online Tool',
    description: 'Resize images by percentage. Scale your photos up or down while maintaining aspect ratio.',
    shortDescription: 'Resize image by percentage',
    category: 'image',
    slug: 'resize-image-percentage',
    icon: 'Percent',
    keywords: ['resize percentage', 'scale image', 'image percentage', 'resize by percent'],
    tags: ['image', 'resize', 'percentage', 'scale', 'percent'],
    faq: [
      {
        question: 'How do I resize an image by percentage?',
        answer: 'Upload your image, select a preset percentage or enter a custom value, and click Resize. The image will be scaled proportionally. For example, 50% reduces the image to half its original dimensions.',
      },
      {
        question: 'What percentage should I use to reduce file size?',
        answer: 'Reducing to 50% scales dimensions to half, which reduces pixel count by 75% and typically reduces file size significantly. For moderate reduction, try 75%. For thumbnails, 25% works well.',
      },
      {
        question: 'Does percentage resizing maintain aspect ratio?',
        answer: 'Yes, percentage resizing always maintains the original aspect ratio. Both width and height are scaled by the same percentage, so the image will never be stretched or distorted.',
      },
      {
        question: 'Can I go above 100%?',
        answer: 'Yes, but enlarging beyond 100% (e.g. 150%, 200%) interpolates new pixels, which softens detail. For best results when upscaling, use the original highest-resolution version of the image.',
      },
      {
        question: 'When should I use percentage vs exact pixel resizing?',
        answer: 'Use percentage when you have a batch of images of varying sizes and want them all scaled the same proportion. Use exact pixel dimensions when you need a specific output size (e.g. 1080 px wide for Instagram).',
      },
    ],
    relatedTools: ['image-resize', 'crop-image'],
  },
{
    id: 'rotate-image',
    name: 'Rotate Image',
    seoTitle: 'Rotate Image – Free Online Tool',
    description: 'Free online Rotate Image tool to rotate images by any angle. Rotate photos 90, 180, or 270 degrees or set custom rotation. All processing happens locally in your browser.',
    shortDescription: 'Rotate images online',
    category: 'image',
    slug: 'rotate-image',
    icon: 'RotateCw',
    keywords: ['rotate image', 'rotate photo', 'image rotation', 'flip image'],
    tags: ['image', 'rotate', 'photo', 'rotation', 'flip'],
    faq: [
      {
        question: 'How do I rotate an image?',
        answer: 'Upload your image, select a rotation angle using the preset buttons (90°, 180°, 270°) or the slider for custom angles, then click Apply Rotation. Download the rotated image in PNG format.',
      },
      {
        question: 'Will rotating an image reduce its quality?',
        answer: 'Rotating by 90°, 180°, or 270° preserves quality perfectly as pixels are just rearranged. Rotating by other angles may cause slight quality loss due to pixel interpolation, but the difference is usually negligible.',
      },
      {
        question: 'What is the difference between rotating and flipping?',
        answer: 'Rotation turns the image around a center point (like turning a photo on a table). Flipping creates a mirror reflection along the horizontal or vertical axis. Use rotation to change orientation and flipping to create mirror images.',
      },
      {
        question: 'Will the canvas grow when I rotate by a non-90° angle?',
        answer: 'Yes. When rotating by an arbitrary angle like 45°, the bounding box of the rotated image is larger than the original. The empty corners are filled with transparency (PNG) or a background color you choose.',
      },
      {
        question: 'Why does my phone photo appear sideways?',
        answer: 'Some cameras encode the upright orientation as metadata rather than rotating the pixels. After rotation here, the pixels themselves are correctly oriented, so the image displays right-side-up everywhere.',
      },
    ],
    relatedTools: ['flip-image-horizontal', 'flip-image-vertical', 'image-resize'],
  },
  {
    id: 'flip-image-horizontal',
    name: 'Flip Image Horizontal',
    seoTitle: 'Flip Image Horizontal – Free Online Tool',
    description: 'Free online Flip Image Horizontal tool to mirror images horizontally. Create a mirror reflection of your photos instantly. All processing happens locally in your browser.',
    shortDescription: 'Flip image horizontally',
    category: 'image',
    slug: 'flip-image-horizontal',
    icon: 'FlipHorizontal',
    keywords: ['flip horizontal', 'mirror image', 'horizontal flip', 'flip photo'],
    tags: ['image', 'flip', 'horizontal', 'mirror', 'photo'],
    faq: [
      {
        question: 'What does flipping an image horizontally do?',
        answer: 'Flipping horizontally creates a left-to-right mirror image. Everything on the left side appears on the right and vice versa, like looking at the image in a mirror.',
      },
      {
        question: 'Why would I flip an image horizontally?',
        answer: 'Common reasons include correcting selfies that appear mirrored, creating symmetrical designs, fixing incorrectly scanned documents, or achieving a specific artistic effect.',
      },
      {
        question: 'Will flipping change image quality?',
        answer: 'No. Horizontal flip just rearranges existing pixels — no resampling or re-encoding loss. The output is bit-for-bit equivalent in quality to the input.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'PNG, JPG, WebP, GIF, BMP, and most other common formats. The output uses PNG by default to keep transparency intact, but you can save as JPG if you prefer smaller files.',
      },
      {
        question: 'Is the flip the same as a 180° rotation?',
        answer: 'No. A horizontal flip mirrors left↔right (text becomes backwards). A 180° rotation flips both horizontally AND vertically (text is upside-down and backwards). Use Flip Vertical and Rotate Image for those other effects.',
      },
    ],
    relatedTools: ['flip-image-vertical', 'rotate-image', 'crop-image'],
  },
  {
    id: 'flip-image-vertical',
    name: 'Flip Image Vertical',
    seoTitle: 'Flip Image Vertical – Free Online Tool',
    description: 'Free online Flip Image Vertical tool to mirror images vertically. Create an upside-down reflection of your photos. All processing happens locally in your browser.',
    shortDescription: 'Flip image vertically',
    category: 'image',
    slug: 'flip-image-vertical',
    icon: 'FlipVertical',
    keywords: ['flip vertical', 'vertical flip', 'flip photo', 'mirror vertical'],
    tags: ['image', 'flip', 'vertical', 'photo', 'mirror'],
    faq: [
      {
        question: 'What does flipping an image vertically do?',
        answer: 'Flipping vertically creates a top-to-bottom mirror image. The top of the image appears at the bottom and vice versa, turning the image upside down while maintaining left-right orientation.',
      },
      {
        question: 'When should I flip an image vertically?',
        answer: 'Vertical flipping is useful for creating reflection effects, correcting upside-down images from scanners or cameras, or creating artistic compositions with mirrored elements.',
      },
      {
        question: 'Does flipping reduce quality?',
        answer: 'No. Vertical flip is a pixel-rearrangement operation with zero quality loss — the output retains the same resolution and detail as the input.',
      },
      {
        question: 'How is vertical flip different from rotation?',
        answer: 'Vertical flip mirrors top↔bottom; rotation turns the image around its center. A 180° rotation looks like a flip in both axes, but is not the same as one-axis flipping.',
      },
      {
        question: 'What image formats can I flip?',
        answer: 'PNG, JPG, WebP, GIF (first frame only for static output), and BMP. Output keeps the original color depth and transparency.',
      },
    ],
    relatedTools: ['flip-image-horizontal', 'rotate-image', 'crop-image'],
  },
  {
    id: 'blur-image',
    name: 'Blur Image',
    seoTitle: 'Blur Image – Free Online Tool',
    description: 'Free online Blur Image tool to blur images and photos with adjustable intensity. Apply Gaussian blur effect for privacy or artistic purposes. All processing happens locally.',
    shortDescription: 'Blur images online',
    category: 'image',
    slug: 'blur-image',
    icon: 'EyeOff',
    keywords: ['blur image', 'image blur', 'blur photo', 'blur effect'],
    tags: ['image', 'blur', 'photo', 'effect'],
    faq: [
      {
        question: 'Why would I blur an image?',
        answer: 'Blurring is commonly used to protect privacy (hiding faces, license plates, or sensitive information), create depth-of-field effects, soften backgrounds, or add artistic effects to photos.',
      },
      {
        question: 'Is this blur tool free and private?',
        answer: 'Yes, this tool is completely free and processes everything locally in your browser. Your images are never uploaded to any server, ensuring complete privacy.',
      },
      {
        question: 'Can I adjust the blur intensity?',
        answer: 'Yes, use the slider to adjust blur amount from 0 (no blur) to 10 (heavy blur). The preview updates in real-time so you can see the effect before downloading.',
      },
      {
        question: 'Is blur reversible?',
        answer: 'No. Blur is a destructive operation — pixel detail is permanently averaged together. Always keep an unblurred copy of the original if you may need it later.',
      },
      {
        question: 'Why use blur instead of pixelation for privacy?',
        answer: 'Strong pixelation can sometimes be reversed by AI tools. For sensitive content (faces, license plates, IDs), heavy blur or a solid-color block is more secure than mild pixelation.',
      },
    ],
    relatedTools: ['pixelate-image', 'grayscale-image', 'adjust-brightness'],
  },
  {
    id: 'pixelate-image',
    name: 'Pixelate Image',
    seoTitle: 'Pixelate Image – Free Online Tool',
    description: 'Free online Pixelate Image tool to pixelate images for privacy or artistic effects. Adjust pixel size to control the level of obscurity. All processing happens locally in your browser.',
    shortDescription: 'Pixelate images online',
    category: 'image',
    slug: 'pixelate-image',
    icon: 'Grid3x3',
    keywords: ['pixelate image', 'pixel effect', 'mosaic effect', 'pixelate photo'],
    tags: ['image', 'pixelate', 'pixel', 'effect', 'mosaic', 'photo'],
    faq: [
      {
        question: 'What is image pixelation?',
        answer: 'Pixelation reduces image detail by grouping pixels into larger blocks of uniform color, creating a mosaic-like effect. Higher pixel size values create a more abstract, blocky appearance.',
      },
      {
        question: 'What is the difference between blurring and pixelating?',
        answer: 'Blurring smoothly blends colors together for a soft effect, while pixelation creates distinct square blocks. Pixelation is often preferred for censoring content as it makes details completely unrecognizable.',
      },
      {
        question: 'How do I pixelate a face in a photo?',
        answer: 'Upload your photo, adjust the pixel size slider to control the level of obscurity, and download the result. For faces, a pixel size of 10-20 usually provides good privacy protection.',
      },
      {
        question: 'Can pixelation be reversed?',
        answer: 'Mild pixelation can sometimes be partially reversed by AI super-resolution models, especially on faces. For real privacy on sensitive material, use heavy pixelation (size 20+), strong blur, or a solid block.',
      },
      {
        question: 'Will pixelation reduce file size?',
        answer: 'Slightly — the simpler color palette compresses better, especially in PNG. The reduction is usually 10–30%, not dramatic.',
      },
    ],
    relatedTools: ['blur-image', 'grayscale-image', 'image-border'],
  },
  {
    id: 'grayscale-image',
    name: 'Grayscale Image',
    seoTitle: 'Grayscale Image – Free Online Tool',
    description: 'Free online Grayscale Image tool to convert images to black and white. Remove color information while maintaining image structure. All processing happens locally in your browser.',
    shortDescription: 'Convert image to grayscale',
    category: 'image',
    slug: 'grayscale-image',
    icon: 'CircleHalf',
    keywords: ['grayscale', 'black and white', 'bw image', 'monochrome'],
    tags: ['image', 'grayscale', 'monochrome', 'black', 'white'],
    faq: [
      {
        question: 'What is a grayscale image?',
        answer: 'A grayscale image uses only shades of gray, from black to white, removing all color information. Each pixel is represented by a single lightness value instead of RGB color values.',
      },
      {
        question: 'Why convert an image to grayscale?',
        answer: 'Grayscale conversion is used for artistic effects, reducing visual complexity, preparing images for printing, meeting document requirements, or creating a classic, timeless aesthetic.',
      },
      {
        question: 'Does converting to grayscale reduce file size?',
        answer: 'Yes, grayscale images are typically smaller than color images because they store one channel instead of three (RGB). The reduction can be significant for PNG files.',
      },
      {
        question: 'Is grayscale the same as black and white?',
        answer: 'Grayscale includes all shades of gray (256 levels). True black and white (1-bit) uses only pure black and pure white. Grayscale preserves detail; B&W is a stark high-contrast effect.',
      },
      {
        question: 'Can I bring color back after grayscale conversion?',
        answer: 'No — once color information is discarded, it cannot be recovered. Always keep the original color image if you might want it back. AI tools can "colorize" grayscale photos but they invent colors rather than recover them.',
      },
    ],
    relatedTools: ['blur-image', 'pixelate-image', 'adjust-brightness'],
  },
  {
    id: 'adjust-brightness',
    name: 'Adjust Image Brightness',
    seoTitle: 'Adjust Image Brightness – Free Online Tool',
    description: 'Adjust brightness and contrast of images. Make your photos lighter or darker.',
    shortDescription: 'Adjust image brightness',
    category: 'image',
    slug: 'adjust-brightness',
    icon: 'Sun',
    keywords: ['brightness', 'adjust brightness', 'image brightness', 'photo brightness'],
    tags: ['image', 'brightness', 'adjust', 'photo'],
    faq: [
      {
        question: 'How do I adjust image brightness?',
        answer: 'Upload your image and use the brightness slider. Values below 100% darken the image, 100% keeps the original, and values above 100% brighten it. The preview updates in real-time.',
      },
      {
        question: 'What brightness value should I use?',
        answer: 'For slightly dark photos, try 110-130%. For overexposed images, try 70-90%. The default is 100% (original brightness). Use the preview to find the best value for your image.',
      },
      {
        question: 'What is the difference between brightness and contrast?',
        answer: 'Brightness uniformly increases or decreases all light values in the image. Contrast adjusts the difference between the lightest and darkest areas. Increasing brightness makes everything lighter, while increasing contrast makes lights lighter and darks darker.',
      },
      {
        question: 'Will adjusting brightness lose image detail?',
        answer: 'Extreme values clip data: very high brightness blows out highlights to pure white, very low crushes shadows to black. Once clipped, that detail cannot be recovered. Moderate adjustments preserve most detail.',
      },
      {
        question: 'Does brightness adjustment work on all formats?',
        answer: 'Yes — PNG, JPG, WebP, GIF, BMP all supported. The output keeps the same format as the input (except GIFs become single-frame PNG/JPG).',
      },
    ],
    relatedTools: ['grayscale-image', 'blur-image', 'image-border'],
  },
  {
    id: 'image-color-picker',
    name: 'Image Color Picker',
    seoTitle: 'Image Color Picker – Free Online Tool',
    description: 'Free online Image Color Picker tool to pick colors from images. Get HEX, RGB, and HSL color values from any pixel in your image. All processing happens locally.',
    shortDescription: 'Pick colors from images',
    category: 'image',
    slug: 'image-color-picker',
    icon: 'Pipette',
    keywords: ['color picker', 'image color', 'pick color', 'extract color'],
    tags: ['image', 'color', 'picker', 'pick', 'extract'],
    faq: [
      {
        question: 'How do I pick a color from an image?',
        answer: 'Upload your image and click anywhere on it to instantly get the HEX and RGB color values of that pixel. You can copy the values with one click and add colors to your palette.',
      },
      {
        question: 'What color formats does the tool support?',
        answer: 'The tool shows color values in HEX (e.g., #FF5733) and RGB (e.g., rgb(255, 87, 51)) formats. Both formats can be copied to clipboard with a single click.',
      },
      {
        question: 'Can I pick multiple colors from one image?',
        answer: 'Yes, click on different parts of the image to pick colors. Use the "Add to Palette" button to save each picked color. All saved colors are displayed in a palette list with their HEX and RGB values.',
      },
      {
        question: 'How accurate is the color reading?',
        answer: 'The tool reads the exact pixel value at the point you clicked — pixel-perfect. If the displayed color does not match what you see, it may be due to JPEG compression introducing noise around edges. Click on a flat-color area for a clean reading.',
      },
      {
        question: 'How is this different from Extract Colors?',
        answer: 'This tool reads the exact color you click on. Extract Colors automatically finds the most common (dominant) colors across the whole image and gives you a palette. Use this for spot picking, that one for an overall palette.',
      },
    ],
    relatedTools: ['color-picker', 'extract-colors', 'image-border'],
  },
  {
    id: 'extract-colors',
    name: 'Extract Colors from Image',
    seoTitle: 'Extract Colors from Image – Free Online Tool',
    description: 'Extract dominant colors from images. Get color palettes from any photo.',
    shortDescription: 'Extract colors from images',
    category: 'image',
    slug: 'extract-colors',
    icon: 'Palette',
    keywords: ['extract colors', 'color palette', 'dominant colors', 'image colors'],
    tags: ['image', 'extract', 'colors', 'color', 'palette', 'dominant'],
    faq: [
      {
        question: 'How does color extraction work?',
        answer: 'The tool analyzes your image and identifies the most frequently occurring colors. It groups similar colors together and ranks them by how much of the image they cover, giving you the dominant color palette.',
      },
      {
        question: 'How many colors can I extract?',
        answer: 'You can choose to extract 5, 10, 15, or 20 dominant colors from your image. More colors give a more complete palette, while fewer colors highlight the most important ones.',
      },
      {
        question: 'Can I export the extracted colors?',
        answer: 'Yes, you can export the color palette as CSS variables or JSON format using the export buttons. This makes it easy to use the colors in your web development or design projects.',
      },
      {
        question: 'Why does the palette include similar shades?',
        answer: 'Real photos contain many slight variations of the same color (lighting, shadows). The algorithm groups them but very subtle differences may still show as separate entries. Lower the requested count for a more distinct palette.',
      },
      {
        question: 'Does this work on photos vs flat illustrations?',
        answer: 'Both, but flat illustrations and logos give cleaner palettes since they contain fewer color clusters. Photos return more nuanced palettes that capture lighting and gradient tones.',
      },
    ],
    relatedTools: ['color-palette-generator', 'image-color-picker', 'color-picker'],
  },
  {
    id: 'image-border',
    name: 'Add Image Border',
    seoTitle: 'Add Image Border – Free Online Tool',
    description: 'Add custom borders to images. Choose border color, width, and style.',
    shortDescription: 'Add border to image',
    category: 'image',
    slug: 'image-border',
    icon: 'Frame',
    keywords: ['image border', 'add border', 'photo border', 'picture frame'],
    tags: ['image', 'border', 'add', 'photo', 'picture', 'frame'],
    faq: [
      {
        question: 'How do I add a border to my image?',
        answer: 'Upload your image, set the border width and color, then click Download. The preview updates in real-time so you can see exactly how the border will look before saving.',
      },
      {
        question: 'What border colors are available?',
        answer: 'You can choose any color using the color picker. Common choices include black, white, and gray for clean looks, or custom colors to match your brand or design theme.',
      },
      {
        question: 'Will adding a border increase the image dimensions?',
        answer: 'Yes, the border adds to the overall image dimensions. For example, adding a 10px border to a 800x600 image results in an 820x620 image. The original image content is not cropped or scaled.',
      },
      {
        question: 'What border width works best for social media?',
        answer: 'For Instagram squares, a 20–40 px white border looks clean. For polaroid-style framing, use a thicker bottom border. The preview lets you experiment without committing.',
      },
      {
        question: 'Can I add a border without changing the image dimensions?',
        answer: 'For an inset border that does not enlarge the canvas, use the Crop Image tool to trim the image first, then add the border. The total dimensions then match the original.',
      },
    ],
    relatedTools: ['blur-image', 'grayscale-image', 'image-color-picker'],
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    seoTitle: 'Favicon Generator – Generate Favicon Online (Free Tool)',
    description: 'Free online Favicon Generator tool to create favicons from images. Generate multiple sizes for various devices and platforms. All processing happens locally in your browser.',
    shortDescription: 'Generate favicon online',
    category: 'image',
    slug: 'favicon-generator',
    icon: 'Star',
    keywords: ['favicon', 'favicon generator', 'website icon', 'browser icon'],
    tags: ['image', 'favicon', 'generator', 'website', 'icon'],
    faq: [
      {
        question: 'What sizes do I need for a favicon?',
        answer: 'You need multiple sizes: 16x16 and 32x32 for browser tabs, 48x48 for Windows, 180x180 for Apple Touch Icon, 192x192 for Android Chrome, and 512x512 for PWA splash screens.',
      },
      {
        question: 'What image should I use for a favicon?',
        answer: 'Use a square image (ideally 512x512 or larger) with a simple, recognizable design. PNG with transparency works best. Avoid complex details as favicons are displayed very small.',
      },
      {
        question: 'How do I add a favicon to my website?',
        answer: 'Generate your favicons, download them, and place them in your website root directory. Copy the provided HTML snippet into the <head> section of your pages. The tool generates the correct code for you.',
      },
      {
        question: 'Why is my favicon not updating in the browser?',
        answer: 'Browsers aggressively cache favicons. Force a refresh with Ctrl+F5, or append a query string to the favicon URL (e.g. `favicon.ico?v=2`) to bypass the cache. Mobile browsers can take longer to update.',
      },
      {
        question: 'Do I still need favicon.ico in 2026?',
        answer: 'Modern browsers accept PNG and SVG favicons, but `favicon.ico` at the site root is still the universal fallback. The tool generates both so you are covered everywhere.',
      },
    ],
    relatedTools: ['image-to-ico', 'image-resize', 'svg-to-png'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    seoTitle: 'Image Compressor – Compress Image Online (Free Tool)',
    description: 'Free online Image Compressor tool to compress images and reduce file size. Optimize photos for web while maintaining quality. Supports JPEG, PNG, and WebP. All processing happens locally.',
    shortDescription: 'Compress images online',
    category: 'image',
    slug: 'image-compressor',
    icon: 'FileDown',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'image optimization'],
    tags: ['image', 'compressor', 'compress', 'reduce', 'size', 'optimization'],
    faq: [
      {
        question: 'How does image compression work?',
        answer: 'Image compression reduces file size by removing redundant data and optimizing encoding. Lossy compression sacrifices some quality for smaller size, while lossless compression preserves all data.',
      },
      {
        question: 'Which image formats can I compress?',
        answer: 'JPEG, PNG, WebP, GIF, and BMP. The tool automatically applies the best compression strategy for the detected format. For finer control, use the format-specific compressors (JPEG / PNG / GIF).',
      },
      {
        question: 'How much can I reduce file size?',
        answer: 'Typical reductions: JPEG photos 30–70%, PNG illustrations 20–50%, screenshots up to 80%. WebP usually produces the smallest output. Larger / more complex images often see bigger savings.',
      },
      {
        question: 'Will my image look the same after compression?',
        answer: 'At sensible quality settings, differences are imperceptible to the naked eye. At very aggressive settings you may see banding, blockiness, or color shift — preview before downloading.',
      },
      {
        question: 'Are my images uploaded anywhere?',
        answer: 'No. All compression runs in your browser. Your photos and the compressed output never leave your device — completely private.',
      },
    ],
    relatedTools: ['png-compressor', 'jpeg-compressor', 'gif-compressor', 'resize-image-percentage'],
    seoContent: {
      intro: "Image Compressor shrinks PNG, JPG, and WebP file sizes by re-encoding at a target quality. Useful for speeding up page loads, fitting into upload limits, or just saving bandwidth. Compression runs in the browser using canvas re-encoding — your image stays local and you can compare before/after side-by-side before downloading.",
      examples: [
        {
          title: "Halve a JPEG's size",
          body: "Set quality to 75 and a typical photo drops to 40-60% of its original size with negligible visible difference — ideal for web delivery.",
        },
        {
          title: "Compress PNG for a logo",
          body: "PNG compression is lossless, but switching to WebP at quality 90 can cut size by 30-50% with no visible loss for most logos.",
        },
        {
          title: "Batch a folder of screenshots",
          body: "Drop multiple files in, set a single target quality, and download all the compressed versions at once.",
        },
      ],
      useCases: [
        "Optimising blog images for Core Web Vitals (Lighthouse loves smaller bytes)",
        "Reducing email attachment sizes below mail-server caps",
        "Preparing product photos for an e-commerce platform that imposes upload limits",
        "Compressing screenshots before pasting into a chat / issue tracker",
        "Saving storage on a personal cloud drive",
      ],
      troubleshooting: [
        {
          problem: "Compressed image looks blocky / has artefacts.",
          solution: "Quality is too low. Raise the slider until artefacts disappear — 75-85 is a safe range for photographic content.",
        },
        {
          problem: "PNG size barely changed.",
          solution: "PNG is lossless. Convert to JPEG (for photos) or WebP (for both) to see real savings — quality 80-90 keeps it visually identical.",
        },
        {
          problem: "Output looks worse than the input even at quality 100.",
          solution: "Re-encoding always introduces some loss. If the original is already optimal, accept it — or try a lossless format like PNG → WebP-lossless.",
        },
      ],
    },
  },
  {
    id: 'crop-image',
    name: 'Crop Image',
    seoTitle: 'Crop Image – Free Online Tool',
    description: 'Free online Crop Image tool to crop images to any size and aspect ratio. Remove unwanted parts of photos with precision. All processing happens locally in your browser.',
    shortDescription: 'Crop images online',
    category: 'image',
    slug: 'crop-image',
    icon: 'Crop',
    keywords: ['crop image', 'image crop', 'photo crop', 'picture crop', 'crop tool'],
    tags: ['image', 'crop', 'photo', 'picture'],
    faq: [
      {
        question: 'How do I crop an image?',
        answer: 'Upload your image, select the area you want to keep by dragging the crop handles, and download the cropped result. You can also set specific dimensions or aspect ratios.',
      },
      {
        question: 'What aspect ratios are available?',
        answer: 'Common presets include free crop, 1:1 (square for Instagram), 4:3 (standard photos), 16:9 (widescreen / YouTube thumbnails), and 9:16 (vertical for TikTok/Reels). You can also enter any custom ratio.',
      },
      {
        question: 'Will cropping reduce image quality?',
        answer: 'No. Cropping removes pixels outside the selection but the remaining pixels are kept at full original resolution. There is no re-encoding loss.',
      },
      {
        question: 'What is the difference between crop and resize?',
        answer: 'Cropping removes parts of the image so the subject takes up more frame. Resizing scales the entire image to new dimensions, keeping every part visible. Use crop to reframe, resize to change pixel dimensions.',
      },
      {
        question: 'Is my image uploaded to a server?',
        answer: 'No. The entire crop happens in your browser using HTML canvas — nothing is sent over the network. Your original file never leaves your device.',
      },
    ],
    relatedTools: ['image-resize', 'rotate-image', 'blur-image'],
  },
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    seoTitle: 'GIF Maker – Free Online Tool',
    description: 'Free online GIF Maker tool to create animated GIFs from images. Combine multiple images into an animated GIF with customizable duration. All processing happens locally.',
    shortDescription: 'Create animated GIFs from images',
    category: 'image',
    slug: 'gif-maker',
    icon: 'Film',
    keywords: ['gif maker', 'create gif', 'animated gif', 'gif creator', 'gif animator'],
    tags: ['image', 'gif', 'maker', 'create', 'animated', 'creator', 'animator'],
    faq: [
      {
        question: 'How do I create a GIF from images?',
        answer: 'Upload multiple images, set the delay between frames, and the tool will combine them into an animated GIF. You can also adjust the size and quality of the output.',
      },
      {
        question: 'How many images can I add to one GIF?',
        answer: 'You can combine dozens of frames — but keep in mind that each frame is stored individually so GIF size grows linearly. For very long animations, MP4 is usually a better choice.',
      },
      {
        question: 'What image formats can I upload?',
        answer: 'PNG, JPG, WebP, and BMP are all supported. PNG with transparency is preserved on the first frame; later GIF frames flatten transparency to a background color.',
      },
      {
        question: 'How do I control the animation speed?',
        answer: 'Adjust the delay (in milliseconds) between frames. Common values: 100ms gives ~10 fps (smooth), 200ms gives 5 fps (cartoon-like), 500ms gives slow-paced slideshows.',
      },
      {
        question: 'Why is my GIF file so large?',
        answer: 'GIFs store each frame as a full image, so dimensions × frame count drives size. Reduce by lowering dimensions, dropping frame count, or running the result through our GIF Compressor.',
      },
    ],
    relatedTools: ['video-to-gif', 'gif-compressor', 'image-resize'],
  },
  {
    id: 'png-compressor',
    name: 'PNG Compressor',
    seoTitle: 'PNG Compressor – Compress PNG Online (Free Tool)',
    description: 'Free online PNG Compressor tool to compress PNG images without losing quality. Reduce file size for faster web loading. All processing happens locally in your browser.',
    shortDescription: 'Compress PNG images',
    category: 'image',
    slug: 'png-compressor',
    icon: 'FileDown',
    keywords: ['png compressor', 'compress png', 'png optimization', 'reduce png size'],
    tags: ['image', 'png', 'compressor', 'compress', 'optimization', 'reduce', 'size'],
    faq: [
      {
        question: 'How does PNG compression work?',
        answer: 'PNG compression uses lossless algorithms to reduce file size without quality loss. It optimizes the image data encoding and removes metadata to create smaller files.',
      },
      {
        question: 'How much can a PNG be compressed?',
        answer: 'Typical savings are 15–50%. Screenshots and simple graphics (few colors, flat areas) compress the most. Photos compressed as PNG see little reduction — convert them to JPEG or WebP for bigger savings.',
      },
      {
        question: 'Does PNG compression lose quality?',
        answer: 'No. PNG compression is fully lossless, so the decoded image is bit-for-bit identical to the input. The only thing removed is unnecessary metadata and redundant encoding.',
      },
      {
        question: 'Should I convert PNG to WebP for smaller files?',
        answer: 'If browser support for WebP is acceptable for your use case, yes — WebP typically beats PNG by 25–35% at the same visual quality. Our PNG to WebP tool handles the conversion.',
      },
      {
        question: 'Will transparency be preserved?',
        answer: 'Yes. PNG compression keeps the alpha channel fully intact. Transparent and semi-transparent areas in the original look identical after compression.',
      },
    ],
    relatedTools: ['image-compressor', 'jpeg-compressor', 'png-to-webp'],
  },
  {
    id: 'jpeg-compressor',
    name: 'JPEG Compressor',
    seoTitle: 'JPEG Compressor – Compress JPEG Online (Free Tool)',
    description: 'Free online JPEG Compressor tool to compress JPEG images with adjustable quality. Reduce file size while controlling image quality. All processing happens locally.',
    shortDescription: 'Compress JPEG images',
    category: 'image',
    slug: 'jpeg-compressor',
    icon: 'FileDown',
    keywords: ['jpeg compressor', 'compress jpeg', 'jpg compression', 'reduce jpeg size'],
    tags: ['image', 'jpeg', 'compressor', 'compress', 'jpg', 'compression', 'reduce'],
    faq: [
      {
        question: 'What quality should I use for JPEG compression?',
        answer: 'For web use, 70-80% quality usually provides a good balance between file size and visual quality. Higher quality preserves more detail but results in larger files.',
      },
      {
        question: 'Is JPEG compression lossy?',
        answer: 'Yes. JPEG is a lossy format — each save discards some image data. Re-saving a JPEG repeatedly compounds the loss, so always compress from the original source, not a previously compressed copy.',
      },
      {
        question: 'When should I use JPEG vs PNG?',
        answer: 'JPEG is best for photographs and complex natural images where small artifacts are invisible. PNG is best for graphics, logos, screenshots, and any image needing transparency.',
      },
      {
        question: 'Why does my compressed image look blocky?',
        answer: 'JPEG compression artifacts appear as 8×8 pixel blocks, especially at low quality. Increase the quality slider, or for graphics-heavy images convert to PNG before compressing.',
      },
      {
        question: 'How small can the file get?',
        answer: 'Typical photos shrink to 20–40% of their original size at quality 75. Going below quality 50 will halve again but introduces visible artifacts.',
      },
    ],
    relatedTools: ['image-compressor', 'png-compressor', 'jpg-to-png'],
  },
  {
    id: 'gif-compressor',
    name: 'GIF Compressor',
    seoTitle: 'GIF Compressor – Compress GIF Online (Free Tool)',
    description: 'Free online GIF Compressor tool to compress animated GIFs and reduce file size. Optimize GIF animations for faster loading. All processing happens locally in your browser.',
    shortDescription: 'Compress animated GIFs',
    category: 'image',
    slug: 'gif-compressor',
    icon: 'FileDown',
    keywords: ['gif compressor', 'compress gif', 'gif optimization', 'reduce gif size'],
    tags: ['image', 'gif', 'compressor', 'compress', 'optimization', 'reduce', 'size'],
    faq: [
      {
        question: 'How can I reduce GIF file size?',
        answer: 'GIF compression reduces colors, optimizes frame data, and removes redundant pixels. You can also reduce dimensions or frame rate for smaller files.',
      },
      {
        question: 'Why are GIFs so large?',
        answer: 'GIF stores each frame as a full image with a 256-color palette. A short clip can easily hit several megabytes. For longer animations, MP4/WebM are dramatically smaller at the same quality.',
      },
      {
        question: 'Does compressing a GIF reduce quality?',
        answer: 'Most compression techniques are visible only on close inspection (slight color banding, dithering changes). Heavy compression — large pixel blocks, very few colors — will look noticeably degraded.',
      },
      {
        question: 'Will my animation still play after compression?',
        answer: 'Yes. The frame timing, loop count, and animation order are preserved. Only the per-frame pixel data and color palette are optimized.',
      },
      {
        question: 'Is there a maximum GIF size I can compress?',
        answer: 'The tool handles GIFs up to typical browser memory limits — usually tens of megabytes. Very large GIFs may take longer; for those, consider converting to MP4 instead.',
      },
    ],
    relatedTools: ['image-compressor', 'gif-maker', 'video-to-gif'],
  },
  {
    id: 'svg-to-png',
    name: 'SVG to PNG Converter',
    seoTitle: 'SVG to PNG Converter – Convert SVG Online (Free Tool)',
    description: 'Free online SVG to PNG Converter tool to convert SVG vector graphics to PNG raster images. Set custom dimensions for the output image. All processing happens locally.',
    shortDescription: 'Convert SVG to PNG online',
    category: 'image',
    slug: 'svg-to-png',
    icon: 'FileImage',
    keywords: ['svg to png', 'svg converter', 'vector to raster', 'convert svg'],
    tags: ['image', 'svg', 'png', 'converter', 'vector', 'raster', 'convert'],
    faq: [
      {
        question: 'Why convert SVG to PNG?',
        answer: 'PNG is more widely supported than SVG and works in all contexts where images are needed. Converting SVG to PNG also "freezes" the design at a specific resolution.',
      },
      {
        question: 'What output resolution should I use?',
        answer: 'Pick the largest size you might display the image at. SVG is resolution-independent; once rasterized to PNG you can scale down without quality loss but scaling up will blur.',
      },
      {
        question: 'Will my SVG keep transparency in PNG?',
        answer: 'Yes. PNG supports an alpha channel, so transparent areas of the SVG remain transparent in the output. Pick "transparent background" if you do not want a solid color fill.',
      },
      {
        question: 'Will text in my SVG render correctly?',
        answer: 'Text renders correctly as long as the referenced fonts are available to the browser. Convert text to outlines/paths in your design tool first if you need pixel-identical results on every machine.',
      },
      {
        question: 'How is this different from screenshotting an SVG?',
        answer: 'Direct conversion uses the original vector data so the output is pixel-perfect at any chosen resolution. Screenshots are limited to the current display size and may include browser anti-aliasing artifacts.',
      },
    ],
    relatedTools: ['webp-to-png', 'image-resize', 'image-to-ico'],
  },

  // ==================== COLOR TOOLS ====================
  {
    id: 'color-picker',
    name: 'Color Picker',
    seoTitle: 'Color Picker – Free Online Tool',
    description: 'Free online Color Picker tool to pick colors and get HEX, RGB, and HSL values. Choose colors with visual picker or enter values directly. Perfect for designers and developers.',
    shortDescription: 'Pick colors and get color codes',
    category: 'color',
    slug: 'color-picker',
    icon: 'Pipette',
    keywords: ['color picker', 'hex color', 'rgb color', 'color code'],
    tags: ['color', 'picker', 'hex', 'rgb', 'code'],
    faq: [
      {
        question: 'What is a color picker?',
        answer: 'A color picker is a tool that lets you select colors visually and get their values in different formats like HEX, RGB, and HSL. It helps designers and developers choose exact colors for their projects.',
      },
      {
        question: 'What is the difference between HEX, RGB, and HSL?',
        answer: 'HEX is a hexadecimal code (e.g., #FF5733) used in web design. RGB represents colors as Red, Green, Blue values (0-255). HSL describes colors by Hue (0-360), Saturation, and Lightness percentages, making it more intuitive for adjusting colors.',
      },
      {
        question: 'How do I pick a color from anywhere on my screen?',
        answer: 'Most operating systems have built-in color pickers. On Windows, use the PowerToys Color Picker. On Mac, use the Digital Color Meter in Utilities. Many browser extensions also offer screen color picking functionality.',
      },
      {
        question: 'What color format should I use for web design?',
        answer: 'HEX codes are most common in CSS for web design. RGB/RGBA is useful when you need to manipulate colors with JavaScript or add transparency. HSL is great when you need to create color variations by adjusting lightness or saturation.',
      },
      {
        question: 'Can I copy color codes directly from the picker?',
        answer: 'Yes, our color picker allows you to copy color codes in multiple formats with a single click. Simply select your color and click on the format you want to copy to your clipboard.',
      },
    ],
    relatedTools: ['hex-to-rgb', 'rgb-to-hex', 'color-palette-generator', 'image-color-picker'],
  },
  {
    id: 'hex-to-rgb',
    name: 'HEX to RGB Converter',
    seoTitle: 'HEX to RGB Converter – Convert HEX Online (Free Tool)',
    description: 'Free online HEX to RGB Converter tool to convert HEX color codes to RGB values. Get red, green, and blue color components instantly. Perfect for web developers and designers.',
    shortDescription: 'Convert HEX to RGB',
    category: 'color',
    slug: 'hex-to-rgb',
    icon: 'Palette',
    keywords: ['hex to rgb', 'color converter', 'hex color', 'rgb color'],
    tags: ['color', 'hex', 'rgb', 'converter'],
    faq: [
      {
        question: 'How do I convert HEX to RGB manually?',
        answer: 'A HEX code has 6 characters (e.g., #FF5733). Split it into three pairs: FF, 57, 33. Convert each pair from hexadecimal to decimal: FF=255, 57=87, 33=51. So #FF5733 becomes rgb(255, 87, 51).',
      },
      {
        question: 'Why would I need to convert HEX to RGB?',
        answer: 'RGB format is needed when working with design software like Photoshop, programming languages like Python or JavaScript, or when you need to add transparency (RGBA) which HEX alone cannot represent.',
      },
      {
        question: 'What is the range of RGB values?',
        answer: 'Each RGB component (Red, Green, Blue) ranges from 0 to 255. A value of 0 means no color, while 255 means full intensity. For example, rgb(0, 0, 0) is black and rgb(255, 255, 255) is white.',
      },
      {
        question: 'Can HEX codes include transparency?',
        answer: 'Standard 6-character HEX codes do not include transparency. However, 8-character HEX codes (HEXA) add an alpha channel, or you can convert to RGBA format which explicitly includes transparency as the fourth value.',
      },
      {
        question: 'Is there a difference in color quality between HEX and RGB?',
        answer: 'No, HEX and RGB represent the exact same colors. They are simply different notations for the same color values. Converting between them does not change or lose any color information.',
      },
    ],
    relatedTools: ['rgb-to-hex', 'color-picker', 'rgba-to-hex'],
  },
  {
    id: 'rgb-to-hex',
    name: 'RGB to HEX Converter',
    seoTitle: 'RGB to HEX Converter – Convert RGB Online (Free Tool)',
    description: 'Free online RGB to HEX Converter tool to convert RGB color values to HEX color codes. Enter red, green, and blue values to get HEX code. Perfect for web developers and designers.',
    shortDescription: 'Convert RGB to HEX',
    category: 'color',
    slug: 'rgb-to-hex',
    icon: 'Palette',
    keywords: ['rgb to hex', 'color converter', 'rgb color', 'hex color'],
    tags: ['color', 'rgb', 'hex', 'converter'],
    faq: [
      {
        question: 'How do I convert RGB to HEX manually?',
        answer: 'Take each RGB value (0-255) and convert it to hexadecimal. For example, rgb(255, 87, 51): 255=FF, 87=57, 51=33. Combine them with a # prefix to get #FF5733.',
      },
      {
        question: 'Why is HEX format preferred for web design?',
        answer: 'HEX codes are more compact and easier to copy-paste than RGB values. They are the standard format in CSS and HTML, making them universally recognized by web browsers and design tools.',
      },
      {
        question: 'What are shorthand HEX codes?',
        answer: 'When a HEX code has repeating characters in each pair (e.g., #FFAA00), it can be shortened to 3 characters (#FA0). Shorthand HEX codes are shorter but less precise since each digit is duplicated.',
      },
      {
        question: 'Can all RGB colors be represented in HEX?',
        answer: 'Yes, all RGB colors (16.7 million combinations) can be represented in HEX format. Both systems use the same 0-255 range per color channel, just expressed in different number systems.',
      },
      {
        question: 'Why do some HEX codes have 8 characters?',
        answer: '8-character HEX codes (HEXA) include an alpha channel for transparency. The last two characters represent opacity: 00 is fully transparent and FF is fully opaque. Standard CSS HEX is 6 characters without transparency.',
      },
    ],
    relatedTools: ['hex-to-rgb', 'color-picker', 'rgba-to-hex'],
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    seoTitle: 'Color Palette Generator – Generate Color Online (Free Tool)',
    description: 'Free online Color Palette Generator tool to generate beautiful color palettes from a base color. Create harmonious color schemes including complementary and analogous colors.',
    shortDescription: 'Generate color palettes',
    category: 'color',
    slug: 'color-palette-generator',
    icon: 'SwatchBook',
    keywords: ['color palette', 'palette generator', 'color scheme', 'color combination'],
    tags: ['color', 'palette', 'generator', 'scheme', 'combination'],
    faq: [
      {
        question: 'What types of color palettes can I generate?',
        answer: 'You can generate complementary (opposite colors), analogous (adjacent colors), triadic (3 evenly spaced), tetradic (4 evenly spaced), and split-complementary palettes based on your chosen base color.',
      },
      {
        question: 'How do I choose the right color palette?',
        answer: 'Complementary palettes create high contrast and bold designs. Analogous palettes are harmonious and calming. Triadic palettes offer variety while maintaining balance. Choose based on the mood you want to convey.',
      },
      {
        question: 'What is color harmony and why does it matter?',
        answer: 'Color harmony refers to pleasing color combinations that work well together. Harmonious palettes create visual appeal and help guide the viewer eye. Using established harmony rules ensures your designs look professional and balanced.',
      },
      {
        question: 'How many colors should I use in a design?',
        answer: 'For most designs, use 3-5 colors: a dominant color (60%), a secondary color (30%), and an accent color (10%). This 60-30-10 rule creates visual hierarchy and prevents your design from looking cluttered.',
      },
      {
        question: 'Can I save or export my generated palette?',
        answer: 'Yes, you can copy individual color codes or export your palette in various formats. You can also copy CSS variables or array formats to use directly in your web development projects.',
      },
    ],
    exampleOutput: {
      output: '#3B82F6 (Base)\n#F97316 (Complementary)\n#22C55E (Triadic 1)\n#A855F7 (Triadic 2)',
      description: 'Example of a triadic color palette based on blue',
    },
    relatedTools: ['gradient-generator', 'color-picker', 'random-color-generator'],
  },
  {
    id: 'gradient-generator',
    name: 'CSS Gradient Generator',
    seoTitle: 'CSS Gradient Generator – Generate CSS Online (Free Tool)',
    description: 'Free online Gradient Generator tool to create CSS gradients with multiple color stops. Generate linear and radial gradients with live preview. Perfect for web designers.',
    shortDescription: 'Generate CSS gradients',
    category: 'color',
    slug: 'gradient-generator',
    icon: 'Blend',
    keywords: ['gradient generator', 'css gradient', 'linear gradient', 'radial gradient'],
    tags: ['color', 'gradient', 'generator', 'css', 'linear', 'radial'],
    faq: [
      {
        question: 'What is the difference between linear and radial gradients?',
        answer: 'Linear gradients transition colors along a straight line (can be angled). Radial gradients transition colors from a center point outward in a circular pattern. Both can use multiple color stops.',
      },
      {
        question: 'How do I create a diagonal gradient?',
        answer: 'Use angles in your linear gradient. For example, `linear-gradient(45deg, #color1, #color2)` creates a diagonal gradient from bottom-left to top-right. 135deg goes from top-left to bottom-right.',
      },
      {
        question: 'What are color stops and how do they work?',
        answer: 'Color stops define where each color begins and ends in your gradient. You can specify positions like `linear-gradient(red 0%, blue 50%, green 100%)` to control exactly where color transitions happen.',
      },
      {
        question: 'Can I use transparency in gradients?',
        answer: 'Yes, use RGBA or HSLA colors to add transparency. For example, `linear-gradient(rgba(255,0,0,0.5), rgba(0,0,255,0.5))` creates a gradient with semi-transparent colors.',
      },
      {
        question: 'How do I make a gradient repeat?',
        answer: 'Use `repeating-linear-gradient()` or `repeating-radial-gradient()` functions. These repeat the gradient pattern infinitely. For example, `repeating-linear-gradient(45deg, red, red 10px, blue 10px, blue 20px)` creates stripes.',
      },
    ],
    exampleOutput: {
      output: 'background: linear-gradient(90deg, #3B82F6, #8B5CF6);',
      description: 'Example of a linear gradient from blue to purple at 90 degrees',
    },
    relatedTools: ['css-gradient-generator', 'color-palette-generator', 'random-color-generator'],
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    seoTitle: 'Color Contrast Checker – Check Color Online (Free Tool)',
    description: 'Free online Color Contrast Checker tool to check WCAG color contrast ratios. Ensure your colors meet accessibility guidelines for text readability. Perfect for web accessibility.',
    shortDescription: 'Check color contrast',
    category: 'color',
    slug: 'color-contrast-checker',
    icon: 'Contrast',
    keywords: ['contrast checker', 'wcag', 'accessibility', 'color contrast'],
    tags: ['color', 'wcag', 'accessibility', 'contrast', 'checker'],
    faq: [
      {
        question: 'What is WCAG color contrast?',
        answer: 'WCAG (Web Content Accessibility Guidelines) sets standards for color contrast to ensure text is readable. WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text at Level AA.',
      },
      {
        question: 'What is the difference between WCAG AA and AAA?',
        answer: 'WCAG AA requires 4.5:1 contrast for normal text and 3:1 for large text. AAA is stricter, requiring 7:1 for normal text and 4.5:1 for large text. AA is the standard compliance level for most websites.',
      },
      {
        question: 'Why is color contrast important for accessibility?',
        answer: 'Proper color contrast ensures that people with visual impairments, color blindness, or low vision can read your content. It also improves readability for everyone in different lighting conditions.',
      },
      {
        question: 'How is contrast ratio calculated?',
        answer: 'Contrast ratio is calculated using the relative luminance of the lighter and darker colors. The formula is (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color luminance. Ratios range from 1:1 (no contrast) to 21:1 (maximum contrast).',
      },
      {
        question: 'What colors pass WCAG requirements?',
        answer: 'Dark text on light backgrounds or light text on dark backgrounds typically pass. Pure black on white (21:1) always passes. For colors, ensure sufficient lightness difference. Tools like this checker help verify compliance.',
      },
    ],
    relatedTools: ['color-picker', 'color-palette-generator', 'random-color-generator'],
  },
  {
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    seoTitle: 'CSS Gradient Generator – Generate CSS Online (Free Tool)',
    description: 'Free online CSS Gradient Generator tool to create beautiful CSS gradients for your designs. Generate linear and radial gradients with visual preview. Copy CSS code instantly.',
    shortDescription: 'Generate CSS gradient code',
    category: 'color',
    slug: 'css-gradient-generator',
    icon: 'Blend',
    keywords: ['css gradient', 'gradient css', 'gradient code', 'css generator'],
    tags: ['color', 'css', 'gradient', 'code', 'generator'],
    faq: [
      {
        question: 'What types of gradients can I create?',
        answer: 'You can create linear gradients (straight line transitions), radial gradients (circular transitions from center), and conic gradients (color transitions around a center point like a pie chart).',
      },
      {
        question: 'What are color stops?',
        answer: 'Color stops define the colors in your gradient and their positions. You can add multiple color stops to create complex gradients with smooth transitions between multiple colors.',
      },
      {
        question: 'How do I control the gradient direction?',
        answer: 'For linear gradients, use the angle slider (0° points up, 90° points right, 180° points down). For conic gradients, angle is the starting point of the color wheel. Radial gradients always emanate from the center.',
      },
      {
        question: 'Can I use the gradient as a CSS background-image?',
        answer: 'Yes — the output uses `background:` shorthand which works in any CSS context. You can also paste just the gradient function into `background-image`, `border-image-source`, or any other property that accepts an image.',
      },
      {
        question: 'Why does my gradient look banded?',
        answer: 'Hard color transitions between similar tones can produce visible banding. Add intermediate color stops, use colors with more contrast, or apply a subtle noise overlay on top of the gradient to mask it.',
      },
      {
        question: 'Are CSS gradients well supported?',
        answer: 'Linear and radial gradients have full support in every modern browser. Conic gradients have 95%+ support but require a fallback for very old browsers. Add a solid `background-color` first as a graceful fallback.',
      },
    ],
    exampleOutput: {
      output: 'background: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%);',
      description: 'Example of a 3-color linear gradient with color stop positions',
    },
    relatedTools: ['gradient-generator', 'css-formatter', 'color-palette-generator'],
  },
  {
    id: 'random-color-generator',
    name: 'Random Color Generator',
    seoTitle: 'Random Color Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random Color Generator tool to generate random colors for inspiration. Get random HEX, RGB, and color names. Perfect for designers and developers.',
    shortDescription: 'Generate random colors',
    category: 'color',
    slug: 'random-color-generator',
    icon: 'Shuffle',
    keywords: ['random color', 'color generator', 'random hex', 'random rgb'],
    tags: ['color', 'random', 'generator', 'hex', 'rgb'],
    faq: [
      {
        question: 'How does the random color generator work?',
        answer: 'Each click produces a fresh color by picking random values for red, green, and blue (0–255 each). The tool then converts that color to HEX, RGB, and HSL formats so you can copy whichever you need.',
      },
      {
        question: 'Why would I use random colors?',
        answer: 'Random colors are great for design inspiration, breaking creative blocks, generating placeholder data, populating chart legends, prototyping themes, and choosing unbiased starting palettes.',
      },
      {
        question: 'Can I limit the range of random colors?',
        answer: 'Pick a base color first and use our Color Palette Generator instead — it creates harmonious variations (complementary, analogous, monochromatic) around your starting color rather than fully random ones.',
      },
      {
        question: 'Are the colors truly random?',
        answer: 'They use the browser\'s built-in pseudo-random generator, which is statistically random enough for design work. They are not cryptographically random — do not use them as keys or passwords.',
      },
      {
        question: 'Can I save random colors I like?',
        answer: 'Yes — copy the HEX/RGB code as soon as you find a color you like. You can also screenshot the preview or paste the value into the Color Palette Generator to build out a full scheme.',
      },
    ],
    relatedTools: ['color-palette-generator', 'color-picker', 'hex-to-rgb'],
  },
  {
    id: 'tailwind-color-converter',
    name: 'Tailwind Color Converter',
    seoTitle: 'Tailwind Color Converter – Convert Tailwind Online (Free Tool)',
    description: 'Free online Tailwind Color Converter tool to convert colors to Tailwind CSS classes. Find the closest Tailwind color match for any color. Perfect for Tailwind developers.',
    shortDescription: 'Convert to Tailwind colors',
    category: 'color',
    slug: 'tailwind-color-converter',
    icon: 'Wind',
    keywords: ['tailwind color', 'tailwind converter', 'tailwind css', 'color converter'],
    tags: ['color', 'tailwind', 'converter', 'css'],
    faq: [
      {
        question: 'How does the Tailwind color converter work?',
        answer: 'Enter any HEX, RGB, or HSL color and the tool finds the nearest match in Tailwind\'s default palette (e.g. `blue-500`, `gray-700`). It also shows the exact HEX of that Tailwind class so you can verify the match.',
      },
      {
        question: 'Which Tailwind palette is used?',
        answer: 'The latest default Tailwind CSS palette (v3+) with all 220+ color shades — slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose.',
      },
      {
        question: 'Why does my brand color not match exactly?',
        answer: 'Tailwind\'s default palette is curated — your brand color may not have an exact match. The converter shows the closest shade, and you can either accept the slight shift or define a custom color in your `tailwind.config.js`.',
      },
      {
        question: 'How do I add a custom color to Tailwind?',
        answer: 'In `tailwind.config.js`, extend `theme.colors` with your own name and value, e.g. `brand: { 500: "#1a2b3c" }`. After rebuilding, use it as `bg-brand-500`, `text-brand-500`, etc.',
      },
      {
        question: 'Does this work with arbitrary values?',
        answer: 'For one-off colors you can always use Tailwind\'s arbitrary value syntax like `bg-[#1a2b3c]`. The converter is more useful when you want to match the closest palette token for consistency across your design system.',
      },
    ],
    relatedTools: ['color-converter', 'color-picker', 'css-formatter'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    seoTitle: 'Color Converter – Convert Color Online (Free Tool)',
    description: 'Free online Color Converter tool to convert between color formats. Convert HEX, RGB, HSL, and other color spaces instantly. Perfect for designers and developers.',
    shortDescription: 'Convert between color formats',
    category: 'color',
    slug: 'color-converter',
    icon: 'ArrowLeftRight',
    keywords: ['color converter', 'hex rgb hsl', 'color format', 'color transform'],
    tags: ['color', 'converter', 'hex', 'rgb', 'hsl', 'format', 'transform'],
    faq: [
      {
        question: 'Which color formats are supported?',
        answer: 'HEX (#RRGGBB or #RGB), RGB / RGBA (rgb(255, 0, 0) / rgba(255, 0, 0, 0.5)), HSL / HSLA (hsl(0, 100%, 50%)), and CMYK percentages. Paste any of these and get all the others.',
      },
      {
        question: 'What is the difference between HEX, RGB, and HSL?',
        answer: 'HEX is a compact hexadecimal representation used in CSS. RGB describes color by red/green/blue intensity (0–255). HSL is intuitive for tweaking: Hue (0–360°), Saturation, Lightness. They all describe the same colors, just different math.',
      },
      {
        question: 'Why convert between color formats?',
        answer: 'Different tools and codebases use different formats: web design favors HEX, programmatic color tweaking favors HSL, image processing libraries use RGB. Converters let you copy a value once and paste it anywhere.',
      },
      {
        question: 'Are the conversions exact?',
        answer: 'HEX↔RGB is mathematically exact. HSL conversions involve floating-point math so values may round slightly, but the displayed color remains visually identical. CMYK is approximated for display use since it depends on print profiles.',
      },
      {
        question: 'How do I handle transparency/alpha?',
        answer: 'Use the RGBA or HSLA fields with an alpha value 0–1 (0 = fully transparent, 1 = opaque). The HEX8 format (#RRGGBBAA) also carries alpha — our RGBA to HEX tool handles that conversion specifically.',
      },
    ],
    relatedTools: ['hex-to-rgb', 'rgb-to-hex', 'rgba-to-hex'],
  },
  {
    id: 'rgb-color-picker',
    name: 'RGB Color Picker',
    seoTitle: 'RGB Color Picker – Free Online Tool',
    description: 'Free online RGB Color Picker tool to pick colors and get RGB values. Choose colors visually and get red, green, blue components. Perfect for digital design and development.',
    shortDescription: 'Pick colors with RGB values',
    category: 'color',
    slug: 'rgb-color-picker',
    icon: 'Pipette',
    keywords: ['rgb color picker', 'rgb picker', 'red green blue', 'color selector'],
    tags: ['color', 'rgb', 'picker', 'red', 'green', 'blue', 'selector'],
    faq: [
      {
        question: 'How do RGB colors work?',
        answer: 'RGB (Red, Green, Blue) is an additive color model where colors are created by combining different intensities of red, green, and blue light. Each value ranges from 0-255.',
      },
      {
        question: 'How do I write RGB in CSS?',
        answer: 'Use `rgb(R, G, B)` or `rgba(R, G, B, A)` for transparency, e.g. `rgb(255, 87, 51)` or `rgba(255, 87, 51, 0.8)`. Modern CSS also accepts space-separated values: `rgb(255 87 51 / 80%)`.',
      },
      {
        question: 'What is the difference between RGB and RGBA?',
        answer: 'RGBA adds an alpha (A) channel that controls transparency from 0 (fully transparent) to 1 (fully opaque). Use RGB when you don\'t need transparency; RGBA when you do.',
      },
      {
        question: 'Why does RGB go from 0 to 255?',
        answer: 'Each channel is stored in 8 bits, giving 2^8 = 256 possible values (0–255). Combined across 3 channels, that\'s 16,777,216 distinct colors — more than the human eye can reliably distinguish.',
      },
      {
        question: 'When should I use RGB vs HEX?',
        answer: 'HEX is more compact and common in static stylesheets. RGB is easier to manipulate programmatically (e.g. mixing colors, calculating brightness). They represent the same colors — pick whichever your workflow prefers.',
      },
    ],
    relatedTools: ['hex-color-picker', 'color-picker', 'rgb-to-hex'],
  },
  {
    id: 'hex-color-picker',
    name: 'HEX Color Picker',
    seoTitle: 'HEX Color Picker – Free Online Tool',
    description: 'Free online HEX Color Picker tool to pick colors and get HEX codes. Choose colors visually and get hexadecimal color values. Perfect for web design and development.',
    shortDescription: 'Pick colors and get HEX codes',
    category: 'color',
    slug: 'hex-color-picker',
    icon: 'Pipette',
    keywords: ['hex color picker', 'hex picker', 'hex code', 'color hex'],
    tags: ['color', 'hex', 'picker', 'code'],
    faq: [
      {
        question: 'What is a HEX color code?',
        answer: 'A HEX color code is a 6-character hexadecimal representation of an RGB color. It starts with # followed by two characters each for red, green, and blue values (e.g., #FF5733).',
      },
      {
        question: 'What does the 3-digit HEX shorthand mean?',
        answer: 'Codes like #F53 are shorthand: each digit is doubled to form 6 characters (#FF5533). It can only express colors where each pair has identical digits, so #F50 cannot represent #FB5022.',
      },
      {
        question: 'What is HEX8 / HEX with alpha?',
        answer: 'An 8-character HEX adds two more digits at the end for the alpha (transparency) channel, e.g. #FF5733CC. CC ≈ 80% opacity. Modern browsers fully support this format.',
      },
      {
        question: 'How do I use HEX colors in CSS?',
        answer: 'Drop the code into any color property: `color: #FF5733;`, `background: #f53;`, `border: 1px solid #FF5733CC;`. The browser converts it to RGB internally.',
      },
      {
        question: 'What are the most popular HEX colors?',
        answer: 'Common UI choices: #000000 (black), #FFFFFF (white), #3B82F6 (blue-500 Tailwind), #EF4444 (red-500), #10B981 (green-500). Pick from a curated palette for cohesive design.',
      },
    ],
    relatedTools: ['rgb-color-picker', 'color-picker', 'hex-to-rgb'],
  },
  {
    id: 'rgba-to-hex',
    name: 'RGBA to HEX Converter',
    seoTitle: 'RGBA to HEX Converter – Convert RGBA Online (Free Tool)',
    description: 'Free online RGBA to HEX Converter tool to convert RGBA colors with alpha transparency to HEX codes. Handle transparency values and convert to solid colors. All processing happens locally.',
    shortDescription: 'Convert RGBA to HEX',
    category: 'color',
    slug: 'rgba-to-hex',
    icon: 'ArrowLeftRight',
    keywords: ['rgba to hex', 'rgba converter', 'alpha to hex', 'color converter'],
    tags: ['color', 'rgba', 'hex', 'converter', 'alpha'],
    faq: [
      {
        question: 'How do I convert RGBA to HEX?',
        answer: 'Enter your RGBA values (red, green, blue, alpha) and the tool will convert them to HEX format. Note that HEX8 format is used when alpha is not 100%.',
      },
      {
        question: 'What is HEX8 format?',
        answer: 'HEX8 is an 8-character hexadecimal code that includes alpha (transparency): #RRGGBBAA. For example, #FF573380 represents the color #FF5733 at ~50% opacity. Modern browsers fully support it.',
      },
      {
        question: 'My alpha value is 1 — why does the output look like normal HEX6?',
        answer: 'When alpha = 1 (fully opaque), the alpha byte is FF and HEX8 #RRGGBBFF is visually identical to HEX6 #RRGGBB. The tool drops the FF in that case for cleaner output.',
      },
      {
        question: 'Can I flatten transparency to a solid color?',
        answer: 'Yes — pick a background color (typically white) and the tool can composite the RGBA over it to produce a fully opaque HEX. Useful when targeting platforms that do not support alpha.',
      },
      {
        question: 'Is alpha in HEX widely supported?',
        answer: 'All modern browsers (Chrome, Firefox, Safari, Edge) support 8-digit HEX. For older browsers or non-web environments (some email clients, design tools), use `rgba(...)` instead for guaranteed support.',
      },
    ],
    relatedTools: ['hex-to-rgb', 'rgb-to-hex', 'color-converter'],
  },

  // ==================== CONVERTER TOOLS ====================
  {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    seoTitle: 'CSV to JSON Converter – Convert CSV Online (Free Tool)',
    description: 'Free online CSV to JSON Converter tool to convert CSV data to JSON format. Transform spreadsheet data into JSON arrays instantly. All conversion happens locally in your browser.',
    shortDescription: 'Convert CSV to JSON',
    category: 'converter',
    slug: 'csv-to-json',
    icon: 'FileSpreadsheet',
    keywords: ['csv to json', 'csv converter', 'spreadsheet to json', 'csv parser'],
    tags: ['converter', 'csv', 'json', 'spreadsheet', 'parser'],
    faq: [
      {
        question: 'What is CSV to JSON conversion?',
        answer: 'CSV to JSON conversion transforms comma-separated values data into JavaScript Object Notation format, converting each row into an object with column headers as keys.',
      },
      {
        question: 'How do I convert a CSV file to JSON?',
        answer: 'Simply paste or upload your CSV data, and the tool automatically parses it and generates JSON output. Each CSV row becomes a JSON object with the header row as property names.',
      },
      {
        question: 'Does the tool handle CSV files with special characters?',
        answer: 'Yes, the tool properly handles CSV files with special characters, quotes, commas within fields, and multi-line values according to standard CSV formatting rules.',
      },
      {
        question: 'What JSON structure does the converter produce?',
        answer: 'The converter produces a JSON array where each element is an object representing a row, with keys derived from the CSV header row and values from each data cell.',
      },
      {
        question: 'Is my CSV data secure during conversion?',
        answer: 'Yes, all conversion happens locally in your browser. Your data never leaves your device and is not stored on any server.',
      },
    ],
    relatedTools: ['json-to-csv', 'excel-to-json', 'json-formatter'],
    seoContent: {
      intro: "CSV to JSON parses comma-separated values and emits a JSON array of objects, with the first row used as keys by default. Handles quoted fields, escaped quotes, embedded commas, multi-line values, and a configurable delimiter (comma, tab, semicolon, pipe). The conversion runs entirely in the browser, so confidential spreadsheets never get uploaded.",
      examples: [
        {
          title: "Convert an export from Excel",
          body: "Export a sheet as CSV, paste it in, and get a JSON array — drop directly into a JavaScript test fixture or API request body.",
        },
        {
          title: "Handle a tab-separated file (TSV)",
          body: "Set the delimiter to Tab and the same conversion works for TSV files from logs, monitoring tools, or Google Sheets copy.",
        },
        {
          title: "Skip the header row",
          body: "Toggle \"first row is header\" off when the file has no headers — keys become column0, column1, … and the data starts from row 1.",
        },
      ],
      useCases: [
        "Importing analyst CSV exports into a JavaScript app or REST API",
        "Building API request bodies from a spreadsheet of test cases",
        "Converting Google Sheets data for use in a static site generator",
        "Pre-processing CSVs for ingestion into MongoDB / Elasticsearch",
        "Seeding test data from a hand-edited CSV",
      ],
      troubleshooting: [
        {
          problem: "Commas inside fields broke the parse.",
          solution: "Wrap those values in double quotes (\"Smith, John\"). The parser respects RFC 4180 quoting rules. Re-export from Excel with \"always quote\" if available.",
        },
        {
          problem: "Special characters became ?? or .",
          solution: "Encoding mismatch. Re-save the CSV as UTF-8 (Excel: \"CSV UTF-8\" option) or use the Auto-detect encoding feature.",
        },
        {
          problem: "Numbers came out as strings.",
          solution: "CSV has no types — everything is text. Cast in your code (Number(row.age)) or use a post-processing step to coerce known numeric columns.",
        },
      ],
    },
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV Converter',
    seoTitle: 'JSON to CSV Converter – Convert JSON Online (Free Tool)',
    description: 'Free online JSON to CSV Converter tool to convert JSON data to CSV format. Export JSON arrays to spreadsheet-compatible CSV. All conversion happens locally in your browser.',
    shortDescription: 'Convert JSON to CSV',
    category: 'converter',
    slug: 'json-to-csv',
    icon: 'FileSpreadsheet',
    keywords: ['json to csv', 'json converter', 'json to spreadsheet', 'export csv'],
    tags: ['converter', 'json', 'csv', 'spreadsheet', 'export'],
    faq: [
      {
        question: 'How do I convert JSON to CSV?',
        answer: 'Paste your JSON array into the tool, and it will automatically extract the keys as column headers and convert each object into a CSV row.',
      },
      {
        question: 'What JSON format is required for conversion?',
        answer: 'The tool accepts JSON arrays of objects. Each object should have similar keys, which become the CSV column headers.',
      },
      {
        question: 'Can I convert nested JSON objects to CSV?',
        answer: 'The tool works best with flat JSON structures. Nested objects may be converted to JSON strings within the CSV cells.',
      },
      {
        question: 'Will the CSV file open correctly in Excel or Google Sheets?',
        answer: 'Yes, the generated CSV follows standard formatting and will open correctly in Excel, Google Sheets, and other spreadsheet applications.',
      },
      {
        question: 'How are special characters handled in CSV output?',
        answer: 'Fields containing commas, quotes, or newlines are properly escaped and quoted according to CSV standards to ensure correct parsing.',
      },
    ],
    relatedTools: ['csv-to-json', 'csv-to-excel', 'excel-to-json'],
    seoContent: {
      intro: "JSON to CSV converts a JSON array of objects into a comma-separated-values document with one row per object and one column per key. Quoting is RFC 4180 compliant (double-quote any field containing commas, quotes, or newlines). Useful for handing API data to non-technical colleagues, importing into Excel/Sheets, or preparing data for a BI tool.",
      examples: [
        {
          title: "Export API data to Excel",
          body: "Fetch a JSON list of users, convert to CSV, and open in Excel — sortable and filterable without writing a single formula.",
        },
        {
          title: "Build a Google Sheets import",
          body: "Convert to CSV, paste into Sheets via \"Paste special → Split text to columns\" — fastest path from API to spreadsheet.",
        },
        {
          title: "Flatten nested objects",
          body: "Use the \"flatten nested\" option so user.address.city becomes its own column. Each nested key gets a dot-notation header.",
        },
      ],
      useCases: [
        "Handing API data to analysts who work in spreadsheets",
        "Generating an export feature in a web app (Download as CSV button)",
        "Preparing data for a BI tool (Looker, Tableau) that ingests CSV",
        "Backing up a JSON dataset in a more universally readable format",
        "Quickly diffing two JSON arrays — convert both to CSV, sort, diff",
      ],
      troubleshooting: [
        {
          problem: "Some rows have missing columns.",
          solution: "Objects have different keys. The converter takes the union of all keys; rows without a key get an empty cell. Pre-normalise the objects in your code if you want strict columns.",
        },
        {
          problem: "Excel shows \"1.23E+45\" instead of my long number.",
          solution: "Excel auto-formats large numbers. Add a leading apostrophe ('1234567890123) or import as Text column to preserve the literal value.",
        },
        {
          problem: "Unicode characters look broken in Excel.",
          solution: "The tool prepends a UTF-8 BOM so Excel detects the encoding correctly. If still broken, check Excel's import settings or use \"Data → From Text/CSV\" with explicit UTF-8.",
        },
      ],
    },
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML Converter',
    seoTitle: 'Markdown to HTML Converter – Convert Markdown Online (Free Tool)',
    description: 'Free online Markdown to HTML Converter tool to convert Markdown syntax to HTML code. Transform MD files to HTML markup instantly. All conversion happens locally.',
    shortDescription: 'Convert Markdown to HTML',
    category: 'converter',
    slug: 'markdown-to-html',
    icon: 'FileCode',
    keywords: ['markdown to html', 'md to html', 'markdown converter', 'md converter'],
    tags: ['converter', 'markdown', 'html'],
    faq: [
      {
        question: 'What Markdown features are supported?',
        answer: 'The converter supports standard Markdown including headings, bold, italic, links, images, lists (ordered and unordered), code blocks, blockquotes, tables, and horizontal rules.',
      },
      {
        question: 'How do I convert Markdown to HTML?',
        answer: 'Simply paste your Markdown text into the input area, and the tool instantly generates the corresponding HTML code that you can copy and use.',
      },
      {
        question: 'Is GitHub Flavored Markdown (GFM) supported?',
        answer: 'Yes, the tool supports GitHub Flavored Markdown extensions including tables, task lists, strikethrough, and autolinks.',
      },
      {
        question: 'Can I customize the HTML output?',
        answer: 'The converter generates clean, standard HTML. You can further style the output using CSS classes as needed for your project.',
      },
      {
        question: 'Will code blocks be properly converted?',
        answer: 'Yes, both inline code and fenced code blocks are converted to appropriate HTML elements with syntax highlighting support available.',
      },
    ],
    relatedTools: ['html-to-markdown', 'markdown-to-pdf', 'html-formatter'],
    seoContent: {
      intro: "Markdown to HTML converts CommonMark-flavoured Markdown into clean HTML you can paste into a website, email template, or CMS. Supports headings, lists, links, images, code blocks, tables, and inline formatting. Conversion happens in the browser, and the output uses semantic HTML5 tags suitable for accessibility and SEO.",
      examples: [
        {
          title: "Convert a README for a blog post",
          body: "Paste your repo README.md and get HTML ready to drop into Ghost, WordPress, or any CMS that accepts HTML.",
        },
        {
          title: "Generate email HTML",
          body: "Write the email body in Markdown for readability, convert to HTML, and paste into your email client's HTML view — much faster than hand-writing tables.",
        },
        {
          title: "Build static-site content",
          body: "Useful for SSG users who occasionally need to inline HTML (in a component, in a JSX expression) but prefer authoring in Markdown.",
        },
      ],
      useCases: [
        "Converting documentation to publishable HTML",
        "Authoring marketing emails in Markdown and rendering to HTML",
        "Generating help-centre articles from Markdown source",
        "Preparing release notes for a website or in-app changelog",
        "Producing static HTML pages without a full build pipeline",
      ],
      troubleshooting: [
        {
          problem: "Inline HTML got escaped.",
          solution: "CommonMark allows raw HTML by default. If yours is escaped, check the \"allow inline HTML\" option or switch the dialect to GitHub-flavoured Markdown.",
        },
        {
          problem: "Tables not rendering.",
          solution: "Plain CommonMark doesn't include tables. Enable GFM (GitHub Flavored Markdown) for table, strikethrough, and task-list support.",
        },
        {
          problem: "Code blocks lost their language hint.",
          solution: "Use triple-backtick fences with a language tag (```js). The output adds a language-js class on the <code> tag for syntax highlighters like Prism or highlight.js.",
        },
      ],
    },
  },
  {
    id: 'html-to-markdown',
    name: 'HTML to Markdown Converter',
    seoTitle: 'HTML to Markdown Converter – Convert HTML Online (Free Tool)',
    description: 'Free online HTML to Markdown Converter tool to convert HTML code to Markdown syntax. Transform HTML markup to MD format for documentation. All conversion happens locally.',
    shortDescription: 'Convert HTML to Markdown',
    category: 'converter',
    slug: 'html-to-markdown',
    icon: 'FileCode',
    keywords: ['html to markdown', 'html converter', 'html to md', 'markdown generator'],
    tags: ['converter', 'html', 'markdown', 'generator'],
    faq: [
      {
        question: 'How does HTML to Markdown conversion work?',
        answer: 'Paste your HTML code and the tool parses the markup, converting each HTML element to its Markdown equivalent while preserving the document structure.',
      },
      {
        question: 'What HTML elements are supported?',
        answer: 'The converter handles common HTML elements including headings, paragraphs, links, images, lists (ordered and unordered), tables, code blocks, and text formatting.',
      },
      {
        question: 'Will the Markdown output be compatible with all platforms?',
        answer: 'Yes, the tool generates standard Markdown syntax that works across all major platforms including GitHub, GitLab, Reddit, and static site generators.',
      },
      {
        question: 'What happens to unsupported HTML elements?',
        answer: 'Unsupported or complex HTML elements may be kept as raw HTML within the Markdown output, which is valid in most Markdown processors.',
      },
      {
        question: 'Can I convert entire web pages to Markdown?',
        answer: 'Yes, you can paste the HTML source of any web page. For best results, extract just the content portion rather than the entire page structure.',
      },
    ],
    relatedTools: ['markdown-to-html', 'remove-html-tags', 'markdown-to-pdf'],
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    seoTitle: 'QR Code Generator – Generate QR Online (Free Tool)',
    description: 'Free online QR Code Generator tool to create QR codes for URLs, text, and data. Generate QR codes in various sizes with customizable colors. All generation happens locally.',
    shortDescription: 'Generate QR codes online',
    category: 'converter',
    slug: 'qr-code-generator',
    icon: 'QrCode',
    keywords: ['qr code', 'qr generator', 'qr maker', 'barcode generator'],
    tags: ['converter', 'code', 'generator', 'maker', 'barcode'],
    faq: [
      {
        question: 'What types of data can I encode in a QR code?',
        answer: 'You can encode URLs, plain text, email addresses, phone numbers, WiFi credentials, contact information (vCard), calendar events, and more.',
      },
      {
        question: 'How do I download the generated QR code?',
        answer: 'After generating your QR code, you can download it as an image file (PNG or SVG) by clicking the download button.',
      },
      {
        question: 'Can I customize the color of my QR code?',
        answer: 'Yes, many QR code generators allow you to change the foreground and background colors while maintaining scannability.',
      },
      {
        question: 'What is the maximum amount of data a QR code can hold?',
        answer: 'A standard QR code can hold up to 4,296 alphanumeric characters, 7,089 numeric characters, or 2,953 binary bytes, depending on the version and error correction level.',
      },
      {
        question: 'Do QR codes expire?',
        answer: 'No, QR codes themselves do not expire. However, if the QR code points to a URL, that destination URL may become unavailable over time.',
      },
    ],
    relatedTools: ['url-to-qr-code', 'barcode-generator', 'url-encode'],
    seoContent: {
      intro: "QR Code Generator turns any text, URL, contact card, or Wi-Fi credential into a scannable QR code. The image is generated locally using the standard QR algorithm (ISO/IEC 18004), so your data — even sensitive items like Wi-Fi passwords — never leaves the browser. Download as PNG at the size you need.",
      examples: [
        {
          title: "QR for a portfolio URL",
          body: "Paste https://example.com/me, choose size 512, and download the PNG to print on a business card or display on a screen.",
        },
        {
          title: "Wi-Fi QR for guests",
          body: "Use the WIFI: prefix format (WIFI:T:WPA;S:Guest;P:secret;;) and visitors can join your network by scanning — no typing required.",
        },
        {
          title: "vCard contact",
          body: "Encode a vCard string with name, phone, and email — recipients scan once and the contact saves straight into their address book.",
        },
      ],
      useCases: [
        "Print materials (business cards, flyers, posters, restaurant menus)",
        "Wi-Fi sharing at home, in shops, and at events",
        "Linking from physical signage to a digital landing page",
        "Embedding contact info in resumes or email signatures",
        "Tracking conversions by generating unique UTM-tagged URLs per campaign",
      ],
      troubleshooting: [
        {
          problem: "QR scans but to the wrong URL.",
          solution: "Check the input — extra spaces, missing https://, or unescaped special characters can change the encoded text. Use the higher error-correction level if the medium might be damaged.",
        },
        {
          problem: "QR is unscannable at small sizes.",
          solution: "Increase size to at least 256px when displayed on screens, or 2cm × 2cm when printed. Raise error correction to Q or H if the medium may be obscured.",
        },
        {
          problem: "Generator fails for very long input.",
          solution: "QR codes have a max capacity (~4000 alphanumeric chars at L correction). Shorten the URL (use a URL shortener) or split the content across multiple codes.",
        },
      ],
    },
  },
  {
    id: 'text-to-base64',
    name: 'Text to Base64 Converter',
    seoTitle: 'Text to Base64 Converter – Convert Text Online (Free Tool)',
    description: 'Free online Text to Base64 Converter tool to convert plain text to Base64 encoding. Encode strings for safe transmission in text-based protocols. All conversion happens locally.',
    shortDescription: 'Convert text to Base64',
    category: 'converter',
    slug: 'text-to-base64',
    icon: 'Binary',
    keywords: ['text to base64', 'base64 encoder', 'encode text', 'base64 converter'],
    tags: ['converter', 'base64', 'encoder', 'encode'],
    faq: [
      {
        question: 'What is Base64 encoding?',
        answer: 'Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters using 64 different characters (A-Z, a-z, 0-9, +, /).',
      },
      {
        question: 'Why would I need to convert text to Base64?',
        answer: 'Base64 encoding is used to safely transmit data over text-based protocols, embed images in HTML/CSS, store complex data in JSON, and handle binary data in email attachments.',
      },
      {
        question: 'Does Base64 encoding encrypt my data?',
        answer: 'No, Base64 is an encoding scheme, not encryption. Anyone can decode Base64 data. It does not provide security, only safe data representation.',
      },
      {
        question: 'How much larger is Base64 encoded data?',
        answer: 'Base64 encoding increases data size by approximately 33%. For every 3 bytes of input, you get 4 bytes of output.',
      },
      {
        question: 'Can I encode special characters and Unicode text?',
        answer: 'Yes, the tool handles special characters and Unicode text. The text is first converted to UTF-8 bytes before Base64 encoding.',
      },
    ],
    relatedTools: ['base64-to-text', 'base64-encode', 'base64-decode'],
  },
  {
    id: 'base64-to-text',
    name: 'Base64 to Text Converter',
    seoTitle: 'Base64 to Text Converter – Convert Base64 Online (Free Tool)',
    description: 'Free online Base64 to Text Converter tool to decode Base64 encoded strings to readable text. Convert Base64 back to plain text instantly. All decoding happens locally.',
    shortDescription: 'Convert Base64 to text',
    category: 'converter',
    slug: 'base64-to-text',
    icon: 'FileText',
    keywords: ['base64 to text', 'base64 decoder', 'decode base64', 'base64 converter'],
    tags: ['converter', 'base64', 'decoder', 'decode'],
    faq: [
      {
        question: 'How do I decode Base64 to text?',
        answer: 'Simply paste your Base64 encoded string into the input field, and the tool will automatically decode it to readable text.',
      },
      {
        question: 'What if my Base64 string is invalid?',
        answer: 'The tool validates the input and will display an error message if the Base64 string is malformed or contains invalid characters.',
      },
      {
        question: 'Can I decode Base64 that contains binary data?',
        answer: 'This tool is designed for text output. Binary data like images will be decoded to raw bytes, which may not display as readable text.',
      },
      {
        question: 'What characters are valid in Base64?',
        answer: 'Valid Base64 characters are A-Z, a-z, 0-9, +, /, and = for padding. Some variants use - and _ instead of + and /.',
      },
      {
        question: 'Is decoding Base64 secure?',
        answer: 'Decoding Base64 is safe and simply reverses the encoding process. However, be cautious when decoding content from untrusted sources.',
      },
    ],
    relatedTools: ['text-to-base64', 'base64-decode', 'base64-encode'],
  },
  {
    id: 'url-to-qr-code',
    name: 'URL to QR Code',
    seoTitle: 'URL to QR Code – Free Online Tool',
    description: 'Free online URL to QR Code tool to generate QR codes for website links. Create scannable QR codes for any URL instantly. All generation happens locally in your browser.',
    shortDescription: 'Convert URL to QR code',
    category: 'converter',
    slug: 'url-to-qr-code',
    icon: 'Link',
    keywords: ['url to qr', 'url qr code', 'website qr', 'link qr code'],
    tags: ['converter', 'url', 'code', 'website', 'link'],
    faq: [
      {
        question: 'How do I create a QR code for a URL?',
        answer: 'Enter your website URL in the input field and the tool instantly generates a scannable QR code that links directly to that URL.',
      },
      {
        question: 'Do URL QR codes work with all devices?',
        answer: 'Yes, QR codes are universal and can be scanned by any smartphone camera or QR code reader app on iOS, Android, and other devices.',
      },
      {
        question: 'Can I use shortened URLs in QR codes?',
        answer: 'Yes, shortened URLs from services like bit.ly work perfectly and result in simpler QR codes that may be easier to scan.',
      },
      {
        question: 'What happens if my URL changes?',
        answer: 'Static QR codes cannot be changed after creation. If your URL changes, you will need to generate a new QR code.',
      },
      {
        question: 'What URL formats are supported?',
        answer: 'The tool supports HTTP, HTTPS URLs, and can also encode FTP links, mailto links, and other URI schemes.',
      },
    ],
    relatedTools: ['qr-code-generator', 'barcode-generator', 'url-parser'],
  },
  {
    id: 'unix-time-to-date',
    name: 'Unix Time to Date Converter',
    seoTitle: 'Unix Time to Date Converter – Convert Unix Online (Free Tool)',
    description: 'Free online Unix Time to Date Converter tool to convert epoch timestamps to human-readable dates. Transform Unix timestamps to datetime format. All conversion happens locally.',
    shortDescription: 'Convert Unix time to date',
    category: 'converter',
    slug: 'unix-time-to-date',
    icon: 'Clock',
    keywords: ['unix time', 'epoch converter', 'timestamp to date', 'unix timestamp'],
    tags: ['converter', 'unix', 'time', 'epoch', 'timestamp', 'date'],
    faq: [
      {
        question: 'What is Unix time (epoch time)?',
        answer: 'Unix time is the number of seconds that have elapsed since January 1, 1970 (UTC), not counting leap seconds. It is also called epoch time or POSIX time.',
      },
      {
        question: 'How do I convert a Unix timestamp to a readable date?',
        answer: 'Enter your Unix timestamp (in seconds or milliseconds) and the tool instantly converts it to a human-readable date and time format.',
      },
      {
        question: 'What is the difference between seconds and milliseconds timestamps?',
        answer: 'Unix timestamps in seconds are typically 10 digits, while millisecond timestamps are 13 digits. The tool can auto-detect the format.',
      },
      {
        question: 'What timezone is used for the conversion?',
        answer: 'By default, the tool displays dates in your local timezone. Some converters also show UTC time for reference.',
      },
      {
        question: 'Can I convert negative Unix timestamps?',
        answer: 'Yes, negative Unix timestamps represent dates before January 1, 1970, and the tool can handle these correctly.',
      },
    ],
    relatedTools: ['date-to-unix-time', 'timestamp-converter', 'time-converter'],
  },
  {
    id: 'date-to-unix-time',
    name: 'Date to Unix Time Converter',
    seoTitle: 'Date to Unix Time Converter – Convert Date Online (Free Tool)',
    description: 'Free online Date to Unix Time Converter tool to convert dates to Unix timestamps. Transform datetime to epoch time in seconds. All conversion happens locally in your browser.',
    shortDescription: 'Convert date to Unix time',
    category: 'converter',
    slug: 'date-to-unix-time',
    icon: 'Clock',
    keywords: ['date to unix', 'date to timestamp', 'epoch time', 'unix converter'],
    tags: ['converter', 'date', 'unix', 'timestamp', 'epoch', 'time'],
    faq: [
      {
        question: 'How do I convert a date to Unix timestamp?',
        answer: 'Select or enter your date and time, and the tool will instantly calculate the corresponding Unix timestamp in seconds.',
      },
      {
        question: 'What date format should I use?',
        answer: 'Most tools accept standard date pickers or common formats like YYYY-MM-DD HH:MM:SS. The tool handles parsing automatically.',
      },
      {
        question: 'Does the timezone affect the Unix timestamp?',
        answer: 'Unix timestamps are always in UTC. When you enter a local time, it is converted to UTC before calculating the timestamp.',
      },
      {
        question: 'Can I get timestamps in milliseconds?',
        answer: 'Yes, many tools offer the option to output timestamps in milliseconds (13 digits) instead of seconds (10 digits).',
      },
      {
        question: 'What is the valid date range for Unix timestamps?',
        answer: 'Standard Unix timestamps (32-bit) range from 1901 to 2038, but 64-bit systems can handle a much wider range of dates.',
      },
    ],
    relatedTools: ['unix-time-to-date', 'timestamp-converter', 'time-converter'],
  },
  {
    id: 'time-converter',
    name: 'Time Converter',
    seoTitle: 'Time Converter – Convert Time Online (Free Tool)',
    description: 'Free online Time Converter tool to convert time between timezones. Calculate time differences across different regions. Perfect for scheduling across time zones.',
    shortDescription: 'Convert time units',
    category: 'converter',
    slug: 'time-converter',
    icon: 'Clock',
    keywords: ['time converter', 'convert time', 'hours to minutes', 'time units'],
    tags: ['converter', 'time', 'convert', 'hours', 'minutes', 'units'],
    faq: [
      {
        question: 'What time units can I convert?',
        answer: 'You can convert between seconds, minutes, hours, days, weeks, milliseconds, microseconds, and nanoseconds.',
      },
      {
        question: 'How do I convert hours to minutes?',
        answer: 'Enter the number of hours and select minutes as the target unit. The tool multiplies by 60 to give you the equivalent minutes.',
      },
      {
        question: 'Can I convert large time values?',
        answer: 'Yes, the tool handles large values and can convert thousands of hours to days or weeks instantly.',
      },
      {
        question: 'How many seconds are in a day?',
        answer: 'There are 86,400 seconds in a standard day (24 hours x 60 minutes x 60 seconds). The tool calculates this automatically.',
      },
      {
        question: 'Does the converter account for leap years?',
        answer: 'For day-based conversions, the tool uses standard calculations. Leap year adjustments are typically not needed for basic time unit conversions.',
      },
    ],
    relatedTools: ['timestamp-converter', 'countdown-timer', 'cron-expression-parser'],
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    seoTitle: 'Temperature Converter – Convert Temperature Online (Free Tool)',
    description: 'Free online Temperature Converter tool to convert between Celsius, Fahrenheit, and Kelvin. Calculate temperature values for different scales. All conversion happens locally.',
    shortDescription: 'Convert temperature units',
    category: 'converter',
    slug: 'temperature-converter',
    icon: 'Thermometer',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin'],
    tags: ['converter', 'kelvin', 'temperature', 'celsius', 'fahrenheit'],
    faq: [
      {
        question: 'How do I convert Celsius to Fahrenheit?',
        answer: 'To convert Celsius to Fahrenheit, multiply by 9/5 and add 32. For example, 0°C = (0 × 9/5) + 32 = 32°F.',
      },
      {
        question: 'How do I convert Fahrenheit to Celsius?',
        answer: 'Subtract 32 from the Fahrenheit value, then multiply by 5/9. For example, 68°F = (68 - 32) × 5/9 = 20°C.',
      },
      {
        question: 'What is Kelvin used for?',
        answer: 'Kelvin is the SI unit for temperature and is used in scientific contexts. Absolute zero is 0K (-273.15°C), the lowest possible temperature.',
      },
      {
        question: 'What is absolute zero in different scales?',
        answer: 'Absolute zero is 0 Kelvin, -273.15°C, or -459.67°F. It is the theoretical temperature at which molecular motion stops.',
      },
      {
        question: 'Which temperature scale should I use?',
        answer: 'Celsius is used in most countries, Fahrenheit in the US, and Kelvin in scientific applications. Choose based on your location or field of work.',
      },
    ],
    relatedTools: ['weight-converter', 'length-converter', 'unit-converter'],
  },
  {
    id: 'weight-converter',
    name: 'Weight Converter',
    seoTitle: 'Weight Converter – Convert Weight Online (Free Tool)',
    description: 'Free online Weight Converter tool to convert between different weight units. Convert kilograms, pounds, ounces, and other mass units. All conversion happens locally.',
    shortDescription: 'Convert weight units',
    category: 'converter',
    slug: 'weight-converter',
    icon: 'Scale',
    keywords: ['weight converter', 'kg to lbs', 'pounds to kg', 'weight units', 'mass converter'],
    tags: ['converter', 'weight', 'lbs', 'pounds', 'units', 'mass'],
    faq: [
      {
        question: 'What weight units can I convert?',
        answer: 'You can convert between kilograms, grams, pounds, ounces, tons, milligrams, and other common weight units.',
      },
      {
        question: 'How do I convert kilograms to pounds?',
        answer: 'Multiply kilograms by 2.20462 to get pounds. For example, 10 kg = 10 × 2.20462 = 22.0462 lbs.',
      },
      {
        question: 'How do I convert pounds to kilograms?',
        answer: 'Divide pounds by 2.20462 to get kilograms. For example, 100 lbs = 100 / 2.20462 = 45.36 kg.',
      },
      {
        question: 'What is the difference between weight and mass?',
        answer: 'Mass is the amount of matter in an object (measured in kg), while weight is the force of gravity on that mass. In everyday use, they are often treated the same.',
      },
      {
        question: 'How many ounces are in a pound?',
        answer: 'There are 16 ounces in one pound. To convert, divide ounces by 16 to get pounds, or multiply pounds by 16 to get ounces.',
      },
    ],
    relatedTools: ['temperature-converter', 'length-converter', 'unit-converter'],
  },
  {
    id: 'length-converter',
    name: 'Length Converter',
    seoTitle: 'Length Converter – Convert Length Online (Free Tool)',
    description: 'Free online Length Converter tool to convert between different length units. Convert meters, feet, inches, and other distance units. All conversion happens locally.',
    shortDescription: 'Convert length units',
    category: 'converter',
    slug: 'length-converter',
    icon: 'Ruler',
    keywords: ['length converter', 'meters to feet', 'inches to cm', 'distance converter', 'km to miles'],
    tags: ['converter', 'length', 'meters', 'feet', 'inches', 'distance', 'miles'],
    faq: [
      {
        question: 'What length units are supported?',
        answer: 'You can convert between meters, kilometers, centimeters, millimeters, miles, yards, feet, inches, and more.',
      },
      {
        question: 'How do I convert meters to feet?',
        answer: 'Multiply meters by 3.28084 to get feet. For example, 10 meters = 10 × 3.28084 = 32.8084 feet.',
      },
      {
        question: 'How do I convert inches to centimeters?',
        answer: 'Multiply inches by 2.54 to get centimeters. For example, 12 inches = 12 × 2.54 = 30.48 cm.',
      },
      {
        question: 'How many kilometers are in a mile?',
        answer: 'One mile equals approximately 1.60934 kilometers. To convert, multiply miles by 1.60934.',
      },
      {
        question: 'What is the difference between imperial and metric units?',
        answer: 'Metric units (meters, kilometers) are based on powers of 10 and used globally. Imperial units (feet, miles) are primarily used in the United States and a few other countries.',
      },
    ],
    relatedTools: ['weight-converter', 'temperature-converter', 'unit-converter'],
  },
  {
    id: 'markdown-to-pdf',
    name: 'Markdown to PDF Converter',
    seoTitle: 'Markdown to PDF Converter – Convert Markdown Online (Free Tool)',
    description: 'Free online Markdown to PDF Converter tool to convert Markdown files to PDF documents. Export MD content to printable PDF format. All conversion happens locally.',
    shortDescription: 'Convert Markdown to PDF',
    category: 'converter',
    slug: 'markdown-to-pdf',
    icon: 'FileType',
    keywords: ['markdown to pdf', 'md to pdf', 'convert markdown', 'pdf from markdown'],
    tags: ['converter', 'markdown', 'pdf', 'convert'],
    faq: [
      {
        question: 'How does Markdown to PDF conversion work?',
        answer: 'Upload your Markdown file, and the tool converts it to a formatted PDF document with proper styling and layout.',
      },
      {
        question: 'Which Markdown features are supported?',
        answer: 'Standard CommonMark: headings, bold/italic, lists, links, images, blockquotes, code blocks, tables, and horizontal rules. GitHub-style extensions like task lists and strikethrough are also handled.',
      },
      {
        question: 'Can I customize the PDF styling?',
        answer: 'Default styles produce a clean documentation look (sans-serif headings, monospace code blocks, table borders). For custom branding, convert to HTML first with our Markdown to HTML tool, edit the CSS, then print to PDF.',
      },
      {
        question: 'Will images embedded in my Markdown appear in the PDF?',
        answer: 'Yes — both inline base64 images and external image URLs are rendered. For best results in offline contexts, embed images as base64 so the PDF is fully self-contained.',
      },
      {
        question: 'Is the conversion done locally?',
        answer: 'Yes. Markdown parsing and PDF rendering happen entirely in your browser. Your document content is never uploaded — completely private.',
      },
    ],
    relatedTools: ['word-to-pdf', 'html-to-markdown', 'merge-pdf'],
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML Converter',
    seoTitle: 'JSON to XML Converter – Convert JSON Online (Free Tool)',
    description: 'Free online JSON to XML Converter tool to convert JSON data to XML format. Transform JSON structures to XML markup instantly. All conversion happens locally in your browser.',
    shortDescription: 'Convert JSON to XML',
    category: 'converter',
    slug: 'json-to-xml',
    icon: 'FileCode',
    keywords: ['json to xml', 'convert json', 'json xml', 'json converter'],
    tags: ['converter', 'json', 'xml', 'convert'],
    faq: [
      {
        question: 'How do I convert JSON to XML?',
        answer: 'Paste your JSON data into the input field and click convert. The tool will generate a properly formatted XML document.',
      },
      {
        question: 'How are JSON arrays represented in XML?',
        answer: 'Each array item becomes a repeated child element. For example, `{"items": [1, 2]}` becomes `<items>1</items><items>2</items>`. The tool wraps the top-level result in a `<root>` element when needed.',
      },
      {
        question: 'What happens to JSON keys with special characters?',
        answer: 'XML element names cannot start with a digit or contain spaces or slashes. The converter sanitizes such keys (e.g. replacing spaces with underscores) and warns about any forced renames.',
      },
      {
        question: 'When should I convert JSON to XML?',
        answer: 'Useful when integrating with legacy SOAP/XML APIs, generating configuration files for tools that only accept XML, transforming data for XSLT, or migrating between systems with different data format conventions.',
      },
      {
        question: 'Can I round-trip back to JSON?',
        answer: 'Yes — use our XML to JSON Converter for the reverse direction. Round-trip preserves structure but type information (numbers, booleans) may need to be re-asserted since XML treats everything as text.',
      },
    ],
    relatedTools: ['xml-to-json', 'json-formatter', 'json-to-csv'],
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON Converter',
    seoTitle: 'XML to JSON Converter – Convert XML Online (Free Tool)',
    description: 'Free online XML to JSON Converter tool to convert XML data to JSON format. Parse XML structures to JSON objects instantly. All conversion happens locally in your browser.',
    shortDescription: 'Convert XML to JSON',
    category: 'converter',
    slug: 'xml-to-json',
    icon: 'FileCode',
    keywords: ['xml to json', 'convert xml', 'xml json', 'xml converter'],
    tags: ['converter', 'xml', 'json', 'convert'],
    faq: [
      {
        question: 'How do I convert XML to JSON?',
        answer: 'Paste your XML document into the input field and click convert. The tool will generate equivalent JSON data.',
      },
      {
        question: 'How are XML attributes handled in JSON?',
        answer: 'Attributes are prefixed with "@" to distinguish them from child elements. So `<item id="1">value</item>` becomes `{"item": {"@id": "1", "#text": "value"}}`. This avoids collisions when an attribute and child element share a name.',
      },
      {
        question: 'What about repeated XML elements?',
        answer: 'Multiple sibling elements with the same tag are converted to a JSON array. A single occurrence stays a single object — pass a hint or use post-processing if you always need an array.',
      },
      {
        question: 'Are all data types preserved?',
        answer: 'XML treats everything as text, so numbers and booleans come out as strings in JSON. Use `JSON.parse(...)` after a regex replacement if you need real numeric/boolean types in the output.',
      },
      {
        question: 'When would I convert XML to JSON?',
        answer: 'Most modern APIs prefer JSON. Convert when consuming legacy SOAP responses, RSS/Atom feeds, or XML config files in a JavaScript codebase that expects JSON.',
      },
    ],
    relatedTools: ['json-to-xml', 'json-formatter', 'csv-to-json'],
  },

  // ==================== MISC TOOLS ====================
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    seoTitle: 'Random Number Generator – Generate Random Online (Free Tool)',
    description: 'Free online Random Number Generator tool to generate random numbers within a specified range. Get random integers or decimals with customizable options. All generation happens locally.',
    shortDescription: 'Generate random numbers',
    category: 'misc',
    slug: 'random-number-generator',
    icon: 'Dice5',
    keywords: ['random number', 'number generator', 'random integer', 'rng'],
    tags: ['utility', 'rng', 'random', 'number', 'generator', 'integer'],
    faq: [
      {
        question: 'How does this random number generator work?',
        answer: 'This tool generates random numbers within a specified range. You can choose to allow or disallow duplicates, and generate multiple numbers at once.',
      },
      {
        question: 'What can I use random numbers for?',
        answer: 'Random numbers are useful for games, simulations, statistical sampling, cryptography, and any application requiring unpredictable values.',
      },
      {
        question: 'Are these numbers truly random?',
        answer: 'They are generated by the browser\'s built-in pseudo-random function, which is statistically random enough for everyday use (games, simulations, sampling). For security-critical use cases like cryptography, use our Secure Token Generator instead.',
      },
      {
        question: 'Can I generate integers AND decimals?',
        answer: 'Yes. Toggle between integer and decimal mode. In decimal mode you can also set the number of decimal places (1–10) to control precision.',
      },
      {
        question: 'What is the maximum range?',
        answer: 'Practically, any integer the browser can represent — up to 2^53 - 1. For most use cases (lottery picks, IDs, simulation), a range of 1 to 1 million covers everything.',
      },
    ],
    exampleOutput: {
      output: '42, 87, 15, 93, 28',
      description: 'Example of 5 random numbers between 1-100 with no duplicates',
    },
    relatedTools: ['random-string-generator', 'dice-roll-simulator', 'coin-flip'],
  },
  {
    id: 'dice-roll-simulator',
    name: 'Dice Roll Simulator',
    seoTitle: 'Dice Roll Simulator – Free Online Tool',
    description: 'Free online Dice Roll Simulator tool to roll virtual dice online. Simulate dice rolls for games, probability, and random number generation. All simulation happens locally.',
    shortDescription: 'Roll dice online',
    category: 'misc',
    slug: 'dice-roll-simulator',
    icon: 'Dices',
    keywords: ['dice roll', 'dice simulator', 'roll dice', 'virtual dice'],
    tags: ['utility', 'dice', 'roll', 'simulator', 'virtual'],
    faq: [
      {
        question: 'How do I use the dice roll simulator?',
        answer: 'Pick the number of dice and the type (d6, d20, d4, etc.), then click Roll. The result shows individual dice values plus the total. Roll again as many times as you want — each roll is independent.',
      },
      {
        question: 'What types of dice are supported?',
        answer: 'Standard tabletop sets: d4, d6 (classic cube), d8, d10, d12, d20 (icosahedron, used in D&D), and d100. Choose any combination for tabletop RPGs, board games, or probability demos.',
      },
      {
        question: 'Is the dice roll really random?',
        answer: 'Each face has equal probability, drawn from the browser\'s pseudo-random generator. Statistically fair for games and simulations — not cryptographically random.',
      },
      {
        question: 'Can I roll multiple dice at once?',
        answer: 'Yes. Set the dice count (1–20+) and roll them simultaneously. The result lists each die\'s value plus the sum, ideal for D&D-style 3d6 or 4d6-drop-lowest stat rolls.',
      },
      {
        question: 'Why use a virtual dice instead of physical?',
        answer: 'No physical dice handy, want larger pools than your set allows, need exotic dice types (d10, d100), or want to demonstrate probability distributions without bias from worn-out physical dice.',
      },
    ],
    relatedTools: ['coin-flip', 'random-number-generator', 'random-password-generator'],
  },
  {
    id: 'coin-flip',
    name: 'Coin Flip Simulator',
    seoTitle: 'Coin Flip Simulator – Free Online Tool',
    description: 'Free online Coin Flip Simulator tool to flip a virtual coin. Get random heads or tails results instantly. Perfect for decision making and probability demonstrations.',
    shortDescription: 'Flip coin online',
    category: 'misc',
    slug: 'coin-flip',
    icon: 'Circle',
    keywords: ['coin flip', 'heads or tails', 'coin toss', 'flip coin'],
    tags: ['utility', 'coin', 'flip', 'heads', 'tails', 'toss'],
    faq: [
      {
        question: 'Is the coin flip really 50/50?',
        answer: 'Yes. Each flip independently has 50% chance of heads and 50% chance of tails, generated by the browser\'s pseudo-random number generator. Over many flips the ratio approaches exactly 50/50.',
      },
      {
        question: 'What can I use a coin flip for?',
        answer: 'Settling decisions when two options are equally good, breaking ties, picking who goes first in a game, teaching basic probability, or simulating Bernoulli trials in statistics.',
      },
      {
        question: 'Can I flip multiple coins at once?',
        answer: 'Yes. Set the number of flips and the tool will simulate that many independent flips, showing the result of each plus a count of heads vs tails.',
      },
      {
        question: 'Is this fairer than a real coin?',
        answer: 'Real coins can be slightly biased due to weight distribution, the side they start on, or who is flipping. A digital flip is mathematically perfectly fair — closer to ideal 50/50 than any physical coin.',
      },
      {
        question: 'How do I know it is not rigged?',
        answer: 'The randomness comes from your browser\'s `Math.random()` (or `crypto.getRandomValues` for higher-quality randomness). Inspect the source in DevTools if you want to verify there is no bias.',
      },
    ],
    relatedTools: ['dice-roll-simulator', 'random-number-generator', 'random-password-generator'],
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    seoTitle: 'Countdown Timer – Free Online Tool',
    description: 'Free online Countdown Timer tool to set and run countdown timers. Create custom countdowns for events and activities. All timing happens locally in your browser.',
    shortDescription: 'Create countdown timer',
    category: 'misc',
    slug: 'countdown-timer',
    icon: 'Timer',
    keywords: ['countdown timer', 'timer', 'countdown', 'stopwatch'],
    tags: ['utility', 'timer', 'countdown', 'stopwatch'],
    faq: [
      {
        question: 'How do I set a countdown timer?',
        answer: 'Enter hours, minutes, and seconds, then click Start. The timer displays the remaining time and alerts you when it reaches zero.',
      },
      {
        question: 'Will the timer keep running if I switch tabs?',
        answer: 'Yes. The timer uses background-safe timing in your browser so it continues counting even in inactive tabs. Note that browser power-saving may slightly throttle update frequency.',
      },
      {
        question: 'Does it alert me when time is up?',
        answer: 'Yes — a visible notification appears, and (if you allow notifications) a system notification fires. You can also enable a sound chime.',
      },
      {
        question: 'What is the maximum duration?',
        answer: 'Up to 99 hours, 59 minutes, 59 seconds in a single timer. For longer durations, run multiple consecutive timers or use a date-based countdown.',
      },
      {
        question: 'Will I lose my timer if I refresh the page?',
        answer: 'Yes — the timer resets on refresh since it runs entirely in memory. For long-lived countdowns, use a separate desktop or phone timer app.',
      },
    ],
    relatedTools: ['time-converter', 'cron-expression-parser', 'timestamp-converter'],
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Generator',
    seoTitle: 'Barcode Generator – Generate Barcode Online (Free Tool)',
    description: 'Free online Barcode Generator tool to create barcodes for products and inventory. Generate Code 128 and other barcode formats. All generation happens locally in your browser.',
    shortDescription: 'Generate barcodes online',
    category: 'misc',
    slug: 'barcode-generator',
    icon: 'Barcode',
    keywords: ['barcode generator', 'barcode maker', 'create barcode', 'barcode creator'],
    tags: ['utility', 'barcode', 'generator', 'maker', 'create', 'creator'],
    faq: [
      {
        question: 'How do I generate a barcode?',
        answer: 'Type the data you want to encode (product number, SKU, ID, etc.), choose a barcode format, and the tool renders a scannable barcode. Download as PNG or SVG.',
      },
      {
        question: 'Which barcode formats are supported?',
        answer: 'Code 128 (most versatile, encodes any ASCII), Code 39 (alphanumeric, common in industry), EAN-13 / EAN-8 (retail products), UPC-A (US retail), and ITF-14 (shipping cartons).',
      },
      {
        question: 'Which format should I use?',
        answer: 'For retail products with UPC numbers, use EAN-13 or UPC-A. For internal inventory, asset tracking, or shipping labels, Code 128 is the most flexible choice and handles any text.',
      },
      {
        question: 'How do I print barcodes for labels?',
        answer: 'Download as SVG for sharp scaling at any size, or PNG at 300+ DPI for label-printer use. Make sure to leave clear white "quiet zones" on both sides of the barcode for reliable scanning.',
      },
      {
        question: 'What is the difference between a barcode and QR code?',
        answer: 'Barcodes are 1D and store limited text (usually IDs). QR codes are 2D and store hundreds of characters, URLs, contact info, etc. Use barcodes for inventory and retail; QR codes for marketing and digital payloads.',
      },
    ],
    relatedTools: ['qr-code-generator', 'url-to-qr-code', 'url-encode'],
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    seoTitle: 'Unit Converter – Convert Unit Online (Free Tool)',
    description: 'Free online Unit Converter tool to convert between various units of measurement. Handle length, weight, temperature, and more in one tool. All conversion happens locally.',
    shortDescription: 'Convert units online',
    category: 'misc',
    slug: 'unit-converter',
    icon: 'Ruler',
    keywords: ['unit converter', 'convert units', 'measurement converter', 'unit conversion'],
    tags: ['utility', 'unit', 'converter', 'convert', 'units', 'measurement', 'conversion'],
    faq: [
      {
        question: 'What units can I convert?',
        answer: 'Length (m, ft, in, mile, km, etc.), weight (kg, lb, oz, gram, ton), temperature (°C, °F, K), area, volume, speed, time, energy, pressure, and data storage (B, KB, MB, GB, TB).',
      },
      {
        question: 'How accurate are the conversions?',
        answer: 'Conversions use exact factors where they exist (e.g. 1 inch = 25.4 mm by definition) and high-precision constants for derived units. Display is typically 6 significant digits but you can round as needed.',
      },
      {
        question: 'Does it handle both metric and imperial?',
        answer: 'Yes — all common metric, US customary, and imperial units are supported. Convert in either direction between any two compatible units.',
      },
      {
        question: 'Can I convert between unrelated units?',
        answer: 'No — converting kg to meters has no meaning. The tool only allows conversions within compatible categories (length to length, mass to mass, etc.).',
      },
      {
        question: 'Why use this instead of a search engine?',
        answer: 'No round-trips to a server, instant, works offline, and doesn\'t log your queries. Great for bulk conversions or sensitive measurements you\'d rather not type into a public search.',
      },
    ],
    relatedTools: ['temperature-converter', 'weight-converter', 'length-converter'],
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    seoTitle: 'Age Calculator – Calculate Age Online (Free Tool)',
    description: 'Free online Age Calculator tool to calculate your exact age from birthdate. Get age in years, months, days, hours, and minutes. Perfect for tracking milestones and birthdays.',
    shortDescription: 'Calculate age from date',
    category: 'misc',
    slug: 'age-calculator',
    icon: 'Calendar',
    keywords: ['age calculator', 'calculate age', 'birthday calculator', 'age finder'],
    tags: ['utility', 'age', 'calculator', 'calculate', 'birthday', 'finder'],
    faq: [
      {
        question: 'How is the age calculated?',
        answer: 'The tool computes the difference between your birthdate and today (or a target date you choose), broken down into years, months, days, hours, and minutes.',
      },
      {
        question: 'Can I calculate age on a future or past date?',
        answer: 'Yes. Override the "today" field with any date to find out how old someone was on a specific date or how old they will be in the future. Useful for legal age questions or planning milestones.',
      },
      {
        question: 'Does it handle leap years correctly?',
        answer: 'Yes. The calculation accounts for leap years and the actual number of days in each month, so the result is accurate down to the day.',
      },
      {
        question: 'Why is my age in days different from years × 365?',
        answer: 'A year is on average 365.25 days (due to leap years). Multiplying years × 365 under-counts. The tool computes exact day count from real calendar dates, not an approximation.',
      },
      {
        question: 'Is my birthdate stored?',
        answer: 'No. All calculation happens locally in your browser and nothing is sent anywhere. Refresh the page to clear it.',
      },
    ],
    relatedTools: ['bmi-calculator', 'percentage-calculator', 'date-to-unix-time'],
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    seoTitle: 'BMI Calculator – Calculate BMI Online (Free Tool)',
    description: 'Free online BMI Calculator tool to calculate your Body Mass Index. Enter height and weight to determine BMI category and health indicators. All calculation happens locally.',
    shortDescription: 'Calculate BMI online',
    category: 'misc',
    slug: 'bmi-calculator',
    icon: 'Scale',
    keywords: ['bmi calculator', 'body mass index', 'weight calculator', 'health calculator'],
    tags: ['utility', 'bmi', 'calculator', 'body', 'mass', 'index', 'weight'],
    faq: [
      {
        question: 'What is BMI and how is it calculated?',
        answer: 'BMI (Body Mass Index) = weight (kg) ÷ height² (m²). For imperial: 703 × weight (lb) ÷ height² (in²). The tool accepts both metric and imperial input.',
      },
      {
        question: 'What do the BMI categories mean?',
        answer: 'WHO classification: under 18.5 is underweight, 18.5–24.9 is normal, 25.0–29.9 is overweight, 30.0+ is obese (with sub-categories for class I, II, III). Different populations may use slightly different cutoffs.',
      },
      {
        question: 'Is BMI an accurate health measure?',
        answer: 'BMI is a quick screening tool, not a diagnosis. It does not distinguish muscle from fat, so very athletic people often score "overweight" despite being healthy. It also varies by age, ethnicity, and sex. Use it as one signal, not the only one.',
      },
      {
        question: 'Does BMI work for children?',
        answer: 'No. Children and teens (under 20) need age- and sex-specific BMI percentiles, not the adult thresholds. Use a pediatric BMI chart from CDC/WHO instead.',
      },
      {
        question: 'Is my health data saved?',
        answer: 'No. Height and weight are entered locally and never transmitted. Refresh the page to clear them.',
      },
    ],
    relatedTools: ['age-calculator', 'percentage-calculator', 'weight-converter'],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    seoTitle: 'Percentage Calculator – Calculate Percentage Online (Free Tool)',
    description: 'Free online Percentage Calculator tool to calculate percentages quickly. Find percentage of numbers, increase/decrease percentages, and more. All calculation happens locally.',
    shortDescription: 'Calculate percentages',
    category: 'misc',
    slug: 'percentage-calculator',
    icon: 'Percent',
    keywords: ['percentage calculator', 'calculate percent', 'percent calculator', 'percentage'],
    tags: ['utility', 'percentage', 'calculator', 'calculate', 'percent'],
    faq: [
      {
        question: 'What percentage calculations does this tool handle?',
        answer: 'Common operations: X% of Y, X is what % of Y, percent increase/decrease between two numbers, adding or subtracting a percentage from a value, and reverse-percentage (find the original before a markup or discount).',
      },
      {
        question: 'How do I calculate percent increase?',
        answer: 'Percent change = ((new − old) ÷ old) × 100. For example, 50 to 60 is a 20% increase: (60 − 50) ÷ 50 × 100 = 20. The tool does this automatically when you enter both numbers.',
      },
      {
        question: 'How do I find the original price before discount?',
        answer: 'If you have the sale price and discount %: original = sale ÷ (1 − discount/100). Example: $80 after 20% off → 80 ÷ 0.8 = $100. Use the "reverse percentage" mode.',
      },
      {
        question: 'What is the difference between percent and percentage points?',
        answer: 'Percent is a relative change (5% to 10% is a 100% increase). Percentage points are the absolute difference (5% to 10% is a 5-point increase). Important when discussing interest rates or polls.',
      },
      {
        question: 'How accurate are the results?',
        answer: 'Calculations use full JavaScript floating-point precision. Displayed results are rounded to 4 decimal places by default; you can adjust the precision shown.',
      },
    ],
    relatedTools: ['bmi-calculator', 'age-calculator', 'unit-converter'],
  },
  {
    id: 'password-strength-checker',
    name: 'Password Strength Checker',
    seoTitle: 'Password Strength Checker – Check Password Online (Free Tool)',
    description: 'Free online Password Strength Checker tool to test password security. Analyze password strength and get recommendations for improvement. All checking happens locally.',
    shortDescription: 'Check password strength',
    category: 'misc',
    slug: 'password-strength-checker',
    icon: 'Shield',
    keywords: ['password strength', 'password checker', 'secure password', 'password test'],
    tags: ['utility', 'password', 'strength', 'checker', 'secure', 'test'],
    faq: [
      {
        question: 'How does the password strength checker work?',
        answer: 'It scores your password based on length, character variety (uppercase, lowercase, digits, symbols), entropy, and presence of common patterns. The result is a strength rating from Very Weak to Very Strong.',
      },
      {
        question: 'What makes a strong password?',
        answer: 'Length first (15+ characters), mixed character types, no dictionary words, no personal info (name, birthday), and no reuse across sites. A long random passphrase is stronger than a short complex string.',
      },
      {
        question: 'How long should my password be?',
        answer: 'For high-value accounts, aim for 15+ random characters or a 4–6-word passphrase. Anything under 12 characters with common patterns can be brute-forced in hours with modern GPUs.',
      },
      {
        question: 'Is my password sent anywhere when I test it?',
        answer: 'No. The entire strength analysis runs locally in your browser. The password never leaves your device — completely private.',
      },
      {
        question: 'Should I use a password manager?',
        answer: 'Yes. A password manager generates and stores unique strong passwords per site, so you only need to remember one strong master password. This eliminates reuse risk entirely.',
      },
    ],
    relatedTools: ['random-password-generator', 'secure-token-generator', 'bcrypt-hash-generator'],
  },
  {
    id: 'secure-token-generator',
    name: 'Secure Token Generator',
    seoTitle: 'Secure Token Generator – Generate Secure Online (Free Tool)',
    description: 'Free online Secure Token Generator tool to generate cryptographically secure tokens for API keys and session identifiers. Create random tokens with customizable format and length.',
    shortDescription: 'Generate secure tokens',
    category: 'misc',
    slug: 'secure-token-generator',
    icon: 'Key',
    keywords: ['secure token', 'token generator', 'api key', 'session token', 'csrf token'],
    tags: ['utility', 'secure', 'token', 'generator', 'api', 'key', 'session'],
    faq: [
      {
        question: 'What makes a token secure?',
        answer: 'Secure tokens use cryptographically strong random number generation, making them impossible to predict. They are suitable for authentication, API keys, and security-sensitive applications.',
      },
      {
        question: 'What token format should I use?',
        answer: 'Hex tokens are compact and commonly used. Base64 tokens are more compact and URL-safe. Alphanumeric tokens use only letters and numbers, making them easier to work with in some contexts.',
      },
      {
        question: 'What length should my token be?',
        answer: 'Session tokens: 32+ random characters (≥128 bits of entropy). API keys: 40+ characters. CSRF tokens: 16–32 characters. Longer is always more secure but adds storage overhead — pick the shortest length that satisfies your threat model.',
      },
      {
        question: 'How does this differ from UUID v4?',
        answer: 'UUID v4 is a specific 128-bit format (8-4-4-4-12 hex digits, ~122 random bits). Secure tokens can be any length and use the full alphabet you choose. Use UUIDs when you need the standard format, secure tokens for everything else.',
      },
      {
        question: 'Is the randomness cryptographically secure?',
        answer: 'Yes — tokens come from `crypto.getRandomValues()`, the browser\'s CSPRNG. This is suitable for authentication tokens, API keys, and any security-sensitive use. Not the same as `Math.random()`, which is predictable.',
      },
    ],
    exampleOutput: {
      output: 'a1b2c3d4e5f6789012345678901234567890abcd\nefghijklmnopqrstuvwxyz1234567890ABCD\n789012345678901234567890123456789012',
      description: 'Example of 3 secure hex tokens (32 characters each)',
    },
    relatedTools: ['random-password-generator', 'uuid-generator', 'nano-id-generator'],
  },
  {
    id: 'nano-id-generator',
    name: 'Nano ID Generator',
    seoTitle: 'Nano ID Generator – Generate Nano Online (Free Tool)',
    description: 'Free online Nano ID Generator tool to generate Nano IDs - URL-friendly unique identifiers. Create short, secure, and unique strings. All generation happens locally using crypto API.',
    shortDescription: 'Generate Nano IDs',
    category: 'misc',
    slug: 'nano-id-generator',
    icon: 'Fingerprint',
    keywords: ['nano id', 'nanoid', 'unique id', 'short id', 'url friendly id'],
    tags: ['utility', 'nanoid', 'nano', 'unique', 'short', 'url', 'friendly'],
    faq: [
      {
        question: 'What is Nano ID?',
        answer: 'Nano ID is a small, secure, URL-friendly unique string ID generator. It is 60% smaller than UUID while maintaining similar uniqueness guarantees.',
      },
      {
        question: 'When should I use Nano ID instead of UUID?',
        answer: 'Nano ID is ideal when you need shorter, URL-friendly identifiers like in web applications, short links, or when storage space matters. UUID is better when you need the standard 128-bit format.',
      },
      {
        question: 'What is the default alphabet?',
        answer: 'A-Z, a-z, 0-9, _ and - — all URL-safe characters that can appear in path segments and query parameters without escaping. You can also customize the alphabet for specific needs.',
      },
      {
        question: 'How likely are collisions?',
        answer: 'A 21-character Nano ID (default) gives ~126 bits of entropy. To have a 1% chance of collision you would need to generate ~10^15 IDs — astronomically safe for any practical application.',
      },
      {
        question: 'Can I use shorter Nano IDs?',
        answer: 'Yes, but shorter IDs collide more easily. For ~1 million IDs, 10 characters is safe. For ~1 billion, use 14+. The tool lets you set any length 4–36.',
      },
    ],
    exampleOutput: {
      output: 'V1StGXR8_Z5jdHi6B-myT\nJ6N3kqW7xR9mP2vL8hT5c\nA4bC7dE9fG1hI3jK5lM7n',
      description: 'Example of 3 Nano IDs with URL-safe characters (21 characters default length)',
    },
    relatedTools: ['uuid-generator', 'secure-token-generator', 'random-string-generator'],
  },
  {
    id: 'slug-generator-advanced',
    name: 'Slug Generator Advanced',
    seoTitle: 'Slug Generator Advanced – Generate Slug Online (Free Tool)',
    description: 'Free online Advanced Slug Generator tool to create URL-friendly slugs with transliteration support. Handle special characters and customize separator options. Perfect for SEO-friendly URLs.',
    shortDescription: 'Generate advanced URL slugs',
    category: 'misc',
    slug: 'slug-generator-advanced',
    icon: 'Link',
    keywords: ['slug generator', 'url slug', 'seo slug', 'permalink', 'advanced slug'],
    tags: ['utility', 'permalink', 'slug', 'generator', 'url', 'seo', 'advanced'],
    faq: [
      {
        question: 'What makes this slug generator advanced?',
        answer: 'This tool supports transliteration of non-ASCII characters, custom separators, maximum length settings, and options to handle special characters.',
      },
      {
        question: 'What is transliteration?',
        answer: 'Transliteration converts characters from one alphabet to another. For example, "café" becomes "cafe" and "naïve" becomes "naive". This ensures URLs work across all systems.',
      },
      {
        question: 'Which separator should I use?',
        answer: 'Hyphens (`-`) are the standard for SEO — most search engines treat them as word separators. Underscores (`_`) are valid but treated as part of a word. Avoid spaces, which must be percent-encoded.',
      },
      {
        question: 'Should I include the date or ID in slugs?',
        answer: 'For evergreen content, skip the date so URLs stay relevant. For time-sensitive content (news, events), include the year. Adding a numeric ID (`post-123-my-title`) makes slugs unique even when titles repeat.',
      },
      {
        question: 'How long should a slug be?',
        answer: 'Aim for 3–5 meaningful words (under ~60 characters). Long slugs get truncated in search results and are less shareable. The tool lets you cap maximum length and trim trailing partial words.',
      },
    ],
    exampleOutput: {
      input: 'Hello World! This is an Advanced Slug Generator 2024',
      output: 'hello-world-this-is-an-advanced-slug-generator-2024',
      description: 'Example of URL-friendly slug with hyphens and lowercase',
    },
    relatedTools: ['slug-generator', 'text-case-converter', 'url-encode'],
  },

  // ==================== OFFICE TOOLS ====================
  // Excel Tools
  {
    id: 'excel-to-csv',
    name: 'Excel to CSV Converter',
    seoTitle: 'Excel to CSV Converter – Convert Excel Online (Free Tool)',
    description: 'Convert Excel files (.xlsx, .xls) to CSV format. Export multiple sheets or single sheet to CSV.',
    shortDescription: 'Convert Excel to CSV online',
    category: 'office',
    slug: 'excel-to-csv',
    icon: 'FileSpreadsheet',
    keywords: ['excel to csv', 'xlsx to csv', 'convert excel', 'spreadsheet converter'],
    tags: ['office', 'excel', 'csv', 'xlsx', 'convert', 'spreadsheet', 'converter'],
    faq: [
      {
        question: 'What is the difference between Excel and CSV format?',
        answer: 'Excel files (.xlsx) support multiple sheets, formulas, formatting, and charts. CSV files are plain text files that only contain comma-separated values, making them universally compatible but limited to single-sheet data without formatting.',
      },
      {
        question: 'Will formulas be preserved when converting to CSV?',
        answer: 'No, CSV files do not support formulas. When converting Excel to CSV, only the calculated values are exported, not the formulas themselves. The resulting CSV will show the final values from your spreadsheet.',
      },
      {
        question: 'Can I convert multiple sheets from one Excel file?',
        answer: 'Yes, you can select which sheet to convert. Each sheet needs to be converted separately as CSV files can only contain one data table. Use the sheet selector to choose the specific sheet you want to export.',
      },
      {
        question: 'What character encoding does the CSV use?',
        answer: 'The CSV file uses UTF-8 encoding by default, which supports international characters and special symbols. This ensures compatibility with most applications and proper display of accented characters.',
      },
      {
        question: 'Are my Excel files uploaded to a server?',
        answer: 'No, all conversions happen directly in your browser using client-side processing. Your Excel files never leave your device, ensuring complete privacy and security of your data.',
      },
    ],
    relatedTools: ['csv-to-excel', 'excel-to-json', 'csv-to-json'],
    seoContent: {
      intro: "Excel to CSV converts .xlsx / .xls files into RFC 4180 CSV with UTF-8 BOM so non-ASCII characters (Vietnamese, Japanese, Chinese, Arabic) open correctly in Excel and other tools. Parsing uses the SheetJS library entirely in the browser — your workbook never uploads anywhere. Pick a specific sheet, preview the first 10 rows, and download.",
      examples: [
        {
          title: "Export the active sheet only",
          body: "Open a multi-sheet workbook, select the sheet that contains the report you need, preview to confirm headers, then download a clean CSV.",
        },
        {
          title: "Convert for a SQL bulk import",
          body: "CSV with UTF-8 BOM imports cleanly into PostgreSQL COPY, MySQL LOAD DATA, and SQL Server bulk insert without character corruption.",
        },
        {
          title: "Hand off to a non-technical teammate",
          body: "CSV is the universal data format — anyone with Excel, Sheets, or Numbers can open it without macros, plug-ins, or version concerns.",
        },
      ],
      useCases: [
        "Exporting reports for downstream BI / SQL ingestion",
        "Sharing a single sheet of a large workbook with non-Excel users",
        "Preparing data for a programming script that reads CSV",
        "Migrating from Excel to a database, analytics tool, or static site generator",
        "Producing diffable, version-controlled tabular data (CSV diffs are readable; .xlsx isn't)",
      ],
      troubleshooting: [
        {
          problem: "Special characters look broken in Excel after re-opening.",
          solution: "The download already includes UTF-8 BOM. If Excel still misreads, use \"Data → From Text/CSV\" instead of double-click open, and pick UTF-8 in the dialog.",
        },
        {
          problem: "Formulas turned into their evaluated values.",
          solution: "CSV stores values, not formulas. If you need the formula text, export from Excel with \"Save As → CSV\" and check the formula-bar string per cell.",
        },
        {
          problem: "Date columns came out as serial numbers.",
          solution: "Excel stores dates as numbers internally. The converter formats common date cells as ISO strings; for custom formats, set the cell format before downloading.",
        },
      ],
    },
    howToUse: [
      'Upload your Excel file (.xlsx or .xls)',
      'Select the sheet you want to convert',
      'Click "Convert to CSV" button',
      'Download the converted CSV file',
    ],
  },
  {
    id: 'csv-to-excel',
    name: 'CSV to Excel Converter',
    seoTitle: 'CSV to Excel Converter – Convert CSV Online (Free Tool)',
    description: 'Convert CSV files to Excel format (.xlsx). Create formatted Excel spreadsheets from CSV data.',
    shortDescription: 'Convert CSV to Excel online',
    category: 'office',
    slug: 'csv-to-excel',
    icon: 'FileSpreadsheet',
    keywords: ['csv to excel', 'csv to xlsx', 'convert csv', 'spreadsheet creator'],
    tags: ['office', 'csv', 'excel', 'xlsx', 'convert', 'spreadsheet', 'creator'],
    faq: [
      {
        question: 'How do I convert CSV to Excel?',
        answer: 'Upload your CSV file or paste the data, preview the parsed columns, and click Convert to Excel. The tool generates a real .xlsx file ready to open in Excel, Google Sheets, or LibreOffice.',
      },
      {
        question: 'What delimiters are supported?',
        answer: 'Commas (default), tabs, semicolons, and pipes. The tool auto-detects the most likely delimiter from the first few rows but you can override it manually.',
      },
      {
        question: 'Will the column types be preserved?',
        answer: 'The tool infers numbers, dates, and booleans automatically so Excel sees them as the correct types — not just text. For ambiguous columns, you can force "text only" to prevent leading zeros from being stripped.',
      },
      {
        question: 'Can I handle CSVs with quoted fields containing commas?',
        answer: 'Yes. The parser follows RFC 4180: double-quoted fields can contain commas and line breaks. Internal quotes are escaped as `""`. Malformed quoting is reported with a row number.',
      },
      {
        question: 'Is there a row/file size limit?',
        answer: 'Anything that fits in browser memory works — typically up to ~1 million rows or a few hundred MB. The whole conversion runs locally, so nothing is uploaded.',
      },
    ],
    relatedTools: ['excel-to-csv', 'excel-to-json', 'json-to-csv'],
    howToUse: [
      'Upload or paste your CSV data',
      'Preview the data in the table',
      'Click "Convert to Excel" button',
      'Download the .xlsx file',
    ],
  },
  {
    id: 'excel-to-json',
    name: 'Excel to JSON Converter',
    seoTitle: 'Excel to JSON Converter – Convert Excel Online (Free Tool)',
    description: 'Convert Excel files to JSON format. Transform spreadsheet data into structured JSON objects.',
    shortDescription: 'Convert Excel to JSON online',
    category: 'office',
    slug: 'excel-to-json',
    icon: 'FileCode',
    keywords: ['excel to json', 'xlsx to json', 'spreadsheet to json', 'convert excel'],
    tags: ['office', 'excel', 'json', 'xlsx', 'spreadsheet', 'convert'],
    faq: [
      {
        question: 'How is each row converted to JSON?',
        answer: 'The first row becomes the JSON keys; each subsequent row becomes one object. So a sheet with columns Name/Age/Email gives `[{"Name": "...", "Age": 30, "Email": "..."}, ...]`.',
      },
      {
        question: 'What if my Excel file has multiple sheets?',
        answer: 'You can pick which sheet to convert from a dropdown, or convert all sheets at once into a nested object keyed by sheet name. The tool shows a preview before downloading.',
      },
      {
        question: 'Are dates and numbers preserved as their native types?',
        answer: 'Yes — dates are emitted as ISO 8601 strings (e.g. `2025-04-15`), numbers as numeric values, booleans as `true`/`false`. Cell formulas are evaluated and only their result is exported.',
      },
      {
        question: 'How are empty cells handled?',
        answer: 'By default empty cells become `null`. You can switch to "skip empty" mode to omit the key entirely, useful when downstream consumers prefer absence to null.',
      },
      {
        question: 'Is my Excel file uploaded anywhere?',
        answer: 'No. Parsing happens entirely client-side using SheetJS. Your spreadsheet never leaves your browser — safe for confidential financial or HR data.',
      },
    ],
    relatedTools: ['json-to-excel', 'excel-to-csv', 'csv-to-json'],
    howToUse: [
      'Upload your Excel file',
      'Select the sheet to convert',
      'Choose JSON format (array of objects)',
      'Download or copy the JSON output',
    ],
  },
  {
    id: 'json-to-excel',
    name: 'JSON to Excel Converter',
    seoTitle: 'JSON to Excel Converter – Convert JSON Online (Free Tool)',
    description: 'Convert JSON data to Excel format. Create spreadsheets from JSON arrays and objects.',
    shortDescription: 'Convert JSON to Excel online',
    category: 'office',
    slug: 'json-to-excel',
    icon: 'FileCode',
    keywords: ['json to excel', 'json to xlsx', 'convert json', 'spreadsheet from json'],
    tags: ['office', 'json', 'excel', 'xlsx', 'convert', 'spreadsheet'],
    faq: [
      {
        question: 'What JSON structure should I provide?',
        answer: 'An array of flat objects works best: `[{"name": "...", "age": 30}, ...]`. The keys of the first object become the column headers; each object becomes a row.',
      },
      {
        question: 'What happens with nested objects or arrays?',
        answer: 'Nested values are flattened with dot notation (`user.name`) or serialized as JSON strings, depending on the option you pick. For complex hierarchies consider preprocessing the JSON to flat objects first.',
      },
      {
        question: 'Can I control column order?',
        answer: 'Yes — the tool uses the key order of the first object as the column order. To force a specific order, ensure the first object lists keys in that sequence.',
      },
      {
        question: 'Are types preserved in the Excel output?',
        answer: 'Numbers stay numeric, booleans become TRUE/FALSE, and ISO date strings are recognized as dates by Excel. Strings remain text — leading zeros are preserved if you mark a column as text.',
      },
      {
        question: 'How large a JSON can I convert?',
        answer: 'Anything that fits in browser memory — typically tens of thousands of rows comfortably. For huge datasets, split into multiple files or use a server-side library.',
      },
    ],
    relatedTools: ['excel-to-json', 'json-to-csv', 'csv-to-excel'],
    howToUse: [
      'Paste your JSON data or upload a file',
      'Preview the parsed data',
      'Click "Convert to Excel" button',
      'Download the .xlsx file',
    ],
  },
  {
    id: 'excel-to-xml',
    name: 'Excel to XML Converter',
    seoTitle: 'Excel to XML Converter – Convert Excel Online (Free Tool)',
    description: 'Convert Excel files to XML format. Export spreadsheet data as structured XML documents.',
    shortDescription: 'Convert Excel to XML online',
    category: 'office',
    slug: 'excel-to-xml',
    icon: 'FileCode',
    keywords: ['excel to xml', 'xlsx to xml', 'spreadsheet to xml', 'convert excel'],
    tags: ['office', 'excel', 'xml', 'xlsx', 'spreadsheet', 'convert'],
    faq: [
      {
        question: 'How is Excel data represented in XML?',
        answer: 'Each sheet becomes a `<sheet>` element; each row becomes a `<row>` element; each cell becomes a child element named after its column header. Numbers and dates are emitted as text content.',
      },
      {
        question: 'Can I customize the XML element names?',
        answer: 'Column names from your header row are sanitized into valid XML element names (spaces become underscores, leading digits get prefixed). You can configure root and row element names before exporting.',
      },
      {
        question: 'Why convert Excel to XML?',
        answer: 'XML is the lingua franca of legacy enterprise systems, SOAP APIs, and many B2B integrations. You may also need XML to feed reports into older accounting or BI tools.',
      },
      {
        question: 'Are formulas evaluated or preserved?',
        answer: 'Formulas are evaluated and the resulting value is exported. The formula text itself is dropped — if you need to keep formulas, save the Excel file directly instead.',
      },
      {
        question: 'How are special characters in cells handled?',
        answer: 'Reserved XML characters (`<`, `>`, `&`, `"`, `\'`) are automatically escaped to their entity equivalents (`&lt;`, `&gt;`, etc.) so the output is always valid XML.',
      },
    ],
    relatedTools: ['xml-to-json', 'excel-to-json', 'json-to-xml'],
    howToUse: [
      'Upload your Excel file',
      'Select the sheet to convert',
      'Click "Convert to XML" button',
      'Download the XML file',
    ],
  },
  {
    id: 'excel-to-sql',
    name: 'Excel to SQL Converter',
    seoTitle: 'Excel to SQL Converter – Convert Excel Online (Free Tool)',
    description: 'Convert Excel data to SQL INSERT statements. Generate SQL queries from spreadsheet data.',
    shortDescription: 'Convert Excel to SQL online',
    category: 'office',
    slug: 'excel-to-sql',
    icon: 'Database',
    keywords: ['excel to sql', 'xlsx to sql', 'spreadsheet to sql', 'sql generator'],
    tags: ['office', 'excel', 'sql', 'xlsx', 'spreadsheet', 'generator'],
    faq: [
      {
        question: 'What SQL dialect is generated?',
        answer: 'Standard ANSI INSERT statements that work in MySQL, PostgreSQL, SQLite, SQL Server, and Oracle with little or no modification. You can pick the dialect to enable engine-specific quoting and identifier rules.',
      },
      {
        question: 'How is the table name determined?',
        answer: 'You enter a table name; columns are derived from the first row of your Excel sheet. The tool sanitizes column names into valid SQL identifiers (snake_case, no spaces).',
      },
      {
        question: 'Does it also generate the CREATE TABLE statement?',
        answer: 'Yes — toggle the option to include a CREATE TABLE with inferred column types (INT, DECIMAL, VARCHAR, DATE, BOOLEAN) based on cell content. Review the types before running on a real database.',
      },
      {
        question: 'How are strings with quotes escaped?',
        answer: 'Single quotes inside string values are doubled (`O\'Brien` → `O\'\'Brien`) per SQL standard. NULLs are emitted as the `NULL` keyword without quotes.',
      },
      {
        question: 'Can I run the SQL directly?',
        answer: 'Copy the generated statements and paste them into your database client (MySQL Workbench, pgAdmin, DBeaver, etc.). Always run on a test database first to catch type or constraint mismatches.',
      },
    ],
    relatedTools: ['sql-formatter', 'csv-to-json', 'excel-to-csv'],
    howToUse: [
      'Upload your Excel file',
      'Select the sheet and table name',
      'Click "Generate SQL" button',
      'Download or copy the SQL statements',
    ],
  },
  {
    id: 'merge-excel',
    name: 'Merge Excel Files',
    seoTitle: 'Merge Excel Files – Free Online Tool',
    description: 'Combine multiple Excel files into one. Merge spreadsheets with same or different structures.',
    shortDescription: 'Merge Excel files online',
    category: 'office',
    slug: 'merge-excel',
    icon: 'Layers',
    keywords: ['merge excel', 'combine excel', 'join spreadsheets', 'excel merger'],
    tags: ['office', 'merge', 'excel', 'combine', 'join', 'spreadsheets', 'merger'],
    faq: [
      {
        question: 'How does merge work — by sheets or by rows?',
        answer: 'Two modes: "by sheets" keeps each input file as a separate tab in the output workbook; "by rows" stacks rows from all files into a single sheet (requires matching column headers).',
      },
      {
        question: 'How many files can I merge at once?',
        answer: 'Up to ~20 files in one operation, depending on file sizes. The output is a single .xlsx file containing all the combined data.',
      },
      {
        question: 'What if my files have different column structures?',
        answer: 'In "by sheets" mode this is fine — each sheet keeps its own columns. In "by rows" mode the tool either aligns common columns and pads missing ones with empty cells, or rejects the merge — your choice.',
      },
      {
        question: 'Will formulas, formatting, and charts be preserved?',
        answer: 'Cell values, basic formatting (bold, colors), and column widths are preserved. Complex artifacts (charts, conditional formatting, macros) may be dropped — open the merged file in Excel to verify.',
      },
      {
        question: 'How are duplicate rows handled?',
        answer: 'Duplicates are kept by default. Toggle "remove exact duplicate rows" to deduplicate. Partial duplicates (same key, different values) are not deduplicated — that requires manual cleanup.',
      },
    ],
    relatedTools: ['excel-to-csv', 'excel-to-json', 'csv-to-excel'],
    howToUse: [
      'Upload multiple Excel files',
      'Choose merge option (sheets or rows)',
      'Click "Merge Files" button',
      'Download the combined Excel file',
    ],
  },

  // Word Tools
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    seoTitle: 'Word to PDF Converter – Convert Word Online (Free Tool)',
    description: 'Convert Word documents (.docx) to PDF format. Create PDF files from Word documents.',
    shortDescription: 'Convert Word to PDF online',
    category: 'office',
    slug: 'word-to-pdf',
    icon: 'FileText',
    keywords: ['word to pdf', 'docx to pdf', 'convert word', 'document to pdf'],
    tags: ['office', 'word', 'pdf', 'docx', 'convert', 'document'],
    faq: [
      {
        question: 'Will my Word formatting be preserved in the PDF?',
        answer: 'Most formatting is preserved: headings, fonts, bold/italic, lists, tables, basic image placement, and page breaks. Very complex layouts (text boxes, SmartArt, fields) may render slightly differently — preview before sharing.',
      },
      {
        question: 'What Word versions are supported?',
        answer: 'Modern .docx files from Word 2007+, Google Docs exports, LibreOffice Writer, and Pages are all supported. The older .doc binary format is not — open it in Word and re-save as .docx first.',
      },
      {
        question: 'How is the page size determined?',
        answer: 'The tool reads the page setup from the Word file (Letter, A4, custom). If your document uses unusual margins or orientation, those carry through to the PDF.',
      },
      {
        question: 'Can I convert a password-protected Word file?',
        answer: 'Encrypted .docx files must be unlocked first — Word will prompt you to remove the password before saving an unencrypted copy. The tool cannot decrypt files for you.',
      },
      {
        question: 'Is my document uploaded to a server?',
        answer: 'No. The conversion runs entirely in your browser using docx-parsing and PDF-rendering libraries. Your file never leaves your device.',
      },
    ],
    relatedTools: ['pdf-to-word', 'word-to-txt', 'markdown-to-pdf'],
    seoContent: {
      intro: "Word to PDF converts a .docx file into a PDF entirely in your browser. The text is extracted from the document's XML and re-rendered to A4 pages with Be Vietnam Pro (full Vietnamese coverage) at 11pt. Useful when you need a portable, read-only version of a draft and don't want to install Office or upload to a third-party converter.",
      examples: [
        {
          title: "Send a draft for review",
          body: "A PDF is the universal \"please don't edit this\" format. Convert your draft and attach to email — opens identically on every device.",
        },
        {
          title: "Archive a final document",
          body: "Word documents change with Office updates; PDFs render the same in five years. Convert finished documents for long-term storage.",
        },
        {
          title: "Embed in a website or LMS",
          body: "PDFs can be served as static files and rendered inline by browsers — easier to embed than a .docx that requires a download.",
        },
      ],
      useCases: [
        "Sharing read-only drafts with clients or colleagues",
        "Archiving finished documents in a stable, portable format",
        "Generating PDFs for inclusion in an e-commerce / SaaS app",
        "Producing print-ready output from a draft authored in Word",
        "Reducing edit conflicts — PDF is a one-way export from collaborative editing",
      ],
      troubleshooting: [
        {
          problem: "Formatting (tables, images) didn't carry over.",
          solution: "This tool extracts text and renders to clean PDF pages. Complex layouts (tables, embedded images, columns, headers/footers) are not preserved. Use the desktop Word \"Save As PDF\" for full fidelity.",
        },
        {
          problem: "Vietnamese / accented characters look wrong.",
          solution: "The bundled font (Be Vietnam Pro) supports full Vietnamese and most Latin scripts. If you see broken characters, the source document may have non-Unicode text — re-save the .docx in Word first.",
        },
        {
          problem: "PDF is very long compared to the Word doc.",
          solution: "The tool wraps text to A4 width at 11pt without honouring the original page breaks. For paginated output matching the Word layout, use desktop Word.",
        },
      ],
    },
    howToUse: [
      'Upload your Word document (.docx)',
      'Click "Convert to PDF" button',
      'Preview the PDF output',
      'Download the PDF file',
    ],
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    seoTitle: 'PDF to Word Converter – Convert PDF Online (Free Tool)',
    description: 'Convert PDF files to Word format (.docx). Extract text and create editable Word documents.',
    shortDescription: 'Convert PDF to Word online',
    category: 'office',
    slug: 'pdf-to-word',
    icon: 'FileText',
    keywords: ['pdf to word', 'pdf to docx', 'convert pdf', 'pdf editor'],
    tags: ['office', 'pdf', 'word', 'docx', 'convert', 'editor'],
    faq: [
      {
        question: 'Will the Word output match the PDF layout exactly?',
        answer: 'For text-heavy PDFs the layout closely matches the original. Multi-column pages, complex tables, footnotes, and PDFs created by scanning may need manual cleanup in Word after conversion.',
      },
      {
        question: 'Can I convert scanned PDFs (image-only)?',
        answer: 'Without OCR, scanned PDFs produce a Word document with images instead of editable text. Run the PDF through OCR first (or use a dedicated OCR tool) to make the text searchable and editable.',
      },
      {
        question: 'Are images, tables, and fonts preserved?',
        answer: 'Inline images and basic tables are preserved. Custom fonts fall back to the closest installed font on the reader\'s machine; embed common system fonts when creating the source PDF for best results.',
      },
      {
        question: 'Does this work for password-protected PDFs?',
        answer: 'No. Remove the password first using your PDF reader (File → Properties → Security) or a dedicated unlock tool, then convert the unlocked copy.',
      },
      {
        question: 'Is the conversion done locally?',
        answer: 'Yes. PDF parsing runs in your browser via pdfjs; the .docx is generated client-side. Nothing is uploaded, suitable for confidential documents.',
      },
    ],
    relatedTools: ['word-to-pdf', 'extract-text-pdf', 'pdf-to-excel'],
    seoContent: {
      intro: "PDF to Word extracts text from a PDF and produces a .docx file with one paragraph per source line. Conversion uses pdf.js entirely in the browser — your PDF never uploads to a server. Use it to pull editable text out of a finished PDF when you no longer have the source document, or to start a rewrite from existing content.",
      examples: [
        {
          title: "Pull text out of a report PDF",
          body: "Convert a 20-page report and edit the sections you need in Word — much faster than re-typing from a printed copy.",
        },
        {
          title: "Translate a PDF",
          body: "Extract text into Word, run through a translator (or hand to a translator), and lay out the translated version separately.",
        },
        {
          title: "Repurpose old content",
          body: "A PDF brochure or whitepaper becomes editable text — useful when migrating to a website or new template.",
        },
      ],
      useCases: [
        "Editing PDF content when the original Word source is lost",
        "Translating PDFs into other languages",
        "Repurposing static PDF content for the web or a new template",
        "Quoting passages from a PDF in another document",
        "Building searchable / accessible versions of scanned reports (text-only)",
      ],
      troubleshooting: [
        {
          problem: "Output is empty.",
          solution: "The PDF is image-based (a scan, not text). Run an OCR tool first (Adobe Acrobat OCR, Tesseract, or an online OCR) to extract text from the images, then convert.",
        },
        {
          problem: "Line breaks happen mid-sentence.",
          solution: "PDF text positioning sometimes splits sentences across \"lines\" that match the visual layout, not paragraphs. Manually clean up after pasting into Word.",
        },
        {
          problem: "Tables came out as plain text.",
          solution: "PDF tables are not structured — they're positioned rectangles of text. Use a dedicated PDF-to-Excel tool to get rows and columns, or rebuild tables manually in Word.",
        },
      ],
    },
    howToUse: [
      'Upload your PDF file',
      'Click "Convert to Word" button',
      'Preview the extracted content',
      'Download the .docx file',
    ],
  },
  {
    id: 'word-to-txt',
    name: 'Word to TXT Converter',
    seoTitle: 'Word to TXT Converter – Convert Word Online (Free Tool)',
    description: 'Extract text from Word documents (.docx) and save as plain text file.',
    shortDescription: 'Convert Word to TXT online',
    category: 'office',
    slug: 'word-to-txt',
    icon: 'FileText',
    keywords: ['word to txt', 'docx to txt', 'extract text word', 'word text'],
    tags: ['office', 'word', 'txt', 'docx', 'extract'],
    faq: [
      {
        question: 'Why convert Word to plain text?',
        answer: 'Plain text is universally readable, lightweight, and free of proprietary formatting — ideal for feeding documents into scripts, NLP pipelines, version control, or any system that does not need styling.',
      },
      {
        question: 'What formatting is lost?',
        answer: 'Everything visual: fonts, bold/italic, colors, headings, tables, images, page layout. Only the textual content is preserved in reading order.',
      },
      {
        question: 'Are images extracted alongside the text?',
        answer: 'No — this tool outputs text only. If you also need the images, use our Extract Images from Word tool in parallel.',
      },
      {
        question: 'How is the text ordered?',
        answer: 'Top-to-bottom, left-to-right reading order based on the document\'s logical flow. Multi-column layouts are linearized one column at a time.',
      },
      {
        question: 'What about headers, footers, and footnotes?',
        answer: 'Headers and footers are included once at the start/end. Footnotes are appended in order at the end of the document with their reference markers.',
      },
    ],
    relatedTools: ['word-to-pdf', 'extract-text-pdf', 'word-word-counter'],
    howToUse: [
      'Upload your Word document (.docx)',
      'Click "Extract Text" button',
      'View the extracted text',
      'Download as TXT file',
    ],
  },
  {
    id: 'merge-word',
    name: 'Merge Word Documents',
    seoTitle: 'Merge Word Documents – Free Online Tool',
    description: 'Combine multiple Word documents into one. Merge .docx files while preserving formatting.',
    shortDescription: 'Merge Word documents online',
    category: 'office',
    slug: 'merge-word',
    icon: 'Layers',
    keywords: ['merge word', 'combine docx', 'join documents', 'word merger'],
    tags: ['office', 'merge', 'word', 'combine', 'docx', 'join', 'documents'],
    faq: [
      {
        question: 'How many Word documents can I merge?',
        answer: 'Up to about 20 documents in one pass, depending on size. Documents are concatenated in the order you arrange them in the file list.',
      },
      {
        question: 'Will formatting from each document be kept?',
        answer: 'Yes — each document\'s styles, fonts, headings, and basic formatting carry over. If different documents use conflicting styles (e.g. same name, different definitions), the first document\'s styles take precedence.',
      },
      {
        question: 'Are page breaks inserted between documents?',
        answer: 'Yes by default — each merged document starts on a new page. Toggle "continuous" to flow them one into the next without forced breaks.',
      },
      {
        question: 'Can I merge documents from different sources (Google Docs export, Pages export)?',
        answer: 'Yes, as long as they are all in .docx format. Older .doc files must be re-saved as .docx first.',
      },
      {
        question: 'What about headers, footers, and page numbers?',
        answer: 'The first document\'s headers/footers are kept; subsequent documents\' headers are dropped to avoid conflicts. Re-add unified page numbering in Word after merging if needed.',
      },
    ],
    relatedTools: ['word-to-pdf', 'split-word', 'extract-images-word'],
    howToUse: [
      'Upload multiple Word documents',
      'Arrange files in order',
      'Click "Merge Documents" button',
      'Download the combined Word file',
    ],
  },
  {
    id: 'split-word',
    name: 'Split Word Document',
    seoTitle: 'Split Word Document – Free Online Tool',
    description: 'Split a Word document into multiple files by pages or sections.',
    shortDescription: 'Split Word document online',
    category: 'office',
    slug: 'split-word',
    icon: 'Scissors',
    keywords: ['split word', 'divide docx', 'split document', 'word splitter'],
    tags: ['office', 'split', 'word', 'divide', 'docx', 'document', 'splitter'],
    faq: [
      {
        question: 'How can I split a Word document?',
        answer: 'Two modes: by page count (e.g. one file per 10 pages) or by heading (start a new file at every Heading 1). The tool gives you a ZIP archive containing all the split pieces.',
      },
      {
        question: 'Will the formatting be preserved in each split file?',
        answer: 'Yes — each output is a valid .docx with the same styles, fonts, and theme as the original. Inline images and tables stay attached to the section they belonged to.',
      },
      {
        question: 'Can I name the split files?',
        answer: 'Yes — pick a prefix (e.g. "chapter") and the tool numbers them sequentially: `chapter-1.docx`, `chapter-2.docx`, etc. When splitting by headings, the heading text is used as the filename.',
      },
      {
        question: 'What happens to headers and footers?',
        answer: 'Each split inherits the original document\'s header/footer. Page numbers restart from 1 in each file — useful if you want each part to stand alone.',
      },
      {
        question: 'Why split a document instead of just deleting pages?',
        answer: 'Splitting preserves the original, produces multiple shareable files at once, and is automated for large documents. Manual deletion in Word is fine for one-off edits but slow for batches.',
      },
    ],
    relatedTools: ['merge-word', 'word-to-pdf', 'extract-text-pdf'],
    howToUse: [
      'Upload your Word document',
      'Choose split method (by pages or sections)',
      'Click "Split Document" button',
      'Download the split files',
    ],
  },
  {
    id: 'word-word-counter',
    name: 'Word Document Word Counter',
    seoTitle: 'Word Document Word Counter – Count Word Online (Free Tool)',
    description: 'Count words, characters, and paragraphs in Word documents (.docx). Analyze document statistics.',
    shortDescription: 'Count words in Word document',
    category: 'office',
    slug: 'word-word-counter',
    icon: 'FileText',
    keywords: ['word counter', 'docx word count', 'document counter', 'word document'],
    tags: ['office', 'word', 'counter', 'docx', 'count', 'document'],
    faq: [
      {
        question: 'What statistics does the tool show?',
        answer: 'Word count, character count (with and without spaces), paragraph count, sentence count, and estimated reading time (assuming 200 words per minute).',
      },
      {
        question: 'How is "word" defined?',
        answer: 'Any whitespace-separated token. Numbers and hyphenated terms count as one word. URLs and email addresses are also counted as single words.',
      },
      {
        question: 'Are headers, footers, and footnotes included?',
        answer: 'By default yes — they contribute to the document\'s total. Toggle the option to count only body text if your academic or publishing target excludes them.',
      },
      {
        question: 'How accurate is the reading time estimate?',
        answer: 'Based on the average adult silent reading speed of 200–250 wpm. For technical or dense material, real reading time can be 2–3× longer. Use it as a rough indicator.',
      },
      {
        question: 'Is the file uploaded anywhere?',
        answer: 'No. The document is parsed entirely in your browser. Word counts, character counts, and reading times never leave your device.',
      },
    ],
    relatedTools: ['word-counter', 'character-counter', 'word-to-pdf'],
    howToUse: [
      'Upload your Word document (.docx)',
      'View word, character, and paragraph counts',
      'See reading time estimate',
      'Copy statistics to clipboard',
    ],
  },
  {
    id: 'extract-images-word',
    name: 'Extract Images from Word',
    seoTitle: 'Extract Images from Word – Free Online Tool',
    description: 'Extract all images from Word documents (.docx). Download embedded pictures from your documents.',
    shortDescription: 'Extract images from Word document',
    category: 'office',
    slug: 'extract-images-word',
    icon: 'Image',
    keywords: ['extract images', 'word images', 'docx images', 'document images'],
    tags: ['office', 'extract', 'images', 'word', 'docx', 'document'],
    faq: [
      {
        question: 'How does image extraction work?',
        answer: '.docx files are ZIP archives internally. The tool reads the embedded `word/media/` folder and pulls out every image found there, preserving its original format (PNG, JPG, GIF, etc.).',
      },
      {
        question: 'Will I get all images in their original quality?',
        answer: 'Yes — extraction is lossless because the images are simply read from the archive, not re-encoded. Each image keeps its original resolution and format.',
      },
      {
        question: 'How are extracted images named?',
        answer: 'Images use the names from inside the Word document (often `image1.png`, `image2.jpeg`, etc.). The tool packages everything into a ZIP for batch download.',
      },
      {
        question: 'What if my document has hundreds of images?',
        answer: 'No problem — extraction is fast and the output ZIP is created on the fly. Very large documents may take a few seconds to process in the browser.',
      },
      {
        question: 'Will I also get inline icons and chart images?',
        answer: 'Yes for inline pictures. Auto-generated charts and SmartArt are stored as XML rather than raster images, so they will not appear as separate files — only their fallback PNG renditions (if any).',
      },
    ],
    relatedTools: ['extract-images-pdf', 'extract-images-ppt', 'word-to-pdf'],
    howToUse: [
      'Upload your Word document (.docx)',
      'Click "Extract Images"',
      'Preview extracted images',
      'Download individual or all images',
    ],
  },

  // PDF Tools
  {
    id: 'pdf-page-counter',
    name: 'PDF Page Counter',
    seoTitle: 'PDF Page Counter – Count PDF Online (Free Tool)',
    description: 'Count pages in PDF files instantly. Get detailed PDF information including page count and file size.',
    shortDescription: 'Count PDF pages online',
    category: 'office',
    slug: 'pdf-page-counter',
    icon: 'FileText',
    keywords: ['pdf page count', 'count pdf pages', 'pdf info', 'pdf pages'],
    tags: ['office', 'pdf', 'page', 'count', 'pages', 'info'],
    faq: [
      {
        question: 'How does the page counter work?',
        answer: 'The tool reads the PDF\'s internal structure and counts the page objects. The result appears within a second, even for large files, because no rendering is needed.',
      },
      {
        question: 'What else does the tool show besides the page count?',
        answer: 'File size, PDF version, page dimensions (Letter, A4, custom), creation and modification dates, author and producer metadata, and whether the PDF is encrypted.',
      },
      {
        question: 'Can it count pages in an encrypted PDF?',
        answer: 'Only metadata that does not require decryption (page count, file size, basic info). Author/title and other metadata behind the password are hidden until you unlock the file.',
      },
      {
        question: 'Is the file uploaded for processing?',
        answer: 'No — counting and metadata extraction happen entirely in your browser. Your PDF never leaves your device, so it is safe for confidential documents.',
      },
      {
        question: 'Why does my reader show a different count?',
        answer: 'Some readers include a cover/banner thumbnail as "page 0" or split spread pages. The internal PDF page count is the authoritative number — what most tools (printers, page-based pricing) actually use.',
      },
    ],
    relatedTools: ['merge-pdf', 'split-pdf', 'extract-text-pdf'],
    howToUse: [
      'Upload your PDF file',
      'View page count and file info',
      'See document dimensions',
      'Copy information to clipboard',
    ],
  },
  {
    id: 'extract-text-pdf',
    name: 'Extract Text from PDF',
    seoTitle: 'Extract Text from PDF – Free Online Tool',
    description: 'Extract text content from PDF files. Copy text from PDF documents easily without any software.',
    shortDescription: 'Extract text from PDF online',
    category: 'office',
    slug: 'extract-text-pdf',
    icon: 'FileText',
    keywords: ['extract text pdf', 'pdf to text', 'copy pdf text', 'pdf text extractor'],
    tags: ['office', 'extract', 'pdf', 'copy', 'extractor'],
    faq: [
      {
        question: 'Will this work on scanned (image-only) PDFs?',
        answer: 'No — without OCR, scanned PDFs contain no extractable text, just images. Run the PDF through an OCR tool first to make the text machine-readable.',
      },
      {
        question: 'Is the reading order preserved?',
        answer: 'Generally yes for single-column documents. Multi-column layouts, tables, and complex page templates may produce out-of-order text that needs cleanup.',
      },
      {
        question: 'Can I extract text from a specific page range?',
        answer: 'Yes — specify the page range (e.g. "5-15" or "1,3,7") and the tool extracts only those pages. Useful when you only need a chapter or appendix.',
      },
      {
        question: 'Are footnotes, headers, and footers included?',
        answer: 'Yes by default — everything visible in the page flow is extracted. Toggle filtering options to skip page numbers, running headers, or recurring footer text.',
      },
      {
        question: 'Is my PDF uploaded?',
        answer: 'No. The extraction uses pdfjs in your browser. Confidential PDFs (contracts, internal reports) stay on your device.',
      },
    ],
    relatedTools: ['extract-images-pdf', 'pdf-to-word', 'pdf-to-excel'],
    howToUse: [
      'Upload your PDF file',
      'Click "Extract Text"',
      'View and copy extracted text',
      'Download as TXT file',
    ],
  },
  {
    id: 'extract-images-pdf',
    name: 'Extract Images from PDF',
    seoTitle: 'Extract Images from PDF – Free Online Tool',
    description: 'Extract all images from PDF files. Download embedded images from PDF documents.',
    shortDescription: 'Extract images from PDF online',
    category: 'office',
    slug: 'extract-images-pdf',
    icon: 'Image',
    keywords: ['extract images pdf', 'pdf images', 'pdf image extractor', 'extract from pdf'],
    tags: ['office', 'extract', 'images', 'pdf', 'image', 'extractor'],
    faq: [
      {
        question: 'What images get extracted?',
        answer: 'All raster images embedded in the PDF — photos, screenshots, logos, diagrams stored as bitmaps. Vector graphics (lines, shapes drawn with PDF primitives) are not raster images and are not extracted.',
      },
      {
        question: 'Will the extracted images keep their original quality?',
        answer: 'Yes. Images are pulled directly from the PDF\'s internal stream in their stored format (usually JPEG or PNG) — no re-encoding, no loss of quality.',
      },
      {
        question: 'How are images named?',
        answer: 'Sequentially: `image-1.jpg`, `image-2.png`, etc., based on the order they appear in the document. The tool delivers all images bundled in a single ZIP for easy download.',
      },
      {
        question: 'Why is one image split into multiple pieces?',
        answer: 'Some PDFs (especially scanned ones) tile a single visual into several internal images for compression. You may need to recombine them in an image editor.',
      },
      {
        question: 'Can I extract from a specific page only?',
        answer: 'Yes — set a page range to extract only from those pages. Useful when you want the figures from a specific chapter or section.',
      },
    ],
    relatedTools: ['extract-text-pdf', 'extract-images-word', 'pdf-to-ppt'],
    howToUse: [
      'Upload your PDF file',
      'Click "Extract Images"',
      'Preview extracted images',
      'Download individual or all images',
    ],
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel Converter',
    seoTitle: 'PDF to Excel Converter – Convert PDF Online (Free Tool)',
    description: 'Convert PDF tables to Excel format (.xlsx). Extract tabular data from PDF files.',
    shortDescription: 'Convert PDF to Excel online',
    category: 'office',
    slug: 'pdf-to-excel',
    icon: 'FileSpreadsheet',
    keywords: ['pdf to excel', 'pdf to xlsx', 'extract table pdf', 'pdf converter'],
    tags: ['office', 'pdf', 'excel', 'xlsx', 'extract', 'table', 'converter'],
    faq: [
      {
        question: 'What kinds of PDF tables can be converted?',
        answer: 'Clean tabular PDFs (financial reports, exported spreadsheets, structured invoices) convert well. Complex tables with merged cells, multi-line headers, or borderless layouts often need manual cleanup in Excel.',
      },
      {
        question: 'Can it detect tables automatically?',
        answer: 'The tool detects table-like structures based on text alignment and spacing. If automatic detection misses something, you can manually mark the rows/columns to capture.',
      },
      {
        question: 'Will scanned PDFs work?',
        answer: 'No — without OCR, the tool cannot recognize text in scanned images. Run OCR first to make the table cells readable, then convert.',
      },
      {
        question: 'How are numbers and dates handled?',
        answer: 'The tool infers numeric and date cells so Excel treats them with the correct type. For ambiguous columns (e.g. account numbers with leading zeros), mark them as text to preserve the formatting.',
      },
      {
        question: 'Can I extract tables from specific pages only?',
        answer: 'Yes — specify a page range so the tool ignores irrelevant content (cover pages, narrative sections) and focuses only on the pages with the tables you want.',
      },
    ],
    relatedTools: ['pdf-to-csv', 'extract-text-pdf', 'csv-to-excel'],
    howToUse: [
      'Upload your PDF file',
      'Select pages with tables',
      'Click "Convert to Excel" button',
      'Download the .xlsx file',
    ],
  },
  {
    id: 'pdf-to-csv',
    name: 'PDF to CSV Converter',
    seoTitle: 'PDF to CSV Converter – Convert PDF Online (Free Tool)',
    description: 'Convert PDF tables to CSV format. Extract tabular data from PDF files as CSV.',
    shortDescription: 'Convert PDF to CSV online',
    category: 'office',
    slug: 'pdf-to-csv',
    icon: 'FileSpreadsheet',
    keywords: ['pdf to csv', 'extract table pdf', 'pdf table', 'pdf converter'],
    tags: ['office', 'pdf', 'csv', 'extract', 'table', 'converter'],
    faq: [
      {
        question: 'When should I use PDF to CSV vs PDF to Excel?',
        answer: 'CSV when you need plain text for scripts, databases, or import into any tool. Excel (.xlsx) when you want formatting, multiple sheets, or formula support out of the box.',
      },
      {
        question: 'What delimiter is used in the output?',
        answer: 'Comma by default. You can switch to tab, semicolon, or pipe for compatibility with regional Excel versions or downstream tools that prefer non-comma separators.',
      },
      {
        question: 'How are cells with commas inside them handled?',
        answer: 'They are wrapped in double quotes per RFC 4180. Internal quotes are doubled. The output is always valid CSV that round-trips through standard parsers.',
      },
      {
        question: 'Will scanned PDFs work?',
        answer: 'No — without OCR, image-only PDFs have no extractable text. Pass them through OCR first.',
      },
      {
        question: 'Can I extract multiple tables into one CSV?',
        answer: 'Yes — all detected tables in the page range are concatenated. To keep them separate, run the tool once per page or use Excel output which gives one sheet per table.',
      },
    ],
    relatedTools: ['csv-to-json', 'pdf-to-excel', 'extract-text-pdf'],
    howToUse: [
      'Upload your PDF file',
      'Select pages with tables',
      'Click "Convert to CSV" button',
      'Download the CSV file',
    ],
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint Converter',
    seoTitle: 'PDF to PowerPoint Converter – Convert PDF Online (Free Tool)',
    description: 'Convert PDF pages to PowerPoint slides. Create presentations from PDF documents.',
    shortDescription: 'Convert PDF to PPT online',
    category: 'office',
    slug: 'pdf-to-ppt',
    icon: 'Presentation',
    keywords: ['pdf to ppt', 'pdf to powerpoint', 'convert pdf', 'pdf slides'],
    tags: ['office', 'pdf', 'ppt', 'powerpoint', 'convert', 'slides'],
    faq: [
      {
        question: 'How does PDF to PowerPoint conversion work?',
        answer: 'Each PDF page becomes one PowerPoint slide. Text, images, and basic layout are placed onto the slide so it visually matches the original page.',
      },
      {
        question: 'Will text be editable in PowerPoint?',
        answer: 'For PDFs with real text, yes — each text block becomes an editable text box in PowerPoint. For scanned/image-only PDFs, the slide will contain an image of the page instead.',
      },
      {
        question: 'Are the slide dimensions standard?',
        answer: 'The tool maps to a 16:9 widescreen slide by default. For PDFs with unusual aspect ratios (A4 portrait, US Letter), choose the matching slide size to avoid letterboxing.',
      },
      {
        question: 'Will hyperlinks in the PDF carry over?',
        answer: 'Most clickable hyperlinks transfer to the slide and remain functional. Form fields, annotations, and embedded media usually do not carry over.',
      },
      {
        question: 'What about complex layouts with overlapping elements?',
        answer: 'Visually they should match. To restructure for presentation use (one bullet per line, larger fonts, etc.), expect manual editing in PowerPoint after conversion.',
      },
    ],
    relatedTools: ['ppt-to-pdf', 'extract-text-pdf', 'extract-images-pdf'],
    howToUse: [
      'Upload your PDF file',
      'Click "Convert to PPT" button',
      'Preview the slides',
      'Download the .pptx file',
    ],
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF Files',
    seoTitle: 'Merge PDF Files – Free Online Tool',
    description: 'Combine multiple PDF files into one. Merge PDFs quickly and easily in your browser.',
    shortDescription: 'Merge PDF files online',
    category: 'office',
    slug: 'merge-pdf',
    icon: 'Layers',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger'],
    tags: ['office', 'merge', 'pdf', 'combine', 'join', 'merger'],
    faq: [
      {
        question: 'How many PDFs can I merge at once?',
        answer: 'Up to 20+ files in one operation depending on size. Total memory matters more than file count — combining a few large PDFs may be slower than many small ones.',
      },
      {
        question: 'Will bookmarks, links, and form fields be preserved?',
        answer: 'Internal links and bookmarks from each PDF are kept and re-targeted to the merged document\'s page numbers. Form fields are preserved but may need re-naming to avoid conflicts.',
      },
      {
        question: 'Can I reorder PDFs before merging?',
        answer: 'Yes — drag the files in the upload list to set their order. The first file in the list becomes the cover of the merged PDF.',
      },
      {
        question: 'Will the merged PDF be larger than the sum of inputs?',
        answer: 'Usually slightly smaller because duplicate fonts and resources are deduplicated. Encrypted source PDFs need to be unlocked first; they cannot be merged directly.',
      },
      {
        question: 'Is my data uploaded anywhere?',
        answer: 'No. PDF parsing and assembly use pdf-lib in your browser. Files are never transmitted, suitable for confidential contracts or legal documents.',
      },
    ],
    relatedTools: ['split-pdf', 'pdf-page-counter', 'markdown-to-pdf'],
    howToUse: [
      'Upload multiple PDF files',
      'Arrange files in order',
      'Click "Merge PDFs" button',
      'Download the combined PDF',
    ],
  },
  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    seoTitle: 'Split PDF Pages – Free Online Tool',
    description: 'Split a PDF file into multiple files. Extract specific pages or split by page ranges.',
    shortDescription: 'Split PDF pages online',
    category: 'office',
    slug: 'split-pdf',
    icon: 'Scissors',
    keywords: ['split pdf', 'divide pdf', 'extract pages pdf', 'pdf splitter'],
    tags: ['office', 'split', 'pdf', 'divide', 'extract', 'pages', 'splitter'],
    faq: [
      {
        question: 'What split modes are available?',
        answer: 'By page range (e.g. "1-5, 8, 12-20" creates 3 output files), by every N pages (auto-split into N-page chunks), or extract specific single pages.',
      },
      {
        question: 'Will the output files preserve everything from the original?',
        answer: 'Yes — bookmarks for the extracted pages, links targeting included pages, fonts, and images all carry across. Metadata (title, author) is duplicated to each output file.',
      },
      {
        question: 'Can I extract a single page only?',
        answer: 'Yes — enter just the page number (e.g. "7") to get a single-page PDF. Useful for sharing a specific receipt, certificate, or appendix without sending the whole document.',
      },
      {
        question: 'How are output files named?',
        answer: 'Sequentially with a prefix and the page range: `myfile-1-5.pdf`, `myfile-6-10.pdf`. All output files are delivered together in a ZIP for easy download.',
      },
      {
        question: 'Is splitting reversible?',
        answer: 'Yes — use our Merge PDF tool to recombine the split files. As long as they came from the same source PDF, the round trip produces an equivalent document.',
      },
    ],
    relatedTools: ['merge-pdf', 'pdf-page-counter', 'extract-text-pdf'],
    howToUse: [
      'Upload your PDF file',
      'Select pages or enter page ranges',
      'Click "Split PDF" button',
      'Download the split files',
    ],
  },

  // PowerPoint Tools
  {
    id: 'ppt-slide-counter',
    name: 'PowerPoint Slide Counter',
    seoTitle: 'PowerPoint Slide Counter – Count PowerPoint Online (Free Tool)',
    description: 'Count slides in PowerPoint files (.pptx). Get detailed presentation information instantly.',
    shortDescription: 'Count PPT slides online',
    category: 'office',
    slug: 'ppt-slide-counter',
    icon: 'Presentation',
    keywords: ['ppt slide count', 'powerpoint slides', 'count slides', 'pptx info'],
    tags: ['office', 'ppt', 'slide', 'count', 'powerpoint', 'slides', 'pptx'],
    faq: [
      {
        question: 'How does the slide counter work?',
        answer: 'PPTX files are ZIP archives — the tool counts the slide XML files inside without rendering anything, so results appear within a second.',
      },
      {
        question: 'What other metadata does it show?',
        answer: 'Slide count, file size, slide dimensions (16:9, 4:3, custom), embedded font list, image count, author and title metadata, and creation/modification timestamps.',
      },
      {
        question: 'Does it count hidden slides?',
        answer: 'Yes — hidden slides are still present in the file. The tool can show total vs visible slide counts separately so you know how many will actually appear in presentation mode.',
      },
      {
        question: 'Can it count slides in the older .ppt format?',
        answer: 'Only the modern .pptx format (PowerPoint 2007+). Convert older .ppt files to .pptx in PowerPoint first by saving them as the new format.',
      },
      {
        question: 'Is my presentation uploaded?',
        answer: 'No. The file is read and analyzed in your browser; nothing is transmitted. Safe for confidential client decks and internal slide reviews.',
      },
    ],
    relatedTools: ['merge-ppt', 'split-ppt', 'ppt-to-pdf'],
    howToUse: [
      'Upload your PowerPoint file (.pptx)',
      'View slide count and info',
      'See presentation details',
      'Copy information to clipboard',
    ],
  },
  {
    id: 'extract-text-ppt',
    name: 'Extract Text from PowerPoint',
    seoTitle: 'Extract Text from PowerPoint – Free Online Tool',
    description: 'Extract all text content from PowerPoint presentations (.pptx). Copy text from slides easily.',
    shortDescription: 'Extract text from PPT online',
    category: 'office',
    slug: 'extract-text-ppt',
    icon: 'FileText',
    keywords: ['extract text ppt', 'powerpoint text', 'ppt text', 'pptx text extractor'],
    tags: ['office', 'extract', 'ppt', 'powerpoint', 'pptx', 'extractor'],
    faq: [
      {
        question: 'What text gets extracted from a slide?',
        answer: 'Title text, body bullet points, text in shapes and text boxes, table cells, and speaker notes. Slide numbers and decorative elements are skipped.',
      },
      {
        question: 'Are speaker notes included?',
        answer: 'Yes — they are appended after each slide\'s body text, labeled as notes. Toggle the option if you only want the slide-visible text.',
      },
      {
        question: 'How is text from multiple slides organized?',
        answer: 'Each slide is prefaced with "Slide N:" followed by its content. This makes it easy to grep, search, or paste into another document while preserving structure.',
      },
      {
        question: 'Can I extract from a specific slide range?',
        answer: 'Yes — enter a range like "1-10" or "5,7,12" to extract only those slides. Useful for harvesting content from a specific section.',
      },
      {
        question: 'What about text inside images or charts?',
        answer: 'Image text is not OCR\'d; charts emit their data labels but not the chart itself. For text in images, run OCR on the image first.',
      },
    ],
    relatedTools: ['extract-images-ppt', 'ppt-to-images', 'ppt-to-pdf'],
    howToUse: [
      'Upload your PowerPoint file (.pptx)',
      'Click "Extract Text"',
      'View text from all slides',
      'Download as TXT file',
    ],
  },
  {
    id: 'extract-images-ppt',
    name: 'Extract Images from PowerPoint',
    seoTitle: 'Extract Images from PowerPoint – Free Online Tool',
    description: 'Extract all images from PowerPoint presentations (.pptx). Download slide images easily.',
    shortDescription: 'Extract images from PPT online',
    category: 'office',
    slug: 'extract-images-ppt',
    icon: 'Image',
    keywords: ['extract images ppt', 'powerpoint images', 'ppt images', 'pptx image extractor'],
    tags: ['office', 'extract', 'images', 'ppt', 'powerpoint', 'pptx', 'image'],
    faq: [
      {
        question: 'What types of images get extracted?',
        answer: 'Raster pictures and screenshots embedded in slides (PNG, JPG, GIF, etc.). Shapes drawn with PowerPoint primitives and SmartArt are not raster images and are not extracted as files.',
      },
      {
        question: 'Will images keep their original quality?',
        answer: 'Yes — extraction is lossless. The tool reads images from the pptx archive in their original encoded form without re-encoding.',
      },
      {
        question: 'How is this different from PPT to Images?',
        answer: 'This tool extracts the individual embedded images (logos, photos) used INSIDE slides. PPT to Images renders each entire slide as a single image. Pick based on whether you want the source pictures or full slide visuals.',
      },
      {
        question: 'Are slide backgrounds extracted?',
        answer: 'Yes if they were inserted as picture fills. Solid-color and gradient backgrounds are not images, so they are not extracted.',
      },
      {
        question: 'How are extracted images named?',
        answer: 'Sequentially as `image-1.png`, `image-2.jpg`, etc., based on order of appearance in the file. All images are bundled into a single ZIP for download.',
      },
    ],
    relatedTools: ['extract-text-ppt', 'ppt-to-images', 'extract-images-pdf'],
    howToUse: [
      'Upload your PowerPoint file (.pptx)',
      'Click "Extract Images"',
      'Preview extracted images',
      'Download individual or all images',
    ],
  },
  {
    id: 'ppt-to-images',
    name: 'PPT to Images Converter',
    seoTitle: 'PPT to Images Converter – Convert PPT Online (Free Tool)',
    description: 'Convert PowerPoint slides to images. Export each slide as PNG or JPG image.',
    shortDescription: 'Convert PPT to images online',
    category: 'office',
    slug: 'ppt-to-images',
    icon: 'Image',
    keywords: ['ppt to images', 'powerpoint to images', 'slides to png', 'ppt converter'],
    tags: ['office', 'ppt', 'images', 'powerpoint', 'slides', 'png', 'converter'],
    faq: [
      {
        question: 'What does PPT to Images do?',
        answer: 'It renders each slide of your presentation as a separate image file (PNG or JPG). Each slide becomes one image of the entire visible page.',
      },
      {
        question: 'PNG vs JPG — which should I choose?',
        answer: 'PNG for crisp text and graphics (lossless), larger files. JPG for photo-heavy slides (lossy, smaller). For sharing on the web or embedding in docs, PNG is the safer default.',
      },
      {
        question: 'What resolution will the images be?',
        answer: 'By default the tool exports at 1920×1080 (16:9) or matching slide dimensions. You can choose Low (1280px), Standard (1920px), or High (3840px) for retina displays.',
      },
      {
        question: 'How is this different from Extract Images from PPT?',
        answer: 'Extract Images pulls out the source pictures embedded in slides (logos, photos). PPT to Images renders the visible slide itself as one image. Different use cases.',
      },
      {
        question: 'Will animations and transitions be captured?',
        answer: 'No — only the static end state of each slide is rendered. Animation steps and transition effects need a screen-recording tool to capture.',
      },
    ],
    relatedTools: ['video-to-images', 'extract-images-ppt', 'ppt-to-pdf'],
    howToUse: [
      'Upload your PowerPoint file (.pptx)',
      'Select output format (PNG/JPG)',
      'Click "Convert to Images" button',
      'Download images as ZIP',
    ],
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF Converter',
    seoTitle: 'PPT to PDF Converter – Convert PPT Online (Free Tool)',
    description: 'Convert PowerPoint presentations to PDF format. Create PDF files from PPT slides.',
    shortDescription: 'Convert PPT to PDF online',
    category: 'office',
    slug: 'ppt-to-pdf',
    icon: 'FileText',
    keywords: ['ppt to pdf', 'powerpoint to pdf', 'convert ppt', 'pptx to pdf'],
    tags: ['office', 'ppt', 'pdf', 'powerpoint', 'convert', 'pptx'],
    faq: [
      {
        question: 'Why convert PowerPoint to PDF?',
        answer: 'PDFs preserve the exact visual layout regardless of fonts installed, are universally readable without PowerPoint, and are easier to share via email or embed in websites.',
      },
      {
        question: 'Will fonts be embedded in the PDF?',
        answer: 'Yes — common fonts are embedded so the PDF renders identically on any device. For unusual fonts, the tool falls back to the closest standard font. Embed your fonts in PowerPoint before exporting for best results.',
      },
      {
        question: 'Are animations and transitions preserved?',
        answer: 'No — PDF is a static format so animations are flattened to their end state. Each slide becomes one PDF page.',
      },
      {
        question: 'What page size does the PDF use?',
        answer: 'The PDF page matches your slide dimensions: 16:9 widescreen becomes ~10×5.6 inches, 4:3 becomes 10×7.5 inches. Custom slide sizes are honored.',
      },
      {
        question: 'Can I include speaker notes?',
        answer: 'Yes — toggle "Include speaker notes" to add notes below each slide on the PDF page, or use notes-only mode for a printable handout.',
      },
    ],
    relatedTools: ['pdf-to-ppt', 'ppt-slide-counter', 'merge-ppt'],
    howToUse: [
      'Upload your PowerPoint file (.pptx)',
      'Click "Convert to PDF" button',
      'Preview the PDF output',
      'Download the PDF file',
    ],
  },
  {
    id: 'merge-ppt',
    name: 'Merge PowerPoint Files',
    seoTitle: 'Merge PowerPoint Files – Free Online Tool',
    description: 'Combine multiple PowerPoint presentations into one. Merge slides from different PPT files.',
    shortDescription: 'Merge PPT files online',
    category: 'office',
    slug: 'merge-ppt',
    icon: 'Layers',
    keywords: ['merge ppt', 'combine powerpoint', 'join ppt', 'ppt merger'],
    tags: ['office', 'merge', 'ppt', 'combine', 'powerpoint', 'join', 'merger'],
    faq: [
      {
        question: 'How many PowerPoint files can I merge?',
        answer: 'Up to about 20 files in one operation. Files are concatenated in the order shown — drag the file list to reorder before merging.',
      },
      {
        question: 'Will themes and master slides be preserved?',
        answer: 'The first file\'s theme and slide masters are kept as the base. Slides from subsequent files retain their content but adopt the base theme. For mixed-theme decks, expect some manual cleanup.',
      },
      {
        question: 'What about images, fonts, and embedded media?',
        answer: 'All preserved — images carry across at original quality, fonts are embedded, and video/audio links remain functional as long as the source files are accessible.',
      },
      {
        question: 'Can I add a divider slide between merged decks?',
        answer: 'Toggle "insert section divider" to add a blank or titled slide between each merged file. Useful for keeping content from different sources visually separated.',
      },
      {
        question: 'Is the merge done locally?',
        answer: 'Yes — parsing and assembly happen in your browser via pptx-parsing libraries. Your presentations never leave your device.',
      },
    ],
    relatedTools: ['split-ppt', 'ppt-slide-counter', 'ppt-to-pdf'],
    howToUse: [
      'Upload multiple PowerPoint files',
      'Arrange presentations in order',
      'Click "Merge PPTs" button',
      'Download the combined PPT file',
    ],
  },
  {
    id: 'split-ppt',
    name: 'Split PowerPoint Slides',
    seoTitle: 'Split PowerPoint Slides – Free Online Tool',
    description: 'Split a PowerPoint presentation into multiple files. Extract specific slides or ranges.',
    shortDescription: 'Split PPT slides online',
    category: 'office',
    slug: 'split-ppt',
    icon: 'Scissors',
    keywords: ['split ppt', 'divide powerpoint', 'extract slides', 'ppt splitter'],
    tags: ['office', 'split', 'ppt', 'divide', 'powerpoint', 'extract', 'slides'],
    faq: [
      {
        question: 'How can I split a PowerPoint file?',
        answer: 'Three modes: by slide range (e.g. "1-10, 12, 15-20"), by every N slides (auto-chunk), or by section breaks in the deck. The output is a ZIP of separate .pptx files.',
      },
      {
        question: 'Will each split keep the original theme?',
        answer: 'Yes — every output file inherits the source deck\'s slide masters, themes, fonts, and layouts. Each is a fully self-contained presentation ready to open.',
      },
      {
        question: 'Can I extract a single slide?',
        answer: 'Yes — enter just the slide number to get a one-slide .pptx. Useful for sharing a specific chart or excerpt without sending the whole deck.',
      },
      {
        question: 'Are embedded images and media preserved?',
        answer: 'Yes — each split file carries the images, audio, and video used on its slides. Hyperlinks targeting included slides remain functional; links to slides in other split files become unresolved.',
      },
      {
        question: 'How are output files named?',
        answer: 'Sequentially with the original filename + slide range: `mydeck-1-10.pptx`, `mydeck-11-20.pptx`. The ZIP wrapper makes downloading all of them a single click.',
      },
    ],
    relatedTools: ['merge-ppt', 'ppt-slide-counter', 'ppt-to-images'],
    howToUse: [
      'Upload your PowerPoint file',
      'Select slides or ranges to extract',
      'Click "Split PPT" button',
      'Download the split files',
    ],
  },
  // ==================== VIDEO TOOLS ====================
  {
    id: 'video-to-gif',
    name: 'Video to GIF Converter',
    seoTitle: 'Video to GIF Converter – Convert Video Online (Free Tool)',
    description: 'Convert video files to animated GIF images. Create high-quality GIFs from MP4, WebM, and other video formats with customizable frame rate and size.',
    shortDescription: 'Convert video to animated GIF',
    category: 'video',
    slug: 'video-to-gif',
    icon: 'Film',
    keywords: ['video to gif', 'convert to gif', 'mp4 to gif', 'animated gif', 'gif maker', 'video gif converter'],
    tags: ['video', 'gif', 'convert', 'mp4', 'animated', 'maker', 'converter'],
    faq: [
      {
        question: 'How do I convert a video to GIF?',
        answer: 'Simply upload your video file, adjust the frame rate and size settings if needed, and click "Convert to GIF". The tool processes everything in your browser.',
      },
      {
        question: 'What video formats are supported?',
        answer: 'We support MP4, WebM, MOV, AVI, MKV, and most common video formats.',
      },
      {
        question: 'Why is my GIF file so large?',
        answer: 'GIFs are inherently larger than video formats because they store each frame as an image. To reduce size, lower the frame rate, reduce dimensions, or trim the video to a shorter clip before converting.',
      },
      {
        question: 'Can I control the GIF animation speed?',
        answer: 'Yes, you can adjust the frame rate during conversion. Lower frame rates create slower, smoother animations while higher rates make faster GIFs.',
      },
      {
        question: 'Is there a limit on video length for conversion?',
        answer: 'For best results, we recommend converting videos under 30 seconds. Longer videos create very large GIF files that may be slow to load.',
      },
    ],
    relatedTools: ['gif-maker', 'compress-video', 'video-to-images'],
    howToUse: [
      'Upload your video file (max 100MB)',
      'Set the output GIF dimensions and frame rate',
      'Click "Convert to GIF" to start processing',
      'Download the generated GIF file',
    ],
  },
  {
    id: 'compress-video',
    name: 'Compress Video',
    seoTitle: 'Compress Video – Free Online Tool',
    description: 'Reduce video file size while maintaining quality. Compress large video files for easier sharing and faster uploads.',
    shortDescription: 'Reduce video file size',
    category: 'video',
    slug: 'compress-video',
    icon: 'Minimize2',
    keywords: ['compress video', 'reduce video size', 'video compressor', 'shrink video', 'video optimization'],
    tags: ['video', 'compress', 'reduce', 'size', 'compressor', 'shrink', 'optimization'],
    faq: [
      {
        question: 'Will compressing the video affect quality?',
        answer: 'Our compression algorithm balances file size reduction with quality preservation. You can adjust compression settings to find your preferred balance.',
      },
      {
        question: 'How much can I reduce the file size?',
        answer: 'Compression results vary, but you can typically reduce file size by 50-80% while maintaining acceptable quality.',
      },
      {
        question: 'What video formats can be compressed?',
        answer: 'We support compressing MP4, WebM, MOV, AVI, MKV, and most other common video formats.',
      },
      {
        question: 'Does compression work on 4K videos?',
        answer: 'Yes, 4K videos can be compressed. In fact, higher resolution videos often see the most significant size reduction while maintaining good quality.',
      },
      {
        question: 'Is the compression processed on my device?',
        answer: 'Yes, video compression happens entirely in your browser. Your files are never uploaded to any server, ensuring privacy and security.',
      },
    ],
    relatedTools: ['video-to-gif', 'resize-video', 'trim-video'],
    howToUse: [
      'Upload your video file',
      'Select compression quality level',
      'Click "Compress Video" to process',
      'Download the compressed video',
    ],
  },
  {
    id: 'mp4-to-mp3',
    name: 'MP4 to MP3 Converter',
    seoTitle: 'MP4 to MP3 Converter – Convert MP4 Online (Free Tool)',
    description: 'Extract audio from MP4 videos and convert to MP3 format. High-quality audio extraction for music, podcasts, and more.',
    shortDescription: 'Extract audio as MP3 from MP4',
    category: 'video',
    slug: 'mp4-to-mp3',
    icon: 'Music',
    keywords: ['mp4 to mp3', 'extract audio', 'video to mp3', 'audio converter', 'mp3 extractor'],
    tags: ['video', 'mp4', 'mp3', 'extract', 'audio', 'converter', 'extractor'],
    faq: [
      {
        question: 'Is the audio quality preserved?',
        answer: 'Yes, we use high-quality encoding to preserve audio quality during the conversion process.',
      },
      {
        question: 'Can I convert other video formats to MP3?',
        answer: 'Yes, besides MP4, you can also extract audio from WebM, MOV, AVI, MKV, and other video formats.',
      },
      {
        question: 'What audio quality options are available?',
        answer: 'You can choose from different bitrates ranging from 128kbps to 320kbps. Higher bitrates provide better quality but larger file sizes.',
      },
      {
        question: 'How long does the conversion take?',
        answer: 'Conversion time depends on video length and file size. Most conversions complete within seconds to a few minutes.',
      },
      {
        question: 'Will the converted MP3 work on all devices?',
        answer: 'Yes, MP3 is a universal audio format supported by virtually all devices, media players, and platforms.',
      },
    ],
    relatedTools: ['extract-audio', 'video-to-gif', 'compress-video'],
    howToUse: [
      'Upload your MP4 video file',
      'Select audio quality settings',
      'Click "Convert to MP3"',
      'Download the MP3 audio file',
    ],
  },
  {
    id: 'trim-video',
    name: 'Trim Video',
    seoTitle: 'Trim Video – Free Online Tool',
    description: 'Cut video clips by setting start and end points. Remove unwanted parts from your videos quickly and easily.',
    shortDescription: 'Cut video clips',
    category: 'video',
    slug: 'trim-video',
    icon: 'Scissors',
    keywords: ['trim video', 'cut video', 'clip video', 'video cutter', 'trimmer'],
    tags: ['video', 'trimmer', 'trim', 'cut', 'clip', 'cutter'],
    faq: [
      {
        question: 'Does trimming affect video quality?',
        answer: 'No, trimming uses lossless cutting when possible, so the quality of the remaining clip is preserved.',
      },
      {
        question: 'Can I set precise start and end times?',
        answer: 'Yes, you can enter exact timestamps (hours:minutes:seconds) or use the visual timeline to select your trim points.',
      },
      {
        question: 'What video formats can I trim?',
        answer: 'You can trim MP4, WebM, MOV, AVI, MKV, and most other common video formats.',
      },
      {
        question: 'Can I trim multiple sections from one video?',
        answer: 'For extracting multiple clips, use our Split Video tool which allows you to create several segments at once.',
      },
      {
        question: 'Is there a limit on video length?',
        answer: 'You can trim videos of any length. The tool processes files locally in your browser for optimal performance.',
      },
    ],
    relatedTools: ['split-video', 'crop-video', 'compress-video'],
    howToUse: [
      'Upload your video file',
      'Set the start and end time for your clip',
      'Preview the selection',
      'Click "Trim Video" and download',
    ],
  },
  {
    id: 'crop-video',
    name: 'Crop Video',
    seoTitle: 'Crop Video – Free Online Tool',
    description: 'Crop video dimensions to remove unwanted areas. Change aspect ratio or focus on specific parts of the video.',
    shortDescription: 'Crop video dimensions',
    category: 'video',
    slug: 'crop-video',
    icon: 'Crop',
    keywords: ['crop video', 'video cropping', 'aspect ratio', 'video dimensions', 'crop tool'],
    tags: ['video', 'crop', 'cropping', 'aspect', 'ratio', 'dimensions'],
    faq: [
      {
        question: 'Can I set custom crop dimensions?',
        answer: 'Yes, you can set custom width, height, and position values for precise cropping.',
      },
      {
        question: 'What aspect ratios are available?',
        answer: 'Common presets include 16:9, 4:3, 1:1 (square), and 9:16 (vertical). You can also set fully custom dimensions.',
      },
      {
        question: 'Will cropping reduce video quality?',
        answer: 'Cropping only removes portions of the frame. The remaining video quality is preserved at the original resolution.',
      },
      {
        question: 'Can I preview the crop before applying?',
        answer: 'Yes, you can see a real-time preview of the cropped area before finalizing the changes.',
      },
      {
        question: 'Is cropping the same as resizing?',
        answer: 'No. Cropping removes parts of the video frame, while resizing scales the entire video to different dimensions. They are different operations.',
      },
    ],
    relatedTools: ['trim-video', 'resize-video', 'rotate-video'],
    howToUse: [
      'Upload your video file',
      'Set crop dimensions (width, height, X, Y)',
      'Preview the cropped area',
      'Click "Crop Video" and download',
    ],
  },
  {
    id: 'resize-video',
    name: 'Resize Video',
    seoTitle: 'Resize Video – Free Online Tool',
    description: 'Change video resolution to any size. Scale videos up or down while maintaining aspect ratio.',
    shortDescription: 'Change video resolution',
    category: 'video',
    slug: 'resize-video',
    icon: 'Maximize2',
    keywords: ['resize video', 'video resolution', 'scale video', 'change video size', 'video scaler'],
    tags: ['video', 'resize', 'resolution', 'scale', 'change', 'size', 'scaler'],
    faq: [
      {
        question: 'Will resizing affect video quality?',
        answer: 'Downscaling generally preserves quality well. Upscaling may result in some quality loss depending on the original resolution.',
      },
      {
        question: 'What is aspect ratio lock?',
        answer: 'When enabled, aspect ratio lock automatically adjusts the height when you change the width (or vice versa) to maintain the original proportions and prevent distortion.',
      },
      {
        question: 'What resolutions are commonly used?',
        answer: 'Common resolutions include 1920x1080 (Full HD), 1280x720 (HD), 3840x2160 (4K), and 640x480 (SD). Social platforms often have specific recommended sizes.',
      },
      {
        question: 'Can I make the video larger?',
        answer: 'Yes, you can upscale videos, but quality may decrease as the video is stretched beyond its original resolution.',
      },
      {
        question: 'How is resizing different from cropping?',
        answer: 'Resizing scales the entire video to new dimensions, while cropping cuts off portions of the frame. Both maintain the original content but achieve different results.',
      },
    ],
    relatedTools: ['crop-video', 'compress-video', 'rotate-video'],
    howToUse: [
      'Upload your video file',
      'Enter new width and/or height',
      'Choose to maintain aspect ratio or not',
      'Click "Resize Video" and download',
    ],
  },
  {
    id: 'merge-videos',
    name: 'Merge Videos',
    seoTitle: 'Merge Videos – Free Online Tool',
    description: 'Combine multiple video files into one. Join and concatenate videos seamlessly in your browser.',
    shortDescription: 'Combine multiple videos',
    category: 'video',
    slug: 'merge-videos',
    icon: 'Layers',
    keywords: ['merge videos', 'combine videos', 'join videos', 'concatenate videos', 'video joiner'],
    tags: ['video', 'merge', 'videos', 'combine', 'join', 'concatenate', 'joiner'],
    faq: [
      {
        question: 'Can I merge videos of different formats?',
        answer: 'Yes, you can merge videos of different formats. They will be converted to a common format during the process.',
      },
      {
        question: 'Is there a limit on how many videos I can merge?',
        answer: 'You can merge up to 10 video files in one session. The total combined file size should be within reasonable limits for browser processing.',
      },
      {
        question: 'Will the merged video have consistent quality?',
        answer: 'The output quality is determined by the lowest quality input video. For best results, use videos with similar resolutions and quality.',
      },
      {
        question: 'Can I reorder videos before merging?',
        answer: 'Yes, you can drag and drop to rearrange the order of videos before starting the merge process.',
      },
      {
        question: 'What happens if my videos have different frame rates?',
        answer: 'Videos with different frame rates will be harmonized during merging. The tool selects an appropriate output frame rate for smooth playback.',
      },
    ],
    relatedTools: ['split-video', 'add-text-to-video', 'add-watermark-to-video'],
    howToUse: [
      'Upload multiple video files',
      'Arrange them in the desired order',
      'Click "Merge Videos"',
      'Download the combined video',
    ],
  },
  {
    id: 'rotate-video',
    name: 'Rotate Video',
    seoTitle: 'Rotate Video – Free Online Tool',
    description: 'Rotate videos by 90, 180, or 270 degrees. Fix sideways or upside-down videos instantly.',
    shortDescription: 'Rotate video 90/180/270 degrees',
    category: 'video',
    slug: 'rotate-video',
    icon: 'RotateCw',
    keywords: ['rotate video', 'flip video', 'video rotation', 'turn video', 'rotate mp4'],
    tags: ['video', 'rotate', 'flip', 'rotation', 'turn', 'mp4'],
    faq: [
      {
        question: 'Will rotation affect video quality?',
        answer: 'No, rotation is a lossless operation that preserves the original video quality.',
      },
      {
        question: 'What rotation angles are available?',
        answer: 'You can rotate videos by 90 degrees clockwise, 180 degrees (upside down), or 270 degrees clockwise (equivalent to 90 degrees counter-clockwise).',
      },
      {
        question: 'Can I also flip the video?',
        answer: 'This tool focuses on rotation. For flipping (mirroring), you would need to combine rotation with other editing operations.',
      },
      {
        question: 'Will rotation change the file size?',
        answer: 'Rotation itself does not significantly change file size. The video dimensions swap (width becomes height and vice versa) but quality remains the same.',
      },
      {
        question: 'Why does my video need rotation?',
        answer: 'Videos recorded on mobile devices are sometimes stored in landscape but tagged with rotation metadata. Our tool physically rotates the video for better compatibility.',
      },
    ],
    relatedTools: ['flip-image-horizontal', 'crop-video', 'resize-video'],
    howToUse: [
      'Upload your video file',
      'Select rotation angle (90, 180, or 270 degrees)',
      'Preview the rotated video',
      'Click "Rotate Video" and download',
    ],
  },
  {
    id: 'change-video-speed',
    name: 'Change Video Speed',
    seoTitle: 'Change Video Speed – Free Online Tool',
    description: 'Speed up or slow down videos. Create slow-motion or time-lapse effects easily.',
    shortDescription: 'Speed up or slow down video',
    category: 'video',
    slug: 'change-video-speed',
    icon: 'Gauge',
    keywords: ['video speed', 'slow motion', 'time lapse', 'speed up video', 'slow down video'],
    tags: ['video', 'speed', 'slow', 'motion', 'time', 'lapse', 'down'],
    faq: [
      {
        question: 'What speed range is supported?',
        answer: 'You can set speed from 0.25x (quarter speed, slow motion) up to 8x (eight times faster, time-lapse). Use the preset buttons or the custom slider for any value in between.',
      },
      {
        question: 'Will changing speed affect audio?',
        answer: 'Yes. Audio is re-timed along with video using the atempo filter to keep it natural. For extreme speeds outside 0.5–2x, multiple atempo passes are chained automatically so the pitch stays believable.',
      },
      {
        question: 'Does slowing down a video make it smoother?',
        answer: 'Slow motion does not add new frames — it just plays existing frames longer, which can look choppy on low-framerate sources. For smoother slow-mo, start with a high-framerate (60fps+) original.',
      },
      {
        question: 'How is output duration calculated?',
        answer: 'New duration equals original duration divided by the speed multiplier. For example, a 10-second clip at 2x becomes 5 seconds; at 0.5x it becomes 20 seconds.',
      },
      {
        question: 'Is video quality preserved when changing speed?',
        answer: 'Yes. The video is re-encoded with H.264 at high quality so frame-level detail is preserved. Only the playback timing changes.',
      },
    ],
    relatedTools: ['reverse-video', 'loop-video', 'trim-video'],
    howToUse: [
      'Upload your video file',
      'Select speed multiplier (0.25x to 4x)',
      'Preview the speed change',
      'Click "Change Speed" and download',
    ],
  },
  {
    id: 'extract-audio',
    name: 'Extract Audio from Video',
    seoTitle: 'Extract Audio from Video – Free Online Tool',
    description: 'Extract audio track from video files. Save audio in various formats including MP3, AAC, and WAV.',
    shortDescription: 'Extract audio track from video',
    category: 'video',
    slug: 'extract-audio',
    icon: 'Volume2',
    keywords: ['extract audio', 'video to audio', 'audio extractor', 'rip audio', 'video audio'],
    tags: ['video', 'extract', 'audio', 'extractor', 'rip'],
    faq: [
      {
        question: 'What audio formats can I extract?',
        answer: 'You can extract audio in MP3, AAC, WAV, OGG, FLAC, and other popular formats. MP3 is the most universally compatible; WAV/FLAC are lossless if quality matters more than size.',
      },
      {
        question: 'Is the extracted audio quality preserved?',
        answer: 'When you extract to a lossless format like WAV or FLAC, the audio matches the source bit-for-bit. MP3 and AAC re-encode with a target bitrate, which is good enough for most listening but loses a tiny amount of fidelity.',
      },
      {
        question: 'Which video formats can I extract audio from?',
        answer: 'MP4, WebM, MOV, AVI, MKV, FLV, 3GP and most other common video containers are supported. The tool reads whichever audio track is embedded inside.',
      },
      {
        question: 'Can I extract just a portion of the audio?',
        answer: 'This tool extracts the full audio track. To grab only a clip, trim the video first with the Trim Video tool, then extract audio from the trimmed file.',
      },
      {
        question: 'Does this work for videos with no audio track?',
        answer: 'No — if the source video has no embedded audio, there is nothing to extract and the tool will return an error. You can verify by playing the video locally with sound enabled.',
      },
    ],
    relatedTools: ['mp4-to-mp3', 'mute-video', 'video-to-images'],
    howToUse: [
      'Upload your video file',
      'Select output audio format',
      'Click "Extract Audio"',
      'Download the audio file',
    ],
  },
  {
    id: 'mute-video',
    name: 'Mute Video',
    seoTitle: 'Mute Video – Free Online Tool',
    description: 'Remove audio from video files. Create silent videos by stripping the audio track.',
    shortDescription: 'Remove audio from video',
    category: 'video',
    slug: 'mute-video',
    icon: 'VolumeX',
    keywords: ['mute video', 'remove audio', 'silent video', 'strip audio', 'video without sound'],
    tags: ['video', 'mute', 'remove', 'audio', 'silent', 'strip', 'without'],
    faq: [
      {
        question: 'Is the video quality affected?',
        answer: 'No. Muting only strips the audio track; the video stream is copied over unchanged, so there is zero quality loss and processing is nearly instant.',
      },
      {
        question: 'Why would I want to mute a video?',
        answer: 'Common reasons: remove copyrighted background music before sharing, get rid of unwanted background noise, prepare clean footage to overlay your own voiceover, or comply with social platform rules that require silent ads.',
      },
      {
        question: 'Will the file size decrease after muting?',
        answer: 'Yes, slightly. The audio track usually accounts for 5–15% of total file size, so the muted output is a few percent smaller.',
      },
      {
        question: 'What video formats are supported?',
        answer: 'MP4, WebM, MOV, AVI, MKV and most other common containers. The output keeps the same format as the input by default.',
      },
      {
        question: 'Can I add a new audio track after muting?',
        answer: 'Not directly with this tool, but the muted video can be paired with new audio in any video editor. We have separate tools for extracting audio you might want to layer back in.',
      },
    ],
    relatedTools: ['extract-audio', 'mp4-to-mp3', 'video-to-gif'],
    howToUse: [
      'Upload your video file',
      'Click "Mute Video" to remove audio',
      'Preview the silent video',
      'Download the muted video',
    ],
  },
  {
    id: 'video-to-images',
    name: 'Video to Images',
    seoTitle: 'Video to Images – Free Online Tool',
    description: 'Extract frames from video as images. Save video frames as PNG or JPG at custom intervals.',
    shortDescription: 'Extract frames as images',
    category: 'video',
    slug: 'video-to-images',
    icon: 'Image',
    keywords: ['video to images', 'extract frames', 'video frames', 'video screenshots', 'frame capture'],
    tags: ['video', 'images', 'extract', 'frames', 'screenshots', 'frame', 'capture'],
    faq: [
      {
        question: 'How many frames can I extract?',
        answer: 'You can extract frames at fixed intervals (e.g. every 1 second, every 10 frames) or every single frame. For a 30-second 30fps clip, "every frame" yields 900 images — be mindful of total size.',
      },
      {
        question: 'What image format are the frames saved in?',
        answer: 'You can choose PNG (lossless, larger files, supports transparency) or JPG (smaller, slightly lossy, no transparency). PNG is best for further editing; JPG is best for sharing.',
      },
      {
        question: 'How are frames packaged for download?',
        answer: 'All extracted frames are bundled into a single ZIP archive named after the source video. Filenames include the frame index or timestamp so you can re-sort them later.',
      },
      {
        question: 'Does extraction quality match the original?',
        answer: 'Yes when using PNG — frames are decoded directly from the source. JPG output uses a high quality setting (~90) so visible loss is minimal.',
      },
      {
        question: 'Can I extract a specific time range?',
        answer: 'This tool extracts from the whole video. For a sub-range, trim the video first, then run frame extraction on the trimmed file.',
      },
    ],
    relatedTools: ['video-thumbnail', 'video-frame-extractor', 'video-screenshot'],
    howToUse: [
      'Upload your video file',
      'Set frame extraction interval',
      'Click "Extract Frames"',
      'Download images as ZIP',
    ],
  },
  {
    id: 'reverse-video',
    name: 'Reverse Video',
    seoTitle: 'Reverse Video – Free Online Tool',
    description: 'Play video backwards. Create creative reverse video effects for social media and fun projects.',
    shortDescription: 'Play video backwards',
    category: 'video',
    slug: 'reverse-video',
    icon: 'Rewind',
    keywords: ['reverse video', 'backwards video', 'video reverse', 'rewind video', 'reverse effect'],
    tags: ['video', 'reverse', 'backwards', 'rewind', 'effect'],
    faq: [
      {
        question: 'Will reversing affect audio too?',
        answer: 'Yes — both video and audio are played backwards by default. Reversed speech sounds garbled, so for social-media reverse effects most people prefer to mute the audio first.',
      },
      {
        question: 'Does reversing reduce video quality?',
        answer: 'No. The reverse filter re-encodes at high quality, so the output is visually indistinguishable from the source when played frame by frame.',
      },
      {
        question: 'How long should the input clip be?',
        answer: 'Reversing requires loading the entire clip into memory, so keep it under ~30 seconds for the smoothest experience. Longer clips will work but may slow the browser down.',
      },
      {
        question: 'Is reversing the same as playing video backwards in a player?',
        answer: 'No. A player that scrubs backwards re-decodes frames on the fly. Our tool produces a new video file that plays in normal order on any device — perfect for sharing on TikTok, Reels, or YouTube.',
      },
      {
        question: 'Can I reverse just part of a video?',
        answer: 'Trim the clip to the section you want first, then reverse it. To get a "forward then backward" boomerang effect, also use Merge Videos to splice the original and the reversed copy.',
      },
    ],
    relatedTools: ['change-video-speed', 'loop-video', 'trim-video'],
    howToUse: [
      'Upload your video file',
      'Click "Reverse Video"',
      'Preview the reversed video',
      'Download the result',
    ],
  },
  {
    id: 'loop-video',
    name: 'Loop Video',
    seoTitle: 'Loop Video – Free Online Tool',
    description: 'Repeat video multiple times. Create looping videos for GIFs, social media, or presentations.',
    shortDescription: 'Repeat video N times',
    category: 'video',
    slug: 'loop-video',
    icon: 'Repeat',
    keywords: ['loop video', 'repeat video', 'video loop', 'endless video', 'boomerang'],
    tags: ['video', 'boomerang', 'loop', 'repeat', 'endless'],
    faq: [
      {
        question: 'How many times can I loop a video?',
        answer: 'You can loop a video up to 10 times in a single pass. For longer loops, run the tool twice on its own output (looping a 10x file gives 100x).',
      },
      {
        question: 'Will the output file size grow with each loop?',
        answer: 'Yes — output size is roughly N times the input, where N is the loop count. The video is concatenated, not just flagged to repeat.',
      },
      {
        question: 'Does the loop transition smoothly?',
        answer: 'The end of one iteration cuts directly to the start of the next. For a seamless loop, make sure the first and last frames of your source match closely, or use a clip that fades to black at both ends.',
      },
      {
        question: 'Why not use HTML video loop attribute instead?',
        answer: 'The HTML `<video loop>` attribute only loops during playback on web pages. Our tool produces a real file that loops natively on any device — useful for social posts, GIFs, or sending to non-web players.',
      },
      {
        question: 'Can I create a boomerang (forward + reverse) effect?',
        answer: 'Yes — first run Reverse Video on your clip, then use Merge Videos to combine the original followed by the reversed copy. Loop the result if you want it to repeat.',
      },
    ],
    relatedTools: ['reverse-video', 'change-video-speed', 'merge-videos'],
    howToUse: [
      'Upload your video file',
      'Set the number of loops (1-10)',
      'Click "Loop Video"',
      'Download the looped video',
    ],
  },
  {
    id: 'video-thumbnail',
    name: 'Video Thumbnail Extractor',
    seoTitle: 'Video Thumbnail Extractor – Free Online Tool',
    description: 'Get thumbnail images from video files. Extract a single frame as preview image for your videos.',
    shortDescription: 'Get thumbnail from video',
    category: 'video',
    slug: 'video-thumbnail',
    icon: 'Image',
    keywords: ['video thumbnail', 'thumbnail extractor', 'video preview', 'video snapshot', 'poster image'],
    tags: ['video', 'thumbnail', 'extractor', 'preview', 'snapshot', 'poster', 'image'],
    faq: [
      {
        question: 'Can I choose which frame to use as thumbnail?',
        answer: 'Yes — set any timestamp (e.g. 00:00:05.250) and the tool will grab the closest frame at that point. Some platforms like YouTube prefer a frame slightly into the video rather than the very first frame.',
      },
      {
        question: 'What image format does the thumbnail use?',
        answer: 'JPG is the default for small file size and broad compatibility. PNG is available when you need lossless quality or transparency-safe encoding.',
      },
      {
        question: 'What resolution will the thumbnail be?',
        answer: 'By default the thumbnail matches the video resolution exactly (e.g. 1920×1080 for Full HD). You can resize it afterwards with our Image Resizer if a platform requires a specific size.',
      },
      {
        question: 'How is this different from Video Screenshot?',
        answer: 'Both grab a still frame. Thumbnail Extractor is optimized for picking a single representative frame for use as a video poster; Video Screenshot is geared toward grabbing multiple frames at chosen points.',
      },
      {
        question: 'Why is the thumbnail blurry?',
        answer: 'Blurry thumbnails usually mean the source frame had motion blur or low resolution. Pick a different timestamp at a calmer moment, or use a higher-resolution source video.',
      },
    ],
    relatedTools: ['video-to-images', 'video-screenshot', 'add-text-to-video'],
    howToUse: [
      'Upload your video file',
      'Set the timestamp for thumbnail',
      'Click "Extract Thumbnail"',
      'Download the thumbnail image',
    ],
  },
  {
    id: 'split-video',
    name: 'Video Splitter',
    seoTitle: 'Video Splitter – Free Online Tool',
    description: 'Split video into multiple parts. Divide long videos into shorter segments easily.',
    shortDescription: 'Split video into parts',
    category: 'video',
    slug: 'split-video',
    icon: 'Split',
    keywords: ['split video', 'divide video', 'video splitter', 'cut video parts', 'segment video'],
    tags: ['video', 'split', 'divide', 'splitter', 'cut', 'parts', 'segment'],
    faq: [
      {
        question: 'Can I split at multiple points?',
        answer: 'Yes — enter as many timestamps as you need. The tool creates one output segment between each consecutive pair plus one for the trailing portion, packaged together as a ZIP.',
      },
      {
        question: 'Will splitting reduce quality?',
        answer: 'No. When the cut points align with keyframes, splitting is lossless (the streams are copied without re-encoding). For arbitrary cut points, the affected segment is re-encoded at high quality.',
      },
      {
        question: 'How do I split a video into equal-length parts?',
        answer: 'Enter evenly-spaced timestamps. For example, to split a 60-second video into three 20-second clips, enter 00:00:20 and 00:00:40 as your split points.',
      },
      {
        question: 'What is the difference between Trim and Split?',
        answer: 'Trim keeps a single contiguous range and discards the rest. Split keeps everything but breaks it into multiple files at the points you specify.',
      },
      {
        question: 'Can I rejoin split segments later?',
        answer: 'Yes — use the Merge Videos tool to concatenate them back. As long as the segments came from the same source video, the join is seamless.',
      },
    ],
    relatedTools: ['trim-video', 'merge-videos', 'crop-video'],
    howToUse: [
      'Upload your video file',
      'Set split points (timestamps)',
      'Click "Split Video"',
      'Download video parts as ZIP',
    ],
  },
  {
    id: 'add-text-to-video',
    name: 'Add Text to Video',
    seoTitle: 'Add Text to Video – Free Online Tool',
    description: 'Overlay text on video. Add titles, captions, watermarks, or subtitles to your videos.',
    shortDescription: 'Overlay text on video',
    category: 'video',
    slug: 'add-text-to-video',
    icon: 'Type',
    keywords: ['add text to video', 'video text', 'video captions', 'text overlay', 'video watermark'],
    tags: ['video', 'add', 'captions', 'overlay', 'watermark'],
    faq: [
      {
        question: 'Can I customize the text appearance?',
        answer: 'Yes — pick from 35+ fonts (sans, serif, display, monospace, handwriting), set any font size, choose any color, and drag the text anywhere on the video preview.',
      },
      {
        question: 'How do I position the text precisely?',
        answer: 'The preview shows the actual video with a draggable text overlay. Drag it to any spot, click somewhere on the video to drop it there, or use the 9 preset position buttons (top-left, top, top-right, … bottom-right).',
      },
      {
        question: 'Will the text appear for the whole video or just part of it?',
        answer: 'This tool overlays the text on every frame from start to end. For text that appears only during a section, trim the clip first, add text, then merge it back with the untrimmed parts.',
      },
      {
        question: 'Does the text support emoji and Vietnamese / accented characters?',
        answer: 'Latin characters and most accented letters render correctly with the default fonts. Emoji rendering depends on the chosen font; for full emoji support pick a font that ships with color emoji glyphs.',
      },
      {
        question: 'Why does my text look blurry on the output?',
        answer: 'The most common cause is too-small font size compared to video resolution. Increase font size for HD/4K videos. The preview shows the actual pixel size that will be rendered.',
      },
    ],
    relatedTools: ['add-watermark-to-video', 'video-thumbnail', 'merge-videos'],
    howToUse: [
      'Upload your video file',
      'Enter text and customize appearance',
      'Set text position on video',
      'Click "Add Text" and download',
    ],
  },
  {
    id: 'add-watermark-to-video',
    name: 'Add Watermark to Video',
    seoTitle: 'Add Watermark to Video – Free Online Tool',
    description: 'Add image watermark to video files. Protect your content with custom logo or branding.',
    shortDescription: 'Add image watermark to video',
    category: 'video',
    slug: 'add-watermark-to-video',
    icon: 'Stamp',
    keywords: ['watermark video', 'video watermark', 'logo overlay', 'brand video', 'protect video'],
    tags: ['video', 'watermark', 'logo', 'overlay', 'brand', 'protect'],
    faq: [
      {
        question: 'What image formats work for watermarks?',
        answer: 'PNG with transparency works best because the background of your logo stays see-through. JPG, GIF, WebP, and SVG are also supported, but solid-background images will show a visible rectangle around the logo.',
      },
      {
        question: 'How do I position the watermark?',
        answer: 'Drag the watermark anywhere on the live preview, click on the video to drop it at that point, or use one of the 9 preset position buttons. The exact percentage position is displayed live.',
      },
      {
        question: 'Can I control the watermark size and opacity?',
        answer: 'Yes. The scale slider sets the watermark width from 5% to 50% of the video width (height auto-scales to keep aspect ratio). The opacity slider goes from 10% (very subtle) to 100% (solid).',
      },
      {
        question: 'Will the watermark appear on every frame?',
        answer: 'Yes — the watermark is composited onto every frame for the entire duration. For watermarks that only show in part of the video, trim first, watermark, then merge with the un-watermarked sections.',
      },
      {
        question: 'Why use a watermark on my videos?',
        answer: 'Watermarks protect ownership, drive recognition of your brand, and discourage re-uploads. A subtle semi-transparent logo in a corner is effective without distracting from the content.',
      },
    ],
    relatedTools: ['add-text-to-video', 'video-thumbnail', 'merge-videos'],
    howToUse: [
      'Upload your video file',
      'Upload watermark image (PNG recommended)',
      'Set watermark position and opacity',
      'Click "Add Watermark" and download',
    ],
  },
  {
    id: 'convert-video',
    name: 'Convert Video Format',
    seoTitle: 'Convert Video Format – Free Online Tool',
    description: 'Convert videos between different formats. Support for MP4, WebM, AVI, MOV, and more.',
    shortDescription: 'Convert between video formats',
    category: 'video',
    slug: 'convert-video',
    icon: 'RefreshCw',
    keywords: ['convert video', 'video converter', 'format converter', 'mp4 converter', 'video format'],
    tags: ['video', 'convert', 'converter', 'format', 'mp4'],
    faq: [
      {
        question: 'What formats are supported?',
        answer: 'Input: MP4, WebM, AVI, MOV, MKV, FLV, 3GP, M4V and most other common containers. Output: MP4 (H.264/AAC), WebM (VP8/Vorbis), AVI (MPEG-4/MP3), and MOV (H.264/AAC).',
      },
      {
        question: 'Which output format should I choose?',
        answer: 'MP4 is the safest default — it plays everywhere. WebM is ideal for embedding on websites because of smaller files. AVI is mostly for legacy Windows software. MOV is preferred when sending footage to macOS/iOS editing tools.',
      },
      {
        question: 'Will converting reduce quality?',
        answer: 'Re-encoding always introduces some loss, but our default H.264 settings preserve visible quality well. For lossless workflows, prefer formats that match your source codec or use the Compress Video tool with a high-quality setting.',
      },
      {
        question: 'Why is WebM conversion slower than MP4?',
        answer: 'WebM uses VP8 which is heavier to encode in the browser than H.264. The trade-off is smaller files; for large clips, MP4 will finish faster.',
      },
      {
        question: 'Are subtitles or metadata preserved?',
        answer: 'Subtitle tracks and chapter metadata are not currently retained during conversion. Audio tracks are kept and re-encoded; video metadata like rotation is normalized.',
      },
    ],
    relatedTools: ['compress-video', 'video-to-gif', 'mp4-to-mp3'],
    howToUse: [
      'Upload your video file',
      'Select output format',
      'Click "Convert Video"',
      'Download the converted file',
    ],
  },
  {
    id: 'video-frame-extractor',
    name: 'Video Frame Extractor',
    seoTitle: 'Video Frame Extractor – Free Online Tool',
    description: 'Extract specific frames from video by frame number or timestamp. Get exact frames you need.',
    shortDescription: 'Extract specific frames',
    category: 'video',
    slug: 'video-frame-extractor',
    icon: 'Film',
    keywords: ['extract frames', 'video frames', 'frame grabber', 'specific frames', 'frame extractor'],
    tags: ['video', 'extract', 'frames', 'frame', 'grabber', 'specific', 'extractor'],
    faq: [
      {
        question: 'How do I know which frame number to extract?',
        answer: 'You can enter either a frame number or a timestamp. Frame number = timestamp × frame rate (e.g. 5 seconds × 30fps = frame 150). The tool shows the video duration and frame rate to help you calculate.',
      },
      {
        question: 'How is this different from Video to Images?',
        answer: 'Video to Images extracts frames at regular intervals (every Nth frame or every N seconds). Frame Extractor lets you pick exact individual frames you care about — useful for grabbing a specific moment.',
      },
      {
        question: 'Can I extract multiple specific frames at once?',
        answer: 'Yes — enter a comma-separated list of frame numbers or timestamps (e.g. "10, 50, 120" or "0:00:01, 0:00:05, 0:00:12"). All extracted frames are zipped together for download.',
      },
      {
        question: 'What output formats are available?',
        answer: 'PNG (lossless, larger) or JPG (smaller, slightly lossy). Pick PNG when you plan to edit the frame further; JPG when you just need to preview or share it.',
      },
      {
        question: 'Why are some frames identical when I extract sequential frames?',
        answer: 'Static scenes (no motion) produce visually identical frames. The content really is the same — the source video had no change between those frame numbers.',
      },
    ],
    relatedTools: ['video-to-images', 'video-screenshot', 'video-thumbnail'],
    howToUse: [
      'Upload your video file',
      'Enter frame number(s) or timestamp(s)',
      'Click "Extract Frames"',
      'Download the frame images',
    ],
  },
  {
    id: 'video-screenshot',
    name: 'Video Screenshot Capture',
    seoTitle: 'Video Screenshot Capture – Free Online Tool',
    description: 'Capture screenshots from videos at specific timestamps. Extract high-quality still images from any video.',
    shortDescription: 'Capture video screenshots',
    category: 'video',
    slug: 'video-screenshot',
    icon: 'Camera',
    keywords: ['video screenshot', 'capture frame', 'video capture', 'screenshot from video', 'video still'],
    tags: ['video', 'screenshot', 'capture', 'frame', 'still'],
    faq: [
      {
        question: 'How do I capture a screenshot from a video?',
        answer: 'Upload your video, navigate to the desired timestamp using the preview player or enter the time directly, then click "Capture Screenshot" to save the frame as an image.',
      },
      {
        question: 'What image format does the screenshot use?',
        answer: 'PNG by default for lossless quality. JPG is also available for smaller files. PNG keeps transparency where applicable; JPG offers better compression for photo-like content.',
      },
      {
        question: 'Can I capture multiple screenshots at once?',
        answer: 'This tool grabs a single frame per click. For batch capture at multiple timestamps, use Video Frame Extractor. For evenly-spaced captures, use Video to Images.',
      },
      {
        question: 'What resolution will the screenshot be?',
        answer: 'The screenshot matches the source video resolution exactly — no upscaling or downscaling. A 1080p video gives you 1920×1080 stills.',
      },
      {
        question: 'Why does my screenshot look pixelated?',
        answer: 'The source video has limited resolution, especially after compression by streaming platforms. A still frame can never look sharper than the underlying video frame.',
      },
      {
        question: 'How is this different from Video Thumbnail Extractor?',
        answer: 'Both grab one still. Screenshot is for ad-hoc captures during review or annotation; Thumbnail Extractor is geared toward producing a poster image for video listings.',
      },
    ],
    relatedTools: ['video-thumbnail', 'video-to-images', 'video-frame-extractor'],
    howToUse: [
      'Upload your video file',
      'Use the timeline to find the perfect moment',
      'Click "Capture Screenshot"',
      'Download the captured image',
    ],
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

// Words too generic to be useful as topical tags.
const TAG_STOPWORDS = new Set([
  'free', 'online', 'tool', 'tools', 'web', 'browser', 'instant',
  'fast', 'easy', 'simple', 'best', 'top', 'the', 'and', 'for',
]);

/**
 * Returns the effective tag set for a tool: explicit `tags` if provided,
 * otherwise derived from keywords + category slug. Always lowercase, deduped,
 * stopwords removed. Multi-word keywords are split so "format json" yields
 * ["format", "json"].
 */
export function getEffectiveTags(tool: Tool): string[] {
  if (tool.tags?.length) {
    return Array.from(new Set(tool.tags.map((t) => t.toLowerCase())));
  }
  const derived = new Set<string>();
  derived.add(tool.category);
  for (const kw of tool.keywords) {
    for (const part of kw.toLowerCase().split(/[\s/_-]+/)) {
      if (part.length >= 3 && !TAG_STOPWORDS.has(part)) derived.add(part);
    }
  }
  return [...derived];
}

/**
 * Returns related tools, in priority order:
 *  1. explicit `relatedTools` IDs (manual curation)
 *  2. shared (effective) tags
 *  3. same category
 * Capped at `limit` (default 6). Excludes the tool itself and duplicates.
 */
export function getRelatedTools(toolId: string, limit: number = 6): Tool[] {
  const tool = getToolById(toolId);
  if (!tool) return [];

  const picked: Tool[] = [];
  const pickedIds = new Set<string>([tool.id]);

  const push = (t?: Tool) => {
    if (!t || pickedIds.has(t.id) || picked.length >= limit) return;
    pickedIds.add(t.id);
    picked.push(t);
  };

  for (const id of tool.relatedTools || []) push(getToolById(id));
  if (picked.length >= limit) return picked;

  const myTags = new Set(getEffectiveTags(tool));
  // Explicit tags signal stronger relevance than keyword-derived ones.
  const myExplicit = new Set((tool.tags || []).map((t) => t.toLowerCase()));

  const scored = tools
    .filter((t) => t.id !== tool.id && !pickedIds.has(t.id))
    .map((t) => {
      const theirTags = getEffectiveTags(t);
      const theirExplicit = new Set((t.tags || []).map((x) => x.toLowerCase()));
      let score = 0;
      for (const tag of theirTags) {
        if (!myTags.has(tag)) continue;
        // Boost when BOTH sides curated the tag explicitly.
        score += myExplicit.has(tag) && theirExplicit.has(tag) ? 3 : 1;
      }
      if (t.category === tool.category) score += 1;
      return { t, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  for (const { t } of scored) push(t);
  return picked;
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.shortDescription.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}
