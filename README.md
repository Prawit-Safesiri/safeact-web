# SafeAct — เว็บไซต์การตลาด (React)

เว็บไซต์ขายบริการสมาชิก SafeAct ของ บริษัท เซฟแอ็กต์ จำกัด · Vite + React 19 + React Router 7 · prerender ทุกหน้าเป็น HTML (SSG)

โดเมนหลัก: **https://safeact.com** (ไม่มี www) · ระบบสมาชิก: https://member.safeact.com

```bash
npm install
npm run dev      # พัฒนา http://localhost:5180
npm start        # build + เซิร์ฟเวอร์ local http://localhost:8125
npm run build    # dist/ = ไฟล์ static พร้อม deploy (มี sitemap.xml, robots.txt, 404.html, _headers, _redirects)
npm run preview
```

## แหล่งข้อมูลที่ต้องแก้เมื่อข้อมูลธุรกิจเปลี่ยน
| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/company.js` | โดเมนหลัก (`SITE_URL`) ชื่อบริษัท ชื่อแบรนด์ ประโยคนิยาม "SafeAct คือ…" เลขผู้เสียภาษี ที่อยู่ โทร อีเมล เวลาทำการ ลิงก์ทางการ (`sameAs`, `appStoreUrl`) วันที่มีผลของเอกสารนโยบาย (`LEGAL_UPDATED`) |
| `src/data/service.js` | หมวดกฎหมาย จำนวนกฎหมายในคลัง (`LAW_LIBRARY`) รายชื่อฟีเจอร์และ anchor บนหน้า `/features/` |
| `src/data/plans.js` | แผนและราคา — ซิงก์จากตาราง `plans` ใน Supabase ของระบบสมาชิก (ราคาจริงแก้ที่ `/admin/plans` ในแอป) |
| `src/data/faq.js` | คำถามที่พบบ่อยบนหน้าเว็บ |
| `src/seo.js` | title / description / lastmod / JSON-LD ของทุกหน้า (`ROUTES`) |

ข้อความที่ใช้ทั้ง "บนหน้าเว็บ" และ "ใน JSON-LD" ดึงจากไฟล์ข้อมูลชุดเดียวกัน จึงตรงกันเสมอ — อย่าเขียนตัวเลขหรือชื่อบริษัทตายตัวในหน้าเว็บ

## SEO
- **HTML จริงทุกหน้า**: `scripts/prerender.mjs` เรนเดอร์ทุก route ใน `ROUTES` เป็น `dist/<route>/index.html`
- **head ชุดเดียว**: `headModel()` ใน `src/seo.js` ใช้ทั้งตอน prerender และตอนเปลี่ยนหน้าในเบราว์เซอร์ (`useHead` ใน `Layout.jsx`) — canonical, robots, Open Graph, Twitter, JSON-LD
- **JSON-LD** (`@graph` ต่อกันด้วย `@id`)
  - ทุกหน้า: `OnlineBusiness` (ชื่อ SafeAct, `legalName` บริษัท เซฟแอ็กต์ จำกัด, คำอธิบาย, โลโก้, ช่องทางติดต่อ), `WebSite`, `WebPage` / `AboutPage` / `ContactPage`, `BreadcrumbList` (ทุกหน้ายกเว้นหน้าแรก)
  - หน้าแรก: `Service`, `WebApplication`
  - `/features/`: `WebApplication` พร้อมรายการฟีเจอร์และภาพหน้าจอ
  - `/pricing/`: `Service` + `OfferCatalog` (ราคา THB ไม่รวม VAT จาก `PLANS`)
  - ไม่ใช้ `FAQPage` (Google เลิกแสดงผลแล้ว) และไม่ใช้ `hreflang` (เว็บภาษาเดียว)
- **เนื้อหามองเห็นเป็นค่าเริ่มต้น**: เอฟเฟกต์เฟด (`src/staggered.js`) เริ่มซ่อนกล่องเฉพาะส่วนที่อยู่ใต้จอ หลังผู้ใช้เลื่อนหน้าจริงครั้งแรก — บอตไม่เลื่อน จึงเห็นเนื้อหาครบ
- **กล่องแอนิเมชัน** (`HeroMotion`, `AiMotion`) มี `data-nosnippet` และ HTML ที่ prerender แสดงตัวเลขจริง
- **sitemap.xml / robots.txt** สร้างตอน build จาก `SITE_URL` และ `lastmod` ใน `ROUTES` (อัปเดต `lastmod` เมื่อแก้เนื้อหาหน้านั้น)
- **หน้า 404**: `noindex` ไม่มี canonical / Open Graph / JSON-LD

### ตัวตรวจอัตโนมัติตอน build (build ล้มเหลวถ้าไม่ผ่าน)
placeholder ใน `index.html` ครบ · ทุกหน้ามี `<h1>` เดียว title description canonical · JSON-LD parse ได้ `@id` อ้างถึงกันครบ ไม่มีค่าว่าง · ราคาใน JSON-LD ตรงกับที่แสดงบนหน้าราคา · ไม่มีโดเมนอื่นนอกจาก `safeact.com` / `member.safeact.com` · ไม่มี `www.safeact.com` และ `hreflang` · ทุกไฟล์ใน `dist/` อ่านได้ (สิทธิ์ 644)

## Deploy (Cloudflare Pages)
| ค่า | ตั้งเป็น |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Custom domain | `safeact.com` |

- `public/_headers` — แคชถาวรสำหรับ `/build/*` (ไฟล์ที่มี hash) · 30 วันสำหรับ `/assets/*` รวมฟอนต์ · `X-Robots-Tag: noindex` บนโดเมน `*.pages.dev`
- `public/_redirects` — ส่งต่อ URL ของเว็บเดิม (`/pdpa/`, `/safeact-member/`, `/faq/`, `/sitemap_index.xml`) หน้าอื่นของเว็บเดิมตอบ 404
- ที่ Cloudflare: คง redirect `www.safeact.com` → `safeact.com` แบบ 301 และเปิด Always Use HTTPS
- ถ้าใช้โฮสต์อื่น ต้องแปลง `_headers` / `_redirects` เป็นรูปแบบของโฮสต์นั้น และตั้งให้ URL ที่ไม่มีอยู่ตอบสถานะ 404 ด้วยไฟล์ `404.html`

### ตรวจหลัง deploy
```bash
curl -sI https://safeact.com/                    # 200
curl -sI https://www.safeact.com/pricing/        # 301 → https://safeact.com/pricing/
curl -sI http://safeact.com/                     # 301 → https://
curl -sI https://safeact.com/pricing             # 301/308 → /pricing/
curl -sI https://safeact.com/no-such-page/       # 404
curl -sI https://safeact.com/pdpa/               # 301 → /privacy/
curl -s  https://safeact.com/robots.txt
curl -s  https://safeact.com/sitemap.xml
```
จากนั้นที่ Google Search Console: ยืนยันแบบ Domain (DNS) · ส่ง `https://safeact.com/sitemap.xml` · ลบ sitemap ของเว็บเดิม · ตรวจหน้าแรกและหน้าราคาด้วย URL Inspection · ตรวจ JSON-LD ด้วย Rich Results Test (หน้าแรกและ `/features/` จะรายงานรายการ Software App ว่าขาด `offers` และ `aggregateRating`/`review` — เป็นไปตามที่ตั้งใจ เพราะยังไม่มีรีวิวจริงบนหน้าเว็บ ไม่กระทบการเก็บหน้าลงดัชนี และห้ามใส่คะแนนที่ไม่มีอยู่จริง)

## มาตรฐานที่วางไว้
- **Accessibility (ตาม Apple HIG/WCAG 2.2 AA)**: `lang="th"` · skip link · landmark ครบ · h1 หน้าละ 1 · โฟกัสคีย์บอร์ดชัดเจน · ปุ่ม/ลิงก์สูงขั้นต่ำ 44px · FAQ ใช้ `<details>` · ตารางมี scope · `prefers-reduced-motion`
- **ดีไซน์**: token ตามระบบหน้า marketing ของ Apple (globalnav 44px, localnav sticky 52px, ปุ่ม pill, section 140/100/80px, tile มุม 28px)
- **ภาพ**: WebP พร้อม `srcset`/`sizes` · ฟอนต์ Anuphan เก็บในเว็บเอง (`public/assets/fonts/`) · JS/CSS ที่มี hash ออกที่ `/build/`

## ไฟล์ต้นฉบับที่ไม่ได้ใช้บนหน้าเว็บแล้ว (เก็บไว้เป็นต้นฉบับ)
`public/assets/laws-macbook.jpg`, `action-plan.jpg`, `training-dashboard.jpg` (ใช้ `.webp` แทน) · `app-screen.mp4`, `app-screen-poster.webp` (ใช้ชุด `-720` แทน) · `app-icon.webp`
