import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, coverSrc } from '../data/laws.js';
import { LAW_MOTION, motionCategory } from '../data/law-update-motion.js';

// ภาพเคลื่อนไหวจำลอง Hub กฎหมาย + การแจ้งเตือน บนสุดของหน้า /law-updates/ — วน 24 วินาที ทำด้วย CSS ล้วน
//   ① กฎหมายใหม่เข้าคลัง (ในหมวดที่ติดตาม) → ② เปิดอ่านสรุป → ③ แจ้งเตือน: กระดิ่ง → อีเมล → แอปบนมือถือ → ฉากจบชวนทดลองใช้
// ค่าตั้งต้นของทุกชิ้น = ภาพนิ่ง "ภาพครบ" (ตอน prerender · ไม่มี JS · ตั้งค่าลดการเคลื่อนไหว) และเป็นเฟรมแรก/สุดท้ายของรอบ จึงเริ่มเล่นได้ไม่กระตุก
// เล่นเฉพาะตอนอยู่ในจอ · มีปุ่มหยุด/เล่น (แบบ PadMotion) · ความจริงของเนื้อหาและค่าที่ปรับได้: src/data/law-update-motion.js
// ข้อความในกล่องเป็นตัวอย่างทั้งหมด (ชื่อกฎหมายวาดเป็นแถบ) ไม่มีชื่อเดือน วันที่ หรือจำนวนที่อ้างเป็นข้อเท็จจริง · ชื่อหมวดและภาพหน้าปกเป็นของจริงจากแอป
// SEO: กล่องเป็นภาพประกอบ (role="img" + data-nosnippet) · CSS: บล็อก "LAW UPDATE MOTION" ใน src/styles/components.css

const CAT = motionCategory(CATEGORIES) ?? CATEGORIES.find((c) => c.cover);   // หมวดหายหรือไม่มีภาพ → build ไม่ผ่าน (scripts/prerender.mjs)
const N = 3;   // ฉบับใหม่ในรอบ = แถวใหม่ = รายการแจ้งเตือน = เลขกระดิ่ง = จำนวนในอีเมล — แก้ต้องแก้ keyframes ด้วย

// แถวตัวอย่าง: ประเภท (สีเดียวกับกราฟในหน้านี้) · ความยาวแถบชื่อ 2 บรรทัด · ระดับผลกระทบ (สูง แดง · กลาง อำพัน · ต่ำ เทา เหมือนแอป)
const ROWS = [
  { kind: 'ใหม่', k: 'b', w: ['92%', '58%'], impact: 'สูง', tone: 'r' },
  { kind: 'แก้ไข', k: 'o', w: ['84%', '46%'], impact: 'กลาง', tone: 'a' },
  { kind: 'ใหม่', k: 'b', w: ['88%', '64%'], impact: 'ต่ำ', tone: 'n' },
];
// ตัดบรรทัดเฉพาะระหว่างวลี: ช่องว่าง = ช่องว่างจริง · "|" = ตัดบรรทัดได้โดยไม่มีช่องว่าง · ในวลีไม่ตัดกลางคำ
const phrase = (t) => t.split(/(\s|\|)/).filter(Boolean)
  .map((p, i) => (p === '|' ? <wbr key={i} /> : p === ' ' ? ' ' : <span key={i} className="nw">{p}</span>));
// หัวข้อ 3 ขั้น (แท็บเล็ตขึ้น 2 บรรทัดได้)
const STEPS = ['กฎหมายใหม่|เข้าคลัง ทุกเดือน', 'อ่านสรุป พร้อมต้นฉบับ', 'แจ้งเตือน|ถึงคุณ'];

const LABEL = 'ภาพเคลื่อนไหวจำลอง Hub กฎหมาย';
const BTN = { playing: `หยุด${LABEL} ชั่วคราว`, paused: `เล่น${LABEL}` };
const ARIA = `${LABEL}ในแอป SafeAct Club: สมาชิกติดตามหมวด${CAT.title} เมื่อทีมงานเพิ่มกฎหมายใหม่ในหมวดนี้ รายการใหม่ขึ้นในหน้าหมวดพร้อมระดับผลกระทบ`
  + ' เปิดอ่านสรุปโดย SafeAct พร้อมวันที่ประกาศ วันบังคับใช้ และดาวน์โหลดฉบับเต็ม จากนั้นได้รับแจ้งเตือนที่กระดิ่งในระบบและทางอีเมล'
  + (LAW_MOTION.push ? ' รวมถึงแจ้งเตือนจากแอปบนมือถือ' : '')
  + ' รายการกฎหมายในภาพเป็นตัวอย่าง';

const Bell = () => <svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.6 2H4.4zM10 21a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Scale = () => <svg viewBox="0 0 24 24"><path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Doc = () => <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Heart = () => <svg viewBox="0 0 24 24"><path d="M12 20.5s-7.8-4.7-7.8-10.2A4.4 4.4 0 0 1 12 7.8a4.4 4.4 0 0 1 7.8 2.5c0 5.5-7.8 10.2-7.8 10.2z" fill="currentColor" /></svg>;
const Mail = () => <svg viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.9" /><path d="M4.5 7.5l7.5 5.6 7.5-5.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Lock = () => <svg viewBox="0 0 24 24"><rect x="5.5" y="10.5" width="13" height="10" rx="2.6" fill="currentColor" /><path d="M8.6 10.5V8a3.4 3.4 0 0 1 6.8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
// เคอร์เซอร์เมาส์ (จอกว้าง) · มือถือซ่อน เหลือวงแตะ (--cur-on)
const Cursor = ({ bell }) => (
  <svg className={`lum-cur${bell ? ' lum-cur--bell' : ''}`} viewBox="0 0 24 24"><path d="M5 3l14 8.3-6.1 1.3 3.5 6.9-2.9 1.5-3.5-6.9L5 18.7z" fill="#1d1d1f" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" /></svg>
);

// แถวกฎหมายในหน้าหมวด · fresh = ฉบับใหม่ของรอบ (n1 บนสุด = ใหม่ล่าสุด) · แถวที่เหลือเป็นแถวเดิม หน้าตาเหมือนกันทุกอย่าง
// DOM = แถวใหม่ 3 + แถวเดิม 6 (ชุดเดียวกันซ้ำ) → ต้นรอบรายการกระโดดขึ้น 3 แถวโดยมองไม่เห็นรอยต่อ แล้วแถวใหม่เลื่อนเข้าทีละแถว ไม่มีการลบแถว
function Row({ r, n }) {
  return (
    <li className={`lum-row${n ? ` lum-row--n${n}` : ''}`}>
      {n > 0 && <i className="lum-row__flash" />}
      <div className="lum-row__main">
        <p className="lum-row__title"><i className="lum-sk" style={{ width: r.w[0] }} /><i className="lum-sk" style={{ width: r.w[1] }} /></p>
        <p className="lum-row__pills">
          <em className={`lum-pill lum-pill--${r.k}`}>{r.kind}</em>
          <em className={`lum-pill lum-pill--${r.tone}`}>ผลกระทบ {r.impact}</em>
        </p>
      </div>
      <p className="lum-row__dates"><span>ประกาศ<i className="lum-sk" /></span><span>บังคับใช้<i className="lum-sk" /></span></p>
      <span className="lum-row__btn"><Doc />สรุป{n === 1 && <><i className="lum-tap" /><Cursor /></>}</span>
    </li>
  );
}

export default function LawUpdateMotion() {
  const ref = useRef(null);
  const [live, setLive] = useState(false);   // true หลัง mount ในเบราว์เซอร์ที่เล่นแอนิเมชันได้
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current);
    // ตัวสำรอง: ข้ามจุดตัด 734/1068px แล้วตั้งเวลาทุกแอนิเมชันให้ตรงกับแถบความคืบหน้าขั้น 1 (keyframes ชื่อเดียวทุกขนาดจอ ปกติจึงไม่เพี้ยน)
    const mqs = ['(max-width: 1068px)', '(max-width: 734px)'].map((q) => matchMedia(q));
    const sync = () => requestAnimationFrame(() => {
      const all = ref.current?.getAnimations?.({ subtree: true }) ?? [];
      const main = all.find((a) => a.animationName === 'lum-bar1');
      if (!main) return;
      const loop = main.effect.getTiming().duration;
      all.forEach((a) => { if (a !== main && a.effect.getTiming().duration === loop) a.currentTime = main.currentTime; });
    });
    mqs.forEach((m) => m.addEventListener('change', sync));
    return () => { io.disconnect(); mqs.forEach((m) => m.removeEventListener('change', sync)); };
  }, []);

  // ผู้ใช้กดหยุด = ค้างเฟรมไว้แม้เลื่อนออกนอกจอ · ไม่ได้กดหยุด = ออกนอกจอแล้วกลับมาเริ่มรอบใหม่
  const play = live && (inView || paused);
  const state = paused ? 'paused' : 'playing';

  return (
    <div ref={ref} className="lum" data-play={play || undefined} data-paused={paused || undefined}>
      <div className="lum__stage" role="img" aria-label={ARIA} data-nosnippet="">
        <i className="lum__bg" aria-hidden="true" />

        {/* หน้าต่างแอป: หน้าหมวดที่ติดตาม */}
        <div className="lum-win" aria-hidden="true">
          <div className="lum-win__bar">
            <span className="lum-win__dots"><i /><i /><i /></span>
            <p className="lum-crumb"><span>Hub กฎหมาย</span><i>›</i><b>{CAT.title}</b></p>
            <span className="lum-bell">
              <Bell />
              <b className="lum-badge"><i>1</i><i>2</i><i>{N}</i></b>
              <i className="lum-tap" /><Cursor bell />
              <div className="lum-dd">
                <p className="lum-dd__head"><b>การแจ้งเตือน ({N})</b><span>อ่านทั้งหมด</span></p>
                <ul>
                  {ROWS.map((r, i) => (
                    <li key={i} className="lum-dd__item">
                      <i className="lum-dd__ic"><Scale /></i>
                      <span className="lum-dd__txt">
                        <span className="lum-dd__l1"><i className="lum-sk" /><small>เมื่อสักครู่</small></span>
                        <i className="lum-sk" style={{ width: r.w[1] }} />
                        <small className="lum-dd__cat">{CAT.title}</small>
                      </span>
                      <i className="lum-dd__dot" />
                    </li>
                  ))}
                </ul>
                <p className="lum-dd__foot"><span>ดูทั้งหมด</span><span>ตั้งค่า</span></p>
              </div>
            </span>
          </div>

          <div className="lum-win__body">
            {/* ภาพหน้าปกหมวดโหลดทันที (ไม่ lazy): บนจอคอมเป็นองค์ประกอบใหญ่สุดของหน้า (LCP) · ไฟล์ 640px ราว 20KB */}
            <div className="lum-head">
              <img className="lum-head__img" src={coverSrc(CAT.cover, 640)} srcSet={`${coverSrc(CAT.cover, 320)} 320w, ${coverSrc(CAT.cover, 640)} 640w`}
                sizes="(max-width: 734px) 92vw, (max-width: 1068px) 58vw, 720px" width="640" height="360" alt="" decoding="async" />
              <p className="lum-head__txt"><em>กฎหมายไทย</em><b>{CAT.title}</b></p>
              <span className="lum-follow"><Heart />กำลังติดตาม<i className="lum-follow__ring" /></span>
            </div>
            <div className="lum-list">
              <ol className="lum-rows">
                {ROWS.map((r, i) => <Row key={`n${i}`} r={r} n={i + 1} />)}
                {[...ROWS, ...ROWS].map((r, i) => <Row key={`o${i}`} r={r} n={0} />)}
              </ol>
            </div>
            <i className="lum-scrim" />
            <aside className="lum-sheet">
              <p className="lum-sheet__bar"><Doc /><b>รายละเอียดกฎหมาย</b><span>{CAT.title}</span><i className="lum-sheet__x" /></p>
              <div className="lum-sheet__body">
                <p className="lum-sheet__chips"><em className="lum-pill lum-pill--b">ใหม่</em><em className="lum-pill lum-pill--r">ผลกระทบ สูง</em></p>
                <p className="lum-sheet__title"><i className="lum-sk" /><i className="lum-sk" /><i className="lum-sk" /></p>
                <div className="lum-sheet__dates">
                  <span><small>วันที่ประกาศ</small><i className="lum-sk" /></span>
                  <span><small>วันบังคับใช้</small><i className="lum-sk" /></span>
                </div>
                <p className="lum-sheet__sec"><b>01</b>สรุปโดย SafeAct</p>
                <p className="lum-sheet__lines"><i className="lum-sk" /><i className="lum-sk" /><i className="lum-sk" /><i className="lum-sk" /></p>
              </div>
              <p className="lum-sheet__foot"><span className="lum-sheet__dl">ดาวน์โหลดฉบับเต็ม →</span></p>
            </aside>
          </div>
        </div>

        {/* มือถือ: จอล็อก + แบนเนอร์ (ใหม่สุดอยู่บน · กองชิดล่าง) */}
        <div className={`lum-phone${LAW_MOTION.push ? '' : ' lum-phone--nopush'}`} aria-hidden="true">
          <div className="lum-phone__screen">
            <i className="lum-phone__island" />
            <p className="lum-phone__time"><Lock /><b>9:41</b></p>
            <div className="lum-nts">
              {LAW_MOTION.push && (
                <div className="lum-nt lum-nt--a">
                  <img className="lum-nt__ic" src="/assets/app-icon-352.webp" width="352" height="352" alt="" loading="lazy" decoding="async" />
                  <p className="lum-nt__top"><b>SafeAct Club</b><span>ตอนนี้</span></p>
                  <p className="lum-nt__t">กฎหมายใหม่ใน<span className="nw">หมวดที่คุณติดตาม</span></p>
                  <small>{phrase(CAT.title)}</small>
                </div>
              )}
              <div className="lum-nt lum-nt--b">
                <i className="lum-nt__ic lum-nt__mail"><Mail /></i>
                <p className="lum-nt__top"><b>SafeAct</b><span>ตอนนี้</span></p>
                <p className="lum-nt__t">SafeAct — แจ้งเตือน<span className="nw">กฎหมายใหม่ {N} ฉบับ</span></p>
                <small>{N} ฉบับที่เกี่ยวข้องกับ<span className="nw">หมวดที่คุณติดตาม</span></small>
              </div>
            </div>
            <i className="lum-phone__dim" />
          </div>
        </div>

        {/* หัวข้อ 3 ขั้น: ภาพนิ่ง = คำอธิบายครบ 3 ขั้น · ขณะเล่น = แถบความคืบหน้าตามฉาก */}
        <ol className="lum-steps" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={i} className={`lum-step lum-step--${i + 1}`}>
              <i className="lum-step__bar"><i /></i>
              <span className="lum-step__t"><b className="lum-step__n">{i + 1}</b><span>{phrase(s)}</span></span>
            </li>
          ))}
        </ol>

        {/* ฉากจบ (ป้ายไม่ใช่ปุ่ม — กล่องนี้เป็นภาพ ปุ่มทดลองใช้จริงอยู่เหนือภาพ) */}
        <i className="lum__veil" aria-hidden="true" />
        <div className="lum-end" aria-hidden="true">
          <img className="lum-end__icon" src="/assets/app-icon-352.webp" width="352" height="352" alt="" loading="lazy" decoding="async" />
          <p className="lum-end__tag"><span>ไม่พลาดกฎหมาย</span><span>ที่เกี่ยวกับงานคุณ</span></p>
          <p className="lum-end__pill">ทดลองใช้ฟรี 30 วัน</p>
        </div>
      </div>

      {live && (
        <button type="button" className={`im__btn im__btn--${state} is-ready`} aria-label={BTN[state]}
          onClick={() => setPaused((p) => !p)} />
      )}
    </div>
  );
}
