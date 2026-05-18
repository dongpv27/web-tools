// One-off script: inject `seoContent` blocks for ~27 high-traffic tools in
// src/lib/tools.ts. Idempotent — skips tools that already have seoContent.
// Run: `node scripts/enrich-seo-content.mjs`
import fs from 'node:fs';
import path from 'node:path';

const FILE = path.resolve('src/lib/tools.ts');

/** @typedef {{intro:string, examples:{title:string, body:string}[], useCases:string[], troubleshooting:{problem:string, solution:string}[]}} Seo */
/** @type {Record<string, Seo>} */
const DATA = {
  'json-validator': {
    intro:
      'JSON Validator parses your input against the strict JSON grammar (RFC 8259) and tells you exactly where the first syntax error is. Use it to confirm an API response is shaped the way you expect before parsing, or to debug hand-written config files that the runtime rejects with a vague message. Validation happens in the browser, so private payloads stay on your machine.',
    examples: [
      { title: 'Catch a missing comma', body: 'Input: {"a":1 "b":2}\nThe validator points to "b" and reports an unexpected string token where a comma was expected.' },
      { title: 'Detect a trailing comma', body: 'Input: {"items":[1, 2, 3,]}\nThe validator flags the trailing comma — valid in JavaScript object literals but illegal in JSON.' },
      { title: 'Verify before parsing', body: 'Paste an API response, validate, then copy with confidence into JSON.parse() in your code without runtime surprises.' },
    ],
    useCases: [
      'Debugging "Unexpected token" errors thrown by JSON.parse',
      'Validating config files (package.json, tsconfig.json) before commit',
      'Sanity-checking webhook payloads in production logs',
      'Pre-flight checking JSON fixtures used by automated tests',
      'Teaching JSON syntax — the error pointer makes the rule concrete',
    ],
    troubleshooting: [
      { problem: 'Validator says "Unexpected token \'" near a string.', solution: 'JSON requires double quotes around keys and string values. Replace single quotes with double quotes throughout the document.' },
      { problem: 'Says comments are not allowed.', solution: 'JSON does not support // or /* */ comments. Strip them or switch to JSON5/JSONC if your tooling supports it.' },
      { problem: 'Numbers like 1.0e500 marked invalid.', solution: 'JSON allows exponents but values must fit in IEEE 754 double precision (max ~1.8e308). Reduce magnitude or store as a string.' },
    ],
  },
  'json-to-yaml': {
    intro:
      'JSON to YAML converts a JSON document into the cleaner, more indent-driven YAML 1.2 syntax. YAML is the lingua franca of CI/CD pipelines (GitHub Actions, GitLab CI, Kubernetes manifests, Ansible playbooks), so converting JSON config into YAML is a common chore. The tool runs entirely client-side and preserves data types — strings, numbers, booleans, nulls, arrays, and nested objects all round-trip cleanly.',
    examples: [
      { title: 'Convert a package.json snippet', body: 'Input JSON with name, scripts, and dependencies becomes a flat YAML document with each key on its own line — easier to read in a diff.' },
      { title: 'Build a Kubernetes manifest from API output', body: 'Many cluster CLIs emit JSON. Convert to YAML to match the style used in the rest of your manifests folder.' },
      { title: 'Migrate config across formats', body: 'A tool that ships JSON config can be re-distributed as YAML for users who prefer it — no manual rewriting required.' },
    ],
    useCases: [
      'Authoring Kubernetes manifests, Helm values, or Ansible playbooks',
      'Translating GitHub Actions workflow JSON into the YAML schema',
      'Generating docker-compose files from JSON service definitions',
      'Storing application config in YAML for human editability while keeping JSON for runtime',
      'Converting tsconfig.json into a YAML representation for sharing in docs',
    ],
    troubleshooting: [
      { problem: 'Multi-line strings come out with weird escapes.', solution: 'YAML has several string styles. The converter picks safe defaults; for prose blocks, use the literal block scalar (|) and re-format after pasting.' },
      { problem: 'Boolean strings like "yes" or "no" got coerced.', solution: 'YAML 1.1 treats those as booleans. Quote them explicitly in the output if you need them to stay strings: "yes".' },
      { problem: 'Long numeric strings lost precision.', solution: 'Very large integers should be wrapped in quotes in the source JSON to stay as strings through both formats.' },
    ],
  },
  'yaml-to-json': {
    intro:
      'YAML to JSON converts a YAML 1.2 document into compact JSON. Most runtimes, browser APIs, and HTTP clients consume JSON natively, so converting a human-authored YAML file into JSON is the last step before shipping config into an app. The parser handles flow style, block style, anchors, and references — the conversion runs entirely in the browser, so secrets in your YAML never leave the page.',
    examples: [
      { title: 'Compile a GitHub Actions matrix', body: 'A YAML matrix becomes a JSON array of objects you can paste straight into a custom CI tool that accepts JSON config.' },
      { title: 'Convert a Helm values file', body: 'Output JSON values can be fed into systems that don\'t understand YAML, like a JSON-schema validator or a JS templating engine.' },
      { title: 'Inspect anchor expansion', body: 'YAML anchors and aliases are inlined in the JSON output, making it easy to see what the final merged document actually looks like.' },
    ],
    useCases: [
      'Feeding YAML config into JavaScript code that expects JSON',
      'Validating YAML against a JSON Schema',
      'Diffing two YAML files by converting both to canonical JSON',
      'Migrating from YAML to JSON for performance (no YAML parser at runtime)',
      'Pre-processing CI config before sending to a webhook or API',
    ],
    troubleshooting: [
      { problem: 'Conversion fails with "mapping values not allowed here".', solution: 'Most often indentation is mixed (tabs and spaces). YAML strictly forbids tabs for indentation — replace with consistent spaces.' },
      { problem: 'Strings like "on" or "off" became true/false.', solution: 'YAML 1.1 booleans include many synonyms. Quote string values that look like booleans: \'off\' becomes the string "off" in JSON.' },
      { problem: 'Dates came out as ISO strings instead of objects.', solution: 'JSON has no native date type. The converter serialises dates to ISO 8601 strings — parse with new Date(...) on the consuming side.' },
    ],
  },
  'base64-decode': {
    intro:
      'Base64 Decode converts a Base64-encoded string back to its original text or binary. Use it to inspect data inside JWTs, decode email headers, read MIME-encoded attachments, or recover text from a copy-pasted token. Decoding happens locally in your browser — sensitive payloads (auth tokens, API responses) are never transmitted to a server.',
    examples: [
      { title: 'Decode a JWT payload', body: 'Copy the middle segment of a JWT (between the two dots) and decode it to reveal the JSON claims — useful when debugging an auth bug.' },
      { title: 'Read a Data URL', body: 'Strip the "data:image/png;base64," prefix and decode the rest to inspect or save the raw bytes of an embedded image.' },
      { title: 'Reverse an HTTP Basic auth header', body: 'Decode the Base64 string after "Basic " to recover the username:password sent in an Authorization header (in your own dev env, of course).' },
    ],
    useCases: [
      'Inspecting JWT payloads while debugging authentication',
      'Recovering plain text from email "MIME-Word" encoded subjects',
      'Reading binary payloads pasted into a chat or log',
      'Verifying a Base64 string matches expected content during integration testing',
      'Reverse-engineering tokens embedded in URLs or HTML attributes',
    ],
    troubleshooting: [
      { problem: 'Decoded output looks like gibberish.', solution: 'The input is probably binary (image, PDF, compressed data). Plain-text decode is meaningless — save to a file with the right extension instead.' },
      { problem: 'Error: "Invalid character in Base64 string".', solution: 'The string may use Base64URL (- and _ instead of + and /). Toggle the URL-safe option, or manually replace - with + and _ with /.' },
      { problem: 'Decoded text shows  or weird characters for accents.', solution: 'The original was UTF-8 but is being read as Latin-1. Use a tool that decodes the bytes as UTF-8, or paste the result into a UTF-8-aware viewer.' },
    ],
  },
  'url-encode': {
    intro:
      'URL Encode converts text into percent-encoded form so it can be safely placed in a query string, path segment, or form body. The tool uses RFC 3986 reserved-character rules and encodes Unicode as UTF-8 then percent-encodes each byte — exactly what browsers, fetch(), and curl do. Encoding runs locally; no input is logged.',
    examples: [
      { title: 'Encode a search query', body: 'Input: "hello world & friends"\nOutput: "hello%20world%20%26%20friends" — safe to drop into ?q= without breaking the URL parser.' },
      { title: 'Build a redirect parameter', body: 'Encode a full URL (including its own query string) before embedding it as a value of ?redirect_uri= so the consumer can decode it cleanly.' },
      { title: 'Encode non-ASCII text', body: 'Input: "café"\nOutput: "caf%C3%A9" — UTF-8 bytes 0xC3 0xA9 percent-encoded.' },
    ],
    useCases: [
      'Building API request URLs from user input safely',
      'Constructing OAuth redirect_uri parameters without manual escaping',
      'Encoding form data to send as application/x-www-form-urlencoded',
      'Quoting filenames inside Content-Disposition headers',
      'Producing valid mailto:, sms:, and other URI scheme links',
    ],
    troubleshooting: [
      { problem: 'My + signs disappeared after decoding on the server.', solution: 'In form encoding, + means space. Use the "encode all" mode to percent-encode + as %2B if it must survive form parsing.' },
      { problem: 'Slashes got encoded but I wanted to keep the path intact.', solution: 'Use encodeURI semantics (encode only unsafe chars) instead of encodeURIComponent. The tool offers both modes — pick "encode component" for full encoding.' },
      { problem: 'Encoded text decodes to garbage on the other side.', solution: 'The receiver is probably decoding as Latin-1 or assuming a different charset. URLs should be UTF-8 — fix the receiver to use UTF-8 decoding.' },
    ],
  },
  'url-decode': {
    intro:
      'URL Decode reverses percent-encoding to recover the original text or URL. It is what you reach for when a query string looks like %20%E2%80%99 and you need to know what it actually means. Decoding happens entirely in the browser; the encoded value (which may contain sensitive tokens) never leaves your machine.',
    examples: [
      { title: 'Read an encoded query string', body: 'Input: "?q=react%20hooks%20%26%20context"\nOutput shows the literal query: q=react hooks & context.' },
      { title: 'Recover a redirect_uri', body: 'OAuth callbacks often embed a fully-encoded URL as a parameter; decoding it reveals where the user was originally headed.' },
      { title: 'Decode a UTF-8 sequence', body: 'Input: "%E4%BD%A0%E5%A5%BD"\nOutput: 你好 — the bytes were valid UTF-8 for "Hello" in Chinese.' },
    ],
    useCases: [
      'Reading parameters out of a log line that captured a full URL',
      'Debugging OAuth flows where state and redirect_uri are encoded',
      'Decoding emails that arrived via a URL-based unsubscribe link',
      'Inspecting analytics URLs with UTM tags that include spaces and pipes',
      'Reverse-engineering a deep-link to a mobile app',
    ],
    troubleshooting: [
      { problem: 'Spaces showed up as + signs in the output.', solution: 'Form-encoded data uses + for space. Toggle "decode + as space" so the result reads naturally.' },
      { problem: 'Error: "URI malformed".', solution: 'A lone % must be followed by two hex digits. Check for stray % characters in the input — they need to be %25 if they\'re literal.' },
      { problem: 'Decoded result still looks encoded.', solution: 'The input was double-encoded. Run decode twice (or until output stabilises) to fully recover the original.' },
    ],
  },
  'uuid-generator': {
    intro:
      'UUID Generator creates universally unique identifiers using the v4 algorithm (random) or v1 (time-based). UUIDs are 128 bits long with a 1-in-2^122 collision chance — safe to use as database primary keys, request IDs, idempotency tokens, or anything else that needs a globally unique handle. Generation uses the browser\'s crypto.getRandomValues so the output is cryptographically random.',
    examples: [
      { title: 'Generate a database primary key', body: 'Click Generate to get something like 7f3a8b2e-1c4d-4e9f-bb0a-9d8e7c6b5a4e — drop it into a CREATE statement or use as the value for a UUID column in PostgreSQL/MySQL.' },
      { title: 'Make a request ID for tracing', body: 'Generate a UUID, set it on the X-Request-Id header, and search for it in your logs to follow a single request through a distributed system.' },
      { title: 'Bulk-generate test fixtures', body: 'Generate dozens at once to seed users, orders, or any entity that needs unique IDs in a test database.' },
    ],
    useCases: [
      'Database primary keys (especially for distributed inserts)',
      'Idempotency keys for payment APIs (Stripe, PayPal)',
      'Correlation IDs for tracing requests across microservices',
      'Random session IDs and short-lived auth artefacts',
      'Filenames for uploaded files to avoid collisions',
    ],
    troubleshooting: [
      { problem: 'Two UUIDs in a row look similar.', solution: 'Coincidence — v4 UUIDs are random. Inspect them character by character; the structure (8-4-4-4-12 with version digit) is fixed but the rest is random.' },
      { problem: 'Need a shorter ID.', solution: 'UUIDs are 36 chars. For shorter unique IDs, look at NanoID or short-uuid — same uniqueness with a URL-friendly alphabet.' },
      { problem: 'My database stores UUIDs as bytes and queries fail.', solution: 'PostgreSQL has a uuid type; MySQL uses BINARY(16). Make sure the column type matches and conversion is consistent in your ORM.' },
    ],
  },
  'timestamp-converter': {
    intro:
      'Timestamp Converter switches a Unix epoch timestamp into a human-readable date and back. It supports seconds and milliseconds, local time and UTC, and the standard ISO 8601 format. Useful for debugging logs, building APIs that expose timestamps as numbers, or just converting a "1700000000" you saw in a database row into a real date.',
    examples: [
      { title: 'Decode a log line', body: 'Paste 1700000000 to learn it is 2023-11-14T22:13:20Z — instantly readable for incident review.' },
      { title: 'Convert a JavaScript milliseconds timestamp', body: 'Date.now() returns milliseconds. Paste 1700000000000 and the tool detects the millisecond scale and converts to the matching date.' },
      { title: 'Build a future date', body: 'Pick a future date in the picker and get back the Unix timestamp to use as expires_at, valid_until, or a TTL value.' },
    ],
    useCases: [
      'Inspecting created_at / updated_at columns stored as integers',
      'Decoding JWT exp / iat / nbf claims',
      'Setting expires-at values for cache entries or signed URLs',
      'Working with Linux cron logs or system journals',
      'Building API responses that need both numeric and ISO representations',
    ],
    troubleshooting: [
      { problem: 'Date came out 50+ years off.', solution: 'You probably mixed up seconds and milliseconds. Timestamps after year 2001 are about 1e9 in seconds and 1e12 in milliseconds — the tool auto-detects, but you can switch manually.' },
      { problem: 'Timezone seems wrong.', solution: 'The tool shows both UTC and your local zone. Pick the right one for the system you\'re debugging — servers usually log UTC, clients local.' },
      { problem: 'Negative timestamps confused.', solution: 'Negative epoch means before 1970-01-01. Most databases reject them; for historical dates, store as ISO strings instead.' },
    ],
  },
  'random-password-generator': {
    intro:
      'Random Password Generator builds cryptographically strong passwords using the browser\'s crypto.getRandomValues. Pick length, character classes (lowercase, uppercase, digits, symbols), and exclude ambiguous characters (O/0, l/1) — the generated password is unique to your session and never leaves the page. Strong, memorable, and ready to paste into your password manager.',
    examples: [
      { title: 'Generate a 16-character mixed password', body: 'With length 16 and all character classes enabled, you get something like Ks7#fQ2!nLp$8vXz — high entropy, hard to crack.' },
      { title: 'Build a pronounceable passphrase', body: 'Switch to passphrase mode and get 4-6 random dictionary words separated by hyphens — easier to type, still strong (~50 bits per 4 words).' },
      { title: 'Skip ambiguous characters', body: 'Toggle "exclude similar" and the generator avoids 0/O, 1/l/I, |/I — useful for passwords you may have to dictate or read off a screen.' },
    ],
    useCases: [
      'Creating unique passwords for every account in a password manager',
      'Generating service account / API credentials in CI scripts',
      'Producing one-time recovery codes for users',
      'Building default admin passwords for self-hosted installations',
      'Generating short PINs or tokens for verification flows',
    ],
    troubleshooting: [
      { problem: 'Site rejected my password as too long.', solution: 'Some legacy sites cap at 16-20 characters. Reduce length and ensure all required character classes are included.' },
      { problem: 'Symbols disallowed by the target system.', solution: 'Disable the symbols class and increase length to keep entropy high. A 24-char alphanumeric is stronger than a 12-char mixed-symbol password.' },
      { problem: 'How do I remember this?', solution: 'You don\'t — use a password manager (1Password, Bitwarden, KeePass). Memorise one strong master password and let the manager handle the rest.' },
    ],
  },
  'regex-tester': {
    intro:
      'Regex Tester evaluates a regular expression against sample text and shows every match with its capture groups, position, and length. Use it to author and debug regexes for validation, parsing, or search-and-replace before pasting them into your code. Matching uses the browser\'s RegExp engine so the behaviour exactly matches what your JavaScript runtime will see.',
    examples: [
      { title: 'Validate an email address', body: 'Pattern: ^[\\w.-]+@[\\w-]+\\.[\\w.-]+$\nTest against multiple email samples and see which match — useful for tuning the regex before shipping it.' },
      { title: 'Extract URLs from a paragraph', body: 'Pattern: https?:\\/\\/[\\w./?#=&%-]+\nThe tester highlights each match and its index — copy any single match with a click.' },
      { title: 'Replace with capture groups', body: 'Pattern: (\\w+)\\s(\\w+) → replacement $2, $1\nFlips first/last name pairs across the entire input — a quick way to verify a complex substitution.' },
    ],
    useCases: [
      'Authoring form validation patterns for email, phone, zip',
      'Building log-parsing regexes that extract timestamps and message bodies',
      'Designing search-and-replace patterns for code-editor refactors',
      'Verifying captured groups in API URL routing rules',
      'Teaching regex syntax — instant feedback makes anchors and quantifiers click',
    ],
    troubleshooting: [
      { problem: 'My regex matches in the tester but not in my code.', solution: 'Check the flags. The tester supports g, i, m, s, u — make sure your code uses the same flags. Also verify your code escapes backslashes correctly (\\\\d in a string literal).' },
      { problem: 'Pattern is "too greedy" and matches more than expected.', solution: 'Use a non-greedy quantifier (.*? instead of .*), or constrain with character classes ([^"]* between quotes instead of .*).' },
      { problem: 'Catastrophic backtracking — tester hangs.', solution: 'Patterns with nested quantifiers like (a+)+ can blow up on certain inputs. Refactor to avoid nested quantifiers or use possessive matching where available.' },
    ],
  },
  'md5-hash-generator': {
    intro:
      'MD5 Hash Generator produces a 128-bit MD5 digest of your input as a 32-character hex string. MD5 is no longer suitable for security purposes (it has known collisions) but remains useful for checksums, cache keys, and detecting non-malicious content changes. Hashing runs in the browser using a pure-JS implementation; your input never leaves the page.',
    examples: [
      { title: 'Generate a cache key', body: 'Hash a request URL plus its body to get a deterministic cache key for memoising idempotent API calls.' },
      { title: 'Verify a download', body: 'Compute the MD5 of a downloaded file and compare with the publisher\'s checksum to confirm the bytes match.' },
      { title: 'De-duplicate user uploads', body: 'Hash each uploaded image and store the digest; new uploads with the same hash can reuse the existing file.' },
    ],
    useCases: [
      'File integrity checks (not for security — use SHA-256 for that)',
      'Generating deterministic cache keys from variable inputs',
      'Quick de-duplication of records by content hash',
      'ETag values for HTTP caching of static assets',
      'Hashing email addresses for Gravatar-style avatar URLs',
    ],
    troubleshooting: [
      { problem: 'Different MD5s for what should be the same input.', solution: 'Whitespace, line endings, or BOM differ. Normalise the input (trim, strip BOM, use \\n only) before hashing.' },
      { problem: 'Should I use MD5 for passwords?', solution: 'No. MD5 is fast and broken for cryptographic use. Use bcrypt, argon2, or scrypt for password hashing — they are intentionally slow and salted.' },
      { problem: 'Hash differs from my server-side MD5.', solution: 'Check the encoding. The browser hashes UTF-8 bytes; some server libraries default to Latin-1 or UCS-2. Make both sides agree on UTF-8.' },
    ],
  },
  'sha256-hash-generator': {
    intro:
      'SHA-256 Hash Generator produces a 256-bit SHA-2 digest as a 64-character hex string. SHA-256 is the modern standard for content addressing, digital signatures, and integrity verification — it powers Bitcoin, Git, TLS certificates, and most file-checksum workflows. Hashing happens locally in the browser via the Web Crypto API; nothing is uploaded.',
    examples: [
      { title: 'Verify a release artifact', body: 'Hash a downloaded .tar.gz and match against the SHA-256 sum on the project\'s release page — confirms the file wasn\'t tampered with in transit.' },
      { title: 'Generate a content-addressed filename', body: 'Use the hash of a file\'s contents as part of its stored name — identical files dedupe automatically.' },
      { title: 'Build a signed-URL nonce', body: 'Hash a secret plus a request timestamp to produce a verification value the receiver can independently recompute.' },
    ],
    useCases: [
      'Verifying integrity of file downloads (SHA-256 checksums)',
      'Content-addressed storage (CAS) systems like Git\'s object DB',
      'Generating HMAC verification values for webhooks (Stripe, GitHub)',
      'Building auth tokens that can be validated without a database lookup',
      'Storing password hashes (combined with bcrypt/argon2 for stretching)',
    ],
    troubleshooting: [
      { problem: 'Different SHA-256 for identical-looking inputs.', solution: 'Line endings or trailing whitespace differ. Use a hex viewer or a "show invisibles" toggle in your editor to spot the difference.' },
      { problem: 'My HMAC verification is failing on the server.', solution: 'HMAC needs the same key and same input bytes on both sides. Verify both are UTF-8 encoded and the key isn\'t accidentally trimmed/padded.' },
      { problem: 'How does this compare to SHA-1?', solution: 'SHA-1 is deprecated (collisions found in 2017). Use SHA-256 for anything new. They produce different-length outputs (40 vs 64 hex chars).' },
    ],
  },
  'html-formatter': {
    intro:
      'HTML Formatter prettifies minified or messy HTML with consistent indentation, attribute wrapping, and tag closure. Use it on copy-pasted output from a build pipeline, on legacy templates with mixed indentation, or on machine-generated HTML you need to review in a pull request. Formatting runs in the browser — your markup never touches a server.',
    examples: [
      { title: 'Beautify minified HTML', body: 'Paste a one-line minified document and get a properly indented version with each tag on its own line — easy to scan and diff.' },
      { title: 'Normalise mixed indentation', body: 'A template with 2-space, 4-space, and tab indentation becomes uniform with your chosen indent — removes diff noise across team members.' },
      { title: 'Auto-close unbalanced tags', body: 'Paste HTML missing a few closing tags and the formatter highlights or fixes them, depending on settings.' },
    ],
    useCases: [
      'Reviewing HTML output from a static-site generator',
      'Reformatting templates before committing to git',
      'Cleaning up email HTML before sending to a marketing platform',
      'Inspecting third-party widget HTML embedded on your site',
      'Teaching HTML structure — indentation makes nesting obvious',
    ],
    troubleshooting: [
      { problem: 'Inline tags split across lines and broke spacing.', solution: 'Inline elements (a, span, strong) preserve whitespace. Switch to "inline tags on one line" in the options or wrap text in a block element to control spacing.' },
      { problem: 'Self-closing tags came out as <br></br>.', solution: 'XHTML and HTML5 self-closing rules differ. Switch the dialect to HTML5 to render void elements as <br>, or XHTML for <br />.' },
      { problem: 'Pre / code blocks lost their formatting.', solution: 'The formatter should preserve content inside <pre> and <code>. If it doesn\'t, escape the content with HTML entities or wrap in <!-- prettier-ignore -->.' },
    ],
  },
  'css-formatter': {
    intro:
      'CSS Formatter beautifies CSS, SCSS-style nested rules, and PostCSS output with one declaration per line, consistent spacing, and lowercase hex colours. Useful for cleaning up minified stylesheets, normalising team-authored CSS, or comparing two stylesheets line-by-line in a diff. Runs entirely in the browser.',
    examples: [
      { title: 'Unminify production CSS', body: 'A one-line minified bundle becomes a readable stylesheet with rules grouped and properties aligned — easy to inspect specific selectors.' },
      { title: 'Standardise spacing', body: 'Mixed styles (margin:0 vs margin: 0) collapse to a consistent format defined by your options.' },
      { title: 'Sort declarations', body: 'Toggle "sort declarations" to alphabetise properties within each rule — helps diff stylesheets across versions.' },
    ],
    useCases: [
      'Inspecting third-party / vendor CSS from a CDN',
      'Cleaning up CSS that came out of a design-to-code tool',
      'Normalising team-authored CSS before committing',
      'Building consistent input for a linting / static-analysis tool',
      'Producing readable CSS for inclusion in blog posts and docs',
    ],
    troubleshooting: [
      { problem: 'Vendor prefixes got stripped.', solution: 'They shouldn\'t be — formatting preserves all properties. If they\'re missing, run a separate autoprefixer step instead.' },
      { problem: 'CSS variables (--foo) got dropped.', solution: 'Custom properties are valid CSS and should survive formatting. If they vanish, check the input for typos: the property name must start with double dashes.' },
      { problem: 'Comments moved to weird positions.', solution: 'Block comments inside a rule end up before the next declaration. Move them outside the rule or use /*! ... */ to mark them as preserved.' },
    ],
  },
  'sql-formatter': {
    intro:
      'SQL Formatter rewrites SQL queries with consistent indentation, keyword casing, and line breaks. Whether your input is a generated query from an ORM, a long ad-hoc analytics query, or a stored procedure pulled from version control, formatting makes the logic much easier to follow. Supports common dialects (PostgreSQL, MySQL, SQL Server, SQLite).',
    examples: [
      { title: 'Format an ORM-generated query', body: 'A 200-character single-line SELECT from Sequelize or SQLAlchemy becomes a multi-line, indented query you can read and tune.' },
      { title: 'Compare two queries', body: 'Format both queries to identical conventions and diff them line-by-line — the only differences are the real ones.' },
      { title: 'Uppercase keywords', body: 'Toggle "uppercase keywords" to enforce SELECT/FROM/WHERE in caps — common style in many SQL style guides.' },
    ],
    useCases: [
      'Reviewing ORM-generated queries during query optimisation',
      'Cleaning up ad-hoc analyst queries before committing to a repo',
      'Producing readable SQL for inclusion in documentation',
      'Pre-processing for a SQL static-analysis tool that prefers canonical input',
      'Teaching SQL — the visual structure makes joins and subqueries clearer',
    ],
    troubleshooting: [
      { problem: 'Dialect-specific syntax got rejected.', solution: 'Switch the SQL dialect in the options. Postgres ARRAY[] or MySQL LIMIT 10, 5 may be invalid in a different dialect.' },
      { problem: 'Strings got reformatted unexpectedly.', solution: 'The formatter should not touch string literal contents. If it does, escape any embedded single quotes or use dollar-quoted strings ($$...$$ in Postgres).' },
      { problem: 'CTE / window function indentation looks odd.', solution: 'Complex SQL has many valid indentation styles. Try different "indent CTE" or "align args" toggles to match your team\'s preference.' },
    ],
  },
  'word-counter': {
    intro:
      'Word Counter tallies words, characters (with and without spaces), sentences, paragraphs, and reading time for any text. Useful for writers hitting a target length, social media managers staying under platform limits, students checking essay length, and developers estimating token counts for LLM prompts. Counts update live as you type or paste.',
    examples: [
      { title: 'Check a Twitter / X post length', body: 'Paste a draft and see character count update live — keep under 280 (or 25,000 for premium accounts).' },
      { title: 'Verify an essay word count', body: 'Aim for 1500 words? The counter shows running totals so you can stop at exactly the right length.' },
      { title: 'Estimate LLM tokens', body: 'A rough heuristic: 1 token ≈ 0.75 words for English. Multiply the word count by ~1.33 to get an approximate token count for a prompt.' },
    ],
    useCases: [
      'Writers managing word-count targets for articles, essays, books',
      'Social media drafts (Twitter 280, LinkedIn 3000, Instagram 2200)',
      'Students confirming essay length before submission',
      'Estimating LLM token costs for prompt budgeting',
      'Editors checking how much copy fits a layout constraint',
    ],
    troubleshooting: [
      { problem: 'Word count differs from Microsoft Word.', solution: 'Different tools count contractions, hyphenated words, and numbers differently. Most tools (including this one) treat each whitespace-separated token as a word.' },
      { problem: 'Reading time seems off.', solution: 'The estimate uses 225 words per minute (average adult reading pace). Adjust the WPM in advanced options if you have a slower or faster audience in mind.' },
      { problem: 'Counting code blocks inflates the total.', solution: 'Strip code samples before counting if you only want prose. Or paste prose only, count, then paste the rest.' },
    ],
  },
  'text-case-converter': {
    intro:
      'Text Case Converter switches text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE in one click. Essential for developers renaming variables across naming conventions, writers normalising capitalisation, and anyone cleaning up SHOUTED-COPY pasted from spreadsheets.',
    examples: [
      { title: 'API field rename', body: 'Input: "user_first_name" → camelCase: "userFirstName" / Pascal: "UserFirstName" / kebab: "user-first-name" — paste straight into the new naming convention.' },
      { title: 'Normalise a headline', body: 'Input: "the QUICK brown FOX" → Title Case: "The Quick Brown Fox" — fixes pasted text with random capitalisation.' },
      { title: 'Generate a CSS class from a label', body: 'Input: "Primary Action Button" → kebab-case: "primary-action-button" — drop into a className attribute.' },
    ],
    useCases: [
      'Renaming variables across naming conventions during refactors',
      'Converting database column names (snake_case) to API field names (camelCase)',
      'Generating slugs from headings (Title Case → kebab-case)',
      'Cleaning up data pasted from spreadsheets with ALL CAPS columns',
      'Producing CONSTANT_CASE keys for environment variables',
    ],
    troubleshooting: [
      { problem: 'Acronyms came out wrong (e.g. "iOS" → "Ios").', solution: 'Title Case capitalises only the first letter of each word. For acronyms, do a manual pass or use a custom dictionary of preserved tokens.' },
      { problem: 'Numbers split across cases unexpectedly.', solution: 'Boundary detection splits between letters and digits. "user2name" might become "user-2-name". Strip digits beforehand or join manually if needed.' },
      { problem: 'Non-Latin characters got mangled.', solution: 'Title Case relies on Latin word boundaries. For other scripts, the input is usually preserved unchanged — open an issue if you see a specific bug.' },
    ],
  },
  'lorem-ipsum': {
    intro:
      'Lorem Ipsum generates classic placeholder text for design mockups, wireframes, and content templates. Pick paragraphs, sentences, or words; choose the classic "Lorem ipsum dolor sit amet…" or vary the seed for fresh-looking placeholder. Generation is instant and the output is yours — no attribution required.',
    examples: [
      { title: '3 paragraphs for a hero section', body: 'Generate 3 paragraphs at ~50 words each to fill the body copy on a design mockup. Long enough to test typography, short enough to scan.' },
      { title: '20 words for a card teaser', body: 'A 20-word block sized like a real product description — confirms the card layout works with realistic content length.' },
      { title: '10 short sentences for a list', body: 'Generate 10 sentences to fill a 10-item bullet list and check spacing, leading, and overflow behaviour.' },
    ],
    useCases: [
      'Filling design mockups with realistic-length copy',
      'Populating CMS templates while waiting for real content',
      'Stress-testing line-height, column-width, and overflow handling',
      'Building marketing emails or newsletter layouts before final copy',
      'Demoing a UI to stakeholders without exposing real, unfinished content',
    ],
    troubleshooting: [
      { problem: 'Generated text is always identical.', solution: 'Classic Lorem starts with "Lorem ipsum dolor sit amet…". Toggle "randomise start" or generate with a different seed for varied opening words.' },
      { problem: 'Need realistic English instead of Latin.', solution: 'Switch the dictionary to "Hipster Ipsum", "Bacon Ipsum", or "Corporate Ipsum" if the tool supports them — same purpose, more recognisable feel.' },
      { problem: 'Output too long / too short for the slot.', solution: 'Generate by word count rather than paragraph count for precise control. A typical card teaser is 15-25 words; a paragraph for a blog is 50-80.' },
    ],
  },
  'image-resize': {
    intro:
      'Image Resize changes the dimensions of any image (PNG, JPG, WebP, GIF) entirely in your browser. Set absolute pixels, scale by percentage, or fit within a target while preserving aspect ratio. Resizing uses the browser\'s canvas API — your image never uploads anywhere, so private screenshots and confidential drawings stay on your device.',
    examples: [
      { title: 'Fit an image into a blog hero (1200×630)', body: 'Set width 1200, height 630, with "cover" mode — image fills the slot without distortion, edges cropped to match.' },
      { title: 'Shrink a screenshot to 50%', body: 'Use percentage mode at 50% — quick way to halve a 4K screenshot before pasting into an issue tracker.' },
      { title: 'Generate Open Graph sizes', body: 'Resize the same source to 1200×630 (OG), 1080×1080 (Instagram), 1500×500 (Twitter banner) for a multi-platform release.' },
    ],
    useCases: [
      'Preparing images for blog posts, landing pages, and email campaigns',
      'Resizing screenshots before posting to issue trackers or chat',
      'Creating thumbnails at consistent sizes for a CMS',
      'Generating profile pictures cropped to a square',
      'Down-sampling huge photos before uploading to a low-bandwidth platform',
    ],
    troubleshooting: [
      { problem: 'Resized image looks blurry.', solution: 'You\'re likely upscaling. Resizing past 100% can\'t add detail. Start from a higher-resolution source or use an AI upscaler instead.' },
      { problem: 'Aspect ratio changed even though I locked it.', solution: 'Toggle "preserve aspect ratio" before changing either dimension. The other dimension auto-adjusts based on the original ratio.' },
      { problem: 'File size barely changed.', solution: 'Resize reduces pixels but not necessarily filesize for already-compressed JPEGs at high quality. Combine with the image compressor to reduce bytes further.' },
    ],
  },
  'image-compressor': {
    intro:
      'Image Compressor shrinks PNG, JPG, and WebP file sizes by re-encoding at a target quality. Useful for speeding up page loads, fitting into upload limits, or just saving bandwidth. Compression runs in the browser using canvas re-encoding — your image stays local and you can compare before/after side-by-side before downloading.',
    examples: [
      { title: 'Halve a JPEG\'s size', body: 'Set quality to 75 and a typical photo drops to 40-60% of its original size with negligible visible difference — ideal for web delivery.' },
      { title: 'Compress PNG for a logo', body: 'PNG compression is lossless, but switching to WebP at quality 90 can cut size by 30-50% with no visible loss for most logos.' },
      { title: 'Batch a folder of screenshots', body: 'Drop multiple files in, set a single target quality, and download all the compressed versions at once.' },
    ],
    useCases: [
      'Optimising blog images for Core Web Vitals (Lighthouse loves smaller bytes)',
      'Reducing email attachment sizes below mail-server caps',
      'Preparing product photos for an e-commerce platform that imposes upload limits',
      'Compressing screenshots before pasting into a chat / issue tracker',
      'Saving storage on a personal cloud drive',
    ],
    troubleshooting: [
      { problem: 'Compressed image looks blocky / has artefacts.', solution: 'Quality is too low. Raise the slider until artefacts disappear — 75-85 is a safe range for photographic content.' },
      { problem: 'PNG size barely changed.', solution: 'PNG is lossless. Convert to JPEG (for photos) or WebP (for both) to see real savings — quality 80-90 keeps it visually identical.' },
      { problem: 'Output looks worse than the input even at quality 100.', solution: 'Re-encoding always introduces some loss. If the original is already optimal, accept it — or try a lossless format like PNG → WebP-lossless.' },
    ],
  },
  'csv-to-json': {
    intro:
      'CSV to JSON parses comma-separated values and emits a JSON array of objects, with the first row used as keys by default. Handles quoted fields, escaped quotes, embedded commas, multi-line values, and a configurable delimiter (comma, tab, semicolon, pipe). The conversion runs entirely in the browser, so confidential spreadsheets never get uploaded.',
    examples: [
      { title: 'Convert an export from Excel', body: 'Export a sheet as CSV, paste it in, and get a JSON array — drop directly into a JavaScript test fixture or API request body.' },
      { title: 'Handle a tab-separated file (TSV)', body: 'Set the delimiter to Tab and the same conversion works for TSV files from logs, monitoring tools, or Google Sheets copy.' },
      { title: 'Skip the header row', body: 'Toggle "first row is header" off when the file has no headers — keys become column0, column1, … and the data starts from row 1.' },
    ],
    useCases: [
      'Importing analyst CSV exports into a JavaScript app or REST API',
      'Building API request bodies from a spreadsheet of test cases',
      'Converting Google Sheets data for use in a static site generator',
      'Pre-processing CSVs for ingestion into MongoDB / Elasticsearch',
      'Seeding test data from a hand-edited CSV',
    ],
    troubleshooting: [
      { problem: 'Commas inside fields broke the parse.', solution: 'Wrap those values in double quotes ("Smith, John"). The parser respects RFC 4180 quoting rules. Re-export from Excel with "always quote" if available.' },
      { problem: 'Special characters became ?? or .', solution: 'Encoding mismatch. Re-save the CSV as UTF-8 (Excel: "CSV UTF-8" option) or use the Auto-detect encoding feature.' },
      { problem: 'Numbers came out as strings.', solution: 'CSV has no types — everything is text. Cast in your code (Number(row.age)) or use a post-processing step to coerce known numeric columns.' },
    ],
  },
  'json-to-csv': {
    intro:
      'JSON to CSV converts a JSON array of objects into a comma-separated-values document with one row per object and one column per key. Quoting is RFC 4180 compliant (double-quote any field containing commas, quotes, or newlines). Useful for handing API data to non-technical colleagues, importing into Excel/Sheets, or preparing data for a BI tool.',
    examples: [
      { title: 'Export API data to Excel', body: 'Fetch a JSON list of users, convert to CSV, and open in Excel — sortable and filterable without writing a single formula.' },
      { title: 'Build a Google Sheets import', body: 'Convert to CSV, paste into Sheets via "Paste special → Split text to columns" — fastest path from API to spreadsheet.' },
      { title: 'Flatten nested objects', body: 'Use the "flatten nested" option so user.address.city becomes its own column. Each nested key gets a dot-notation header.' },
    ],
    useCases: [
      'Handing API data to analysts who work in spreadsheets',
      'Generating an export feature in a web app (Download as CSV button)',
      'Preparing data for a BI tool (Looker, Tableau) that ingests CSV',
      'Backing up a JSON dataset in a more universally readable format',
      'Quickly diffing two JSON arrays — convert both to CSV, sort, diff',
    ],
    troubleshooting: [
      { problem: 'Some rows have missing columns.', solution: 'Objects have different keys. The converter takes the union of all keys; rows without a key get an empty cell. Pre-normalise the objects in your code if you want strict columns.' },
      { problem: 'Excel shows "1.23E+45" instead of my long number.', solution: 'Excel auto-formats large numbers. Add a leading apostrophe (\'1234567890123) or import as Text column to preserve the literal value.' },
      { problem: 'Unicode characters look broken in Excel.', solution: 'The tool prepends a UTF-8 BOM so Excel detects the encoding correctly. If still broken, check Excel\'s import settings or use "Data → From Text/CSV" with explicit UTF-8.' },
    ],
  },
  'markdown-to-html': {
    intro:
      'Markdown to HTML converts CommonMark-flavoured Markdown into clean HTML you can paste into a website, email template, or CMS. Supports headings, lists, links, images, code blocks, tables, and inline formatting. Conversion happens in the browser, and the output uses semantic HTML5 tags suitable for accessibility and SEO.',
    examples: [
      { title: 'Convert a README for a blog post', body: 'Paste your repo README.md and get HTML ready to drop into Ghost, WordPress, or any CMS that accepts HTML.' },
      { title: 'Generate email HTML', body: 'Write the email body in Markdown for readability, convert to HTML, and paste into your email client\'s HTML view — much faster than hand-writing tables.' },
      { title: 'Build static-site content', body: 'Useful for SSG users who occasionally need to inline HTML (in a component, in a JSX expression) but prefer authoring in Markdown.' },
    ],
    useCases: [
      'Converting documentation to publishable HTML',
      'Authoring marketing emails in Markdown and rendering to HTML',
      'Generating help-centre articles from Markdown source',
      'Preparing release notes for a website or in-app changelog',
      'Producing static HTML pages without a full build pipeline',
    ],
    troubleshooting: [
      { problem: 'Inline HTML got escaped.', solution: 'CommonMark allows raw HTML by default. If yours is escaped, check the "allow inline HTML" option or switch the dialect to GitHub-flavoured Markdown.' },
      { problem: 'Tables not rendering.', solution: 'Plain CommonMark doesn\'t include tables. Enable GFM (GitHub Flavored Markdown) for table, strikethrough, and task-list support.' },
      { problem: 'Code blocks lost their language hint.', solution: 'Use triple-backtick fences with a language tag (```js). The output adds a language-js class on the <code> tag for syntax highlighters like Prism or highlight.js.' },
    ],
  },
  'qr-code-generator': {
    intro:
      'QR Code Generator turns any text, URL, contact card, or Wi-Fi credential into a scannable QR code. The image is generated locally using the standard QR algorithm (ISO/IEC 18004), so your data — even sensitive items like Wi-Fi passwords — never leaves the browser. Download as PNG at the size you need.',
    examples: [
      { title: 'QR for a portfolio URL', body: 'Paste https://example.com/me, choose size 512, and download the PNG to print on a business card or display on a screen.' },
      { title: 'Wi-Fi QR for guests', body: 'Use the WIFI: prefix format (WIFI:T:WPA;S:Guest;P:secret;;) and visitors can join your network by scanning — no typing required.' },
      { title: 'vCard contact', body: 'Encode a vCard string with name, phone, and email — recipients scan once and the contact saves straight into their address book.' },
    ],
    useCases: [
      'Print materials (business cards, flyers, posters, restaurant menus)',
      'Wi-Fi sharing at home, in shops, and at events',
      'Linking from physical signage to a digital landing page',
      'Embedding contact info in resumes or email signatures',
      'Tracking conversions by generating unique UTM-tagged URLs per campaign',
    ],
    troubleshooting: [
      { problem: 'QR scans but to the wrong URL.', solution: 'Check the input — extra spaces, missing https://, or unescaped special characters can change the encoded text. Use the higher error-correction level if the medium might be damaged.' },
      { problem: 'QR is unscannable at small sizes.', solution: 'Increase size to at least 256px when displayed on screens, or 2cm × 2cm when printed. Raise error correction to Q or H if the medium may be obscured.' },
      { problem: 'Generator fails for very long input.', solution: 'QR codes have a max capacity (~4000 alphanumeric chars at L correction). Shorten the URL (use a URL shortener) or split the content across multiple codes.' },
    ],
  },
  'excel-to-csv': {
    intro:
      'Excel to CSV converts .xlsx / .xls files into RFC 4180 CSV with UTF-8 BOM so non-ASCII characters (Vietnamese, Japanese, Chinese, Arabic) open correctly in Excel and other tools. Parsing uses the SheetJS library entirely in the browser — your workbook never uploads anywhere. Pick a specific sheet, preview the first 10 rows, and download.',
    examples: [
      { title: 'Export the active sheet only', body: 'Open a multi-sheet workbook, select the sheet that contains the report you need, preview to confirm headers, then download a clean CSV.' },
      { title: 'Convert for a SQL bulk import', body: 'CSV with UTF-8 BOM imports cleanly into PostgreSQL COPY, MySQL LOAD DATA, and SQL Server bulk insert without character corruption.' },
      { title: 'Hand off to a non-technical teammate', body: 'CSV is the universal data format — anyone with Excel, Sheets, or Numbers can open it without macros, plug-ins, or version concerns.' },
    ],
    useCases: [
      'Exporting reports for downstream BI / SQL ingestion',
      'Sharing a single sheet of a large workbook with non-Excel users',
      'Preparing data for a programming script that reads CSV',
      'Migrating from Excel to a database, analytics tool, or static site generator',
      'Producing diffable, version-controlled tabular data (CSV diffs are readable; .xlsx isn\'t)',
    ],
    troubleshooting: [
      { problem: 'Special characters look broken in Excel after re-opening.', solution: 'The download already includes UTF-8 BOM. If Excel still misreads, use "Data → From Text/CSV" instead of double-click open, and pick UTF-8 in the dialog.' },
      { problem: 'Formulas turned into their evaluated values.', solution: 'CSV stores values, not formulas. If you need the formula text, export from Excel with "Save As → CSV" and check the formula-bar string per cell.' },
      { problem: 'Date columns came out as serial numbers.', solution: 'Excel stores dates as numbers internally. The converter formats common date cells as ISO strings; for custom formats, set the cell format before downloading.' },
    ],
  },
  'word-to-pdf': {
    intro:
      'Word to PDF converts a .docx file into a PDF entirely in your browser. The text is extracted from the document\'s XML and re-rendered to A4 pages with Be Vietnam Pro (full Vietnamese coverage) at 11pt. Useful when you need a portable, read-only version of a draft and don\'t want to install Office or upload to a third-party converter.',
    examples: [
      { title: 'Send a draft for review', body: 'A PDF is the universal "please don\'t edit this" format. Convert your draft and attach to email — opens identically on every device.' },
      { title: 'Archive a final document', body: 'Word documents change with Office updates; PDFs render the same in five years. Convert finished documents for long-term storage.' },
      { title: 'Embed in a website or LMS', body: 'PDFs can be served as static files and rendered inline by browsers — easier to embed than a .docx that requires a download.' },
    ],
    useCases: [
      'Sharing read-only drafts with clients or colleagues',
      'Archiving finished documents in a stable, portable format',
      'Generating PDFs for inclusion in an e-commerce / SaaS app',
      'Producing print-ready output from a draft authored in Word',
      'Reducing edit conflicts — PDF is a one-way export from collaborative editing',
    ],
    troubleshooting: [
      { problem: 'Formatting (tables, images) didn\'t carry over.', solution: 'This tool extracts text and renders to clean PDF pages. Complex layouts (tables, embedded images, columns, headers/footers) are not preserved. Use the desktop Word "Save As PDF" for full fidelity.' },
      { problem: 'Vietnamese / accented characters look wrong.', solution: 'The bundled font (Be Vietnam Pro) supports full Vietnamese and most Latin scripts. If you see broken characters, the source document may have non-Unicode text — re-save the .docx in Word first.' },
      { problem: 'PDF is very long compared to the Word doc.', solution: 'The tool wraps text to A4 width at 11pt without honouring the original page breaks. For paginated output matching the Word layout, use desktop Word.' },
    ],
  },
  'pdf-to-word': {
    intro:
      'PDF to Word extracts text from a PDF and produces a .docx file with one paragraph per source line. Conversion uses pdf.js entirely in the browser — your PDF never uploads to a server. Use it to pull editable text out of a finished PDF when you no longer have the source document, or to start a rewrite from existing content.',
    examples: [
      { title: 'Pull text out of a report PDF', body: 'Convert a 20-page report and edit the sections you need in Word — much faster than re-typing from a printed copy.' },
      { title: 'Translate a PDF', body: 'Extract text into Word, run through a translator (or hand to a translator), and lay out the translated version separately.' },
      { title: 'Repurpose old content', body: 'A PDF brochure or whitepaper becomes editable text — useful when migrating to a website or new template.' },
    ],
    useCases: [
      'Editing PDF content when the original Word source is lost',
      'Translating PDFs into other languages',
      'Repurposing static PDF content for the web or a new template',
      'Quoting passages from a PDF in another document',
      'Building searchable / accessible versions of scanned reports (text-only)',
    ],
    troubleshooting: [
      { problem: 'Output is empty.', solution: 'The PDF is image-based (a scan, not text). Run an OCR tool first (Adobe Acrobat OCR, Tesseract, or an online OCR) to extract text from the images, then convert.' },
      { problem: 'Line breaks happen mid-sentence.', solution: 'PDF text positioning sometimes splits sentences across "lines" that match the visual layout, not paragraphs. Manually clean up after pasting into Word.' },
      { problem: 'Tables came out as plain text.', solution: 'PDF tables are not structured — they\'re positioned rectangles of text. Use a dedicated PDF-to-Excel tool to get rows and columns, or rebuild tables manually in Word.' },
    ],
  },
};

// Build the seoContent literal string with same indentation as surrounding
// tool object (4-space base + 6-space for keys inside seoContent).
function serialize(seo) {
  const j = (s) => JSON.stringify(s); // single-line strings, JS-escaped
  const lines = ['    seoContent: {'];
  lines.push(`      intro: ${j(seo.intro)},`);
  lines.push('      examples: [');
  for (const ex of seo.examples) {
    lines.push('        {');
    lines.push(`          title: ${j(ex.title)},`);
    lines.push(`          body: ${j(ex.body)},`);
    lines.push('        },');
  }
  lines.push('      ],');
  lines.push('      useCases: [');
  for (const uc of seo.useCases) lines.push(`        ${j(uc)},`);
  lines.push('      ],');
  lines.push('      troubleshooting: [');
  for (const ts of seo.troubleshooting) {
    lines.push('        {');
    lines.push(`          problem: ${j(ts.problem)},`);
    lines.push(`          solution: ${j(ts.solution)},`);
    lines.push('        },');
  }
  lines.push('      ],');
  lines.push('    },');
  return lines.join('\n');
}

// Walk through the source, find each tool object by id, locate the
// `relatedTools: [...],` line at the matching indentation, insert
// seoContent immediately after it. Skip if seoContent already present
// in that tool object.
// Find tool object by scanning forward from `id: 'xxx',` and tracking brace
// depth. The object ends at the first `},` whose depth returns to 0.
function findToolObject(src, toolId) {
  const idMarker = `id: '${toolId}',`;
  const idPos = src.indexOf(idMarker);
  if (idPos === -1) return null;
  // Walk backwards to find the `{` that opens the tool object
  let braceOpen = -1;
  for (let i = idPos; i >= 0; i--) {
    if (src[i] === '{') {
      braceOpen = i;
      break;
    }
  }
  if (braceOpen === -1) return null;
  // Walk forward tracking depth
  let depth = 0;
  for (let i = braceOpen; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return { start: braceOpen, end: i + 1 };
    }
  }
  return null;
}

function patch(src) {
  let out = src;
  let added = 0;
  let skipped = 0;

  for (const [toolId, seo] of Object.entries(DATA)) {
    const range = findToolObject(out, toolId);
    if (!range) {
      console.warn(`[skip] tool not found: ${toolId}`);
      continue;
    }
    const block = out.slice(range.start, range.end);
    if (/\bseoContent\s*:/.test(block)) {
      skipped++;
      continue;
    }
    // Find the relatedTools line — match a relatedTools key with array literal
    // ending in `,` followed by newline. relatedTools may span multiple lines
    // (rare), so consume up to the closing `],`.
    const relRe = /(\n(\s+)relatedTools:\s*\[[^\]]*\],)/m;
    const rm = relRe.exec(block);
    if (!rm) {
      console.warn(`[skip] no relatedTools line for ${toolId}`);
      continue;
    }
    const baseSerialized = serialize(seo);
    const newBlock = block.replace(rm[1], rm[1] + '\n' + baseSerialized);
    out = out.slice(0, range.start) + newBlock + out.slice(range.end);
    added++;
  }

  return { out, added, skipped };
}

const before = fs.readFileSync(FILE, 'utf8');
const { out, added, skipped } = patch(before);
fs.writeFileSync(FILE, out);
console.log(`Done. Added: ${added}, skipped (already had seoContent): ${skipped}`);
