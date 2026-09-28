// Static Site Generation: เรนเดอร์ทุกหน้าเป็น HTML จริงตอน build
// ให้บอตค้นหาอ่านเนื้อหา + meta + JSON-LD ได้โดยไม่ต้องรัน JavaScript แล้วค่อย hydrate ฝั่งเบราว์เซอร์
// มีตัวตรวจท้ายไฟล์: ถ้า SEO พื้นฐานของหน้าใดผิด build จะล้มทันที (ดีกว่าปล่อยขึ้นเว็บแบบเงียบ ๆ)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, ROUTES, headTags, SITE_URL, APP_URL, PLANS, baht } =
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
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

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
const inline = files.filter((x) => x.endsWith('.html')).flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/font-size:\s*(\d*\.?\d+)px/g)].filter((m) => Number(m[1]) < minPx).map((m) => `${path.relative(dist, f)}: ${m[0]}`));
if (inline.length) fail(`พบ font-size เล็กกว่ามาตรฐาน ${minPx}px ใน HTML:\n${inline.join('\n')}`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`sitemap.xml + robots.txt + 404.html written · ตรวจ ${files.length} ไฟล์ผ่าน`);
