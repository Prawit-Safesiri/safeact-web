// ซิงก์ข้อมูลกฎหมายจากระบบสมาชิก (Supabase ของ member.safeact.com) → src/data/laws.json + ภาพหน้าปกหมวด public/assets/laws/
// ใช้: npm run sync:laws            (เขียนไฟล์)
//      npm run sync:laws -- --dry-run   (ดูผลอย่างเดียว ไม่เขียน ไม่ดาวน์โหลดภาพ)
//      npm run sync:laws -- --force     (ยอมเขียนแม้ตัวเลขลดลงผิดปกติ)
//
// ดึงด้วย scripts/laws-source.mjs (ชุดเดียวกับที่ server.cjs ใช้ทำ /api/laws.json) — กติกาการนับและเรื่องคีย์อยู่ที่ไฟล์นั้น
// ไฟล์ที่ได้คือชุดที่ build ติดไปกับหน้าเว็บ: Google/AI อ่านชุดนี้ (HTML · JSON-LD · llms.txt) และหน้าเว็บใช้ชุดนี้เมื่อเซิร์ฟเวอร์ดึงข้อมูลล่าสุดไม่ได้
// บนเว็บจริงที่ตั้งคีย์ไว้ หน้าเว็บเปลี่ยนเป็นตัวเลขล่าสุดเอง — รันสคริปต์นี้เมื่ออยากให้ชุดที่ build ไว้ใหม่ด้วย แล้ว build + commit
// build ไม่เรียกสคริปต์นี้ (ไม่พึ่งเครือข่าย)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { groupOf, byCount, thDate } from '../src/data/law-rules.js';
import { readKey, fetchLaws, saveCovers, coverFile, COVER_SIZES } from './laws-source.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'src/data/laws.json');
const COVER_DIR = path.join(root, 'public/assets/laws');   // สคริปต์นี้ดูแลโฟลเดอร์นี้เองทั้งหมด (ลบภาพที่ไม่ใช้แล้ว)
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const die = (msg) => { console.error(`[sync-laws] ${msg}`); process.exit(1); };

let key;
let got;
try {
  key = readKey(root);
  got = await fetchLaws(key, { strict: true });
} catch (e) { die(e.message); }
const { data, covers, dropped, warnings } = got;
const { syncedIso, total, months, samples, categories } = data;

// ── ภาพหน้าปกหมวด ──
const saved = await saveCovers(key, covers, COVER_DIR, { dry: DRY });
for (const c of categories) if (saved.names.has(c.slug)) c.cover = saved.names.get(c.slug);
const used = new Set(categories.filter((c) => c.cover).flatMap((c) => COVER_SIZES.map((w) => coverFile(c.cover, w))));
const stale = fs.existsSync(COVER_DIR) ? fs.readdirSync(COVER_DIR).filter((f) => /\.webp(\.tmp)?$/.test(f) && !used.has(f)) : [];

// ── เทียบกับไฟล์เดิม ──
let prev = null;
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* ครั้งแรก */ }
if (prev && !FORCE) {
  if (total < prev.total * 0.95) die(`จำนวนทั้งคลังลดลงผิดปกติ ${prev.total} → ${total} (ใช้ --force ถ้าตั้งใจ)`);
  const gone = prev.categories.filter((c) => !categories.some((k) => k.slug === c.slug));
  if (gone.length > 3) die(`หมวดหายไป ${gone.length} หมวด (ใช้ --force ถ้าตั้งใจ): ${gone.map((c) => c.title).join(', ')}`);
}

// ── สรุป ──
for (const w of [...warnings, ...saved.warnings]) console.warn(`[sync-laws] ${w}`);
const last12 = months.slice(-12);
const sum = (arr, k) => arr.reduce((s, r) => s + r[k], 0);
const groups = { safety: [], related: [] };
for (const c of categories) groups[groupOf(c)].push(c);
console.log(`ซิงก์ ณ ${thDate(syncedIso)} · ทั้งคลัง ${prev ? `${prev.total} → ` : ''}${total} ฉบับ`);
console.log(`12 เดือนล่าสุด (${last12[0].ym} – ${last12.at(-1).ym}): ${sum(last12, 'total')} ฉบับ = ใหม่ ${sum(last12, 'new')} · แก้ไข ${sum(last12, 'amended')} · ยกเลิก ${sum(last12, 'repealed')}`);
console.log(last12.map((r) => `  ${r.ym}  ${String(r.total).padStart(3)}  (${r.new}/${r.amended}/${r.repealed})`).join('\n'));
console.log(`หมวดกฎหมาย ${categories.length} หมวด · กลุ่มความปลอดภัย ${groups.safety.length} · กลุ่มหน่วยงานที่เกี่ยวข้อง ${groups.related.length}`);
for (const [g, list] of Object.entries(groups)) {
  console.log(`  [${g}]`);
  for (const c of [...list].sort(byCount)) console.log(`    ${String(c.count).padStart(4)}  ${c.cover ? '▣' : '□'} ${c.title}${c.desc ? `  · ${c.desc}` : ''}`);
}
if (dropped.length) console.log(`ไม่แสดง (ยังไม่มีกฎหมายในหมวด): ${dropped.join(', ')}`);
const noCover = categories.filter((c) => !covers.has(c.slug)).map((c) => c.title);
console.log(`ภาพหน้าปก (▣): ${categories.length - noCover.length} หมวด · ดาวน์โหลดใหม่ ${saved.fetched} ไฟล์${DRY && saved.missing ? ` · ยังไม่มี ${saved.missing} ไฟล์` : ''}${stale.length ? ` · ${DRY ? 'จะลบ' : 'ลบ'}ภาพที่ไม่ใช้แล้ว ${stale.length} ไฟล์` : ''}`);
if (noCover.length) console.log(`  ยังไม่มีภาพหน้าปกในแอป (หน้าเว็บแสดงกรอบภาพเปล่า): ${noCover.join(', ')}`);
if (prev) {
  const changed = months.filter((r) => { const o = prev.months.find((x) => x.ym === r.ym); return o && o.total !== r.total; });
  if (changed.length) console.log(`เดือนที่ตัวเลขเปลี่ยน: ${changed.map((r) => `${r.ym} ${prev.months.find((x) => x.ym === r.ym).total}→${r.total}`).join(', ')}`);
}
for (const [ym, rows] of Object.entries(samples)) console.log(`ตัวอย่างรายการ ${ym}: ${rows.length} ฉบับ\n${rows.map((r) => `  · ${r.title.slice(0, 70)}`).join('\n')}`);

if (DRY) { console.log('--dry-run: ไม่ได้เขียนไฟล์'); process.exit(0); }
for (const f of stale) fs.unlinkSync(path.join(COVER_DIR, f));
fs.writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`เขียน ${path.relative(root, OUT)} แล้ว — ต่อไป: npm run build แล้ว commit (รวมภาพใน public/assets/laws/)`);
