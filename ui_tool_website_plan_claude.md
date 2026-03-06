
# PLAN THIẾT KẾ UI WEBSITE TOOL (DÀNH CHO CLAUDE CODE)

Mục tiêu:
Thiết kế UI/UX hoàn chỉnh cho website chứa ~100 micro tools.
Thiết kế tối ưu cho:
- SEO
- UX đơn giản
- tốc độ tải nhanh
- dễ mở rộng 100–300 tools
- dễ generate code bằng Claude

Tech stack đề xuất:
- Next.js (App Router)
- TailwindCSS
- Client-side tools (JS)
- Deploy: Cloudflare Pages / Vercel

--------------------------------------------------

# 1. CẤU TRÚC LAYOUT TỔNG THỂ

Website layout:

HEADER
MAIN CONTENT
FOOTER

Header:
- Logo
- Search tools
- Menu category

Main:
- homepage / category / tool page

Footer:
- categories
- popular tools
- about / contact

--------------------------------------------------

# 2. HEADER UI

Layout:

--------------------------------------------------
LOGO      SEARCH BAR        MENU
--------------------------------------------------

Menu items:

Tools
Image Tools
Text Tools
Developer Tools
YouTube Tools
Color Tools
Converters

Search placeholder:

Search tools...

--------------------------------------------------

# 3. HOMEPAGE UI

Homepage layout:

H1: Free Online Tools

Description:
100+ free online tools for developers, designers and creators.

Search bar

Popular tools section

Tool categories

Latest tools

Blog articles

Example layout:

--------------------------------------------------
Free Online Tools

Search tools...
--------------------------------------------------

Popular Tools

JSON Formatter
Remove Duplicate Lines
UUID Generator
YouTube Thumbnail Downloader

--------------------------------------------------

Tool Categories

Image Tools
Text Tools
Developer Tools
YouTube Tools
Color Tools
Converters

--------------------------------------------------

Latest Tools

Grid of tools

--------------------------------------------------

# 4. CATEGORY PAGE UI

URL example:

/tools/image

Layout:

Breadcrumb

H1 Image Tools

Description

Tool Grid

FAQ

Example:

Home > Tools > Image Tools

Image Tools

Grid:

WebP to PNG
PNG to WebP
Image Color Picker
Blur Image

--------------------------------------------------

# 5. TOOL PAGE UI (QUAN TRỌNG NHẤT)

Tool page layout:

Breadcrumb

H1 Tool Name

Short description

Tool UI card

How to use section

Explanation section

FAQ

Related tools

Example:

Home > Image Tools > WebP to PNG

WebP to PNG Converter

Convert WebP images to PNG instantly.

Tool UI:

[ Upload Image ]
[ Convert ]
[ Download Result ]

Sections:

How to use WebP to PNG Converter

What is WebP format

Why convert WebP to PNG

FAQ

Related Tools

--------------------------------------------------

# 6. TOOL CARD UI

Structure:

+------------------------------------+
| Tool Name                          |
|                                    |
| Input area                         |
|                                    |
| Action button                      |
|                                    |
| Result output                      |
|                                    |
| Download / Copy                    |
+------------------------------------+

Input types:

textarea
file upload
text input
select dropdown

Output types:

text output
image preview
download file
copy button

--------------------------------------------------

# 7. RELATED TOOLS SECTION

Example:

Related Tools

JSON Validator
JSON to YAML
JSON to CSV
Base64 Encode

Purpose:
- tăng internal linking
- cải thiện SEO
- giữ user ở lại site lâu hơn

--------------------------------------------------

# 8. FOOTER UI

Footer layout:

--------------------------------------------------

Tool Categories

Image Tools
Text Tools
Developer Tools
YouTube Tools
Color Tools
Converters

--------------------------------------------------

Popular Tools

JSON Formatter
UUID Generator
Remove Duplicate Lines
QR Code Generator

--------------------------------------------------

About
Privacy Policy
Contact

--------------------------------------------------

# 9. MOBILE UI

Mobile layout:

LOGO
SEARCH

MENU (hamburger)

CONTENT

TOOL UI

FAQ

--------------------------------------------------

# 10. DESIGN STYLE

Style:

minimal
clean
fast loading

Color palette:

Primary: #2563EB
Background: #F8FAFC
Card: #FFFFFF
Border: #E5E7EB

Typography:

Heading: Inter / system font
Body: 16px

--------------------------------------------------

# 11. TOOL GRID DESIGN

Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column

Tool card example:

+-----------------------+
| JSON Formatter        |
| Format JSON online    |
+-----------------------+

--------------------------------------------------

# 12. BREADCRUMB (SEO)

Example:

Home > Tools > Developer Tools > JSON Formatter

--------------------------------------------------

# 13. SEO METADATA FORMAT

Example:

Title:
WebP to PNG Converter - Free Online Tool

Description:
Convert WebP images to PNG instantly using our free online converter.

--------------------------------------------------

# 14. CLAUDE PROMPT TẠO UI

Prompt:

Create a clean tool website UI using Next.js and TailwindCSS.

Include:

Header
Search bar
Tool grid
Tool page layout
Footer

Design requirements:

minimal
fast loading
SEO friendly
responsive

Use reusable React components.

--------------------------------------------------

# 15. COMPONENT STRUCTURE

components/

Header.tsx
Footer.tsx
SearchBar.tsx
ToolCard.tsx
ToolGrid.tsx
ToolLayout.tsx
RelatedTools.tsx
FaqSection.tsx

--------------------------------------------------

# 16. TOOL LAYOUT COMPONENT

All tools should use:

<ToolLayout>
  <ToolCard>
    input
    action button
    result
  </ToolCard>
</ToolLayout>

--------------------------------------------------

# 17. UX RULES

Tools should:

- run instantly
- no login required
- minimal clicks
- simple UI
- mobile friendly

--------------------------------------------------

# 18. PERFORMANCE REQUIREMENTS

Tools should:

- run client-side
- minimal JS bundle
- fast loading

Target:

Page load < 1.5s

--------------------------------------------------

# 19. DEVELOPMENT WORKFLOW

Claude generate component
→ copy vào project
→ add route tool
→ deploy

Average time:

1 tool: 5 phút
100 tools: 1–2 ngày
