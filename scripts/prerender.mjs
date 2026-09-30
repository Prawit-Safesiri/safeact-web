// Static Site Generation: เรนเดอร์ทุกหน้าเป็น HTML จริงตอน build
// ให้บอตค้นหาอ่านเนื้อหา + meta + JSON-LD ได้โดยไม่ต้องรัน JavaScript แล้วค่อย hydrate ฝั่งเบราว์เซอร์
// มีตัวตรวจท้ายไฟล์: ถ้า SEO พื้นฐานของหน้าใดผิด build จะล้มทันที (ดีกว่าปล่อยขึ้นเว็บแบบเงียบ ๆ)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { TH_MONTHS, TH_MONTHS_SHORT } from '../src/data/law-rules.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, ROUTES, headTags, SITE_URL, APP_URL, PLANS, baht, llmsTxt, LAWS, CATEGORIES, coverSrc, LAW_MOTION, motionCategory } =
  await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const fail = (msg) => { throw new Error(`[prerender] ${msg}`); };

const HEAD = '<!--head-->';
const ROOT = '<div id="root"><!--app-->';
for (const mark of [HEAD, ROOT]) if (!template.includes(mark)) fail(`ไม่พบ placeholder ใน dist/index.html: ${mark}`);

// ใช้ replace แบบฟังก์ชัน: ข้อความที่มี $& หรือ $1 จะไม่ถูกตีความเป็นรูปแบบแทนที่
const page = (url) => {
  const html = template
    .replace(HEAD, () => headTags(url))
    .replace(ROOT, () => `<div id="root" data-ssr="${url}">${render(url)}`);
  const must = ['<title>', 'name="description"', 'name="robots"', 'data-ssr=', '<h1'];
  if (ROUTES[url]) must.push(`rel="canonical" href="${SITE_URL}${url}"`, 'application/ld+json');
  else must.push('noindex');
  for (const m of must) if (!html.includes(m)) fail(`${url}: ไม่พบ ${m}`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${url}: ต้องมี <h1> หนึ่งตัว`);
  // หน้าที่อยู่ใน ROUTES แต่ไม่มี <Route> ใน App.jsx จะเรนเดอร์หน้า 404 ออกมาพร้อม canonical — ห้ามปล่อยขึ้นเว็บ
  if (ROUTES[url] && html.includes('data-page="404"')) fail(`${url}: เรนเดอร์เป็นหน้า 404 (ลืมเพิ่ม <Route> ใน src/App.jsx?)`);
  return html;
};

// ตรวจ JSON-LD: parse ได้ · ทุก {"@id"} ที่อ้างถึงมีโหนดจริงในกราฟเดียวกัน · ไม่มีค่าว่าง
function checkJsonLd(url, html) {
  const m = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return;
  const graph = JSON.parse(m[1])['@graph'];
  // เก็บ @id ของทุกโหนด (รวมโหนดซ้อน เช่นโลโก้และข้อเสนอราคา) แล้วตรวจว่าการอ้างอิง {"@id"} ทุกจุดมีปลายทางจริง
  const ids = new Set();
  const collect = (v) => {
    if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === 'object') {
      if (v['@id'] && Object.keys(v).length > 1) ids.add(v['@id']);
      Object.values(v).forEach(collect);
    }
  };
  const check = (v, key) => {
    if (v === null || v === undefined || v === '') fail(`${url}: JSON-LD มีค่าว่างที่ ${key}`);
    if (Array.isArray(v)) {
      if (!v.length) fail(`${url}: JSON-LD มีอาร์เรย์ว่างที่ ${key}`);
      v.forEach((x) => check(x, key));
    } else if (typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === '@id' && !ids.has(v['@id'])) fail(`${url}: JSON-LD อ้างถึง ${v['@id']} แต่ไม่มีโหนดนี้`);
      keys.forEach((k) => check(v[k], k));
    }
  };
  collect(graph);
  check(graph, '@graph');
  // ราคาใน JSON-LD ต้องเป็นราคาเดียวกับที่แสดงบนหน้าราคา (อ่านจาก Offer ในกราฟ แล้วหาในเนื้อหาที่มองเห็น ไม่นับ <head>)
  if (url === '/pricing/') {
    const visible = html.slice(html.indexOf('<div id="root"')).replace(/<script[\s\S]*?<\/script>/g, '');
    const offers = graph.flatMap((n) => n.hasOfferCatalog?.itemListElement || []);
    if (offers.length !== PLANS.filter((x) => x.yearly > 0).length * 2) fail('/pricing/: จำนวน Offer ใน JSON-LD ไม่ตรงกับแผนที่มีราคา');
    for (const o of offers) if (!visible.includes(baht(Number(o.price)))) fail(`/pricing/: ราคา ${o.price} (${o.name}) ใน JSON-LD ไม่มีแสดงบนหน้า`);
  }
}

// title และ description ของทุกหน้าต้องมีข้อความจริง (แท็กถูกสร้างเสมอ จึงต้องตรวจที่ข้อมูล)
for (const [u, m] of Object.entries(ROUTES)) {
  for (const k of ['title', 'description']) if (typeof m[k] !== 'string' || !m[k].trim()) fail(`ROUTES['${u}'].${k} ว่าง`);
}

for (const url of Object.keys(ROUTES)) {
  const html = page(url);
  checkJsonLd(url, html);
  const out = path.join(dist, url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('prerendered', url);
}
fs.writeFileSync(path.join(dist, '404.html'), page('/404/'));

// sitemap: lastmod มาจาก ROUTES ของแต่ละหน้า (Google ไม่อ่าน priority/changefreq)
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.entries(ROUTES).map(([u, m]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.lastmod || '')) fail(`ROUTES['${u}'].lastmod ต้องเป็นวันที่รูปแบบ YYYY-MM-DD`);
    return `  <url><loc>${SITE_URL}${u}</loc><lastmod>${m.lastmod}</lastmod></url>`;
  }).join('\n') +
  `\n</urlset>\n`);

// robots.txt สร้างจาก SITE_URL เพื่อให้โดเมนตรงกับ canonical เสมอ
// ระบุชื่อบอตของระบบ AI ชัดเจนว่ายินดีให้อ่าน (สิทธิ์เท่ากับ * แต่บางระบบดูเฉพาะกลุ่มที่ระบุชื่อ)
// ⚠ Cloudflare ต้องไม่บล็อกบอตเหล่านี้ด้วย (ดู README หัวข้อ "ให้ AI ค้นเจอ")
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot',
  'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'meta-externalagent', 'Amazonbot'];
fs.writeFileSync(path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# ระบบ AI และเครื่องมือค้นหา AI\n${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// llms.txt (มาตรฐาน llmstxt.org) — สรุปข้อเท็จจริงให้ระบบ AI อ่าน · สร้างจากไฟล์ข้อมูลชุดเดียวกับหน้าเว็บ ตัวเลขจึงตรงกันเสมอ
const llms = llmsTxt();
fs.writeFileSync(path.join(dist, 'llms.txt'), llms.short);
fs.writeFileSync(path.join(dist, 'llms-full.txt'), llms.full);
for (const [name, text] of [['llms.txt', llms.short], ['llms-full.txt', llms.full]]) {
  if (!text.startsWith('# ')) fail(`${name}: ต้องขึ้นต้นด้วยหัวข้อ # ชื่อเว็บ`);
  for (const u of Object.keys(ROUTES)) if (!text.includes(`${SITE_URL}${u}`)) fail(`${name}: ไม่มีลิงก์ ${SITE_URL}${u}`);
  for (const pl of PLANS.filter((x) => x.monthly > 0)) if (!text.includes(baht(pl.monthly))) fail(`${name}: ไม่มีราคา ${pl.name} ${baht(pl.monthly)}`);
}

// ตัวเลขกฎหมาย (src/data/laws.json) เก่าเกิน 45 วัน → เตือน (ไม่ล้ม build) ให้รัน npm run sync:laws
{
  const [y, m, d] = LAWS.syncedIso.split('-').map(Number);
  const days = Math.floor((Date.now() - Date.UTC(y, m - 1, d)) / 864e5);
  if (days > 45) console.warn(`⚠ ตัวเลขกฎหมายซิงก์ล่าสุด ${LAWS.syncedIso} (${days} วันก่อน) — รัน npm run sync:laws แล้ว build ใหม่`);
}
// ภาพหน้าปกหมวด (public/assets/laws/ จาก npm run sync:laws) ต้องมีครบทุกขนาด — ไม่ปล่อยการ์ดภาพเสียขึ้นเว็บ
for (const c of CATEGORIES.filter((x) => x.cover)) {
  for (const w of [640, 320]) {
    if (!fs.existsSync(path.join(dist, coverSrc(c.cover, w)))) fail(`ไม่มีภาพหน้าปกหมวด ${c.title} (${coverSrc(c.cover, w)}) — รัน npm run sync:laws ใหม่`);
  }
}
// ภาพเคลื่อนไหวจำลอง Hub กฎหมาย บนสุดของหน้า /law-updates/ (src/components/LawUpdateMotion.jsx · ค่าใน src/data/law-update-motion.js)
// หมวดที่ใช้ต้องยังมีอยู่และมีภาพหน้าปก · ข้อความในกล่องเป็นตัวอย่างที่ไม่เก่า: ไม่มีชื่อเดือน วันที่ ตัวเลขที่อ้างเป็นข้อเท็จจริง
// หรือสิ่งที่แอปไม่มี (SMS · LINE · คะแนน · เปอร์เซ็นต์ · เลขข้อกฎหมาย)
{
  const cat = motionCategory(CATEGORIES);
  if (!cat) fail(`ภาพจำลองหน้า /law-updates/: ไม่พบหมวด ${LAW_MOTION.follow} ในคลังกฎหมายแล้ว — แก้ src/data/law-update-motion.js`);
  if (!cat.cover) fail(`ภาพจำลองหน้า /law-updates/: หมวด ${cat.title} ไม่มีภาพหน้าปก — เลือกหมวดอื่นใน src/data/law-update-motion.js`);
  const app = render('/law-updates/');
  const a = app.indexOf('class="lum"');
  const b = app.indexOf('class="pm-note"', a);
  if (a < 0 || b < 0) fail('หน้า /law-updates/: ไม่พบภาพเคลื่อนไหวจำลอง (.lum) หรือหมายเหตุใต้ภาพ (.pm-note)');
  const box = app.slice(a, b);
  if (!box.includes(cat.title)) fail(`ภาพจำลองหน้า /law-updates/: ไม่พบชื่อหมวด ${cat.title}`);
  const aria = (/aria-label="([^"]*)"/.exec(box) || [])[1] || '';
  const text = `${box.replace(/<[^>]+>/g, ' ')} ${aria}`.replace(/&[a-z0-9#]+;/gi, ' ').replaceAll(cat.title, ' ');
  const bad = [...TH_MONTHS, ...TH_MONTHS_SHORT, 'SMS', 'LINE', '%', 'คะแนน', 'ความเสี่ยง'].filter((w) => text.includes(w));
  if (/ข้อ\s*[0-9๐-๙]/.test(text)) bad.push('ข้อ n');
  const nums = [...new Set(text.match(/[0-9๐-๙]+/g) || [])].filter((d) => !['1', '2', '3', '9', '41', '30', '01'].includes(d));
  if (bad.length || nums.length) fail(`ภาพจำลองหน้า /law-updates/ มีข้อความที่ไม่ควรมี: ${[...bad, ...nums].join(', ')}`);
}

// ── ตรวจผลลัพธ์ทั้งโฟลเดอร์ ──
const walkDir = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walkDir(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walkDir(dist);

// 1) ทุกไฟล์ต้องอ่านได้โดยผู้ใช้อื่น (กันภาพที่คัดลอกมาแบบ 600 แล้วเซิร์ฟเวอร์อ่านไม่ได้)
const locked = files.filter((f) => (fs.statSync(f).mode & 0o044) !== 0o044);
if (locked.length) fail(`ไฟล์ต่อไปนี้ไม่ได้ตั้งสิทธิ์ให้อ่านได้ (ใช้ chmod 644):\n${locked.join('\n')}`);

// 2) โดเมนใน canonical / og:url / sitemap / robots ต้องเป็นโดเมนหลักเท่านั้น (ยกเว้นลิงก์ไประบบสมาชิก)
const host = new URL(SITE_URL).host;
const appHost = new URL(APP_URL).host;
const brand = host.replace(/^www\./, '');
for (const f of files.filter((x) => /\.(html|xml|txt)$/.test(x))) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/https?:\/\/([a-z0-9.-]*safeact\.com)/gi)) {
    const h = m[1].toLowerCase();
    if (h !== host && h !== appHost) fail(`${path.relative(dist, f)}: พบโดเมน ${h} (โดเมนหลักคือ ${host})`);
  }
  if (/hreflang=/.test(text)) fail(`${path.relative(dist, f)}: ไม่ควรมี hreflang (เว็บภาษาเดียว)`);
  if (f.endsWith('.html') && new RegExp(`www\\.${brand.replace('.', '\\.')}`).test(text)) fail(`${path.relative(dist, f)}: พบข้อความ www.${brand}`);
}

// 3) มาตรฐานขนาดตัวอักษร: ห้ามมี font-size เป็น px ที่เล็กกว่า --t-min (src/styles/tokens.css)
//    (ข้อความในกล่องแอนิเมชันใช้หน่วย --u ตามความกว้างกล่อง ไม่ใช่ px จึงไม่อยู่ในการตรวจนี้)
const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const minPx = Number((/--t-min:\s*(\d+(?:\.\d+)?)px/.exec(tokens) || [])[1]);
if (!minPx) fail('ไม่พบ --t-min ใน src/styles/tokens.css');
for (const f of files.filter((x) => x.endsWith('.css'))) {
  const css = fs.readFileSync(f, 'utf8');
  for (const m of css.matchAll(/font-size:\s*(\d*\.?\d+)px/g)) {
    if (Number(m[1]) < minPx) fail(`${path.relative(dist, f)}: พบ font-size:${m[1]}px เล็กกว่ามาตรฐาน ${minPx}px — ใช้ var(--t-min) แทน`);
  }
}
// กล่อง .lum (ภาพเคลื่อนไหวหน้า /law-updates/): ขนาดตัวอักษรต้องเป็น var(--lf-N) ที่ล็อก ≥ --t-min ด้วย max() · ห้าม font: แบบย่อและ zoom
// keyframes ห้ามมี 0% / 100% / from / to (เฟรมแรกและเฟรมสุดท้ายต้องเป็นค่าตั้งต้น = ภาพนิ่ง จึงวนรอบได้ไม่กระตุก)
{
  const css = fs.readFileSync(path.join(root, 'src/styles/components.css'), 'utf8');
  const start = css.indexOf('/* ═══════ LAW UPDATE MOTION');
  const end = css.indexOf('/* ═══════', start + 10);   // หัวบล็อกถัดไป (หัวบล็อกนี้เองก็ปิดด้วย ═══════)
  if (start < 0 || end < 0) fail('ไม่พบบล็อก LAW UPDATE MOTION ใน src/styles/components.css');
  const block = css.slice(start, end);
  for (const m of block.matchAll(/font-size:\s*([^;}]+)/g)) {
    if (!/^var\(--lf-\d\)$/.test(m[1].trim())) fail(`LAW UPDATE MOTION: font-size:${m[1].trim()} — ใช้ var(--lf-1…6) เท่านั้น`);
  }
  for (const m of block.matchAll(/--lf-(\d):\s*([^;]+);/g)) {
    const px = Number((/^max\((\d+(?:\.\d+)?)px/.exec(m[2].trim()) || [])[1]);
    if (!(px >= minPx)) fail(`LAW UPDATE MOTION: --lf-${m[1]} ต้องเป็น max(${minPx}px ขึ้นไป, …) (พบ ${m[2].trim()})`);
  }
  if (/(^|[;{\s])(font|zoom)\s*:/.test(block)) fail('LAW UPDATE MOTION: ห้ามใช้ font: แบบย่อ หรือ zoom');
  for (const kf of block.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let i = kf.index + kf[0].length;
    const s = i;
    for (let depth = 1; depth && i < block.length; i += 1) { if (block[i] === '{') depth += 1; else if (block[i] === '}') depth -= 1; }
    for (const sel of block.slice(s, i - 1).matchAll(/(?:^|\})\s*([\d.,%\s]+|from|to)\s*\{/g)) {
      for (const p of sel[1].split(',')) if (['0%', '100%', 'from', 'to'].includes(p.trim())) fail(`LAW UPDATE MOTION: @keyframes ${kf[1]} มี ${p.trim()} — ใช้ค่าตั้งต้นเป็นเฟรมแรก/สุดท้าย`);
    }
  }
}
const inline = files.filter((x) => x.endsWith('.html')).flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/font-size:\s*(\d*\.?\d+)px/g)].filter((m) => Number(m[1]) < minPx).map((m) => `${path.relative(dist, f)}: ${m[0]}`));
if (inline.length) fail(`พบ font-size เล็กกว่ามาตรฐาน ${minPx}px ใน HTML:\n${inline.join('\n')}`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`sitemap.xml + robots.txt + 404.html written · ตรวจ ${files.length} ไฟล์ผ่าน`);
