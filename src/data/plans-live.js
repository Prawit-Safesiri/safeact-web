// แผนบริการล่าสุดจากเซิร์ฟเวอร์ (/api/plans.json · server.cjs ดึงจากระบบสมาชิกทุก 5 นาที)
// เรนเดอร์ครั้งแรกใช้ชุดที่ build ไว้ (ตรงกับ HTML ที่ prerender จึงไม่เกิด hydration mismatch) แล้วเปลี่ยนเป็นชุดล่าสุดเมื่อโหลดเสร็จ
// ดึงครั้งเดียวต่อการเปิดเว็บ ใช้ร่วมกันทุกคอมโพเนนต์ · ดึงไม่ได้ / รูปแบบผิด / เก่ากว่าชุดที่ build / ฟีเจอร์ที่เว็บพูดถึงหายทั้งหมด → ใช้ชุดที่ build ต่อ
// (npm run dev ไม่มี /api → ใช้ชุดที่ build เสมอ · ดูของจริงด้วย npm start)
// 26 พ.ย. 2569 เจ้าของ: รายการฟีเจอร์ต้องตรงกับระบบสมาชิก และเปลี่ยนตามเองเมื่อการตั้งค่าเปลี่ยน
import { useEffect, useState } from 'react';
import { SNAPSHOT, derivePlans, REQUIRED_ITEMS } from './plans.js';

let job = null;
const load = () => {
  job ??= fetch('/api/plans.json', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || !(d.syncedIso >= SNAPSHOT.syncedIso)) return null;
      const p = derivePlans(d);   // รูปแบบผิด → throw → ใช้ชุดที่ build
      const lost = REQUIRED_ITEMS.filter((k) => !p.planFrom(k));
      if (lost.length) { console.warn(`[plans] ระบบสมาชิกไม่มีฟีเจอร์ ${lost.join(', ')} ในแผนใดเลย — ใช้ชุดที่ build ไว้ (ต้องแก้ข้อความบนเว็บ)`); return null; }
      return p;
    })
    .catch(() => null);
  return job;
};

export function useLivePlans() {
  const [plans, setPlans] = useState(SNAPSHOT);
  useEffect(() => {
    let on = true;
    load().then((d) => { if (on && d) setPlans(d); });
    return () => { on = false; };
  }, []);
  return plans;
}
