// Static Site Generation: เรนเดอร์ทุกหน้าเป็น HTML จริงตอน build
// ให้บอตค้นหาอ่านเนื้อหา + meta + JSON-LD ได้โดยไม่ต้องรัน JavaScript แล้วค่อย hydrate ฝั่งเบราว์เซอร์
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { render, ROUTES, headTags } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const SITE = 'https://www.safeact.com';
const today = new Date().toISOString().slice(0, 10);

const page = (url) => template
  .replace('<!--head-->', headTags(url))
  .replace('<div id="root"><!--app-->', `<div id="root" data-ssr="${url}">${render(url)}`);

for (const url of Object.keys(ROUTES)) {
  const out = path.join(dist, url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(url));
  console.log('prerendered', url);
}
fs.writeFileSync(path.join(dist, '404.html'), page('/404/'));

fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  Object.entries(ROUTES).map(([u, m]) =>
    `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${m.priority}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('sitemap.xml + 404.html written');
