// staggered.js — เอฟเฟกต์ "StaggeredFadeIn" ของ apple.com (ถอดจาก apple.com/th/iphone/ scripts/overview/main.built.js)
//
// ของ Apple:
//   • ทริกเกอร์เมื่อขอบบนของ section เลื่อนขึ้นมาถึง 85% ของความสูงจอ  (scroll event "t - 85vh") · เล่นครั้งเดียว
//   • เล่นตามเวลา (ไม่ผูกกับระยะเลื่อน) — กล่องที่ i เริ่มช้ากว่ากล่องก่อนหน้า --staggered-delay
//   • translateY 30px → 0 ใน 0.7s · opacity 0 → 1 ใน 0.9s · ทั้งคู่ easeInOutQuad  · ease (smoothing) = 1
//   • ค่าที่ใช้ทุก section บน apple.com/th/iphone/: delay .15 · opacity .9 · translate-y 30px · translate-y 1 .7
//   • ระหว่างเล่น section มีคลาส staggered-start · จบแล้วเป็น staggered-end
//   • ปิดเมื่อผู้ใช้ตั้ง Reduced Motion (Apple: IS_SUPPORTED = !html.reduced-motion)
// ต่างจาก Apple จุดเดียว: ไม่ซ่อนเนื้อหาไว้ล่วงหน้า (ดูคำอธิบายที่ initStaggered) เพื่อให้ Google เห็นเนื้อหาครบ

const DELAY = 0.15;
const OPACITY_DURATION = 0.9;
const TRANSLATE_Y = 30;
const TRANSLATE_Y_DURATION = 0.7;
const START = 0.85; // "t - 85vh"

// ฟังก์ชันเดียวกับ anim-system ของ Apple
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

// section ที่มีเอฟเฟกต์ และ "กล่อง" ในนั้นที่ทยอยแสดง (เรียงตามลำดับใน DOM)
export const GROUP_SELECTOR = 'main .hero, main .section';
export const ITEM_SELECTOR = [
  '.hero > .container > *', '.hero__media',
  '.section-head', '.props > li', '.tiles > li', '.steps > li', '.stats > li', '.plans > li', '.cards > li',
  '.frow', '.faq', '.cta-band', '.billing', '.compare-wrap', '.pay', '.form',
  // หน้าอัปเดตกฎหมาย: เฟดทั้งกลุ่ม (ไม่เฟดการ์ดหมวดทีละใบ — 36 ใบจะค้างนานเกินไป)
  '.lkpis > li', '.lchart', '.lgroup', '.lcats__cta', '.lstd > li',
].join(',');

function itemsOf(group) {
  const all = [...group.querySelectorAll(ITEM_SELECTOR)];
  // กล่องที่ซ้อนอยู่ในกล่องอื่น (เช่น .frow ใน .tiles > li) ให้เคลื่อนไปพร้อมกล่องแม่
  return all.filter((el) => !all.some((p) => p !== el && p.contains(el)));
}

function play(group, items) {
  group.classList.add('staggered-start');
  const total = (items.length - 1) * DELAY + OPACITY_DURATION;
  const t0 = performance.now();
  const frame = (now) => {
    const t = (now - t0) / 1000;
    items.forEach((el, i) => {
      const local = t - i * DELAY;
      const y = TRANSLATE_Y * (1 - easeInOutQuad(clamp01(local / TRANSLATE_Y_DURATION)));
      el.style.opacity = easeInOutQuad(clamp01(local / OPACITY_DURATION));
      el.style.transform = y ? `translateY(${y}px)` : '';
    });
    if (t < total) return requestAnimationFrame(frame);
    items.forEach((el) => { el.style.opacity = ''; el.style.transform = ''; el.style.willChange = ''; });
    group.classList.replace('staggered-start', 'staggered-end');
  };
  items.forEach((el) => { el.style.willChange = 'opacity, transform'; });
  requestAnimationFrame(frame);
}

// เรียกหลังหน้า render (ทุกครั้งที่เปลี่ยนหน้า) · คืนฟังก์ชันยกเลิก
//
// หลักการ: "มองเห็นเป็นค่าเริ่มต้น" — ไม่มีอะไรถูกซ่อนจนกว่าผู้ใช้จะเลื่อนหน้าจริงครั้งแรก
//   • บอตค้นหาและเครื่องมือแชร์ลิงก์ไม่เลื่อนหน้า จึงเห็นเนื้อหาครบทุกส่วนเสมอ
//   • ส่วนบนสุดของหน้า (รวม H1) ไม่ถูกซ่อน จึงแสดงได้ทันทีโดยไม่ต้องรอ JavaScript
//   • เมื่อผู้ใช้เริ่มเลื่อน: section ที่ยังอยู่ใต้จอทั้งหมดจะถูกซ่อนไว้ แล้วทยอยเฟดขึ้นเมื่อเลื่อนถึง
export function initStaggered() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let pending = null;
  let raf = 0;

  // ทำครั้งเดียวตอนเลื่อนครั้งแรก: เลือกเฉพาะ section ที่ขอบบนยังอยู่ใต้จอ
  const arm = () => {
    const vh = innerHeight;
    pending = [...document.querySelectorAll(GROUP_SELECTOR)]
      .filter((g) => !g.classList.contains('staggered-start') && !g.classList.contains('staggered-end'))
      .filter((g) => g.getBoundingClientRect().top >= vh)
      .map((g) => ({ g, items: itemsOf(g) }))
      .filter(({ items }) => items.length);
    pending.forEach(({ items }) => items.forEach((el) => { el.style.opacity = '0'; }));
  };

  const check = () => {
    raf = 0;
    const line = innerHeight * START;
    for (let k = pending.length - 1; k >= 0; k--) {
      const { g, items } = pending[k];
      // ผ่านเส้น 85vh แล้ว (รวมกรณีกระโดดข้ามมาด้วย #hash) → เล่น
      if (g.getBoundingClientRect().top <= line) { pending.splice(k, 1); play(g, items); }
    }
    if (!pending.length) stop();
  };

  const onScroll = () => {
    if (!pending) {
      if (scrollY <= 0) return;   // ยังไม่ได้เลื่อนจริง (เช่น resize หรือ scrollTo(0,0) ตอนเปลี่ยนหน้า)
      arm();
    }
    if (!raf) raf = requestAnimationFrame(check);
  };

  function stop() {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
    // คืนค่าให้กล่องที่ยังไม่ได้เล่น (เช่น เปลี่ยนหน้ากลางคัน) — ไม่ทิ้งอะไรไว้ในสถานะซ่อน
    pending?.forEach(({ items }) => items.forEach((el) => { el.style.opacity = ''; }));
    pending = [];
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  return stop;
}
