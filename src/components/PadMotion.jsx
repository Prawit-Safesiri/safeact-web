import { useEffect, useRef, useState } from 'react';
import { LAW_LIBRARY, FEATURES } from '../data/service.js';
import { COMPANY } from '../data/company.js';

// จอแอป SafeAct Club "ฉาย" ออกจากแท็บเล็ตในภาพทีมงาน — มี 2 แบบ
//   • <PadMotion />        หน้าแรก: โมชั่นเคลื่อนไหว ฉากวน 27 วินาที ทำด้วย CSS
//   • <PadMotion still />  หน้าเกี่ยวกับเรา: ภาพนิ่ง จอเปิดค้างที่หน้าจออัปเดตกฎหมาย ไม่มีหัวข้อขาย ไม่มีการเคลื่อนไหว ไม่มีปุ่ม (เจ้าของสั่ง 28 ก.ย. 2569: หน้านี้ต้องดูน่าเชื่อถือ ไม่ขายของ)
// เปิดแอป → 1) กฎหมายใหม่เดือนนี้ + แจ้งเตือน → 2) Action Plan แจ้งเตือนงานเกินกำหนด → 3) AI ตรวจแผนงาน → ปิดแอป แสงวูบกลับเข้าแท็บเล็ต
// เล่นเฉพาะตอนอยู่ในจอ · มีปุ่มหยุด/เล่น · ไม่มี JS / ตั้ง Reduced Motion = จอเปิดค้างที่ฉาก 1
//
// ⚠ แสดงเฉพาะสิ่งที่แอปจริงทำได้ (ตรวจกับ safeact-connect-hub เมื่อ 28 ก.ย. 2569) ข้อความในจอใช้คำเดียวกับแอป
//   • แจ้งเตือนในแอป = กฎหมายใหม่ตามหมวดที่ติดตามเท่านั้น (ไม่มี push บนหน้าจอล็อก) · ชื่อกฎหมายวาดเป็นแถบ ไม่อ้างว่าฉบับใดออกใหม่
//   • Action Plan = ปุ่ม "แจ้งเตือน" แล้วขึ้นข้อความสรุปงานเกินกำหนด (ไม่มีแจ้งเตือนอัตโนมัติ)
//   • AI = ผู้ช่วย SafeAct ตรวจแผนเทียบกฎหมาย → ชิป "กฎหมายที่เกี่ยวข้อง" → สมาชิกสั่ง "เพิ่มงานนี้ลงแผนให้เลย" → การ์ด "เพิ่มลงแผนงาน"
//     (ผู้ช่วยในแอปจริงสร้างการ์ดเพิ่มงานเฉพาะเมื่อสมาชิกสั่งเพิ่มงานชัดเจนเท่านั้น ห้ามตัดคำสั่งนี้ออกจากฉาก)
//   • ชื่อหมวดในรายการแจ้งเตือนเป็นชื่อหมวดจริงในคลังกฎหมายของแอป (ตาราง law_categories)
//   • กฎหมายที่อ้าง: กฎกระทรวงฯ ป้องกันและระงับอัคคีภัย พ.ศ. 2555 (ซ้อมดับเพลิงและอพยพหนีไฟอย่างน้อยปีละ 1 ครั้ง) — ไม่ระบุเลขข้อ
// SEO: ภาพทีมงานเป็น <img> จริง (alt เดิม) · กล่องแอนิเมชันเป็นภาพประกอบ (role="img" + data-nosnippet)

// ตัวเลขตัวอย่างในจอ — แก้ที่นี่ที่เดียว (unread ต้องเท่ากับจำนวน <NoteItem> ในฉาก 1)
const LAWS = { total: 14, fresh: 9, edited: 4, cancelled: 1, unread: 3 };
const PLAN = { all: 12, done: 4, doing: 5, late: 2 };
const MISSING = 'ซ้อมอพยพหนีไฟประจำปี';
// งานตัวอย่างในแผน: ชื่อ · สถานะ (r เกินกำหนด · a กำลังทำ · g เสร็จสิ้น) · เดือนที่วางแผนไว้ (ช่องที่ 1–12)
const TASKS = [
  { name: 'อบรมดับเพลิงขั้นต้น', st: 'r', label: 'เกินกำหนด', at: [6, 7] },
  { name: 'ตรวจวัดระดับเสียง', st: 'a', label: 'กำลังทำ', at: [9, 10] },
  { name: 'ตรวจสอบถังดับเพลิง', st: 'g', label: 'เสร็จสิ้น', at: [3, 9] },
];

const MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const [Y, M] = LAW_LIBRARY.asOfIso.split('-').map(Number);
const YEAR = Y + 543;
const MONTH = `${MONTHS[M - 1]} ${YEAR}`;
const PCT = Math.round((PLAN.done / PLAN.all) * 100);

const LABEL = 'ภาพเคลื่อนไหวจำลองหน้าจอ SafeAct Club';
const STILL_TITLE = FEATURES.find((f) => f.id === 'laws').name;   // ชื่อฟีเจอร์ตามที่ใช้ทั้งเว็บ ("อัปเดตกฎหมาย")
const ARIA = { playing: `หยุด${LABEL} ชั่วคราว`, paused: `เล่น${LABEL}` };

const Bell = () => <svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.6 2H4.4zM10 21a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Scale = () => <svg viewBox="0 0 24 24"><path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Spark = () => <svg viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" fill="currentColor" /></svg>;
const Doc = () => <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;

// ตัวเลขนับขึ้นด้วย CSS (@property --pmn) — ไม่มี JS ต่อเฟรม · ค่า --to คือเลขปลายทาง (ภาพนิ่งแสดงเลขนี้)
const Num = ({ to }) => <b className="pm-n" style={{ '--to': to }} />;

function NoteItem({ cat, time, impact, w }) {
  return (
    <li className="pm-it">
      <i className="pm-it__ic"><Scale /></i>
      {/* ชื่อกฎหมายเป็นแถบ: ไม่อ้างชื่อกฎหมายฉบับใดว่าออกใหม่ */}
      <span className="pm-it__top"><i className="pm-it__bar" style={{ width: w }} /><em className={`pm-pill pm-pill--${impact === 'สูง' ? 'r' : 'a'}`}>ผลกระทบ {impact}</em></span>
      <small>{cat} · {time}</small>
      <i className="pm-it__dot" />
    </li>
  );
}

export default function PadMotion({ alt, still = false }) {
  const ref = useRef(null);
  const img = useRef(null);
  const [live, setLive] = useState(false);   // true หลัง mount ในเบราว์เซอร์ที่เล่นแอนิเมชันได้
  const [ready, setReady] = useState(false); // ภาพโหลดแล้ว (ไม่เปิดจอกระจกทับภาพที่ยังไม่มา)
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (still || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
    const el = img.current;
    const done = () => setReady(true);
    if (el.complete && el.naturalWidth) done(); else el.addEventListener('load', done, { once: true });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current);
    // ข้ามจุดตัด 1068/1069px (หมุนจอ ย่อหน้าต่าง): แอนิเมชันที่เปลี่ยนชื่อตามเลย์เอาต์จะเริ่มนับใหม่ → ตั้งเวลาให้ตรงกับเส้นหลัก
    const mq = matchMedia('(max-width: 1068px)');
    const sync = () => requestAnimationFrame(() => {
      const all = ref.current?.getAnimations?.({ subtree: true }) ?? [];
      const main = all.find((a) => a.animationName === 'pm-proj');
      if (!main) return;
      const loop = main.effect.getTiming().duration;
      all.forEach((a) => { if (a !== main && a.effect.getTiming().duration === loop) a.currentTime = main.currentTime; });
    });
    mq.addEventListener('change', sync);
    return () => { io.disconnect(); el.removeEventListener('load', done); mq.removeEventListener('change', sync); };
  }, [still]);

  // ผู้ใช้กดหยุด = ค้างเฟรมไว้แม้เลื่อนออกนอกจอ · ไม่ได้กดหยุด = ออกนอกจอแล้วกลับมาเริ่มใหม่
  const play = live && ready && (inView || paused);
  const state = paused ? 'paused' : 'playing';

  return (
    <div ref={ref} className="pm" data-still={still || undefined} data-play={play || undefined} data-paused={paused || undefined}>
      {/* ภาพ 2 ชุด: แนวตั้งสำหรับกล่องแนวตั้ง (≤ 1068px · แสดงกว้างราว 1.8 เท่าของกล่อง แล้วครอปซ้ายขวา) · แนวกว้าง 21:9 สำหรับจอคอมพิวเตอร์ */}
      <picture>
        <source media="(max-width: 1068px)" srcSet="/assets/about-team-m-800.webp 800w, /assets/about-team-m.webp 1215w"
          sizes={still ? '(max-width: 480px) 148vw, 710px' : '(max-width: 480px) 180vw, 865px'} width="1215" height="1324" />
        <img ref={img} className="pm__photo" src="/assets/about-team.webp" srcSet="/assets/about-team-960.webp 960w, /assets/about-team.webp 2000w"
          sizes="(min-width: 1305px) 1260px, 96vw" width="2000" height="883" fetchPriority="high" alt={alt} />
      </picture>

      <div className="pm__stage" role="img" data-nosnippet=""
        aria-label={still
          ? `ภาพจำลองหน้าจอ${STILL_TITLE}ของ SafeAct Club บนแท็บเล็ต แสดงสรุปกฎหมายใหม่ประจำเดือน${MONTH} แยกเป็นฉบับใหม่ แก้ไข และยกเลิก พร้อมรายการแจ้งเตือนกฎหมายใหม่ตามหมวดที่ติดตาม ตัวเลขในภาพเป็นข้อมูลตัวอย่าง`
          : `${LABEL} บนแท็บเล็ต แสดง 3 ฟีเจอร์ หนึ่ง แจ้งเตือนกฎหมายใหม่ตามหมวดที่ติดตาม พร้อมสรุปกฎหมายใหม่ประจำเดือน${MONTH} สอง หน้า Safety Action Plan สรุปจำนวนงานที่เสร็จสิ้น กำลังทำ และเกินกำหนด เมื่อกดปุ่มแจ้งเตือนจะบอกจำนวนงานที่เกินกำหนด สาม ผู้ช่วย AI ตรวจแผนงาน พบว่ายังขาด${MISSING} ซึ่งกฎกระทรวงฯ ป้องกันและระงับอัคคีภัย พ.ศ. 2555 กำหนดอย่างน้อยปีละ 1 ครั้ง เมื่อสั่งให้เพิ่มงาน ผู้ช่วยเตรียมการ์ดให้กดยืนยันเพิ่มลงแผน ตัวเลขในภาพเป็นข้อมูลตัวอย่าง`}>
        <i className="pm__glint" aria-hidden="true" />
        <div className="pm__proj" aria-hidden="true">
          <div className="pm__beamwrap"><i className="pm__beam" /><i className="pm__edge pm__edge--a" /><i className="pm__edge pm__edge--b" /></div>
          <div className="pm__panel">
            <i className="pm__glass" /><i className="pm__flash" />
            <div className="pm__screen">
              {/* แถบแอป */}
              <div className="pm__bar">
                <img src="/assets/app-icon-64.webp" width="64" height="64" alt="" loading="lazy" decoding="async" />
                <b>{COMPANY.appName}</b>
                <span className="pm__bell"><Bell /><b className="pm__badge pm-n" style={{ '--to': LAWS.unread }} /></span>
              </div>

              {/* หัวข้อขายของแต่ละฉาก */}
              <div className="pm__caps">
                {still ? <p className="pm__cap pm__cap--1"><span>{STILL_TITLE}</span></p> : (<>
                  <p className="pm__cap pm__cap--1"><span>กฎหมายใหม่เดือนนี้</span> <span>แจ้งเตือนถึงคุณ</span></p>
                  <p className="pm__cap pm__cap--2"><span>Action Plan</span> <span>แจ้งเตือนงานเกินกำหนด</span></p>
                  <p className="pm__cap pm__cap--3"><span>AI ค้นหาปัญหา</span> <span>ในแผนงานของคุณ</span></p>
                </>)}
              </div>

              <div className="pm__scenes">
                {/* ฉาก 1: กฎหมายใหม่ประจำเดือน + รายการแจ้งเตือน */}
                <div className="pm__scene pm__s1">
                  <div className="pm-card pm-mc">
                    <p className="pm-mc__top"><em className="pm-pill pm-pill--b">ล่าสุด</em><b>{MONTH}</b></p>
                    <p className="pm-mc__num"><Num to={LAWS.total} /><small>ฉบับ</small></p>
                    <p className="pm-mc__chips">
                      <em className="pm-pill pm-pill--g">ใหม่ {LAWS.fresh}</em>
                      <em className="pm-pill pm-pill--a">แก้ไข {LAWS.edited}</em>
                      <em className="pm-pill pm-pill--p">ยกเลิก {LAWS.cancelled}</em>
                    </p>
                  </div>
                  <div className="pm-card pm-dd">
                    <p className="pm-dd__head"><b>การแจ้งเตือน <span className="pm-d">({LAWS.unread})</span></b><span>อ่านทั้งหมด</span></p>
                    <ul>
                      <NoteItem cat="พระราชบัญญัติ โรงงาน" time="เมื่อสักครู่" impact="สูง" w="86%" />
                      <NoteItem cat="การควบคุมอาคาร" time="2 ชม.ที่แล้ว" impact="กลาง" w="64%" />
                      <NoteItem cat="มลพิษทางน้ำ" time="5 ชม.ที่แล้ว" impact="กลาง" w="76%" />
                    </ul>
                  </div>
                </div>

                {!still && (<>
                {/* ฉาก 2: Action Plan */}
                <div className="pm__scene pm__s2">
                  <div className="pm-ph">
                    <p><b>Safety Action Plan</b><em className="pm-pill pm-pill--b pm-d">ปี {YEAR}</em></p>
                    <span className="pm-btn pm-ph__alert"><Bell />แจ้งเตือน<b className="pm-ph__count">{PLAN.late}</b><i className="pm-tap" /></span>
                  </div>
                  <div className="pm-plan">
                    <div className="pm-kpis">
                      <div className="pm-card pm-kpi">
                        <small>แผนงานทั้งหมด</small>
                        <p className="pm-kpi__all"><Num to={PLAN.all} /><em>{PCT}%</em>
                          <svg className="pm-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" /><circle className="pm-ring__v" cx="18" cy="18" r="15" pathLength="100" style={{ '--v': PCT }} /></svg></p>
                      </div>
                      <div className="pm-card pm-kpi pm-kpi--g"><small>เสร็จสิ้น</small><Num to={PLAN.done} /></div>
                      <div className="pm-card pm-kpi pm-kpi--a"><small>กำลังทำ</small><Num to={PLAN.doing} /></div>
                      <div className="pm-card pm-kpi pm-kpi--r"><small>เกินกำหนด</small><Num to={PLAN.late} /><i className="pm-kpi__dot" /></div>
                    </div>
                    {/* รายการงานในแผน: แถวที่ไม่พอดีกับความสูงจอจะถูกซ่อนทั้งแถว (flex-wrap) */}
                    <ul className="pm-rows">
                      {TASKS.map((t) => (
                        <li key={t.name} className={`pm-card pm-row pm-row--${t.st}`}>
                          <b>{t.name}</b>
                          <em className={`pm-pill pm-pill--${t.st}`}>{t.label}</em>
                          <span className="pm-row__yr pm-d">{MONTHS.map((m, i) => <i key={m} className={t.at.includes(i + 1) ? 'on' : undefined} />)}</span>
                        </li>
                      ))}
                    </ul>
                    <i className="pm-scan" />
                  </div>
                  <div className="pm-toastbox">
                    <div className="pm-toast">
                      <i className="pm-toast__ic"><Bell /></i>
                      <p><b><span>มี {PLAN.late} รายการเกินกำหนด,</span> <span>{PLAN.doing} รายการกำลังดำเนินการ</span></b>
                        <small>ตรวจสอบและอัปเดตสถานะให้เรียบร้อย</small></p>
                    </div>
                  </div>
                </div>

                {/* ฉาก 3: ผู้ช่วย SafeAct ตรวจแผนงาน → สมาชิกสั่งเพิ่มงาน → การ์ดยืนยัน
                    .pm-fold = ชิ้นที่กางออก/พับเก็บได้ (ชิ้นเก่าพับเก็บเมื่อชิ้นใหม่ต้องใช้ที่) */}
                <div className="pm__scene pm__s3">
                  <div className="pm-tho"><div className="pm-thread">
                    <div className="pm-fold pm-fold--q"><div className="pm-fold__in pm-gapb">
                      <div className="pm-row1">
                        <span className="pm-dots"><i /><i /><i /></span>
                        <p className="pm-ask">ช่วยตรวจแผนให้หน่อย</p>
                      </div>
                    </div></div>
                    <div className="pm-fold pm-fold--a"><div className="pm-fold__in pm-gapb">
                      <div className="pm-card pm-ans">
                        <div className="pm-fold pm-fold--h"><div className="pm-fold__in">
                          <p className="pm-ans__who"><Spark />ผู้ช่วย SafeAct</p>
                          <p className="pm-ans__l pm-ans__l--1">ตรวจแผนปี {YEAR} แล้วครับ</p>
                        </div></div>
                        <p className="pm-ans__l pm-ans__l--2"><i className="pm-bul pm-bul--a" /><span><b>ยังขาด</b> {MISSING}</span></p>
                        <div className="pm-fold pm-fold--m"><div className="pm-fold__in">
                          <p className="pm-ans__l pm-ans__l--3"><span>กฎหมายกำหนด <mark>อย่างน้อยปีละ 1 ครั้ง</mark></span></p>
                        </div></div>
                        <div className="pm-fold pm-fold--t"><div className="pm-fold__in">
                          <p className="pm-ans__l pm-ans__l--4"><i className="pm-bul pm-bul--r" /><span>เลยกำหนดแล้ว {PLAN.late} งาน</span></p>
                        </div></div>
                      </div>
                    </div></div>
                    <div className="pm-fold pm-fold--c"><div className="pm-fold__in">
                      <div className="pm-card pm-cite">
                        <small>กฎหมายที่เกี่ยวข้อง</small>
                        <p><Doc /><span><span>กฎกระทรวงฯ ป้องกันและระงับอัคคีภัย</span> <span>พ.ศ. 2555</span><small>กระทรวงแรงงาน</small></span></p>
                      </div>
                    </div></div>
                    <div className="pm-fold pm-fold--q2"><div className="pm-fold__in pm-gapt pm-right">
                      <p className="pm-ask pm-ask--2">เพิ่มงานนี้ลงแผนให้เลย</p>
                    </div></div>
                    <div className="pm-fold pm-fold--d"><div className="pm-fold__in pm-gapt">
                      <div className="pm-card pm-add">
                        <small>เพิ่มงานลงแผนงาน</small>
                        <b>{MISSING}</b>
                        <span className="pm-btn pm-add__btn">
                          <span className="pm-add__a">เพิ่มลงแผนงาน</span>
                          <svg className="pm-add__ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" pathLength="100" /></svg>
                          <span className="pm-add__b"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="100" /></svg>เพิ่มลงแผนแล้ว</span>
                          <i className="pm-tap" />
                        </span>
                      </div>
                    </div></div>
                  </div></div>
                </div>
                </>)}
              </div>

              {!still && <p className="pm__segs"><i /><i /><i /></p>}
            </div>
          </div>
        </div>
      </div>

      {live && (
        <button type="button" className={`im__btn im__btn--${state} is-ready`} aria-label={ARIA[state]}
          onClick={() => setPaused((p) => !p)} />
      )}
    </div>
  );
}
