import { useEffect, useRef, useState } from 'react';

// โมชั่นขายของหน้าแรก (21:9) — ฉากวน 24 วินาที ทำด้วย CSS (ไม่ใช่ไฟล์วิดีโอ: คมทุกขนาด โหลดเร็ว)
// 1) คลังกฎหมายจำนวนมาก → 2) AI ค้นหา สแกนทั้งคลัง → 3) ผลลัพธ์แม่นยำพร้อมอ้างอิง
// → 4) รวมฟีเจอร์ในแอปเดียว (รวมงานตรวจวิศวกรรม: ปั้นจั่น ระบบไฟฟ้า หม้อน้ำ ตามหน้าบันทึกงานตรวจรับรองของแอป) → 5) ฉากจบ ทดลองใช้ฟรี
// เล่นเฉพาะตอนอยู่ในจอ · ไม่มี JS / ตั้ง Reduced Motion = แสดงฉากจบนิ่ง
// ⚠ ตัวอย่างคำตอบอ้างกฎหมายจริง (สรุปแบบไม่ระบุเลขข้อ) — ถ้าแก้ข้อความ ต้องตรวจกับตัวบทก่อนเผยแพร่
// 1,419 = จำนวนกฎหมายในหมวดอัปเดตกฎหมายของระบบสมาชิก ณ 27 ก.ย. 2569

const ROWS = [
  [
    ['กฎกระทรวง', 'กำหนดมาตรฐานความปลอดภัยฯ เกี่ยวกับไฟฟ้า', 'พ.ศ. 2558'],
    ['ประกาศกรม', 'หลักเกณฑ์การตรวจสุขภาพลูกจ้างที่ทำงานเกี่ยวกับปัจจัยเสี่ยง', 'พ.ศ. 2566'],
    ['พ.ร.บ.', 'ความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน', 'พ.ศ. 2554'],
    ['มาตรฐาน', 'ISO 45001 ระบบการจัดการอาชีวอนามัยและความปลอดภัย', '2018'],
    ['กฎกระทรวง', 'การจัดให้มีเจ้าหน้าที่ความปลอดภัยในการทำงาน', 'พ.ศ. 2565'],
    ['ประกาศกรม', 'มาตรฐานความเข้มของแสงสว่าง', 'พ.ศ. 2561'],
    ['กฎกระทรวง', 'การป้องกันและระงับอัคคีภัย', 'พ.ศ. 2555'],
  ],
  [
    ['กฎกระทรวง', 'เกี่ยวกับเครื่องจักร ปั้นจั่น และหม้อน้ำ', 'พ.ศ. 2564'],
    ['กฎกระทรวง', 'กำหนดมาตรฐานความปลอดภัยฯ เกี่ยวกับที่อับอากาศ', 'พ.ศ. 2562', true],
    ['ประกาศกรม', 'หลักสูตรการฝึกอบรมความปลอดภัยในการทำงานในที่อับอากาศ', 'ที่อับอากาศ', true],
    ['พ.ร.บ.', 'ความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน', 'พ.ศ. 2554', true],
    ['กฎกระทรวง', 'เกี่ยวกับสารเคมีอันตราย', 'พ.ศ. 2556'],
    ['ประกาศกรม', 'มาตรฐานระดับเสียงที่ยอมให้ลูกจ้างได้รับ', 'พ.ศ. 2561'],
    ['กฎกระทรวง', 'เกี่ยวกับความร้อน แสงสว่าง และเสียง', 'พ.ศ. 2559'],
  ],
  [
    ['กฎกระทรวง', 'การทำงานเกี่ยวกับรังสีชนิดก่อไอออน', 'พ.ศ. 2547'],
    ['ประกาศกรม', 'แบบแจ้งการประสบอันตรายหรือเจ็บป่วยของลูกจ้าง', 'พ.ศ. 2555'],
    ['กฎกระทรวง', 'การบริหารและการจัดการด้านความปลอดภัยฯ งานก่อสร้าง', 'พ.ศ. 2564'],
    ['มาตรฐาน', 'ISO 14001 ระบบการจัดการสิ่งแวดล้อม', '2015'],
    ['ประกาศกรม', 'หลักเกณฑ์การจัดทำแผนงานโครงการด้านความปลอดภัย', 'พ.ศ. 2565'],
    ['กฎกระทรวง', 'เกี่ยวกับการทำงานบนที่สูง', 'พ.ศ. 2564'],
    ['ประกาศกรม', 'มาตรฐานอุปกรณ์คุ้มครองความปลอดภัยส่วนบุคคล', 'พ.ศ. 2554'],
  ],
];

function LawCard({ c: [type, title, year], hit }) {
  return (
    <li className={`hm__card${hit ? ' hm__card--hit' : ''}`}>
      <span className="hm__tag">{type}</span>
      <span className="hm__ctitle">{title}</span>
      <span className="hm__cyear">{year}</span>
    </li>
  );
}

// ตัวเลขหมุนแบบ Apple (numeric roll): แต่ละหลักเป็นแถบ 0–9 เลื่อนแนวตั้ง
// หลักขวาหมุนหลายรอบกว่าและหยุดทีหลัง (เหมือนมาตรวัด) · ระหว่างหมุนเบลอเล็กน้อย ขอบบน-ล่างจาง
function Odometer({ value }) {
  const digits = String(value).split('').map(Number);
  const n = digits.length;
  const cols = [];
  digits.forEach((d, i) => {
    const loops = i === 0 ? 0 : i; // หลักแรกหมุนน้อยสุด หลักขวาสุดหมุนมากสุด
    const seq = [...Array.from({ length: loops * 10 }, (_, k) => k % 10), ...Array.from({ length: d + 1 }, (_, k) => k)];
    cols.push(
      <span key={i} className={`hm-odo hm-odo--${i}`} style={{ '--to': seq.length - 1 }}>
        <span className="hm-odo__strip">{seq.map((x, k) => <span key={k}>{x}</span>)}</span>
      </span>,
    );
    if ((n - 1 - i) % 3 === 0 && i < n - 1) cols.push(<span key={`c${i}`} className="hm-odo__sep">,</span>);
  });
  return <span className="hm__count" aria-label={value.toLocaleString('th-TH')}>{cols}</span>;
}

const FEATURES = [
  { k: 'plan', t: 'Action Plan รายปี', s: '12 เดือน · ทุกกิจกรรม' },
  { k: 'matrix', t: 'Training Matrix', s: 'รู้ทันใครขาดหลักสูตร' },
  { k: 'noise', t: 'แผนผังระดับเสียง', s: 'จุดวัด dB(A) ทุกพื้นที่' },
  { k: 'eng', t: 'งานตรวจวิศวกรรม', s: 'ปั้นจั่น · ไฟฟ้า · หม้อน้ำ' },
  { k: 'docs', t: 'คลังเอกสาร', s: 'แบบฟอร์ม · SOP · JSA' },
  { k: 'bell', t: 'แจ้งเตือนอัตโนมัติ', s: 'กฎหมายใหม่ · ใบรับรองหมดอายุ' },
];

// ภาพประกอบฟีเจอร์ = UI จิ๋วที่ขยับตามการใช้งานจริง (วนทุก 4.8 วินาที · สไตล์หน้าสินค้า Apple)
const MATRIX = ['ok', 'ok', 'warn', 'ok', 'ok', 'no', 'ok', 'ok', 'ok', 'warn', 'ok', 'ok'];
const GLYPH = { ok: '✓', warn: '!', no: '×' };

function FeatureArt({ k }) {
  if (k === 'plan') return (
    <div className="hm-art hm-art--plan">
      <div className="hm-plan__head">{['ม.ค.', 'มี.ค.', 'พ.ค.', 'ก.ค.'].map((m) => <span key={m}>{m}</span>)}</div>
      {[[0, 42, 'b'], [22, 36, 'o'], [8, 50, 'g'], [48, 40, 'b']].map(([x, w, c], r) => (
        <div key={r} className="hm-plan__row"><i /><b className={`c-${c}`} style={{ '--x': `${x}%`, '--w': `${w}%`, '--d': `${r * 0.18}s` }} /></div>
      ))}
      <span className="hm-plan__now" />
    </div>
  );
  if (k === 'matrix') return (
    <div className="hm-art hm-art--matrix">
      {[0, 1, 2, 3].map((r) => (
        <div key={r} className="hm-mx__row">
          <i className="hm-mx__name" />
          {MATRIX.slice(r * 3, r * 3 + 3).map((st, c) => <b key={c} className={`hm-mx__cell is-${st}`} style={{ '--d': `${(r + c) * 0.12}s` }}>{GLYPH[st]}</b>)}
        </div>
      ))}
    </div>
  );
  if (k === 'noise') return (
    <div className="hm-art hm-art--noise">
      <span className="hm-nz__heat" /><span className="hm-nz__iso" /><span className="hm-nz__iso" /><span className="hm-nz__iso" />
      {[['92', 58, 34, 0], ['85', 30, 58, 0.6], ['79', 78, 70, 1.2]].map(([db, x, y, d]) => (
        <span key={db} className="hm-nz__pin" style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s` }}><i /><b>{db} dB</b></span>
      ))}
    </div>
  );
  if (k === 'eng') return (
    <div className="hm-art hm-art--eng">
      <svg viewBox="0 0 64 40">
        <defs><linearGradient id="hm-eng" x1="0" x2="1"><stop offset="0" stopColor="#30d158" /><stop offset=".6" stopColor="#ffd60a" /><stop offset="1" stopColor="#ff453a" /></linearGradient></defs>
        <path d="M10 34a22 22 0 0 1 44 0" fill="none" stroke="url(#hm-eng)" strokeWidth="3" strokeLinecap="round" opacity=".9" />
        {Array.from({ length: 11 }, (_, t) => {
          const a = Math.PI - (t / 10) * Math.PI; const r1 = t % 5 === 0 ? 15.5 : 17;
          return <line key={t} x1={32 + r1 * Math.cos(a)} y1={34 - r1 * Math.sin(a)} x2={32 + 18.5 * Math.cos(a)} y2={34 - 18.5 * Math.sin(a)} stroke="#9aa3ae" strokeWidth={t % 5 === 0 ? 1.1 : 0.7} strokeLinecap="round" />;
        })}
        <g className="hm-eng__needle"><path d="M32 34L32 17.5" stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="32" cy="34" r="2.6" fill="#1d1d1f" /><circle cx="32" cy="34" r="1" fill="#fff" /></g>
      </svg>
      <span className="hm-eng__read">6.2 <small>bar</small></span>
      <span className="hm-eng__ok">ผ่าน</span>
    </div>
  );
  if (k === 'docs') return (
    <div className="hm-art hm-art--docs">
      {[['PDF', 'r', 'แบบฟอร์ม JSA'], ['DOCX', 'b', 'SOP งานที่สูง'], ['XLSX', 'g', 'Checklist ประจำวัน']].map(([t, c, n], r) => (
        <div key={t} className="hm-doc__row" style={{ '--d': `${r * 0.2}s` }}>
          <b className={`c-${c}`}>{t}</b><span>{n}</span>{r === 0 ? <i className="hm-doc__dl" /> : <i className="hm-doc__done" />}
        </div>
      ))}
    </div>
  );
  return (
    <div className="hm-art hm-art--bell">
      {[['กฎหมายใหม่ 3 ฉบับ', 'อัปเดตเมื่อสักครู่'], ['ใบรับรองใกล้หมดอายุ', 'ปั้นจั่น CR-02 · อีก 49 วัน']].map(([t, sub], r) => (
        <div key={t} className="hm-nt" style={{ '--d': `${r * 0.5}s` }}>
          <i className="hm-nt__icon" /><span><b>{t}</b><small>{sub}</small></span>
        </div>
      ))}
    </div>
  );
}

export default function HeroMotion() {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="hm" data-play={play || undefined} role="img"
      aria-label="ภาพเคลื่อนไหวแนะนำ SafeAct: คลังกฎหมายกว่า 1,400 ฉบับ AI ค้นหากฎหมายเรื่องที่อับอากาศและสรุปพร้อมอ้างอิงตัวบท รวมฟีเจอร์ Action Plan Training Matrix แผนผังระดับเสียง งานตรวจวิศวกรรม คลังเอกสาร และการแจ้งเตือนไว้ในแอปเดียว ทดลองใช้ฟรี 30 วัน">
      <div className="hm__bg" aria-hidden="true"><i /><i /><i /></div>

      {/* ฉาก 1–2: คลังกฎหมาย + AI สแกน */}
      <div className="hm__lib" aria-hidden="true">
        <p className="hm__libhead"><Odometer value={1419} /> <span>ฉบับในคลังกฎหมาย SafeAct</span></p>
        <div className="hm__wall">
          {ROWS.map((row, r) => (
            <ul key={r} className={`hm__row hm__row--${r}`}>
              {[...row, ...row].map((c, i) => <LawCard key={i} c={c} hit={i < row.length && c[3]} />)}
            </ul>
          ))}
          <i className="hm__beam" />
        </div>
      </div>

      <div className="hm__search" aria-hidden="true">
        <svg className="hm__spark" viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor" /></svg>
        <span className="hm__type"><span className="hm__q">งานในที่อับอากาศ ต้องทำอะไรบ้าง?</span><i className="hm__caret" /></span>
        <span className="hm__status">กำลังค้นทั้งคลัง…</span>
        <span className="hm__go"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>

      {/* ฉาก 3: ผลลัพธ์ */}
      <div className="hm__result" aria-hidden="true">
        <div className="hm__answer">
          <p className="hm__label"><svg viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor" /></svg>สรุปจากตัวบทกฎหมาย</p>
          <ul>
            <li>จัดให้มีผู้อนุญาต ผู้ควบคุมงาน ผู้ช่วยเหลือ และผู้ปฏิบัติงานที่ผ่านการฝึกอบรม</li>
            <li>ตรวจวัดสภาพอากาศก่อนเข้าทำงาน และจัดให้มีการระบายอากาศ</li>
            <li>ออกหนังสืออนุญาตทำงาน และติดป้ายเตือนหน้าทางเข้า</li>
          </ul>
          <p className="hm__ok"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>อ้างอิงครบ ตรวจสอบย้อนกลับได้ทุกข้อ</p>
        </div>
        <ol className="hm__cites">
          <li><b>กฎกระทรวงฯ เกี่ยวกับที่อับอากาศ</b><small>พ.ศ. 2562</small><span className="hm__match" style={{ '--m': '98%' }}><i /></span><em>98%</em></li>
          <li><b>ประกาศกรมฯ หลักสูตรอบรมที่อับอากาศ</b><small>ประกาศกรมสวัสดิการฯ</small><span className="hm__match" style={{ '--m': '95%' }}><i /></span><em>95%</em></li>
          <li><b>พ.ร.บ.ความปลอดภัยฯ</b><small>พ.ศ. 2554</small><span className="hm__match" style={{ '--m': '89%' }}><i /></span><em>89%</em></li>
        </ol>
      </div>

      {/* ฉาก 4: ฟีเจอร์ */}
      <div className="hm__feat" aria-hidden="true">
        <p className="hm__fhead">ทุกงานความปลอดภัย <span>อยู่ในแอปเดียว</span></p>
        <ul>
          {FEATURES.map((f) => (
            <li key={f.k} className={`hm__tile hm__tile--${f.k}`}>
              <FeatureArt k={f.k} />
              <b>{f.t}</b><small>{f.s}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* ฉาก 5: ฉากจบ */}
      <div className="hm__end" aria-hidden="true">
        <img className="hm__icon" src="/assets/app-icon-lg.webp" width="1024" height="1024" alt="" decoding="async" />
        <p className="hm__tagline">แอปเดียว <span>เอาอยู่</span></p>
        <p className="hm__endsub">กฎหมาย · ระบบงานความปลอดภัย · AI ผู้ช่วย ครบในที่เดียว</p>
        <p className="hm__cta"><span>ทดลองใช้ฟรี 30 วัน</span></p>
        <p className="hm__today">เริ่มได้แล้ววันนี้ · ยกเลิกได้ทุกเมื่อ</p>
      </div>
    </div>
  );
}
