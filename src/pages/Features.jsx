import { Link } from 'react-router-dom';
import AiMotion from '../components/AiMotion.jsx';
import { checkoutLink } from '../data/company.js';
import { LAW_CATEGORIES } from './Home.jsx';

// ภาพหน้าจอจริงจากแอป SafeAct (safeact-connect-hub) · เรนเดอร์ 2x · public/assets/features/
function Shot({ name, alt, hero = false }) {
  return hero
    ? <img className="shot shot--hero" src={`/assets/features/${name}.webp`} width="2880" height="1234" alt={alt} fetchPriority="high" />
    : <img className="shot" src={`/assets/features/${name}.webp`} width="2320" height="1740" alt={alt} loading="lazy" decoding="async" />;
}

function Row({ id, eyebrow, title, body, points, media, flip, plan }) {
  return (
    <div className={`frow${flip ? ' frow--flip' : ''}`} id={id} style={{ scrollMarginTop: 80 }}>
      <div className="frow__media">{media}</div>
      <div className="frow__text">
        <p className="t-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</p>
        <h3 className="t-h3">{title}</h3>
        <p>{body}</p>
        <ul className="checks">{points.map((p) => <li key={p}>{p}</li>)}</ul>
        {plan && <p className="t-small muted" style={{ marginTop: 20 }}>มีในแผน {plan}</p>}
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="f-title">
        <div className="container">
          <h1 id="f-title" className="t-hero">ฟีเจอร์ SafeAct</h1>
          <p className="t-sub">ตั้งแต่ติดตามกฎหมาย ไปจนถึงบริหารงานความปลอดภัยทั้งองค์กร ออกแบบมาเพื่อคนทำงานความปลอดภัยโดยเฉพาะ</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>
            <Link className="more" to="/pricing/">เปรียบเทียบแผน</Link>
          </div>
        </div>
        <div className="container--wide hero__media">
          <Shot hero name="hero" alt="หน้า Hub กฎหมายของ SafeAct: ค้นหากฎหมายและมาตรฐาน พร้อมการ์ดกฎหมายใหม่แต่ละเดือน" />
        </div>
      </section>

      <section className="section" aria-labelledby="laws">
        <div className="container">
          <header className="section-head">
            <h2 id="laws" className="t-h1" style={{ scrollMarginTop: 80 }}>ติดตามกฎหมาย</h2>
            <p className="t-lead">รู้ก่อน เตรียมตัวทัน ไม่พลาดกฎหมายที่เกี่ยวข้องกับสถานประกอบการของคุณ</p>
          </header>
          <Row
            eyebrow="อัปเดตกฎหมาย" title="กฎหมายใหม่ทุกเดือน สรุปพร้อมอ้างอิง"
            body="ทีมงานติดตามจากราชกิจจานุเบกษาและหน่วยงานรัฐ สรุปสาระสำคัญเป็นภาษาที่อ่านง่าย ตรวจทานก่อนเผยแพร่ และแนบลิงก์ต้นฉบับทุกฉบับ"
            points={['จัดหมวด: ' + LAW_CATEGORIES.join(' · '), 'ดูรายการตามเดือนที่ประกาศ', 'แสดงวันประกาศและวันมีผลใช้บังคับ']}
            media={<Shot name="laws" alt="รายการกฎหมายอัปเดตประจำเดือน พร้อมหน่วยงาน วันประกาศ วันมีผล และไฟล์สรุป Word Excel PowerPoint PDF" />}
            plan="Free ขึ้นไป"
          />
          <div style={{ height: 120 }} />
          <Row flip
            eyebrow="กฎหมายที่ติดตาม · การแจ้งเตือน" title="เลือกเฉพาะที่เกี่ยวข้อง แล้วให้ระบบเตือนคุณ"
            body="กดติดตามกฎหมายที่ใช้กับสถานประกอบการ ตั้งค่าหมวดที่ต้องการรับข่าว และรับการแจ้งเตือนผ่านเว็บและแอป iPhone"
            points={['รายการกฎหมายที่ติดตามของฉัน', 'ตั้งค่าการแจ้งเตือนรายหมวด', 'Push Notification บน iPhone']}
            media={<Shot name="notify" alt="หน้าตั้งค่าการแจ้งเตือนกฎหมาย เลือกหมวดและกฎหมายที่ต้องการติดตาม" />}
            plan="Student ขึ้นไป (แอปแจ้งเตือน)"
          />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="workflow">
        <div className="container">
          <header className="section-head">
            <h2 id="workflow" className="t-h1" style={{ scrollMarginTop: 80 }}>ระบบงานความปลอดภัย</h2>
            <p className="t-lead">เครื่องมือที่ทีม จป. ใช้ทุกวัน อยู่ในระบบเดียวกับข้อมูลกฎหมาย</p>
          </header>
          <Row
            eyebrow="Action Plan รายปี" title="แผนงานทั้งปี ผูกกับกฎหมายทุกกิจกรรม"
            body="สร้างแผนจากเทมเพลต กำหนดผู้รับผิดชอบและสัปดาห์ดำเนินการ แนบหลักฐานและบันทึก พร้อมอ้างอิงกฎหมายรายแถว ทำงานร่วมกันได้แบบเรียลไทม์"
            points={['เทมเพลตแผนงาน', 'แนบหลักฐานและบันทึกย่อ', 'ส่งออก CSV']}
            plan="Basic ขึ้นไป"
            media={<Shot name="actionplan" alt="แผนงานความปลอดภัยรายปี สรุปจำนวนแผน ความคืบหน้า งานเกินกำหนด และตาราง 12 เดือนรายสัปดาห์" />}
          />
          <div style={{ height: 120 }} />
          <Row flip id="training"
            eyebrow="การอบรมพนักงาน" title="Training Matrix ที่รู้ว่าใครยังขาดอะไร"
            body="บันทึกประวัติการอบรม ตั้งค่าหลักสูตรที่ต้องอบรมตามตำแหน่ง ดูช่องว่างการอบรม และรับการแจ้งเตือนเมื่อใบรับรองใกล้หมดอายุ"
            points={['ตาราง Matrix และ Gap', 'แจ้งเตือนหลักสูตรใกล้หมดอายุ', 'ส่งออก Excel / CSV']}
            media={<Shot name="training" alt="ตาราง Training Matrix แสดงหลักสูตรที่พนักงานแต่ละคนผ่านแล้ว ใกล้หมดอายุ หรือยังขาด" />}
            plan="Basic ขึ้นไป"
          />
          <div style={{ height: 120 }} />
          <Row id="inspection"
            eyebrow="งานตรวจรับรอง · ผู้รับเหมา" title="ประวัติการตรวจ และผู้รับเหมา อยู่ครบในที่เดียว"
            body="บันทึกงานตรวจรับรองตามกฎหมายพร้อมรอบการตรวจครั้งถัดไป และจัดการข้อมูลผู้รับเหมาที่เข้าทำงานในพื้นที่"
            points={['บันทึกงานตรวจรับรอง', 'ระบบจัดการผู้รับเหมา', 'แจ้งเตือนรอบตรวจ']}
            media={<Shot name="inspection" alt="บันทึกงานตรวจรับรองปั้นจั่น ระบบไฟฟ้า หม้อน้ำ ลิฟต์ และถังแรงดัน พร้อมวันหมดอายุและสถานะ" />}
            plan="Business ขึ้นไป (ระบบผู้รับเหมา)"
          />
          <div style={{ height: 120 }} />
          <Row flip id="hearing"
            eyebrow="โปรแกรมอนุรักษ์การได้ยิน" title="จากแผนผังจุดเสียงดัง ถึงรายงานประจำปี"
            body="อัปโหลดแผนผังพื้นที่ วางจุดตรวจวัดระดับเสียง ผูกพนักงานกับพื้นที่ ติดตามผลทบทวน และสรุปเป็นรายงาน"
            points={['แผนที่จุดตรวจวัดเสียง', 'ข้อมูลพนักงานและหน้าที่', 'รายงานและการติดตามผล']}
            media={<Shot name="hearing" alt="แผนผังระดับเสียง (Noise Contour Map) แสดงจุดตรวจวัดและระดับ dB(A) ในอาคารผลิต" />}
          />
          <div style={{ height: 120 }} />
          <Row id="audit"
            eyebrow="Dashboard Compliance · Workflow Audit" title="ผู้บริหารเห็นภาพรวม ทีมงานเห็นสิ่งที่ต้องทำ"
            body="สรุปสถานะการปฏิบัติตามกฎหมายทั้งองค์กร พร้อมขั้นตอนตรวจประเมินที่บันทึกหลักฐานตรวจสอบย้อนหลังได้ รองรับผู้ใช้งานหลายคน"
            points={['Dashboard Compliance', 'Workflow Audit', 'รองรับผู้ใช้งานหลายคน']}
            media={<Shot name="dashboard" alt="ภาพรวมสถานะการอบรม กราฟสรุป หลักสูตรทั้งหมด และการแจ้งเตือนใบรับรองใกล้หมดอายุ" />}
            plan="Business ขึ้นไป"
          />
        </div>
      </section>

      <section className="section" aria-labelledby="library">
        <div className="container">
          <h2 id="library" className="visually-hidden">คลังเอกสาร</h2>
          <Row id="documents"
            eyebrow="คลังเอกสาร" title="เอกสาร สื่อ และสไลด์ พร้อมใช้"
            body="ไฟล์เอกสาร WI/SDS สื่อ ภาพ และ VDO ด้านความปลอดภัย รวมถึงสไลด์พรีเซนเทชั่นสำหรับการอบรมและสื่อสารภายใน"
            points={['ไฟล์เอกสาร WI/SDS', 'สื่อ ภาพ และ VDO', 'สไลด์พรีเซนเทชั่น']}
            media={<Shot name="documents" alt="คลังเอกสารความปลอดภัย แบบฟอร์ม Checklist SOP JSA และ Template 200 รายการ 22 หมวดหมู่" />}
            plan="Student ขึ้นไป"
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
          <p className="t-small" style={{ textAlign: 'center', marginTop: 48, color: '#a1a1a6' }}>
            มีในแผน Business ขึ้นไป · คำตอบของ AI เป็นข้อมูลประกอบการตัดสินใจ ไม่ใช่คำปรึกษาทางกฎหมาย
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="fcta">
        <div className="container cta-band">
          <h2 id="fcta" className="t-h1">พร้อมลองใช้แล้วหรือยัง</h2>
          <p className="t-lead">ทดลองฟรี 30 วัน ไม่มีค่าใช้จ่ายระหว่างทดลองใช้</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
