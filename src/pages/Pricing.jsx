import { Link } from 'react-router-dom';
import Faq from '../components/Faq.jsx';
import { PlansWithSwitch, CompareTable } from '../components/Plans.jsx';
import { FAQ_BILLING } from '../data/faq.js';
import { COMPANY } from '../data/company.js';

const PAY = [
  ['บัตรเครดิต/เดบิต', 'VISA · Mastercard · JCB · AMEX'],
  ['PromptPay QR', 'สแกนจ่ายผ่านแอปธนาคาร'],
  ['โมบายแบงก์กิ้ง', 'SCB · KBank · BBL · KTB · BAY'],
  ['อินเทอร์เน็ตแบงก์กิ้ง', 'ผ่านหน้าเว็บธนาคาร'],
  ['TrueMoney', 'วอลเล็ต'],
  ['Rabbit LINE Pay', 'วอลเล็ต'],
  ['WeChat Pay', 'สำหรับผู้ใช้ WeChat'],
  ['โอนเงิน / ใบแจ้งหนี้', 'นิติบุคคล · หัก ณ ที่จ่าย 3%'],
];

export default function Pricing() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="p-title" style={{ paddingBottom: 72 }}>
        <div className="container">
          <h1 id="p-title" className="t-hero">แผนและราคา</h1>
          <p className="t-sub">แผนสมาชิก SafeAct แพลตฟอร์มติดตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบบริหารงานความปลอดภัยสำหรับ จป. เริ่มทดลองฟรี 30 วัน<br />อัปเกรดหรือยกเลิกได้ตามต้องการ</p>
        </div>
      </section>

      <section aria-labelledby="plans-title" style={{ paddingBottom: 'var(--sec-pad)' }}>
        <div className="container--wide">
          <h2 id="plans-title" className="visually-hidden">แผนสมาชิก SafeAct และราคา</h2>
          <PlansWithSwitch />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="cmp-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="cmp-title" className="t-h1">เปรียบเทียบแผน</h2>
            <p className="t-lead">สิทธิ์ของแต่ละแผนสะสมขึ้นไป แผนที่สูงกว่าได้ทุกอย่างของแผนก่อนหน้า</p>
          </header>
          <CompareTable />
        </div>
      </section>

      <section className="section" aria-labelledby="pay-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="pay-title" className="t-h2">ชำระเงินได้ 8 ช่องทาง</h2>
            <p className="t-lead">การชำระเงินออนไลน์ดำเนินการผ่าน Omise ที่ได้มาตรฐาน PCI-DSS Level 1 นิติบุคคลโอนเงินตามใบแจ้งหนี้ได้ และออกใบเสร็จ/ใบกำกับภาษีอิเล็กทรอนิกส์ให้ทุกรายการ</p>
          </header>
          <ul className="pay">
            {PAY.map(([t, s]) => <li key={t}><b>{t}</b>{' '}<span className="muted">{s}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="terms-title">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="terms-title" className="t-h2">เงื่อนไขที่ควรรู้ก่อนสมัคร</h2>
          </header>
          <ul className="cards">
            <li className="card">
              <h3>ราคาและภาษี</h3>
              <p>ราคาเป็นเงินบาท ยังไม่รวม VAT 7% ยอดชำระคำนวณจากราคาแผนในระบบ ณ เวลาทำรายการ</p>
            </li>
            <li className="card">
              <h3>เปิดสิทธิและรอบบิล</h3>
              <p>เปิดใช้งานทันทีเมื่อชำระสำเร็จ แผนรายเดือน/รายปีไม่ต่ออายุอัตโนมัติ เว้นแต่ท่านเลือกไว้ และมีแจ้งเตือนก่อนหมดอายุ</p>
            </li>
            <li className="card">
              <h3>ยกเลิกและคืนเงิน</h3>
              <p>ยกเลิกได้ทุกเมื่อ มีผลเมื่อสิ้นสุดรอบบิล คืนเงินเต็มจำนวนภายใน 7 วันนับจากวันชำระครั้งแรก</p>
              <Link className="more" to="/refund-policy/">อ่านนโยบายฉบับเต็ม</Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="bfaq-title">
        <div className="container">
          <header className="section-head">
            <h2 id="bfaq-title" className="t-h1">คำถามเรื่องการชำระเงิน</h2>
          </header>
          <Faq items={FAQ_BILLING} />
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="ent-title">
        <div className="container cta-band">
          <h2 id="ent-title" className="t-h1">องค์กรหลายสาขา?</h2>
          <p className="t-lead">แผน Enterprise ออกแบบตามจำนวนสาขาและผู้ใช้งาน เชื่อมต่อระบบ HR / LMS มีที่ปรึกษาเฉพาะองค์กรและ SLA การตอบสนอง</p>
          <div className="cta-row">
            <Link className="btn" to="/contact/">ขอใบเสนอราคา</Link>{' '}
            <a className="more" href={`tel:${COMPANY.phoneE164}`}>โทร {COMPANY.phone}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
