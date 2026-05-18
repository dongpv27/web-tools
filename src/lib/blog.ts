/**
 * Blog registry skeleton.
 *
 * Architecture-only — no real posts yet. Add entries here (or migrate to
 * an MDX-based loader later) to surface them at /blog and /blog/[slug].
 * The /blog routes, sitemap, and metadata generation already wire through
 * this module.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date string, e.g. '2026-05-12' */
  date: string;
  /** Reading time in minutes; falls back to 1 when omitted. */
  readingTime?: number;
  tags?: string[];
  category?: 'tutorial' | 'comparison' | 'guide' | 'use-case' | 'troubleshooting';
  /** Optional cover image path (under /public). */
  cover?: string;
  /** Markdown/plain-text body. Kept inline until MDX is wired up. */
  body?: string;
}

export const posts: BlogPost[] = [
  {
    slug: 'how-to-format-json-online',
    title: 'How to Format JSON Online (Without Sending It to a Server)',
    description:
      'A two-minute guide to formatting, validating, and minifying JSON in the browser — and why the privacy story matters for production payloads.',
    date: '2026-05-12',
    readingTime: 4,
    category: 'tutorial',
    tags: ['json', 'tutorial', 'developer'],
    body: `Most developers eventually need to make a messy JSON blob readable — straight out of a curl response, a log line, or a Slack message. The usual answer is to paste it into an online formatter. The catch: a lot of those formatters POST your payload to their server, which is not what you want when the payload includes session tokens or PII.

This guide shows the workflow we use with our own [JSON Formatter](/json-formatter), which runs entirely in the browser.

## The 30-second version

1. Open /json-formatter.
2. Paste the JSON in the input box.
3. Click Format. The formatted version appears below.
4. (Optional) Click Minify to round-trip back to one line.

That's it. The tool never makes a network request with your payload — you can verify by opening the Network tab in DevTools while you click Format.

## When formatting matters

- **Code reviews.** Diffing a one-line JSON blob is impossible. Format it first, commit the formatted version, and reviewers can read the change line-by-line.
- **Debugging API responses.** A 4 KB payload with no whitespace is much easier to scan once it has line breaks and indentation.
- **Generating fixtures.** Pretty-printing then trimming is faster than handcrafting nested structures.

## Common pitfalls

- **Trailing commas.** JSON does not allow them, even though JavaScript does. The formatter will report a syntax error pointing at the offending line.
- **Single quotes around keys.** Same issue — JSON requires double quotes. Find/replace before pasting.
- **Big numbers.** Integers above 2^53 lose precision when parsed as JavaScript Number. If your payload includes IDs in that range, wrap them in quotes before round-tripping.

## Why client-side matters

If your payload contains anything sensitive (auth tokens, PII, internal IDs), pasting it into a tool that POSTs to a third party means that data is now in someone else's logs. We built /json-formatter so it never has the option — the JavaScript that does the formatting runs in your tab, full stop.

For the same reason, see [Base64 Encoder](/base64-encode) and [JWT Decoder](/jwt-decoder), which follow the same model.`,
  },
  {
    slug: 'base64-encoding-explained',
    title: 'Base64 Encoding Explained (and When to Reach for It)',
    description:
      'A practical walkthrough of what Base64 actually does, when to use it, and three common ways it goes wrong.',
    date: '2026-05-10',
    readingTime: 5,
    category: 'guide',
    tags: ['base64', 'encoding', 'tutorial', 'developer'],
    body: `Base64 shows up in HTTP Basic Auth, JWT payloads, data: URLs, and email attachments. It's not encryption — it's a way to package arbitrary bytes into characters that survive transport channels that only accept printable text.

## What it does

Base64 takes three bytes of input (24 bits) and packs them into four 6-bit characters from a 64-character alphabet: A-Z, a-z, 0-9, plus "+" and "/". When the input length isn't a multiple of 3, the output is padded with "=".

That mapping is why Base64 output is ~33% larger than the input.

## When to use it

- **HTTP Basic Auth headers.** The "Authorization: Basic ..." value is "user:password" run through Base64.
- **Inline data: URLs.** A small SVG icon Base64-encoded in CSS removes an HTTP request.
- **JWT payloads.** The header and payload of a JWT are Base64url-encoded JSON.
- **Storing binary in JSON.** If you need to ship a binary blob inside a JSON field, Base64 is the lingua franca.

Encode a value yourself with our [Base64 Encoder](/base64-encode) — it runs locally.

## When NOT to use it

- **Encryption.** Base64 is not a secret; anyone can decode it. If confidentiality matters, encrypt first, then Base64.
- **Compression.** Base64 increases size. If size matters, gzip first.
- **As an ID.** Random IDs should be UUIDs or short alphanumeric — Base64 is awkward to type and copy because of "+" and "/".

## Three common gotchas

**1. URL-safe variants.** Standard Base64 uses "+" and "/", which are not URL-safe. The "base64url" variant substitutes "-" and "_" and strips padding. JWT uses base64url. Mixing the two produces "invalid padding" errors.

**2. UTF-8 vs Latin-1.** Encoding "café" with Latin-1 gives a different output than UTF-8. When in doubt, encode UTF-8.

**3. Line wrapping.** Some legacy tools wrap Base64 at 76 characters with newlines. Most modern parsers tolerate that, but if yours doesn't, strip whitespace first.

Decoding works the same way in reverse — see [Base64 Decoder](/base64-decode).`,
  },
  {
    slug: 'jwt-vs-session-cookies',
    title: 'JWT vs Session Cookies: Which Should Your App Actually Use?',
    description:
      'A pragmatic comparison of JWT and server-side sessions, with a quick decision framework for picking between them.',
    date: '2026-05-08',
    readingTime: 6,
    category: 'comparison',
    tags: ['jwt', 'auth', 'session', 'comparison', 'developer'],
    body: `JWT got popular because it scales horizontally without a shared session store. That's the headline. But in practice, most teams that pick JWT default to it without considering the tradeoffs. Here's the version you can sketch on a whiteboard.

## What each one actually is

**Session cookie.** The server stores session state (user ID, roles, etc.) keyed by a random session ID. The cookie just carries the ID. The server is the source of truth.

**JWT.** The server signs a payload containing the user's claims (id, roles, exp, etc.) with a private key. The signed token IS the credential. The server can verify it without looking anything up.

## When sessions win

- **You can revoke instantly.** Delete the row in your session store and the user is logged out everywhere. JWT revocation requires a blocklist, which defeats the "no lookup needed" benefit.
- **Your sessions are long-lived.** A 30-day session in a JWT is a 30-day window where a stolen token grants full access. A 30-day session cookie can be invalidated server-side at any moment.
- **You only have one backend.** The horizontal-scaling argument doesn't apply.

## When JWT wins

- **Many independent services.** Microservices that need to verify identity without calling back to an auth service benefit from self-contained tokens.
- **Short-lived access tokens with refresh.** Use a 5-minute JWT access token + a long-lived refresh token. Revocation is bounded by the access token TTL.
- **Mobile and SPA clients on different domains.** Cookies need careful CORS/SameSite config; bearer tokens in headers are simpler.

## What to put in the payload

Never put secrets in a JWT — anyone holding the token can decode it. (Try our [JWT Decoder](/jwt-decoder).) Put only:

- \`sub\`: the user ID
- \`exp\`: expiration time
- \`iat\`: issued-at time
- minimal authorization claims (roles, tenant)

If the payload starts to grow, you're probably trying to avoid a database lookup that you should just do.

## Decision framework

Pick **sessions** unless you have a specific reason to pick JWT. The default-to-JWT mindset has bitten many teams when they discovered they couldn't revoke tokens, couldn't change permissions mid-session, or shipped sensitive claims in the payload.

If you do pick JWT, keep access tokens short (5-15 min) and use refresh tokens for renewal. The combination gives you JWT's stateless verification with session-cookie-level revocation guarantees.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Return blog posts whose body or tags mention the given tool slug.
 *  Used on tool pages to surface "Related reading" links into the blog —
 *  builds the inbound Tool ← Blog link graph that complements relatedTools.
 */
export function getPostsMentioningTool(toolSlug: string, limit = 3): BlogPost[] {
  if (!toolSlug) return [];
  const needle = `/${toolSlug}`;
  return getAllPosts()
    .filter(
      (p) =>
        (p.body && p.body.includes(needle)) ||
        (p.tags && p.tags.includes(toolSlug)),
    )
    .slice(0, limit);
}
