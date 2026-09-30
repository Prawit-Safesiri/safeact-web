// ตัวเลขกฎหมายจากระบบสมาชิก — มี 2 ชุด ผ่าน deriveLaws() เดียวกัน
//   • ชุดที่ build ติดไปกับหน้าเว็บ = src/data/laws.json (npm run sync:laws · scripts/sync-laws.mjs)
//     Google/AI อ่านชุดนี้ · ใช้ใน JSON-LD · llms.txt · FAQ · LAW_LIBRARY (src/data/service.js)
//   • ชุดล่าสุด = /api/laws.json ที่ server.cjs ดึงจากระบบสมาชิกทุก 30 นาที (useLiveLaws ใน laws-live.js)
//     หน้า /law-updates/ และจอแอปบนภาพทีมงานเปลี่ยนเป็นเดือนล่าสุดเองโดยไม่ต้อง build ใหม่
// ⚠ ห้ามแก้ตัวเลขในหน้าเว็บเอง · ตัวเลขตรงกับหน้า "อัปเดตกฎหมาย" ของแอป ณ วันที่ดึงข้อมูล
import DATA from './laws.json';
import { thDate, thMonth, groupOf, byCount, latestIndex } from './law-rules.js';

// ตรวจรูปแบบข้อมูล (ทั้งไฟล์ที่ซิงก์และข้อมูลจากเซิร์ฟเวอร์) — คืนชื่อส่วนที่ผิด หรือ '' ถ้าถูกต้อง
const isCount = (v) => Number.isInteger(v) && v >= 0;
export function checkLaws(d) {
  if (!d || typeof d !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(d.syncedIso)) return 'syncedIso';
  if (!isCount(d.total) || d.total === 0) return 'total';
  if (!Array.isArray(d.months) || d.months.length !== 24) return 'months';
  for (const r of d.months) {
    if (!/^\d{4}-\d{2}$/.test(r?.ym) || !['total', 'new', 'amended', 'repealed'].every((k) => isCount(r[k]))
      || r.new + r.amended + r.repealed !== r.total) return `months ${r?.ym}`;
  }
  if (!Array.isArray(d.categories) || !d.categories.length) return 'categories';
  if (d.categories.some((c) => typeof c?.slug !== 'string' || typeof c.title !== 'string' || !isCount(c.count))) return 'categories';
  if (d.samples != null && (typeof d.samples !== 'object' || Object.values(d.samples).some((s) => !Array.isArray(s)))) return 'samples';
  return '';
}
{
  const bad = checkLaws(DATA);
  if (bad) throw new Error(`src/data/laws.json ไม่ถูกต้อง (${bad}) — รัน npm run sync:laws ใหม่`);
}

// หมวดกฎหมาย 36 หมวด แบ่ง 2 กลุ่ม เรียงจำนวนฉบับมากไปน้อย
const GROUPS = [
  { key: 'safety', title: 'กฎหมายความปลอดภัยในการทำงาน', phrases: ['กฎหมายความปลอดภัย', 'ในการทำงาน'], lead: 'กฎกระทรวงด้านความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน และประกาศที่เกี่ยวข้อง' },
  { key: 'related', title: 'กฎหมายเฉพาะด้านที่เกี่ยวข้อง', phrases: ['กฎหมายเฉพาะด้าน', 'ที่เกี่ยวข้อง'], lead: 'โรงงาน วัตถุอันตราย อาคาร สิ่งแวดล้อม พลังงาน สาธารณสุข แรงงาน และการขนส่ง' },
];

// ภาพหน้าปกหมวด = ภาพเดียวกับในแอป ย่อเป็น webp 2 ขนาด (640×360 · 320×180) เก็บที่ /assets/laws/
// ข้อมูลจากเซิร์ฟเวอร์ที่ยังไม่มีภาพของหมวดใด (เช่น ดาวน์โหลดไม่สำเร็จ) ใช้ภาพชุดที่ build ไว้แทน
export const coverSrc = (name, w) => `/assets/laws/${name}-${w}.webp`;
const COVERS = new Map(DATA.categories.filter((c) => c.cover).map((c) => [c.slug, c.cover]));

export function deriveLaws(d) {
  const syncYm = d.syncedIso.slice(0, 7);
  // sample = ตัวอย่างรายการ 6 ฉบับแรกของเดือน (มีเฉพาะเดือนล่าสุดและเดือนก่อนหน้า · หน้าต่างตัวอย่างในหน้า /law-updates/)
  const withLabels = (r) => ({ ...r, ...thMonth(r.ym), partial: r.ym === syncYm, sample: d.samples?.[r.ym] ?? [] });
  // 12 เดือนล่าสุด เรียงเก่า → ใหม่ (เดือนสุดท้ายคือเดือนที่ดึงข้อมูล ยังนับไม่ครบเดือน) · ขึ้นเดือนใหม่แล้วเลื่อนเอง
  const MONTHS12 = d.months.slice(-12).map(withLabels);
  const sum = (k) => MONTHS12.reduce((s, r) => s + r[k], 0);
  const i = latestIndex(MONTHS12);
  const categories = d.categories.map((c) => (c.cover || !COVERS.has(c.slug) ? c : { ...c, cover: COVERS.get(c.slug) }));
  const CATEGORY_GROUPS = GROUPS.map((g) => ({ ...g, items: categories.filter((c) => groupOf(c) === g.key).sort(byCount) }));
  return {
    LAWS: { total: d.total, syncedIso: d.syncedIso, syncedTh: thDate(d.syncedIso), syncedDay: Number(d.syncedIso.slice(8)) },
    MONTHS12,
    SUM12: {
      total: sum('total'), new: sum('new'), amended: sum('amended'), repealed: sum('repealed'),
      from: MONTHS12[0].long, to: MONTHS12.at(-1).long,
    },
    LATEST: MONTHS12[i],                                                    // เดือนใหม่สุดที่มีกฎหมายแล้ว (latestIndex)
    PREV: i > 0 ? MONTHS12[i - 1] : withLabels(d.months.at(-13)),           // เดือนก่อนหน้าเดือนล่าสุด
    PEAK: MONTHS12.reduce((a, b) => (b.total > a.total ? b : a)),
    CATEGORY_GROUPS,
    CATEGORIES: CATEGORY_GROUPS.flatMap((g) => g.items),
  };
}

// ชุดที่ build ไว้
export const SNAPSHOT = deriveLaws(DATA);
export const { LAWS, MONTHS12, SUM12, LATEST, PREV, PEAK, CATEGORY_GROUPS, CATEGORIES } = SNAPSHOT;
