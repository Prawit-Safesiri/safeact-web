// ดึงแผนบริการจากระบบสมาชิก (Supabase ของ member.safeact.com) — ใช้ร่วมกัน 2 ที่
//   • scripts/sync-plans.mjs → src/data/plans.json (ชุดที่ build ติดไปกับหน้าเว็บ)
//   • server.cjs             → /api/plans.json ทุก 5 นาที ให้การ์ดแผน ตารางเปรียบเทียบ และข้อความ "มีในแผน …" เปลี่ยนตามระบบสมาชิกเอง
//
// 26 พ.ย. 2569 เจ้าของ: รายการฟีเจอร์ต้องตรงกับข้อมูลจริง และเปลี่ยนตามเองเมื่อการตั้งค่าเปลี่ยน
//   • การ์ดแผน = ตาราง plans (features สร้างอัตโนมัติจากสิทธิ์เมนู โควตา AI และสิทธิ์แอปมือถือ · extra_features = บรรทัดที่พิมพ์เองใน /admin/plans)
//   • ตารางเปรียบเทียบ = RPC plan_feature_matrix() (เรียกได้โดยไม่ต้องล็อกอิน)
// คีย์: publishable/anon key ชุดเดียวกับตัวดึงข้อมูลกฎหมาย (readKey ใน laws-source.mjs) — ข้อมูลที่ส่งออกไม่มีคีย์หรือที่อยู่ระบบ
import { readKey } from './laws-source.mjs';
import { checkPlans, plansFromDb } from '../src/data/plan-rules.js';

export async function fetchPlans({ url, key }) {
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const call = async (p, init = {}) => {
    const res = await fetch(`${url}/rest/v1/${p}`, { ...init, headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`${p.split('?')[0]} → HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`);
    return res.json();
  };
  const [plans, matrix] = await Promise.all([
    call('plans?select=key,name,subtitle,yearly,features,extra_features,badge,featured,sort_order&order=sort_order.asc'),
    call('rpc/plan_feature_matrix', { method: 'POST', body: '{}' }),
  ]);
  const syncedIso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());   // YYYY-MM-DD เวลาไทย
  const data = plansFromDb(plans, matrix, syncedIso);
  const bad = checkPlans(data);
  if (bad) throw new Error(`ข้อมูลแผนจากระบบสมาชิกไม่ถูกต้อง (${bad})`);
  return data;
}

// ── สำหรับ server.cjs ──
export const livePlans = (root) => fetchPlans(readKey(root));
