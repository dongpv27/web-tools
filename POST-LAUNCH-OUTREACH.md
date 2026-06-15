# Launch Outreach — Post Drafts (Love Web Tools)

Drafts để xây backlink + traffic ban đầu cho `lovewebtools.com`.
Tone đã viết riêng cho từng nền tảng. **Đọc rule từng sub trước khi post.**

**Góc nhấn (USP):** Privacy-first — *your data never leaves your browser*. No signup, no ads, 100% free, 188 tools.

> ⚠️ **Nguyên tắc chống bị xóa/ban:**
> - Đừng spam nhiều sub cùng lúc trong 1 ngày. Giãn ra 2-3 ngày/lần.
> - Tham gia comment thật, trả lời feedback — đừng "post rồi biến".
> - Mỗi sub đọc rule riêng (nhiều sub có ngày/format riêng cho self-promo).
> - Reddit: account nên có chút karma/lịch sử, account mới toanh post link dễ bị filter.

---

## 1. Reddit — r/webdev (Showoff Saturday)

> r/webdev chỉ cho self-promo vào **"Showoff Saturday"**. Đăng đúng ngày thứ Bảy.

**Title:**
```
[Showoff Saturday] I built 188 free web dev tools that run 100% in your browser — no signup, no ads, no data leaves your device
```

**Body:**
```
Hey r/webdev,

I got tired of "free online tools" that upload your data to a server, gate features behind signups, or bury everything in ads. So I built Love Web Tools — a collection of 188 utilities that all run client-side in your browser.

A few that might be useful day-to-day:
- JSON formatter / validator, JWT decoder, Base64, URL encode, hash generators
- Image: compress, convert, resize, background removal (runs locally via WASM)
- Text: diff, case converter, regex tester, lorem ipsum
- Color: palette generator, contrast checker, converters
- Plus audio/video/PDF/office converters

The whole point is privacy: for the browser-based tools, nothing is uploaded — it's all JS/WASM running on your machine. No account, no tracking of your inputs, no ads.

Stack: Next.js 16 / React 19 / Tailwind 4, deployed on Vercel behind Cloudflare. The heavy stuff (ffmpeg.wasm, pdfjs, tesseract) is lazy-loaded per tool so the bundle stays sane.

Link: https://lovewebtools.com

Would love feedback — especially which tools are missing or feel clunky. Happy to answer anything about the build.
```

---

## 2. Reddit — r/InternetIsBeautiful

> Sub này thích thứ "đẹp + hữu ích + miễn phí". Title phải mô tả site, KHÔNG dùng "I made".
> Rule: không "I made this" trong title; mô tả công dụng.

**Title:**
```
A collection of 188 free web tools (JSON, image, PDF, color, text…) that all run inside your browser — nothing gets uploaded
```

**Body (optional, short):**
```
Everything is client-side: your files and text never leave your device. No signup, no ads. Covers dev tools, image/video/PDF conversion, color utilities, text manipulation, and more.

https://lovewebtools.com
```

---

## 3. Reddit — r/SideProject

**Title:**
```
Launched Love Web Tools — 188 privacy-first browser utilities, no signup/ads. Looking for feedback.
```

**Body:**
```
After a few months of building, I launched https://lovewebtools.com — 188 free web tools across 9 categories (developer, text, image, audio, video, color, converters, office, misc).

The differentiator: privacy. Browser-based tools process everything locally — no uploads, no accounts, no ad networks tracking your inputs.

Tech: Next.js 16 + React 19, Vercel + Cloudflare. Browser-heavy libs (ffmpeg/pdfjs/tesseract WASM) are lazy-loaded per route.

This is the launch — no traffic yet. Would really appreciate:
- Which tool you'd actually use
- Anything broken on mobile
- Tools you wish existed

Thanks for taking a look.
```

---

## 4. Hacker News — Show HN

> Chỉ post khi sẵn sàng trả lời comment ngay (HN front page sống/chết trong 1-2h đầu).
> Title HN: ngắn gọn, không hype, không emoji. Post vào giờ Mỹ thức dậy (≈ 8-10am ET = 19-21h VN) để có cơ hội.

**Title:**
```
Show HN: 188 web tools that run entirely in the browser, no signup or uploads
```

**URL field:** `https://lovewebtools.com`

**First comment (post ngay sau khi submit):**
```
Hi HN,

I built this because most "online tools" sites either upload your data, require an account, or drown you in ads. Love Web Tools is 188 utilities (JSON/JWT/Base64, image compress/convert/bg-removal, PDF/office conversion, color, text, regex, etc.) — and for the browser-based ones, processing happens entirely client-side. Nothing is uploaded.

Implementation notes that might interest folks here:
- Next.js 16 / React 19. Each tool is a dynamically imported client component (ssr: false), so heavy WASM deps (ffmpeg.wasm, pdfjs-dist, tesseract.js, @imgly/background-removal) only load on the routes that need them.
- The only server routes are office-format conversions (PDF↔Word/Excel/PPT) that genuinely need Node libs, plus a contact form. Everything else is static + client JS.
- Deployed on Vercel, proxied through Cloudflare. SEO is server-rendered (per-tool metadata, JSON-LD, sitemap of ~200 pages).

It's free, no ads, no signup. This is the launch, so feedback on rough edges is very welcome — particularly tools that are missing or behave badly on mobile.
```

---

## 5. Product Hunt

> Launch khi rảnh cả ngày để engage. Chuẩn bị: logo, vài screenshot/GIF, tagline.

**Name:** `Love Web Tools`

**Tagline (≤60 ký tự):**
```
188 free browser tools — your data never leaves your device
```

**Description:**
```
Love Web Tools is a collection of 188 free utilities for developers, designers, and everyone else — JSON/JWT/Base64, image compression & conversion, background removal, PDF & office conversion, color tools, text manipulation, regex, and more.

The core principle is privacy: browser-based tools run 100% client-side. Your files and text never get uploaded to a server. No signup, no ads, no tracking of your inputs.

Built with Next.js, React, and WebAssembly so even heavy tasks (video, PDF, OCR) run locally in your browser.
```

**First comment (maker comment):**
```
Hey Product Hunt 👋

I made Love Web Tools because I was frustrated that "free online tools" usually means: upload your data to someone's server, sign up, and dodge ads.

Every browser-based tool here runs locally — nothing leaves your device. 188 tools, 9 categories, completely free, no account needed.

Would love your feedback on what to build next. Thanks for checking it out!
```

---

## 6. Dev.to / Hashnode (tutorial backlinks — chất lượng cao)

> Thay vì post "look at my site", viết tutorial giải quyết 1 vấn đề + link tới tool liên quan. Backlink tự nhiên, sống lâu.

**Ý tưởng bài (mỗi bài link 1-2 tool):**
- "How to format and validate JSON online (without sending it to a server)" → link json-formatter
- "Base64 encoding explained, with a tool to try it" → link base64-encode
- "JWT vs session cookies: when to use which" → link jwt-decoder
- "Compress images in the browser with zero uploads" → link image-compressor

> Bạn đã có sẵn 3 bài blog tương tự trên site (`how-to-format-json-online`...). Có thể cross-post lên Dev.to/Hashnode (canonical về lovewebtools.com để không bị duplicate content phạt).

---

## 7. Tool directories (backlink dễ, làm 1 lần)

Submit site vào các thư mục (free):
- **AlternativeTo** (alternativeto.net) — list như alternative cho các tool trả phí
- **Slant** (slant.co)
- **Saashub**, **Toolfolio**, **There's An AI For That** (nếu có tool AI như bg-removal)
- **Awesome lists** trên GitHub (tìm "awesome online tools", "awesome devtools" → PR thêm site)

---

## Thứ tự đề xuất (giãn cách, đừng dồn 1 ngày)

| Ngày | Việc |
|---|---|
| Ngày 1 | r/SideProject + submit 2-3 tool directories |
| Thứ 7 gần nhất | r/webdev Showoff Saturday |
| Ngày 3-4 | r/InternetIsBeautiful |
| Khi rảnh cả ngày | Show HN (sáng giờ Mỹ) HOẶC Product Hunt |
| Liên tục | Viết Dev.to tutorial 1 bài/tuần, cross-post |

> 📌 Mẹo: theo dõi GA4 Realtime + GSC khi post — sẽ thấy spike traffic. Backlink từ Reddit/HN/PH index nhanh và đẩy domain authority cho site mới.
