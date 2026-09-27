import { Link } from 'react-router-dom';
import { COMPANY, fullAddress } from '../data/company.js';

export default function About() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="a-title">
        <div className="container">
          <h1 id="a-title" className="t-hero">เกี่ยวกับ SafeAct</h1>
          <p className="t-sub">เราเชื่อว่าทุกสถานประกอบการควรเข้าถึงกฎหมายความปลอดภัยได้ง่าย ถูกต้อง และทันเวลา เพื่อให้คนทำงานกลับบ้านอย่างปลอดภัยทุกวัน</p>
        </div>
        <div className="container--wide hero__media">
          <img className="about-hero" src="/assets/about-team.webp" srcSet="/assets/about-team-960.webp 960w, /assets/about-team.webp 1888w"
            sizes="(min-width: 1305px) 1260px, 96vw" width="1888" height="833" fetchPriority="high"
            alt="เจ้าหน้าที่ความปลอดภัยสองคนสวมหมวกนิรภัยและแว่นตานิรภัย ดูข้อมูลบนแท็บเล็ตในโรงงาน" />
        </div>
      </section>

      <section className="section" aria-labelledby="who">
        <div className="container">
          <div className="frow">
            <div className="frow__text">
              <h2 id="who" className="t-h3">เราคือใคร</h2>
              <p>{COMPANY.aboutEntity}</p>
              <p style={{ marginTop: 14 }}>{COMPANY.aboutService}</p>
              <Link className="more" to="/features/">ดูฟีเจอร์ทั้งหมดของ SafeAct</Link>
            </div>
            <div className="frow__media about-icon"><img src="/assets/app-icon-600.webp" srcSet="/assets/app-icon-352.webp 352w, /assets/app-icon-600.webp 600w, /assets/app-icon-lg.webp 1024w"
              sizes="300px" width="600" height="600" alt={`ไอคอนแอป ${COMPANY.appName} ของ SafeAct`} loading="lazy" decoding="async" /></div>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="how">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="how" className="t-h1">วิธีที่เราดูแลความถูกต้อง</h2>
          </header>
          <ol className="steps">
            <li><h3>ติดตามแหล่งทางการ</h3><p>ราชกิจจานุเบกษาและเว็บไซต์หน่วยงานรัฐที่เกี่ยวข้อง</p></li>
            <li><h3>สรุปสาระสำคัญ</h3><p>จัดหมวดตามลักษณะงาน และสรุปเป็นภาษาที่เข้าใจง่าย</p></li>
            <li><h3>ตรวจทานก่อนเผยแพร่</h3><p>มีผู้ตรวจทานข้อมูลทุกฉบับ พร้อมแนบลิงก์ต้นฉบับ</p></li>
            <li><h3>รับฟังและปรับปรุง</h3><p>รับข้อเสนอแนะจากสมาชิก แก้ไขข้อมูล และพัฒนาหมวดตามความต้องการจริง</p></li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="facts">
        <div className="container">
          <header className="section-head"><h2 id="facts" className="t-h2">ข้อมูลบริษัท</h2></header>
          <dl className="doc__body" style={{ margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(110px,220px) 1fr', gap: '14px 24px' }}>
            <dt className="muted">ชื่อนิติบุคคล</dt><dd>{COMPANY.nameTh} ({COMPANY.nameEn})</dd>
            <dt className="muted">เลขทะเบียน / ผู้เสียภาษี</dt><dd>{COMPANY.taxId}</dd>
            <dt className="muted">ชื่อบริการ</dt><dd>{COMPANY.brand} ({COMPANY.brandTh})</dd>
            <dt className="muted">วันจดทะเบียน</dt><dd>{COMPANY.registeredOnTh}</dd>
            <dt className="muted">ที่ตั้ง</dt><dd>{fullAddress()}</dd>
            <dt className="muted">เวลาทำการ</dt><dd>{COMPANY.hours}</dd>
            <dt className="muted">โทรศัพท์</dt><dd><a href={`tel:${COMPANY.phoneE164}`}>{COMPANY.phone}</a></dd>
            <dt className="muted">อีเมล</dt><dd><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd>
            <dt className="muted">ตรวจสอบข้อมูลนิติบุคคล</dt><dd><a href="https://datawarehouse.dbd.go.th/company/profile/50105568153603" rel="noopener" target="_blank">DBD DataWarehouse+ (กรมพัฒนาธุรกิจการค้า)</a></dd>
          </dl>
          <div className="cta-row" style={{ marginTop: 56 }}>
            <Link className="btn" to="/contact/">ติดต่อเรา</Link>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
