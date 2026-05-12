# TODO — Follow-up Work for Love Web Tools

Items in this file require a live domain, production environment, or
external account. The pre-deploy "CODE NOW" phase has been completed —
see the changelog below for what shipped.

Last updated: 2026-05-12

---

## CODE NOW — completed 2026-05-12

The seven pre-deploy items in this file's previous revision are done.
Quick map of what landed and where:

| Item | Result | Key files |
|---|---|---|
| §1 Tag system | Engine + auto-fallback from keywords + explicit tags on ~17 flagship tools. Adding more tags is purely content work — drop them on individual `Tool` entries. | `src/lib/tools.ts` (`getEffectiveTags`, `getRelatedTools`) |
| §2 Per-tool SEO content | `Tool.seoContent?: { intro, examples, useCases, troubleshooting }` schema + renderer + sample content for json-formatter, base64-encode, jwt-decoder. Replicate the pattern on more flagship tools to reduce duplicate content. | `src/lib/tools.ts`, `src/components/seo/SeoContent.tsx`, `src/app/[slug]/page.tsx` |
| §3 Empty/error states | Shared `ToolError`, `ToolEmpty`, `ToolHint` primitives. JsonFormatterClient converted as the reference template — replicate on other tool clients. | `src/components/tools/ToolFeedback.tsx`, `src/components/tool-clients/JsonFormatterClient.tsx` |
| §4 Mobile UX | Globals enforce 16 px inputs on small screens (kills iOS auto-zoom) and 40 px min tap target on coarse pointers. | `src/app/globals.css` |
| §5 Lazy loading | Verified: every tool client is `next/dynamic({ ssr: false })`, so pdfjs / pdf-lib / ffmpeg are bundled into per-route chunks. No refactor needed. | `src/components/tools/ToolLoader.tsx` |
| §6 Blog seed | 3 sample posts (`how-to-format-json-online`, `base64-encoding-explained`, `jwt-vs-session-cookies`) + inline minimal-markdown renderer. Posts auto-surface on `/blog` and in the sitemap. | `src/lib/blog.ts`, `src/app/blog/[slug]/page.tsx` |
| §7 Trending tools | `recordRecentTool` + `useRecentTools` hook (localStorage, last 10) + `<RecentTools>` component mounted in tool-page sidebar and home inline. | `src/lib/analytics.ts`, `src/components/tools/RecentTools.tsx` |

Things that are intentionally *partial* (content work for you, not blocked by code):
- Rich `seoContent` on all flagship tools (only 3 done as templates).
- `ToolError`/`ToolEmpty` adoption across all 50+ tool clients (1 done as template).
- More blog posts (3 seeded, target was 5-10).

Note on tags: all 178 tools now have explicit `tags`. The 18 flagship tools
were hand-curated; the remaining 160 were generated via `scripts/add-tool-tags.mjs`
from category + keywords. The script is idempotent — when new tools are added,
re-run it to top up tags on those new entries.

---

## AFTER DOMAIN PURCHASE

### 8. Update SITE_URL `[B.1]`
- File: `src/lib/site.ts` (single source of truth).
- Change `SITE_URL` from `https://lovewebtools.com` to the real domain
  if different.
- This auto-propagates to: sitemap, robots, canonical URLs, OG URLs,
  JSON-LD schema URLs.

### 9. Add OG image fallback asset
- The dynamic OG route at `/og` covers most cases.
- Still nice to have a static `/public/og-image.png` (1200×630) for
  edge-cache fallbacks. Design from spec in `update-seo_ver1.md` §1:
  Love Web Tools branding, gradient, "Free Online Developer Tools".

---

## AFTER DEPLOY (production environment exists)

### 10. Connect Vercel `[B.2, B.3]`
- Import repo into Vercel.
- Confirm build passes (`next build`).
- Add custom domain in Vercel dashboard, configure DNS.
- Verify HTTPS works on root + www redirect.

### 11. Set environment variables in Vercel
All optional — each tag only renders when its variable is set.
Already wired in `src/app/layout.tsx`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (e.g. `G-XXXXXXX`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console DNS/HTML token |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools token |
| `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` | Yandex Webmaster token (optional) |

### 12. Cloudflare in front of Vercel `[B.4]`
- Add site to Cloudflare → update nameservers at registrar.
- Enable proxy (orange cloud) on apex + www.
- SSL/TLS mode: **Full (Strict)** — Vercel issues real certs.
- Caching: leave on default; rely on Vercel's `Cache-Control` headers.
- Optional: set page rule to bypass cache for `/api/*` and `/og?*` (OG
  images are rendered per-request on edge runtime).

### 13. Verify production SEO `[B.5]`
After deploy, manually check:
- `https://<domain>/sitemap.xml` returns all tool + category + blog URLs.
- `https://<domain>/robots.txt` shows correct allow/disallow + sitemap line.
- `https://<domain>/og?title=Test` returns a 1200×630 image.
- JSON-LD validation via [Google Rich Results Test](https://search.google.com/test/rich-results):
  - homepage → WebSite + SearchAction + Organization
  - a tool page → SoftwareApplication + BreadcrumbList + FAQPage
  - a category page → ItemList + BreadcrumbList
  - a blog post → BlogPosting

### 14. Google Search Console `[B.6]`
- Add property (use Domain property if DNS-verified).
- Submit sitemap: `https://<domain>/sitemap.xml`.
- Use URL Inspection → Request indexing for top 20-30 priority tools.
- Monitor Coverage report weekly for the first month.

### 15. Bing Webmaster Tools
- Submit same sitemap.
- Add verification token to env.

### 16. Verify GA4 `[B.7]`
- Create GA4 property, copy Measurement ID.
- Add to Vercel env, redeploy.
- Open site in incognito → check Realtime in GA dashboard.
- Wire `trackToolView/Run/Download/Search` from `src/lib/analytics.ts`
  into tool clients where useful. Keep it minimal — avoid PII (don't
  send raw input/output, just tool IDs and action names).

### 17. Apply for AdSense `[B.8]`
Only when:
- Site has been live for several weeks.
- 30+ indexed pages.
- Real organic traffic (even small).

Then:
1. Apply at adsense.google.com.
2. After approval, in `src/components/ads/AdBanner.tsx`:
   - Set `ADS_ENABLED = true`.
   - Replace `ADSENSE_CLIENT_ID` with real `ca-pub-...`.
   - Replace each placeholder slot ID in `ADSENSE_SLOTS` with real slot IDs.
3. In `src/app/layout.tsx`: set `ADSENSE_ENABLED = true` and real ID.
4. Verify CLS stays low (placeholders already reserve height).

### 18. Backlink + outreach `[B.10]`
Operational, not code. Target list:
- Reddit: r/webdev, r/programming, r/coolgithubprojects (one tool per post, no spam).
- Dev.to: write tutorials linking to specific tools.
- Hacker News: only when there's a meaningfully novel tool — don't waste a Show HN.
- Product Hunt: launch when site has 50+ tools and looks polished.
- Tool directories: AlternativeTo, Slant, etc.
- Hashnode, Medium: cross-post Dev.to articles.

### 19. Content scale plan `[B.9]`
Targets per phase (from master plan):
- Phase 1: 50 tools (mostly there).
- Phase 2: 100-150 tools.
- Blog: 30 posts to start, 100+ long-term.

---

## REFERENCE: where things live in code

| Concern | Location |
|---|---|
| Site config (URL, name, OG helpers) | `src/lib/site.ts` |
| Tool registry | `src/lib/tools.ts` |
| Category registry | `src/lib/categories.ts` |
| Blog registry | `src/lib/blog.ts` |
| Analytics helpers | `src/lib/analytics.ts` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| Dynamic OG | `src/app/og/route.tsx` |
| Tool page | `src/app/[slug]/page.tsx` |
| Category page | `src/app/tools/[category]/page.tsx` |
| Tools index (with search) | `src/app/tools/page.tsx` |
| Blog index | `src/app/blog/page.tsx` |
| Blog post | `src/app/blog/[slug]/page.tsx` |
| Root layout (metadata, GA, AdSense) | `src/app/layout.tsx` |
| Ad component (CLS-safe) | `src/components/ads/AdBanner.tsx` |
| CTA component | `src/components/seo/CtaBlock.tsx` |
| FAQ component (with schema) | `src/components/seo/FaqSection.tsx` |
| Breadcrumb (with schema) | `src/components/layout/Breadcrumb.tsx` |
