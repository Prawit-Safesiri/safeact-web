// กติกาที่ใช้ร่วมกันระหว่างสคริปต์ซิงก์ (scripts/sync-laws.mjs · Node ล้วน) และหน้าเว็บ (src/data/laws.js)
// ⚠ ไฟล์นี้ห้าม import อะไรเลย — Node อ่านได้ตรง ๆ โดยไม่ผ่าน Vite
// ไม่ใช้ Date() / Intl / localeCompare เพื่อให้ผลตอน prerender กับในเบราว์เซอร์ตรงกันทุกตัวอักษร (ไม่เกิด hydration mismatch)

export const TH_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
export const TH_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// '2026-09-29' → '29 ก.ย. 2569'
export const thDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${TH_MONTHS_SHORT[m - 1]} ${y + 543}`;
};
// '2026-09' → { long: 'กันยายน 2569', short: 'ก.ย.', yearBe: 2569, yy: '69' }
export const thMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  const yearBe = y + 543;
  return { long: `${TH_MONTHS[m - 1]} ${yearBe}`, name: TH_MONTHS[m - 1], short: TH_MONTHS_SHORT[m - 1], yearBe, yy: String(yearBe).slice(-2) };
};
// วันที่รูปแบบ YYYY-MM-DD เทียบกันแบบข้อความได้ตรง
export const maxIso = (...d) => d.filter(Boolean).sort().at(-1);

// เดือน "ล่าสุด" = เดือนใหม่สุดที่มีกฎหมายแล้ว — ต้นเดือนที่ยังไม่มีฉบับใหม่ การ์ดล่าสุดยังแสดงเดือนก่อน (ไม่หายไป)
// แล้วเลื่อนเป็นเดือนใหม่เองเมื่อมีฉบับแรก · ใช้ทั้งหน้าเว็บ (laws.js) และตอนเลือกเดือนที่เก็บตัวอย่างรายการ (laws-source.mjs)
export const latestIndex = (months) => {
  for (let i = months.length - 1; i >= 0; i -= 1) if (months[i].total > 0) return i;
  return months.length - 1;
};

// ── จัดกลุ่มหมวดกฎหมาย (36 หมวดของระบบสมาชิก) ──
// safety  = กฎกระทรวงด้านความปลอดภัย อาชีวอนามัยฯ และประกาศภายใต้ พ.ร.บ.ความปลอดภัยฯ
// related = กฎหมายเฉพาะด้านจากหน่วยงานอื่น (โรงงาน วัตถุอันตราย อาคาร สิ่งแวดล้อม พลังงาน สาธารณสุข แรงงาน ขนส่ง ฯลฯ)
// ถ้าหมวดใดจัดผิดกลุ่ม ให้ระบุ slug ใน GROUP_OVERRIDES แทนการแก้กติกา
const key = (t) => t.replace(/[\s.ฯ]/g, '');   // "พ.ร.บ." และ "พรบ.ฯ" → "พรบ"
export const GROUP_OVERRIDES = {};             // slug → 'safety' | 'related'
export const groupOf = (c) => GROUP_OVERRIDES[c.slug]
  ?? (key(c.title).startsWith('กฎกระทรวง') || /พรบ.*ความปลอดภัย/.test(key(c.title)) ? 'safety' : 'related');

// เรียงจำนวนฉบับมากไปน้อย · เท่ากันใช้ลำดับจากระบบสมาชิก แล้วตาม slug (ไม่ใช้ localeCompare)
export const byCount = (a, b) => b.count - a.count || (a.order ?? 1e9) - (b.order ?? 1e9)
  || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);

// คำอธิบายใต้ชื่อหมวด: เก็บเฉพาะข้อความสั้น (เช่น ชื่อกระทรวง) · ชื่อกฎหมายฉบับเต็มยาวเกินการ์ดจึงไม่แสดง
// ถ้าคำอธิบายของหมวดใดไม่เหมาะ ให้ระบุ slug ใน DESC_OVERRIDES (ข้อความ หรือ null = ไม่แสดง)
export const DESC_OVERRIDES = {};
export const shortDesc = (c) => {
  if (c.slug in DESC_OVERRIDES) return DESC_OVERRIDES[c.slug];
  const d = String(c.description ?? '').replace(/\s+/g, ' ').trim();
  if (!d || d.length > 60 || /^(กฎกระทรวง|ประกาศ|พระราชบัญญัติ|พ\.ร\.บ\.|รวบรวม)/.test(d)) return null;
  return d;
};
export const cleanTitle = (t) => String(t).replace(/\s+/g, ' ').trim();
