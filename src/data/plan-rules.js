// กติกาข้อมูลแผนบริการ — ใช้ร่วมกัน 2 ฝั่ง
//   • หน้าเว็บ (src/data/plans.js · src/data/plans-live.js) ตรวจชุดที่ build ไว้และข้อมูลจาก /api/plans.json
//   • scripts/plans-source.mjs (server.cjs และ npm run sync:plans) แปลงแถวจากระบบสมาชิกเป็นรูปแบบเดียวกับ src/data/plans.json
// ไฟล์นี้ต้องไม่ import ไฟล์ JSON / JSX (Node อ่านตรง ๆ ได้)
//
// 26 พ.ย. 2569 เจ้าของ: "เช็ครายการฟีเจอร์ให้ตรงกับข้อมูลจริง หากการตั้งค่าเปลี่ยน ให้เปลี่ยนอัตโนมัติด้วย"
//   ระบบสมาชิกสร้าง plans.features เองจากการตั้งค่าจริง (สิทธิ์เมนูรายแผน · โควตา AI · สิทธิ์แอปมือถือ/ดาวน์โหลดสไลด์)
//   และมี RPC plan_feature_matrix() = แผนละหลายแถว {plan, ord, item_key, label} เฉพาะสิ่งที่แผนนั้นมีจริง
//   (ดู safeact-connect-hub/supabase/migrations/20261126000200_plan_features_auto.sql)

const KEY = /^[a-z0-9_-]{1,40}$/;
const text = (v) => typeof v === 'string' && v.trim() !== '';
const texts = (v) => Array.isArray(v) && v.every(text);

// รูปแบบข้อมูล (ไฟล์ที่ซิงก์ และข้อมูลจากเซิร์ฟเวอร์) — คืนชื่อส่วนที่ผิด หรือ '' ถ้าถูกต้อง
//   { syncedIso: 'YYYY-MM-DD',
//     plans:  [{ key, name, subtitle, yearly (บาท/ปี · 0 = ฟรี · null = ติดต่อฝ่ายขาย), features, extra_features, badge, featured }]  เรียงตาม sort_order
//     matrix: [{ plan, ord, item_key, label }] }
export function checkPlans(d) {
  if (!d || typeof d !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(d.syncedIso)) return 'syncedIso';
  if (!Array.isArray(d.plans) || !d.plans.length) return 'plans';
  const keys = new Set();
  for (const p of d.plans) {
    if (!KEY.test(p?.key) || keys.has(p.key)) return `plans ${p?.key}`;
    keys.add(p.key);
    if (!text(p.name) || typeof p.subtitle !== 'string') return `plans ${p.key}: name`;
    if (!(p.yearly === null || (Number.isFinite(p.yearly) && p.yearly >= 0))) return `plans ${p.key}: yearly`;
    if (!texts(p.features) || !texts(p.extra_features)) return `plans ${p.key}: features`;
    if (!(p.badge === null || text(p.badge)) || typeof p.featured !== 'boolean') return `plans ${p.key}: badge`;
  }
  if (!Array.isArray(d.matrix) || !d.matrix.length) return 'matrix';
  const seen = new Set();
  for (const r of d.matrix) {
    const id = `${r?.plan}|${r?.item_key}`;
    if (!keys.has(r?.plan) || !KEY.test(r.item_key) || !text(r.label) || !Number.isInteger(r.ord) || seen.has(id)) return `matrix ${id}`;
    seen.add(id);
  }
  return '';
}

// แถวจากระบบสมาชิก (ตาราง plans + RPC plan_feature_matrix) → รูปแบบข้างบน
// เก็บเฉพาะช่องที่หน้าเว็บใช้ (ไม่มีราคารายเดือน — ขายรายปีอย่างเดียว · ไม่มีเวลาแก้ไขหรือข้อมูลภายใน)
export function plansFromDb(plans, matrix, syncedIso) {
  if (!Array.isArray(plans) || !Array.isArray(matrix)) throw new Error('ผลจากระบบสมาชิกไม่ใช่รายการ');
  const rows = [...plans].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const order = rows.map((p) => p.key);
  const list = (v) => (Array.isArray(v) ? v.map((x) => String(x ?? '').trim()).filter(Boolean) : v);
  return {
    syncedIso,
    plans: rows.map((p) => ({
      key: p.key,
      name: p.name,
      subtitle: p.subtitle ?? '',
      yearly: p.yearly == null ? null : Number(p.yearly),
      features: list(p.features),
      extra_features: list(p.extra_features ?? []),
      badge: p.badge || null,
      featured: Boolean(p.featured),
    })),
    matrix: matrix
      .map((r) => ({ plan: r.plan, ord: r.ord, item_key: r.item_key, label: typeof r.label === 'string' ? r.label.trim() : r.label }))
      .sort((a, b) => order.indexOf(a.plan) - order.indexOf(b.plan) || a.ord - b.ord),
  };
}
