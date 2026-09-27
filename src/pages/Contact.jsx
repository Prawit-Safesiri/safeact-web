import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY, fullAddress, appLink } from '../data/company.js';
import { IconCall, IconMail, IconBuilding } from '../components/Icons.jsx';

// แผนที่: ค้นด้วยชื่ออาคาร "SPE Tower Bangkok" ได้หมุดเดียวตรงอาคาร (ตรงกับผลค้นที่อยู่ 252 Phahonyothin Rd, Samsen Nai)
// ชื่อไทย/ที่อยู่ไทยแบบเต็มทำให้ Google เจอหลายที่ หมุดกระจาย — ทดสอบแล้ว 27 ก.ย. 2569
const MAP_QUERY = encodeURIComponent('SPE Tower Bangkok');
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&hl=th&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

// ยังไม่มี backend รับฟอร์ม → ประกอบข้อความเป็นอีเมลถึงทีมขาย (ทำงานได้ทันทีโดยไม่เก็บข้อมูลไว้ที่เว็บ)
function LeadForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const body = [
      `ชื่อ-นามสกุล: ${f.name}`, `บริษัท: ${f.company}`, `อีเมล: ${f.email}`, `โทรศัพท์: ${f.phone}`,
      `จำนวนผู้ใช้งาน/สาขา: ${f.size}`, `เรื่องที่สนใจ: ${f.topic}`, '', f.message,
    ].join('\n');
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`[เว็บไซต์] ${f.topic} — ${f.company || f.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    // method="post": ถ้ากดส่งก่อน JavaScript โหลด ข้อมูลที่กรอกจะไม่ไปอยู่ใน URL
    <form className="form" method="post" action="/contact/" onSubmit={onSubmit} aria-describedby="form-note">
      <div className="field"><label htmlFor="f-name">ชื่อ-นามสกุล</label><input id="f-name" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="f-company">บริษัท / หน่วยงาน</label><input id="f-company" name="company" autoComplete="organization" /></div>
      <div className="field"><label htmlFor="f-email">อีเมล</label><input id="f-email" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="f-phone">โทรศัพท์</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" /></div>
      <div className="field"><label htmlFor="f-topic">เรื่องที่สนใจ</label>
        <select id="f-topic" name="topic" defaultValue="ขอใบเสนอราคา Enterprise">
          <option>ขอใบเสนอราคา Enterprise</option>
          <option>สาธิตระบบ (Demo)</option>
          <option>ชำระเงินแบบใบแจ้งหนี้</option>
          <option>ยกเลิก / ขอคืนเงิน</option>
          <option>อื่น ๆ</option>
        </select>
      </div>
      <div className="field"><label htmlFor="f-size">จำนวนผู้ใช้งาน / สาขา</label><input id="f-size" name="size" placeholder="เช่น 10 คน 3 สาขา" /></div>
      <div className="field full"><label htmlFor="f-msg">รายละเอียด</label><textarea id="f-msg" name="message" /></div>
      <div className="full" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <button className="btn" type="submit">ส่งข้อความ</button>
        <p id="form-note" className="form__note">ระบบจะเปิดแอปอีเมลของท่านพร้อมข้อความที่กรอก ข้อมูลใช้เพื่อติดต่อกลับตาม<Link to="/privacy/">นโยบายความเป็นส่วนตัว</Link> เท่านั้น</p>
      </div>
      {sent && <p className="full" role="status">เปิดแอปอีเมลแล้ว หากไม่เปิด โปรดส่งถึง {COMPANY.email} โดยตรง</p>}
    </form>
  );
}

export default function Contact() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="c-title" style={{ paddingBottom: 72 }}>
        <div className="container">
          <h1 id="c-title" className="t-hero">ติดต่อ SafeAct</h1>
          <p className="t-sub">คุยกับทีมขาย ขอใบเสนอราคาสำหรับองค์กร นัดสาธิตระบบ หรือสอบถามเรื่องการชำระเงิน<br /><span style={{ whiteSpace: 'nowrap' }}>เราพร้อมช่วยเหลือ</span></p>
        </div>
      </section>

      <section style={{ paddingBottom: 'var(--sec-pad)' }} aria-label="ช่องทางติดต่อ">
        <div className="container--wide">
          <ul className="cards">
            <li className="card">
              <IconCall className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h2>โทรศัพท์</h2>
              <p>{COMPANY.hours}</p>
              <a className="card__big" href={`tel:${COMPANY.phoneE164}`}>{COMPANY.phone}</a>
            </li>
            <li className="card">
              <IconMail className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h2>อีเมล</h2>
              <p>ตอบกลับภายใน 1 วันทำการ</p>
              <a className="card__big" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </li>
            <li className="card">
              <IconBuilding className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h2>สำนักงาน</h2>
              <address style={{ fontStyle: 'normal' }}><p>{COMPANY.nameTh}<br />{fullAddress()}</p></address>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="form-title">
        <div className="container">
          <header className="section-head">
            <h2 id="form-title" className="t-h2">ส่งข้อความถึงเรา</h2>
            <p className="t-lead">สมาชิกปัจจุบันจัดการแผนและใบเสร็จได้เองที่ <a href={appLink('/billing')}>หน้าแพ็กเกจสมาชิก</a></p>
          </header>
          <LeadForm />
        </div>
      </section>

      <section className="section" aria-label="แผนที่">
        <div className="container--wide">
          {/* แผนที่ฝังจาก Google Maps ใช้เป็นภาพพื้นหลัง · ลิงก์วางทับเต็มกล่อง (iframe อยู่นอก <a> ตามข้อกำหนด HTML) */}
          <div className="map">
            <iframe className="map__frame" src={MAP_EMBED} title="แผนที่สำนักงาน SafeAct" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} aria-hidden="true" />
            <a className="map__link" href={MAP_LINK} target="_blank" rel="noopener noreferrer" aria-label={`เปิดแผนที่สำนักงาน ${COMPANY.nameTh} ใน Google Maps (เปิดแท็บใหม่)`}>
              <span className="map__card">
                <b>{COMPANY.nameTh}</b>{' '}
                <span>{fullAddress()}</span>
              </span>{' '}
              <span className="map__btn">เปิดใน Google Maps</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
