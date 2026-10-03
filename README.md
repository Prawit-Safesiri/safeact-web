# SafeAct — เว็บไซต์การตลาด (React)

เว็บไซต์ขายบริการสมาชิก SafeAct ของ บริษัท เซฟแอ็กต์ จำกัด · Vite + React 19 + React Router 7 · prerender ทุกหน้าเป็น HTML (SSG)

โดเมนหลัก: **https://safeact.com** (ไม่มี www) · ระบบสมาชิก: https://member.safeact.com

```bash
npm install
npm run dev      # พัฒนา http://localhost:5180
npm start        # build + เซิร์ฟเวอร์ local http://localhost:8125
npm run build    # dist/ = ไฟล์ static พร้อม deploy (มี sitemap.xml, robots.txt, 404.html, _headers, _redirects)
npm run preview
npm run sync:laws  # ดึงตัวเลขกฎหมาย + ภาพหน้าปกหมวดจากระบบสมาชิก → src/data/laws.json + public/assets/laws/ (แล้ว build + commit)
```

## แหล่งข้อมูลที่ต้องแก้เมื่อข้อมูลธุรกิจเปลี่ยน
| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/company.js` | โดเมนหลัก (`SITE_URL`) ชื่อบริษัท ชื่อแบรนด์ ประโยคนิยาม "SafeAct คือ…" เลขผู้เสียภาษี ที่อยู่ โทร อีเมล เวลาทำการ ลิงก์ทางการ (`sameAs`, `appStoreUrl`) วันที่ปรับปรุงล่าสุดของเอกสารนโยบายแต่ละฉบับ (`LEGAL_DATES`) |
| `src/data/service.js` | หมวดกฎหมาย จำนวนกฎหมายในคลัง (`LAW_LIBRARY`) รายชื่อฟีเจอร์และ anchor บนหน้า `/features/` |
| `src/data/plans.js` | แผนและราคา — ซิงก์จากตาราง `plans` ใน Supabase ของระบบสมาชิก (ราคาจริงแก้ที่ `/admin/plans` ในแอป) |
| `src/data/faq.js` | คำถามที่พบบ่อยบนหน้าเว็บ (ส่งออกเป็น FAQPage ด้วย) |
| `src/data/laws.json` | ตัวเลขกฎหมายจากระบบสมาชิก **ชุดที่ build ติดไปกับหน้าเว็บ**: จำนวนทั้งคลัง รายเดือน 24 เดือน 36 หมวด และชื่อภาพหน้าปกหมวด — ห้ามแก้เอง ให้รัน `npm run sync:laws` (ใช้ตัวนับเดียวกับแอป: RPC `law_month_counts` และ `get_category_popularity`) · `LAW_LIBRARY` ใน service.js ดึงจากไฟล์นี้ · build เตือนเมื่อข้อมูลเก่ากว่า 45 วัน และล้มถ้าภาพหน้าปกไม่ครบ |
| `public/assets/laws/` | ภาพหน้าปกหมวดกฎหมาย = ภาพเดียวกับในแอป (`law_categories.cover`) ย่อเป็น webp 640×360 และ 320×180 — `sync:laws` ดาวน์โหลดและลบภาพที่ไม่ใช้แล้วเอง ห้ามแก้เอง · หมวดที่ยังไม่มีภาพในแอปแสดงกรอบภาพเปล่า |
| `scripts/laws-source.mjs` | ตัวดึงข้อมูลกฎหมายจากระบบสมาชิก ใช้ร่วมกันระหว่าง `sync:laws` กับ `/api/laws.json` ของ `server.cjs` |
| `src/data/law-rules.js` | กติกาจัดกลุ่มหมวด คำอธิบายสั้น และรูปแบบวันที่ไทย (ใช้ร่วมกันระหว่างสคริปต์ซิงก์กับหน้าเว็บ) |
| `src/data/standards.js` | รายชื่อมาตรฐานระบบการจัดการ 9 รายการ (ตามรายการในแอป · FSSC 22000 ไม่ใช่มาตรฐาน ISO) |
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
  - หน้าแรกและหน้าราคา: `FAQPage` จากรายการเดียวกับที่แสดงบนหน้า (`src/data/faq.js`) — Google ไม่แสดงผลพิเศษแล้ว แต่ Bing และระบบค้นหาของ AI ยังอ่าน
  - `/ai/`: WebApplication (AI ผู้ช่วยกฎหมาย) · ทุกหน้ามี `dateModified` = `lastmod`
  - `/law-updates/`: `CollectionPage` + `ItemList` 36 หมวด (ชื่อตรงกับการ์ดบนหน้า) + `FAQPage` · `lastmod` = วันที่ซิงก์ตัวเลขกฎหมาย
  - ไม่ใช้ `hreflang` (เว็บภาษาเดียว)
- **เนื้อหามองเห็นเป็นค่าเริ่มต้น**: เอฟเฟกต์เฟด (`src/staggered.js`) เริ่มซ่อนกล่องเฉพาะส่วนที่อยู่ใต้จอ หลังผู้ใช้เลื่อนหน้าจริงครั้งแรก — บอตไม่เลื่อน จึงเห็นเนื้อหาครบ
- **ภาพจางเข้าเมื่อโหลดเสร็จ** (แบบ apple.com): สคริปต์เล็กใน `index.html` ใส่ `data-loaded` ให้ภาพเมื่อโหลดและถอดรหัสเสร็จ · `src/styles/base.css` ซ่อนภาพใน `<main>` ที่ยังไม่โหลดแล้วจางเข้า 0.6 วินาที · ตัวสำรองตอนเปลี่ยนหน้า `src/imgfade.js` · ไม่มี JS = ภาพแสดงตามปกติ
- **กล่องแอนิเมชัน** (`HeroMotion`, `AiMotion`, `PadMotion`) มี `data-nosnippet` และ HTML ที่ prerender แสดงตัวเลขจริง · `PadMotion` (บนสุดของหน้าแรก และหน้าเกี่ยวกับเรา) วางจอแอปจำลองทับภาพทีมงาน โดยภาพยังเป็น `<img>` จริงพร้อม `alt` (เป็น LCP ของหน้า) · ใช้ภาพ 2 ชุด: `about-team.webp` แนวกว้างสำหรับจอคอมพิวเตอร์ และ `about-team-m.webp` แนวตั้งสำหรับมือถือ — เปลี่ยนภาพเมื่อใดต้องวัดจุดแท็บเล็ตใหม่ (ดูหมายเหตุในบล็อก PAD MOTION ของ `components.css`)
  - `LawUpdateMotion` (บนสุดของหน้า `/law-updates/`): จำลอง Hub กฎหมาย + การแจ้งเตือน (กระดิ่ง · อีเมล · แอปบนมือถือ) วน 24 วินาที มีปุ่มหยุด/เล่น · ข้อความเป็นตัวอย่างทั้งหมด (ชื่อกฎหมายเป็นแถบ ไม่มีชื่อเดือนหรือตัวเลขที่อ้างเป็นข้อเท็จจริง) ยกเว้นชื่อหมวดและภาพหน้าปกที่เป็นของจริงจากแอป · หมวดที่ใช้และสวิตช์แบนเนอร์ Push อยู่ที่ `src/data/law-update-motion.js` · ภาพนิ่งตอน prerender / ไม่มี JS / ลดการเคลื่อนไหว = เฟรมแรกของรอบ
- **llms.txt / llms-full.txt** (มาตรฐาน llmstxt.org) สร้างตอน build จาก `src/llms.js` ซึ่งดึงข้อมูลจากไฟล์ใน `src/data/` — แก้ข้อมูลที่ไฟล์ข้อมูล ไม่ต้องแก้ llms.txt เอง · build ล้มถ้าไม่มีลิงก์ทุกหน้าหรือราคาทุกแผน
- **robots.txt** อนุญาตทุกบอต และระบุชื่อบอตของระบบ AI (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended ฯลฯ) ว่ายินดีให้อ่าน
- **sitemap.xml / robots.txt** สร้างตอน build จาก `SITE_URL` และ `lastmod` ใน `ROUTES` (อัปเดต `lastmod` เมื่อแก้เนื้อหาหน้านั้น)
- **หน้า 404**: `noindex` ไม่มี canonical / Open Graph / JSON-LD

### ตัวตรวจอัตโนมัติตอน build (build ล้มเหลวถ้าไม่ผ่าน)
placeholder ใน `index.html` ครบ · หน้าใน `ROUTES` ต้องไม่เรนเดอร์เป็นหน้า 404 (กันลืมเพิ่ม `<Route>` ใน `App.jsx`) · ไม่มี `font-size` เล็กกว่า 13px · ทุกหน้ามี `<h1>` เดียว title description canonical · JSON-LD parse ได้ `@id` อ้างถึงกันครบ ไม่มีค่าว่าง · ราคาใน JSON-LD ตรงกับที่แสดงบนหน้าราคา · ไม่มีโดเมนอื่นนอกจาก `safeact.com` / `member.safeact.com` · ไม่มี `www.safeact.com` และ `hreflang` · ทุกไฟล์ใน `dist/` อ่านได้ (สิทธิ์ 644) · ภาพหน้าปกหมวดครบทุกขนาด · `LawUpdateMotion`: หมวดที่ใช้ยังอยู่และมีภาพ ในกล่องไม่มีชื่อเดือน/ตัวเลขนอกชุดที่กำหนด/SMS/LINE/% ขนาดตัวอักษรเป็น `var(--lf-N)` ที่ ≥ 13px และ keyframes ไม่มี 0%/100%

## Deploy

### แบบที่ใช้อยู่: เซิร์ฟเวอร์ Node หลัง Cloudflare
```bash
git pull && npm install && npm start     # build แล้วเสิร์ฟ dist/ ด้วย server.cjs (พอร์ตจากตัวแปร PORT ค่าเริ่มต้น 8125)
```
`server.cjs` ทำสิ่งต่อไปนี้เอง ไม่ต้องตั้งกฎเพิ่มที่ Cloudflare
- `www.safeact.com` → `safeact.com` และ `http` → `https` (301) — อ่านโปรโตคอลจากส่วนหัว `CF-Visitor` ของ Cloudflare
- `/pricing` → `/pricing/` (301) · URL ที่ไม่มีอยู่ตอบ 404
- ส่งต่อ URL ของเว็บเดิมตาม `public/_redirects`
- แคช: `/build/*` ถาวร · `/assets/*` 30 วัน · HTML ตรวจกับเซิร์ฟเวอร์ทุกครั้ง (บน localhost ไม่แคช)
- `/api/laws.json` ตัวเลขกฎหมายล่าสุด (ดูหัวข้อถัดไป)

#### ตัวเลขกฎหมายเลื่อนเป็นเดือนล่าสุดเอง (ตั้งครั้งเดียว)
หน้า `/law-updates/` และจอแอปบนภาพทีมงานหน้าแรกโหลด `/api/laws.json` หลังเปิดหน้า แล้วเปลี่ยนการ์ด "ล่าสุด" กราฟ 12 เดือน และจำนวนต่อหมวดเป็นข้อมูลล่าสุด
`server.cjs` ดึงจากระบบสมาชิกทุก 30 นาที (ภาพหน้าปกหมวดที่เพิ่ม/เปลี่ยนในแอปดาวน์โหลดลง `dist/assets/laws/` ให้เอง) ต้องมีไฟล์ `.env` ในโฟลเดอร์เว็บบนเซิร์ฟเวอร์
```bash
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # publishable/anon key ตัวเดียวกับของแอป — ห้ามใช้ secret key
```
- `.env` อยู่ใน `.gitignore` ห้าม commit · ใช้ชื่อไม่มี `VITE_` นำหน้า (Vite จะไม่ใส่ลงไฟล์ JavaScript ของเว็บ)
- ยังไม่มี `.env` / ระบบสมาชิกล่ม → `/api/laws.json` ตอบ 503 และหน้าเว็บใช้ชุดที่ build ไว้ (มีวันที่ "ข้อมูล ณ" กำกับ) — เว็บไม่พัง
- ตรวจ: `curl -s https://safeact.com/api/laws.json | head -c 200` ต้องเห็น `syncedIso` เป็นวันนี้ · log ของเซิร์ฟเวอร์ขึ้น `[laws] ข้อมูล ณ …`
- HTML ที่ Google/AI อ่านยังเป็นชุดที่ build ไว้ — รัน `npm run sync:laws` แล้ว build + commit เป็นระยะให้ชุดนี้ใหม่ด้วย

โดเมนหลักอ่านจาก `dist/robots.txt` ที่ build สร้างจาก `SITE_URL` — หลังแก้โค้ดต้อง build และเริ่มเซิร์ฟเวอร์ใหม่ทุกครั้ง

### ทางเลือก: Cloudflare Pages
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
การยืนยันความเป็นเจ้าของกับ Google มี 2 ทาง ใส่ไว้ทั้งคู่ ห้ามลบ: แท็ก `google-site-verification` ใน `index.html` (อยู่ในทุกหน้า) และไฟล์ `public/googleb2f3797a2c209172.html`

จากนั้นที่ Google Search Console: ยืนยันแบบ Domain (DNS) · ส่ง `https://safeact.com/sitemap.xml` · ลบ sitemap ของเว็บเดิม · ตรวจหน้าแรกและหน้าราคาด้วย URL Inspection · ตรวจ JSON-LD ด้วย Rich Results Test (หน้าแรกและ `/features/` จะรายงานรายการ Software App ว่าขาด `offers` และ `aggregateRating`/`review` — เป็นไปตามที่ตั้งใจ เพราะยังไม่มีรีวิวจริงบนหน้าเว็บ ไม่กระทบการเก็บหน้าลงดัชนี และห้ามใส่คะแนนที่ไม่มีอยู่จริง)

## ให้ AI ค้นเจอและแนะนำได้ (ตั้งค่าที่ Cloudflare — ทำครั้งเดียว)
ตรวจเมื่อ 29 ก.ย. 2569: Cloudflare บล็อกบอตของ ChatGPT (GPTBot), Claude (ClaudeBot), Common Crawl (CCBot) และ Amazonbot ด้วย 403 ทุกหน้า ทั้งที่ robots.txt อนุญาต เจ้าของเลือกให้เปิดทุกบอต
1. Cloudflare Dashboard → เลือกโดเมน safeact.com
2. **AI Crawl Control** (หรือ Security → Bots ในบัญชีรุ่นเก่า) → ตั้งบอต AI ทุกตัวเป็น **Allow** · ปิด **Block AI bots** / **Block AI Scrapers and Crawlers**
3. ถ้ามีตัวเลือก **Managed robots.txt** ให้ปิด (ใช้ robots.txt ของเว็บเอง)
4. Security → WAF → Custom rules: ตรวจว่าไม่มีกฎที่บล็อก user agent ของบอต AI
5. SSL/TLS → Edge Certificates → เปิด **Always Use HTTPS**
6. ตรวจผล:
```bash
curl -sI -A "GPTBot/1.2" https://safeact.com/                 # ต้องได้ 200 (ไม่ใช่ 403)
curl -sI -A "ClaudeBot/1.0" https://safeact.com/              # ต้องได้ 200
curl -s https://safeact.com/llms.txt | head -5
```
7. ส่ง sitemap ที่ Google Search Console และ **Bing Webmaster Tools** (ChatGPT Search และ Copilot ใช้ดัชนี Bing)

`server.cjs` ถือว่าเป็นคำขอจากเว็บจริงเมื่อ Host ตรงโดเมน หรือมีส่วนหัว `cf-visitor` ของ Cloudflare (รองรับ tunnel ที่เปลี่ยน Host) จึงย้าย http → https และตั้งแคชถูกต้อง

## มาตรฐานที่วางไว้
- **ขนาดตัวอักษร** (กำหนดใน `src/styles/tokens.css`): เล็กสุดที่ใช้ได้ 13px (`--t-min`) · เมนูส่วนหัวและส่วนท้าย 15px (`--t-nav`) · build ล้มเหลวถ้า CSS มี `font-size` เป็น px ที่เล็กกว่า `--t-min` · ข้อความในกล่องแอนิเมชัน (`.hm`, `.aim`) ย่อขยายตามความกว้างกล่อง ออกแบบให้ ≥ 13px บนมือถือกว้าง 375px ขึ้นไปและจอคอมพิวเตอร์กว้าง 1280px ขึ้นไป · กล่อง `.pm` ล็อกขั้นต่ำ 13px ทุกขนาดจอ
- **Accessibility (ตาม Apple HIG/WCAG 2.2 AA)**: `lang="th"` · skip link · landmark ครบ · h1 หน้าละ 1 · โฟกัสคีย์บอร์ดชัดเจน · ปุ่ม/ลิงก์สูงขั้นต่ำ 44px · FAQ ใช้ `<details>` · ตารางมี scope · `prefers-reduced-motion`
- **ดีไซน์**: token ตามระบบหน้า marketing ของ Apple (globalnav 44px, localnav sticky 52px, ปุ่ม pill, section 140/100/80px, tile มุม 28px)
- **ภาพ**: WebP พร้อม `srcset`/`sizes` · ฟอนต์ Anuphan เก็บในเว็บเอง (`public/assets/fonts/`) · JS/CSS ที่มี hash ออกที่ `/build/`

## ไฟล์ต้นฉบับที่ไม่ได้ใช้บนหน้าเว็บแล้ว (เก็บไว้เป็นต้นฉบับ)
`public/assets/laws-macbook.jpg`, `action-plan.jpg`, `training-dashboard.jpg` (ใช้ `.webp` แทน) · `app-screen.mp4`, `app-screen-poster.webp` (ใช้ชุด `-720` แทน) · `app-screen-720-poster.webp` (ภาพ poster เดิม = เฟรมแรกที่เกือบเป็นจอเปล่า ปัจจุบันใช้ `app-screen-720-start.webp` = เฟรมที่ 5.2 วินาที) · `app-icon.webp` · `og-image.png` (ภาพแชร์ลิงก์ชุดเดิม เก็บไว้เพราะลิงก์ที่แชร์ไปแล้วยังอ้างถึง — ปัจจุบันใช้ `og-logo.png`)
