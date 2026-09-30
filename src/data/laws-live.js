// ตัวเลขกฎหมายล่าสุดจากเซิร์ฟเวอร์ (/api/laws.json · server.cjs ดึงจากระบบสมาชิกทุก 30 นาที)
// เรนเดอร์ครั้งแรกใช้ชุดที่ build ไว้ (ตรงกับ HTML ที่ prerender จึงไม่เกิด hydration mismatch) แล้วเปลี่ยนเป็นชุดล่าสุดเมื่อโหลดเสร็จ
// ดึงครั้งเดียวต่อการเปิดเว็บ ใช้ร่วมกันทุกคอมโพเนนต์ · ดึงไม่ได้ / รูปแบบผิด / เก่ากว่าชุดที่ build → ใช้ชุดที่ build ต่อ
// (npm run dev ไม่มี /api → ใช้ชุดที่ build เสมอ · ดูของจริงด้วย npm start)
import { useEffect, useState } from 'react';
import { SNAPSHOT, deriveLaws, checkLaws } from './laws.js';

let job = null;
const load = () => {
  job ??= fetch('/api/laws.json', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d && !checkLaws(d) && d.syncedIso >= SNAPSHOT.LAWS.syncedIso ? deriveLaws(d) : null))
    .catch(() => null);
  return job;
};

export function useLiveLaws() {
  const [laws, setLaws] = useState(SNAPSHOT);
  useEffect(() => {
    let on = true;
    load().then((d) => { if (on && d) setLaws(d); });
    return () => { on = false; };
  }, []);
  return laws;
}
