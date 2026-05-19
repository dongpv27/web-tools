# Deploy & SEO Setup Guide — Love Web Tools

Hướng dẫn từng bước deploy site `lovewebtools.com` lên Vercel + Cloudflare và setup các dịch vụ SEO/Analytics từ con số 0.

**Thứ tự thực hiện** (làm tuần tự, từ trên xuống):

1. Đăng ký domain
2. Deploy lên Vercel
3. Cấu hình Cloudflare làm proxy (bảo vệ + CDN)
4. Set environment variables trong Vercel
5. Verify với Google Search Console
6. Verify với Bing Webmaster Tools
7. Setup Google Analytics 4
8. (Optional) Verify với Yandex Webmaster
9. Kiểm tra cuối cùng
10. Setup email `contact@lovewebtools.com` qua Cloudflare Email Routing

**Thời gian dự kiến**: 2-3 giờ (chưa tính chờ DNS propagation lên đến 24h).

---

## 1. Đăng ký domain `lovewebtools.com` tại Tenten.vn

### Các bước đăng ký

1. Truy cập https://tenten.vn
2. Tìm kiếm `lovewebtools.com` → click **Mua ngay** nếu còn available
3. Add to cart. Thông thường Tenten upsell các dịch vụ — **lưu ý**:
   - ✅ **Bảo vệ thông tin Whois** (Whois Privacy) — bật, miễn phí năm đầu, giúp ẩn thông tin cá nhân
   - ❌ **Hosting** — **KHÔNG mua** (đã có Vercel)
   - ❌ **Email theo domain** — **KHÔNG cần** ngay (có thể thêm sau qua Cloudflare Email Routing miễn phí)
   - ❌ **SSL chứng chỉ trả phí** — **KHÔNG mua** (Vercel + Cloudflare đã free)
   - ❌ **DNS Premium / DNS quản lý** — **KHÔNG cần** (sẽ dùng DNS Cloudflare free)
   - ✅ **Đăng ký nhiều năm** (2-5 năm) — đề xuất 2-3 năm để khóa giá, tránh quên gia hạn
4. Hoàn tất thanh toán qua thẻ ATM nội địa / Visa / chuyển khoản
5. **Confirm email** từ Tenten (kiểm tra cả Spam folder) — bắt buộc trong 15 ngày, nếu không domain sẽ bị suspend bởi ICANN
6. **Note lại tài khoản đăng nhập Tenten** — sẽ dùng nhiều lần ở các bước sau

### Sau khi mua xong

Tenten thường giao quyền quản lý domain ngay lập tức. Đăng nhập vào https://tenten.vn → **Tài khoản** → **Quản lý tên miền** để xác nhận domain hiện trong danh sách.

> ⚠ **Lưu ý về DNSSEC**: Một số tài khoản Tenten mặc định bật DNSSEC. Khi chuyển nameservers sang Cloudflare ở Bước 3, **cần tắt DNSSEC trước** (sẽ hướng dẫn ở phần đó), nếu không sẽ bị lỗi resolve DNS.

---

## 2. Deploy lên Vercel

### 2.1 Tạo tài khoản Vercel

1. Truy cập https://vercel.com/signup
2. **Sign Up with GitHub** (đề xuất — auto sync repo)
3. Chọn plan **Hobby (Free)** — đủ dùng cho project hiện tại

### 2.2 Cấp quyền Vercel truy cập GitHub repo

Code đã có sẵn trên GitHub — chỉ cần grant Vercel quyền đọc repo:

1. Trong Vercel, lần đầu sign in qua GitHub → Vercel sẽ hỏi quyền truy cập
2. Có 2 lựa chọn:
   - **All repositories** (đơn giản nhất) — Vercel thấy mọi repo
   - **Only select repositories** (an toàn hơn) — chỉ pick repo `love-web-tools` (hoặc tên repo bạn đã đặt)
3. Click **Install & Authorize**

### 2.3 Import project vào Vercel

1. Vào https://vercel.com/new
2. **Import Git Repository** → tìm và chọn repo chứa source web-tools
3. Vercel auto-detect Next.js → giữ nguyên config mặc định:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (giữ mặc định)
   - Build Command: `next build` (giữ mặc định)
   - Output Directory: `.next` (giữ mặc định)
4. **Environment Variables**: chưa cần set gì — sẽ thêm ở Bước 4
5. Click **Deploy**
6. Đợi ~2-3 phút build xong → site live tại URL kiểu `love-web-tools-xxx.vercel.app`

> **Lưu ý**: Mỗi lần `git push` lên branch `main`, Vercel auto-deploy production. Mỗi push lên branch khác sẽ tạo preview deployment với URL riêng — tiện để test trước khi merge.

### 2.4 Test preview URL

Mở URL Vercel cấp → kiểm tra:
- ✅ Trang chủ load OK
- ✅ Vào 1 tool bất kỳ (vd `/json-formatter`) → renders
- ✅ Category page `/tools/developer-tools` → renders
- ✅ View source → thấy `<title>`, `<meta name="description">`, `<link rel="canonical">`

Nếu mọi thứ OK → tiếp tục bước 3. Nếu lỗi → check Build Logs trong Vercel dashboard.

---

## 3. Cấu hình Cloudflare (proxy + bảo vệ)

Cloudflare sẽ:
- Cache static assets toàn cầu (CDN)
- Bảo vệ DDoS / bot
- Cho phép cấu hình WAF, rate limit
- Cung cấp SSL miễn phí

### 3.1 Tạo tài khoản Cloudflare

1. Truy cập https://dash.cloudflare.com/sign-up
2. Đăng ký bằng email
3. Verify email

### 3.2 Add site `lovewebtools.com` vào Cloudflare

1. Trong dashboard → **Add a Site**
2. Nhập `lovewebtools.com` → **Continue**
3. Chọn plan **Free** → **Continue**
4. Cloudflare scan DNS records hiện tại từ nhà đăng ký → click **Continue**

### 3.3 Đổi nameservers tại Tenten

Cloudflare sẽ hiển thị 2 nameservers, ví dụ:
```
adam.ns.cloudflare.com
karen.ns.cloudflare.com
```

(Tên cụ thể sẽ khác — copy 2 nameservers Cloudflare hiển thị cho bạn)

**Vào Tenten quản lý domain:**

1. Đăng nhập https://tenten.vn → **Khách hàng** (góc trên phải) → **Quản lý tên miền**
2. Click vào domain `lovewebtools.com`
3. Tìm tab/mục **DNS Server** hoặc **Nameserver** (tên có thể khác tùy phiên bản UI)
4. **Tắt DNSSEC trước** (nếu đang bật):
   - Tìm mục **DNSSEC** trong cùng trang quản lý domain
   - Nếu có records DS hoặc trạng thái "Enabled" → click **Tắt / Disable**
   - Đợi 5-10 phút cho lệnh tắt được áp dụng tại root nameserver (.com)
5. **Đổi Nameservers**:
   - Chọn option **Sử dụng DNS Server tùy chỉnh** (hoặc "Custom Nameservers")
   - Bỏ các nameserver mặc định Tenten (vd `ns1.tenten.vn`, `ns2.tenten.vn`)
   - Paste 2 nameservers của Cloudflare:
     ```
     adam.ns.cloudflare.com
     karen.ns.cloudflare.com
     ```
     (Thay bằng giá trị thật Cloudflare cấp cho bạn)
   - Click **Lưu** / **Cập nhật**
6. Nếu Tenten yêu cầu xác minh qua OTP/email — confirm
7. **Quay lại Cloudflare** → click **Done, check nameservers**

### Đợi DNS propagate

- Thường 5 phút - 24 giờ
- Trung bình ~30 phút
- Cloudflare sẽ gửi email khi xong (status: "Active")
- Có thể check thủ công:
  ```bash
  nslookup -type=ns lovewebtools.com 8.8.8.8
  # Phải trả về 2 nameserver của Cloudflare
  ```

> ⚠ **Nếu sau 24h vẫn chưa propagate**: liên hệ support Tenten qua hotline / chat — đôi khi cần admin xác nhận lệnh đổi NS thủ công.

### 3.4 Add DNS records trỏ về Vercel

Trong Cloudflare → site `lovewebtools.com` → **DNS** → **Records**:

**Xóa các record tự import** (nếu có A/AAAA cũ không liên quan).

**Add 2 records**:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| `CNAME` | `@` (root) | `cname.vercel-dns.com` | **DNS only** (mây xám) ⚠ |
| `CNAME` | `www` | `cname.vercel-dns.com` | **Proxied** (mây cam) |

⚠ **Quan trọng — Root domain với Vercel + Cloudflare**:

Vercel yêu cầu domain root (`lovewebtools.com`) phải resolve trực tiếp về Vercel để verify ownership và issue SSL. Nếu bật proxy mây cam ngay từ đầu, Vercel sẽ thấy IP Cloudflare thay vì IP thật → không verify được.

**Cách làm đúng**:
1. **Lần đầu setup**: Set cả 2 record về **DNS only** (mây xám)
2. **Sau khi Vercel verify xong** và SSL active: chuyển root record sang **Proxied** (mây cam)

### 3.5 Add custom domain trong Vercel

1. Vercel dashboard → project `love-web-tools` → **Settings** → **Domains**
2. **Add Domain** → nhập `lovewebtools.com` → **Add**
3. Vercel show "Invalid Configuration" tạm thời — đợi DNS propagate
4. Click **Refresh** sau 5-10 phút → status chuyển sang **Valid Configuration**
5. Tương tự add `www.lovewebtools.com`

**Set domain chính**: 1 trong 2 phải là primary. Đề xuất:
- Primary: `lovewebtools.com` (không có www)
- Redirect: `www.lovewebtools.com` → `lovewebtools.com`

Vercel sẽ tự auto-issue SSL certificate từ Let's Encrypt cho cả 2.

### 3.6 Bật Cloudflare proxy (sau khi Vercel verify thành công)

Quay lại Cloudflare DNS → đổi 2 record:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| `CNAME` | `@` | `cname.vercel-dns.com` | **Proxied** (mây cam) ⚠ |
| `CNAME` | `www` | `cname.vercel-dns.com` | **Proxied** (mây cam) |

⚠ Với root `@` proxy ON, Vercel cần biết cách handle Cloudflare proxy. **Trong Vercel Settings → Domains**, bên cạnh `lovewebtools.com` có thể hiện warning về "external CDN". Đó là bình thường khi qua Cloudflare.

### 3.7 Cấu hình Cloudflare SSL/TLS

Cloudflare → site → **SSL/TLS** → **Overview**:

- Set encryption mode: **Full (strict)** — bắt buộc để tránh redirect loop

Vào **Edge Certificates**:
- Bật **Always Use HTTPS**
- Bật **Automatic HTTPS Rewrites**
- Min TLS version: **1.2**
- TLS 1.3: **On**

### 3.8 Cấu hình Cloudflare bảo vệ cơ bản

**Security** → **Settings**:
- Security Level: **Medium**
- Bot Fight Mode: **On** (Free plan)
- Browser Integrity Check: **On**

**Speed** → **Optimization**:
- Auto Minify: **JS, CSS, HTML** all ON
- Brotli: **On**
- Early Hints: **On**

**Caching** → **Configuration**:
- Caching Level: **Standard**
- Browser Cache TTL: **4 hours**
- Always Online: **On**

### 3.9 Test kết quả

```bash
# Kiểm tra DNS resolve qua Cloudflare
curl -I https://lovewebtools.com
# Headers phải có: server: cloudflare và cf-ray: ...

# Kiểm tra redirect www
curl -I https://www.lovewebtools.com
# Phải redirect 308 về https://lovewebtools.com

# Kiểm tra SSL grade (paste URL vào)
# https://www.ssllabs.com/ssltest/
# Target: A hoặc A+
```

---

## 4. Set environment variables trong Vercel

Vào Vercel → project → **Settings** → **Environment Variables**.

Add các biến sau (chọn scope **Production** cho hầu hết):

| Key | Value | Khi nào cần |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://lovewebtools.com` | Set ngay (override fallback) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (để trống tạm thời) | Sau Bước 5 |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | (để trống tạm thời) | Sau Bước 6 |
| `NEXT_PUBLIC_GA_ID` | (để trống tạm thời) | Sau Bước 7 |
| `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` | (để trống tạm thời) | Sau Bước 8 (nếu làm) |

Save → vào **Deployments** → tab Latest → **Redeploy** để env vars apply.

---

## 5. Google Search Console (GSC)

GSC cho biết Google index trang nào, từ khóa nào đang ranked, lỗi crawl ra sao. **Bắt buộc** với SEO.

### 5.1 Tạo property

1. Truy cập https://search.google.com/search-console
2. Đăng nhập bằng Google account
3. **Add property** → **URL prefix**
4. Nhập: `https://lovewebtools.com` → **Continue**

> ⚠ Chọn **URL prefix** (không phải Domain). Domain property cần verify qua DNS TXT record — phức tạp hơn. URL prefix verify qua HTML meta tag, đơn giản hơn.

### 5.2 Verify ownership qua HTML meta tag

GSC hiển thị nhiều cách verify. Chọn **HTML tag**:

```html
<meta name="google-site-verification" content="abc123xyz...rất-dài" />
```

Copy giá trị **content** (chuỗi `abc123xyz...rất-dài`).

### 5.3 Set vào Vercel env vars

1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → paste giá trị copy được
3. Save
4. **Deployments** → Redeploy latest

Đợi ~2 phút build xong.

### 5.4 Confirm verify

Kiểm tra meta tag đã có trong source:

```bash
curl -s https://lovewebtools.com | grep "google-site-verification"
# Phải in ra: <meta name="google-site-verification" content="abc123xyz..." />
```

Nếu OK → quay lại GSC → click **Verify**.

### 5.5 Submit sitemap

Sau khi verified:

1. GSC → property `lovewebtools.com` → **Sitemaps** (menu trái)
2. **Add a new sitemap** → nhập `sitemap.xml` → **Submit**
3. Status sẽ chuyển sang **Success** sau vài phút
4. Google bắt đầu crawl trong 24-48 giờ

### 5.6 Request indexing cho trang chính

Để Google index ngay (không đợi crawl tự động):

1. GSC → top bar → paste URL `https://lovewebtools.com/` → Enter
2. **Request Indexing** → đợi ~1 phút → "Indexing requested"
3. Lặp lại cho các URL quan trọng:
   - `https://lovewebtools.com/`
   - `https://lovewebtools.com/tools`
   - `https://lovewebtools.com/json-formatter` (top tool)
   - `https://lovewebtools.com/base64-encode`
   - `https://lovewebtools.com/blog`

> Note: Google giới hạn ~10 URL/ngày cho request indexing thủ công. Phần còn lại đợi crawl tự động.

---

## 6. Bing Webmaster Tools

Bing chiếm ~3-7% search market nhưng cũng power DuckDuckGo, Yahoo, ChatGPT search. **Đáng làm** vì miễn phí và setup chỉ 5 phút.

### 6.1 Tạo property

1. Truy cập https://www.bing.com/webmasters
2. Đăng nhập (đề xuất dùng cùng Google account đã verify GSC)
3. **Add a site**

**Cách nhanh nhất**: Bing có option **Import from Google Search Console**. Click → authorize → property tự import + verify luôn.

**Cách thủ công**:
1. Nhập `https://lovewebtools.com` → **Add**
2. Bing yêu cầu verify qua: HTML File / Meta tag / DNS TXT
3. Chọn **Meta tag**:
   ```html
   <meta name="msvalidate.01" content="xyz789abc..." />
   ```
4. Copy giá trị `content`

### 6.2 Set vào Vercel env vars

1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_BING_SITE_VERIFICATION` → paste giá trị
3. Save → Redeploy

### 6.3 Confirm + Submit sitemap

```bash
curl -s https://lovewebtools.com | grep "msvalidate"
# Phải in ra: <meta name="msvalidate.01" content="xyz789abc..." />
```

Bing dashboard → click **Verify** → status xanh.

→ **Sitemaps** (menu trái) → **Submit sitemap** → `https://lovewebtools.com/sitemap.xml`

---

## 7. Google Analytics 4 (GA4)

GA4 cho biết user đến từ đâu, dùng tool nào, bounce ra sao. Free, không giới hạn pageview cho project nhỏ.

### 7.1 Tạo GA4 property

1. Truy cập https://analytics.google.com
2. Đăng nhập → nếu lần đầu → **Start measuring**
3. **Create Account**:
   - Account name: `Love Web Tools`
   - Đồng ý các checkbox về data sharing (giữ default)
4. **Create Property**:
   - Property name: `lovewebtools.com`
   - Reporting time zone: `Vietnam (GMT+07:00)` hoặc múi giờ bạn ở
   - Currency: tùy
5. **Business details**:
   - Industry: `Computers & Electronics`
   - Business size: `Small`
6. **Business objectives**: chọn `Examine user behavior` + `Generate leads`
7. **Data collection** → **Web** platform:
   - Website URL: `https://lovewebtools.com`
   - Stream name: `Production`
   - **Enhanced measurement**: **ON** (mặc định, tốt — track outbound clicks, file downloads, video plays tự động)
8. **Create stream**

### 7.2 Lấy Measurement ID

Sau khi tạo stream → modal hiện ra với **Measurement ID** dạng `G-XXXXXXXXXX`.

**Copy giá trị này.**

(Nếu lỡ đóng modal: Admin → Data Streams → click stream `Production` → Measurement ID hiện ở góc trên phải.)

### 7.3 Set vào Vercel env vars

1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_GA_ID` → paste `G-XXXXXXXXXX`
3. Save → Redeploy

### 7.4 Verify GA4 đang track

1. Mở https://lovewebtools.com trong incognito
2. Vào GA4 → **Reports** → **Realtime**
3. Trong 30 giây sẽ thấy `1 active user` (chính bạn)

Nếu không thấy:
- Check view-source page → có `gtag/js?id=G-XXX...` không
- Check console browser → không có error blocking
- Disable adblocker / brave shields nếu có

### 7.5 Cấu hình thêm (optional, sau khi launch)

- **Conversions**: GA4 → Admin → Events → mark events như `page_view` của `/` làm conversion
- **Custom dimensions**: nếu muốn track theo category tool (tự code thêm `trackEvent` call)
- **Link với Google Search Console**: GA4 Admin → Search Console Links → Link account để xem search query data trực tiếp trong GA4

---

## 8. (Optional) Yandex Webmaster

Yandex chiếm ~50% market ở Nga/CIS, ~1-2% global. **Skip được** nếu không target audience Nga.

### 8.1 Tạo property

1. https://webmaster.yandex.com
2. Đăng nhập / tạo Yandex account
3. **+ Add site** → `https://lovewebtools.com`
4. Verify qua **Meta tag**:
   ```html
   <meta name="yandex-verification" content="abc123" />
   ```
5. Set `NEXT_PUBLIC_YANDEX_SITE_VERIFICATION` trong Vercel → Redeploy
6. Click Verify
7. Submit sitemap `https://lovewebtools.com/sitemap.xml`

---

## 9. Kiểm tra cuối cùng

Sau khi hoàn thành các bước trên, chạy checklist này:

### 9.1 Verify SEO foundation

```bash
# Sitemap accessible
curl -s https://lovewebtools.com/sitemap.xml | head -20
# Phải in ra <urlset>...</urlset>

# Robots accessible
curl -s https://lovewebtools.com/robots.txt
# Phải in ra User-agent + Allow + Sitemap

# Canonical tag
curl -s https://lovewebtools.com/json-formatter | grep -i 'rel="canonical"'

# All verification meta tags present
curl -s https://lovewebtools.com | grep -iE 'name="(google-site-verification|msvalidate|yandex-verification)"'

# OG image generates
curl -I "https://lovewebtools.com/og?title=Test"
# Phải trả về 200 và Content-Type: image/png
```

### 9.2 Test rich results

Paste 5 URL sau vào https://search.google.com/test/rich-results:

- `https://lovewebtools.com/` — kiểm tra Organization + WebSite schema
- `https://lovewebtools.com/json-formatter` — SoftwareApplication + FAQPage
- `https://lovewebtools.com/tools/developer-tools` — ItemList
- `https://lovewebtools.com/blog/how-to-format-json-online` — BlogPosting + Article
- `https://lovewebtools.com/jwt-decoder` — SoftwareApplication + FAQPage

Tất cả phải pass không có error.

### 9.3 Lighthouse audit

1. Mở Chrome → DevTools → **Lighthouse** tab
2. Mode: **Navigation**, Device: **Mobile**
3. Categories: ✅ Performance ✅ Accessibility ✅ Best Practices ✅ SEO
4. **Analyze page load**

Mục tiêu:

| Category | Target | Acceptable |
|---|---|---|
| Performance | ≥ 90 | ≥ 75 |
| Accessibility | ≥ 95 | ≥ 90 |
| Best Practices | ≥ 95 | ≥ 90 |
| **SEO** | **100** | **≥ 95** |

Test trên 3 trang:
- `/` (homepage)
- `/json-formatter` (tool page)
- `/blog/how-to-format-json-online` (blog post)

### 9.4 Mobile-friendly test

Paste URL vào https://search.google.com/test/mobile-friendly → phải pass.

### 9.5 PageSpeed Insights

https://pagespeed.web.dev/ → nhập `https://lovewebtools.com`

Check Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s = Good
- **FID** (First Input Delay): < 100ms = Good
- **CLS** (Cumulative Layout Shift): < 0.1 = Good

---

## 10. Setup email `contact@lovewebtools.com` (Cloudflare Email Routing)

Bạn cần email theo domain để (a) Privacy Policy đáng tin, (b) AdSense review không reject, (c) user reach out qua `/contact` page. **Cloudflare Email Routing miễn phí 100%** và setup mất 5 phút.

> ⚠ **Điều kiện trước**: DNS lovewebtools.com phải đang chạy qua Cloudflare (đã xong ở Bước 3). Email Routing hoạt động bằng cách thêm MX/TXT records vào DNS Cloudflare.

### Cách Cloudflare Email Routing hoạt động

- Cloudflare nhận email gửi tới `*@lovewebtools.com`
- Forward về email cá nhân thực của bạn (Gmail / Outlook / Proton, v.v.)
- Bạn reply từ email cá nhân nhưng có thể tận dụng "Send As" của Gmail để giả lập gửi từ `@lovewebtools.com`
- **Không lưu trữ email** trên Cloudflare → bạn dùng inbox cá nhân để quản lý

### 10.1 Bật Email Routing

1. Vào Cloudflare dashboard → chọn site `lovewebtools.com`
2. Menu trái → **Email** → **Email Routing**
3. Click **Get started** / **Enable Email Routing**
4. Cloudflare sẽ:
   - Add MX records tự động (3 record trỏ về Cloudflare email servers)
   - Add SPF TXT record để xác thực
5. Đợi 1-2 phút Cloudflare apply DNS — status sẽ chuyển sang **Enabled**

### 10.2 Thêm destination address

1. Cùng trang → tab **Destination addresses**
2. Click **Add destination address**
3. Nhập email cá nhân thật của bạn (vd `dongpv2702@gmail.com`)
4. Cloudflare gửi email confirmation → mở Gmail → click link **Verify**
5. Status chuyển sang **Verified** ✅

### 10.3 Tạo routing rule cho `contact@`

1. Tab **Routing rules**
2. Click **Create address**
3. **Custom address**: `contact`
4. **Action**: `Send to an email`
5. **Destination**: chọn Gmail đã verify ở 10.2
6. **Save**

(Optional) Tạo thêm các address khác:
- `support@lovewebtools.com` → cùng Gmail
- `hello@lovewebtools.com` → cùng Gmail
- `privacy@lovewebtools.com` → cùng Gmail (cho GDPR/CCPA inquiries)

### 10.4 (Optional) Catch-all rule

Bắt mọi email gửi tới `*@lovewebtools.com` không match rule khác:

1. Tab **Routing rules**
2. **Catch-all address** → toggle **ON**
3. **Action**: Send to → Gmail của bạn

Lợi: email gửi nhầm typo (`cntact@`, `support@`) vẫn đến được bạn.

Hại: spam có thể vào nhiều hơn. Bạn có thể tắt nếu spam quá nhiều.

### 10.5 Test

Gửi email từ Gmail/Outlook cá nhân **khác** (không phải destination address) tới `contact@lovewebtools.com`. Trong 10-30 giây, email phải xuất hiện trong Gmail destination với header `to: contact@lovewebtools.com`.

### 10.6 (Optional) Reply từ địa chỉ `contact@lovewebtools.com`

Cloudflare Email Routing **chỉ forward inbound**, không gửi outbound. Để reply có địa chỉ `From: contact@lovewebtools.com`, dùng **Gmail "Send mail as"**:

1. Gmail → ⚙ Settings → **Accounts and Import** → **Send mail as** → **Add another email address**
2. Name: `Love Web Tools`
3. Email: `contact@lovewebtools.com`
4. **Treat as alias**: bỏ tick (để reply "From" hiện chính xác)
5. **Next** → Gmail hỏi SMTP server. Có 2 option:

   **Option A — SMTP-free (đơn giản nhất)**: Click "Treat as an alias" rồi save mà không config SMTP. Reply sẽ hiện "via gmail.com" — không đẹp nhưng OK với user.

   **Option B — Đẹp hơn, dùng SMTP của một dịch vụ free**: Đăng ký free SMTP của một số provider như:
   - **SendGrid** — 100 email/ngày free
   - **Mailgun** — 5,000/tháng free trong 3 tháng đầu
   - **Resend.com** — 100 email/ngày free
   - **Brevo (Sendinblue)** — 300/ngày free
   
   Setup SMTP credentials → nhập vào Gmail "Send mail as" config → Gmail gửi qua SMTP đó → email hiện đúng `From: contact@lovewebtools.com` không có "via".

> **Khuyến nghị**: Bắt đầu với Option A. Khi nào volume lớn (≥ 10 email/ngày) hãy chuyển Option B với Resend.com (đơn giản nhất, dev-friendly).

### 10.7 Update Privacy Policy + Contact page với email mới

Sau khi email hoạt động, không cần đổi gì trong code — `contact@lovewebtools.com` đã được hardcode sẵn trong:
- [src/app/contact/page.tsx](src/app/contact/page.tsx) — primary CTA
- [src/app/privacy-policy/page.tsx](src/app/privacy-policy/page.tsx) — section liên hệ
- [src/app/about/page.tsx](src/app/about/page.tsx) — contact button
- [src/app/terms-of-service/page.tsx](src/app/terms-of-service/page.tsx) — contact section

Chỉ cần email forward về Gmail là mọi liên hệ đều đến đúng địa chỉ.

### 10.8 Troubleshooting Email Routing

| Vấn đề | Fix |
|---|---|
| Email gửi đi không nhận được | Check destination address đã Verified chưa. Check spam folder Gmail. Confirm MX records đã apply (Cloudflare → Email → Overview → Records). |
| Forward bị delay > 5 phút | Bình thường khi mới setup. Sau 1 ngày sẽ ổn định < 30 giây. |
| Email từ AdSense không tới | Đảm bảo SPF TXT record của Cloudflare đã có. Một số sender (như Google) verify SPF strict. |
| Muốn dừng forward một address | Cloudflare → Email → Routing rules → toggle OFF address đó. |

---

## 11. Sau khi launch — monitor và iterate

### Trong tuần đầu

- **GSC**: check **Coverage** → pages indexed bao nhiêu / total trong sitemap
- **GSC**: check **Performance** → impressions bắt đầu lên
- **GA4**: check **Realtime** → có traffic chưa
- **Cloudflare**: check **Analytics** → number of requests, threats blocked

### Trong tháng đầu

- **GSC**: pages indexed phải ≥ 50% sitemap
- **GA4**: setup goals/conversions
- **GSC Performance**: ranked keywords nào → tối ưu meta title/description cho keyword đó
- Add backlinks: post lên Reddit (r/InternetIsBeautiful, r/webdev, r/Showerthoughts khi viral), HackerNews, ProductHunt, IndieHackers

### Trong 3 tháng

- Đo bounce rate per category — category nào > 70% → cần cải thiện
- Top-traffic tool nào → ưu tiên enrich `seoContent` nếu chưa có
- Bắt đầu submit thêm blog post mới (1 post/tuần)

---

## 12. Reference — danh sách URL cần nhớ

| Mục đích | URL |
|---|---|
| Tenten quản lý domain | https://tenten.vn (đăng nhập → Khách hàng → Quản lý tên miền) |
| Vercel dashboard | https://vercel.com/dashboard |
| Cloudflare dashboard | https://dash.cloudflare.com |
| GitHub repo | https://github.com/<your-user>/love-web-tools |
| Google Search Console | https://search.google.com/search-console |
| Bing Webmaster | https://www.bing.com/webmasters |
| Google Analytics 4 | https://analytics.google.com |
| Yandex Webmaster | https://webmaster.yandex.com |
| Rich Results Test | https://search.google.com/test/rich-results |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly |
| PageSpeed Insights | https://pagespeed.web.dev |
| SSL Labs | https://www.ssllabs.com/ssltest |

---

## 13. Troubleshooting

### "Domain verification failed" trong Vercel

- DNS chưa propagate xong → đợi thêm 30 phút
- Cloudflare proxy đã bật mây cam → tắt sang DNS only đến khi Vercel verify xong
- Check nameservers tại registrar có đang trỏ về Cloudflare không

### Tenten — đã đổi nameservers nhưng Cloudflare vẫn "Pending"

- Kiểm tra DNSSEC tại Tenten chưa tắt → vào quản lý domain → DNSSEC → Disable
- Sau khi tắt DNSSEC, phải đợi thêm 24h để TLD `.com` cập nhật DS record
- Có thể verify bằng:
  ```bash
  dig +short DS lovewebtools.com @8.8.8.8
  # Phải trả về RỖNG (không có DS record)
  ```
- Nếu vẫn có DS → liên hệ Tenten support yêu cầu remove DS record thủ công

### Tenten — không thấy option "Custom Nameservers"

- Một số tài khoản Tenten cần kích hoạt quyền quản lý DNS qua **yêu cầu hỗ trợ**
- Vào https://tenten.vn → **Liên hệ** → tạo ticket: "Yêu cầu kích hoạt đổi nameserver tùy chỉnh cho domain lovewebtools.com sang Cloudflare"
- Thường được xử lý trong 1-4 giờ giờ hành chính

### "Too many redirects" sau khi bật Cloudflare proxy

- Cloudflare SSL/TLS mode đang để **Flexible** → đổi sang **Full (strict)**
- Vercel auto-redirect HTTP → HTTPS, Cloudflare cũng redirect → vòng lặp. Fix bằng Full (strict)

### Meta verification tag không xuất hiện trong source

- Vercel chưa redeploy sau khi set env var → vào Deployments → Redeploy
- Env var typo — kiểm tra exact key name `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Vercel scope của env var phải bao gồm **Production**

### GA4 không track pageview

- `NEXT_PUBLIC_GA_ID` chưa set hoặc set sai format (phải bắt đầu bằng `G-`)
- Adblocker block → test ở incognito + tắt extensions
- Site đang block bằng Cloudflare bot fight mode → check Cloudflare Security Events log

### Sitemap submit "Couldn't fetch"

- URL sitemap phải accessible publicly → test bằng `curl`
- Cloudflare cache cũ → vào Cloudflare → Caching → Purge Everything

### Cloudflare hiện "Error 522" / "Error 521"

- Vercel down (hiếm) → check https://www.vercel-status.com
- Cloudflare đang block IP Vercel → contact Cloudflare support hoặc disable orange cloud tạm thời

---

## 14. Checklist tóm tắt

Sao chép checklist này và check từng item:

```
DEPLOY
[ ] Domain lovewebtools.com đã đăng ký tại Tenten
[ ] Đã confirm email xác minh từ Tenten (trong 15 ngày)
[ ] DNSSEC tại Tenten đã tắt
[ ] Vercel đã được cấp quyền truy cập GitHub repo
[ ] Vercel project imported và build thành công
[ ] Cloudflare account tạo và domain added
[ ] Nameservers ở registrar trỏ về Cloudflare
[ ] DNS records (root + www) trỏ về cname.vercel-dns.com
[ ] Vercel custom domain added và status "Valid Configuration"
[ ] SSL active (HTTPS works)
[ ] Cloudflare proxy ON (mây cam) sau khi Vercel verify
[ ] Cloudflare SSL mode = Full (strict)
[ ] Cloudflare Auto Minify + Brotli ON

ENV VARS (Vercel)
[ ] NEXT_PUBLIC_SITE_URL = https://lovewebtools.com
[ ] NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION set
[ ] NEXT_PUBLIC_BING_SITE_VERIFICATION set
[ ] NEXT_PUBLIC_GA_ID set
[ ] (Optional) NEXT_PUBLIC_YANDEX_SITE_VERIFICATION set
[ ] Redeployed sau mỗi lần thêm env var

SEO TOOLS
[ ] Google Search Console: property added + verified
[ ] GSC: sitemap.xml submitted với status Success
[ ] GSC: top 5 URLs đã request indexing
[ ] Bing Webmaster: property added + verified
[ ] Bing: sitemap.xml submitted
[ ] GA4: property created + Measurement ID set
[ ] GA4: realtime confirmed tracking (visit từ incognito → thấy 1 active user)

EMAIL ROUTING
[ ] Cloudflare Email Routing enabled
[ ] Destination Gmail address verified
[ ] Routing rule contact@lovewebtools.com created
[ ] Test email từ Gmail khác đến contact@ - đã forward về Gmail destination
[ ] (Optional) Catch-all rule enabled
[ ] (Optional) Gmail "Send mail as" configured để reply từ contact@

QUALITY GATES
[ ] curl sitemap.xml returns 200
[ ] curl robots.txt returns 200
[ ] OG route /og?title=Test returns 200 image
[ ] Rich Results Test pass cho 5 URL đại diện
[ ] Lighthouse SEO score = 100 trên homepage + tool page + blog
[ ] PageSpeed Insights LCP < 2.5s
[ ] Mobile-Friendly Test: passes
```

---

## 15. Hỗ trợ thêm

Nếu gặp vấn đề ở bất kỳ bước nào:

1. Capture screenshot lỗi
2. Capture content của `curl -I https://lovewebtools.com` (header response)
3. Capture Vercel build log relevant
4. Quay lại nhờ tôi hỗ trợ với info đó

Chúc launch thuận lợi! 🚀
