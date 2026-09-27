import { useEffect, useRef, useState } from 'react';

// โมชั่นพรีเซนต์ "AI ผู้ช่วยกฎหมาย" — ฉากวนซ้ำ 17 วินาที ทำด้วย CSS (ไม่ใช่ไฟล์วิดีโอ: คมทุกขนาด โหลดเร็ว)
// 1) พิมพ์คำถาม → 2) ค้นในคลังกฎหมาย SafeAct → 3) เจอฉบับที่ตรง → 4) คำตอบพร้อมข้อกฎหมาย → 5) สโลแกน
// → 6) ฉากจบ: ไอคอนแอป + คำชวนติดตั้ง + ปุ่ม รับ → โหลด → เปิด แบบ App Store
// เล่นเฉพาะตอนอยู่ในจอ (ออกจากจอแล้วกลับมาจะเริ่มฉากแรกใหม่) · ไม่มี JS / ตั้ง Reduced Motion = แสดงเฟรมสุดท้ายนิ่ง
// ⚠ ตัวอย่างคำตอบอ้างกฎหมายจริง — ถ้าแก้ข้อความ ต้องตรวจกับตัวบทก่อนเผยแพร่
//   การฝึกซ้อมดับเพลิงและอพยพหนีไฟอย่างน้อยปีละ 1 ครั้ง = ข้อ 30 ของกฎกระทรวงฯ อัคคีภัย พ.ศ. 2555 (เจ้าของยืนยันกับราชกิจจานุเบกษาก่อนเปิดใช้จริง)
// SEO: กล่องนี้เป็นภาพประกอบ (role="img") ใส่ data-nosnippet ไม่ให้ Google หยิบข้อความตัวอย่างไปเป็นคำอธิบายผลค้นหา

const LAWS = [
  'พ.ร.บ. ความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พ.ศ. 2554',
  'กฎกระทรวงฯ เกี่ยวกับไฟฟ้า พ.ศ. 2558',
  'กฎกระทรวงฯ เกี่ยวกับที่อับอากาศ พ.ศ. 2562',
  'กฎกระทรวงฯ เกี่ยวกับสารเคมีอันตราย พ.ศ. 2556',
  'กฎกระทรวงฯ เกี่ยวกับความร้อน แสงสว่าง และเสียง พ.ศ. 2559',
  'กฎกระทรวงฯ เกี่ยวกับเครื่องจักร ปั้นจั่น และหม้อน้ำ พ.ศ. 2564',
  'กฎกระทรวงฯ การจัดให้มีเจ้าหน้าที่ความปลอดภัย พ.ศ. 2565',
  'กฎกระทรวงฯ การป้องกันและระงับอัคคีภัย พ.ศ. 2555',
  'กฎกระทรวงฯ เกี่ยวกับการทำงานบนที่สูง พ.ศ. 2564',
];
const HIT = 7;

export default function AiMotion() {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="aim" data-play={play || undefined} data-nosnippet="" role="img"
      aria-label="ภาพเคลื่อนไหว: ถาม AI ของ SafeAct ว่าต้องซ้อมดับเพลิงบ่อยแค่ไหน AI ค้นจากคลังกฎหมาย SafeAct แล้วตอบว่าอย่างน้อยปีละ 1 ครั้ง พร้อมอ้างอิงกฎกระทรวงการป้องกันและระงับอัคคีภัย พ.ศ. 2555 ข้อ 30 จากนั้นชวนติดตั้งแอป SafeAct Club บน iPhone: ทุกคำถามกฎหมาย มีคำตอบในมือคุณ">
      <div className="aim__glow" aria-hidden="true" />

      <div className="aim__ask" aria-hidden="true">
        <svg className="aim__spark" viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor" /></svg>
        <span className="aim__type"><span className="aim__q">ต้องซ้อมดับเพลิงบ่อยแค่ไหน?</span><i className="aim__caret" /></span>
        <span className="aim__send"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>

      <div className="aim__stage" aria-hidden="true">
        <div className="aim__search">
          <p className="aim__status"><span className="aim__spin" />ค้นในคลังกฎหมาย SafeAct</p>
          <div className="aim__win">
            <ul className="aim__list">
              {LAWS.map((t, i) => <li key={t} className={i === HIT ? 'aim__hit' : undefined}>{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="aim__answer">
          <p className="aim__label">คำตอบ</p>
          <p className="aim__text">ลูกจ้างทุกคนต้องฝึกซ้อมดับเพลิงและอพยพหนีไฟพร้อมกัน <b>อย่างน้อยปีละ 1 ครั้ง</b></p>
          <p className="aim__cite">
            <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
            กฎกระทรวงฯ ป้องกันและระงับอัคคีภัย พ.ศ. 2555 · ข้อ 30
          </p>
          <p className="aim__ok">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#161617" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            อ้างอิงจากตัวบทในคลัง ตรวจสอบได้ทันที
          </p>
        </div>
      </div>

      <p className="aim__tag" aria-hidden="true">ตอบจากตัวบท <span>ไม่ใช่การเดา</span></p>

      <div className="aim__end" aria-hidden="true">
        <img className="aim__icon" src="/assets/app-icon-352.webp" width="352" height="352" alt="" loading="lazy" decoding="async" />
        <p className="aim__app">SafeAct Club <span>ผู้ช่วยกฎหมายความปลอดภัย</span></p>
        <p className="aim__head">ทุกคำถามกฎหมาย<br />มีคำตอบในมือคุณ</p>
        <p className="aim__sub">ติดตั้งแอป SafeAct Club บน iPhone ถามได้ทุกที่ แม้อยู่หน้างาน</p>
        <span className="aim__get">
          <span className="aim__get-lbl">รับ</span>
          <svg className="aim__ring" viewBox="0 0 36 36">
            <defs>
              <linearGradient id="aim-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#64d2ff" /><stop offset="1" stopColor="#2997ff" /></linearGradient>
            </defs>
            <circle className="aim__ring-track" cx="18" cy="18" r="15" />
            <g className="aim__arc"><g className="aim__arc-rot"><circle cx="18" cy="18" r="15" pathLength="100" /></g></g>
            <circle className="aim__ring-fill" cx="18" cy="18" r="15" pathLength="100" />
            <rect className="aim__stop" x="14" y="14" width="8" height="8" rx="1.6" />
            <path className="aim__check" d="M12 18.4l4 4 8-8.6" pathLength="100" />
          </svg>
          <span className="aim__open">เปิด</span>
          <i className="aim__tap" />
        </span>
      </div>
    </div>
  );
}
