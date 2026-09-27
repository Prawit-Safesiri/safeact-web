# SafeAct — เว็บไซต์การตลาด (React)

เว็บไซต์ขายบริการสมาชิก SafeAct ของ บริษัท เซฟแอ็กต์ จำกัด · Vite + React 19 + React Router 7 · prerender ทุกหน้าเป็น HTML (SSG)

```bash
npm install
npm run dev      # พัฒนา http://localhost:5180
npm start        # build + เซิร์ฟเวอร์ local http://localhost:8125
npm run build    # dist/ = ไฟล์ static พร้อม deploy (มี sitemap.xml, robots.txt, 404.html)
npm run preview
```

## แหล่งข้อมูลที่ต้องแก้เมื่อข้อมูลธุรกิจเปลี่ยน
| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/plans.js` | แผนและราคา — คัดลอกจาก `safeact-connect-hub/src/lib/plans.ts` ต้องแก้ให้ตรงกันทั้งสองที่ |
| `src/data/company.js` | ชื่อบริษัท เลขผู้เสียภาษี ที่อยู่ โทร อีเมล ลิงก์ระบบสมาชิก |
| `src/data/faq.js` | คำถามที่พบบ่อย (ใช้ทั้งบนหน้าและ JSON-LD FAQPage) |
| `src/seo.js` | title / description / JSON-LD ของทุกหน้า |

## มาตรฐานที่วางไว้
- **SEO**: HTML prerender ทุกหน้า · title/description ไม่ซ้ำ · canonical · hreflang · Open Graph/Twitter · JSON-LD (Organization, WebSite, Product+Offer ราคา THB ไม่รวม VAT, FAQPage, BreadcrumbList) · sitemap.xml · robots.txt · 404 แบบ noindex
- **Accessibility (ตาม Apple HIG/WCAG 2.2 AA)**: `lang="th"` · skip link · landmark ครบ · h1 หน้าละ 1 · โฟกัสคีย์บอร์ดชัดเจน · ปุ่ม/ลิงก์สูงขั้นต่ำ 44px · FAQ ใช้ `<details>` · ตารางมี scope · `prefers-reduced-motion`
- **ดีไซน์**: token ตามระบบหน้า marketing ของ Apple (globalnav 44px, localnav sticky 52px, ปุ่ม pill, section 140/100/80px, tile มุม 28px, footer 12px)

## Mock ที่ต้องแทนด้วยไฟล์จริง
ทุกกล่อง `<Media>` (IMAGE / VIDEO) ระบุขนาดไฟล์ที่ต้องเตรียมไว้บนกล่อง แทนที่ด้วย `<img>`/`<video>` ได้ทันที
