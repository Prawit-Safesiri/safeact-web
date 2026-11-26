// ซิงก์แผนบริการจากระบบสมาชิก (Supabase ของ member.safeact.com) → src/data/plans.json
// ใช้: npm run sync:plans                 (เขียนไฟล์)
//      npm run sync:plans -- --dry-run    (ดูผลอย่างเดียว ไม่เขียน)
//
// ดึงด้วย scripts/plans-source.mjs (ชุดเดียวกับที่ server.cjs ใช้ทำ /api/plans.json)
// ไฟล์ที่ได้คือชุดที่ build ติดไปกับหน้าเว็บ: Google/AI อ่านชุดนี้ (HTML · JSON-LD · llms.txt) และหน้าเว็บใช้ชุดนี้เมื่อเซิร์ฟเวอร์ดึงข้อมูลล่าสุดไม่ได้
// บนเว็บจริงที่ตั้งคีย์ไว้ หน้าเว็บเปลี่ยนเป็นแผนล่าสุดเอง — รันสคริปต์นี้เมื่อการตั้งค่าแผนในระบบสมาชิกเปลี่ยน แล้ว build + commit
// build ไม่เรียกสคริปต์นี้ (ไม่พึ่งเครือข่าย)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readKey } from './laws-source.mjs';
import { fetchPlans } from './plans-source.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'src/data/plans.json');
const DRY = process.argv.includes('--dry-run');
const die = (msg) => { console.error(`[sync-plans] ${msg}`); process.exit(1); };

let data;
try { data = await fetchPlans(readKey(root)); } catch (e) { die(e.message); }

let prev = null;
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* ครั้งแรก */ }

// ── สรุป ──
const price = (p) => (p.yearly == null ? 'ติดต่อฝ่ายขาย' : p.yearly === 0 ? 'ฟรี' : `฿${p.yearly.toLocaleString('en-US')}/ปี`);
console.log(`ซิงก์ ณ ${data.syncedIso} · ${data.plans.length} แผน · ตารางเปรียบเทียบ ${data.matrix.length} แถว`);
for (const p of data.plans) {
  const old = prev?.plans.find((x) => x.key === p.key);
  console.log(`  [${p.key}] ${p.name} · ${price(p)}${p.badge ? ` · ${p.badge}` : ''}`);
  for (const f of p.features) console.log(`      ${old && !old.features.includes(f) ? '+' : '·'} ${f}`);
  for (const f of old?.features.filter((x) => !p.features.includes(x)) ?? []) console.log(`      - ${f}`);
}
const gone = prev?.plans.filter((x) => !data.plans.some((p) => p.key === x.key)) ?? [];
if (gone.length) console.log(`แผนที่หายไป: ${gone.map((p) => p.name).join(', ')}`);
const same = prev && JSON.stringify({ ...prev, syncedIso: '' }) === JSON.stringify({ ...data, syncedIso: '' });
if (same) console.log('ข้อมูลแผนเหมือนชุดเดิม (เปลี่ยนเฉพาะวันที่ซิงก์)');

if (DRY) { console.log('--dry-run: ไม่ได้เขียนไฟล์'); process.exit(0); }
fs.writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`);
console.log(`เขียน ${path.relative(root, OUT)} แล้ว — ต่อไป: npm run build แล้ว commit`);
