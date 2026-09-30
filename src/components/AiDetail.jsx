import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { checkoutLink, AI_DISCLAIMER } from '../data/company.js';
import { AI_ROWS as ROWS, AI_POINTS as POINTS } from '../data/ai.js';

// หน้าต่างรายละเอียด "AI SafeAct ต่างกับ AI ทั่วไปอย่างไร" — เปิดจากไทล์ AI ในหน้าแรก
// เนื้อหาชุดเดียวกันมีหน้าของตัวเองที่ /ai/ (src/pages/AiCompare.jsx) — Google เก็บหน้านั้นลงดัชนี
// ลิงก์ที่เปิดหน้าต่างเป็น <a href="/ai/"> จริง: บอตและเบราว์เซอร์ที่ไม่มี JavaScript ไปหน้า /ai/ · ผู้ใช้ทั่วไปเห็นเป็นหน้าต่าง
// ใช้ <dialog> ของเบราว์เซอร์: ปิดด้วยปุ่ม ✕ ปุ่ม Esc หรือคลิกพื้นหลัง · โฟกัสถูกกักในหน้าต่างให้เอง
// ภาพส่วนหัว = public/assets/ai-compare.webp (เจ้าของส่งมา 28 ก.ย. 2569) ตั้งเป็นพื้นหลังของ .aid__hero
// เนื้อหาข้อเปรียบเทียบอยู่ที่ src/data/ai.js (ใช้ร่วมกับ llms.txt)

export function AiContent({ as: H = 'h2', titleId, onNavigate, photo = false }) {
  return (
    <>
      <header className={`aid__hero${photo ? ' aid__hero--img' : ''}`}>
        {photo && <img className="aid__photo" src="/assets/ai-compare.webp" srcSet="/assets/ai-compare-800.webp 800w, /assets/ai-compare.webp 2000w" sizes="(min-width: 1206px) 1206px, 100vw" width="2000" height="1198" alt="ไอคอนแอป SafeAct บนโล่แก้วเรืองแสง เทียบกับไอคอน AI ทั่วไปสีดำ" fetchPriority="high" />}
        <p className="aid__kicker">AI ผู้ช่วยกฎหมาย</p>
        <H id={titleId} className="aid__title"><span>AI SafeAct</span> <span>ต่างกับ AI ทั่วไปอย่างไร</span></H>
      </header>
      <div className="aid__body">
        <p className="aid__lead">ผู้ช่วยที่ค้นจากคลังกฎหมายจริง รู้จักสถานประกอบการของคุณ และเห็นแผนงานของคุณ</p>

        <ul className="aid__points">
          {POINTS.map(([h, p]) => <li key={h}><h3>{h}</h3><p>{p}</p></li>)}
        </ul>

        <h3 className="aid__h">เปรียบเทียบให้เห็นชัด</h3>
        <div className="aid__tablewrap">
          <table className="aid__table">
            <thead>
              <tr><th scope="col"><span className="visually-hidden">หัวข้อ</span></th><th scope="col">AI ทั่วไป</th><th scope="col" className="is-us">AI SafeAct</th></tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td data-h="AI ทั่วไป">{a}</td><td className="is-us" data-h="AI SafeAct">{b}</td></tr>)}
            </tbody>
          </table>
        </div>

        <p className="aid__note">{AI_DISCLAIMER}</p>
        <p className="aid__cta">
          <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>{' '}
          <Link className="more" to="/features/#ai" onClick={onNavigate}>ดูรายละเอียดฟีเจอร์ AI</Link>
        </p>
      </div>
    </>
  );
}

export default function AiDetail({ label, className, style }) {
  const ref = useRef(null);
  const close = () => ref.current?.close();
  // คลิกปกติ = เปิดหน้าต่าง · คลิกพร้อมปุ่ม Cmd/Ctrl/Shift หรือคลิกกลาง = เปิดหน้า /ai/ ตามปกติของลิงก์
  const open = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !ref.current?.showModal) return;
    e.preventDefault(); ref.current.showModal();
  };
  return (
    <>
      <a href="/ai/" className={className} style={style} aria-haspopup="dialog" onClick={open}>{label}</a>
      <dialog ref={ref} className="aid" aria-labelledby="aid-title" data-nosnippet=""
        onClick={(e) => { if (e.target === ref.current) close(); }}>
        <div className="aid__box">
          <button type="button" className="aid__close" aria-label="ปิด" onClick={close} />
          <AiContent titleId="aid-title" onNavigate={close} />
        </div>
      </dialog>
    </>
  );
}
