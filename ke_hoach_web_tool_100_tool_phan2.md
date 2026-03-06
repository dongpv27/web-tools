
# KẾ HOẠCH XÂY DỰNG WEBSITE TOOL (PHẦN 2)

# 4. Cấu trúc project (Next.js)

app/
  tools/
    image/
      webp-to-png/page.tsx
    text/
      remove-duplicate-lines/page.tsx
    dev/
      json-formatter/page.tsx

components/
  ToolLayout.tsx
  ToolCard.tsx
  ToolInput.tsx
  ToolResult.tsx
  ToolFaq.tsx
  RelatedTools.tsx

lib/
  toolFunctions
  seoData

---

# 5. Prompt chuẩn để Claude tạo tool

Bạn có thể dùng prompt sau:

You are a senior frontend engineer.

Create a micro web tool using Next.js (App Router) and TailwindCSS.

TOOL INFORMATION
Tool Name: {{tool_name}}
Category: {{category}}

Requirements:
1. Tool chạy hoàn toàn client-side.
2. Sử dụng React functional component.
3. UI gồm:
- title
- input area
- button
- result area
- copy button
4. Responsive mobile.
5. UI dùng TailwindCSS.

SEO CONTENT

Dưới tool có các section:

H2 What is {{tool_name}}
H2 Why use this tool
H2 How to use {{tool_name}}

Return a complete page.tsx file.

---

# 6. Prompt tạo nhiều tool

Generate micro tools using the template.

Tools list:

1. remove duplicate lines
2. reverse text
3. text case converter
4. json formatter
5. base64 encode
6. base64 decode
7. webp to png converter
8. png to ico converter
9. youtube thumbnail downloader
10. hex to rgb converter

Each tool should be a separate Next.js page.

---

# 7. Prompt tạo SEO content

Write SEO content for a web tool page.

Tool: JSON Formatter

Write sections:

Intro paragraph

H2 What is JSON
H2 Why format JSON
H2 How to format JSON online
H2 FAQ (3 questions)

Keep content concise and SEO friendly.

---

# 8. Layout chuẩn cho trang tool

Header (logo + menu)

H1 Tool title

Tool description

Tool card
- input
- action button
- result

Section hướng dẫn sử dụng

Section giải thích tool

FAQ

Related tools

Footer

---

# 9. Chiến lược SEO

1 tool = 1 keyword long-tail

Ví dụ:

webp to png converter online

Trang tool cần có:

- tool UI
- hướng dẫn sử dụng
- FAQ
- related tools

Internal linking giữa các tool trong cùng category.

---

# 10. Lộ trình phát triển

Phase 1
20 tool niche

Phase 2
50 tools

Phase 3
100 tools

---

# 11. Monetization

Sau khi đạt:

30k visit / tháng

Có thể gắn Google AdSense.

100k visit / tháng

Thu nhập thường:

500 – 2000 USD / tháng.

---

# 12. Workflow build tool bằng AI

Claude generate code
→ copy page
→ add vào project
→ deploy

Thời gian trung bình:

1 tool: 3–5 phút
100 tools: 1–2 ngày.
