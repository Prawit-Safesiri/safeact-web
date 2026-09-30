// ดึงข้อมูลกฎหมายจากระบบสมาชิก (Supabase ของ member.safeact.com) — ใช้ร่วมกัน 2 ที่
//   • scripts/sync-laws.mjs → src/data/laws.json + ภาพหน้าปกหมวดใน public/assets/laws/ (ชุดที่ build ติดไปกับหน้าเว็บ)
//   • server.cjs            → /api/laws.json ทุก 30 นาที ให้หน้าเว็บเปลี่ยนเป็นเดือนล่าสุดเองโดยไม่ต้อง build ใหม่
//
// ใช้ตัวนับชุดเดียวกับแอป จึงได้ตัวเลขตรงกับหน้า "อัปเดตกฎหมาย" ในระบบสมาชิก
//   • รายเดือน  = RPC law_month_counts()  (เดือนจากวันที่ประกาศ ถ้าไม่มีใช้วันที่เพิ่มเข้าคลัง · ยกเลิก > แก้ไข > ใหม่)
//   • รายหมวด  = ตาราง law_categories (doc_type = กฎหมาย หรือว่าง) + RPC get_category_popularity() (เก็บเฉพาะจำนวนฉบับ)
//   • ทั้งคลัง  = จำนวนแถวในตาราง laws
//   • ตัวอย่างรายการ = RPC laws_in_month() ของเดือนล่าสุด (latestIndex) และเดือนก่อนหน้า เก็บ 6 ฉบับแรกตามลำดับของแอป (เพิ่มเข้าคลังล่าสุดก่อน)
//     เก็บเฉพาะชื่อ หน่วยงาน วันประกาศ วันมีผล ประเภทการเปลี่ยนแปลง และมี/ไม่มีสรุปและฉบับเต็ม — ไม่เก็บเนื้อหาสรุป
//   • ภาพหน้าปกหมวด = law_categories.cover (ภาพเดียวกับที่แอปแสดง อยู่ในที่เก็บไฟล์ของระบบ)
//     ย่อด้วยบริการย่อภาพของ Supabase เป็น webp 16:9 สองขนาด แล้วเก็บเป็นไฟล์ของเว็บเอง — ผู้ชมไม่ต้องโหลดภาพจากโดเมนอื่น
// คีย์: publishable/anon key เท่านั้น (อ่านได้เฉพาะข้อมูลที่แอปเปิดให้ทุกคน) — ไม่เก็บคีย์ในรีโพ ไม่พิมพ์คีย์ และข้อมูลที่ส่งออกไม่มีคีย์หรือที่อยู่ระบบ
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { cleanTitle, shortDesc, latestIndex } from '../src/data/law-rules.js';

// ── คีย์ ──
function readEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^\s*(VITE_)?(SUPABASE_URL|SUPABASE_PUBLISHABLE_KEY)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !out[m[2]]) out[m[2]] = m[3].replace(/^["']|["']$/g, '');
  }
  return out;
}
// ลำดับที่อ่าน: ตัวแปร env → .env ของเว็บนี้ → ../safeact-connect-hub/.env (เครื่องที่มีโปรเจ็กต์แอปอยู่ข้างกัน)
export function readKey(root) {
  const files = [path.join(root, '.env'), path.join(root, '..', 'safeact-connect-hub', '.env')].map(readEnvFile);
  const pick = (k) => process.env[k] || process.env[`VITE_${k}`] || files.map((f) => f[k]).find(Boolean) || '';
  const url = pick('SUPABASE_URL').replace(/\/+$/, '');
  const key = pick('SUPABASE_PUBLISHABLE_KEY');
  if (!url || !key) throw new Error('ไม่พบ SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (ตั้งในตัวแปร env หรือไฟล์ .env ของเว็บ — ดู README)');
  if (!url.startsWith('https://')) throw new Error('SUPABASE_URL ต้องขึ้นต้นด้วย https://');
  if (key.startsWith('sb_secret_')) throw new Error('คีย์นี้เป็น secret key — ใช้ได้เฉพาะ publishable/anon key');
  if (!key.startsWith('sb_publishable_')) {
    let role = '';
    try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch { /* ไม่ใช่ JWT */ }
    if (role !== 'anon') throw new Error(`คีย์ต้องเป็น anon/publishable (พบ role: ${role || 'ไม่ทราบ'})`);
  }
  return { url, key };
}

// ── ข้อมูล ──
const pad = (n) => String(n).padStart(2, '0');
const SAMPLE_SIZE = 6;
const kindOf = (status) => (/ยกเลิก/.test(status || '') ? 'repealed' : /แก้ไข/.test(status || '') ? 'amended' : 'new');   // กติกาเดียวกับ law_change_kind() ของแอป
const dash = (t) => { const s = String(t ?? '').replace(/\s+/g, ' ').trim(); return s && s !== '-' ? s : null; };

// คืน { data (รูปแบบเดียวกับ laws.json ยังไม่มีภาพ), covers: Map slug → ที่อยู่ภาพในที่เก็บไฟล์, dropped, warnings }
// strict = ตัวอย่างรายการต้องครบเท่ายอดของเดือน (ตอนซิงก์) · เซิร์ฟเวอร์ไม่ strict (มีฉบับเพิ่มระหว่างดึงได้)
export async function fetchLaws({ url, key }, { strict = false } = {}) {
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const call = async (p, init = {}) => {
    const res = await fetch(`${url}/rest/v1/${p}`, { ...init, headers: { ...headers, ...init.headers }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`${p.split('?')[0]} → HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`);
    return res;
  };
  const warnings = [];
  const [monthsRaw, popularity, categoriesRaw, totalRes] = await Promise.all([
    call('rpc/law_month_counts', { method: 'POST', body: '{}' }).then((r) => r.json()),
    call('rpc/get_category_popularity', { method: 'POST', body: '{}' }).then((r) => r.json()),
    call('law_categories?select=slug,title,description,cover,doc_type,sort_order,created_at&order=sort_order.asc,created_at.asc').then((r) => r.json()),
    call('laws?select=id', { method: 'HEAD', headers: { Prefer: 'count=exact', Range: '0-0' } }),
  ]);
  const total = Number((totalRes.headers.get('content-range') || '').split('/')[1]);
  if (!Number.isInteger(total) || total <= 0) throw new Error('อ่านจำนวนแถวของตาราง laws ไม่ได้');
  if (!Array.isArray(monthsRaw) || !monthsRaw.length) throw new Error('law_month_counts ว่าง');
  if (!Array.isArray(categoriesRaw) || !categoriesRaw.length) throw new Error('law_categories ว่าง');

  // ── รายเดือน ──
  const syncedIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());   // YYYY-MM-DD เวลาไทย
  const syncYm = syncedIso.slice(0, 7);
  let sumAll = 0;
  const byYm = new Map();
  for (const r of monthsRaw) {
    const ym = `${Number(r.year_be) - 543}-${pad(r.month)}`;
    const row = { ym, total: r.total, new: r.new_count, amended: r.amended_count, repealed: r.repealed_count };
    for (const k of ['total', 'new', 'amended', 'repealed']) if (!Number.isInteger(row[k]) || row[k] < 0) throw new Error(`${ym}: ค่า ${k} ไม่ถูกต้อง`);
    if (row.new + row.amended + row.repealed !== row.total) throw new Error(`${ym}: ใหม่ + แก้ไข + ยกเลิก ไม่เท่ากับยอดรวม`);
    sumAll += row.total;
    byYm.set(ym, row);
  }
  if (sumAll !== total) throw new Error(`ผลรวมรายเดือน (${sumAll}) ไม่เท่ากับจำนวนทั้งคลัง (${total})`);
  const future = [...byYm.keys()].filter((ym) => ym > syncYm);
  if (future.length) warnings.push(`เดือนที่เลยวันนี้ (ไม่แสดงบนเว็บ): ${future.join(', ')}`);
  // 24 เดือนติดกัน สิ้นสุดที่เดือนปัจจุบัน (เวลาไทย) · เดือนที่ไม่มีกฎหมายเติม 0 → ขึ้นเดือนใหม่แล้วกราฟเลื่อนเอง
  const months = [];
  let [y, m] = syncYm.split('-').map(Number);
  for (let i = 0; i < 24; i += 1) {
    const ym = `${y}-${pad(m)}`;
    months.unshift(byYm.get(ym) || { ym, total: 0, new: 0, amended: 0, repealed: 0 });
    m -= 1; if (m === 0) { m = 12; y -= 1; }
  }

  // ── ตัวอย่างรายการ (หน้าต่าง "ดูตัวอย่างรายการ" ของการ์ดเดือนล่าสุดในหน้า /law-updates/) ──
  const li = latestIndex(months);
  const samples = {};
  for (const mon of [months[li - 1], months[li]]) {
    if (!mon?.total) continue;
    const [yy, mm] = mon.ym.split('-').map(Number);
    const rows = await call('rpc/laws_in_month', { method: 'POST', body: JSON.stringify({ p_year_be: yy + 543, p_month: mm }) }).then((r) => r.json());
    if (!Array.isArray(rows)) throw new Error(`laws_in_month ${mon.ym}: ผลไม่ใช่รายการ`);
    if (rows.length !== mon.total) {
      const msg = `laws_in_month ${mon.ym}: ได้ ${rows.length} แถว แต่ยอดรวมเดือนนี้ ${mon.total}`;
      if (strict) throw new Error(msg);
      warnings.push(msg);
    }
    samples[mon.ym] = rows.slice(0, SAMPLE_SIZE).map((r) => {
      const title = dash(r.title);
      if (!title) throw new Error(`laws_in_month ${mon.ym}: พบฉบับที่ไม่มีชื่อ`);
      return Object.fromEntries(Object.entries({
        title, ministry: dash(r.ministry), announce: dash(r.announce_date), effective: dash(r.effective), kind: kindOf(r.status),
        summary: Boolean(dash(r.summary)), pdf: Boolean(dash(r.full_text_url)),
      }).filter(([, v]) => v !== null));
    });
  }

  // ── หมวดกฎหมาย (เฉพาะจำนวนฉบับ — ไม่เก็บจำนวนผู้ติดตาม) ──
  const countBySlug = new Map(popularity.map((p) => [p.slug, Number(p.law_count) || 0]));
  const storage = `${url}/storage/v1/object/public/`;
  const kept = [];
  const dropped = [];
  const covers = new Map();
  categoriesRaw.forEach((c, i) => {
    if ((c.doc_type ?? 'กฎหมาย') !== 'กฎหมาย') return;          // เหมือนแอป: doc_type ว่าง (NULL) นับเป็นกฎหมาย · อื่น ๆ ไม่อยู่ในหมวดกฎหมายไทย
    const count = countBySlug.get(c.slug) ?? 0;
    const title = cleanTitle(c.title || '');
    if (!title) throw new Error(`หมวด ${c.slug}: ไม่มีชื่อ`);
    if (count <= 0) { dropped.push(`${title} (0 ฉบับ)`); return; }
    const desc = shortDesc(c);
    kept.push({ slug: c.slug, title, ...(desc ? { desc } : {}), count, order: i });
    // ดึงภาพเฉพาะจากที่เก็บไฟล์ของระบบเอง — ภาพจากที่อื่นหรือแบบ base64 ข้ามไป (หน้าเว็บแสดงกรอบภาพเปล่าแทน)
    const cover = String(c.cover || '').split('?')[0];
    if (cover.startsWith(storage) && !cover.includes('..')) covers.set(c.slug, cover.slice(storage.length));
    else if (cover) warnings.push(`หมวด ${title}: ภาพหน้าปกไม่ได้อยู่ในที่เก็บไฟล์ของระบบ — ไม่ดึง`);
  });
  if (new Set(kept.map((c) => c.slug)).size !== kept.length) throw new Error('slug หมวดซ้ำ');
  if (!kept.length) throw new Error('ไม่มีหมวดกฎหมาย');

  return {
    data: { syncedIso, total, months, samples, categories: kept.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)) },
    covers,
    dropped,
    warnings,
  };
}

// ── ภาพหน้าปกหมวด ──
export const COVER_SIZES = [640, 320];   // 16:9 → 640×360 (การ์ดบนจอคอมและแท็บเล็ต) · 320×180 (ภาพเล็กบนมือถือ)
// ชื่อไฟล์ = ชื่อไฟล์เดิมในที่เก็บ (เฉพาะ a-z 0-9 -) + รหัสสั้นจากที่อยู่ภาพ — อัปโหลดภาพใหม่ในแอปได้ชื่อใหม่ เบราว์เซอร์จึงไม่ค้างภาพเก่า
export const coverName = (objectPath) => {
  const base = path.basename(objectPath).replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return `${base ? `${base}-` : ''}${crypto.createHash('sha1').update(objectPath).digest('hex').slice(0, 6)}`;
};
export const coverFile = (name, w) => `${name}-${w}.webp`;

// ดาวน์โหลดภาพที่ยังไม่มีในโฟลเดอร์ dir (มีครบแล้วไม่ดึงซ้ำ) · dry = ไม่ดาวน์โหลด
// คืน { names: Map slug → ชื่อภาพ (เฉพาะภาพที่มีไฟล์ครบทุกขนาด), fetched: จำนวนไฟล์ที่ดาวน์โหลด, missing: จำนวนไฟล์ที่ยังขาด, warnings }
export async function saveCovers({ url }, covers, dir, { dry = false } = {}) {
  const names = new Map();
  const warnings = [];
  let fetched = 0;
  let missing = 0;
  if (!dry) fs.mkdirSync(dir, { recursive: true });
  const queue = [...covers];
  const worker = async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      const [slug, objectPath] = job;
      const name = coverName(objectPath);
      const need = COVER_SIZES.filter((w) => !fs.existsSync(path.join(dir, coverFile(name, w))));
      if (dry) { missing += need.length; if (!need.length) names.set(slug, name); continue; }
      let ok = true;
      for (const w of need) {
        const src = `${url}/storage/v1/render/image/public/${objectPath.split('/').map(encodeURIComponent).join('/')}?width=${w}&height=${(w * 9) / 16}&resize=cover&quality=75`;
        try {
          const res = await fetch(src, { headers: { Accept: 'image/webp' }, signal: AbortSignal.timeout(20000) });
          const buf = res.ok ? Buffer.from(await res.arrayBuffer()) : Buffer.alloc(0);
          // ต้องเป็น webp จริง (RIFF....WEBP) และไม่ใหญ่ผิดปกติ
          if (res.headers.get('content-type') !== 'image/webp' || buf.length > 400_000 || buf.subarray(0, 4).toString() !== 'RIFF' || buf.subarray(8, 12).toString() !== 'WEBP') {
            throw new Error(`HTTP ${res.status} ${res.headers.get('content-type')} ${buf.length} ไบต์`);
          }
          const f = path.join(dir, coverFile(name, w));
          fs.writeFileSync(`${f}.tmp`, buf, { mode: 0o644 });
          fs.renameSync(`${f}.tmp`, f);   // เขียนไฟล์ชั่วคราวก่อน เว็บจะไม่เห็นภาพครึ่งไฟล์
          fetched += 1;
        } catch (e) {
          ok = false;
          warnings.push(`ภาพหน้าปก ${path.basename(objectPath)} (${w}px) ดึงไม่ได้: ${e.message}`);
        }
      }
      if (ok) names.set(slug, name);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));   // ครั้งละ 4 ภาพ
  return { names, fetched, missing, warnings };
}

// ── สำหรับ server.cjs ── ข้อมูลล่าสุด + ภาพหน้าปกที่ยังไม่มี (ดาวน์โหลดลง dist/assets/laws/ ข้างภาพชุดที่ build ไว้)
export async function liveLaws(root) {
  const key = readKey(root);
  const { data, covers, warnings } = await fetchLaws(key);
  const saved = await saveCovers(key, covers, path.join(root, 'dist', 'assets', 'laws'));
  for (const c of data.categories) if (saved.names.has(c.slug)) c.cover = saved.names.get(c.slug);
  return { data, fetched: saved.fetched, warnings: [...warnings, ...saved.warnings] };
}
