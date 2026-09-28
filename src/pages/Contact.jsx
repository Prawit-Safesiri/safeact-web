import { COMPANY, fullAddress } from '../data/company.js';
import { IconCall, IconMail, IconBuilding } from '../components/Icons.jsx';
import LineAddFriend from '../components/LineAddFriend.jsx';

// แผนที่: ค้นด้วยชื่ออาคาร "SPE Tower Bangkok" ได้หมุดเดียวตรงอาคาร (ตรงกับผลค้นที่อยู่ 252 Phahonyothin Rd, Samsen Nai)
// ชื่อไทย/ที่อยู่ไทยแบบเต็มทำให้ Google เจอหลายที่ หมุดกระจาย — ทดสอบแล้ว 27 ก.ย. 2569
// ที่อยู่: ไม่ตัดบรรทัดกลาง "ห้องเลขที่ 1032-01" และกลางชื่อถนน / แขวง / เขต
const keepNumbers = (t) => t.split(/(ห้องเลขที่ \d+-\d+|(?:ถนน|แขวง|เขต)\S+)/).map((p, i) => (i % 2 ? <span key={i} style={{ whiteSpace: 'nowrap' }}>{p}</span> : p));

const MAP_QUERY = encodeURIComponent('SPE Tower Bangkok');
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&hl=th&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

export default function Contact() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="c-title" style={{ paddingBottom: 72 }}>
        {/* ภาพ hero ด้านบนหัวเรื่อง (ภาพชุดเดียวกับหน้าเกี่ยวกับเรา) */}
        <div className="container--wide contact-hero">
          <img className="about-hero" src="/assets/about-team.webp" srcSet="/assets/about-team-960.webp 960w, /assets/about-team.webp 1888w"
            sizes="(min-width: 1305px) 1260px, 96vw" width="1888" height="833" fetchPriority="high"
            alt="ทีม SafeAct สวมหมวกนิรภัยและแว่นตานิรภัย ดูข้อมูลบนแท็บเล็ตในโรงงาน" />
        </div>
        <div className="container">
          {/* ไอคอนแอปพร้อมเงายาว แบบเดียวกับหน้าแรก */}
          <span className="hero__icon-wrap contact-icon">
            <span className="hero__icon-shadow" aria-hidden="true" />
            <img className="hero__icon" src="/assets/app-icon-352.webp" srcSet="/assets/app-icon-352.webp 2x, /assets/app-icon-600.webp 3x"
              width="352" height="352" alt={`ไอคอนแอป ${COMPANY.appName} ของ SafeAct`} decoding="async" />
          </span>
          <h1 id="c-title" className="t-hero">ติดต่อ SafeAct</h1>
          {/* แต่ละ span = 1 บรรทัดบนจอกว้าง 1069px ขึ้นไป (ตัดบรรทัดตามที่เจ้าของกำหนด) */}
          <p className="t-sub t-lines">
            <span>คุยกับทีมขาย ขอใบเสนอราคาสำหรับองค์กร นัดสาธิตระบบ หรือ</span>{' '}
            <span>สอบถามเรื่องการชำระเงิน <span style={{ whiteSpace: 'nowrap' }}>เราพร้อมช่วยเหลือ</span></span>
          </p>
          <div className="contact-line">
            <span>หรือแชตกับเราทาง LINE</span>
            <LineAddFriend />
          </div>
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
              <address style={{ fontStyle: 'normal' }}><p>{COMPANY.nameTh}<br />{keepNumbers(fullAddress())}</p></address>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" aria-label="แผนที่" style={{ paddingTop: 0 }}>
        <div className="container--wide">
          {/* แผนที่ฝังจาก Google Maps ใช้เป็นภาพพื้นหลัง · ลิงก์วางทับเต็มกล่อง (iframe อยู่นอก <a> ตามข้อกำหนด HTML) */}
          <div className="map">
            <iframe className="map__frame" src={MAP_EMBED} title="แผนที่สำนักงาน SafeAct" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} aria-hidden="true" />
            <a className="map__link" href={MAP_LINK} target="_blank" rel="noopener noreferrer" aria-label={`เปิดแผนที่สำนักงาน ${COMPANY.nameTh} ใน Google Maps (เปิดแท็บใหม่)`}>
              <span className="map__card">
                <b>{COMPANY.nameTh}</b>{' '}
                <span>{keepNumbers(fullAddress())}</span>
              </span>{' '}
              <span className="map__btn">เปิดใน Google Maps</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
