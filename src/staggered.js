// staggered.js — เอฟเฟกต์ "StaggeredFadeIn" ของ apple.com (ถอดจาก apple.com/th/iphone/ scripts/overview/main.built.js)
//
// ของ Apple:
//   • ทริกเกอร์เมื่อขอบบนของ section เลื่อนขึ้นมาถึง 85% ของความสูงจอ  (scroll event "t - 85vh") · เล่นครั้งเดียว
//   • เล่นตามเวลา (ไม่ผูกกับระยะเลื่อน) — กล่องที่ i เริ่มช้ากว่ากล่องก่อนหน้า --staggered-delay
//   • translateY 30px → 0 ใน 0.7s · opacity 0 → 1 ใน 0.9s · ทั้งคู่ easeInOutQuad  · ease (smoothing) = 1
//   • ค่าที่ใช้ทุก section บน apple.com/th/iphone/: delay .15 · opacity .9 · translate-y 30px · translate-y 1 .7
//   • ระหว่างเล่น section มีคลาส staggered-start · จบแล้วเป็น staggered-end
//   • ปิดเมื่อผู้ใช้ตั้ง Reduced Motion (Apple: IS_SUPPORTED = !html.reduced-motion)

const DELAY = 0.15;
const OPACITY_DURATION = 0.9;
const TRANSLATE_Y = 30;
const TRANSLATE_Y_DURATION = 0.7;
const START = 0.85; // "t - 85vh"

// ฟังก์ชันเดียวกับ anim-system ของ Apple
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

// section ที่มีเอฟเฟกต์ และ "กล่อง" ในนั้นที่ทยอยแสดง (เรียงตามลำดับใน DOM)
// ⚠ ถ้าแก้รายการนี้ ต้องแก้กฎ html.sfi ใน components.css ให้ตรงกันด้วย (ใช้ซ่อนก่อน JS โหลด กันกระพริบ)
export const GROUP_SELECTOR = 'main .hero, main .section';
export const ITEM_SELECTOR = [
  '.hero > .container > *', '.hero__media',
  '.section-head', '.props > li', '.tiles > li', '.steps > li', '.stats > li', '.plans > li', '.cards > li',
  '.frow', '.faq', '.cta-band', '.billing', '.compare-wrap', '.pay', '.form',
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
export function initStaggered() {
  const html = document.documentElement;
  window.__sfiReady = true;
  if (!html.classList.contains('sfi') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    html.classList.remove('sfi');
    return () => {};
  }
  const pending = [...document.querySelectorAll(GROUP_SELECTOR)]
    .filter((g) => !g.classList.contains('staggered-start') && !g.classList.contains('staggered-end'))
    .map((g) => ({ g, items: itemsOf(g) }))
    .filter(({ g, items }) => items.length || (g.classList.add('staggered-end'), false));

  let raf = 0;
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
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
  const stop = () => {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();
  return stop;
}
