import { Link } from 'react-router-dom';
import AiMotion from '../components/AiMotion.jsx';
import PhoneVideo from '../components/PhoneVideo.jsx';
import HeroMotion from '../components/HeroMotion.jsx';
import Faq from '../components/Faq.jsx';
import { PlansWithSwitch } from '../components/Plans.jsx';
import { FAQ_GENERAL } from '../data/faq.js';
import { checkoutLink, COMPANY, AI_DISCLAIMER } from '../data/company.js';
import { LAW_CATEGORIES, LAW_LIBRARY, lawCountRounded } from '../data/service.js';
import { baht, fromPrice, STUDENT_PRICE } from '../data/plans.js';
import { IconScale, IconBell, IconDoc, IconChart, IconCap, IconCheck, IconEar, IconUsers, IconShield, IconReceipt, IconLock, IconSparkAnim } from '../components/Icons.jsx';

// ขนาดที่ภาพแสดงจริง: ครึ่งคอลัมน์ของ .container (980px) บนจอใหญ่ · เต็มความกว้างเนื้อหาบนมือถือ
const SIZES_HALF = '(min-width: 1069px) 458px, (min-width: 735px) 326px, 88vw';
// ไทล์กว้าง: ครึ่งหนึ่งของ .container--wide (1260px)
const SIZES_TILE = '(min-width: 1305px) 620px, (min-width: 735px) 48vw, 92vw';

export default function Home() {
  return (
    <main id="main">
      {/* ─── HERO ─── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <p className="t-eyebrow">SafeAct สำหรับธุรกิจ</p>
          <h1 id="hero-title" className="t-hero" style={{ marginTop: 12 }}>
            ทุกกฎหมายความปลอดภัย<br />ที่ธุรกิจต้องรู้ ในที่เดียว
          </h1>
          <span className="hero__icon-wrap">
            <span className="hero__icon-shadow" aria-hidden="true" />
            <img className="hero__icon" src="/assets/app-icon-352.webp" srcSet="/assets/app-icon-352.webp 2x, /assets/app-icon-600.webp 3x"
              width="352" height="352" alt={`ไอคอนแอป ${COMPANY.appName} ของ SafeAct`} fetchPriority="high" />
          </span>
          <p className="t-sub">{COMPANY.definitionShort}</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
          <p className="hero__note">
            เริ่มต้น {baht(fromPrice())} ต่อเดือน (นักศึกษา {baht(STUDENT_PRICE)}) · ยกเลิกได้ทุกเมื่อ · คืนเงินได้ภายใน 7 วัน
            <br />ให้บริการโดย <Link to="/about/">{COMPANY.nameTh}</Link>
          </p>
        </div>
        <div className="container--wide hero__media">
          <HeroMotion />
        </div>
      </section>

      {/* ─── VALUE PROPS ─── */}
      <section className="section" aria-labelledby="why-title">
        <div className="container">
          <header className="section-head">
            <h2 id="why-title" className="t-h1">ทำงานตามกฎหมายได้มั่นใจ<br />โดยไม่ต้องไล่ตามเอง</h2>
            <p className="t-lead">กฎหมายด้านความปลอดภัยออกใหม่และแก้ไขตลอดเวลา SafeAct รวบรวมให้ในรูปแบบที่อ่านง่าย พร้อมแหล่งอ้างอิงที่ตรวจสอบได้</p>
          </header>
          <ul className="props">
            <li>
              <IconScale className="props__icon" />
              <h3 className="t-h4">อัปเดตทันเวลา</h3>
              <p>ติดตามจากแหล่งข้อมูลทางการ แจ้งวันประกาศและวันมีผลใช้บังคับของแต่ละฉบับ</p>
            </li>
            <li>
              <IconDoc className="props__icon" />
              <h3 className="t-h4">สรุปให้อ่านจบในไม่กี่นาที</h3>
              <p>สรุปสาระสำคัญโดยทีมผู้เชี่ยวชาญ ตรวจทานก่อนเผยแพร่ และแนบลิงก์ต้นฉบับทุกครั้ง</p>
            </li>
            <li>
              <IconBell className="props__icon" />
              <h3 className="t-h4">แจ้งเตือนถึงมือ</h3>
              <p>เลือกหมวดที่ต้องการติดตาม แล้วรับการแจ้งเตือนผ่านแอป iPhone และเว็บทันทีที่มีความเคลื่อนไหว</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── FEATURE: LAWS ─── */}
      <section className="section section--alt" aria-labelledby="laws-title">
        <div className="container">
          <div className="frow">
            <div className="frow__media">
              <img className="frow__photo" src="/assets/laws-macbook.webp" srcSet="/assets/laws-macbook-800.webp 800w, /assets/laws-macbook.webp 1422w" sizes={SIZES_HALF}
                width="1422" height="1024" loading="lazy" decoding="async"
                alt="เจ้าหน้าที่ความปลอดภัยสวมหมวกนิรภัยเปิดหน้าหมวดกฎหมายไทยของ SafeAct บน MacBook Air" />
            </div>
            <div className="frow__text">
              <h2 id="laws-title" className="frow__head">
                <span className="t-eyebrow">อัปเดตกฎหมาย</span>{' '}
                <span className="t-h3">กฎหมายทุกหมวดหมู่<br />จัดเรียงตามงานที่คุณรับผิดชอบ</span>
              </h2>
              <p>คลังกฎหมายกว่า {lawCountRounded()} ฉบับ (ข้อมูล ณ {LAW_LIBRARY.asOfTh}) ทั้งพระราชบัญญัติ กฎกระทรวง ประกาศกรม และมาตรฐานที่เกี่ยวข้อง ค้นหาตามหมวด เดือนที่ประกาศ หรือคำสำคัญ กดติดตามฉบับที่เกี่ยวข้องกับสถานประกอบการ แล้วดูภาพรวมได้จากหน้าเดียว</p>
              <ul className="chips" aria-label="หมวดกฎหมาย">
                {LAW_CATEGORIES.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <Link className="more" to="/features/#laws">ดูรายละเอียดการติดตามกฎหมาย</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TILES: WORKFLOW ─── */}
      <section className="section" aria-labelledby="tools-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="tools-title" className="t-h1">ครบทุกงานของทีม จป.</h2>
            <p className="t-lead">จากการรู้กฎหมาย ไปสู่การทำตามกฎหมาย — วางแผน บันทึก ติดตาม และพิสูจน์ได้ในระบบเดียว</p>
          </header>
          <ul className="tiles">
            <li className="tile tile--wide">
              <div className="tile__body">
                <h3 className="tile__head">
                  <span className="tile__kicker">Action Plan รายปี</span>{' '}
                  <span className="t-h4">วางแผนงานความปลอดภัยทั้งปี</span>
                </h3>
                <p>กำหนดกิจกรรม ผู้รับผิดชอบ รายสัปดาห์ และแนบหลักฐาน พร้อมอ้างอิงกฎหมายในแต่ละแถว ส่งออกเป็น CSV ได้</p>
                <Link className="more tile__more" to="/features/#action-plan">ดูระบบ Action Plan รายปี</Link>
              </div>
              <img className="tile__img" src="/assets/action-plan.webp" srcSet="/assets/action-plan-800.webp 800w, /assets/action-plan.webp 1500w" sizes={SIZES_TILE}
                width="1500" height="880" loading="lazy" decoding="async"
                alt="หน้าแผนงานความปลอดภัยรายปี (Safety Action Plan) แสดงสรุปสถานะงานและตาราง 12 เดือน × 4 สัปดาห์" />
            </li>
            <li className="tile tile--wide tile--dark">
              <div className="tile__body">
                <h3 className="tile__head">
                  <span className="tile__kicker">Dashboard Compliance</span>{' '}
                  <span className="t-h4">เห็นสถานะการปฏิบัติตามกฎหมายทันที</span>
                </h3>
                <p>ภาพรวมทั้งองค์กรในหน้าเดียว รู้ว่าเรื่องไหนเสร็จ เรื่องไหนใกล้ครบกำหนด เช่น สถานะการอบรมและใบรับรองที่ใกล้หมดอายุ</p>
                <Link className="more tile__more" to="/features/#audit">ดู Dashboard Compliance</Link>
              </div>
              <img className="tile__img" src="/assets/training-dashboard.webp" srcSet="/assets/training-dashboard-800.webp 800w, /assets/training-dashboard.webp 1500w" sizes={SIZES_TILE}
                width="1500" height="880" loading="lazy" decoding="async"
                alt="แดชบอร์ดบันทึกการฝึกอบรม แสดงจำนวนพนักงานที่ผ่าน รอ และใกล้หมดอายุการอบรม พร้อมสรุปรายหลักสูตรและการแจ้งเตือน" />
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconCap className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">การอบรมพนักงาน</h3>
                <p>Training Matrix และบันทึกการฝึกอบรม ดูช่องว่างการอบรม แจ้งเตือนใบรับรองใกล้หมดอายุ ส่งออก Excel</p>
                <Link className="more tile__more" to="/features/#training">ดูระบบ Training Matrix</Link>
              </div>
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconCheck className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">บันทึกงานตรวจรับรอง</h3>
                <p>เก็บประวัติการตรวจสอบปั้นจั่น ระบบไฟฟ้า หม้อน้ำ ลิฟต์ และถังแรงดันตามกฎหมาย และรับการแจ้งเตือนก่อนถึงรอบตรวจครั้งถัดไป</p>
                <Link className="more tile__more" to="/features/#inspection">ดูบันทึกงานตรวจรับรอง</Link>
              </div>
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconEar className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">โปรแกรมอนุรักษ์การได้ยิน</h3>
                <p>แผนที่จุดตรวจวัดเสียง ข้อมูลพนักงาน การทบทวน และรายงานในที่เดียว</p>
                <Link className="more tile__more" to="/features/#hearing">ดูโปรแกรมอนุรักษ์การได้ยิน</Link>
              </div>
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconDoc className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">คลังเอกสารความปลอดภัย</h3>
                <p>แบบฟอร์ม Checklist SOP JSA เอกสาร WI/SDS สื่อ ภาพ VDO และสไลด์พรีเซนเทชั่นด้านความปลอดภัย พร้อมใช้งาน</p>
                <Link className="more tile__more" to="/features/#documents">ดูคลังเอกสารความปลอดภัย</Link>
              </div>
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconUsers className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">ระบบผู้รับเหมา</h3>
                <p>จัดการข้อมูลผู้รับเหมาที่เข้าทำงานในพื้นที่ของสถานประกอบการ</p>
                <Link className="more tile__more" to="/features/#contractors">ดูระบบจัดการผู้รับเหมา</Link>
              </div>
            </li>
            <li className="tile">
              <div className="tile__body">
                <IconChart className="props__icon" style={{ margin: '0 0 16px', width: 40, height: 40 }} />
                <h3 className="t-h4">Workflow Audit</h3>
                <p>ติดตามงานตรวจประเมินภายในเป็นขั้นตอน พร้อมบันทึกหลักฐานให้ตรวจสอบย้อนหลังได้</p>
                <Link className="more tile__more" to="/features/#audit">ดู Workflow Audit</Link>
              </div>
            </li>
            <li className="tile tile--full tile--dark">
              <div className="frow" style={{ gap: 0 }}>
                <div className="tile__body" style={{ padding: 'clamp(28px,5vw,64px)' }}>
                  <IconSparkAnim className="props__icon" style={{ margin: '0 0 20px', width: 44, height: 44, color: '#f5f5f7', overflow: 'visible' }} />
                  <h3 className="tile__head">
                    <span className="tile__kicker">AI ผู้ช่วยกฎหมาย</span>{' '}
                    <span className="t-h3"><span className="ai-lead">ไม่ใช่ AI ทั่วไป</span>{' '}รู้จริงเรื่องกฎหมายความปลอดภัย</span>
                  </h3>
                  <p style={{ marginTop: 12 }}>ฝึกมาเฉพาะด้านความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน และค้นคำตอบจากคลังกฎหมายของ SafeAct โดยตรง ไม่ใช่จากข้อมูลทั่วไปบนอินเทอร์เน็ต ทุกคำตอบระบุข้อกฎหมายและลิงก์กลับไปยังตัวบท ให้คุณตรวจสอบกับต้นฉบับได้ทันทีก่อนนำไปใช้งาน</p>
                  <p className="t-small" style={{ marginTop: 12, color: '#a1a1a6' }}>{AI_DISCLAIMER}</p>
                  <Link className="more" style={{ marginTop: 20 }} to="/features/#ai">ดู AI ผู้ช่วยกฎหมาย</Link>
                </div>
                <AiMotion />
              </div>
            </li>
          </ul>
          <p style={{ textAlign: 'center', marginTop: 40 }}>
            <Link className="more" to="/features/">ดูฟีเจอร์ทั้งหมด</Link>
          </p>
        </div>
      </section>

      {/* ─── ANYWHERE ─── */}
      <section className="section section--alt section--clip" aria-labelledby="app-title">
        <div className="container">
          <div className="frow frow--flip">
            <div className="frow__media">
              <PhoneVideo />
            </div>
            <div className="frow__text">
              <p className="t-eyebrow" style={{ marginBottom: 8 }}>เว็บ + iPhone</p>
              <h2 id="app-title" className="t-h3">ทำงานได้ทุกที่<br />ข้อมูลตรงกันทุกอุปกรณ์</h2>
              <p>ใช้บนคอมพิวเตอร์ที่สำนักงาน แล้วเปิดต่อบน iPhone ขณะเดินตรวจหน้างาน ทุกการเปลี่ยนแปลงซิงก์แบบ<span style={{ whiteSpace: 'nowrap' }}>เรียลไทม์</span></p>
              <ul className="checks">
                <li>แจ้งเตือนกฎหมายที่ติดตามผ่าน Push Notification</li>
                <li>ดูรายละเอียดกฎหมายและเอกสารได้แม้อยู่หน้างาน</li>
                <li>บัญชีเดียวใช้ได้ทั้งเว็บและแอป {COMPANY.appName} บน iPhone</li>
              </ul>
              {COMPANY.appStoreUrl && (
                <a className="more" style={{ marginTop: 20 }} href={COMPANY.appStoreUrl} rel="noopener">ดาวน์โหลด {COMPANY.appName} บน App Store</a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FACTS ─── */}
      <section className="section section--dark" aria-labelledby="facts-title">
        <div className="container">
          <header className="section-head">
            <h2 id="facts-title" className="t-h2">เริ่มได้ทันที ไม่มีความเสี่ยง</h2>
          </header>
          <ul className="stats">
            <li><strong>30 วัน</strong><span>ทดลองใช้ฟรี</span></li>
            <li><strong>7 วัน</strong><span>รับประกันคืนเงิน</span></li>
            <li><strong>{lawCountRounded()}+</strong><span>ฉบับในคลังกฎหมาย</span></li>
            <li><strong>8 ช่องทาง</strong><span>ชำระเงิน</span></li>
          </ul>
        </div>
      </section>

      {/* ─── AUDIENCE ─── */}
      <section className="section section--alt" aria-labelledby="who-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="who-title" className="t-h1">SafeAct เหมาะกับใคร</h2>
            <p className="t-lead">สำหรับทุกคนที่รับผิดชอบงานความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงานของสถานประกอบการ</p>
          </header>
          <ul className="cards">
            <li className="card">
              <IconShield className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>เจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.) ทุกระดับ</h3>
              <p>จป.หัวหน้างาน จป.บริหาร จป.เทคนิค จป.เทคนิคขั้นสูง และ จป.วิชาชีพ ติดตามกฎหมายใหม่ จัดทำแผนงาน และเก็บบันทึกไว้ให้ตรวจสอบย้อนหลังได้</p>
            </li>
            <li className="card">
              <IconUsers className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>ฝ่ายบุคคลและธุรกิจ SME</h3>
              <p>นายจ้างและฝ่ายบุคคลที่ดูแลงานความปลอดภัยเอง รู้ว่ากฎหมายฉบับใดเกี่ยวข้องกับกิจการ และมีเรื่องใดใกล้ครบกำหนด</p>
            </li>
            <li className="card">
              <IconChart className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>โรงงานและองค์กรหลายสาขา</h3>
              <p>ทีมความปลอดภัยและคณะกรรมการความปลอดภัยฯ (คปอ.) เห็นสถานะการปฏิบัติตามกฎหมายของทั้งองค์กรจาก Dashboard เดียว</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section" aria-labelledby="how-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="how-title" className="t-h1">เริ่มใช้งานใน 4 ขั้นตอน</h2>
          </header>
          <ol className="steps">
            <li><h3>เลือกแผน</h3><p>ทดลองฟรี 30 วัน หรือเลือกแผนรายเดือน/รายปีที่เหมาะกับทีม</p></li>
            <li><h3>ชำระเงินอย่างปลอดภัย</h3><p>บัตร PromptPay โมบายแบงก์กิ้ง วอลเล็ต หรือใบแจ้งหนี้สำหรับนิติบุคคล</p></li>
            <li><h3>เปิดสิทธิทันที</h3><p>ระบบบันทึกวันเริ่มและวันสิ้นสุดสมาชิก พร้อมออกใบเสร็จ/ใบกำกับภาษีอิเล็กทรอนิกส์</p></li>
            <li><h3>ติดตามและลงมือ</h3><p>เลือกกฎหมายที่ติดตาม รับแจ้งเตือน และบริหารงานความปลอดภัยในระบบ</p></li>
          </ol>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="section section--alt" id="pricing" aria-labelledby="price-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="price-title" className="t-h1">แผนที่เหมาะกับทุกขนาด</h2>
            <p className="t-lead">ตั้งแต่นักศึกษา ทีมเล็ก SME และโรงงาน ไปจนถึงองค์กรหลายสาขา</p>
          </header>
          <PlansWithSwitch />
          <p style={{ textAlign: 'center', marginTop: 40 }}>
            <Link className="more" to="/pricing/">เปรียบเทียบแผนทั้งหมด</Link>
          </p>
        </div>
      </section>

      {/* ─── TRUST ─── */}
      <section className="section" aria-labelledby="trust-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="trust-title" className="t-h1">โปร่งใส ปลอดภัย<br />ตรวจสอบได้</h2>
          </header>
          <ul className="cards">
            <li className="card">
              <IconLock className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>ชำระเงินปลอดภัย</h3>
              <p>ดำเนินการผ่านผู้ให้บริการชำระเงิน Omise ที่ได้มาตรฐาน PCI-DSS Level 1 เข้ารหัส TLS 1.3 ตลอดการทำรายการ บริษัทไม่จัดเก็บข้อมูลบัตรเต็มรูปแบบ</p>
            </li>
            <li className="card">
              <IconReceipt className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>เอกสารภาษีครบ</h3>
              <p>ออกใบเสร็จรับเงิน/ใบกำกับภาษีอิเล็กทรอนิกส์ทุกรายการ นิติบุคคลชำระแบบใบแจ้งหนี้และหัก ณ ที่จ่าย 3% ได้</p>
            </li>
            <li className="card">
              <IconShield className="props__icon" style={{ margin: '0 0 16px', width: 36, height: 36 }} />
              <h3>ข้อมูลของคุณเป็นของคุณ</h3>
              <p>คุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 <Link to="/privacy/">อ่านนโยบายความเป็นส่วนตัว</Link></p>
            </li>
          </ul>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container">
          <header className="section-head">
            <h2 id="faq-title" className="t-h1">คำถามที่พบบ่อย</h2>
          </header>
          <Faq items={FAQ_GENERAL} />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section" aria-labelledby="cta-title">
        <div className="container cta-band">
          <h2 id="cta-title" className="t-h1">เริ่มต้นกับ SafeAct วันนี้</h2>
          <p className="t-lead">ทดลองใช้ฟรี 30 วัน หรือคุยกับทีมขายเพื่อออกแบบแผนสำหรับองค์กรของคุณ โทร {COMPANY.phone}</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>{' '}
            <Link className="more" to="/contact/">ติดต่อทีมขาย</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
