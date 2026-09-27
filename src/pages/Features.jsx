import { Link } from 'react-router-dom';
import Media from '../components/Media.jsx';
import { checkoutLink } from '../data/company.js';
import { LAW_CATEGORIES } from './Home.jsx';

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
          <Media kind="video" label="สาธิตการใช้งานฟีเจอร์หลัก" spec="MP4/H.264 · 2560×1440" ratio="21/9" />
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
            media={<Media label="หน้ารายละเอียดกฎหมาย" spec="1600×1200" ratio="4/3" />}
            plan="Free ขึ้นไป"
          />
          <div style={{ height: 120 }} />
          <Row flip
            eyebrow="กฎหมายที่ติดตาม · การแจ้งเตือน" title="เลือกเฉพาะที่เกี่ยวข้อง แล้วให้ระบบเตือนคุณ"
            body="กดติดตามกฎหมายที่ใช้กับสถานประกอบการ ตั้งค่าหมวดที่ต้องการรับข่าว และรับการแจ้งเตือนผ่านเว็บและแอป iPhone"
            points={['รายการกฎหมายที่ติดตามของฉัน', 'ตั้งค่าการแจ้งเตือนรายหมวด', 'Push Notification บน iPhone']}
            media={<Media label="ตั้งค่าการแจ้งเตือนบน iPhone" spec="1200×1500" ratio="4/5" />}
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
            media={<Media label="Action Plan รายปี" spec="1600×1200" ratio="4/3" />}
          />
          <div style={{ height: 120 }} />
          <Row flip
            eyebrow="การอบรมพนักงาน" title="Training Matrix ที่รู้ว่าใครยังขาดอะไร"
            body="บันทึกประวัติการอบรม ตั้งค่าหลักสูตรที่ต้องอบรมตามตำแหน่ง ดูช่องว่างการอบรม และรับการแจ้งเตือนเมื่อใบรับรองใกล้หมดอายุ"
            points={['ตาราง Matrix และ Gap', 'แจ้งเตือนหลักสูตรใกล้หมดอายุ', 'ส่งออก Excel / CSV']}
            media={<Media label="Training Matrix" spec="1600×1200" ratio="4/3" />}
            plan="Basic ขึ้นไป"
          />
          <div style={{ height: 120 }} />
          <Row
            eyebrow="งานตรวจรับรอง · ผู้รับเหมา" title="ประวัติการตรวจ และผู้รับเหมา อยู่ครบในที่เดียว"
            body="บันทึกงานตรวจรับรองตามกฎหมายพร้อมรอบการตรวจครั้งถัดไป และจัดการข้อมูลผู้รับเหมาที่เข้าทำงานในพื้นที่"
            points={['บันทึกงานตรวจรับรอง', 'ระบบจัดการผู้รับเหมา', 'แจ้งเตือนรอบตรวจ']}
            media={<Media label="บันทึกงานตรวจรับรอง" spec="1600×1200" ratio="4/3" />}
            plan="Basic ขึ้นไป"
          />
          <div style={{ height: 120 }} />
          <Row flip
            eyebrow="โปรแกรมอนุรักษ์การได้ยิน" title="จากแผนผังจุดเสียงดัง ถึงรายงานประจำปี"
            body="อัปโหลดแผนผังพื้นที่ วางจุดตรวจวัดระดับเสียง ผูกพนักงานกับพื้นที่ ติดตามผลทบทวน และสรุปเป็นรายงาน"
            points={['แผนที่จุดตรวจวัดเสียง', 'ข้อมูลพนักงานและหน้าที่', 'รายงานและการติดตามผล']}
            media={<Media label="แผนที่จุดตรวจวัดเสียง" spec="1600×1200" ratio="4/3" />}
          />
          <div style={{ height: 120 }} />
          <Row
            eyebrow="Dashboard Compliance · Workflow Audit" title="ผู้บริหารเห็นภาพรวม ทีมงานเห็นสิ่งที่ต้องทำ"
            body="สรุปสถานะการปฏิบัติตามกฎหมายทั้งองค์กร พร้อมขั้นตอนตรวจประเมินที่บันทึกหลักฐานตรวจสอบย้อนหลังได้ รองรับผู้ใช้งานหลายคน"
            points={['Dashboard Compliance', 'Workflow Audit', 'รองรับผู้ใช้งานหลายคน']}
            media={<Media label="Dashboard Compliance" spec="1600×1200" ratio="4/3" />}
            plan="Business ขึ้นไป"
          />
        </div>
      </section>

      <section className="section" aria-labelledby="library">
        <div className="container">
          <h2 id="library" className="visually-hidden">คลังเอกสาร</h2>
          <Row
            eyebrow="คลังเอกสาร" title="เอกสาร สื่อ และสไลด์ พร้อมใช้"
            body="ไฟล์เอกสาร WI/SDS สื่อ ภาพ และ VDO ด้านความปลอดภัย รวมถึงสไลด์พรีเซนเทชั่นสำหรับการอบรมและสื่อสารภายใน"
            points={['ไฟล์เอกสาร WI/SDS', 'สื่อ ภาพ และ VDO', 'สไลด์พรีเซนเทชั่น']}
            media={<Media label="คลังเอกสารความปลอดภัย" spec="1600×1200" ratio="4/3" />}
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
          <Media dark kind="video" label="สาธิต AI ผู้ช่วยกฎหมาย" spec="MP4 · 1920×1080" />
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
