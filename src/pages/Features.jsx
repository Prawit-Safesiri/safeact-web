import StoreBadges from '../components/StoreBadges.jsx';
import { Link } from 'react-router-dom';
import AiMotion from '../components/AiMotion.jsx';
import { checkoutLink, COMPANY, AI_DISCLAIMER } from '../data/company.js';
import { LAW_CATEGORIES, LAW_LIBRARY, FEATURES } from '../data/service.js';
import { useLivePlans } from '../data/plans-live.js';

// ภาพหน้าจอจริงจากแอป SafeAct (safeact-connect-hub) · เรนเดอร์ 2x · public/assets/features/
// srcset: เบราว์เซอร์เลือกขนาดที่พอดีกับช่องแสดงผล (ครึ่งคอลัมน์ 458px บนจอใหญ่ · เต็มความกว้างบนมือถือ)
function Shot({ name, alt, hero = false }) {
  const f = (w) => `/assets/features/${name}${w ? `-${w}` : ''}.webp`;
  return hero
    ? <img className="shot shot--hero" src={f(1440)} srcSet={`${f(960)} 960w, ${f(1440)} 1440w, ${f()} 2880w`}
        sizes="(min-width: 1305px) 1260px, 96vw" width="2880" height="1234" alt={alt} fetchPriority="high" />
    : <img className="shot" src={f(1160)} srcSet={`${f(800)} 800w, ${f(1160)} 1160w, ${f()} 2320w`}
        sizes="(min-width: 1069px) 458px, (min-width: 735px) 326px, 88vw" width="2320" height="1740" alt={alt} loading="lazy" decoding="async" />;
}

// หัวข้อ = ชื่อฟีเจอร์ (eyebrow) + สโลแกน อยู่ใน <h3> เดียวกัน เพื่อให้ชื่อฟีเจอร์เป็นส่วนหนึ่งของหัวข้อจริง
function Row({ id, also, eyebrow, title, body, detail, points, media, flip, plan }) {
  return (
    <div className={`frow${flip ? ' frow--flip' : ''}`} id={id} style={{ scrollMarginTop: 80 }}>
      <div className="frow__media">{media}</div>
      <div className="frow__text">
        <h3 className="frow__head"><span className="t-eyebrow">{eyebrow}</span>{' '}<span className="t-h3">{title}</span></h3>
        <p>{body}</p>
        {detail && <p id={also} style={{ marginTop: 12, scrollMarginTop: 80 }}>{detail}</p>}
        <ul className="checks">{points.map((p) => <li key={p}>{p}</li>)}</ul>
        {plan && <p className="t-small muted" style={{ marginTop: 20 }}>มีในแผน {plan}</p>}
      </div>
    </div>
  );
}

export default function Features() {
  // 26 พ.ย. 2569 เจ้าของ: "มีในแผน …" ทุกบรรทัดตามสิทธิ์จริงในระบบสมาชิก (item_key ของ plan_feature_matrix) — การตั้งค่าเปลี่ยน ข้อความเปลี่ยนตาม
  const { planFrom, planWhere, AI_QUOTA_TEXT, APP_PLAN } = useLivePlans();
  // คลังเอกสาร: ดาวน์โหลดสไลด์ได้เฉพาะบางแผน (Basic ดูรายการสไลด์ได้อย่างเดียว) → บอกต่อท้ายเมื่อแผนที่ดาวน์โหลดได้ต่างจากแผนที่มีคลังเอกสาร
  const docsFrom = planFrom('documents');
  const slidesDl = planWhere('presentations', /ดาวน์โหลด/);
  return (
    <main id="main">
      <section className="hero" aria-labelledby="f-title">
        <div className="container">
          <h1 id="f-title" className="t-hero">ฟีเจอร์ SafeAct{' '}<br /><span className="t-hero__sub">ระบบบริหารงานความปลอดภัย</span></h1>
          {/* บรรทัดสุดท้าย "ไปจนถึง…" ขึ้นบรรทัดใหม่บนจอกว้าง (ตัดบรรทัดตามที่เจ้าของกำหนด) */}
          <p className="t-sub t-lines">
            <span>{COMPANY.definitionShort} ตั้งแต่ติดตามกฎหมาย</span>{' '}
            <span>ไปจนถึงบริหารงานความปลอดภัยทั้งองค์กร</span>
          </p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>{' '}
            <Link className="more" to="/pricing/">เปรียบเทียบแผน</Link>
          </div>
          <nav className="fnav" aria-label="ฟีเจอร์ในหน้านี้">
            <ul className="chips">
              {FEATURES.filter((f) => f.nav).map((f) => <li key={f.id}><a href={`#${f.id}`}>{f.nav}</a></li>)}
            </ul>
          </nav>
        </div>
        <div className="container--wide hero__media">
          <Shot hero name="hero" alt="หน้า Hub กฎหมายของ SafeAct: ค้นหากฎหมายและมาตรฐาน พร้อมการ์ดกฎหมายใหม่แต่ละเดือน" />
        </div>
      </section>

      <section className="section" aria-labelledby="laws">
        <div className="container">
          <header className="section-head">
            <h2 id="laws" className="t-h1" style={{ scrollMarginTop: 80 }}>ติดตามกฎหมาย</h2>
            <p className="t-lead">คลังกฎหมาย {LAW_LIBRARY.count.toLocaleString('en-US')} ฉบับ (ข้อมูล ณ {LAW_LIBRARY.asOfTh}) รู้ก่อน เตรียมตัวทัน ไม่พลาดกฎหมายที่เกี่ยวข้องกับสถานประกอบการของคุณ</p>
            <p style={{ marginTop: 20 }}><Link className="more" to="/law-updates/">ดูอัปเดตกฎหมายรายเดือนและหมวดทั้งหมด</Link></p>
          </header>
          <Row
            eyebrow="อัปเดตกฎหมาย" title="กฎหมายใหม่ทุกเดือน สรุปพร้อมอ้างอิง"
            body="ทีมงานติดตามพระราชบัญญัติ กฎกระทรวง ประกาศกรม และมาตรฐานที่เกี่ยวข้อง จากราชกิจจานุเบกษาและเว็บไซต์หน่วยงานรัฐ สรุปสาระสำคัญเป็นภาษาที่อ่านง่าย ตรวจทานก่อนเผยแพร่ และแนบลิงก์ต้นฉบับทุกฉบับ"
            points={['จัดหมวด: ' + LAW_CATEGORIES.join(' · '), 'ดูรายการตามเดือนที่ประกาศ', 'แสดงวันประกาศและวันมีผลใช้บังคับ']}
            media={<Shot name="laws" alt="รายการกฎหมายอัปเดตประจำเดือน พร้อมหน่วยงาน วันประกาศ วันมีผล ไฟล์สรุป Word Excel PowerPoint และฉบับเต็ม PDF" />}
            plan={planFrom('laws')}
          />
          <div style={{ height: 120 }} />
          <Row flip id="notifications"
            eyebrow="กฎหมายที่ติดตามและการแจ้งเตือน" title="เลือกเฉพาะที่เกี่ยวข้อง แล้วให้ระบบเตือนคุณ"
            // 26 พ.ย. 2569 เจ้าของ: Basic = แจ้งเตือนทางเว็บและอีเมล · แอปมือถือใช้ได้เฉพาะแผน Business ขึ้นไป
            body={`กดติดตามกฎหมายที่ใช้กับสถานประกอบการ ตั้งค่าหมวดที่ต้องการรับข่าว และรับการแจ้งเตือนทางเว็บและอีเมล ลูกค้าแผน ${APP_PLAN} ดูการแจ้งเตือนในแอป iPhone ได้ด้วย`}
            points={['รายการกฎหมายที่ติดตามของฉัน', 'ตั้งค่าการแจ้งเตือนรายหมวด', 'แจ้งเตือนทางเว็บและอีเมลสรุป']}
            media={<Shot name="notify" alt="หน้าตั้งค่าการแจ้งเตือนกฎหมาย เลือกหมวดและกฎหมายที่ต้องการติดตาม" />}
            plan={planFrom('notifications')}
          />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="workflow">
        <div className="container">
          <header className="section-head">
            <h2 id="workflow" className="t-h1" style={{ scrollMarginTop: 80 }}>ระบบงานความปลอดภัย</h2>
            <p className="t-lead">เครื่องมือที่ทีม จป. ใช้ทุกวัน อยู่ในระบบเดียวกับข้อมูลกฎหมาย</p>
          </header>
          <Row id="action-plan"
            eyebrow="Action Plan รายปี" title="แผนงานทั้งปี ผูกกับกฎหมายทุกกิจกรรม"
            body="สร้างแผนจากเทมเพลต กำหนดผู้รับผิดชอบและสัปดาห์ดำเนินการ แนบหลักฐานและบันทึก พร้อมอ้างอิงกฎหมายรายแถว บันทึกอัตโนมัติและซิงก์แบบเรียลไทม์ทุกอุปกรณ์"
            points={['เทมเพลตแผนงาน', 'แนบหลักฐานและบันทึกย่อ', 'ส่งออก CSV']}
            plan={planFrom('action_plan')}
            media={<Shot name="actionplan" alt="แผนงานความปลอดภัยรายปี สรุปจำนวนแผน ความคืบหน้า งานเกินกำหนด และตาราง 12 เดือนรายสัปดาห์" />}
          />
          <div style={{ height: 120 }} />
          <Row flip id="hearing"
            eyebrow="โปรแกรมอนุรักษ์การได้ยิน" title="จากแผนผังจุดเสียงดัง ถึงรายงานประจำปี"
            body="อัปโหลดแผนผังพื้นที่ วางจุดตรวจวัดระดับเสียง ผูกพนักงานกับพื้นที่ ติดตามผลทบทวน และสรุปเป็นรายงาน"
            points={['แผนที่จุดตรวจวัดเสียง', 'ข้อมูลพนักงานและหน้าที่', 'รายงานและการติดตามผล']}
            media={<Shot name="hearing" alt="แผนผังระดับเสียง (Noise Contour Map) แสดงจุดตรวจวัดและระดับ dB(A) ในอาคารผลิต" />}
            plan={planFrom('hearing')}
          />
        </div>
      </section>

      <section className="section" aria-labelledby="library">
        <div className="container">
          <h2 id="library" className="visually-hidden">คลังเอกสารและสไลด์ความปลอดภัย</h2>
          <Row id="documents"
            eyebrow="คลังเอกสารและสไลด์ความปลอดภัย" title="เอกสารและสไลด์ พร้อมใช้"
            body="แบบฟอร์ม คู่มือ Checklist และเอกสาร WI/SDS ด้านความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม รวมถึงสไลด์พรีเซนเทชั่นสำหรับการอบรมและสื่อสารภายใน ดาวน์โหลดไปใช้ได้ทันที"
            points={['แบบฟอร์ม คู่มือ และ Checklist', 'เอกสาร WI/SDS', 'สไลด์พรีเซนเทชั่น']}
            media={<Shot name="documents" alt="คลังเอกสารความปลอดภัย แบบฟอร์ม Checklist SOP JSA คู่มือ และ Template จัดตามหมวดหมู่ประเภทงาน" />}
            plan={slidesDl && slidesDl !== docsFrom ? `${docsFrom} · ดาวน์โหลดสไลด์ได้ในแผน ${slidesDl}` : docsFrom}
          />
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="ai">
        <div className="container">
          <header className="section-head">
            <h2 id="ai" className="t-h1" style={{ scrollMarginTop: 80 }}>AI ผู้ช่วยกฎหมาย</h2>
            <p className="t-lead">ถามเรื่องกฎหมายความปลอดภัยได้ทุกเมื่อ คำตอบมาพร้อมลิงก์ไปยังตัวบทกฎหมาย</p>
          </header>
          <div className="ai-demo"><AiMotion /></div>
          <ul className="props" style={{ marginTop: 64 }}>
            <li><h3 className="t-h4">ถาม-ตอบ พร้อมอ้างอิง</h3><p>ทุกคำตอบลิงก์กลับไปยังกฎหมายที่เกี่ยวข้องเพื่อให้ตรวจสอบได้</p></li>
            <li><h3 className="t-h4">แนบไฟล์ให้ช่วยสรุป</h3><p>แนบเอกสารแล้วให้ AI ช่วยสรุปประเด็นสำคัญ</p></li>
            <li><h3 className="t-h4">ช่วยร่างแผนงาน</h3><p>ให้ AI เสนอแผนงาน แล้วปรับแก้ก่อนนำเข้า Action Plan</p></li>
          </ul>
          <p style={{ textAlign: 'center', marginTop: 40 }}><Link className="more" to="/ai/">ดูว่า AI SafeAct ต่างจาก AI ทั่วไปอย่างไร</Link></p>
          <p className="t-small" style={{ textAlign: 'center', marginTop: 24, color: '#a1a1a6' }}>
            มีในแผน {planFrom('ai')}{AI_QUOTA_TEXT && ` (${AI_QUOTA_TEXT} ข้อความ/เดือน)`} · {AI_DISCLAIMER}
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="fcta">
        <div className="container cta-band">
          <h2 id="fcta" className="t-h1">พร้อมลองใช้แล้วหรือยัง</h2>
          <p className="t-lead">ทดลองฟรี 30 วัน ไม่มีค่าใช้จ่ายระหว่างทดลองใช้</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
          <StoreBadges className="stores--center" />
        </div>
      </section>
    </main>
  );
}
